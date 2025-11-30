import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { rateLimiter, RateLimitPresets, getClientIdentifier } from '@/lib/rate-limit';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY! });

interface VoiceRequest {
    projectTitle: string;
    projectSubtitle: string;
    challenge: string[];
    solution: string[];
    impact: string[];
    techs: string[];
}

interface VoiceResponse {
    audioUrl?: string;
    oneSentence?: string;
    duration?: number;
    error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<VoiceResponse>> {
    try {
        // Rate limiting check
        const clientId = getClientIdentifier(request);
        const { limit, windowMs } = RateLimitPresets.STANDARD; // 10 requests per minute
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
                    error: 'Too many requests. Please wait before generating another voice summary.',
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

        const body: VoiceRequest = await request.json();

        // Validate required fields
        if (!body.projectTitle || !body.projectSubtitle) {
            return NextResponse.json(
                { error: 'Missing required project information' },
                { status: 400, headers }
            );
        }

        // First, generate one-sentence summary using Gemini
        const oneSentence = await generateOneSentence(body);

        // Server-side TTS disabled due to ONNX Runtime native binding issues on production
        // Falling back to client-side Web Speech API
        const audioUrl = undefined;

        return NextResponse.json(
            {
                oneSentence,
                audioUrl,
            },
            { headers }
        );

    } catch (error) {
        console.error('Voice generation error:', error);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate voice';
        return NextResponse.json(
            { error: `${errorMessage}. Please try again.` },
            { status: 500 }
        );
    }
}

async function generateOneSentence(data: VoiceRequest): Promise<string> {
    try {
        const prompt = buildOneSentencePrompt(data);

        console.log('Generating one-sentence summary with prompt:', prompt.substring(0, 200));

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.3,
                maxOutputTokens: 1024,
            },
        });

        console.log('Gemini response received:', {
            hasText: !!response.text,
            textLength: response.text?.length,
            promptFeedback: response.promptFeedback,
            finishReason: response.candidates?.[0]?.finishReason
        });

        // Check for blocked content
        if (response.promptFeedback?.blockReason) {
            console.error('Content blocked by Gemini:', response.promptFeedback.blockReason);
            throw new Error(`Content blocked: ${response.promptFeedback.blockReason}`);
        }

        const text = response.text?.trim();
        if (!text || text.length === 0) {
            console.error('Gemini returned empty response. Full response:', JSON.stringify(response, null, 2));
            throw new Error('AI generated an empty response');
        }

        // Ensure it's truly one sentence (remove extra sentences if any)
        const firstSentence = text.split(/[.!?]/)[0] + '.';

        return firstSentence;
    } catch (error) {
        console.error('Error in generateOneSentence:', error);
        throw error;
    }
}

function buildOneSentencePrompt(data: VoiceRequest): string {
    const challenge = data.challenge.slice(0, 1).join('. '); // Limit context
    const solution = data.solution.slice(0, 1).join('. ');

    return `Summarize this project in ONE short sentence (maximum 15 words), robotic tone:

Project: ${data.projectTitle}
Challenge: ${challenge}
Solution: ${solution}

Reply with ONLY the one sentence, nothing else.`;
}
