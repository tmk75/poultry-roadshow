"""
Multi-Agent Orchestration Coordinator (Team 3)
Coordinates HealthAgent, EnergyAgent, and NegotiationConflictResolver on live or simulated telemetry feeds.
"""

import datetime
import json
import logging
import os
import sys
from typing import Any, Dict

# Support direct and package execution
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.abspath(os.path.join(current_dir, ".."))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

try:
    from ai_engine.conflict_resolver import NegotiationConflictResolver
    from ai_engine.energy_agent import EnergyAgent
    from ai_engine.health_agent import HealthAgent
except ImportError:
    from conflict_resolver import NegotiationConflictResolver
    from energy_agent import EnergyAgent
    from health_agent import HealthAgent

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [Coordinator] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("MultiAgentCoordinator")


class MultiAgentTwinCoordinator:
    """Orchestrates multi-agent evaluations and emits verified actuation commands."""

    def __init__(self):
        self.health_agent = HealthAgent(agent_id="agent-health-flock-01")
        self.energy_agent = EnergyAgent(agent_id="agent-energy-grid-01")
        self.resolver = NegotiationConflictResolver()

    def process_telemetry_step(
        self,
        zone_id: str,
        metrics: Dict[str, float],
        current_time: datetime.datetime = None,
        target_temp_c: float = 21.5,
    ) -> Dict[str, Any]:
        """Runs a complete evaluation cycle across all agents and resolves conflicts."""
        if current_time is None:
            current_time = datetime.datetime.now(datetime.timezone.utc)

        # 1. Health Agent evaluation
        health_assessment = self.health_agent.evaluate_zone_climate(
            zone_id=zone_id,
            metrics=metrics,
            target_temp_c=target_temp_c,
        )

        # 2. Energy Agent proposal
        energy_proposal = self.energy_agent.propose_energy_actions(
            zone_id=zone_id,
            current_time=current_time,
        )

        # 3. Conflict Resolution
        decision = self.resolver.resolve(
            health_assessment=health_assessment,
            energy_proposal=energy_proposal,
        )

        logger.info(
            f"Zone {zone_id} Decision: [{decision['status']}] Rule={decision['overriding_rule']} "
            f"Fan={decision['actuation_command']['fan_speed_pct']}% (Health proposed: {decision['health_proposed_fan_pct']}%, "
            f"Energy proposed: {decision['energy_proposed_fan_pct']}%)"
        )
        return decision


if __name__ == "__main__":
    coordinator = MultiAgentTwinCoordinator()

    print("\n================================================================================")
    print("--- SCENARIO 1: Nominal Conditions During Peak Tariff (Energy saving allowed) ---")
    print("================================================================================")
    peak_time = datetime.datetime(2026, 8, 17, 9, 30, tzinfo=datetime.timezone.utc)  # 09:30 is Peak
    nominal_metrics = {
        "temperature_celsius": 21.6,
        "relative_humidity_percent": 60.0,
        "ammonia_nh3_ppm": 8.5,  # Well below 20 ppm
        "carbon_dioxide_co2_ppm": 1400.0,
    }
    decision1 = coordinator.process_telemetry_step("zone-rear", nominal_metrics, current_time=peak_time)
    print(json.dumps(decision1, indent=2))

    print("\n=================================================================================")
    print("--- SCENARIO 2: Emergency Ammonia Spike During Peak Tariff (Health OVERRULES Energy) ---")
    print("=================================================================================")
    emergency_metrics = {
        "temperature_celsius": 21.8,
        "relative_humidity_percent": 68.0,
        "ammonia_nh3_ppm": 25.4,  # Critical hazard! (> 20.0 ppm)
        "carbon_dioxide_co2_ppm": 2100.0,
    }
    decision2 = coordinator.process_telemetry_step("zone-rear", emergency_metrics, current_time=peak_time)
    print(json.dumps(decision2, indent=2))
