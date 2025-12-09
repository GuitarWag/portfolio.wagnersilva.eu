# Video Optimization: Local Processing Script

## Overview
Manual video transcoding workflow using local tools (FFmpeg) to create multiple resolutions, then upload to GCP Storage.

---

## Prerequisites

### Install FFmpeg
```bash
# macOS
brew install ffmpeg

# Verify installation
ffmpeg -version
```

---

## Local Transcoding Script

### `scripts/transcode-video.sh`

```bash
#!/bin/bash

# Video Transcoding Script
# Usage: ./transcode-video.sh input.mp4 output-folder

set -e

INPUT_FILE="$1"
OUTPUT_DIR="$2"

if [ -z "$INPUT_FILE" ] || [ -z "$OUTPUT_DIR" ]; then
    echo "Usage: ./transcode-video.sh <input-file> <output-folder>"
    exit 1
fi

if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: Input file not found: $INPUT_FILE"
    exit 1
fi

mkdir -p "$OUTPUT_DIR"

echo "🎬 Starting transcoding for: $INPUT_FILE"
echo "📁 Output directory: $OUTPUT_DIR"
echo "ℹ️  Source: 720p (1280x720)"

# Get video filename without extension
BASENAME=$(basename "$INPUT_FILE" | sed 's/\.[^.]*$//')

# Encoding settings
# H.264 codec, AAC audio, 30fps, 2-second keyframes

echo ""
echo "⏳ Upscaling to 1080p (1920x1080, 5 Mbps)..."
echo "   Note: Upscaling from 720p - quality limited by source"
ffmpeg -i "$INPUT_FILE" \
    -vf "scale=1920:1080:force_original_aspect_ratio=decrease:flags=lanczos,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
    -c:v libx264 -preset slow -crf 20 -b:v 5M -maxrate 5M -bufsize 10M \
    -c:a aac -b:a 192k -ar 48000 \
    -r 30 -g 60 -keyint_min 60 -sc_threshold 0 \
    -pix_fmt yuv420p -movflags +faststart \
    -y "$OUTPUT_DIR/${BASENAME}_1080p.mp4"

echo ""
echo "⏳ Optimizing 720p (1280x720, 2.5 Mbps)..."
echo "   Re-encoding source for better compression"
ffmpeg -i "$INPUT_FILE" \
    -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" \
    -c:v libx264 -preset slow -crf 20 -b:v 2500k -maxrate 2500k -bufsize 5M \
    -c:a aac -b:a 128k -ar 48000 \
    -r 30 -g 60 -keyint_min 60 -sc_threshold 0 \
    -pix_fmt yuv420p -movflags +faststart \
    -y "$OUTPUT_DIR/${BASENAME}_720p.mp4"

echo ""
echo "⏳ Downscaling to 480p (854x480, 1 Mbps)..."
ffmpeg -i "$INPUT_FILE" \
    -vf "scale=854:480:force_original_aspect_ratio=decrease,pad=854:480:(ow-iw)/2:(oh-ih)/2" \
    -c:v libx264 -preset slow -crf 23 -b:v 1M -maxrate 1M -bufsize 2M \
    -c:a aac -b:a 96k -ar 48000 \
    -r 30 -g 60 -keyint_min 60 -sc_threshold 0 \
    -pix_fmt yuv420p -movflags +faststart \
    -y "$OUTPUT_DIR/${BASENAME}_480p.mp4"

echo ""
echo "✅ Transcoding complete!"
echo ""
echo "📊 Output files:"
ls -lh "$OUTPUT_DIR"

echo ""
echo "💡 Next step: Upload to GCP Storage"
echo "   gsutil -m cp -r $OUTPUT_DIR gs://your-bucket/videos/"
```

---

## Upload Script

### `scripts/upload-video.sh`

```bash
#!/bin/bash

# Upload transcoded videos to GCP Storage
# Usage: ./upload-video.sh output-folder project-name

set -e

OUTPUT_DIR="$1"
PROJECT_NAME="$2"
BUCKET="gs://wagnersilva-eu-videos"  # Update with your bucket name

if [ -z "$OUTPUT_DIR" ] || [ -z "$PROJECT_NAME" ]; then
    echo "Usage: ./upload-video.sh <output-folder> <project-name>"
    echo "Example: ./upload-video.sh ./output/my-video my-project"
    exit 1
fi

if [ ! -d "$OUTPUT_DIR" ]; then
    echo "Error: Output directory not found: $OUTPUT_DIR"
    exit 1
fi

echo "📤 Uploading videos to GCP Storage..."
echo "📁 Source: $OUTPUT_DIR"
echo "🪣 Destination: $BUCKET/videos/$PROJECT_NAME/"

# Upload all files
gsutil -m cp -r "$OUTPUT_DIR"/* "$BUCKET/videos/$PROJECT_NAME/"

# Set cache headers
echo ""
echo "⚙️  Setting cache headers..."
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" \
    "$BUCKET/videos/$PROJECT_NAME/*.mp4"

# Make files publicly readable (if needed)
echo ""
echo "🔓 Setting public access..."
gsutil -m acl ch -u AllUsers:R "$BUCKET/videos/$PROJECT_NAME/*.mp4"

echo ""
echo "✅ Upload complete!"
echo ""
echo "🔗 URLs:"
for file in "$OUTPUT_DIR"/*.mp4; do
    filename=$(basename "$file")
    echo "   https://storage.googleapis.com/wagnersilva-eu-videos/videos/$PROJECT_NAME/$filename"
done
```

---

## Complete Workflow Script

