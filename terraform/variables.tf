variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region for Cloud Run and Artifact Registry"
  type        = string
  default     = "europe-north1"
}

variable "service_name" {
  description = "Name of the Cloud Run service"
  type        = string
  default     = "flagle-web"
}

variable "github_repo" {
  description = "GitHub repository in format 'owner/repo'"
  type        = string
}

variable "custom_domain" {
  description = "Custom domain for Cloud Run service (e.g., lippuli.fi)"
  type        = string
  default     = ""
}
