# Azure IoT Hub & Storage for Sunner Edge Telemetry Ingestion

resource "azurerm_storage_account" "telemetry_archive" {
  name                     = "stsunnertwinarchive"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  min_tls_version          = "TLS1_2"

  blob_properties {
    versioning_enabled = true
    delete_retention_policy {
      days = 180
    }
  }

  tags = azurerm_resource_group.rg.tags
}

resource "azurerm_storage_container" "raw_telemetry" {
  name                  = "raw-mqtt-telemetry"
  storage_account_name  = azurerm_storage_account.telemetry_archive.name
  container_access_type = "private"
}

resource "azurerm_iothub" "sunner_hub" {
  name                = "iothub-sunner-china-prod"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location

  sku {
    name     = var.iothub_sku
    capacity = var.iothub_capacity
  }

  endpoint {
    type                       = "AzureIotHub.StorageContainer"
    connection_string          = azurerm_storage_account.telemetry_archive.primary_blob_connection_string
    name                       = "telemetry-archive-endpoint"
    batch_frequency_in_seconds = 60
    max_chunk_size_in_bytes    = 104857600
    container_name             = azurerm_storage_container.raw_telemetry.name
    encoding                   = "JSON"
    file_name_format           = "{iothub}/{partition}/{YYYY}/{MM}/{DD}/{HH}/{mm}"
  }

  route {
    name           = "archive-all-telemetry"
    source         = "DeviceMessages"
    condition      = "true"
    endpoint_names = ["telemetry-archive-endpoint"]
    enabled        = true
  }

  tags = azurerm_resource_group.rg.tags
}

# Consumer group for Stream Ingestion into Neo4j
resource "azurerm_iothub_consumer_group" "neo4j_ingest_cg" {
  name                   = "neo4j-digitaltwin-cg"
  iothub_name            = azurerm_iothub.sunner_hub.name
  eventhub_endpoint_name = "events"
  resource_group_name    = azurerm_resource_group.rg.name
}
