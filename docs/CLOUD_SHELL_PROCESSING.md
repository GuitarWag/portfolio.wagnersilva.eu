# Cloud Shell Video Processing Guide

## Quick Start

### 1. Upload Script to Cloud Shell

```bash
# In Cloud Shell, create the script
nano batch-process-videos.sh

# Paste the script content, then save (Ctrl+X, Y, Enter)

# Make executable
chmod +x batch-process-videos.sh
```

### 2. Run the Batch Processing

```bash
./batch-process-videos.sh
```

**What it does:**
- ✅ Auto-installs FFmpeg if needed
- ✅ Downloads each video from source bucket
- ✅ Transcodes to 1080p, 720p, 480p
- ✅ Uploads to `gs://wagnersilva-eu-assets/portfolio-videos-optimized/`
- ✅ Sets cache headers (1 year)
- ✅ Makes files publicly accessible
- ✅ Cleans up temp files

---

## Configuration

Edit these variables in the script if needed:

```bash
SOURCE_BUCKET="gs://wagnersilva-eu-assets/portfolio-videos"
DEST_BUCKET="gs://wagnersilva-eu-assets/portfolio-videos-optimized"
```

---

## Output Structure

Videos will be organized as:

```
gs://wagnersilva-eu-assets/portfolio-videos-optimized/
├── PROJECT_1/
│   ├── PROJECT_1_1080p.mp4
│   ├── PROJECT_1_720p.mp4
│   └── PROJECT_1_480p.mp4
├── PROJECT_2/
│   ├── PROJECT_2_1080p.mp4
│   ├── PROJECT_2_720p.mp4
│   └── PROJECT_2_480p.mp4
└── ...
```

---

## Public URLs

Access videos via:

```
https://storage.googleapis.com/wagnersilva-eu-assets/portfolio-videos-optimized/PROJECT_1/PROJECT_1_1080p.mp4
https://storage.googleapis.com/wagnersilva-eu-assets/portfolio-videos-optimized/PROJECT_1/PROJECT_1_720p.mp4
https://storage.googleapis.com/wagnersilva-eu-assets/portfolio-videos-optimized/PROJECT_1/PROJECT_1_480p.mp4
```

---

## Processing Time Estimate

For 14 videos (~1-2 min each):
- **Download**: ~1 min per video
- **Encoding**: ~2-3 min per video (all resolutions)
- **Upload**: ~1 min per video

**Total**: ~60-70 minutes for all videos

---

## Monitoring Progress

The script shows:
- Current video being processed (X/14)
- Encoding progress for each resolution
- Upload status
- Completion confirmation

---

## After Processing

### Update Portfolio Code

Replace video URLs in your portfolio data:

```typescript
// Before
video: "https://storage.googleapis.com/.../PROJECT_1.mp4"

// After (with quality selection)
videos: {
  "1080p": "https://storage.googleapis.com/.../portfolio-videos-optimized/PROJECT_1/PROJECT_1_1080p.mp4",
  "720p": "https://storage.googleapis.com/.../portfolio-videos-optimized/PROJECT_1/PROJECT_1_720p.mp4",
  "480p": "https://storage.googleapis.com/.../portfolio-videos-optimized/PROJECT_1/PROJECT_1_480p.mp4"
}
```

---

## Troubleshooting

### FFmpeg Not Found
The script auto-installs FFmpeg. If it fails:
```bash
sudo apt-get update
sudo apt-get install -y ffmpeg
```

### Permission Errors
Ensure you're authenticated:
```bash
gcloud auth login
```

### Out of Disk Space
Cloud Shell has 5GB home directory. The script processes one video at a time and cleans up after each to avoid space issues.

---

## Alternative: Process Single Video

If you want to test with one video first:

```bash
# Download one video
gcloud storage cp gs://wagnersilva-eu-assets/portfolio-videos/PROJECT_1.mp4 ./

# Process it
ffmpeg -i PROJECT_1.mp4 \
    -vf "scale=1920:1080:force_original_aspect_ratio=decrease:flags=lanczos" \
    -c:v libx264 -preset medium -crf 20 -b:v 5M \
    -c:a aac -b:a 192k \
    -movflags +faststart \
    PROJECT_1_1080p.mp4

# Upload
gcloud storage cp PROJECT_1_1080p.mp4 gs://wagnersilva-eu-assets/portfolio-videos-optimized/PROJECT_1/
```

---

## Cost Estimate

- **Storage**: ~3x current size (3 resolutions)
- **Egress**: Free (within GCP)
- **Processing**: Free (Cloud Shell)

**Estimated additional storage**: ~500MB - 1GB total
**Monthly cost**: ~$0.02 - $0.03
