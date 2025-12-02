#!/bin/bash
set -e

# Cloud Run deployment script
# This script deploys the Next.js application to Google Cloud Run
# Usage: ./deploy-cloudrun.sh [project-id]

PROJECT_ID=${1:-wagnersilva-eu}
REGION="europe-north1"
SERVICE_NAME="portfolio-wagnersilva-eu"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

echo "🚀 Deploying to Cloud Run..."
echo "   Project: $PROJECT_ID"
echo "   Region: $REGION"
echo "   Service: $SERVICE_NAME"

# Step 1: Ensure Secret Manager has the API key
if [ -n "${GOOGLE_GENERATIVE_AI_API_KEY}" ]; then
    echo ""
    echo "🔐 Creating/updating secret in Secret Manager..."
    
    # Check if secret exists
    if gcloud secrets describe GOOGLE_GENERATIVE_AI_API_KEY --project=$PROJECT_ID &>/dev/null; then
        echo "   Secret exists, adding new version..."
        echo -n "${GOOGLE_GENERATIVE_AI_API_KEY}" | gcloud secrets versions add GOOGLE_GENERATIVE_AI_API_KEY --data-file=- --project=$PROJECT_ID
    else
        echo "   Creating new secret..."
        echo -n "${GOOGLE_GENERATIVE_AI_API_KEY}" | gcloud secrets create GOOGLE_GENERATIVE_AI_API_KEY --data-file=- --project=$PROJECT_ID --replication-policy="automatic"
    fi
    
    # Grant Cloud Run access to the secret
    echo "   Granting Cloud Run access to secret..."
    gcloud secrets add-iam-policy-binding GOOGLE_GENERATIVE_AI_API_KEY \
        --member="serviceAccount:${PROJECT_ID}@appspot.gserviceaccount.com" \
        --role="roles/secretmanager.secretAccessor" \
        --project=$PROJECT_ID
else
    echo ""
    echo "⚠️  Warning: GOOGLE_GENERATIVE_AI_API_KEY not set. AI features may not work."
fi

# Step 2: Submit build to Cloud Build
echo ""
echo "🔨 Building and deploying with Cloud Build..."
cd "${PROJECT_ROOT}"
gcloud builds submit --config=cloudbuild.yaml --project=$PROJECT_ID

# Step 3: Get Cloud Run service URL
echo ""
echo "🔍 Getting Cloud Run service URL..."
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --project=$PROJECT_ID --format='value(status.url)')

echo ""
echo "✅ Deployment successful!"
echo ""
echo "🌐 Cloud Run service URL:"
echo "   $SERVICE_URL"
echo ""
echo "📊 Useful commands:"
echo "   View logs:       gcloud run services logs tail $SERVICE_NAME --region=$REGION --project=$PROJECT_ID"
echo "   Update service:  gcloud run services update $SERVICE_NAME --region=$REGION --project=$PROJECT_ID"
echo "   Service details: gcloud run services describe $SERVICE_NAME --region=$REGION --project=$PROJECT_ID"
echo ""
echo "🔄 Next step: Update Caddy on VM to proxy to Cloud Run"
echo "   Use: ./update-caddy-cloudrun.sh \"$SERVICE_URL\""
