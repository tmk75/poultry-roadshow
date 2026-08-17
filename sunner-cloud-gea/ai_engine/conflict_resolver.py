"""
Conflict Resolution Engine (Team 3 Multi-Agent Logic)
Implements negotiation rules: Health Agent respiratory alerts ALWAYS override Energy Agent cost-saving requests.
"""

import datetime
from typing import Any, Dict


class NegotiationConflictResolver:
    """Enforces strict animal welfare over energy optimization hierarchy."""

    def resolve(
        self,
        health_assessment: Dict[str, Any],
        energy_proposal: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Resolves conflicting actuation requests between HealthAgent and EnergyAgent.
        Returns the authoritative actuation decision along with audit trail metadata.
        """
        timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()
        zone_id = health_assessment.get("zone_id", "unknown")

        health_fan = health_assessment.get("proposed_fan_speed_pct", 40.0)
        energy_fan = energy_proposal.get("proposed_fan_speed_pct", 40.0)
        alert_level = health_assessment.get("alert_level", "NOMINAL")
        directives = health_assessment.get("directives", [])

        final_fan_speed_pct: float
        override_applied: bool = False
        overriding_rule: str = "NONE_CONSENSUS"
        resolution_status: str = "CONSENSUS"
        audit_note: str

        # -------------------------------------------------------------
        # TIER 1: Critical Respiratory Hazard (Ammonia Alerts)
        # Health Agent ALWAYS Overrides Energy Agent
        # -------------------------------------------------------------
        if alert_level == "CRITICAL_RESPIRATORY_HAZARD" or any("AMMONIA_EMERGENCY" in d for d in directives):
            final_fan_speed_pct = health_fan
            override_applied = True
            overriding_rule = "RULE_H01_AMMONIA_EMERGENCY"
            resolution_status = "OVERRULED_BY_HEALTH_CRITICAL"
            audit_note = (
                f"Health Agent Critical Alert ({alert_level}) strictly overrules Energy Agent's "
                f"cost-saving curtailment request ({energy_fan}% -> forced to {health_fan}%). "
                f"Active Tariff: {energy_proposal.get('tariff_tier', 'UNKNOWN')}."
            )

        # -------------------------------------------------------------
        # TIER 2: Thermal Safety Invariants & Secondary Warnings
        # -------------------------------------------------------------
        elif alert_level in ["ELEVATED_RESPIRATORY_RISK", "CRITICAL_CO2_HAZARD", "HEAT_STRESS", "COLD_STRESS"] or any("HEAT_STRESS" in d for d in directives):
            if alert_level == "COLD_STRESS":
                final_fan_speed_pct = health_fan
            else:
                final_fan_speed_pct = max(health_fan, energy_fan)
            override_applied = (final_fan_speed_pct != energy_fan)
            overriding_rule = "RULE_H03_THERMAL_SAFETY" if "STRESS" in alert_level else "RULE_H02_AIR_QUALITY_SAFETY"
            resolution_status = "HEALTH_SAFETY_OVERRIDE"
            audit_note = f"Health safety requires {health_fan}% fan speed. Energy proposal ({energy_fan}%) adjusted."

        # -------------------------------------------------------------
        # TIER 3: Nominal Operation - Safe Energy Optimization Allowed
        # -------------------------------------------------------------
        else:
            final_fan_speed_pct = energy_fan
            overriding_rule = "RULE_E01_NOMINAL_OPTIMIZATION"
            resolution_status = "ENERGY_OPTIMIZATION_ACCEPTED"
            audit_note = f"Welfare parameters within green bounds. Energy Agent's {energy_fan}% fan speed accepted."

        final_heater = health_assessment.get("proposed_heater_state", "OFF")
        final_pad = health_assessment.get("proposed_pad_state", "OFF")

        return {
            "timestamp": timestamp,
            "zone_id": zone_id,
            "status": resolution_status,
            "override_applied": override_applied,
            "overriding_rule": overriding_rule,
            "audit_note": audit_note,
            "health_proposed_fan_pct": health_fan,
            "energy_proposed_fan_pct": energy_fan,
            "actuation_command": {
                "fan_speed_pct": final_fan_speed_pct,
                "heater_state": final_heater,
                "cool_pad_state": final_pad,
            },
            "welfare_score": health_assessment.get("welfare_score", 100.0),
            "tariff_tier": energy_proposal.get("tariff_tier", "NORMAL"),
        }
