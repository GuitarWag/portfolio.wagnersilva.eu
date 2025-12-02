#!/usr/bin/env node
/**
 * Pre-download TTS model for Docker builds
 * This script downloads the Xenova/speecht5_tts model at build time so it's baked into the image
 */

import { pipeline } from '@huggingface/transformers';

console.log('🚀 Pre-loading TTS model (Xenova/speecht5_tts)...');
console.log('This may take a few minutes on first run...\n');

try {
  const ttsModel = await pipeline('text-to-speech', 'Xenova/speecht5_tts');
  console.log('\n✅ TTS model successfully downloaded and cached!');
  console.log('Model is now part of the Docker image.');

  // Test the model with a simple phrase
  console.log('\n🧪 Testing model with sample text...');
  const output = await ttsModel('Hello, this is a test.', {
    speaker_embeddings: 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/speaker_embeddings.bin'
  });
  console.log(`✅ Test successful! Generated ${output.audio.length} audio samples`);

  process.exit(0);
} catch (error) {
  console.error('\n❌ Error pre-loading model:', error);
  process.exit(1);
}
