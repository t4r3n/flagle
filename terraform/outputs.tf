output "workload_identity_provider" {
  description = "Workload Identity Provider resource name (use in GitHub Actions)"
  value       = google_iam_workload_identity_pool_provider.github.name
}

output "service_account_email" {
  description = "Service account email (use in GitHub Actions)"
  value       = google_service_account.github_actions.email
}

output "artifact_registry_repository" {
  description = "Artifact Registry repository URL"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.flagle.repository_id}"
}

output "github_actions_config" {
  description = "Values to use in GitHub Actions workflow"
  value = {
    workload_identity_provider = google_iam_workload_identity_pool_provider.github.name
    service_account            = google_service_account.github_actions.email
    project_id                 = var.project_id
    region                     = var.region
  }
}
