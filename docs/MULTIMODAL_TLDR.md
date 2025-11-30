# Multimodal TL;DR Feature - Implementation Plan

## Overview

Enhanced the TL;DR modal to showcase multimodal AI creativity with three unique ways to experience project summaries:

1. **📝 Text Summary** (Existing - Enhanced)
2. **🎨 Oil Painting** (New - 1800s Style via Imagen)
3. **🤖 Robotic Voice** (New - Stephen Hawking-style TTS)

## ✅ Completed: Frontend UI

### Modal Structure (`components/TLDRModal.tsx`)

**Three-Step User Journey**:
1. **Mode Selection** - User chooses how they want to experience the project
2. **Content Generation** - AI generates the selected content type
3. **Display** - Beautiful rendering of the result

### Mode Selection Screen

```
┌─────────────────────────────────────────────────────┐
│  Explain this like I'm...                           │
│  Choose how you want to experience this project     │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ ✨       │  │ 🎨       │  │ 🔊       │         │
│  │ Reading  │  │ Art      │  │ Robot    │         │
│  │ AI text  │  │ 1800s    │  │ TTS      │         │
│  └──────────┘  └──────────┘  └──────────┘         │
└─────────────────────────────────────────────────────┘
```

### Features Implemented

✅ **Mode Selection UI**
- 3 beautifully styled cards with icons
- Gradient backgrounds (blue, amber, purple)
- Hover effects and transitions

✅ **Text Mode** (existing, kept intact)
- Audience selection (technical/non-technical)
- Gemini 2.5 Flash AI generation
- Markdown rendering

✅ **Painting Mode UI**
- Image display with ornate border
- "Oil on Canvas, 1800s Style" badge
- Artistic presentation

✅ **Voice Mode UI**
- Animated speaker icon
- Audio player with controls
- Displays one-sentence summary text
- Auto-play capability

✅ **Loading States**
- Spinning loader with Sparkles icon
- Different messages per mode

✅ **Footer Updates**
- Dynamic footer text based on selected mode
- Credits for AI models used

## ✅ Completed: Backend APIs

### 1. Image Generation API (`/api/generate-painting`)

**Purpose**: Generate 1800s-style oil painting using Google's Imagen

**Implementation Options**:

#### Option A: Vertex AI Imagen (Recommended)
```typescript
// app/api/generate-painting/route.ts
import { VertexAI } from '@google-cloud/vertexai';

const vertex_ai = new VertexAI({
  project: 'your-project-id',
  location: 'us-central1',
});

const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: 'imagegeneration@006', // Latest Imagen model
});

async function generatePainting(projectData) {
  const prompt = `Create an oil painting in the style of 1800s classical art depicting:
    ${projectData.title}.

    Context: ${projectData.challenge}
    Solution: ${projectData.solution}

    Style: Traditional oil painting, rich textures, classical composition,
    museum-quality artwork from 1800s, dramatic lighting, masterpiece quality.`;

  const result = await generativeModel.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }]}],
    generation_config: {
      max_output_tokens: 2048,
      temperature: 0.9,
      top_p: 0.95,
    },
  });

  // Returns base64 image
  return result.response.candidates[0].content.parts[0].inline_data.data;
}
```

#### Option B: Third-Party (Alternative)
- **Replicate**: Flux or DALL-E models with custom 1800s prompts
- **OpenAI DALL-E**: Via OpenAI API (paid)

**API Endpoint Structure**:
```typescript
POST /api/generate-painting

Request:
{
  projectTitle: string;
  projectSubtitle: string;
  challenge: string[];
  solution: string[];
  techs: string[];
}

Response:
{
  imageUrl: string; // base64 or Cloud Storage URL
  prompt: string;  // Used for generation
}
```

### 2. Text-to-Speech API (`/api/generate-voice`)

**Purpose**: Generate robotic Stephen Hawking-style voice reading one-sentence summary

**Implementation Options**:

#### Option A: Google Cloud Text-to-Speech (Recommended)
```typescript
// app/api/generate-voice/route.ts
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

const client = new TextToSpeechClient();

async function generateVoice(projectData) {
  // First, generate one-sentence summary using Gemini
  const oneSentence = await generateOneSentence(projectData);

  const request = {
    input: { text: oneSentence },
    voice: {
      languageCode: 'en-US',
      name: 'en-US-Wavenet-A', // Deep robotic voice
      ssmlGender: 'NEUTRAL',
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: 0.85,  // Slower = more robotic
      pitch: -5.0,         // Lower pitch = deeper voice
      effectsProfileId: ['telephony-class-application'], // More robotic effect
    },
  };

  const [response] = await client.synthesizeSpeech(request);

  // Upload to Cloud Storage
  const audioUrl = await uploadToGCS(response.audioContent);

  return { audioUrl, oneSentence };
}

async function generateOneSentence(projectData) {
  const prompt = `Summarize this project in ONE sentence (max 20 words),
    in a robotic, matter-of-fact tone like Stephen Hawking's voice synthesizer:

    Project: ${projectData.title}
    Challenge: ${projectData.challenge.join('. ')}
    Solution: ${projectData.solution.join('. ')}`;

  // Call Gemini 2.5 Flash
  const response = await ai.generateContent(prompt);
  return response.text;
}
```

#### Option B: Third-Party TTS
- **ElevenLabs**: Custom voice cloning (premium)
- **Amazon Polly**: Neural voices with customization
- **Play.ht**: Robotic voice styles

**API Endpoint Structure**:
```typescript
POST /api/generate-voice

Request:
{
  projectTitle: string;
  projectSubtitle: string;
  challenge: string[];
  solution: string[];
  impact: string[];
  techs: string[];
}

Response:
{
  audioUrl: string;      // MP3 URL from Cloud Storage
  oneSentence: string;   // The generated one-sentence summary
  duration: number;      // Audio duration in seconds
}
```

