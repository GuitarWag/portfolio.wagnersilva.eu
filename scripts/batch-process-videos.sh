#!/bin/bash

# Batch Video Processing for Cloud Shell
# Processes all videos in GCP Storage bucket
# Usage: ./batch-process-videos.sh

set -e

# Configuration
SOURCE_BUCKET="gs://wagnersilva-eu-assets/portfolio-videos"
DEST_BUCKET="gs://wagnersilva-eu-assets/portfolio-videos-optimized"
TEMP_DIR="./video-processing-temp"

echo "🚀 Batch Video Processing for Cloud Shell"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📦 Source: $SOURCE_BUCKET"
echo "📦 Destination: $DEST_BUCKET"
echo ""

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️  FFmpeg not found. Installing..."
    sudo apt-get update -qq
    sudo apt-get install -y ffmpeg
    echo "✅ FFmpeg installed"
fi

# Create temp directory
mkdir -p "$TEMP_DIR"

# Get list of videos
echo "📋 Fetching video list..."
VIDEO_LIST=$(gcloud storage ls "$SOURCE_BUCKET/*.mp4" | grep -v "/$")

if [ -z "$VIDEO_LIST" ]; then
    echo "❌ No videos found in $SOURCE_BUCKET"
    exit 1
fi

# Count videos
VIDEO_COUNT=$(echo "$VIDEO_LIST" | wc -l)
echo "📹 Found $VIDEO_COUNT videos to process"
echo ""

# Process each video
CURRENT=0
PROCESSED=0
SKIPPED=0

