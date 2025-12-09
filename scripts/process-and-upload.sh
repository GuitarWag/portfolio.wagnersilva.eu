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
