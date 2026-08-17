"""
Telemetry Simulator for Welotec egOS Industrial Gateways (Sunner Poultry Twin)
Generates high-fidelity climate, ammonia, CO2, and feed telemetry conforming to strict MQTT JSON schemas.
"""

import argparse
import datetime
import json
import logging
import math
import random
import sys
import time
from typing import Any, Dict, Optional

try:
    import paho.mqtt.client as mqtt
except ImportError:
    mqtt = None  # Handled gracefully in dry-run mode

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [WelotecEdge] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("WelotecTelemetry")


class FlockEnvironmentModel:
    """Simulates realistic barn physical & biological dynamics."""

    def __init__(self, flock_age_days: int = 24):
        self.flock_age_days = flock_age_days
        # Target temperature decreases as birds grow older
        self.target_temp = max(20.0, 32.0 - (flock_age_days * 0.4))
        self.current_temp = self.target_temp + random.uniform(-0.5, 0.5)
        self.current_humidity = 62.0
        self.current_nh3 = 11.5
        self.current_co2 = 1800.0
        self.silo_1_kg = 18500.0
        self.silo_2_kg = 17200.0
        self.daily_feed_consumed_kg = 1250.0

    def step(
        self,
        ventilation_pct: float = 40.0,
        inject_ammonia_spike: bool = False,
        inject_heat_spike: bool = False,
    ) -> Dict[str, float]:
        """Advance simulation by one time step (e.g. 5 seconds)."""
        now = datetime.datetime.now(datetime.timezone.utc)
        hour = now.hour + now.minute / 60.0

        # Ambient diurnal temperature oscillation
        ambient_temp = 22.0 + 8.0 * math.sin(math.radians((hour - 9) * 15))

        # Temperature dynamics with ventilation cooling / heating
        heat_from_birds = 0.05 * (self.flock_age_days / 35.0)
        cooling_effect = (ventilation_pct / 100.0) * (self.current_temp - ambient_temp) * 0.1
        self.current_temp += heat_from_birds - cooling_effect + random.uniform(-0.1, 0.1)

        # Ammonia generation from litter
        nh3_generation = 0.15 * (self.flock_age_days / 30.0)
        nh3_evacuation = (ventilation_pct / 100.0) * (self.current_nh3 * 0.08)
        self.current_nh3 = max(2.0, self.current_nh3 + nh3_generation - nh3_evacuation + random.uniform(-0.2, 0.2))

        # CO2 respiration
        co2_generation = 20.0
        co2_evacuation = (ventilation_pct / 100.0) * (self.current_co2 * 0.05)
        self.current_co2 = max(400.0, self.current_co2 + co2_generation - co2_evacuation + random.uniform(-10.0, 10.0))

        # Humidity dynamics
        self.current_humidity = max(35.0, min(85.0, self.current_humidity + random.uniform(-0.5, 0.5)))

        # Feed consumption
        feed_rate = 0.08 if 6.0 <= hour <= 20.0 else 0.02
        self.silo_1_kg = max(0.0, self.silo_1_kg - feed_rate)
        self.daily_feed_consumed_kg += feed_rate

        # Spike Injections for multi-agent stress testing
        if inject_ammonia_spike:
            self.current_nh3 = 26.5 + random.uniform(0.5, 3.5)
            logger.warning(f"[ALERT] INJECTING EMERGENCY AMMONIA SPIKE: {self.current_nh3:.2f} ppm")

        if inject_heat_spike:
            self.current_temp = 34.5 + random.uniform(0.2, 1.8)
            logger.warning(f"[ALERT] INJECTING THERMAL HEAT STRESS: {self.current_temp:.2f} C")

        return {
            "temperature_celsius": round(self.current_temp, 2),
            "relative_humidity_percent": round(self.current_humidity, 2),
            "ammonia_nh3_ppm": round(self.current_nh3, 2),
            "carbon_dioxide_co2_ppm": round(self.current_co2, 1),
            "air_velocity_mps": round(max(0.1, (ventilation_pct / 100.0) * 2.8 + random.uniform(-0.05, 0.05)), 2),
            "static_pressure_pa": round(25.0 + (ventilation_pct / 10.0) + random.uniform(-1.0, 1.0), 1),
        }


def generate_climate_payload(
    model: FlockEnvironmentModel,
    farm_id: str,
    barn_id: str,
    zone_id: str,
    gateway_id: str,
    inject_ammonia_spike: bool = False,
    inject_heat_spike: bool = False,
) -> Dict[str, Any]:
    """Builds a schema-compliant Climate telemetry dictionary."""
    metrics = model.step(
        ventilation_pct=45.0,
        inject_ammonia_spike=inject_ammonia_spike,
        inject_heat_spike=inject_heat_spike,
    )
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()

    return {
        "schema_version": "1.0.0",
        "gateway_id": gateway_id,
        "firmware_version": "egOS-v3.4.2-sunner",
        "timestamp": now_iso,
        "farm_id": farm_id,
        "barn_id": barn_id,
        "zone_id": zone_id,
        "metrics": metrics,
        "sensor_status": {
            "nh3_sensor": "GOOD" if metrics["ammonia_nh3_ppm"] < 50.0 else "DEGRADED",
            "temp_sensor": "GOOD",
            "humidity_sensor": "GOOD",
        },
    }


