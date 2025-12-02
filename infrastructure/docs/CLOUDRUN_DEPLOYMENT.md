# Cloud Run Deployment Guide

This guide explains the new Cloud Run architecture where the application runs on Google Cloud Run with the existing VM acting as a load balancer/reverse proxy.

## Architecture Overview

```
User Request
    ↓
portfolio.wagnersilva.eu (DNS)
    ↓
VM (Caddy Load Balancer) - europe-north1-a
    ↓
Cloud Run (Next.js App) - europe-north1
    ↓
Response
```

### Components

1. **Cloud Run Service** (`portfolio-wagnersilva-eu`)
   - Hosts the Next.js application in a Docker container
   - Auto-scales based on traffic (min: 1, max: 10 instances)
   - Region: `europe-north1`
   - Resources: 2 CPU, 2Gi memory
   - Timeout: 300s

2. **GCP VM** (`portfolio-wagnersilva-eu-server`)
   - Acts as reverse proxy and load balancer
   - Runs Caddy web server
   - Handles HTTPS termination and certificate management
   - Zone: `europe-north1-a`

3. **Artifact Registry**
   - Stores Docker images
   - Repository: `europe-north1-docker.pkg.dev/wagnersilva-eu/docker`

4. **Secret Manager**
   - Stores sensitive environment variables (API keys)
   - Secret: `GOOGLE_GENERATIVE_AI_API_KEY`

## Prerequisites

1. Google Cloud SDK (`gcloud`) installed and authenticated
2. Docker repository set up in Artifact Registry
3. API key in environment variable: `GOOGLE_GENERATIVE_AI_API_KEY`
4. Existing GCP VM with Caddy installed
5. Required GCP APIs enabled:
   - Cloud Run API
   - Cloud Build API
   - Artifact Registry API
   - Secret Manager API

## Deployment Steps

### 1. Deploy to Cloud Run

Run the deployment script with your API key:

```bash
cd infrastructure/scripts
GOOGLE_GENERATIVE_AI_API_KEY="your-api-key-here" ./deploy-cloudrun.sh
```

This script will:
- Create/update the API key secret in Secret Manager
- Build the Docker image using Cloud Build
- Push the image to Artifact Registry
- Deploy to Cloud Run with proper configuration
- Output the Cloud Run service URL

Expected output:
```
🚀 Deploying to Cloud Run...
   Project: wagnersilva-eu
   Region: europe-north1
   Service: portfolio-wagnersilva-eu

🔐 Creating/updating secret in Secret Manager...
🔨 Building and deploying with Cloud Build...
✅ Deployment successful!

🌐 Cloud Run service URL:
   https://portfolio-wagnersilva-eu-abc123xyz-ew.a.run.app
```

### 2. Update VM to Proxy to Cloud Run

After Cloud Run deployment, configure the VM to proxy traffic:

```bash
./update-caddy-cloudrun.sh "https://portfolio-wagnersilva-eu-abc123xyz-ew.a.run.app"
```

This script will:
- Stop the local Next.js application on the VM
- Update Caddy configuration to proxy to Cloud Run
- Validate and restart Caddy
- Disable the local systemd service

Expected output:
```
🔧 Updating Caddy configuration for Cloud Run proxy...
🛑 Stopping local Next.js application on VM...
🔄 Updating Caddy configuration on VM...
✅ Caddy configuration updated successfully!

🌐 Your site should now be proxying to Cloud Run at:
   https://portfolio.wagnersilva.eu → https://portfolio-wagnersilva-eu-abc123xyz-ew.a.run.app
```

## Files Created

```
Dockerfile                                # Multi-stage Dockerfile for Cloud Run
cloudbuild.yaml                          # Cloud Build configuration
app/api/health/route.ts                  # Health check endpoint

infrastructure/
├── scripts/
│   ├── deploy-cloudrun.sh              # Cloud Run deployment script
│   └── update-caddy-cloudrun.sh        # VM Caddy update script
├── caddy/
│   └── Caddyfile.cloudrun              # Caddy template for Cloud Run proxy
└── docs/
    └── CLOUDRUN_DEPLOYMENT.md          # This file
```

