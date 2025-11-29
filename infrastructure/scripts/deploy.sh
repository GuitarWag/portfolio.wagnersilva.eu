#!/bin/bash
set -e

# Deployment script for Make Presentations (Next.js)
# Usage: ./deploy.sh [instance-name] [zone] [domain]

if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    echo "Usage: ./deploy.sh [instance-name] [zone] [domain]"
    echo "Defaults: portfolio-wagnersilva-eu-server europe-north1-a portfolio.wagnersilva.eu"
    echo ""
    echo "Environment variables:"
    echo "  SKIP_BUILD=1    Skip npm install/build (use existing .next)"
    echo "  GOOGLE_GENERATIVE_AI_API_KEY    Gemini API key (will be set on server)"
    exit 0
fi

INSTANCE_NAME=${1:-portfolio-wagnersilva-eu-server}
ZONE=${2:-europe-north1-a}
DOMAIN=${3:-portfolio.wagnersilva.eu}
APP_DIR="/var/www/portfolio-wagnersilva-eu"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
INFRA_DIR="${SCRIPT_DIR}/.."

echo "🚀 Deploying to $INSTANCE_NAME in $ZONE..."
echo "   Domain: $DOMAIN"
echo "   Project root: $PROJECT_ROOT"

# Build the application locally unless SKIP_BUILD is set
if [ -z "${SKIP_BUILD}" ]; then
    echo ""
    echo "📦 Installing dependencies..."
    cd "${PROJECT_ROOT}"
    npm ci

    echo ""
    echo "🔨 Building Next.js application (standalone mode)..."
    npm run build

    # Verify standalone output exists
    if [ ! -f "${PROJECT_ROOT}/.next/standalone/server.js" ]; then
        echo "❌ Error: Standalone build not found. Check next.config.mjs has output: 'standalone'"
        exit 1
    fi
else
    echo ""
    echo "📦 SKIP_BUILD is set; using existing build"
    cd "${PROJECT_ROOT}"
fi

# Create deployment package
echo ""
echo "📦 Creating deployment package..."

# Create a temp directory for the package
TEMP_DIR=$(mktemp -d)
trap "rm -rf ${TEMP_DIR}" EXIT

# Copy standalone build
cp -r "${PROJECT_ROOT}/.next/standalone/." "${TEMP_DIR}/"

# Copy static files (required for Next.js)
mkdir -p "${TEMP_DIR}/.next/static"
cp -r "${PROJECT_ROOT}/.next/static/." "${TEMP_DIR}/.next/static/"

# Copy public folder
cp -r "${PROJECT_ROOT}/public" "${TEMP_DIR}/"

# Create the tarball
cd "${TEMP_DIR}"
tar -czf "${PROJECT_ROOT}/deploy.tar.gz" .
cd "${PROJECT_ROOT}"

echo "   Package size: $(du -h deploy.tar.gz | cut -f1)"

# Upload files to server
echo ""
echo "📤 Uploading files to server..."
gcloud compute scp deploy.tar.gz ${INSTANCE_NAME}:/tmp/ --zone=${ZONE}
gcloud compute scp ${INFRA_DIR}/caddy/Caddyfile ${INSTANCE_NAME}:/tmp/ --zone=${ZONE}
gcloud compute scp ${INFRA_DIR}/systemd/portfolio-wagnersilva-eu.service ${INSTANCE_NAME}:/tmp/ --zone=${ZONE}

# Create .env file with API key if provided
if [ -n "${GOOGLE_GENERATIVE_AI_API_KEY}" ]; then
    echo "GOOGLE_GENERATIVE_AI_API_KEY=${GOOGLE_GENERATIVE_AI_API_KEY}" > /tmp/.env.deploy
    gcloud compute scp /tmp/.env.deploy ${INSTANCE_NAME}:/tmp/.env --zone=${ZONE}
    rm /tmp/.env.deploy
    HAS_ENV=1
fi

# Deploy on server
echo ""
echo "🔧 Deploying on server..."
gcloud compute ssh ${INSTANCE_NAME} --zone=${ZONE} --command="bash -s" <<EOF
set -e

