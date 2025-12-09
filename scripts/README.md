# Video Processing Scripts

This directory contains scripts for optimizing and uploading videos to GCP Storage.

## Scripts

### `transcode-video.sh`
Transcodes a video to multiple resolutions (1080p, 720p, 480p) using FFmpeg.

**Usage:**
```bash
./scripts/transcode-video.sh input.mp4 output-folder
```

### `upload-video.sh`
Uploads transcoded videos to GCP Storage with proper caching headers.

**Usage:**
```bash
./scripts/upload-video.sh output-folder project-name
```

### `process-and-upload.sh`
Complete workflow: transcode + upload in one command.

**Usage:**
```bash
./scripts/process-and-upload.sh input.mp4 project-name
```

## Quick Start

```bash
# Process and upload a video
./scripts/process-and-upload.sh ~/Videos/demo.mp4 page-builder-demo
```

## Requirements

- FFmpeg installed (`brew install ffmpeg`)
- GCP CLI configured (`gcloud auth login`)
- Access to `wagnersilva-eu-videos` bucket

## Output Structure

Videos are uploaded to:
```
gs://wagnersilva-eu-videos/videos/
├── project-name/
│   ├── video_1080p.mp4
│   ├── video_720p.mp4
│   └── video_480p.mp4
```

Public URLs:
```
https://storage.googleapis.com/wagnersilva-eu-videos/videos/project-name/video_1080p.mp4
https://storage.googleapis.com/wagnersilva-eu-videos/videos/project-name/video_720p.mp4
https://storage.googleapis.com/wagnersilva-eu-videos/videos/project-name/video_480p.mp4
```
