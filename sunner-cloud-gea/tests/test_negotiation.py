"""
Test Suite for Multi-Agent Conflict Resolution & Negotiation Rules
Verifies that Health Agent respiratory alerts ALWAYS overrule Energy Agent curtailments.
"""

import datetime
import os
import sys
import pytest

# Ensure sunner-cloud-gea is in Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.abspath(os.path.join(current_dir, ".."))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from ai_engine.conflict_resolver import NegotiationConflictResolver
from ai_engine.coordinator import MultiAgentTwinCoordinator
from ai_engine.energy_agent import EnergyAgent
from ai_engine.health_agent import HealthAgent


@pytest.fixture
def coordinator():
    return MultiAgentTwinCoordinator()


@pytest.fixture
def resolver():
    return NegotiationConflictResolver()


def test_ammonia_hazard_overrules_peak_tariff(coordinator):
    """
    Core Invariant: When NH3 >= 20.0 ppm, Health Agent requires 100% ventilation.
    Energy Agent wants 25% ventilation due to Peak Tariff.
    Resolver MUST enforce 100% fan speed with OVERRULED_BY_HEALTH_CRITICAL status.
    """
    peak_time = datetime.datetime(2026, 8, 17, 10, 0, tzinfo=datetime.timezone.utc)  # 10:00 = Peak Tariff
    toxic_metrics = {
        "temperature_celsius": 21.5,
        "relative_humidity_percent": 65.0,
        "ammonia_nh3_ppm": 24.5,  # Toxic respiratory hazard
        "carbon_dioxide_co2_ppm": 1600.0,
    }

    decision = coordinator.process_telemetry_step(
        zone_id="zone-rear",
        metrics=toxic_metrics,
        current_time=peak_time,
    )

    assert decision["status"] == "OVERRULED_BY_HEALTH_CRITICAL"
    assert decision["overriding_rule"] == "RULE_H01_AMMONIA_EMERGENCY"
    assert decision["override_applied"] is True
    assert decision["actuation_command"]["fan_speed_pct"] == 100.0
    assert decision["energy_proposed_fan_pct"] == 25.0
    assert decision["health_proposed_fan_pct"] == 100.0
    assert "Health Agent Critical Alert" in decision["audit_note"]


def test_nominal_conditions_permit_energy_saving(coordinator):
    """
    When all environmental metrics are green, Energy Agent's peak tariff savings are accepted.
    """
    peak_time = datetime.datetime(2026, 8, 17, 10, 0, tzinfo=datetime.timezone.utc)
    safe_metrics = {
        "temperature_celsius": 21.5,
        "relative_humidity_percent": 58.0,
        "ammonia_nh3_ppm": 8.0,   # Safe
        "carbon_dioxide_co2_ppm": 1200.0,  # Safe
    }

    decision = coordinator.process_telemetry_step(
        zone_id="zone-mid",
        metrics=safe_metrics,
        current_time=peak_time,
    )

    assert decision["status"] == "ENERGY_OPTIMIZATION_ACCEPTED"
    assert decision["overriding_rule"] == "RULE_E01_NOMINAL_OPTIMIZATION"
    assert decision["actuation_command"]["fan_speed_pct"] == 25.0  # Eco-saving allowed


def test_heat_stress_overrides_energy(coordinator):
    """
    When temperature exceeds safe threshold, cooling takes precedence over energy curtailment.
    """
    peak_time = datetime.datetime(2026, 8, 17, 10, 0, tzinfo=datetime.timezone.utc)
    heat_stress_metrics = {
        "temperature_celsius": 32.0,  # Severe heat (target is 21.5)
        "relative_humidity_percent": 70.0,
        "ammonia_nh3_ppm": 12.0,
        "carbon_dioxide_co2_ppm": 1500.0,
    }

    decision = coordinator.process_telemetry_step(
        zone_id="zone-front",
        metrics=heat_stress_metrics,
        current_time=peak_time,
        target_temp_c=21.5,
    )

    assert decision["actuation_command"]["fan_speed_pct"] >= 85.0
    assert decision["actuation_command"]["cool_pad_state"] == "ON"
