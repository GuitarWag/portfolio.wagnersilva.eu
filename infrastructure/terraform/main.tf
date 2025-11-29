terraform {
  required_version = ">= 1.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# Reserve a static external IP
resource "google_compute_address" "static_ip" {
  name = "${var.project_name}-ip"
}

# Firewall rule for HTTP/HTTPS traffic
resource "google_compute_firewall" "allow_http_https" {
  name    = "${var.project_name}-allow-web"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["web-server"]
}

# VM Instance - e2-small for Node.js app (more memory than e2-micro)
resource "google_compute_instance" "app_server" {
  name         = "portfolio-wagnersilva-eu-server"
  machine_type = var.machine_type
  zone         = var.zone

  tags = ["web-server"]

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2204-lts"
      size  = 15            # GB - enough for Node.js and app
      type  = "pd-standard" # Standard persistent disk (cheaper than SSD)
    }
  }

  network_interface {
    network = "default"

    access_config {
      nat_ip = google_compute_address.static_ip.address
    }
  }

  metadata = {
    ssh-keys = "${var.ssh_user}:${file(var.ssh_public_key_path)}"
  }

  metadata_startup_script = file("${path.module}/../scripts/startup.sh")

  # Allow stopping for maintenance
  allow_stopping_for_update = true

  # Labels for cost tracking
  labels = {
    environment = var.environment
    project     = var.project_name
  }
}

# Output the static IP
output "instance_ip" {
  value       = google_compute_address.static_ip.address
  description = "Static external IP address of the VM instance"
}

output "instance_name" {
  value       = google_compute_instance.app_server.name
  description = "Name of the VM instance"
}

output "ssh_command" {
  value       = "gcloud compute ssh ${google_compute_instance.app_server.name} --zone=${var.zone}"
  description = "SSH command to connect to the instance"
}

output "app_url" {
  value       = "https://${var.domain}"
  description = "Application URL"
}
