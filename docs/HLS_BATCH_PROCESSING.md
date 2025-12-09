# HLS Batch Processing - Ready to Use

## Script Updated ✅

The `batch-process-videos.sh` script now generates HLS instead of MP4s.

## Output Structure

```
portfolio-videos-optimized/
└── PROJECT_1/
    ├── master.m3u8              # Main playlist
    ├── 1080p/
    │   ├── playlist.m3u8
    │   └── segment_*.ts
    ├── 720p/
    │   ├── playlist.m3u8
    │   └── segment_*.ts
    └── 480p/
        ├── playlist.m3u8
        └── segment_*.ts
```

## What's Different

| Feature | MP4 | HLS |
|---------|-----|-----|
| Files per video | 3 | ~50-100 |
| Format | Single files | Segments + playlists |
| Streaming | Progressive | Adaptive |
| Quality switching | Manual | Automatic |
| Startup time | Slower | Faster |

## Cache Strategy

- **Playlists** (`.m3u8`): 1 hour
- **Segments** (`.ts`): 1 year

## Next Steps

1. ✅ Script is ready
2. 🔄 Run in Cloud Shell
3. 📝 Update frontend (add HLS.js)

## Access URL

```
https://storage.googleapis.com/wagnersilva-eu-assets/portfolio-videos-optimized/PROJECT_NAME/master.m3u8
```
