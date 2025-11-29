#!/bin/bash
set -e

# Startup script for GCP VM instance - Next.js with Caddy reverse proxy
# This runs automatically when the VM is created

echo "Starting VM initialization for Next.js deployment..."

# Update system packages
apt-get update
apt-get upgrade -y

# Install required packages
apt-get install -y \
    curl \
    debian-keyring \
    debian-archive-keyring \
    apt-transport-https \
    ca-certificates \
    gnupg

# Install Node.js 22.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs

# Verify Node.js installation
node --version
npm --version

# Install Caddy (reverse proxy with automatic HTTPS)
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt-get update
apt-get install -y caddy

# Create application directory
mkdir -p /var/www/portfolio-wagnersilva-eu
chown -R ubuntu:ubuntu /var/www/portfolio-wagnersilva-eu

# Create Caddy log directory
mkdir -p /var/log/caddy
chown -R caddy:caddy /var/log/caddy

# Enable Caddy service (will be configured by deploy.sh)
systemctl enable caddy

echo "✅ VM initialization complete!"
echo "📦 Ready for deployment - run deploy.sh to deploy the application"
