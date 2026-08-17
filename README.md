# Sunner Smart Poultry Digital Twin

An industrial digital twin ecosystem spanning **Welotec egOS** edge gateways, **Azure China / GEACloud** cloud infrastructure, and autonomous **Multi-Agent AI** environmental control for Sunner broiler houses.

---

## Architecture Overview

```
Sunner-New/
├── agents.md                                # 4 Specialized Team Personas
├── pyproject.toml                           # Unified Python project & test configuration
├── .gitignore                               # Clean repository filter
├── .compliance-framework.json               # CSL / DSL / PIPL compliance configuration
│
├── dashboard/                               # Real-Time Digital Twin Web UI
│   ├── index.html                           # Spatial barn map & live gauges
│   ├── styles.css                           # Cyber-industrial dark theme
│   └── app.js                               # Real-time multi-agent negotiation visualizer
│
├── skills/ & .agents/skills/                # Agent Skills & Governance Rules
│   ├── negotiation_rules.md                 # Health alerts ALWAYS overrule energy savings
│   ├── mqtt_schema_rules.md                 # Industrial MQTT JSON payload standards
│   └── china_cloud_compliance.md            # CSL/DSL/PIPL data localization in China East 2
│
├── sunner-edge-welotec/                     # Team 1: Industrial Edge & Modbus
│   ├── schemas/                             # JSON Schemas (climate & feed telemetry)
│   ├── src/telemetry_simulator.py           # Diurnal sensor simulator with spike injection
│   ├── src/modbus_driver.py                 # Modbus RTU/TCP controller driver
│   ├── config/modbus_registers.yaml         # Rotem Platinum / Fancom register map
│   ├── config/mosquitto.conf                # Local edge MQTT broker config
│   ├── Dockerfile & docker-compose.yml      # Containerized Welotec egOS deployment
│   └── tests/test_modbus.py                 # Edge unit test suite
│
├── sunner-cloud-gea/                        # Team 2 & 3: Cloud Infrastructure & AI Engine
│   ├── terraform/                           # Azure IoT Hub & Neo4j IaC (China East 2)
│   ├── neo4j/schema.cypher                  # Digital Twin graph ontology
│   ├── src/ingest_to_neo4j.py               # Stream ingestion & graph node sync
│   ├── src/mqtt_stream_bridge.py            # Live MQTT bridge & closed-loop actuation
│   ├── ai_engine/                           # Multi-Agent Reasoning Engine
│   │   ├── health_agent.py                  # Ammonia toxicity & thermal comfort monitor
│   │   ├── energy_agent.py                  # Time-of-use (TOU) tariff optimizer
│   │   ├── conflict_resolver.py             # Safety priority conflict mediation
│   │   └── coordinator.py                   # Multi-agent orchestrator loop
│   └── tests/                               # Cloud test suites (negotiation & schemas)
│
└── .github/workflows/                       # Team 4: CI/CD Quality Gates
    ├── ci-quality-gate.yml                  # Automated Pytest & compliance validation
    └── terraform-azure-china.yml            # Terraform Azure China policy verification
```

---

## Quick Start Commands

### 1. Run All Automated Test Suites (9/9 passing)
```bash
uv run pytest
# or
.venv\Scripts\pytest
```

### 2. Launch the Web Digital Twin Dashboard
Open `dashboard/index.html` in your browser.

### 3. Run Multi-Agent Decision Demonstration
```bash
uv run python sunner-cloud-gea/ai_engine/coordinator.py
```

### 4. Run Edge Modbus Polling (Dry-Run)
```bash
uv run python sunner-edge-welotec/src/modbus_driver.py --dry-run
```

### 5. Run Live Stream Bridge (Dry-Run)
```bash
uv run python sunner-cloud-gea/src/mqtt_stream_bridge.py --dry-run
```
