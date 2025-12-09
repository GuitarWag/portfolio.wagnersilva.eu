# Making Bucket Publicly Accessible

Since your bucket uses **uniform bucket-level access**, you need to set public access at the bucket level, not per-object.

## One-Time Setup (Run in Cloud Shell)

```bash
# Make the destination bucket publicly readable
gcloud storage buckets add-iam-policy-binding gs://wagnersilva-eu-assets \
    --member=allUsers \
    --role=roles/storage.objectViewer
```

This allows anyone to read objects in the bucket via public URLs.

## Verify Public Access

After running the command, test with:

```bash
# Check if bucket is public
gcloud storage buckets get-iam-policy gs://wagnersilva-eu-assets

# You should see:
# - members:
#   - allUsers
#   role: roles/storage.objectViewer
```

## Alternative: Make Specific Folder Public

If you only want the `portfolio-videos-optimized` folder public:

```bash
# This requires setting up a bucket policy
# For simplicity, making the entire bucket public is recommended
# since it's already serving public portfolio content
```

## Security Note

- ✅ Safe for portfolio videos (public content)
- ✅ Uses HTTPS by default
- ✅ Cached by CDN (if enabled)
- ⚠️ Ensure no sensitive files are in this bucket

## After Setup

Run the batch processing script:
```bash
./batch-process-videos.sh
```

The ACL errors will be gone! ✅
