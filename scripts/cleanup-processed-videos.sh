#!/bin/bash

# Delete incorrectly processed videos (with padding/wrong aspect ratio)
# Run this before re-processing with the fixed script
# Usage: ./cleanup-processed-videos.sh

set -e

DEST_BUCKET="gs://wagnersilva-eu-assets/portfolio-videos-optimized"

echo "🗑️  Cleanup: Deleting incorrectly processed videos"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This will delete all processed videos so they can be re-encoded"
echo "with the correct aspect ratio (preserving portrait orientation)."
echo ""

read -p "⚠️  Are you sure you want to delete all processed videos? (yes/no) " -r
echo
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "❌ Cancelled"
    exit 1
fi

echo "🔍 Finding processed videos..."
FOLDERS=$(gcloud storage ls "$DEST_BUCKET/" | grep "/$")

if [ -z "$FOLDERS" ]; then
    echo "✅ No processed videos found"
    exit 0
fi

FOLDER_COUNT=$(echo "$FOLDERS" | wc -l)
echo "📁 Found $FOLDER_COUNT project folders"
echo ""

CURRENT=0
for FOLDER in $FOLDERS; do
    CURRENT=$((CURRENT + 1))
    FOLDER_NAME=$(basename "$FOLDER")
    
    echo "[$CURRENT/$FOLDER_COUNT] Deleting: $FOLDER_NAME"
    gcloud storage rm -r "$FOLDER" 2>/dev/null || true
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Cleanup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Next steps:"
echo "   1. Run: ./batch-process-videos.sh"
echo "   2. Videos will be re-encoded with correct aspect ratio"