def generate_feed_payload(
    model: FlockEnvironmentModel,
    farm_id: str,
    barn_id: str,
    gateway_id: str,
) -> Dict[str, Any]:
    """Builds a schema-compliant Feed telemetry dictionary."""
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    return {
        "schema_version": "1.0.0",
        "gateway_id": gateway_id,
        "firmware_version": "egOS-v3.4.2-sunner",
        "timestamp": now_iso,
        "farm_id": farm_id,
        "barn_id": barn_id,
        "metrics": {
            "silo_1_weight_kg": round(model.silo_1_kg, 1),
            "silo_2_weight_kg": round(model.silo_2_kg, 1),
            "feed_consumed_daily_kg": round(model.daily_feed_consumed_kg, 1),
            "water_flow_liters_per_min": round(random.uniform(12.0, 18.5), 2),
            "feed_to_water_ratio": round(random.uniform(1.65, 1.85), 2),
        },
    }


def load_gateway_config(config_path: str = "config.yaml") -> Dict[str, Any]:
    """Loads default settings from config.yaml if available."""
    import os
    if os.path.exists(config_path):
        try:
            import yaml
            with open(config_path, "r", encoding="utf-8") as f:
                return yaml.safe_load(f) or {}
        except Exception:
            pass
    return {}


def main():
    cfg = load_gateway_config()
    gw_cfg = cfg.get("gateway", {})
    tel_cfg = cfg.get("telemetry", {})
    mqtt_cfg = cfg.get("mqtt", {})

    parser = argparse.ArgumentParser(description="Welotec egOS Industrial Telemetry Simulator")
    parser.add_argument("--broker", default=mqtt_cfg.get("broker_host", "localhost"), help="MQTT broker host")
    parser.add_argument("--port", type=int, default=mqtt_cfg.get("broker_port", 1883), help="MQTT broker port")
    parser.add_argument("--farm-id", default=tel_cfg.get("farm_id", "farm-nanping-01"), help="Sunner Farm ID")
    parser.add_argument("--barn-id", default=tel_cfg.get("barn_id", "barn-03"), help="Sunner Barn ID")
    parser.add_argument("--gateway-id", default=gw_cfg.get("id", "gw-welotec-np01-b03"), help="Gateway identifier")
    parser.add_argument("--interval", type=float, default=tel_cfg.get("sampling_interval_seconds", 3.0), help="Publish interval in seconds")
    parser.add_argument("--dry-run", action="store_true", help="Print payloads to stdout without connecting to MQTT")
    parser.add_argument("--count", type=int, default=0, help="Number of messages to emit (0 = infinite)")
    parser.add_argument("--inject-ammonia-spike", action="store_true", help="Simulate critical ammonia hazard (>20 ppm)")
    parser.add_argument("--inject-heat-spike", action="store_true", help="Simulate thermal heat stress (>34 C)")

    args = parser.parse_args()

    model = FlockEnvironmentModel(flock_age_days=26)
    logger.info(f"Initialized Welotec egOS Simulator for {args.farm_id}/{args.barn_id} (GW: {args.gateway_id})")

    client: Optional[Any] = None
    if not args.dry_run:
        if mqtt is None:
            logger.error("paho-mqtt is not installed. Run with --dry-run or install requirements.txt")
            sys.exit(1)
        client = mqtt.Client(client_id=args.gateway_id)
        try:
            client.connect(args.broker, args.port, 60)
            client.loop_start()
            logger.info(f"Connected to MQTT broker at {args.broker}:{args.port}")
        except Exception as e:
            logger.warning(f"Could not connect to MQTT broker ({e}). Falling back to dry-run mode.")
            client = None

    emitted = 0
    zones = tel_cfg.get("zones", ["zone-front", "zone-mid", "zone-rear"])

    try:
        while True:
            for zone in zones:
                # Climate telemetry
                climate_data = generate_climate_payload(
                    model=model,
                    farm_id=args.farm_id,
                    barn_id=args.barn_id,
                    zone_id=zone,
                    gateway_id=args.gateway_id,
                    inject_ammonia_spike=args.inject_ammonia_spike,
                    inject_heat_spike=args.inject_heat_spike,
                )
                topic = f"sunner/{args.farm_id}/{args.barn_id}/{zone}/climate"
                payload_str = json.dumps(climate_data, indent=2 if args.dry_run else None)

                if client:
                    client.publish(topic, payload_str, qos=1)
                    logger.info(f"Published to {topic}: NH3={climate_data['metrics']['ammonia_nh3_ppm']}ppm, T={climate_data['metrics']['temperature_celsius']}C")
                else:
                    logger.info(f"[DRY-RUN] Topic: {topic}\n{payload_str}")

            # Feed telemetry
            feed_data = generate_feed_payload(
                model=model,
                farm_id=args.farm_id,
                barn_id=args.barn_id,
                gateway_id=args.gateway_id,
            )
            feed_topic = f"sunner/{args.farm_id}/{args.barn_id}/silo/feed"
            feed_str = json.dumps(feed_data, indent=2 if args.dry_run else None)
            if client:
                client.publish(feed_topic, feed_str, qos=1)
                logger.info(f"Published to {feed_topic}: Silo1={feed_data['metrics']['silo_1_weight_kg']}kg")
            else:
                logger.info(f"[DRY-RUN] Topic: {feed_topic}\n{feed_str}")

            emitted += 1
            if args.count > 0 and emitted >= args.count:
                break

            time.sleep(args.interval)

    except KeyboardInterrupt:
        logger.info("Simulator stopped by user.")
    finally:
        if client:
            client.loop_stop()
            client.disconnect()


if __name__ == "__main__":
    main()
