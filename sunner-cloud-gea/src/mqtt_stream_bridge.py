"""
Live Edge-to-Cloud MQTT Stream Bridge & Actuation Controller (Team 2 & 3)
Subscribes to edge telemetry topics, syncs digital twin state in Neo4j,
executes Multi-Agent conflict resolution, and publishes actuation commands back to edge gateways.
"""

import argparse
import datetime
import json
import logging
import os
import sys
import time
from typing import Any, Dict, Optional

# Path setup for local imports
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.abspath(os.path.join(current_dir, ".."))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

try:
    import paho.mqtt.client as mqtt
except ImportError:
    mqtt = None

from ai_engine.coordinator import MultiAgentTwinCoordinator
from src.ingest_to_neo4j import Neo4jTwinIngester

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [StreamBridge] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("MQTTStreamBridge")


class MQTTStreamBridge:
    """End-to-end edge-cloud streaming pipeline with multi-agent closed-loop actuation."""

    def __init__(
        self,
        broker_host: str = "localhost",
        broker_port: int = 1883,
        neo4j_uri: str = "bolt://localhost:7687",
        client_id: str = "sunner-cloud-stream-bridge",
    ):
        self.broker_host = broker_host
        self.broker_port = broker_port
        self.client_id = client_id
        self.coordinator = MultiAgentTwinCoordinator()
        self.ingester = Neo4jTwinIngester(uri=neo4j_uri)
        self.mqtt_client: Optional[Any] = None

    def process_incoming_payload(self, topic: str, payload_str: str) -> Optional[Dict[str, Any]]:
        """Processes a single incoming MQTT payload through graph ingestion and multi-agent reasoning."""
        try:
            payload = json.loads(payload_str)
        except Exception as e:
            logger.error(f"Failed to decode JSON payload on {topic}: {e}")
            return None

        # 1. Update Graph Twin State
        if "climate" in topic:
            self.ingester.process_climate_telemetry(payload)

            # 2. Multi-Agent Reasoning Evaluation
            zone_id = payload.get("zone_id", "zone-rear")
            metrics = payload.get("metrics", {})
            decision = self.coordinator.process_telemetry_step(
                zone_id=zone_id,
                metrics=metrics,
            )

            # 3. Publish Actuation Command back to edge
            actuation_topic = f"sunner/{payload.get('farm_id', 'farm')}/{payload.get('barn_id', 'barn')}/{zone_id}/actuation"
            actuation_payload = {
                "schema_version": "1.0.0",
                "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                "zone_id": zone_id,
                "resolution_status": decision["status"],
                "overriding_rule": decision["overriding_rule"],
                "actuation": decision["actuation_command"],
                "audit_note": decision["audit_note"],
                "welfare_score": decision["welfare_score"],
            }

            if self.mqtt_client and self.mqtt_client.is_connected():
                self.mqtt_client.publish(actuation_topic, json.dumps(actuation_payload), qos=1)
                logger.info(f"Published Actuation -> {actuation_topic}: Fan={decision['actuation_command']['fan_speed_pct']}% [{decision['status']}]")

            return actuation_payload

        elif "feed" in topic:
            logger.info(f"Feed telemetry synced: Silo 1 = {payload.get('metrics', {}).get('silo_1_weight_kg')} kg")
            return payload

        return None

    def start(self, dry_run: bool = False):
        """Starts the live MQTT consumer loop."""
        if dry_run or mqtt is None:
            logger.info("Executing dry-run stream bridge cycle with sample edge packet...")
            sample_climate = {
                "schema_version": "1.0.0",
                "gateway_id": "gw-welotec-np01-b03",
                "firmware_version": "egOS-v3.4.2-sunner",
                "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                "farm_id": "farm-nanping-01",
                "barn_id": "barn-03",
                "zone_id": "zone-rear",
                "metrics": {
                    "temperature_celsius": 22.8,
                    "relative_humidity_percent": 63.4,
                    "ammonia_nh3_ppm": 23.6,  # Toxic respiratory hazard
                    "carbon_dioxide_co2_ppm": 2100.0,
                    "air_velocity_mps": 1.4,
                    "static_pressure_pa": 28.0,
                },
            }
            result = self.process_incoming_payload(
                "sunner/farm-nanping-01/barn-03/zone-rear/climate",
                json.dumps(sample_climate),
            )
            print("\n[Dry-Run Bridge Actuation Output]:")
            print(json.dumps(result, indent=2))
            return

        self.mqtt_client = mqtt.Client(client_id=self.client_id)

        def on_connect(client, userdata, flags, rc):
            logger.info(f"Stream Bridge connected to MQTT broker (rc={rc})")
            client.subscribe("sunner/+/+/+/climate", qos=1)
            client.subscribe("sunner/+/+/+/feed", qos=1)
            logger.info("Subscribed to topics: sunner/+/+/+/climate and sunner/+/+/+/feed")

        def on_message(client, userdata, msg):
            payload_str = msg.payload.decode("utf-8")
            self.process_incoming_payload(msg.topic, payload_str)

        self.mqtt_client.on_connect = on_connect
        self.mqtt_client.on_message = on_message

        try:
            self.mqtt_client.connect(self.broker_host, self.broker_port, 60)
            logger.info(f"Listening for edge telemetry on {self.broker_host}:{self.broker_port}...")
            self.mqtt_client.loop_forever()
        except KeyboardInterrupt:
            logger.info("Bridge stopped by user.")
        finally:
            if self.mqtt_client:
                self.mqtt_client.disconnect()
            self.ingester.close()


def main():
    parser = argparse.ArgumentParser(description="Sunner MQTT Stream Bridge & Multi-Agent Actuation Service")
    parser.add_argument("--broker", default="localhost", help="MQTT broker host")
    parser.add_argument("--port", type=int, default=1883, help="MQTT broker port")
    parser.add_argument("--neo4j", default="bolt://localhost:7687", help="Neo4j Bolt URI")
    parser.add_argument("--dry-run", action="store_true", help="Run a single synthetic packet evaluation without network dependencies")

    args = parser.parse_args()
    bridge = MQTTStreamBridge(broker_host=args.broker, broker_port=args.port, neo4j_uri=args.neo4j)
    bridge.start(dry_run=args.dry_run)


if __name__ == "__main__":
    main()
