"""
Health & Biosecurity Agent (Team 3)
Continuously monitors flock physiological indicators, ammonia respiratory toxicity, and thermal welfare.
"""

from typing import Any, Dict


class HealthAgent:
    """Agent focused strictly on bird welfare, respiratory health, and biosecurity."""

    def __init__(self, agent_id: str = "agent-health-01"):
        self.agent_id = agent_id
        self.nh3_critical_threshold_ppm = 20.0
        self.nh3_warning_threshold_ppm = 15.0
        self.co2_critical_threshold_ppm = 3000.0

    def evaluate_zone_climate(
        self,
        zone_id: str,
        metrics: Dict[str, float],
        target_temp_c: float = 21.5,
    ) -> Dict[str, Any]:
        """Evaluates climate telemetry and generates health directives."""
        temp = metrics.get("temperature_celsius", target_temp_c)
        nh3 = metrics.get("ammonia_nh3_ppm", 10.0)
        co2 = metrics.get("carbon_dioxide_co2_ppm", 1500.0)

        alert_level = "NOMINAL"
        directives = []
        target_fan_pct = 40.0
        target_heater_state = "OFF"
        target_pad_state = "OFF"

        # 1. Ammonia Respiratory Safety (Tier 1 Priority)
        if nh3 >= self.nh3_critical_threshold_ppm:
            alert_level = "CRITICAL_RESPIRATORY_HAZARD"
            target_fan_pct = 100.0  # Force maximum tunnel ventilation
            directives.append(
                f"RULE_H01_AMMONIA_EMERGENCY: NH3 is {nh3:.1f} ppm (>= {self.nh3_critical_threshold_ppm} ppm). "
                f"Emergency 100% ventilation required."
            )
        elif nh3 >= self.nh3_warning_threshold_ppm:
            alert_level = "ELEVATED_RESPIRATORY_RISK"
            target_fan_pct = max(target_fan_pct, 65.0)
            directives.append(f"RULE_H01_AMMONIA_WARNING: NH3 is {nh3:.1f} ppm. Increase ventilation to 65%.")

        # 2. CO2 Safety
        if co2 >= self.co2_critical_threshold_ppm:
            if alert_level == "NOMINAL":
                alert_level = "CRITICAL_CO2_HAZARD"
            target_fan_pct = max(target_fan_pct, 80.0)
            directives.append(f"RULE_H02_CO2_OVERLIMIT: CO2 is {co2:.0f} ppm. Ventilation boost required.")

        # 3. Thermal Comfort Bounds (Tier 2 Priority)
        temp_delta = temp - target_temp_c
        if temp_delta > 2.5:
            if alert_level == "NOMINAL":
                alert_level = "HEAT_STRESS"
            target_pad_state = "ON"
            target_fan_pct = max(target_fan_pct, 85.0)
            directives.append(f"RULE_H03_HEAT_STRESS: Temp is {temp:.1f}°C (> {target_temp_c + 2.5}°C). Cool pads ON.")
        elif temp_delta < -2.5:
            if alert_level == "NOMINAL":
                alert_level = "COLD_STRESS"
            target_heater_state = "ON"
            target_fan_pct = min(target_fan_pct, 30.0)  # Reduce cold air draft while maintaining min air
            directives.append(f"RULE_H03_COLD_STRESS: Temp is {temp:.1f}°C (< {target_temp_c - 2.5}°C). Heaters ON.")

        return {
            "agent_id": self.agent_id,
            "zone_id": zone_id,
            "alert_level": alert_level,
            "is_emergency": "CRITICAL" in alert_level or alert_level in ["HEAT_STRESS", "COLD_STRESS"],
            "proposed_fan_speed_pct": target_fan_pct,
            "proposed_heater_state": target_heater_state,
            "proposed_pad_state": target_pad_state,
            "directives": directives,
            "welfare_score": max(0.0, 100.0 - (max(0.0, nh3 - 10.0) * 3.5) - (abs(temp_delta) * 5.0)),
        }
