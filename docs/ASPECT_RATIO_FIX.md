# Aspect Ratio Fix - Re-processing Guide

## Issue
Videos were being converted from portrait to landscape with black padding bars. This happened because the FFmpeg commands were forcing specific dimensions (1920x1080, 1280x720, etc.) with padding.

## Fix Applied
Updated `batch-process-videos.sh` to preserve original aspect ratio:

### Before (Incorrect)
```bash
-vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2"
```
This forced landscape dimensions and added black bars.

### After (Correct)
```bash
-vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease"
```
This preserves the original aspect ratio:
- Portrait videos stay portrait
- Landscape videos stay landscape
- No black padding bars

## How to Re-process

### Step 1: Delete Incorrectly Processed Videos
```bash
# In Cloud Shell
./cleanup-processed-videos.sh
```

This will:
- Delete all videos in `portfolio-videos-optimized/`
- Confirm before deleting
- Show progress

### Step 2: Re-run Batch Processing
```bash
./batch-process-videos.sh
```

This will:
- Re-encode all videos with correct aspect ratio
- Preserve portrait orientation
- No padding/black bars

## Expected Results

### Portrait Videos (e.g., 720x1280)
- **1080p**: Max 1080 height, proportional width
- **720p**: Max 720 height, proportional width
- **480p**: Max 480 height, proportional width

### Landscape Videos (e.g., 1280x720)
- **1080p**: Max 1920 width, proportional height
- **720p**: Max 1280 width, proportional height
- **480p**: Max 854 width, proportional height

## Verification

After re-processing, check a video:
```bash
# Download a sample
gcloud storage cp gs://wagnersilva-eu-assets/portfolio-videos-optimized/PROJECT_1/PROJECT_1_720p.mp4 ./

# Check dimensions
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 PROJECT_1_720p.mp4
```

Should show original aspect ratio (e.g., `720x1280` for portrait).

## Time Estimate
- **Cleanup**: ~1 minute
- **Re-processing**: ~60-70 minutes (14 videos)

## Notes
- The skip logic will work correctly (no videos to skip after cleanup)
- All 14 videos will be re-processed
- Quality settings remain the same (only aspect ratio changed)
