output "iothub_name" {
  value       = azurerm_iothub.sunner_hub.name
  description = "Azure IoT Hub instance name"
}

output "iothub_hostname" {
  value       = azurerm_iothub.sunner_hub.hostname
  description = "IoT Hub hostname for edge gateway MQTT broker redirection"
}

output "neo4j_bolt_endpoint" {
  value       = "bolt://${azurerm_container_group.neo4j_twin.fqdn}:7687"
  description = "Neo4j Bolt connection endpoint for AI Agents and Ingestion service"
}

output "neo4j_browser_url" {
  value       = "http://${azurerm_container_group.neo4j_twin.fqdn}:7474"
  description = "Neo4j Web Browser visualization console"
}
