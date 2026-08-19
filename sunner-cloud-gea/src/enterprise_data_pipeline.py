"""
Enterprise Industrial Data Flow & Multi-Agent Orchestration Pipeline (Team 2, 3 & 4)
Simulates end-to-end data transformation across ISA-95 Levels 0-5+:
[Sensors/PLC] -> [Welotec Edge] -> [SCADA (Ignition)] -> [Historian (OSIsoft PI)] -> [MES/MOM]
  -> [SAP S/4HANA ERP] -> [Snowflake Lakehouse] -> [Palantir Foundry] -> [Neo4j Twin]
  -> [Snowflake Cortex AI & Multi-Agent Fabric] -> [Executive BI Command Center]
"""

import argparse
import datetime
import json
import logging
import os
import sys
from typing import Any, Dict, List, Optional

# Path configuration
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.abspath(os.path.join(current_dir, ".."))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [EnterprisePipeline] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("EnterpriseDataFlow")


class EnterpriseDataFlowSimulator:
    """Simulates multi-tier industrial data lifecycle from physical PLC to cloud AI & ERP."""

    def __init__(self):
        self.flock_batch_id = "FLOCK-2026-B08"
        self.farm_id = "farm-nanping-01"
        self.barn_id = "barn-03"

    # -------------------------------------------------------------
    # 1. LEVEL 0/1: FIELD SENSORS & INDUSTRIAL PLC
    # -------------------------------------------------------------
    def step_1_plc_raw(self, nh3_override: Optional[float] = None, low_silo: bool = False) -> Dict[str, Any]:
        """Generates raw 16-bit Modbus registers as read from Siemens S7-1500 / Rockwell PLC."""
        temp_raw = 224      # 22.4 C (scale 0.1)
        humidity_raw = 625  # 62.5 % (scale 0.1)
        nh3_raw = int((nh3_override if nh3_override is not None else 11.4) * 10)
        co2_raw = 1820      # 1820 ppm (scale 1.0)
        silo1_raw = 4500 if low_silo else 18500  # 4,500 kg (critical low) or 18,500 kg
        silo2_raw = 6500 if low_silo else 17200  # 6,500 kg (critical low) or 17,200 kg

        return {
            "tier_id": "TIER_01_PLC_FIELD",
            "system_name": "Siemens S7-1500 PLC & Field Probes",
            "protocol": "Modbus TCP / Profinet (Port 502)",
            "latency_ms": 1.2,
            "raw_registers": {
                "HR_40100_TEMP": temp_raw,
                "HR_40101_HUMIDITY": humidity_raw,
                "HR_40102_NH3": nh3_raw,
                "HR_40103_CO2": co2_raw,
                "HR_40200_SILO1_KG": silo1_raw,
                "HR_40202_SILO2_KG": silo2_raw,
            },
            "engineering_units": {
                "temperature_c": round(temp_raw * 0.1, 2),
                "humidity_pct": round(humidity_raw * 0.1, 2),
                "ammonia_ppm": round(nh3_raw * 0.1, 2),
                "co2_ppm": round(co2_raw * 1.0, 1),
                "silo_1_tonnage": round(silo1_raw / 1000.0, 2),
                "silo_2_tonnage": round(silo2_raw / 1000.0, 2),
            }
        }

    # -------------------------------------------------------------
    # 2. LEVEL 2: INDUSTRIAL EDGE GATEWAY (Welotec egOS)
    # -------------------------------------------------------------
    def step_2_edge_gateway(self, plc_data: Dict[str, Any]) -> Dict[str, Any]:
        """Edge protocol conversion and Sparkplug B / MQTT packaging."""
        eng = plc_data["engineering_units"]
        now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
        return {
            "tier_id": "TIER_02_EDGE_GATEWAY",
            "system_name": "Welotec egOS Industrial Edge Gateway (EG500)",
            "protocol": "MQTT v5 / Sparkplug B with TLS 1.3",
            "latency_ms": 4.8,
            "topic": f"sunner/{self.farm_id}/{self.barn_id}/zone-rear/climate",
            "payload": {
                "schema_version": "1.0.0",
                "gateway_id": "gw-welotec-np01-b03",
                "firmware": "egOS-v3.4.2-sunner",
                "timestamp": now_iso,
                "metrics": {
                    "temperature_celsius": eng["temperature_c"],
                    "relative_humidity_percent": eng["humidity_pct"],
                    "ammonia_nh3_ppm": eng["ammonia_ppm"],
                    "carbon_dioxide_co2_ppm": eng["co2_ppm"],
                    "air_velocity_mps": 1.25,
                    "static_pressure_pa": 28.5,
                },
                "silo_metrics": {
                    "silo_1_weight_kg": eng["silo_1_tonnage"] * 1000.0,
                    "silo_2_weight_kg": eng["silo_2_tonnage"] * 1000.0,
                    "total_feed_tons": eng["silo_1_tonnage"] + eng["silo_2_tonnage"],
                }
            }
        }

    # -------------------------------------------------------------
    # 3. LEVEL 3: SCADA, HISTORIAN & MES/MOM
    # -------------------------------------------------------------
    def step_3_scada_historian_mes(self, edge_data: Dict[str, Any]) -> Dict[str, Any]:
        """Plant floor supervisory control, time-series compression, and batch logging."""
        metrics = edge_data["payload"]["metrics"]
        nh3 = metrics["ammonia_nh3_ppm"]
        silo_tot = edge_data["payload"]["silo_metrics"]["total_feed_tons"]

        scada_alarm = "HI_HI_CRITICAL" if nh3 >= 20.0 else ("HI_WARNING" if nh3 >= 15.0 else "NORMAL")

        return {
            "tier_id": "TIER_03_PLANT_FLOOR_OT",
            "system_name": "Ignition SCADA + OSIsoft PI Historian + MES/MOM",
            "protocol": "OPC UA / PI Web API / ISA-88 Batch",
            "latency_ms": 18.5,
            "scada_hmi": {
                "tag_path": f"[Sunner_OT]/Nanping_01/Barn_03/Zone_Rear/NH3_PV",
                "alarm_state": scada_alarm,
                "ack_required": nh3 >= 20.0,
            },
            "historian_pi": {
                "pi_point": "NP01_B03_ZR_NH3.PV",
                "compression_type": "Swinging Door Ex deviation 0.05",
                "archived_value": nh3,
            },
            "mes_mom": {
                "batch_id": self.flock_batch_id,
                "flock_age_days": 26,
                "bird_count": 42500,
                "feed_conversion_ratio": 1.54,
                "biosecurity_status": "COMPLIANT",
            }
        }

    # -------------------------------------------------------------
    # 4. LEVEL 4: ENTERPRISE BUSINESS SYSTEMS (SAP S/4HANA ERP)
    # -------------------------------------------------------------
    def step_4_sap_erp(self, edge_data: Dict[str, Any], mes_data: Dict[str, Any]) -> Dict[str, Any]:
        """Material Management, feed consumption ledger, and automated PO generation."""
        silo_total = edge_data["payload"]["silo_metrics"]["total_feed_tons"]
        reorder_triggered = silo_total < 15.0

        po_details = None
        if reorder_triggered:
            po_details = {
                "bapi_function": "BAPI_PO_CREATE1",
                "purchase_order_number": "PO_4500892140",
                "material_code": "MAT-FEED-SOYA-500",
                "vendor_id": "VEND-FUJIAN-FEED-01",
                "quantity_tons": 25.0,
                "delivery_target_utc": (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)).isoformat(),
                "status": "APPROVED_AUTO_SIGNATURE",
                "estimated_cost_cny": 82500.0,
            }

        return {
            "tier_id": "TIER_04_SAP_ERP",
            "system_name": "SAP S/4HANA Cloud (Enterprise ERP)",
            "protocol": "SAP OData / BAPI RFC",
            "latency_ms": 65.0,
            "sap_material_document": {
                "material_id": "MAT-FEED-SOYA-500",
                "plant": "PLANT-NANPING-1000",
                "storage_location": "SILO-01-02",
                "current_stock_tons": round(silo_total, 1),
                "reorder_point_tons": 15.0,
                "reorder_triggered": reorder_triggered,
            },
            "automated_purchase_order": po_details,
        }

    # -------------------------------------------------------------
    # 5. LEVEL 5: CLOUD LAKEHOUSE (Snowflake) & PALANTIR FOUNDRY
    # -------------------------------------------------------------
    def step_5_snowflake_foundry(self, edge_data: Dict[str, Any], sap_data: Dict[str, Any]) -> Dict[str, Any]:
        """Snowflake Medallion Lakehouse and Palantir Foundry Object Ontology."""
        return {
            "tier_id": "TIER_05_LAKEHOUSE_ONTOLOGY",
            "system_name": "Snowflake Data Cloud + Palantir Foundry Ontology",
            "protocol": "Snowpipe Streaming / Foundry Archetype Sync",
            "latency_ms": 85.0,
            "snowflake_medallion": {
                "bronze_table": "SUNNER_LAKEHOUSE.BRONZE.RAW_MQTT_EVENTS",
                "silver_table": "SUNNER_LAKEHOUSE.SILVER.CLEAN_CLIMATE_TELEMETRY",
                "gold_table": "SUNNER_LAKEHOUSE.GOLD.FLOCK_DAILY_ECONOMICS",
                "sql_query_sample": "SELECT farm_id, barn_id, AVG(ammonia_ppm), SUM(kwh_cost_cny) FROM SILVER.CLEAN_CLIMATE GROUP BY 1,2",
            },
            "palantir_foundry_ontology": {
                "root_object": f"FlockBatchObject:{self.flock_batch_id}",
                "linked_objects": [
                    f"BarnZoneObject:barn-03/zone-rear",
                    f"FeedInventoryObject:SILO-01-02",
                    f"ERP_PurchaseOrderObject:{sap_data['automated_purchase_order']['purchase_order_number'] if sap_data['automated_purchase_order'] else 'NONE'}",
                    f"AnimalWelfareRiskObject:PROFILE_GREEN",
                ],
                "semantic_edges": [
                    "FlockBatch -[CONSUMES_FROM]-> FeedInventory",
                    "FlockBatch -[HOUSED_IN]-> BarnZone",
                    "FeedInventory -[REPLENISHED_BY]-> ERP_PurchaseOrder",
                ]
            }
        }

    # -------------------------------------------------------------
    # 6. LEVEL 6: NEO4J GRAPH TWIN & SNOWFLAKE CORTEX AI
    # -------------------------------------------------------------
    def step_6_twin_cortex_multiagent(
        self,
        edge_data: Dict[str, Any],
        sap_data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Digital Twin Graph sync, Snowflake Cortex AI LLM reasoning, and Multi-Agent decision."""
        metrics = edge_data["payload"]["metrics"]
        nh3 = metrics["ammonia_nh3_ppm"]
        silo_total = edge_data["payload"]["silo_metrics"]["total_feed_tons"]

        # Multi-Agent Coordination
        health_status = "CRITICAL_RESPIRATORY_HAZARD" if nh3 >= 20.0 else "NOMINAL"
        final_fan = 100.0 if nh3 >= 20.0 else 25.0
        rule = "RULE_H01_AMMONIA_EMERGENCY" if nh3 >= 20.0 else "RULE_E01_NOMINAL_OPTIMIZATION"

        # Snowflake Cortex AI natural language synthesis
        if nh3 >= 20.0:
            cortex_summary = (
                f"Cortex AI Anomaly Insight: Zone Rear ammonia surged to {nh3:.1f} ppm (threshold: 20 ppm). "
                f"Health Agent successfully overruled Energy Agent's peak tariff savings to protect 42,500 Cobb500 broilers. "
                f"Emergency 100% ventilation active. Estimated mortality risk mitigated: 99.8%."
            )
        else:
            cortex_summary = (
                f"Cortex AI Operational Briefing: House 03 operating in nominal eco-modulation. "
                f"Energy Agent reduced fan power to 25% during Peak Tariff, saving 7.2 kWh/hour (CNY 9.72/hr). "
                f"{'Supply Chain Agent triggered automated SAP PO for 25 tons feed replenishment.' if silo_total < 15.0 else 'Feed inventory is healthy (35.7t).'}"
            )

        return {
            "tier_id": "TIER_06_COGNITIVE_FABRIC",
            "system_name": "Neo4j Digital Twin + Snowflake Cortex AI + Multi-Agent Fabric",
            "protocol": "Bolt Protocol / Cortex LLM API / Agentic Event Bus",
            "latency_ms": 140.0,
            "neo4j_twin": {
                "nodes_updated": ["Farm:farm-nanping-01", "Barn:barn-03", "Zone:zone-rear", "Actuator:act-fan-tunnel-01"],
                "active_graph_edges": 12,
            },
            "multi_agent_decision": {
                "health_agent_proposed": 100.0 if nh3 >= 20.0 else 40.0,
                "energy_agent_proposed": 25.0,
                "supply_chain_agent_action": "TRIGGERED_SAP_BAPI_PO" if silo_total < 15.0 else "STOCK_OK",
                "final_commanded_fan_pct": final_fan,
                "overriding_rule": rule,
                "status": "OVERRULED_BY_HEALTH_CRITICAL" if nh3 >= 20.0 else "ENERGY_OPTIMIZATION_ACCEPTED",
            },
            "cortex_ai_executive_briefing": cortex_summary,
        }

    # -------------------------------------------------------------
    # END-TO-END EXECUTION RUNNER
    # -------------------------------------------------------------
    def run_full_enterprise_pipeline(
        self,
        nh3_override: Optional[float] = None,
        low_silo: bool = False,
    ) -> Dict[str, Any]:
        """Executes the complete 10-tier enterprise data pipeline."""
        start_time = datetime.datetime.now(datetime.timezone.utc)

        t1_plc = self.step_1_plc_raw(nh3_override=nh3_override, low_silo=low_silo)
        t2_edge = self.step_2_edge_gateway(t1_plc)
        t3_ot = self.step_3_scada_historian_mes(t2_edge)
        t4_erp = self.step_4_sap_erp(t2_edge, t3_ot)
        t5_lake = self.step_5_snowflake_foundry(t2_edge, t4_erp)
        t6_ai = self.step_6_twin_cortex_multiagent(t2_edge, t4_erp)

        total_latency_ms = sum([
            t1_plc["latency_ms"],
            t2_edge["latency_ms"],
            t3_ot["latency_ms"],
            t4_erp["latency_ms"],
            t5_lake["latency_ms"],
            t6_ai["latency_ms"],
        ])

        return {
            "pipeline_run_id": f"RUN-{int(start_time.timestamp())}",
            "timestamp": start_time.isoformat(),
            "total_latency_ms": round(total_latency_ms, 2),
            "tier_01_plc": t1_plc,
            "tier_02_edge": t2_edge,
            "tier_03_plant_ot": t3_ot,
            "tier_04_sap_erp": t4_erp,
            "tier_05_lakehouse_ontology": t5_lake,
            "tier_06_cortex_multiagent": t6_ai,
        }


def main():
    parser = argparse.ArgumentParser(description="Sunner Enterprise Industrial Data Flow Simulator")
    parser.add_argument("--inject-ammonia-hazard", action="store_true", help="Simulate ammonia hazard surge (28.5 ppm)")
    parser.add_argument("--trigger-low-silo", action="store_true", help="Simulate silo stock drop to trigger SAP Purchase Order")
    args = parser.parse_args()

    sim = EnterpriseDataFlowSimulator()
    nh3 = 28.5 if args.inject_ammonia_hazard else 11.4
    result = sim.run_full_enterprise_pipeline(nh3_override=nh3, low_silo=args.trigger_low_silo)

    print("\n================================================================================")
    print("      SUNNER ENTERPRISE INDUSTRIAL DATA FLOW: LEVEL 0 TO LEVEL 5+ PIPELINE      ")
    print("================================================================================")
    print(f"Pipeline Run ID: {result['pipeline_run_id']}")
    print(f"End-to-End Latency: {result['total_latency_ms']} ms across 10 Enterprise Tiers\n")

    print("[Tier 1: Siemens PLC Modbus Registers]")
    print(f"  Raw: {result['tier_01_plc']['raw_registers']}\n")

    print("[Tier 2: Welotec egOS Sparkplug B Payload]")
    print(f"  Topic: {result['tier_02_edge']['topic']}")
    print(f"  Metrics: {result['tier_02_edge']['payload']['metrics']}\n")

    print("[Tier 3: Ignition SCADA & OSIsoft PI Historian]")
    print(f"  SCADA Alarm: {result['tier_03_plant_ot']['scada_hmi']['alarm_state']}")
    print(f"  PI Point: {result['tier_03_plant_ot']['historian_pi']['pi_point']}\n")

    print("[Tier 4: SAP S/4HANA ERP Material Management]")
    print(f"  Stock: {result['tier_04_sap_erp']['sap_material_document']['current_stock_tons']} tons")
    if result['tier_04_sap_erp']['automated_purchase_order']:
        po = result['tier_04_sap_erp']['automated_purchase_order']
        print(f"  [ALERT] AUTO-PO GENERATED: {po['purchase_order_number']} for {po['quantity_tons']}t ({po['status']})\n")
    else:
        print("  Inventory Healthy. No PO required.\n")

    print("[Tier 5: Snowflake Lakehouse & Palantir Foundry Ontology]")
    print(f"  Foundry Root Object: {result['tier_05_lakehouse_ontology']['palantir_foundry_ontology']['root_object']}\n")

    print("[Tier 6: Snowflake Cortex AI & Autonomous Multi-Agent Fabric]")
    print(f"  Multi-Agent Decision: [{result['tier_06_cortex_multiagent']['multi_agent_decision']['status']}] "
          f"Fan={result['tier_06_cortex_multiagent']['multi_agent_decision']['final_commanded_fan_pct']}%")
    print(f"  Cortex Briefing: \"{result['tier_06_cortex_multiagent']['cortex_ai_executive_briefing']}\"\n")


if __name__ == "__main__":
    main()
