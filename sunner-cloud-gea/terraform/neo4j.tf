# Neo4j Digital Twin Graph Deployment on Azure Container Instances (China East 2)

resource "azurerm_container_group" "neo4j_twin" {
  name                = "aci-sunner-neo4j-twin"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  ip_address_type     = "Public"
  dns_name_label      = "sunner-neo4j-twin"
  os_type             = "Linux"

  container {
    name   = "neo4j-graph-engine"
    image  = "neo4j:5.15-community"
    cpu    = "2"
    memory = "4"

    ports {
      port     = 7474
      protocol = "TCP"
    }

    ports {
      port     = 7687
      protocol = "TCP"
    }

    environment_variables = {
      NEO4J_AUTH                        = "neo4j/${var.neo4j_admin_password}"
      NEO4J_PLUGINS                     = "[\"apoc\"]"
      NEO4J_dbms_security_procedures_unrestricted = "apoc.*"
    }
  }

  tags = azurerm_resource_group.rg.tags
}
