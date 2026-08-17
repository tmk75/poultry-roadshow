variable "location" {
  type        = string
  default     = "chinaeast2"
  description = "Azure China region for data localization (China East 2 / Shanghai)"
}

variable "resource_group_name" {
  type        = string
  default     = "rg-sunner-digitaltwin-prod"
  description = "Target Resource Group name"
}

variable "environment" {
  type        = string
  default     = "production"
  description = "Deployment environment (development, staging, production)"
}

variable "iothub_sku" {
  type        = string
  default     = "S1"
  description = "Azure IoT Hub pricing and scale tier"
}

variable "iothub_capacity" {
  type        = number
  default     = 1
  description = "Number of provisioned IoT Hub units"
}

variable "neo4j_admin_password" {
  type        = string
  sensitive   = true
  default     = "SunnerSmartTwin#2026"
  description = "Initial admin password for Neo4j instance"
}
