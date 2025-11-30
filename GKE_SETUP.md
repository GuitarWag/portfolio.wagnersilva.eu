# GKE Deployment Setup Guide

Complete guide for deploying make-presentations to Google Kubernetes Engine (GKE).

## Prerequisites

1. **gcloud CLI** installed and authenticated
2. **kubectl** installed
3. **Docker** installed for local testing
4. **GCP Project** with billing enabled
5. **Required APIs enabled**:
   ```bash
   gcloud services enable container.googleapis.com
   gcloud services enable compute.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable artifactregistry.googleapis.com
   ```

## Step 1: Create GKE Cluster

```bash
# Set project and region
export PROJECT_ID=wagnersilva-eu
export REGION=europe-north2
export CLUSTER_NAME=make-presentations-cluster

gcloud config set project $PROJECT_ID
gcloud config set compute/region $REGION

# Create GKE Autopilot cluster (recommended for learning)
gcloud container clusters create-auto $CLUSTER_NAME \
  --region=$REGION \
  --release-channel=regular \
  --enable-autorepair \
  --enable-autoupgrade

# OR create Standard cluster with specific configuration
gcloud container clusters create $CLUSTER_NAME \
  --region=$REGION \
  --num-nodes=1 \
  --machine-type=e2-medium \
  --disk-size=20 \
  --enable-autoscaling \
  --min-nodes=1 \
  --max-nodes=3 \
  --enable-autorepair \
  --enable-autoupgrade \
  --release-channel=regular
```

## Step 2: Configure kubectl

```bash
# Get cluster credentials
gcloud container clusters get-credentials $CLUSTER_NAME --region=$REGION

# Verify connection
kubectl cluster-info
kubectl get nodes
```

## Step 3: Create Secrets

```bash
# Create production namespace
kubectl apply -f k8s/namespace.yaml

# Create secrets (replace with your actual API keys)
kubectl create secret generic app-secrets \
  --from-literal=google-generative-ai-api-key=YOUR_GOOGLE_API_KEY \
  --from-literal=huggingface-api-key=YOUR_HUGGINGFACE_API_KEY \
  --namespace=production

# Verify secret creation
kubectl get secrets -n production
```

## Step 4: Reserve Static IP (Optional, for Ingress)

```bash
# Reserve global static IP for Ingress
gcloud compute addresses create make-presentations-ip \
  --global \
  --ip-version IPV4

# Get the reserved IP
gcloud compute addresses describe make-presentations-ip --global
```

## Step 5: Update Ingress Configuration

Edit `k8s/ingress.yaml` and replace `your-domain.com` with your actual domain name.

If you don't have a domain, you can use the LoadBalancer IP directly by skipping ingress and using only the service.

## Step 6: Deploy Application

### Option A: Manual Deployment

```bash
# Apply all manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get deployments -n production
kubectl get pods -n production
kubectl get services -n production

# Watch pods come up
kubectl get pods -n production -w
```

### Option B: Cloud Build Automated Deployment

Cloud Build trigger is already configured at:
`projects/wagnersilva-eu/locations/europe-north2/triggers/0c386e8d-b140-47f4-88cb-de7e431ff9d5`

Simply push to main branch:
```bash
git add .
git commit -m "feat: add GKE deployment configuration"
git push origin main
```

Cloud Build will:
1. Build Docker image using `Dockerfile.production`
2. Push to Artifact Registry: `europe-north2-docker.pkg.dev/wagnersilva-eu/docker/make-presentations`
3. Deploy to GKE cluster using `gke-deploy`

## Step 7: Verify Deployment

```bash
# Check pod logs
kubectl logs -f -n production -l app=make-presentations

# Check health endpoint
kubectl port-forward -n production svc/make-presentations 3000:80
# Then visit http://localhost:3000/api/health

# Get external IP
kubectl get service make-presentations -n production
# Wait for EXTERNAL-IP to be assigned (may take 2-5 minutes)
```

## Step 8: Test TTS Functionality

```bash
# Port-forward to test locally
kubectl port-forward -n production svc/make-presentations 3000:80

# Test TTS endpoint
curl -X POST http://localhost:3000/api/generate-voice \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello from GKE!"}' \
  -o test-audio.wav

# Check if audio file was created
ls -lh test-audio.wav
```

## Troubleshooting

### Pods not starting
```bash
# Describe pod for events
kubectl describe pod -n production -l app=make-presentations

# Check logs
kubectl logs -n production -l app=make-presentations --all-containers

# Check if secrets exist
kubectl get secrets -n production
```

### ONNX Runtime errors
```bash
# Exec into pod to check binaries
kubectl exec -it -n production <pod-name> -- /bin/sh
ls -la /app/node_modules/onnxruntime-node/bin/
```

### Memory/CPU issues
```bash
# Check resource usage
kubectl top pods -n production

# Adjust limits in k8s/deployment.yaml if needed
```

### Cloud Build failures
```bash
# View build logs
gcloud builds list --limit=5
gcloud builds log <BUILD_ID>
```

## Scaling

```bash
# Manual scaling
kubectl scale deployment make-presentations --replicas=3 -n production

# Autoscaling (HPA)
kubectl autoscale deployment make-presentations \
  --min=2 \
  --max=5 \
  --cpu-percent=70 \
  -n production
```

## Monitoring

```bash
# View deployment status
kubectl get deployments -n production -w

# View pod status
kubectl get pods -n production -w

# View service endpoints
kubectl get endpoints -n production

# View ingress status
kubectl get ingress -n production
```

## Cleanup

```bash
# Delete deployment
kubectl delete -f k8s/

# Delete cluster
gcloud container clusters delete $CLUSTER_NAME --region=$REGION

# Delete static IP
gcloud compute addresses delete make-presentations-ip --global

# Delete Artifact Registry images
gcloud artifacts docker images delete \
  europe-north2-docker.pkg.dev/wagnersilva-eu/docker/make-presentations:latest
```

## Cost Optimization

1. **Use Autopilot**: Google manages node provisioning and scaling
2. **Use Preemptible Nodes**: For non-critical workloads (add to cluster creation)
3. **Right-size resources**: Adjust memory/CPU limits based on actual usage
4. **Use regional clusters**: Cheaper than multi-regional
5. **Enable cluster autoscaling**: Scale down when not in use

## Security Checklist

- ✅ Non-root user (UID 1001) in container
- ✅ Security context with seccomp and runAsNonRoot
- ✅ Secrets stored in Kubernetes secrets (not in code)
- ✅ Health checks configured
- ✅ Resource limits defined
- ✅ Network policies (optional, add if needed)
- ✅ Pod anti-affinity for high availability

## Next Steps

1. Set up monitoring with Google Cloud Monitoring
2. Configure alerts for pod failures
3. Set up log aggregation with Cloud Logging
4. Configure backup strategy for application data
5. Set up CI/CD pipeline for staging environment
6. Configure custom domain with SSL/TLS certificate
