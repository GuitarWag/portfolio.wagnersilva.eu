# Hugging Face TTS Setup

## Overview

The voice generation feature uses Hugging Face's free inference API for text-to-speech generation. This provides server-side TTS without needing Google Cloud TTS credentials.

## Model Used

**Model**: `facebook/mms-tts-eng` (Massively Multilingual Speech - English TTS)
- Free to use via Hugging Face Inference API
- Natural-sounding English voice
- Fast inference times
- No quota limits for reasonable usage

## Setup Instructions

### 1. Get a Hugging Face API Token

1. Go to https://huggingface.co/
2. Sign up for a free account (or log in)
3. Go to Settings → Access Tokens: https://huggingface.co/settings/tokens
4. Click "New token"
5. Give it a name (e.g., "make-presentations-tts")
6. Select "Read" permission (sufficient for inference)
7. Click "Generate token"
8. Copy the token (starts with `hf_...`)

### 2. Add to Environment Variables

Add the token to your `.env` file:

```bash
HUGGINGFACE_API_KEY=hf_your_token_here
```

### 3. Restart the Development Server

```bash
npm run dev
```

## How It Works

1. **Text Generation**: Gemini 2.5 Flash generates a one-sentence robotic summary
2. **Audio Generation**: Hugging Face TTS converts the text to audio (FLAC format)
3. **Response**: Returns base64-encoded audio as data URL for instant playback
4. **Fallback**: If Hugging Face API is unavailable or API key is missing, falls back to browser's Web Speech API

## Cost & Rate Limits

- **Cost**: FREE (Hugging Face Inference API is free for testing and personal use)
- **Rate Limits**: Reasonable usage limits apply (~1000 requests/day for free tier)
- **Inference Time**: Typically 1-3 seconds for short sentences
- **Audio Format**: FLAC (high quality, browser compatible)

## Alternative Models

You can easily switch to other TTS models by changing the `HF_API_URL` in `/app/api/generate-voice/route.ts`:

**Good alternatives:**
- `microsoft/speecht5_tts` - Natural voice, good quality
- `espnet/kan-bayashi_ljspeech_vits` - High quality, slightly slower
- `suno/bark` - Very natural, but slower (3-10 seconds)

Example:
```typescript
const HF_API_URL = 'https://api-inference.huggingface.co/models/microsoft/speecht5_tts';
```

## Troubleshooting

### Audio Not Playing
- Check browser console for errors
- Verify `HUGGINGFACE_API_KEY` is set in `.env`
- Check server logs for API errors

### Model Loading Error
Hugging Face models may need to "warm up" on first use (30-60 seconds). Retry after a minute if you see:
```
Model is currently loading
```

### Rate Limit Exceeded
If you hit rate limits:
1. Wait a few minutes
2. Consider using browser Web Speech API fallback (automatic)
3. For production, upgrade to Hugging Face Pro ($9/month for unlimited inference)

## Testing

Test the voice generation:
1. Click TL;DR button on any project
2. Select "A robot" mode
3. Wait for audio generation (~2-5 seconds)
4. Audio should auto-play with robotic voice

## Documentation

- Hugging Face Inference API: https://huggingface.co/docs/api-inference/index
- MMS TTS Model: https://huggingface.co/facebook/mms-tts-eng
- Rate Limits: https://huggingface.co/docs/api-inference/rate-limits
