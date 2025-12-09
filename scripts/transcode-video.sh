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
