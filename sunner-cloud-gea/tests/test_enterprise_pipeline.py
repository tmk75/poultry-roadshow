"""
Unit Tests for Enterprise Data Flow Simulation (ISA-95 Level 0-5+ Pipeline)
Verifies protocol conversions, SAP auto-PO generation, Snowflake Medallion schemas, and Cortex AI synthesis.
"""

import os
import sys
import pytest

# Ensure sunner-cloud-gea is in path
cloud_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if cloud_dir not in sys.path:
    sys.path.insert(0, cloud_dir)

from src.enterprise_data_pipeline import EnterpriseDataFlowSimulator


@pytest.fixture
def simulator():
    return EnterpriseDataFlowSimulator()


def test_plc_to_edge_conversion(simulator):
    """Verifies Modbus 16-bit register scaling to Welotec edge telemetry."""
    plc = simulator.step_1_plc_raw(nh3_override=14.5)
    edge = simulator.step_2_edge_gateway(plc)

    assert plc["engineering_units"]["temperature_c"] == 22.4
    assert plc["engineering_units"]["ammonia_ppm"] == 14.5
    assert edge["payload"]["schema_version"] == "1.0.0"
    assert edge["payload"]["metrics"]["temperature_celsius"] == 22.4
    assert edge["payload"]["metrics"]["ammonia_nh3_ppm"] == 14.5


def test_sap_auto_purchase_order_trigger_when_silo_low(simulator):
    """Verifies that SAP S/4HANA BAPI_PO_CREATE1 is generated when feed drops < 15 tons."""
    # Low silo condition (4.5t + 6.5t = 11.0t < 15.0t)
    plc_low = simulator.step_1_plc_raw(low_silo=True)
    edge_low = simulator.step_2_edge_gateway(plc_low)
    ot = simulator.step_3_scada_historian_mes(edge_low)
    sap = simulator.step_4_sap_erp(edge_low, ot)

    assert sap["sap_material_document"]["reorder_triggered"] is True
    assert sap["automated_purchase_order"] is not None
    po = sap["automated_purchase_order"]
    assert po["bapi_function"] == "BAPI_PO_CREATE1"
    assert po["quantity_tons"] == 25.0
    assert po["vendor_id"] == "VEND-FUJIAN-FEED-01"
    assert po["status"] == "APPROVED_AUTO_SIGNATURE"


def test_snowflake_and_foundry_ontology_linkage(simulator):
    """Verifies Snowflake Lakehouse Medallion tables and Palantir Foundry object graph."""
    plc = simulator.step_1_plc_raw()
    edge = simulator.step_2_edge_gateway(plc)
    ot = simulator.step_3_scada_historian_mes(edge)
    sap = simulator.step_4_sap_erp(edge, ot)
    lake = simulator.step_5_snowflake_foundry(edge, sap)

    assert "BRONZE" in lake["snowflake_medallion"]["bronze_table"]
    assert "SILVER" in lake["snowflake_medallion"]["silver_table"]
    assert "GOLD" in lake["snowflake_medallion"]["gold_table"]
    assert "FLOCK-2026-B08" in lake["palantir_foundry_ontology"]["root_object"]
    assert len(lake["palantir_foundry_ontology"]["semantic_edges"]) >= 3


def test_full_enterprise_pipeline_ammonia_emergency(simulator):
    """Verifies end-to-end multi-tier response during critical ammonia surge."""
    result = simulator.run_full_enterprise_pipeline(nh3_override=28.5)

    assert result["total_latency_ms"] < 500.0  # Real-time sub-second pipeline
    assert result["tier_03_plant_ot"]["scada_hmi"]["alarm_state"] == "HI_HI_CRITICAL"
    assert result["tier_06_cortex_multiagent"]["multi_agent_decision"]["status"] == "OVERRULED_BY_HEALTH_CRITICAL"
    assert result["tier_06_cortex_multiagent"]["multi_agent_decision"]["final_commanded_fan_pct"] == 100.0
    assert "Cortex AI Anomaly Insight" in result["tier_06_cortex_multiagent"]["cortex_ai_executive_briefing"]
