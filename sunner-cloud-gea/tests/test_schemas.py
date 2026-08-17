"""
Schema Validation Tests (Team 4 QA & Governance)
Verifies that Welotec edge payloads conform to JSON Schema definitions.
"""

import json
import os
import jsonschema
import pytest

SCHEMA_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "sunner-edge-welotec", "schemas")
)


def load_schema(schema_filename: str):
    path = os.path.join(SCHEMA_DIR, schema_filename)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def test_valid_climate_payload():
    schema = load_schema("climate_telemetry.schema.json")
    valid_payload = {
        "schema_version": "1.0.0",
        "gateway_id": "gw-welotec-np01-b03",
        "firmware_version": "egOS-v3.4.2-sunner",
        "timestamp": "2026-08-17T15:30:00.000Z",
        "farm_id": "farm-nanping-01",
        "barn_id": "barn-03",
        "zone_id": "zone-front",
        "metrics": {
            "temperature_celsius": 21.4,
            "relative_humidity_percent": 62.5,
            "ammonia_nh3_ppm": 12.3,
            "carbon_dioxide_co2_ppm": 1650.0,
            "air_velocity_mps": 1.25,
            "static_pressure_pa": 27.0,
        },
        "sensor_status": {
            "nh3_sensor": "GOOD",
            "temp_sensor": "GOOD",
            "humidity_sensor": "GOOD",
        },
    }
    jsonschema.validate(instance=valid_payload, schema=schema)


def test_invalid_climate_payload_missing_required():
    schema = load_schema("climate_telemetry.schema.json")
    invalid_payload = {
        "schema_version": "1.0.0",
        "gateway_id": "gw-welotec-np01-b03",
        # Missing timestamp, farm_id, barn_id, zone_id, metrics
    }
    with pytest.raises(jsonschema.ValidationError):
        jsonschema.validate(instance=invalid_payload, schema=schema)


def test_valid_feed_payload():
    schema = load_schema("feed_telemetry.schema.json")
    valid_payload = {
        "schema_version": "1.0.0",
        "gateway_id": "gw-welotec-np01-b03",
        "firmware_version": "egOS-v3.4.2-sunner",
        "timestamp": "2026-08-17T15:30:00.000Z",
        "farm_id": "farm-nanping-01",
        "barn_id": "barn-03",
        "metrics": {
            "silo_1_weight_kg": 18450.0,
            "silo_2_weight_kg": 17200.0,
            "feed_consumed_daily_kg": 1280.0,
            "water_flow_liters_per_min": 14.5,
            "feed_to_water_ratio": 1.72,
        },
    }
    jsonschema.validate(instance=valid_payload, schema=schema)
