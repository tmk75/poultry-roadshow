# Skill: Enterprise Industrial Integration & ISA-95 Mapping Rules

## Scope
Defines data mapping, protocol transformations, and automated business workflows connecting plant-floor OT systems with enterprise IT, cloud data lakehouses, and ERP systems across the Sunner Industrial Complex.

---

## ISA-95 Enterprise Level Mapping

```
+------------------------------------------------------------------------------------+
| LEVEL 4/5: Enterprise & Cloud Fabric (SAP S/4HANA, Snowflake, Palantir Foundry)   |
|   - SAP S/4HANA: Material Documents, Automated Purchase Orders (BAPI_PO_CREATE1)   |
|   - Snowflake Lakehouse: Medallion Architecture (Bronze Raw -> Silver -> Gold)     |
|   - Palantir Foundry: Semantic Object Ontology (FlockBatch, BarnZone, FeedOrder)   |
|   - Cortex AI: Natural language synthesis of multi-tier anomalies                  |
+------------------------------------------------------------------------------------+
                                       ^
                                       | Streaming CDC / Kafka / IoT Hub
                                       v
+------------------------------------------------------------------------------------+
| LEVEL 3: Operations & Plant Floor (SCADA, OSIsoft PI Historian, MES/MOM)           |
|   - Ignition SCADA: Real-time HMI alarms and tag bindings                          |
|   - OSIsoft PI: High-frequency swinging-door compression time-series points        |
|   - MES / MOM: Broiler batch lifecycle, vaccination history, FCR metrics           |
+------------------------------------------------------------------------------------+
                                       ^
                                       | Sparkplug B / MQTT / OPC UA
                                       v
+------------------------------------------------------------------------------------+
| LEVEL 2: Industrial Edge Gateways (Welotec egOS)                                   |
|   - Protocol Translation (Modbus RTU/TCP -> MQTT JSON v1.0.0)                      |
|   - Local buffering, store-and-forward, edge anomaly pre-filtering                |
+------------------------------------------------------------------------------------+
                                       ^
                                       | RS-485 / Modbus / Digital I/O
                                       v
+------------------------------------------------------------------------------------+
| LEVEL 0/1: Field Level (Physical Sensors, Actuators & PLCs)                        |
|   - Siemens S7-1500 / Rockwell ControlLogix / Rotem Platinum Pro / Fancom F37      |
+------------------------------------------------------------------------------------+
```

## Policy Rules
1. **Rule ENT-01 (SAP Auto-PO Generation):** When total farm feed inventory (Silo 1 + Silo 2) falls below $15.0\text{ metric tons}$, the Supply Chain Agent MUST automatically generate an SAP Purchase Order (`BAPI_PO_CREATE1`) for $25.0\text{ metric tons}$ of `MAT-FEED-SOYA-500` with vendor `VEND-FUJIAN-FEED-01` and required delivery within 24 hours.
2. **Rule ENT-02 (Snowflake Medallion Cleanliness):** Raw JSON telemetry in the Bronze tier must be strictly parsed, schema-validated, and materialized into typed Silver tables (`CLEAN_CLIMATE_METRICS`) with microsecond timestamp partitioning.
3. **Rule ENT-03 (Palantir Foundry Object Synchronization):** Every farm entity must maintain bidirectional identity links between physical PLC tags, Neo4j graph nodes, and SAP asset serial numbers.
4. **Rule ENT-04 (Cortex AI Explanation Synthesis):** When multi-agent conflict resolution triggers an override (e.g. Ammonia Hazard overruling Peak Tariff), Cortex AI must emit a concise 2-sentence executive briefing summarizing the cross-system impact across SCADA alarms, flock mortality avoidance value, and kilowatt cost delta.
