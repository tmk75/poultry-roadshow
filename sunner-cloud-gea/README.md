# Sunner Cloud & Multi-Agent AI Engine (Team 2 & Team 3)

This module contains the cloud infrastructure (Terraform for Azure China / GEACloud), stream ingestion to Neo4j graph digital twin, and the multi-agent AI environmental reasoning engine.

## Directory Structure
- `terraform/`: Infrastructure as Code for Azure IoT Hub, Storage, and Neo4j Container Instances deployed in `chinaeast2` (Shanghai) under CSL/DSL/PIPL compliance.
- `neo4j/schema.cypher`: Graph schema and spatial/biological topology definition for Sunner barns.
- `src/ingest_to_neo4j.py`: Stream ingestion engine syncing edge telemetry to Neo4j graph nodes.
- `src/mqtt_stream_bridge.py`: Real-time MQTT subscriber, graph synchronizer, and closed-loop actuation command emitter.
- `ai_engine/`:
  - `health_agent.py`: Biosecurity, ammonia respiratory threshold ($NH_3 \ge 20\text{ ppm}$), and thermal welfare monitor.
  - `energy_agent.py`: Time-of-use (TOU) tariff optimizer (Peak / Normal / Valley).
  - `conflict_resolver.py`: Negotiation engine enforcing Health safety priority over energy curtailment.
  - `coordinator.py`: Multi-agent orchestration loop.
- `tests/`: Pytest suite for conflict resolution and JSON schema validation.

## Running Tests
From the root workspace:
```bash
uv run pytest
# or
pytest sunner-cloud-gea/tests
```

## Running Multi-Agent Scenario Simulation
```bash
uv run python sunner-cloud-gea/ai_engine/coordinator.py
```

## Running Stream Bridge (Dry-Run)
```bash
uv run python sunner-cloud-gea/src/mqtt_stream_bridge.py --dry-run
```
