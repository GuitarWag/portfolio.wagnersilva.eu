# Infrastructure Setup - Portfolio Wagner Silva EU

Next.js application deployed on GCP Compute Engine with Caddy reverse proxy for automatic SSL.

## Architecture

```
Internet → Caddy (HTTPS/443) → Next.js (localhost:3000)
                ↓
        Let's Encrypt SSL
```

- **GCE VM**: e2-small instance running Ubuntu 22.04
- **Caddy**: Reverse proxy with automatic HTTPS (Let's Encrypt)
- **Node.js 22**: Runtime for Next.js application
- **systemd**: Process management for the app

## Cost Estimate

- **e2-small VM**: ~$13/month (or use e2-micro for ~$6/month)
- **Static IP**: ~$3/month
- **Disk (20GB)**: ~$1/month

**Total**: ~$15-20/month

## Prerequisites

1. GCP Project: `wagnersilva-eu`
2. gcloud CLI installed and authenticated
3. Terraform >= 1.0 installed
4. SSH key pair (`~/.ssh/id_rsa.pub`)
5. Domain with DNS access

## Quick Start

### 1. Configure Terraform

```bash
cd infrastructure/terraform

# Copy and edit variables
cp terraform.tfvars.example terraform.tfvars
nano terraform.tfvars
```

Edit `terraform.tfvars`:
```hcl
project_id          = "wagnersilva-eu"
project_name        = "portfolio-wagnersilva-eu"
domain              = "portfolio.wagnersilva.eu"
```

### 2. Create Infrastructure

```bash
cd infrastructure/scripts

# Initialize and preview
./terraform-init.sh plan

# Create VM, IP, and firewall rules
./terraform-init.sh apply
```

This creates:
- Static external IP
- Firewall rules (ports 80, 443)
- VM instance with Node.js and Caddy

### 3. Configure DNS

Point your domain to the static IP from terraform output:

```bash
./terraform-init.sh output
```

Add DNS records:
```
Type: A
Name: portfolio (or @)
Value: <instance_ip>
TTL: 3600
```

### 4. Deploy Application

```bash
cd infrastructure/scripts

# Set your Gemini API key
export GOOGLE_GENERATIVE_AI_API_KEY="your-api-key-here"

# Deploy!
./deploy.sh
```

The deploy script will:
1. Build Next.js locally (standalone mode)
2. Package the build
3. Upload to server
4. Configure systemd service
5. Configure Caddy
6. Start everything

## Deployment Options

### Full deployment (default)
```bash
./deploy.sh
```

### Skip build (use existing .next folder)
```bash
SKIP_BUILD=1 ./deploy.sh
```

### Custom parameters
```bash
./deploy.sh <instance-name> <zone> <domain>
./deploy.sh portfolio-wagnersilva-eu-server europe-north1-a portfolio.wagnersilva.eu
```

### With API key
```bash
GOOGLE_GENERATIVE_AI_API_KEY="your-key" ./deploy.sh
```

## Management Commands

### SSH into server
```bash
gcloud compute ssh portfolio-wagnersilva-eu-server --zone=europe-north1-a
```

### View application logs
```bash
gcloud compute ssh portfolio-wagnersilva-eu-server --zone=europe-north1-a \
    --command='sudo journalctl -u portfolio-wagnersilva-eu -f'
```

### View Caddy logs
```bash
gcloud compute ssh portfolio-wagnersilva-eu-server --zone=europe-north1-a \
    --command='sudo journalctl -u caddy -f'
```

### Restart application
```bash
gcloud compute ssh portfolio-wagnersilva-eu-server --zone=europe-north1-a \
    --command='sudo systemctl restart portfolio-wagnersilva-eu'
```

### Restart Caddy
```bash
gcloud compute ssh portfolio-wagnersilva-eu-server --zone=europe-north1-a \
    --command='sudo systemctl restart caddy'
```

### Check service status
```bash
gcloud compute ssh portfolio-wagnersilva-eu-server --zone=europe-north1-a \
    --command='sudo systemctl status portfolio-wagnersilva-eu caddy'
```

## Project Structure

```
infrastructure/
├── terraform/
│   ├── main.tf                 # VM, IP, firewall configuration
│   ├── variables.tf            # Variable definitions
│   ├── terraform.tfvars.example
│   └── terraform.tfvars        # Your configuration (gitignored)
├── scripts/
│   ├── terraform-init.sh       # Terraform wrapper
│   ├── deploy.sh               # Build and deploy script
│   └── startup.sh              # VM initialization script
├── caddy/
│   └── Caddyfile               # Caddy reverse proxy config
├── systemd/
│   └── portfolio-wagnersilva-eu.service  # systemd service file
└── README.md
```

## Updating the Application

Just run deploy again:

```bash
cd infrastructure/scripts
./deploy.sh
```

This will:
- Build new version
- Upload to server
- Restart the application
- Zero downtime (Caddy keeps serving during restart)

## Updating API Key

```bash
# SSH into server
gcloud compute ssh portfolio-wagnersilva-eu-server --zone=europe-north1-a

# Edit .env file
nano /var/www/portfolio-wagnersilva-eu/.env

# Restart application
sudo systemctl restart portfolio-wagnersilva-eu
```

Or redeploy with new key:
```bash
GOOGLE_GENERATIVE_AI_API_KEY="new-key" ./deploy.sh
```

## Troubleshooting

### Application not starting

Check logs:
```bash
gcloud compute ssh portfolio-wagnersilva-eu-server --zone=europe-north1-a \
    --command='sudo journalctl -u portfolio-wagnersilva-eu -n 50 --no-pager'
```

### SSL certificate issues

1. Verify DNS is pointing to correct IP:
```bash
dig portfolio.wagnersilva.eu +short
```

2. Check Caddy logs:
```bash
gcloud compute ssh portfolio-wagnersilva-eu-server --zone=europe-north1-a \
    --command='sudo journalctl -u caddy -n 50 --no-pager'
```

3. Validate Caddyfile:
```bash
gcloud compute ssh portfolio-wagnersilva-eu-server --zone=europe-north1-a \
    --command='sudo caddy validate --config /etc/caddy/Caddyfile'
```

### Port 3000 not responding

Check if app is running:
```bash
gcloud compute ssh portfolio-wagnersilva-eu-server --zone=europe-north1-a \
    --command='curl -I http://localhost:3000'
```

### Check all services
```bash
gcloud compute ssh portfolio-wagnersilva-eu-server --zone=europe-north1-a \
    --command='sudo systemctl status portfolio-wagnersilva-eu caddy --no-pager'
```

## Cleanup

To destroy all infrastructure:

```bash
cd infrastructure/scripts
./terraform-init.sh destroy
```

**Warning**: This permanently deletes:
- VM instance and all data
- Static IP address
- Firewall rules

## Security Notes

- API keys are stored in `/var/www/portfolio-wagnersilva-eu/.env` (chmod 600)
- Caddy handles HTTPS automatically with Let's Encrypt
- Security headers configured (HSTS, CSP, X-Frame-Options, etc.)
- Application runs as non-root user (ubuntu)
- systemd provides process isolation (PrivateTmp, NoNewPrivileges)