### `scripts/process-and-upload.sh`

```bash
#!/bin/bash

# Complete workflow: Transcode + Upload
# Usage: ./process-and-upload.sh input.mp4 project-name

set -e

INPUT_FILE="$1"
PROJECT_NAME="$2"

if [ -z "$INPUT_FILE" ] || [ -z "$PROJECT_NAME" ]; then
    echo "Usage: ./process-and-upload.sh <input-file> <project-name>"
    echo "Example: ./process-and-upload.sh my-video.mp4 page-builder"
    exit 1
fi

# Create temp output directory
OUTPUT_DIR="./temp-output/$PROJECT_NAME"

echo "🚀 Starting video processing workflow..."
echo ""

# Step 1: Transcode
./scripts/transcode-video.sh "$INPUT_FILE" "$OUTPUT_DIR"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 2: Upload
./scripts/upload-video.sh "$OUTPUT_DIR" "$PROJECT_NAME"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 3: Cleanup (optional)
read -p "🗑️  Delete local files? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf "$OUTPUT_DIR"
    echo "✅ Cleaned up local files"
else
    echo "📁 Local files kept at: $OUTPUT_DIR"
fi

echo ""
echo "🎉 All done!"
```

---

## Usage Examples

### 1. Process a single video
```bash
# Make scripts executable
chmod +x scripts/*.sh

# Process and upload
./scripts/process-and-upload.sh ~/Videos/demo.mp4 page-builder-demo
```

### 2. Just transcode (no upload)
```bash
./scripts/transcode-video.sh ~/Videos/demo.mp4 ./output/demo
```

### 3. Just upload existing files
```bash
./scripts/upload-video.sh ./output/demo page-builder-demo
```

---

## Frontend Integration

### Update your video URLs to use multiple resolutions

```tsx
// Before
<video src="https://storage.googleapis.com/bucket/video.mp4" />

// After (with quality selection)
<video controls>
    <source 
        src="https://storage.googleapis.com/bucket/videos/project/video_1080p.mp4" 
        type="video/mp4" 
        media="(min-width: 1920px)" 
    />
    <source 
        src="https://storage.googleapis.com/bucket/videos/project/video_720p.mp4" 
        type="video/mp4" 
        media="(min-width: 1280px)" 
    />
    <source 
        src="https://storage.googleapis.com/bucket/videos/project/video_480p.mp4" 
        type="video/mp4" 
    />
</video>
```

### Or use a simple quality selector component

```tsx
// components/VideoPlayer.tsx
import { useState } from 'react';

interface VideoPlayerProps {
    baseUrl: string; // e.g., "https://storage.../videos/project/video"
    poster?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ baseUrl, poster }) => {
    const [quality, setQuality] = useState<'1080p' | '720p' | '480p'>('720p');

    return (
        <div>
            <video 
                key={quality} 
                controls 
                poster={poster}
                className="w-full"
            >
                <source src={`${baseUrl}_${quality}.mp4`} type="video/mp4" />
            </video>
            
            <div className="mt-2 flex gap-2">
                <button onClick={() => setQuality('1080p')}>1080p</button>
                <button onClick={() => setQuality('720p')}>720p</button>
                <button onClick={() => setQuality('480p')}>480p</button>
            </div>
        </div>
    );
};
```

---

## Encoding Settings Explained

### Video Settings
- **`-c:v libx264`**: H.264 codec (universal compatibility)
- **`-preset slow`**: Better compression (slower encoding)
- **`-crf 23`**: Constant quality (18-28 range, 23 is good balance)
- **`-b:v 5M`**: Target bitrate
- **`-maxrate 5M -bufsize 10M`**: Rate control for consistent quality
- **`-g 60`**: Keyframe every 2 seconds (30fps × 2)
- **`-movflags +faststart`**: Enable progressive download

### Audio Settings
- **`-c:a aac`**: AAC codec (universal)
- **`-b:a 192k`**: Audio bitrate (128k for 720p/480p)
- **`-ar 48000`**: Sample rate (48kHz)

---

## File Size Estimates

For a 1-minute video (from 720p source):
- **1080p** (upscaled): ~40 MB
- **720p** (re-encoded): ~20 MB
- **480p** (downscaled): ~8 MB

**Total**: ~68 MB per minute (all 3 resolutions)

**Note**: The 1080p version is upscaled from 720p, so it won't have true 1080p quality but will look better on large screens than serving 720p directly.

---

## Tips & Best Practices

1. **Source Quality**: Start with highest quality source (1080p or 4K)
2. **Batch Processing**: Process multiple videos at once
3. **Naming Convention**: Use consistent naming (projectname_resolution.mp4)
4. **Storage Organization**: 
   ```
   gs://bucket/videos/
   ├── page-builder/
   │   ├── demo_1080p.mp4
   │   ├── demo_720p.mp4
   │   └── demo_480p.mp4
   ├── rag-system/
   └── ...
   ```
5. **Test Playback**: Always test on different devices/connections

---

## Quick Reference

```bash
# Setup (one time)
brew install ffmpeg
chmod +x scripts/*.sh

# Process new video
./scripts/process-and-upload.sh ~/Videos/my-video.mp4 project-name

# Done! Videos are now on GCP Storage with 3 quality levels
```

---

## Next Steps (Optional Improvements)

1. **Add thumbnail generation**: Extract poster frame with FFmpeg
2. **Add progress bars**: Use `pv` for encoding progress
3. **Parallel encoding**: Encode all resolutions simultaneously
4. **Quality validation**: Auto-check output file integrity

Let me know if you want any of these enhancements!