for VIDEO_URL in $VIDEO_LIST; do
    CURRENT=$((CURRENT + 1))
    
    # Extract filename
    FILENAME=$(basename "$VIDEO_URL")
    BASENAME="${FILENAME%.mp4}"
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎬 Processing [$CURRENT/$VIDEO_COUNT]: $FILENAME"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Check if already processed
    echo "🔍 Checking if already processed..."
    ALREADY_EXISTS=true
    
    if ! gcloud storage ls "$DEST_BUCKET/$BASENAME/master.m3u8" &>/dev/null; then
        ALREADY_EXISTS=false
    elif ! gcloud storage ls "$DEST_BUCKET/$BASENAME/1080p/playlist.m3u8" &>/dev/null; then
        ALREADY_EXISTS=false
    elif ! gcloud storage ls "$DEST_BUCKET/$BASENAME/720p/playlist.m3u8" &>/dev/null; then
        ALREADY_EXISTS=false
    elif ! gcloud storage ls "$DEST_BUCKET/$BASENAME/480p/playlist.m3u8" &>/dev/null; then
        ALREADY_EXISTS=false
    fi
    
    if [ "$ALREADY_EXISTS" = true ]; then
        echo "⏭️  Skipping: All resolutions already exist"
        echo "✅ Already completed: $FILENAME"
        echo ""
        SKIPPED=$((SKIPPED + 1))
        continue
    fi
    
    # Create project directory
    PROJECT_DIR="$TEMP_DIR/$BASENAME"
    mkdir -p "$PROJECT_DIR"
    
    # Download video
    echo "⬇️  Downloading..."
    gcloud storage cp "$VIDEO_URL" "$PROJECT_DIR/source.mp4"
    
    # Create quality directories
    mkdir -p "$PROJECT_DIR/1080p" "$PROJECT_DIR/720p" "$PROJECT_DIR/480p"
    
    # Transcode to 1080p HLS
    echo "⏳ Encoding 1080p HLS..."
    ffmpeg -i "$PROJECT_DIR/source.mp4" \
        -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2" \
        -c:v libx264 -preset medium -crf 20 -b:v 5M -maxrate 5M -bufsize 10M \
        -c:a aac -b:a 192k -ar 48000 \
        -r 30 -g 60 -keyint_min 60 -sc_threshold 0 \
        -pix_fmt yuv420p \
        -f hls -hls_time 6 -hls_playlist_type vod -hls_flags independent_segments \
        -hls_segment_filename "$PROJECT_DIR/1080p/segment_%03d.ts" \
        "$PROJECT_DIR/1080p/playlist.m3u8" \
        -loglevel error -stats
    
    # Transcode to 720p HLS
    echo "⏳ Encoding 720p HLS..."
    ffmpeg -i "$PROJECT_DIR/source.mp4" \
        -vf "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2" \
        -c:v libx264 -preset medium -crf 20 -b:v 2500k -maxrate 2500k -bufsize 5M \
        -c:a aac -b:a 128k -ar 48000 \
        -r 30 -g 60 -keyint_min 60 -sc_threshold 0 \
        -pix_fmt yuv420p \
        -f hls -hls_time 6 -hls_playlist_type vod -hls_flags independent_segments \
        -hls_segment_filename "$PROJECT_DIR/720p/segment_%03d.ts" \
        "$PROJECT_DIR/720p/playlist.m3u8" \
        -loglevel error -stats
    
    # Transcode to 480p HLS
    echo "⏳ Encoding 480p HLS..."
    ffmpeg -i "$PROJECT_DIR/source.mp4" \
        -vf "scale='min(854,iw)':'min(480,ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2" \
        -c:v libx264 -preset medium -crf 23 -b:v 1M -maxrate 1M -bufsize 2M \
        -c:a aac -b:a 96k -ar 48000 \
        -r 30 -g 60 -keyint_min 60 -sc_threshold 0 \
        -pix_fmt yuv420p \
        -f hls -hls_time 6 -hls_playlist_type vod -hls_flags independent_segments \
        -hls_segment_filename "$PROJECT_DIR/480p/segment_%03d.ts" \
        "$PROJECT_DIR/480p/playlist.m3u8" \
        -loglevel error -stats
    
    # Create master playlist
    echo "📝 Creating master playlist..."
    cat > "$PROJECT_DIR/master.m3u8" << 'EOF'
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080
1080p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720
720p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1000000,RESOLUTION=854x480
480p/playlist.m3u8
EOF
    
    # Upload to destination
    echo "⬆️  Uploading to GCP Storage..."
    gcloud storage cp -r "$PROJECT_DIR/1080p" "$DEST_BUCKET/$BASENAME/"
    gcloud storage cp -r "$PROJECT_DIR/720p" "$DEST_BUCKET/$BASENAME/"
    gcloud storage cp -r "$PROJECT_DIR/480p" "$DEST_BUCKET/$BASENAME/"
    gcloud storage cp "$PROJECT_DIR/master.m3u8" "$DEST_BUCKET/$BASENAME/"
    
    # Set cache headers for playlists (shorter cache)
    echo "⚙️  Setting cache headers..."
    gcloud storage objects update "$DEST_BUCKET/$BASENAME/master.m3u8" \
        --cache-control="public, max-age=3600"
    gcloud storage objects update "$DEST_BUCKET/$BASENAME/1080p/playlist.m3u8" \
        --cache-control="public, max-age=3600"
    gcloud storage objects update "$DEST_BUCKET/$BASENAME/720p/playlist.m3u8" \
        --cache-control="public, max-age=3600"
    gcloud storage objects update "$DEST_BUCKET/$BASENAME/480p/playlist.m3u8" \
        --cache-control="public, max-age=3600"
    
    # Set cache headers for segments (long cache)
    echo "⚙️  Setting cache headers for segments..."
    gcloud storage objects update "$DEST_BUCKET/$BASENAME/1080p/*.ts" \
        --cache-control="public, max-age=31536000" 2>/dev/null || true
    gcloud storage objects update "$DEST_BUCKET/$BASENAME/720p/*.ts" \
        --cache-control="public, max-age=31536000" 2>/dev/null || true
    gcloud storage objects update "$DEST_BUCKET/$BASENAME/480p/*.ts" \
        --cache-control="public, max-age=31536000" 2>/dev/null || true
    
    # Note: Bucket uses uniform bucket-level access
    # Public access is controlled at bucket level via IAM
    
    # Cleanup local files
    echo "🗑️  Cleaning up..."
    rm -rf "$PROJECT_DIR"
    
    echo "✅ Completed: $FILENAME"
    echo ""
    PROCESSED=$((PROCESSED + 1))
done

# Final cleanup
rm -rf "$TEMP_DIR"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Batch processing complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Summary:"
echo "   Total videos: $VIDEO_COUNT"
echo "   Processed: $PROCESSED"
echo "   Skipped (already done): $SKIPPED"
echo "   Format: HLS (m3u8 + segments)"
echo "   Resolutions: 1080p, 720p, 480p"
echo "   Location: $DEST_BUCKET"
echo ""
echo "🔗 Access pattern:"
echo "   https://storage.googleapis.com/wagnersilva-eu-assets/portfolio-videos-optimized/PROJECT_NAME/master.m3u8"
