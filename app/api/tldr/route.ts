import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { buildSystemPrompt } from '@/lib/ai/system-prompt';
import type { TLDRRequest, TLDRResponse } from '@/lib/ai/types';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY! });

async function generateWithRetry(userPrompt: string, systemPrompt: string, retries = 2): Promise<string> {
    for (let attempt = 0; attempt <= retries; attempt++) {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userPrompt,
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.7,
                maxOutputTokens: 2048,
            },
        });

        // Check for blocked content
        if (response.promptFeedback?.blockReason) {
            console.error('Content blocked:', response.promptFeedback.blockReason);
            throw new Error(`Content blocked: ${response.promptFeedback.blockReason}`);
        }

        // Check finish reason
        const finishReason = response.candidates?.[0]?.finishReason;
        if (finishReason && finishReason !== 'STOP' && finishReason !== 'MAX_TOKENS') {
            console.error('Unexpected finish reason:', finishReason);
            if (attempt < retries) {
                console.log(`Retrying... attempt ${attempt + 2}/${retries + 1}`);
                continue;
            }
        }

        // Extract text
        const text = response.text;
        if (text && text.trim().length > 0) {
            return text;
        }

        console.error(`Empty response on attempt ${attempt + 1}:`, JSON.stringify({
            candidates: response.candidates,
            promptFeedback: response.promptFeedback,
            usageMetadata: response.usageMetadata
        }, null, 2));

        if (attempt < retries) {
            console.log(`Retrying... attempt ${attempt + 2}/${retries + 1}`);
        }
    }

    throw new Error('AI generated an empty response after multiple attempts');
}

export async function POST(request: NextRequest): Promise<NextResponse<TLDRResponse>> {
    try {
        const body: TLDRRequest = await request.json();

        const userPrompt = buildUserPrompt(body);
        const systemPrompt = buildSystemPrompt(body.audienceLevel);

        const summary = await generateWithRetry(userPrompt, systemPrompt);

        return NextResponse.json({ summary });
    } catch (error) {
        console.error('TL;DR generation error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate TL;DR';
        return NextResponse.json(
            { summary: '', error: `${errorMessage}. Please try again.` },
            { status: 500 }
        );
    }
}

function buildUserPrompt(data: TLDRRequest): string {
    const sections: string[] = [
        `## Project: ${data.projectTitle}`,
        `**Subtitle:** ${data.projectSubtitle}`,
    ];

    if (data.context && data.context.length > 0) {
        sections.push(`\n**Context:**\n${data.context.map(c => `- ${c}`).join('\n')}`);
    }

    if (data.challenge.length > 0) {
        sections.push(`\n**Challenge:**\n${data.challenge.map(c => `- ${c}`).join('\n')}`);
    }

    if (data.solution.length > 0) {
        sections.push(`\n**Solution:**\n${data.solution.map(s => `- ${s}`).join('\n')}`);
    }

    if (data.impact.length > 0) {
        sections.push(`\n**Impact:**\n${data.impact.map(i => `- ${i}`).join('\n')}`);
    }

    if (data.techs.length > 0) {
        sections.push(`\n**Technologies Used:** ${data.techs.join(', ')}`);
    }

    if (data.videoTranscript && data.videoTranscript.trim().length > 0) {
        sections.push(`\n**Wagner's Video Explanation:**\n"${data.videoTranscript}"`);
    }

    sections.push('\n---\nGenerate a compelling TL;DR summary for this project.');

    return sections.join('\n');
}
