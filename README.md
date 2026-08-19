# Sunner Smart Poultry Digital Twin

An industrial digital twin ecosystem spanning **Welotec egOS** edge gateways, **Azure China / GEACloud** cloud infrastructure, and autonomous **Multi-Agent AI** environmental control for Sunner broiler houses.

---

## Architecture Overview

```
Sunner-New/
├── README.md                                # Project Root Overview
├── README_AZURE_CHINA.md                    # 21Vianet / Azure China Production Deployment Guide
├── agents.md                                # 4 Specialized Team Personas
├── pyproject.toml                           # Unified Python project & test configuration
├── .gitignore                               # Clean repository filter
├── .compliance-framework.json               # CSL / DSL / PIPL compliance configuration
│
├── dashboard/                               # Real-Time Digital Twin & Roadshow Keynote UI
│   ├── index.html                           # Spatial barn map, 3D/2D Highway & 8-Slide Keynote
│   ├── styles.css                           # Cyber-industrial dark theme
│   ├── app.js                               # Real-time multi-agent negotiation & Keynote Co-Pilot
│   └── i18n.js                              # 100% Pure Bilingual (EN / 中文 ZH) Engine
│
├── skills/ & .agents/skills/                # Agent Skills & Governance Rules
│   ├── negotiation_rules.md                 # Health alerts ALWAYS overrule energy savings
│   ├── mqtt_schema_rules.md                 # Industrial MQTT JSON payload standards
│   ├── china_cloud_compliance.md            # CSL/DSL/PIPL data localization in China East 2
│   └── enterprise_integration_rules.md      # ISA-95 mapping & SAP S/4HANA BAPI rules
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
│   ├── src/enterprise_data_pipeline.py      # End-to-End Enterprise Data Pipeline & SAP BAPI
│   ├── src/esg_analytics_engine.py          # ISO 14064 Carbon Accounting & ESG Disclosure
│   ├── src/ingest_to_neo4j.py               # Stream ingestion & graph node sync
│   ├── src/mqtt_stream_bridge.py            # Live MQTT bridge & closed-loop actuation
│   ├── ai_engine/                           # Multi-Agent Reasoning Engine
│   │   ├── health_agent.py                  # Ammonia toxicity & thermal comfort monitor
│   │   ├── energy_agent.py                  # Time-of-use (TOU) tariff optimizer
│   │   ├── conflict_resolver.py             # Safety priority conflict mediation
│   │   └── coordinator.py                   # Multi-agent orchestrator loop
│   └── tests/                               # Cloud test suites (17/17 passing)
│
└── .github/workflows/                       # Team 4: CI/CD Quality Gates
    ├── ci-quality-gate.yml                  # Automated Pytest & compliance validation
    └── terraform-azure-china.yml            # Terraform Azure China policy verification
```

---

## Deployment on 21Vianet / Azure China (世纪互联)

For production deployment onto **Microsoft Azure operated by 21Vianet** in compliance with China Data Sovereignty (CSL, DSL, PIPL, MLPS 2.0 Level 3):

👉 **See the complete deployment guide:** [README_AZURE_CHINA.md](file:///d:/TMK75%20-%20Development/Sunner-New/README_AZURE_CHINA.md)

---

## Quick Start Commands

### 1. Run All Automated Test Suites (17/17 passing)
```bash
uv run pytest -v
```

### 2. Launch the Web Digital Twin Dashboard & Keynote Deck
Open `http://localhost:3000` in your browser (or open `dashboard/index.html`).

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
