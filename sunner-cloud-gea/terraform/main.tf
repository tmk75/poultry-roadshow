# Terraform Configuration for Sunner Digital Twin on GEACloud / Azure China
# Compliant with CSL, DSL, and PIPL regulatory mandates (China East 2 / Mooncake)

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.80.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5.0"
    }
  }
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
    key_vault {
      purge_soft_delete_on_destroy    = false
      recover_soft_deleted_key_vaults = true
    }
  }
  environment = "china"
}

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location

  tags = {
    Project            = "Sunner Digital Twin"
    Environment        = var.environment
    ManagedBy          = "Terraform"
    ComplianceFramework = "CSL-DSL-PIPL"
    DataClassification = "Industrial-Confidential"
  }
}
