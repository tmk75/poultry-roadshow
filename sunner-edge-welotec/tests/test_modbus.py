"""
Unit Tests for Modbus Driver & Register Decoding (Team 1 Edge QA)
"""

import os
import sys
import jsonschema
import pytest

# Ensure sunner-edge-welotec is in sys.path
edge_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if edge_dir not in sys.path:
    sys.path.insert(0, edge_dir)

try:
    from src.modbus_driver import ModbusRegisterDecoder, WelotecModbusGateway
except ImportError:
    edge_src = os.path.join(edge_dir, "src")
    if edge_src not in sys.path:
        sys.path.insert(0, edge_src)
    from modbus_driver import ModbusRegisterDecoder, WelotecModbusGateway


def test_modbus_int16_decoding():
    # 218 with scale 0.1 -> 21.8 °C
    decoded = ModbusRegisterDecoder.decode([218], "int16", scale=0.1)
    assert decoded == 21.8


def test_modbus_uint32_decoding():
    # 32-bit: MSW=0, LSW=18500 -> 18500.0 kg
    decoded = ModbusRegisterDecoder.decode([0, 18500], "uint32", scale=1.0)
    assert decoded == 18500.0


def test_modbus_polled_payload_conforms_to_schema():
    gateway = WelotecModbusGateway()
    payload = gateway.poll_climate_payload("zone-rear")

    assert payload["schema_version"] == "1.0.0"
    assert payload["metrics"]["temperature_celsius"] == 22.6
    assert payload["metrics"]["ammonia_nh3_ppm"] == 11.4
    assert payload["metrics"]["relative_humidity_percent"] == 62.5