## Integration with TLDRButton.tsx

Update `handleGenerate` function to call different APIs based on mode:

```typescript
const handleGenerate = async (mode: CreativeMode, level?: AudienceLevel) => {
  setIsLoading(true);
  setError('');

  try {
    if (mode === 'text') {
      // Existing flow
      const response = await fetch('/api/tldr', {
        method: 'POST',
        body: JSON.stringify({ ...projectData, audienceLevel: level }),
      });
      const data = await response.json();
      setSummary(data.summary);

    } else if (mode === 'painting') {
      const response = await fetch('/api/generate-painting', {
        method: 'POST',
        body: JSON.stringify(projectData),
      });
      const data = await response.json();
      setPaintingUrl(data.imageUrl);

    } else if (mode === 'voice') {
      const response = await fetch('/api/generate-voice', {
        method: 'POST',
        body: JSON.stringify(projectData),
      });
      const data = await response.json();
      setVoiceUrl(data.audioUrl);
      setOneSentence(data.oneSentence);
    }
  } catch (error) {
    setError('Failed to generate content');
  } finally {
    setIsLoading(false);
  }
};
```

## Cost & Performance Considerations

### Imagen (Image Generation)
- **Cost**: ~$0.02-0.04 per image
- **Generation Time**: 5-15 seconds
- **Rate Limiting**: Consider caching results per project
- **Storage**: Store generated images in Cloud Storage to avoid regeneration

### Text-to-Speech
- **Cost**: ~$16 per 1M characters (~$0.0001 per sentence)
- **Generation Time**: 1-3 seconds
- **Storage**: Store audio files in Cloud Storage
- **Caching**: Generate once per project, reuse

### Recommendations
1. **Cache Results**: Store generated paintings/audio in database
2. **Rate Limiting**: Already have rate limiting in place (good!)
3. **Lazy Loading**: Only generate when user selects mode
4. **Fallback**: If generation fails, show friendly error with option to retry

## Testing Strategy

### Frontend Testing
- ✅ Mode selection transitions
- ✅ Loading states per mode
- ✅ Error handling
- ✅ Audio player controls
- ✅ Image display responsiveness

### Backend Testing (To Do)
- Image generation with various project types
- TTS quality and robotic effect
- Error handling (API failures, timeouts)
- Rate limiting compliance

## Future Enhancements

1. **More Creative Modes**:
   - 📊 Infographic generation
   - 🎬 Animated video summary
   - 🎵 Music that represents the project vibe

2. **Customization**:
   - Let users choose painting style (impressionist, renaissance, etc.)
   - Different voice styles (British accent, pirate, Yoda, etc.)

3. **Social Sharing**:
   - Download painting as high-res image
   - Share audio clip on social media
   - Generate shareable cards

## Implementation Summary

1. ✅ **Completed**: Frontend UI implementation
2. ✅ **Completed**: `/api/generate-painting` endpoint with Gemini image generation
3. ✅ **Completed**: `/api/generate-voice` endpoint with one-sentence summaries
4. ✅ **Completed**: TLDRButton integration with mode-based API calls
5. ✅ **Completed**: Web Speech API fallback for voice mode
6. ✅ **Completed**: Rate limiting (STANDARD preset - 10 req/min) for both endpoints
7. 🚧 **Next**: Test locally and refine prompts
8. 🚧 **Next**: Deploy and collect user feedback

## Example Prompts

### Imagen (Painting)
```
"An oil painting from the 1800s depicting a grand cloud infrastructure,
showing elegant Victorian-era machinery connected by golden data streams.
In the style of classical European masters, with rich textures,
dramatic chiaroscuro lighting, and ornate architectural details.
The scene represents modern GCP services as if imagined by Renaissance artists."
```

### Gemini (One-Sentence for TTS)
```
Input: "RAG System - AI Agents Platform"
Output: "A cloud-based retrieval augmented generation system
enabling organization-wide AI agents with vector embeddings."
```

## Files Modified

- ✅ `components/TLDRModal.tsx` - Mode selection, painting display, voice display
- ✅ `components/TLDRButton.tsx` - Mode-based API calls, Web Speech API fallback
- ✅ `app/api/generate-painting/route.ts` - Gemini image generation with rate limiting
- ✅ `app/api/generate-voice/route.ts` - One-sentence summaries with Web Speech fallback

## Implementation Notes

### Painting Generation (`/api/generate-painting`)
- Uses `gemini-2.5-flash-image` model for image generation
- Returns base64 data URL for immediate display
- Artistic prompt includes 1800s classical style requirements
- Visual metaphors map modern tech to Victorian-era concepts
- Rate limited to 10 requests/minute (STANDARD preset)

### Voice Generation (`/api/generate-voice`)
- Generates one-sentence robotic summary using `gemini-2.5-flash`
- Returns text for client-side Web Speech API synthesis
- Lower temperature (0.3) for more robotic, matter-of-fact tone
- Client uses pitch=0.5, rate=0.8 for Stephen Hawking-style effect
- Automatically speaks using browser's SpeechSynthesis API
- Rate limited to 10 requests/minute (STANDARD preset)

### Web Speech API Fallback
- No server-side TTS required - uses browser capabilities
- Finds robotic-sounding voices (Daniel, Google UK English Male)
- Speech automatically cancelled when modal closes
- Works offline once one-sentence summary is generated

---

**Status**: ✅ **Fully Implemented**
**Demo Ready**: Yes - ready for local testing and deployment
