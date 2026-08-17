"""
Energy Optimization Agent (Team 3)
Monitors time-of-use electricity tariffs, power draws, and proposes cost-saving HVAC curtailments.
"""

import datetime
from typing import Any, Dict


class EnergyAgent:
    """Agent focused on minimizing power expenditure and peak tariff demand."""

    def __init__(self, agent_id: str = "agent-energy-01"):
        self.agent_id = agent_id

    def get_current_tariff_period(self, hour: float) -> Dict[str, Any]:
        """China Industrial Time-of-Use (TOU) tariff tier classifier."""
        # Peak: 08:30-11:30, 18:30-21:30 (¥1.35/kWh)
        # Valley: 23:00-07:00 (¥0.38/kWh)
        # Normal: all other hours (¥0.78/kWh)
        if (8.5 <= hour <= 11.5) or (18.5 <= hour <= 21.5):
            return {"tier": "PEAK", "rate_cny_per_kwh": 1.35, "urgency": "HIGH_CURTAILMENT"}
        elif hour >= 23.0 or hour < 7.0:
            return {"tier": "VALLEY", "rate_cny_per_kwh": 0.38, "urgency": "ALLOW_FULL_POWER"}
        else:
            return {"tier": "NORMAL", "rate_cny_per_kwh": 0.78, "urgency": "MODERATE_SAVING"}

    def propose_energy_actions(
        self,
        zone_id: str,
        current_fan_speed_pct: float = 50.0,
        current_time: datetime.datetime = None,
    ) -> Dict[str, Any]:
        """Proposes energy-optimized actuation changes."""
        if current_time is None:
            current_time = datetime.datetime.now(datetime.timezone.utc)
        
        hour = current_time.hour + current_time.minute / 60.0
        tariff = self.get_current_tariff_period(hour)

        proposed_fan_speed_pct = current_fan_speed_pct
        justification = ""

        if tariff["tier"] == "PEAK":
            # Aggressive cost cutting during peak tariffs
            proposed_fan_speed_pct = 25.0
            justification = f"PEAK tariff active ({tariff['rate_cny_per_kwh']} CNY/kWh). Throttling fans to 25% to minimize grid cost."
        elif tariff["tier"] == "NORMAL":
            proposed_fan_speed_pct = 40.0
            justification = f"NORMAL tariff active ({tariff['rate_cny_per_kwh']} CNY/kWh). Standard eco-modulation."
        else:
            proposed_fan_speed_pct = 60.0
            justification = f"VALLEY tariff active ({tariff['rate_cny_per_kwh']} CNY/kWh). Full power permitted."

        return {
            "agent_id": self.agent_id,
            "zone_id": zone_id,
            "tariff_tier": tariff["tier"],
            "electricity_rate_cny": tariff["rate_cny_per_kwh"],
            "proposed_fan_speed_pct": proposed_fan_speed_pct,
            "proposed_heater_state": "OFF" if tariff["tier"] == "PEAK" else "AUTO",
            "proposed_pad_state": "OFF" if tariff["tier"] == "PEAK" else "AUTO",
            "justification": justification,
        }
