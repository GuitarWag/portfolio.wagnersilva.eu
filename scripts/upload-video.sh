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
