#!/bin/bash
set -e

# Script to update Caddy configuration on VM to proxy to Cloud Run
# Usage: ./update-caddy-cloudrun.sh [cloud-run-url]

CLOUD_RUN_URL=$1
INSTANCE_NAME=${2:-portfolio-wagnersilva-eu-server}
ZONE=${3:-europe-north1-a}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CADDY_DIR="${SCRIPT_DIR}/../caddy"

if [ -z "$CLOUD_RUN_URL" ]; then
    echo "❌ Error: Cloud Run URL required"
    echo "Usage: $0 <cloud-run-url> [instance-name] [zone]"
    echo "Example: $0 https://portfolio-wagnersilva-eu-abc123-ew.a.run.app"
    exit 1
fi

# Remove https:// prefix if present (Caddy will handle it)
CLOUD_RUN_URL_CLEAN=$(echo "$CLOUD_RUN_URL" | sed 's|https://||' | sed 's|http://||')

echo "🔧 Updating Caddy configuration for Cloud Run proxy..."
echo "   VM: $INSTANCE_NAME in $ZONE"
echo "   Cloud Run: https://$CLOUD_RUN_URL_CLEAN"

# Create temporary Caddyfile with Cloud Run URL
cat > /tmp/Caddyfile.cloudrun << CADDYEOF
portfolio.wagnersilva.eu {
    log {
        output file /var/log/caddy/access.log
        format json
    }

    # Reverse proxy to Cloud Run
    reverse_proxy https://$CLOUD_RUN_URL_CLEAN {
        # Preserve original headers
        header_up Host {http.reverse_proxy.upstream.hostport}
        header_up X-Real-IP {remote_host}
        header_up X-Forwarded-For {remote_host}
        header_up X-Forwarded-Proto {scheme}
        
        # Health check configuration
        health_uri /api/health
        health_interval 30s
        health_timeout 5s
        health_status 200
        
        # Transport configuration for HTTPS backend
        transport http {
            tls
            tls_insecure_skip_verify
        }
    }
}

# Redirect www to non-www
www.portfolio.wagnersilva.eu {
    redir https://portfolio.wagnersilva.eu{uri} permanent
}
CADDYEOF

# Upload new Caddyfile to VM
echo ""
echo "📤 Uploading new Caddyfile to VM..."
gcloud compute scp /tmp/Caddyfile.cloudrun ${INSTANCE_NAME}:/tmp/Caddyfile --zone=${ZONE}

# Stop the local Next.js application (no longer needed)
echo ""
echo "🛑 Stopping local Next.js application on VM..."
gcloud compute ssh ${INSTANCE_NAME} --zone=${ZONE} --command='sudo systemctl stop portfolio-wagnersilva-eu'
gcloud compute ssh ${INSTANCE_NAME} --zone=${ZONE} --command='sudo systemctl disable portfolio-wagnersilva-eu'

# Update Caddy configuration on VM
echo ""
echo "🔄 Updating Caddy configuration on VM..."
gcloud compute ssh ${INSTANCE_NAME} --zone=${ZONE} --command='
sudo mv /tmp/Caddyfile /etc/caddy/Caddyfile
sudo chown root:root /etc/caddy/Caddyfile
sudo chmod 644 /etc/caddy/Caddyfile

# Validate Caddyfile
echo "Validating Caddyfile..."
sudo caddy validate --config /etc/caddy/Caddyfile || {
    echo "❌ Caddyfile validation failed!"
    sudo cat /etc/caddy/Caddyfile
    exit 1
}

# Restart Caddy
echo "Restarting Caddy..."
sudo systemctl restart caddy

# Check Caddy status
echo "Checking Caddy status..."
sudo systemctl status caddy --no-pager | head -15
'

echo ""
echo "✅ Caddy configuration updated successfully!"
echo ""
echo "🌐 Your site should now be proxying to Cloud Run at:"
echo "   https://portfolio.wagnersilva.eu → https://$CLOUD_RUN_URL_CLEAN"
echo ""
echo "📊 Useful commands:"
echo "   View Caddy logs: gcloud compute ssh ${INSTANCE_NAME} --zone=${ZONE} --command='sudo journalctl -u caddy -f'"
echo "   Test endpoint:   curl -I https://portfolio.wagnersilva.eu"
echo "   Cloud Run logs:  gcloud run services logs tail portfolio-wagnersilva-eu --region=europe-north1"

# Clean up
rm -f /tmp/Caddyfile.cloudrun
