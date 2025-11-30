import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { rateLimiter, RateLimitPresets, getClientIdentifier } from '@/lib/rate-limit';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY! });

interface PaintingRequest {
    projectTitle: string;
    projectSubtitle: string;
    challenge: string[];
    solution: string[];
    techs: string[];
}

interface PaintingResponse {
    imageUrl?: string;
    prompt?: string;
    error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<PaintingResponse>> {
    try {
        // Rate limiting check
        const clientId = getClientIdentifier(request);
        const { limit, windowMs } = RateLimitPresets.STANDARD; // 10 requests per minute (image gen is expensive)
        const rateLimitResult = rateLimiter.check(clientId, limit, windowMs);

        // Add rate limit headers
        const headers = {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetAt).toISOString(),
        };

        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                {
                    error: 'Too many requests. Please wait before generating another painting.',
                },
                {
                    status: 429,
                    headers: {
                        ...headers,
                        'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
                    },
                }
            );
        }

        const body: PaintingRequest = await request.json();

        // Build artistic prompt for 1800s oil painting style
        const prompt = buildPaintingPrompt(body);

        // Generate image using Gemini 2.5 Flash Image model
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: [{
                role: 'user',
                parts: [{ text: prompt }]
            }],
            config: {
                temperature: 0.9,
                maxOutputTokens: 2048,
            },
        });

        // Check for blocked content
        if (response.promptFeedback?.blockReason) {
            console.error('Content blocked:', response.promptFeedback.blockReason);
            return NextResponse.json(
                { error: 'Unable to generate painting. Content was blocked by safety filters.' },
                { status: 400, headers }
            );
        }

        // Extract base64 image if available
        const imageData = response.candidates?.[0]?.content?.parts?.find(
            (part: any) => part.inlineData
        )?.inlineData;

        if (imageData) {
            const imageUrl = `data:${imageData.mimeType};base64,${imageData.data}`;
            return NextResponse.json({ imageUrl, prompt }, { headers });
        }

        // If no image generated, return error
        console.error('No image data in response:', JSON.stringify(response, null, 2));
        return NextResponse.json(
            { error: 'Failed to generate painting. Please try again.' },
            { status: 500, headers }
        );

    } catch (error) {
        console.error('Painting generation error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate painting';
        return NextResponse.json(
            { error: `${errorMessage}. Please try again.` },
            { status: 500 }
        );
    }
}

function buildPaintingPrompt(data: PaintingRequest): string {
    // Synthesize project essence for artistic interpretation
    const challenge = data.challenge.slice(0, 2).join('. '); // Limit context
    const solution = data.solution.slice(0, 2).join('. ');

    return `CRITICAL: DO NOT INCLUDE ANY TEXT, LETTERS, WORDS, NUMBERS, OR WRITTEN LANGUAGE OF ANY KIND IN THIS IMAGE.

Create a portrait-format (9:16 aspect ratio) oil painting in the style of 1800s classical European art that represents this software project:

"${data.projectTitle}" - ${data.projectSubtitle}

Context: ${challenge}
Solution: ${solution}

Style: Traditional oil painting from the 1800s with rich colors, dramatic lighting, and visible brushstrokes. The painting should be artistic and evocative, not literal. Think of how Renaissance or Victorian artists might have imagined modern technology as grand architecture, mechanical marvels, or natural phenomena.

ABSOLUTE REQUIREMENTS (MUST FOLLOW):
1. NO TEXT - Absolutely zero letters, words, numbers, labels, titles, or any written language anywhere in the image
2. NO SIGNS - No street signs, no book titles, no plaques, no inscriptions of any kind
3. Portrait orientation (9:16 aspect ratio, vertical format)
4. The painting must be displayed in an ornate GOLD FRAME with decorative baroque or rococo details
5. The frame should be visible around all edges of the canvas

REMINDER: This is a purely visual artwork with NO TEXT whatsoever. Only imagery, colors, and brushstrokes.

Be creative and varied in the visual interpretation - avoid repeating the same imagery. The painting should capture the essence and ambition of the project in a beautiful, museum-quality artwork with an elegant gold frame.`;
}