## Dockerfile Details

The Dockerfile uses a multi-stage build:

1. **Dependencies Stage**: Installs production Node.js dependencies with native bindings
2. **Builder Stage**: Builds the Next.js application in standalone mode
3. **Runner Stage**: Lightweight production image with:
   - Node.js 22 runtime
   - Non-root user (`nodejs`)
   - Native bindings (ONNX Runtime, Sharp) compiled for Linux
   - Health check endpoint
   - Port 8080 exposed for Cloud Run

## Environment Variables

Environment variables are managed via:

1. **Secret Manager** (sensitive):
   - `GOOGLE_GENERATIVE_AI_API_KEY`: Gemini API key

2. **Cloud Run Config** (non-sensitive):
   - `NODE_ENV=production`
   - `PORT=8080`
   - `HOSTNAME=0.0.0.0`

## Monitoring and Logs

### View Cloud Run Logs
```bash
gcloud run services logs tail portfolio-wagnersilva-eu --region=europe-north1
```

### View Caddy Logs (VM)
```bash
gcloud compute ssh portfolio-wagnersilva-eu-server --zone=europe-north1-a --command='sudo journalctl -u caddy -f'
```

### Check Service Status
```bash
# Cloud Run service details
gcloud run services describe portfolio-wagnersilva-eu --region=europe-north1

# Caddy status on VM
gcloud compute ssh portfolio-wagnersilva-eu-server --zone=europe-north1-a --command='sudo systemctl status caddy'
```

## Updating the Application

To deploy updates:

```bash
cd infrastructure/scripts
GOOGLE_GENERATIVE_AI_API_KEY="your-api-key" ./deploy-cloudrun.sh
```

Cloud Run will automatically perform a rolling update with zero downtime.

## Rollback

To rollback to a previous revision:

```bash
# List revisions
gcloud run revisions list --service=portfolio-wagnersilva-eu --region=europe-north1

# Rollback to specific revision
gcloud run services update-traffic portfolio-wagnersilva-eu \
  --to-revisions=portfolio-wagnersilva-eu-00042-xyz=100 \
  --region=europe-north1
```

## Cost Optimization

Cloud Run pricing is based on:
- CPU and memory allocation (2 vCPU, 2Gi)
- Request processing time
- Number of instances (min: 1, max: 10)

To reduce costs:
- Set `--min-instances=0` to scale to zero when idle
- Reduce CPU/memory if sufficient
- Optimize application cold start time

## Troubleshooting

### Issue: Cloud Run service not accessible
**Solution**: Check Cloud Run logs and ensure `--allow-unauthenticated` is set

### Issue: 502 Bad Gateway from Caddy
**Solution**: Verify Cloud Run URL in Caddyfile and ensure health check passes

### Issue: Native binding errors (ONNX Runtime, Sharp)
**Solution**: These are installed during Docker build. Rebuild the image.

### Issue: API key not working
**Solution**: Verify secret exists in Secret Manager and Cloud Run has access:
```bash
gcloud secrets describe GOOGLE_GENERATIVE_AI_API_KEY
gcloud secrets get-iam-policy GOOGLE_GENERATIVE_AI_API_KEY
```

## Architecture Benefits

1. **Auto-scaling**: Cloud Run automatically scales based on traffic
2. **Zero downtime deployments**: Rolling updates with traffic splitting
3. **Cost efficiency**: Pay only for actual usage, scale to zero when idle
4. **Managed infrastructure**: No server management, automatic security patches
5. **Global load balancing**: VM can be replaced with Cloud Load Balancer for multi-region
6. **Better reliability**: Built-in health checks and automatic restarts

## Next Steps

- Consider migrating to Cloud Load Balancer for multi-region support
- Set up Cloud Monitoring alerts for Cloud Run metrics
- Implement Cloud CDN for static asset caching
- Configure Cloud Armor for DDoS protection
