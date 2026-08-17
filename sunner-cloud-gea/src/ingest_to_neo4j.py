"""
Stream Ingestion Engine: Welotec MQTT / Azure IoT Hub -> Neo4j Digital Twin
Parses edge telemetry payloads, updates graph digital twin state, and triggers AI agent evaluations.
"""

import datetime
import json
import logging
import sys
from typing import Any, Dict, Optional

try:
    from neo4j import GraphDatabase
except ImportError:
    GraphDatabase = None

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [CloudIngest] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("Neo4jIngest")


class Neo4jTwinIngester:
    """Manages digital twin graph synchronization for poultry telemetry."""

    def __init__(self, uri: str = "bolt://localhost:7687", auth: tuple = ("neo4j", "SunnerSmartTwin#2026")):
        self.uri = uri
        self.auth = auth
        self._driver = None
        if GraphDatabase is not None:
            try:
                driver = GraphDatabase.driver(self.uri, auth=self.auth)
                driver.verify_connectivity()
                self._driver = driver
                logger.info(f"Connected to Neo4j graph at {self.uri}")
            except Exception as e:
                logger.warning(f"Could not connect to live Neo4j database ({e}). Operating in memory-projection mode.")
                self._driver = None

    def close(self):
        if self._driver:
            self._driver.close()

    def process_climate_telemetry(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Updates Zone state in graph and returns updated digital twin projection."""
        farm_id = payload.get("farm_id", "unknown")
        barn_id = payload.get("barn_id", "unknown")
        zone_id = payload.get("zone_id", "unknown")
        metrics = payload.get("metrics", {})
        timestamp = payload.get("timestamp", datetime.datetime.now(datetime.timezone.utc).isoformat())

        query = """
        MERGE (f:Farm {id: $farm_id})
        MERGE (b:Barn {id: $barn_id})
        MERGE (f)-[:HAS_BARN]->(b)
        MERGE (z:Zone {id: $zone_id})
        MERGE (b)-[:HAS_ZONE]->(z)
        SET z.last_temperature_c = $temp,
            z.last_humidity_pct = $humidity,
            z.last_nh3_ppm = $nh3,
            z.last_co2_ppm = $co2,
            z.last_air_velocity_mps = $velocity,
            z.last_updated = $timestamp
        RETURN z.id AS zone_id, z.last_nh3_ppm AS nh3, z.last_temperature_c AS temp
        """
        params = {
            "farm_id": farm_id,
            "barn_id": barn_id,
            "zone_id": zone_id,
            "temp": metrics.get("temperature_celsius", 0.0),
            "humidity": metrics.get("relative_humidity_percent", 0.0),
            "nh3": metrics.get("ammonia_nh3_ppm", 0.0),
            "co2": metrics.get("carbon_dioxide_co2_ppm", 0.0),
            "velocity": metrics.get("air_velocity_mps", 0.0),
            "timestamp": timestamp,
        }

        if self._driver:
            try:
                with self._driver.session() as session:
                    result = session.run(query, params)
                    record = result.single()
                    logger.info(f"Updated Neo4j Zone {zone_id}: NH3={params['nh3']}ppm, Temp={params['temp']}C")
                    return dict(record) if record else params
            except Exception as e:
                logger.warning(f"Neo4j write failed ({e}). Falling back to memory projection.")

        # Memory projection fallback
        logger.info(f"[Graph Memory Projection] Zone {zone_id} state updated: NH3={params['nh3']}ppm, Temp={params['temp']}C")
        return params


def simulate_ingestion_pipeline():
    """Demonstrates live payload ingestion."""
    ingester = Neo4jTwinIngester()
    sample_payload = {
        "schema_version": "1.0.0",
        "gateway_id": "gw-welotec-np01-b03",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "farm_id": "farm-nanping-01",
        "barn_id": "barn-03",
        "zone_id": "zone-rear",
        "metrics": {
            "temperature_celsius": 23.4,
            "relative_humidity_percent": 64.2,
            "ammonia_nh3_ppm": 24.8,  # Ammonia surge
            "carbon_dioxide_co2_ppm": 2450.0,
            "air_velocity_mps": 1.8,
            "static_pressure_pa": 28.5,
        },
    }

    result = ingester.process_climate_telemetry(sample_payload)
    print("Ingestion processed successfully:", json.dumps(result, indent=2))
    ingester.close()


if __name__ == "__main__":
    simulate_ingestion_pipeline()
