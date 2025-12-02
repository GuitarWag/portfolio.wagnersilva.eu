/**
 * TTS Model Pre-loader
 * Loads the TTS model into memory during application startup to eliminate first-request delay
 */

import { pipeline } from '@huggingface/transformers';

// Global singleton - shared across all imports in the same Node.js process
let ttsModel: any = null;
let isLoading = false;
let loadError: Error | null = null;
let loadPromise: Promise<void> | null = null;

/**
 * Pre-load TTS model during app startup
 * This runs once when the server starts, not on first request
 */
export async function preloadTTSModel(): Promise<void> {
    // If already loaded, return immediately
    if (ttsModel) {
        console.log('✅ TTS model already loaded');
        return;
    }

    // If currently loading, wait for that to finish
    if (loadPromise) {
        console.log('⏳ Waiting for ongoing TTS model load...');
        return loadPromise;
    }

    // Start loading
    loadPromise = (async () => {
        isLoading = true;
        console.log('🚀 Pre-loading TTS model into memory...');

        try {
            const startTime = Date.now();

            // Set cache directory - files are already there from Docker build
            if (process.env.NODE_ENV === 'production') {
                process.env.TRANSFORMERS_CACHE = '/home/nodejs/.cache/huggingface';
            }

            // Set Hugging Face token if available (improves download speeds and avoids rate limits)
            if (process.env.HUGGING_FACE_HUB_TOKEN) {
                process.env.HF_TOKEN = process.env.HUGGING_FACE_HUB_TOKEN;
            }

            // Load model from cached files into memory
            ttsModel = await pipeline('text-to-speech', 'Xenova/speecht5_tts');

            const loadTime = Date.now() - startTime;
            console.log(`✅ TTS model loaded into memory successfully in ${loadTime}ms`);
            console.log('🎤 Ready for instant voice generation!');

            isLoading = false;
        } catch (error) {
            loadError = error instanceof Error ? error : new Error('Unknown error loading TTS model');
            isLoading = false;
            loadPromise = null;
            console.error('❌ Failed to pre-load TTS model:', error);
            throw error;
        }
    })();

    return loadPromise;
}

/**
 * Get the pre-loaded TTS model
 * If not loaded yet, this will trigger a load (fallback for safety)
 */
export async function getTTSModel(): Promise<any> {
    // If already loaded, return immediately
    if (ttsModel) {
        return ttsModel;
    }

    // If there's a load error from previous attempt, throw it
    if (loadError) {
        throw loadError;
    }

    // If loading in progress, wait for it
    if (loadPromise) {
        await loadPromise;
        if (ttsModel) {
            return ttsModel;
        }
        if (loadError) {
            throw loadError;
        }
    }

    // Fallback: trigger load now if somehow not started yet
    console.warn('⚠️ TTS model not pre-loaded, triggering load now...');
    await preloadTTSModel();

    if (!ttsModel) {
        throw new Error('Failed to load TTS model');
    }

    return ttsModel;
}

/**
 * Check if model is ready
 */
export function isTTSModelReady(): boolean {
    return ttsModel !== null;
}
