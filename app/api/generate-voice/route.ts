import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { rateLimiter, RateLimitPresets, getClientIdentifier } from '@/lib/rate-limit';
import { pipeline } from '@huggingface/transformers';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY! });

// Initialize TTS pipeline (cached after first load)
// Model will be downloaded to /tmp/.cache on first run
let ttsModel: any = null;
async function getTTSModel() {
    if (!ttsModel) {
        console.log('Loading TTS model (Xenova/speecht5_tts)...');
        // Set cache directory for serverless environments
        if (process.env.NODE_ENV === 'production') {
            process.env.TRANSFORMERS_CACHE = '/tmp/.cache';
        }
        ttsModel = await pipeline('text-to-speech', 'Xenova/speecht5_tts');
        console.log('TTS model loaded successfully');
    }
    return ttsModel;
}

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

        // Generate audio using local TTS model
        let audioUrl: string | undefined;
        try {
            console.log('Starting TTS synthesis...');
            const model = await getTTSModel();
            const output = await model(oneSentence, {
                speaker_embeddings: 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/speaker_embeddings.bin'
            });

            // Convert audio to base64
            const audioData = output.audio;
            const sampleRate = output.sampling_rate;

            console.log('Audio generated:', {
                samples: audioData.length,
                sampleRate,
                duration: `${(audioData.length / sampleRate).toFixed(2)}s`
            });

            // Create WAV file
            const wavBuffer = createWavBuffer(audioData, sampleRate);
            const base64Audio = Buffer.from(wavBuffer).toString('base64');
            audioUrl = `data:audio/wav;base64,${base64Audio}`;

            console.log('Local TTS audio generated successfully');
        } catch (error) {
            console.error('Local TTS error:', error);
            console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
            console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack');
            // Fall back to client-side Web Speech API
            audioUrl = undefined;
        }

        return NextResponse.json(
            {
                oneSentence,
                audioUrl,
                duration: estimateDuration(oneSentence),
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

function createWavBuffer(audioData: Float32Array, sampleRate: number): ArrayBuffer {
    const numChannels = 1;
    const bitsPerSample = 16;
    const bytesPerSample = bitsPerSample / 8;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = audioData.length * bytesPerSample;
    const bufferSize = 44 + dataSize;

    const buffer = new ArrayBuffer(bufferSize);
    const view = new DataView(buffer);

    // RIFF chunk descriptor
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(view, 8, 'WAVE');

    // fmt sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // Sub-chunk size
    view.setUint16(20, 1, true); // Audio format (1 = PCM)
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);

    // data sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    // Write audio data
    let offset = 44;
    for (let i = 0; i < audioData.length; i++) {
        const sample = Math.max(-1, Math.min(1, audioData[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
    }

    return buffer;
}

function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function estimateDuration(text: string): number {
    const words = text.split(/\s+/).length;
    const minutes = words / 127;
    return Math.ceil(minutes * 60);
}