echo "Stopping existing application..."
sudo systemctl stop portfolio-wagnersilva-eu 2>/dev/null || true

# Ensure app directory exists with correct permissions
sudo mkdir -p ${APP_DIR}

# Clean old files and extract new ones
echo "Extracting application files..."
sudo rm -rf ${APP_DIR}/*
sudo tar -xzf /tmp/deploy.tar.gz -C ${APP_DIR} --no-same-owner --no-same-permissions

# Set ownership to ubuntu (for systemd service) and make readable
sudo chown -R ubuntu:ubuntu ${APP_DIR}
sudo chmod -R 755 ${APP_DIR}
sudo rm -f /tmp/deploy.tar.gz

# Set up environment file
if [ -f /tmp/.env ]; then
    echo "Setting up environment variables..."
    mv /tmp/.env ${APP_DIR}/.env
    chmod 600 ${APP_DIR}/.env
elif [ -f ${APP_DIR}/.env ]; then
    echo "Using existing .env file"
else
    echo "Warning: No .env file found. API features may not work."
fi

# Install/update systemd service
echo "Configuring systemd service..."
sudo mv /tmp/portfolio-wagnersilva-eu.service /etc/systemd/system/
sudo chmod 644 /etc/systemd/system/portfolio-wagnersilva-eu.service
sudo systemctl daemon-reload
sudo systemctl enable portfolio-wagnersilva-eu

# Configure Caddy
echo "Configuring Caddy..."
sudo mkdir -p /var/log/caddy
sudo chown caddy:caddy /var/log/caddy
sudo chmod 755 /var/log/caddy

# Update domain in Caddyfile
sudo sed -i "s/portfolio.wagnersilva.eu/${DOMAIN}/g" /tmp/Caddyfile
sudo mv /tmp/Caddyfile /etc/caddy/Caddyfile
sudo chown root:root /etc/caddy/Caddyfile
sudo chmod 644 /etc/caddy/Caddyfile

# Validate Caddyfile before restarting
echo "Validating Caddyfile..."
sudo caddy validate --config /etc/caddy/Caddyfile || {
    echo "❌ Caddyfile validation failed!"
    sudo cat /etc/caddy/Caddyfile
    exit 1
}

# Start the Next.js application
echo "Starting Next.js application..."
sudo systemctl start portfolio-wagnersilva-eu || {
    echo "❌ Application failed to start, checking logs..."
    sudo journalctl -u portfolio-wagnersilva-eu -n 30 --no-pager
    exit 1
}

# Wait for app to be ready
echo "Waiting for application to be ready..."
sleep 3

# Check if app is responding
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|304"; then
    echo "✅ Application is responding on port 3000"
else
    echo "⚠️  Application may still be starting up..."
fi

# Restart Caddy
echo "Restarting Caddy..."
sudo systemctl restart caddy || {
    echo "❌ Caddy failed to start, checking logs..."
    sudo journalctl -u caddy -n 20 --no-pager
    exit 1
}

# Enable Caddy to start on boot
sudo systemctl enable caddy

echo ""
echo "✅ Deployment complete!"

# Show status
echo ""
echo "Service status:"
sudo systemctl status portfolio-wagnersilva-eu --no-pager -l || true
echo ""
sudo systemctl status caddy --no-pager || true
EOF

# Clean up local files
rm -f deploy.tar.gz

echo ""
echo "✅ Deployment successful!"
echo ""
echo "🌐 Your site should be available at:"
echo "   https://${DOMAIN}"
echo ""
echo "📊 Useful commands:"
echo "   View app logs:   gcloud compute ssh ${INSTANCE_NAME} --zone=${ZONE} --command='sudo journalctl -u portfolio-wagnersilva-eu -f'"
echo "   View Caddy logs: gcloud compute ssh ${INSTANCE_NAME} --zone=${ZONE} --command='sudo journalctl -u caddy -f'"
echo "   Restart app:     gcloud compute ssh ${INSTANCE_NAME} --zone=${ZONE} --command='sudo systemctl restart portfolio-wagnersilva-eu'"
echo "   SSH to server:   gcloud compute ssh ${INSTANCE_NAME} --zone=${ZONE}"
