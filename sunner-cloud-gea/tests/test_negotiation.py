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


@pytest.fixture
def health_agent():
    return HealthAgent()


@pytest.fixture
def energy_agent():
    return EnergyAgent()


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


def test_cold_stress_triggers_heating(coordinator):
    """
    When temperature drops below safe threshold (Target - 2.5°C), heaters are engaged and draft is limited.
    """
    peak_time = datetime.datetime(2026, 8, 17, 10, 0, tzinfo=datetime.timezone.utc)
    cold_stress_metrics = {
        "temperature_celsius": 17.5,  # Cold stress (< 21.5 - 2.5 = 19.0)
        "relative_humidity_percent": 55.0,
        "ammonia_nh3_ppm": 8.0,
        "carbon_dioxide_co2_ppm": 1200.0,
    }

    decision = coordinator.process_telemetry_step(
        zone_id="zone-front",
        metrics=cold_stress_metrics,
        current_time=peak_time,
        target_temp_c=21.5,
    )

    assert decision["status"] == "HEALTH_SAFETY_OVERRIDE"
    assert decision["overriding_rule"] == "RULE_H03_THERMAL_SAFETY"
    assert decision["actuation_command"]["heater_state"] == "ON"
    assert decision["actuation_command"]["fan_speed_pct"] <= 30.0


def test_co2_hazard_boosts_ventilation(coordinator):
    """
    When CO2 exceeds 3000 ppm, ventilation boost is mandated.
    """
    peak_time = datetime.datetime(2026, 8, 17, 10, 0, tzinfo=datetime.timezone.utc)
    co2_hazard_metrics = {
        "temperature_celsius": 21.5,
        "relative_humidity_percent": 60.0,
        "ammonia_nh3_ppm": 10.0,
        "carbon_dioxide_co2_ppm": 3200.0,  # Critical CO2 hazard (>= 3000 ppm)
    }

    decision = coordinator.process_telemetry_step(
        zone_id="zone-mid",
        metrics=co2_hazard_metrics,
        current_time=peak_time,
    )

    assert decision["status"] == "HEALTH_SAFETY_OVERRIDE"
    assert decision["overriding_rule"] == "RULE_H02_AIR_QUALITY_SAFETY"
    assert decision["actuation_command"]["fan_speed_pct"] >= 80.0


def test_health_agent_welfare_scoring(health_agent):
    """
    Validates welfare scoring calculation and critical thresholds.
    """
    eval_nominal = health_agent.evaluate_zone_climate(
        zone_id="zone-mid",
        metrics={"temperature_celsius": 21.5, "ammonia_nh3_ppm": 8.0, "carbon_dioxide_co2_ppm": 1200.0},
        target_temp_c=21.5,
    )
    assert eval_nominal["alert_level"] == "NOMINAL"
    assert eval_nominal["welfare_score"] == 100.0
    assert eval_nominal["is_emergency"] is False


def test_energy_agent_tariff_tiers(energy_agent):
    """
    Validates China TOU tariff tier classification.
    """
    peak = energy_agent.get_current_tariff_period(9.5)  # 09:30 -> Peak
    valley = energy_agent.get_current_tariff_period(2.0)  # 02:00 -> Valley
    normal = energy_agent.get_current_tariff_period(14.0)  # 14:00 -> Normal

    assert peak["tier"] == "PEAK"
    assert peak["rate_cny_per_kwh"] == 1.35

    assert valley["tier"] == "VALLEY"
    assert valley["rate_cny_per_kwh"] == 0.38

    assert normal["tier"] == "NORMAL"
    assert normal["rate_cny_per_kwh"] == 0.78


def test_conflict_resolver_direct_resolution(resolver, health_agent, energy_agent):
    """
    Validates direct conflict resolution between Health and Energy proposals.
    """
    health_eval = health_agent.evaluate_zone_climate(
        zone_id="zone-rear",
        metrics={"temperature_celsius": 21.5, "ammonia_nh3_ppm": 22.0, "carbon_dioxide_co2_ppm": 1500.0},
    )
    energy_prop = energy_agent.propose_energy_actions(
        zone_id="zone-rear",
        current_time=datetime.datetime(2026, 8, 17, 10, 0, tzinfo=datetime.timezone.utc),
    )

    decision = resolver.resolve(health_eval, energy_prop)
    assert decision["status"] == "OVERRULED_BY_HEALTH_CRITICAL"
    assert decision["override_applied"] is True
    assert decision["actuation_command"]["fan_speed_pct"] == 100.0
