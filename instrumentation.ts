/**
 * Next.js instrumentation hook
 * Runs once when the server starts to pre-load the TTS model into memory
 * This eliminates first-request delay
 */

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        console.log('🔧 Server instrumentation running...');

        // Dynamically import to avoid edge runtime issues
        const { preloadTTSModel } = await import('./lib/tts-loader');

        try {
            await preloadTTSModel();
        } catch (error) {
            console.error('⚠️ Failed to pre-load TTS model during startup:', error);
            console.error('Model will be loaded on first request instead.');
        }
    }
}
