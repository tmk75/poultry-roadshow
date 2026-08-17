# Sunner Edge Telemetry & Welotec egOS Gateway (Team 1)

This module contains the containerized industrial telemetry services and Modbus drivers designed for **Welotec egOS** hardware gateways deployed across Sunner poultry farm houses.

## Directory Structure
- `schemas/`: Official JSON schemas for climate (`climate_telemetry.schema.json`) and feed/water (`feed_telemetry.schema.json`) telemetry.
- `src/telemetry_simulator.py`: High-fidelity edge sensor simulator generating diurnal ammonia, temperature, and feed dynamics.
- `src/modbus_driver.py`: Industrial Modbus RTU (RS-485) and Modbus TCP driver for farm climate controllers (Rotem Platinum Pro, Fancom F37, Big Dutchman).
- `config/modbus_registers.yaml`: Register mapping definition for climate and silo holding registers.
- `config/mosquitto.conf`: Configuration file for local edge broker testing.
- `config.yaml`: Edge gateway runtime settings.
- `Dockerfile`: Multi-stage, low-footprint container build for Welotec egOS ARM64/AMD64 gateways.
- `docker-compose.yml`: Local testing stack containing an Eclipse Mosquitto broker and edge simulator.

## Running Locally

### 1. Dry-Run Mode (Telemetry Simulator)
From the project root:
```bash
uv run python sunner-edge-welotec/src/telemetry_simulator.py --dry-run --count 3
# or directly with python:
python sunner-edge-welotec/src/telemetry_simulator.py --dry-run --count 3
```

### 2. Injecting Ammonia Spikes (Simulating Health Alert for AI Multi-Agent Testing)
```bash
uv run python sunner-edge-welotec/src/telemetry_simulator.py --dry-run --count 3 --inject-ammonia-spike
```

### 3. Modbus Controller Polling (Dry-Run)
```bash
uv run python sunner-edge-welotec/src/modbus_driver.py --dry-run
```

### 4. Docker Compose Stack (Live Mosquitto + Edge Daemon)
```bash
cd sunner-edge-welotec
docker compose up --build
```
