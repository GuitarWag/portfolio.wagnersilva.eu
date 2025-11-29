variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "portfolio-wagnersilva-eu"
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "europe-north1"
}

variable "zone" {
  description = "GCP zone"
  type        = string
  default     = "europe-north1-a"
}

variable "machine_type" {
  description = "VM machine type (e2-small recommended for Node.js)"
  type        = string
  default     = "e2-small"
}

variable "environment" {
  description = "Environment label"
  type        = string
  default     = "production"
}

variable "ssh_user" {
  description = "SSH username"
  type        = string
  default     = "ubuntu"
}

variable "ssh_public_key_path" {
  description = "Path to SSH public key file"
  type        = string
  default     = "~/.ssh/id_rsa.pub"
}

variable "domain" {
  description = "Domain name for the application"
  type        = string
  default     = "portfolio.wagnersilva.eu"
}
