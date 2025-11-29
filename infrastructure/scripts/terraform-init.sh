#!/bin/bash
set -e

# Terraform wrapper script for Make Presentations infrastructure
# Usage: ./terraform-init.sh [plan|apply|destroy|output]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="${SCRIPT_DIR}/../terraform"

cd "${TERRAFORM_DIR}"

case "$1" in
    "init")
        terraform init
        ;;
    "plan")
        terraform init -upgrade
        terraform plan
        ;;
    "apply")
        terraform init -upgrade
        terraform apply
        ;;
    "destroy")
        terraform destroy
        ;;
    "output")
        terraform output
        ;;
    *)
        echo "Usage: $0 [init|plan|apply|destroy|output]"
        echo ""
        echo "Commands:"
        echo "  init     Initialize Terraform"
        echo "  plan     Show execution plan"
        echo "  apply    Apply changes (create/update infrastructure)"
        echo "  destroy  Destroy all infrastructure"
        echo "  output   Show outputs (IP, instance name, etc.)"
        exit 1
        ;;
esac
