/**
 * Sunner Intelligence • Enterprise Manufacturing Decision OS
 * Roadshow Keynote & Autonomous Auto-Tour Controller:
 * - Global Autonomous Auto-Tour Engine (Cycles 01-13 in both 3D & 2D with live synced narratives)
 * - 2D Subsystem Filter Chips (All, OT, Ops, Cloud, AI)
 * - 2D Live Protocol & Latency X-Ray Toggle
 * - 2D Lineage Tracer Focus & Dim Toggle
 * - 2D Offline Edge Fault & 48h NVRAM Buffer Simulation
 * - 2D Click-to-Inspect Flying Packet popovers
 * - Keynote Showcases & Live Crisis Simulation Sliders
 */

// 13 System Nodes Executive Data Dictionary
const nodeDescriptions = {
  sensors: {
    tag: "LEVEL 0/1 • PHYSICAL FIELD SENSORS",
    title: "⚡ 01. Barn Sensors & PLCs",
    summary: "Shop-floor origin of data: temperature, humidity, ammonia (NH₃), CO₂, ventilation fan RPM, and silo load cell weights polled at 10ms cycles via Modbus RTU / TCP.",
    incoming: [
      "• <strong>Physical Barn Air & Silos:</strong> Analog millivolt probes (Pt100, 4-20mA load cells).",
      "• <strong>Closed-Loop Autopilot (Return Beam):</strong> Setpoints from Edge Gateway (25% power save / 100% emergency flush)."
    ],
    outgoing: [
      "• <strong>To Edge Gateway:</strong> 10ms Modbus holding registers (Temp 22.4°C, NH₃ 11.4 ppm, Silo 35.7t).",
      "• <strong>Direct IIoT Stream:</strong> High-arcing bypass stream directly into Snowflake Lakehouse."
    ],
    stats: [
      { label: "TEMPERATURE", val: "22.4", unit: "°C", sub: "● Optimal (21-24°C)", state: "positive" },
      { label: "AMMONIA (NH₃)", val: "11.4", unit: "ppm", sub: "● Safe (< 20 ppm)", state: "positive" },
      { label: "FEED SILOS", val: "35.7", unit: "Tons", sub: "● Healthy (> 15t)", state: "positive" }
    ],
    cortex: "Sensors operating normally. 12 holding registers polled via Modbus TCP at 10ms cycle. Closed-loop fan setpoint active."
  },
  edge: {
    tag: "LEVEL 2 • ON-SITE INDUSTRIAL GATEWAY",
    title: "📟 02. Edge Gateway (Welotec egOS)",
    summary: "Connects OT protocols (Modbus, OPC-UA, Profinet), encrypts signals, buffers 48h backup telemetry, and splits streams simultaneously to local SCADA and cloud lakehouse.",
    incoming: [
      "• <strong>From Sensors/PLCs:</strong> Raw RS-485 Modbus registers.",
      "• <strong>From Cloud Autopilot:</strong> Sub-350ms emergency control overrides."
    ],
    outgoing: [
      "• <strong>To Local SCADA:</strong> OPC-UA real-time tags (Tag M7.Speed, Alarm Normal).",
      "• <strong>To Snowflake (Direct Bypass):</strong> High-arcing MQTT Sparkplug B raw telemetry (41.2 kWh energy, climate)."
    ],
    stats: [
      { label: "SECURITY", val: "TLS 1.3", unit: "", sub: "● High-Grade Encryption", state: "positive" },
      { label: "LOCAL BACKUP", val: "48", unit: "Hours", sub: "● Zero-Loss Buffer", state: "positive" },
      { label: "UPTIME", val: "100", unit: "%", sub: "● Online & Healthy", state: "positive" }
    ],
    cortex: "Edge gateway validated cryptographic checksums. Local safety fallback rules loaded into NVRAM."
  },
  scada: {
    tag: "LEVEL 3 • PLANT FLOOR CONTROL",
    title: "🖥️ 03. SCADA & HMI (Ignition)",
    summary: "Supervises barn houses in real time: displays zone microclimates, fan motor currents, and alarm thresholds, feeding status to MES and the plant historian.",
    incoming: [
      "• <strong>From Edge Gateway:</strong> Real-time process values, fan RPM, and alarm limits."
    ],
    outgoing: [
      "• <strong>To Process Historian:</strong> High-frequency time-series snapshot (1s delta).",
      "• <strong>To MES (Flock Lifecycle):</strong> Machine state RUN, OEE 91.4%, and ventilation status."
    ],
    stats: [
      { label: "ALARM STATUS", val: "NOMINAL", unit: "", sub: "● All Zones Green", state: "positive" },
      { label: "FAN SPEED", val: "850", unit: "RPM", sub: "● Eco-Modulated", state: "positive" },
      { label: "MOTOR DRAW", val: "14.2", unit: "Amps", sub: "● 75% Energy Cut", state: "positive" }
    ],
    cortex: "SCADA synchronized setpoints with Edge Gateway. Fan speed modulated to 25% to minimize peak kilowatt consumption."
  },
  hist: {
    tag: "LEVEL 3 • HISTORICAL STORE",
    title: "📈 04. Process Historian (OSIsoft PI)",
    summary: "High-frequency time-series black box flight recorder: compresses and archives 5+ years of flock climate and energy data with 99.9% precision.",
    incoming: [
      "• <strong>From SCADA:</strong> Sub-second raw process snapshots and alarm event logs."
    ],
    outgoing: [
      "• <strong>To Snowflake Data Cloud:</strong> 5-year historical archive export for long-term cohort analytics."
    ],
    stats: [
      { label: "DAILY RECORDS", val: "1.2M", unit: "", sub: "● Continuous Logging", state: "positive" },
      { label: "COMPRESSION", val: "92", unit: "%", sub: "● Swinging Door Method", state: "positive" },
      { label: "HISTORY DEPTH", val: "5", unit: "Years", sub: "● Full Audit Trail", state: "positive" }
    ],
    cortex: "Historical archive indexed. Cortex AI correlated current flock growth rate against 48 historical flock batches."
  },
  mes: {
    tag: "LEVEL 3 • FLOCK LIFECYCLE EXECUTION",
    title: "📋 05. MES (Manufacturing Execution)",
    summary: "Executes flock lifecycle: tracks Batch #2026-B08 (42,500 broilers, Day 26), daily weight gain vs feed eaten (FCR 1.54), bird mortality, and biosecurity audit logs.",
    incoming: [
      "• <strong>From SCADA:</strong> Live house climate and equipment runtime.",
      "• <strong>From MOM:</strong> Daily feeding plans, harvest targets, and labor assignments."
    ],
    outgoing: [
      "• <strong>To MOM:</strong> Order progress, daily gain (68.5g/d), and biosecurity audit pass.",
      "• <strong>To Snowflake:</strong> Batch traceability lots and quality event streams."
    ],
    stats: [
      { label: "FLOCK AGE", val: "Day 26", unit: "", sub: "● 42,500 Cobb500 Broilers", state: "positive" },
      { label: "DAILY GAIN", val: "68.5", unit: "g/day", sub: "● 102% Target Pacing", state: "positive" },
      { label: "FEED RATIO (FCR)", val: "1.54", unit: "", sub: "● Benchmark: 1.68", state: "positive" }
    ],
    cortex: "MES flock trajectory is on track for optimal Day 42 processing weight. Biosecurity audit score: Level 3 Passed."
  },
  mom: {
    tag: "LEVEL 3/4 • OPERATIONS MANAGEMENT",
    title: "🏭 06. MOM (Operations Management)",
    summary: "Orchestrates operations across all 50 houses: feed distribution dispatch, harvest logistics, vaccination scheduling, and labor health & safety.",
    incoming: [
      "• <strong>From SAP ERP:</strong> Released purchase orders, grain BOM specs, and supplier logistics.",
      "• <strong>From MES:</strong> Daily flock progress, feed consumption totals, and labor hours.",
      "• <strong>From Palantir Foundry:</strong> Autonomous closed-loop work orders and fan overrides."
    ],
    outgoing: [
      "• <strong>To SAP ERP:</strong> Grain consumption postings and job closures.",
      "• <strong>To MES:</strong> Dispatch work orders, feeding curves, and priority shifts.",
      "• <strong>To Edge Gateway (Closed-Loop):</strong> Sub-350ms fan speed actuation commands.",
      "• <strong>To Snowflake:</strong> Shift reports, ops events, and labor safety metrics."
    ],
    stats: [
      { label: "HOUSES MANAGED", val: "50", unit: "Barns", sub: "● 2,125,000 Total Birds", state: "positive" },
      { label: "WORK ORDERS", val: "142", unit: "Active", sub: "● Zero Bottlenecks", state: "positive" },
      { label: "SCHEDULE MATCH", val: "99.4", unit: "%", sub: "● On-Time Operations", state: "positive" }
    ],
    cortex: "MOM synchronized feed dispatch schedule. All 50 houses operating within nominal variance."
  },
  sap: {
    tag: "LEVEL 4 • ENTERPRISE BUSINESS BACKBONE",
    title: "🏢 07. SAP S/4HANA (Enterprise ERP)",
    summary: "Enterprise business backbone: manages grain purchasing contracts, BOM recipes, silo inventory levels, and financial accounting.",
    incoming: [
      "• <strong>From MOM:</strong> Silo consumption totals and completed feed delivery receipts.",
      "• <strong>From AI Agents (BAPI):</strong> Autonomous Purchase Orders when silos drop below 15 tons."
    ],
    outgoing: [
      "• <strong>To MOM:</strong> Approved POs, supplier contracts, and material availability.",
      "• <strong>To Snowflake:</strong> Material masters, grain pricing, and costing snapshots."
    ],
    stats: [
      { label: "SILO INVENTORY", val: "35.7", unit: "Tons", sub: "● Adequate Reserve", state: "positive" },
      { label: "REORDER TRIGGER", val: "15.0", unit: "Tons", sub: "● Auto-PO Threshold", state: "positive" },
      { label: "SAP STATUS", val: "READY", unit: "", sub: "● Auto-Signature Enabled", state: "positive" }
    ],
    cortex: "SAP Supply Chain Agent monitoring silo depletion rate. Projected next reorder window: 3 days."
  },
  snowflake: {
    tag: "LEVEL 5 • CENTRAL DATA LAKEHOUSE",
    title: "❄️ 08. Snowflake Data Cloud",
    summary: "Central data cloud: ingests direct high-frequency IIoT streams via Snowpipe, runs Medallion data cleaning, and serves feature tables for Cortex AI.",
    incoming: [
      "• <strong>From Edge Gateways (Direct Bypass):</strong> High-arcing IIoT MQTT raw telemetry stream.",
      "• <strong>From Historian:</strong> 5-year historical trend datasets.",
      "• <strong>From MES / MOM / SAP:</strong> Batch lots, shift operations, and ERP costing snapshots.",
      "• <strong>From Palantir Foundry:</strong> Enriched write-back and governance audit logs."
    ],
    outgoing: [
      "• <strong>To Palantir Foundry:</strong> Cleaned Silver and Gold Medallion feature tables."
    ],
    stats: [
      { label: "DAILY INGESTION", val: "45", unit: "GB/day", sub: "● Snowpipe Streaming", state: "positive" },
      { label: "MEDALLION LAYERS", val: "3", unit: "Tiers", sub: "● Bronze -> Silver -> Gold", state: "positive" },
      { label: "QUERY SPEED", val: "0.08", unit: "Sec", sub: "● Sub-second Analytics", state: "positive" }
    ],
    cortex: "Snowflake Medallion dynamic tables refreshed. Silver layer cleaned 1.2M raw Modbus events with zero dropouts."
  },
  foundry: {
    tag: "LEVEL 5 • SEMANTIC ORCHESTRATION",
    title: "🧬 09. Palantir Foundry",
    summary: "Unifies disparate OT and IT data into one semantic model, orchestrates automated workflows, and enforces data governance.",
    incoming: [
      "• <strong>From Snowflake:</strong> Unified enterprise datasets and OLAP feature tables.",
      "• <strong>From Cortex AI (Agents):</strong> ML predictions and consensus action triggers."
    ],
    outgoing: [
      "• <strong>To Snowflake:</strong> Enriched write-back tables and governance audit logs.",
      "• <strong>To Enterprise Ontology:</strong> Continuous object graph synchronization.",
      "• <strong>To MOM (Closed-Loop):</strong> Autonomous work order dispatch and equipment commands."
    ],
    stats: [
      { label: "CONNECTED ENTITIES", val: "142k", unit: "Objects", sub: "● Full Semantic Graph", state: "positive" },
      { label: "AUTOMATION JOBS", val: "38", unit: "Active", sub: "● Zero-Touch Workflows", state: "positive" },
      { label: "GOVERNANCE", val: "100%", unit: "", sub: "● Full Lineage Tracked", state: "positive" }
    ],
    cortex: "Foundry ontology mapped 42,500 broilers in House 03 to Silo Feed Batch #SF-8802 and export packing line A."
  },
  ontology: {
    tag: "LEVEL 5 • LIVE OBJECT GRAPH",
    title: "🔗 10. Enterprise Ontology",
    summary: "Live connected digital entities: 42,500 Birds linked to House 03, Silo Feed Batch #SF-8802, Power Meters, and Supermarket Export Orders.",
    incoming: [
      "• <strong>From Palantir Foundry:</strong> Continuous real-time object state synchronization."
    ],
    outgoing: [
      "• <strong>To Digital Twin:</strong> Live object states and what-if simulation inputs.",
      "• <strong>To ML & Cortex AI:</strong> Feature tables and target prediction variables.",
      "• <strong>To Dashboards:</strong> Instant role-based application queries."
    ],
    stats: [
      { label: "LIVE OBJECTS", val: "142,000", unit: "", sub: "● Birds, Houses, Silos, POs", state: "positive" },
      { label: "GRAPH LINKS", val: "480k", unit: "Edges", sub: "● Bi-Directional Relations", state: "positive" },
      { label: "TRACEABILITY", val: "Farm-to-Fork", unit: "", sub: "● 100% Certified Origin", state: "positive" }
    ],
    cortex: "Ontology synchronized live object graph. Digital twin and ML feature pipelines updated in real time."
  },
  twin: {
    tag: "LEVEL 6 • 3D SPATIAL DIGITAL TWIN",
    title: "🕸️ 11. Digital Twin (Neo4j)",
    summary: "3D virtual physics model of the barn layout: runs real-time airflow and thermal simulations to predict dead-zones without risking live chickens.",
    incoming: [
      "• <strong>From Ontology:</strong> Real-time environmental sensor coordinates and flock counts."
    ],
    outgoing: [
      "• <strong>To ML & Cortex AI:</strong> Predicted microclimate dead-zone heatmaps for preemptive tuning."
    ],
    stats: [
      { label: "VIRTUAL ZONES", val: "3", unit: "Zones", sub: "● Inlets, Mid, Exhaust", state: "positive" },
      { label: "PHYSICS MATCH", val: "99.2", unit: "%", sub: "● CFD Thermal Calibrated", state: "positive" },
      { label: "WHAT-IF SIMS", val: "120/hr", unit: "", sub: "● Preemptive Validation", state: "positive" }
    ],
    cortex: "Spatial graph running CFD microclimate simulation. Predicted zone temperature uniformity: 98.6%."
  },
  ml: {
    tag: "LEVEL 6 • MULTI-AGENT AI CORTEX",
    title: "🧠 12. ML & Cortex AI Smart Agents",
    summary: "Multi-agent consensus engine: Health Agent guarantees bird welfare, Energy Agent cuts peak power (-28.4%), and SAP Agent triggers autonomous POs in 0.3s.",
    incoming: [
      "• <strong>From Ontology:</strong> Feature tables, pricing tariffs, and flock health indicators.",
      "• <strong>From Digital Twin:</strong> Thermal prediction maps."
    ],
    outgoing: [
      "• <strong>To Palantir Foundry (Closed-Loop):</strong> Consensual action triggers (Fan modulation, SAP Auto-PO).",
      "• <strong>To Dashboards:</strong> Natural language executive briefings."
    ],
    stats: [
      { label: "REACTION TIME", val: "0.3", unit: "Sec", sub: "● Sub-second Closed-Loop", state: "positive" },
      { label: "ENERGY SAVINGS", val: "-28.4", unit: "%", sub: "● Peak Tariff Optimization", state: "positive" },
      { label: "LIVES PRESERVED", val: "497k", unit: "Birds/yr", sub: "● 1.2% vs 4.8% Mortality", state: "positive" }
    ],
    cortex: "All 4 AI Agents reached consensus. Health Agent verified welfare score (98.8%), Energy Agent saved ¥9.72/hr."
  },
  dash: {
    tag: "LEVEL 6 • PRESENTATION & BI",
    title: "📊 13. Role-Based Dashboards & BI",
    summary: "Live decision apps: executive profit/loss tracking, flock welfare scores, certified ISO 14064 ESG audit reports, and operator control screens.",
    incoming: [
      "• <strong>From Ontology:</strong> Live object states and production metrics.",
      "• <strong>From Cortex AI:</strong> Automated natural language executive briefings and alerts."
    ],
    outgoing: [
      "• <strong>To Executive Decision Makers:</strong> 1-click ISO 14064 ESG certificates and P&L drilldowns."
    ],
    stats: [
      { label: "DASHBOARD LATENCY", val: "< 100", unit: "ms", sub: "● Real-Time Streaming", state: "positive" },
      { label: "ESG ACCURACY", val: "100%", unit: "", sub: "● ISO 14064 Verified", state: "positive" },
      { label: "ROLE VIEWS", val: "4", unit: "Personas", sub: "● Exec, Ops, Vet, ESG", state: "positive" }
    ],
    cortex: "Dashboards displaying live truth from the ontology. Zero manual reconciliation needed."
  }
};

// 13 Technical System Schemas Dictionary
const technicalSchemas = {
  sensors: {
    title: "Step 01: Siemens S7-1500 PLC & Field Probes",
    proto: "Modbus TCP / Port 502",
    payload: {
      plc_device: "Siemens-S7-1516-3PN/DP",
      ip_address: "192.168.10.12",
      scan_cycle_ms: 10,
      holding_registers: {
        "40100_TEMP_FRONT": 218,
        "40101_TEMP_MID": 221,
        "40102_TEMP_REAR": 226,
        "40103_HUMIDITY_PCT": 625,
        "40104_NH3_PPM": 114,
        "40105_CO2_PPM": 1280,
        "40200_SILO1_WEIGHT_KG": 18500,
        "40201_SILO2_WEIGHT_KG": 17200,
        "40300_FAN1_RPM": 850,
        "40301_FAN1_AMPS": 142
      }
    }
  },
  edge: {
    title: "Step 02: Welotec egOS Edge Gateway",
    proto: "MQTT v5 / Sparkplug B TLS 1.3",
    payload: {
      gateway_id: "gw-welotec-np01-b03",
      firmware: "egOS-v3.4.2-hardened",
      security: { tls: "TLS_AES_256_GCM_SHA384", cert: "CN=sunner-edge-03.fujian.internal" },
      buffer_status: { local_nvram_hours: 48, buffered_events: 0 },
      sparkplug_payload: {
        timestamp: Date.now(),
        metrics: [
          { name: "House03/Climate/AvgTemp_C", value: 22.4, type: "Float" },
          { name: "House03/Climate/NH3_ppm", value: 11.4, type: "Float" },
          { name: "House03/Inventory/TotalFeed_Tons", value: 35.7, type: "Float" },
          { name: "House03/Power/ActiveKW", value: 41.2, type: "Float" }
        ]
      }
    }
  },
  scada: {
    title: "Step 03: Ignition SCADA / HMI Server",
    proto: "OPC UA / Port 4840",
    payload: {
      server_node: "opc.tcp://scada-nanping.sunner:4840",
      monitored_tags: {
        "[Sunner_OT]/Barn_03/Zone_Rear/NH3_PV": { value: 11.4, quality: "GOOD_192", timestamp: new Date().toISOString() },
        "[Sunner_OT]/Barn_03/Ventilation/Fan_Master_RPM": { value: 850.0, target: 850.0, mode: "AI_MODULATED" },
        "[Sunner_OT]/Barn_03/Alarms/Ammonia_Hazard": { state: "CLEAR", threshold: 20.0 }
      }
    }
  },
  hist: {
    title: "Step 04: OSIsoft PI Process Historian",
    proto: "PI Web API / Swinging Door Compression",
    payload: {
      pi_server: "PISERVER-NANPING-PROD",
      point_name: "NP01_B03_ZR_NH3.PV",
      compression_algorithm: "Swinging Door (CompDev=0.15)",
      retention_policy: "5 Years Online / S3 Cold Archive",
      latest_events: [
        { time: "2026-08-18T03:20:00Z", val: 11.41 },
        { time: "2026-08-18T03:21:00Z", val: 11.38 },
        { time: "2026-08-18T03:22:00Z", val: 11.42 }
      ]
    }
  },
  mes: {
    title: "Step 05: MES / MOM Batch Manager",
    proto: "ISA-88 Batch Record Schema",
    payload: {
      batch_id: "FLOCK-2026-B08",
      house_id: "NANPING-HOUSE-03",
      breed: "Cobb500 Broiler",
      placement_date: "2026-07-23",
      current_age_days: 26,
      initial_chicks: 42500,
      active_birds: 41990,
      actual_mortality_pct: 1.2,
      target_growth_curve: { target_fcr: 1.68, actual_fcr: 1.54, daily_gain_g: 68.5 },
      biosecurity_audit: { level: 3, last_inspection: "PASSED_2026-08-17" }
    }
  },
  mom: {
    title: "Step 06: MOM Multi-House Operations Hub",
    proto: "ISA-95 Operations Dispatch JSON",
    payload: {
      fleet_overview: { total_barns: 50, total_live_birds: 2125000 },
      work_orders: [
        { wo_id: "WO-2026-8801", type: "FEED_DISPATCH", house: "House 03", qty_tons: 25.0, status: "DISPATCHED" },
        { wo_id: "WO-2026-8802", type: "VACCINATION_CHECK", house: "House 07", status: "COMPLETED" },
        { wo_id: "WO-2026-8803", type: "FAN_BEARING_MAINTENANCE", house: "House 12", status: "SCHEDULED" }
      ],
      safety_index: 99.4
    }
  },
  sap: {
    title: "Step 07: SAP S/4HANA Enterprise ERP",
    proto: "SAP RFC / BAPI (BAPI_PO_CREATE1)",
    payload: {
      system: "SAP S/4HANA Cloud 2026",
      material_master: "MAT-FEED-SOYA-500",
      company_code: "1000 (Fujian Sunner Development Co.)",
      silo_threshold_tons: 15.0,
      current_inventory_tons: 35.7,
      autonomous_po_rule: {
        trigger: "STOCK_TONS < 15.0",
        vendor: "VEND_FUJIAN_FEED_CO_882",
        order_quantity_tons: 25.0,
        currency: "CNY",
        auto_sign: true
      }
    }
  },
  snowflake: {
    title: "Step 08: Snowflake Data Cloud Lakehouse",
    proto: "Snowpipe Streaming / SQL Medallion",
    payload: {
      database: "SUNNER_ENTERPRISE_LAKE",
      medallion_layers: {
        bronze: "BRONZE.RAW_MQTT_TELEMETRY (Direct Snowpipe Ingestion, <100ms)",
        silver: "SILVER.CLEAN_CLIMATE_HOURLY (Deduplicated, Schema-Enforced)",
        gold: "GOLD.FLOCK_PROFIT_AND_LOSS (Aggregated Feed Cost, Power Tariffs, FCR)"
      },
      active_streams: ["STREAM_EDGE_INGEST_03", "STREAM_MES_BATCH_B08", "STREAM_SAP_COSTING"]
    }
  },
  foundry: {
    title: "Step 09: Palantir Foundry Semantic Orchestration",
    proto: "Foundry Archetype / Action Bus",
    payload: {
      ontology_rid: "ri.ontology.main.object.flock-batch",
      semantic_bindings: {
        "FlockBatch": { pk: "batch_id", title: "Batch #2026-B08", grain: "unit_flock" },
        "BarnZone": { pk: "zone_id", title: "House 03 Rear Exhaust", grain: "spatial_zone" }
      },
      action_types: [
        { action: "TriggerFanSpeedOverride", auth: "AI_CONSENSUS_LEVEL_3", max_response_sec: 0.5 },
        { action: "ReleaseSAPFeedPO", auth: "AUTONOMOUS_PURCHASING_AGENT", limit_cny: 150000 }
      ]
    }
  },
  ontology: {
    title: "Step 10: Enterprise Object Graph Ontology",
    proto: "Graph Object Archetype (142,000 Entities)",
    payload: {
      root_entity: "Flock:2026-B08",
      linked_objects: [
        { type: "PhysicalBarn", id: "Barn-03", relation: "HOUSES" },
        { type: "FeedSilo", id: "Silo-03-A", capacity_tons: 40.0, current_tons: 35.7, relation: "FEEDS_FROM" },
        { type: "VeterinaryBatch", id: "Vet-Cert-882", welfare_grade: "A+", relation: "CERTIFIED_BY" },
        { type: "CustomerExportOrder", id: "ORD-KFC-EX-9921", relation: "DESTINED_FOR" }
      ]
    }
  },
  twin: {
    title: "Step 11: Neo4j 3D Spatial Digital Twin",
    proto: "Bolt Protocol (Port 7687) / CFD Mesh",
    payload: {
      graph_database: "neo4j://sunner-spatial-twin:7687",
      barn_dimensions_m: { length: 120, width: 16, height: 4.2 },
      spatial_zones: [
        { zone: "front", target_temp_c: 21.8, actual_temp_c: 21.8, velocity_ms: 1.8 },
        { zone: "mid", target_temp_c: 22.1, actual_temp_c: 22.1, velocity_ms: 2.2 },
        { zone: "rear", target_temp_c: 22.4, actual_temp_c: 22.6, velocity_ms: 2.5 }
      ],
      cfd_prediction: "Optimal uniform air tunnel distribution. Zero stagnant hot-spots detected."
    }
  },
  ml: {
    title: "Step 12: Snowflake Cortex AI Multi-Agent Core",
    proto: "Cortex LLM Agent Bus / Consensus Engine",
    payload: {
      model: "snowflake-cortex-agent-orchestrator",
      consensus_decision: {
        health_agent: { status: "APPROVED", air_score: "98.8%", reason: "NH3 at 11.4 ppm safely below 20 ppm limit." },
        energy_agent: { status: "SAVING", fan_power: "25%", tariff: "Peak (¥1.35/kWh)", hourly_savings: "¥9.72" },
        sap_agent: { status: "STANDBY", silo_stock: "35.7t", reorder_threshold: "15.0t" },
        esg_agent: { status: "TRACKING", scope2_reduction_rate: "-28.4%" }
      },
      decision_latency_ms: 310
    }
  },
  dash: {
    title: "Step 13: Role-Based Presentation Dashboards",
    proto: "GraphQL / Real-Time WebSocket",
    payload: {
      active_personas: ["CFO Executive Suite", "Plant Operations Desk", "Chief Agronomist", "ESG Auditor"],
      kpis_delivered: {
        daily_avoided_carbon_tons: 6.81,
        total_annual_avoided_co2: "18,885.72 t CO2e",
        bird_preservation_count: "497,250 birds/yr",
        electricity_cost_savings_pct: "-28.4%",
        iso_certification: "ISO 14064-1 Validated"
      }
    }
  }
};

const nodeOrder = ['sensors', 'edge', 'scada', 'hist', 'mes', 'mom', 'sap', 'snowflake', 'foundry', 'ontology', 'twin', 'ml', 'dash'];
let activeNodeId = 'sensors';

// Global Autonomous Tour State
let isAutoTourRunning = true;
let autoTourInterval = null;
const TOUR_STEP_INTERVAL_MS = 4000;

// Append to Live Audit Ticker
function addAuditLog(msg, isHighlight = false) {
  const ticker = document.getElementById('live-audit-ticker');
  if (!ticker) return;
  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];

  const row = document.createElement('div');
  row.className = `ticker-row ${isHighlight ? 'highlight' : ''}`;
  row.innerHTML = `
    <span class="tick-time">${timeStr}</span>
    <span class="tick-msg">${msg}</span>
  `;

  ticker.insertBefore(row, ticker.firstChild);
  if (ticker.children.length > 5) {
    ticker.removeChild(ticker.lastChild);
  }
}

// Initialize Scrubber Pills (13 Nodes)
function initScrubber() {
  const container = document.getElementById('step-navigator-container');
  if (!container) return;

  container.innerHTML = '';
  nodeOrder.forEach((id, idx) => {
    const btn = document.createElement('button');
    btn.className = `step-pill-btn ${id === activeNodeId ? 'active' : ''}`;
    btn.id = `pill-node-${id}`;
    btn.textContent = `0${idx + 1}`.slice(-2);
    btn.title = nodeDescriptions[id].title;
    btn.addEventListener('click', () => {
      pauseTour();
      selectNode(id);
    });
    container.appendChild(btn);
  });
}

// Render Selected Node Details
function renderNodeDetails(id) {
  activeNodeId = id;

  nodeOrder.forEach(nid => {
    const pill = document.getElementById(`pill-node-${nid}`);
    if (pill) pill.classList.toggle('active', nid === id);
  });

  const cardStory = document.getElementById('executive-story-card');
  const cardBi = document.getElementById('executive-bi-dashboard-card');

  // If Node 13 (dash) is selected, render the dedicated Executive BI Command Center!
  if (id === 'dash') {
    if (cardStory) cardStory.style.display = 'none';
    if (cardBi) cardBi.style.display = 'flex';
    renderBiTable('all');
    renderBiCharts();
  } else {
    if (cardStory && document.getElementById('btn-mode-technical')?.classList.contains('active') === false) {
      cardStory.style.display = 'flex';
    }
    if (cardBi) cardBi.style.display = 'none';
  }

  const isZh = window.i18n && window.i18n.currentLang === 'zh';
  const desc = isZh ? (window.i18n.nodesZh[id] || nodeDescriptions[id]) : nodeDescriptions[id];
  if (desc) {
    const sBadge = document.getElementById('story-step-badge');
    const sTitle = document.getElementById('story-step-title');
    const sSumm = document.getElementById('story-step-summary');

    if (sBadge) sBadge.textContent = desc.tag;
    if (sTitle) sTitle.textContent = desc.title;
    if (sSumm) sSumm.textContent = desc.summary;

    const inList = document.getElementById('list-incoming-paths');
    if (inList) inList.innerHTML = desc.incoming.map(i => `<li>${i}</li>`).join('');

    const outList = document.getElementById('list-outgoing-paths');
    if (outList) outList.innerHTML = desc.outgoing.map(o => `<li>${o}</li>`).join('');

    const kpiStrip = document.getElementById('story-kpi-strip');
    if (kpiStrip) {
      kpiStrip.innerHTML = desc.stats.map(s => `
        <div class="hero-stat-card">
          <span class="stat-lbl">${s.label}</span>
          <span class="stat-big">${s.val}<small>${s.unit}</small></span>
          <span class="stat-sub ${s.state}">${s.sub}</span>
        </div>
      `).join('');
    }

    const narrEl = document.getElementById('cortex-narrative');
    if (narrEl) narrEl.textContent = `"${desc.cortex}"`;
  }

  const tech = technicalSchemas[id];
  if (tech) {
    const elTitle = document.getElementById('inspector-tier-title');
    const elProto = document.getElementById('inspector-proto-badge');
    const elCode = document.getElementById('inspector-code-block');

    if (elTitle) elTitle.textContent = tech.title;
    if (elProto) elProto.textContent = tech.proto;
    if (elCode) elCode.textContent = JSON.stringify(tech.payload, null, 2);
  }
}

// =================================================================
// 6. EXECUTIVE BI & ANALYTICS COMMAND CENTER (NODE 13)
// =================================================================
const biComplexDataEn = [
  { complex: 'nanping', name: 'Nanping Complex 01 (HQ)', houses: 140, birds: '5.95M', temp: '22.1°C', nh3: '11.4 ppm', silo: '35.7t', mode: 'CLOSED-LOOP ACTIVE', fcr: '1.54 (Optimal)', energy: '¥4.25M' },
  { complex: 'nanping', name: 'Nanping Complex 02', houses: 120, birds: '5.10M', temp: '22.4°C', nh3: '12.8 ppm', silo: '42.0t', mode: 'CLOSED-LOOP ACTIVE', fcr: '1.55 (Optimal)', energy: '¥3.65M' },
  { complex: 'sanming', name: 'Sanming Complex 01', houses: 96, birds: '4.08M', temp: '21.9°C', nh3: '10.8 ppm', silo: '28.4t', mode: 'CLOSED-LOOP ACTIVE', fcr: '1.53 (Optimal)', energy: '¥2.88M' },
  { complex: 'sanming', name: 'Sanming Complex 02', houses: 80, birds: '3.40M', temp: '22.6°C', nh3: '14.1 ppm', silo: '31.2t', mode: 'CLOSED-LOOP ACTIVE', fcr: '1.56 (Optimal)', energy: '¥2.40M' },
  { complex: 'ganzhou', name: 'Ganzhou Complex 01', houses: 110, birds: '4.67M', temp: '22.8°C', nh3: '13.5 ppm', silo: '38.5t', mode: 'CLOSED-LOOP ACTIVE', fcr: '1.54 (Optimal)', energy: '¥3.35M' },
  { complex: 'pingliang', name: 'Pingliang Complex 01', houses: 85, birds: '3.61M', temp: '21.5°C', nh3: '9.8 ppm', silo: '26.0t', mode: 'CLOSED-LOOP ACTIVE', fcr: '1.52 (Optimal)', energy: '¥2.55M' }
];

const biComplexDataZh = [
  { complex: 'nanping', name: '南平第一核心基地 (总部)', houses: 140, birds: '595万羽', temp: '22.1°C', nh3: '11.4 ppm', silo: '35.7吨', mode: '全域闭环自愈中', fcr: '1.54 (行业最优)', energy: '¥425.0万' },
  { complex: 'nanping', name: '南平第二养殖基地', houses: 120, birds: '510万羽', temp: '22.4°C', nh3: '12.8 ppm', silo: '42.0吨', mode: '全域闭环自愈中', fcr: '1.55 (行业最优)', energy: '¥365.0万' },
  { complex: 'sanming', name: '三明第一养殖基地', houses: 96, birds: '408万羽', temp: '21.9°C', nh3: '10.8 ppm', silo: '28.4吨', mode: '全域闭环自愈中', fcr: '1.53 (行业最优)', energy: '¥288.0万' },
  { complex: 'sanming', name: '三明第二养殖基地', houses: 80, birds: '340万羽', temp: '22.6°C', nh3: '14.1 ppm', silo: '31.2吨', mode: '全域闭环自愈中', fcr: '1.56 (行业最优)', energy: '¥240.0万' },
  { complex: 'ganzhou', name: '赣州第一核心基地', houses: 110, birds: '467万羽', temp: '22.8°C', nh3: '13.5 ppm', silo: '38.5吨', mode: '全域闭环自愈中', fcr: '1.54 (行业最优)', energy: '¥335.0万' },
  { complex: 'pingliang', name: '平凉第一养殖基地', houses: 85, birds: '361万羽', temp: '21.5°C', nh3: '9.8 ppm', silo: '26.0吨', mode: '全域闭环自愈中', fcr: '1.52 (行业最优)', energy: '¥255.0万' }
];

let activeBiComplexFilter = 'all';

function renderBiTable(complexFilter = 'all') {
  activeBiComplexFilter = complexFilter;
  const tbody = document.getElementById('bi-table-body');
  if (!tbody) return;

  const isZh = window.i18n && window.i18n.currentLang === 'zh';
  const data = isZh ? biComplexDataZh : biComplexDataEn;

  const rows = complexFilter === 'all'
    ? data
    : data.filter(c => c.complex === complexFilter);

  const unitBarns = isZh ? "栋" : "Barns";

  tbody.innerHTML = rows.map(r => `
    <tr>
      <td><strong>${r.name}</strong></td>
      <td>${r.houses} ${unitBarns}</td>
      <td>${r.birds}</td>
      <td>${r.temp}</td>
      <td>${r.nh3}</td>
      <td>${r.silo}</td>
      <td><span class="bi-status-badge green">${r.mode}</span></td>
      <td><strong style="color: #10b981;">${r.fcr}</strong></td>
      <td><strong style="color: #38bdf8;">${r.energy}</strong></td>
    </tr>
  `).join('');
}

function renderBiCharts() {
  const isZh = window.i18n && window.i18n.currentLang === 'zh';
  const growthEl = document.getElementById('bi-growth-chart');
  if (growthEl) {
    const lblD1 = isZh ? "第1天 (42克)" : "Day 01 (42g)";
    const lblD26 = isZh ? "第26天 (1,480克)" : "Day 26 (1,480g)";
    const lblD42 = isZh ? "第42天 (2,850克)" : "Day 42 (2,850g)";

    growthEl.innerHTML = `
      <svg viewBox="0 0 400 100" style="width: 100%; height: 100%;">
        <defs>
          <linearGradient id="growthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#10b981" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#10b981" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <line x1="40" y1="20" x2="380" y2="20" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
        <line x1="40" y1="50" x2="380" y2="50" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
        <line x1="40" y1="80" x2="380" y2="80" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
        
        <path d="M 40 85 Q 200 65 380 28" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" stroke-dasharray="4,4"/>
        <path d="M 40 85 Q 200 55 380 18 L 380 85 Z" fill="url(#growthGrad)"/>
        <path d="M 40 85 Q 200 55 380 18" fill="none" stroke="#10b981" stroke-width="2.5"/>
        
        <circle cx="200" cy="55" r="3.5" fill="#10b981"/>
        <circle cx="380" cy="18" r="4" fill="#38bdf8"/>
        <text x="45" y="96" fill="#94a3b8" font-size="8.5" font-family="JetBrains Mono">${lblD1}</text>
        <text x="175" y="96" fill="#94a3b8" font-size="8.5" font-family="JetBrains Mono">${lblD26}</text>
        <text x="305" y="96" fill="#38bdf8" font-weight="bold" font-size="8.5" font-family="JetBrains Mono">${lblD42}</text>
      </svg>
    `;
  }

  const tariffEl = document.getElementById('bi-tariff-chart');
  if (tariffEl) {
    const valTitle = isZh ? "谷段电价 (¥0.38)" : "VALLEY (¥0.38)";
    const valSub = isZh ? "预蓄冷 100%通风" : "Pre-cooling 100%";
    const peakTitle = isZh ? "尖峰电价 (¥1.35) -28.4%" : "PEAK (¥1.35) -28.4%";
    const peakSub = isZh ? "风机智能降频至 25%" : "Fans Modulated to 25%";
    const normTitle = isZh ? "平段电价 (¥0.85)" : "NORMAL (¥0.85)";
    const normSub = isZh ? "风机经济运行 60%" : "Fans Modulated 60%";

    tariffEl.innerHTML = `
      <svg viewBox="0 0 400 100" style="width: 100%; height: 100%;">
        <rect x="40" y="20" width="80" height="65" fill="rgba(56, 189, 248, 0.25)" rx="3"/>
        <text x="80" y="55" fill="#38bdf8" font-size="8.5" font-weight="bold" text-anchor="middle" font-family="JetBrains Mono">${valTitle}</text>
        <text x="80" y="70" fill="#ffffff" font-size="7.5" text-anchor="middle" font-family="JetBrains Mono">${valSub}</text>
        
        <rect x="130" y="45" width="130" height="40" fill="rgba(244, 63, 94, 0.25)" rx="3"/>
        <text x="195" y="65" fill="#fda4af" font-size="8.5" font-weight="bold" text-anchor="middle" font-family="JetBrains Mono">${peakTitle}</text>
        <text x="195" y="78" fill="#ffffff" font-size="7.5" text-anchor="middle" font-family="JetBrains Mono">${peakSub}</text>
        
        <rect x="270" y="32" width="100" height="53" fill="rgba(16, 185, 129, 0.25)" rx="3"/>
        <text x="320" y="60" fill="#10b981" font-size="8.5" font-weight="bold" text-anchor="middle" font-family="JetBrains Mono">${normTitle}</text>
        <text x="320" y="73" fill="#ffffff" font-size="7.5" text-anchor="middle" font-family="JetBrains Mono">${normSub}</text>
        
        <line x1="40" y1="85" x2="370" y2="85" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
        <text x="40" y="96" fill="#94a3b8" font-size="8.5" font-family="JetBrains Mono">00:00</text>
        <text x="130" y="96" fill="#94a3b8" font-size="8.5" font-family="JetBrains Mono">08:00</text>
        <text x="260" y="96" fill="#94a3b8" font-size="8.5" font-family="JetBrains Mono">18:00</text>
        <text x="355" y="96" fill="#94a3b8" font-size="8.5" font-family="JetBrains Mono">24:00</text>
      </svg>
    `;
  }
}

// Attach Event Listeners to BI Filters and Export Buttons
document.querySelectorAll('.bi-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.bi-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    renderBiTable(chip.dataset.complex);
    addAuditLog(`BI Table filtered by ${chip.textContent.trim()}`);
  });
});

document.getElementById('btn-bi-export-pbi')?.addEventListener('click', () => {
  addAuditLog("📥 Snowflake Gold Layer DirectQuery schema exported to PowerBI dataset", true);
  alert("PowerBI DirectQuery Schema (.pbix / JSON) exported successfully from Snowflake Gold Layer!");
});

document.getElementById('btn-bi-open-fullscreen')?.addEventListener('click', () => {
  const cardBi = document.getElementById('executive-bi-dashboard-card');
  if (cardBi) {
    if (!document.fullscreenElement) {
      cardBi.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }
});

function selectNode(id) {
  renderNodeDetails(id);

  if (window.highway3D) {
    const idx = nodeOrder.indexOf(id);
    if (idx !== -1) {
      window.highway3D.setActiveNode(idx);
    }
  }

  if (window.topologyCanvas) {
    window.topologyCanvas.selectedNodeId = id;
  }
}

window.selectNodeFrom3D = function(nodeId, index) {
  renderNodeDetails(nodeId);
};

window.onTopologyNodeSelected = function(nodeId) {
  pauseTour();
  renderNodeDetails(nodeId);
};

// =================================================================
// GLOBAL AUTONOMOUS AUTO-TOUR ENGINE (3D & 2D SYNCHRONIZED)
// =================================================================
const btnTour = document.getElementById('btn-toggle-autocruise');
const iconTour = document.getElementById('icon-autocruise');

function advanceAutoTour() {
  const currentIdx = nodeOrder.indexOf(activeNodeId);
  const nextIdx = (currentIdx + 1) % nodeOrder.length;
  const nextNodeId = nodeOrder[nextIdx];
  selectNode(nextNodeId);
}

function playTour() {
  isAutoTourRunning = true;
  if (iconTour) iconTour.textContent = "⏸";
  if (btnTour) btnTour.className = "control-circle-btn primary";

  if (window.highway3D) window.highway3D.autoTour = true;

  if (autoTourInterval) clearInterval(autoTourInterval);
  autoTourInterval = setInterval(() => {
    advanceAutoTour();
  }, TOUR_STEP_INTERVAL_MS);
}

function pauseTour() {
  isAutoTourRunning = false;
  if (iconTour) iconTour.textContent = "▶";
  if (btnTour) btnTour.className = "control-circle-btn";

  if (window.highway3D) window.highway3D.autoTour = false;

  if (autoTourInterval) {
    clearInterval(autoTourInterval);
    autoTourInterval = null;
  }
}

if (btnTour) {
  btnTour.addEventListener('click', () => {
    if (isAutoTourRunning) {
      pauseTour();
      addAuditLog("Autonomous Auto-Tour paused by presenter");
    } else {
      playTour();
      addAuditLog("Autonomous Auto-Tour engaged across all 13 nodes", true);
    }
  });
}

document.getElementById('btn-step-prev')?.addEventListener('click', () => {
  pauseTour();
  const currentIdx = nodeOrder.indexOf(activeNodeId);
  const prevIdx = currentIdx > 0 ? currentIdx - 1 : nodeOrder.length - 1;
  selectNode(nodeOrder[prevIdx]);
});

document.getElementById('btn-step-next')?.addEventListener('click', () => {
  pauseTour();
  const currentIdx = nodeOrder.indexOf(activeNodeId);
  const nextIdx = (currentIdx + 1) % nodeOrder.length;
  selectNode(nodeOrder[nextIdx]);
});

// =================================================================
// 1. 2D INTERACTIVE GRAPH CAPABILITIES (5 ADVANCED FEATURES)
// =================================================================
const filterBtns = document.querySelectorAll('.chip-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const fKey = btn.dataset.filter || 'all';
    if (window.topologyCanvas) {
      window.topologyCanvas.setSubsystem(fKey);
    }
    addAuditLog(`2D Subsystem filtered: ${btn.textContent.trim()}`);
  });
});

const btnToggleXray = document.getElementById('btn-toggle-xray');
btnToggleXray?.addEventListener('click', () => {
  if (window.topologyCanvas) {
    const active = window.topologyCanvas.toggleXray();
    btnToggleXray.classList.toggle('active', active);
    addAuditLog(`X-Ray Protocol View: ${active ? 'ENGAGED' : 'DISENGAGED'}`, active);
  }
});

const btnToggleLineage = document.getElementById('btn-toggle-lineage');
btnToggleLineage?.addEventListener('click', () => {
  if (window.topologyCanvas) {
    const active = window.topologyCanvas.toggleLineage();
    btnToggleLineage.classList.toggle('active', active);
    addAuditLog(`End-to-End Lineage Tracer: ${active ? 'ENGAGED' : 'DISENGAGED'}`);
  }
});

const btnToggleOffline = document.getElementById('btn-toggle-edge-offline');
btnToggleOffline?.addEventListener('click', () => {
  if (window.topologyCanvas) {
    const isOffline = window.topologyCanvas.toggleEdgeOffline();
    btnToggleOffline.classList.toggle('active', isOffline);
    if (isOffline) {
      btnToggleOffline.textContent = "🔄 Reconnect Buffer";
      document.getElementById('cortex-narrative').textContent = '"FAULT INJECTION: Cloud internet severed! Welotec Edge Gateway engaged 48h local NVRAM circular buffer. Zero on-site data loss."';
      addAuditLog("🚨 Cloud link severed! Edge Gateway buffering to NVRAM (48h)", true);
    } else {
      btnToggleOffline.textContent = "⚡ Offline Buffer Sim";
      document.getElementById('cortex-narrative').textContent = '"LINK RESTORED: Edge Gateway flushed 1,420 buffered Sparkplug B events into Snowflake Snowpipe. Zero dropped packets."';
      addAuditLog("✅ Cloud link restored: 1,420 buffered NVRAM events flushed to Snowflake", true);
    }
  }
});

// =================================================================
// =================================================================
// 2. ROADSHOW KEYNOTE SHOWCASE MODES (FULLY LIBERAL & SEAMLESS CLICKS)
// =================================================================
const btnKeyClosedLoop = document.getElementById('btn-keynote-closedloop');
const btnKeySap = document.getElementById('btn-keynote-sap');
const btnKeyEsg = document.getElementById('btn-keynote-esg');

function resetKeynoteButtons() {
  document.querySelectorAll('.keynote-btn').forEach(b => b.classList.remove('active'));
}

btnKeyClosedLoop?.addEventListener('click', () => {
  // 1. Ensure Main Decision OS View is Visible
  document.getElementById('nav-btn-highway')?.click();

  // 2. Set Button Active
  resetKeynoteButtons();
  btnKeyClosedLoop.classList.add('active');
  pauseTour();

  // 3. Reset Sliders to Nominal Peak Condition
  const slNH3 = document.getElementById('slider-sim-nh3');
  const slTar = document.getElementById('slider-sim-tariff');
  const lblNH3 = document.getElementById('lbl-sim-nh3');
  const lblTar = document.getElementById('lbl-sim-tariff');
  if (slNH3) slNH3.value = "11.4";
  if (lblNH3) lblNH3.textContent = "11.4 ppm";
  if (slTar) slTar.value = "3";
  if (lblTar) lblTar.textContent = "Peak (¥1.35)";

  // 4. Update Agent Votes
  const hTxt = document.getElementById('txt-agent-health');
  const hBadge = document.getElementById('badge-agent-health');
  if (hTxt) hTxt.textContent = "NH₃ 11.4 ppm (Safe) • Optimal Air";
  if (hBadge) { hBadge.className = "agent-vote-badge approved"; hBadge.textContent = "VOTE: PASS"; }

  const eTxt = document.getElementById('txt-agent-energy');
  const eBadge = document.getElementById('badge-agent-energy');
  if (eTxt) eTxt.textContent = "Peak Tariff (¥1.35/kWh) • Throttling Fans 25%";
  if (eBadge) { eBadge.className = "agent-vote-badge saving"; eBadge.textContent = "SAVING: -28.4%"; }

  // 5. Update Cortex AI Narrative
  const narrEl = document.getElementById('cortex-narrative');
  if (narrEl) {
    narrEl.textContent = '"Peak electricity active (¥1.35/kWh). Energy Agent throttled ventilation fans to 25% while Health Agent confirmed flock air quality remains safe. Saved ¥9.72/hour."';
  }
  addAuditLog("Cortex AI closed-loop setpoint: 25% Fan RPM modulation (-28.4% energy)", true);

  if (window.highway3D) window.highway3D.setSimulatedAmmonia(11.4);
  selectNode('ml');
});

btnKeySap?.addEventListener('click', () => {
  // 1. Ensure Main Decision OS View is Visible
  document.getElementById('nav-btn-highway')?.click();

  // 2. Set Button Active
  resetKeynoteButtons();
  btnKeySap.classList.add('active');
  pauseTour();

  // 3. Update SAP Agent Status
  const sTxt = document.getElementById('txt-agent-sap');
  const sBadge = document.getElementById('badge-agent-sap');
  if (sTxt) sTxt.textContent = "Silo 11.0t (< 15t Threshold) • Auto-PO Issued";
  if (sBadge) { sBadge.className = "agent-vote-badge approved"; sBadge.textContent = "PO #45008 SIGNED"; }

  nodeDescriptions.sap.stats = [
    { label: "SILO INVENTORY", val: "11.0", unit: "Tons", sub: "● Below Threshold (<15t)", state: "positive" },
    { label: "AUTO-PO ISSUED", val: "#PO_45008", unit: "", sub: "● 25.0t Soya Meal", state: "positive" },
    { label: "EST. DELIVERY", val: "08:00", unit: "Tomorrow", sub: "● Zero-Touch ERP", state: "positive" }
  ];
  nodeDescriptions.sap.cortex = "SAP Supply Chain Agent detected low silo inventory (11.0t < 15.0t). Generated BAPI Purchase Order #PO_4500892140 with Fujian Feed Co. Zero human paperwork required.";

  // 4. Update Cortex Narrative
  const narrEl = document.getElementById('cortex-narrative');
  if (narrEl) {
    narrEl.textContent = '"SAP Agent detected Silo Inventory at 11.0t (below 15t threshold). Auto-executed BAPI_PO_CREATE1 for 25 tons feed delivery without human paperwork."';
  }
  addAuditLog("SAP BAPI_PO_CREATE1 triggered PO #4500892140 for 25.0t feed replenishment", true);

  selectNode('sap');
});

btnKeyEsg?.addEventListener('click', () => {
  // 1. Switch to ESG View
  document.getElementById('nav-btn-esg')?.click();

  // 2. Set Button Active
  resetKeynoteButtons();
  btnKeyEsg.classList.add('active');
  pauseTour();

  // 3. Trigger ESG Certificate
  document.getElementById('btn-gen-esg-report')?.click();
  addAuditLog("ISO 14064 Carbon Certificate generated with cryptographic SHA-256", true);
});

// =================================================================
// 3. LIVE INTERACTIVE SIMULATOR SLIDERS
// =================================================================
const sliderNH3 = document.getElementById('slider-sim-nh3');
const lblNH3 = document.getElementById('lbl-sim-nh3');

sliderNH3?.addEventListener('input', (e) => {
  pauseTour();
  const val = parseFloat(e.target.value);
  if (lblNH3) lblNH3.textContent = `${val.toFixed(1)} ppm`;

  if (window.highway3D) window.highway3D.setSimulatedAmmonia(val);

  if (val >= 20.0) {
    document.getElementById('txt-agent-health').textContent = `🚨 NH₃ AT ${val.toFixed(1)} ppm • EMERGENCY FLOCK FLUSH`;
    document.getElementById('badge-agent-health').className = "agent-vote-badge danger";
    document.getElementById('badge-agent-health').textContent = "OVERRULE: 100% FAN";

    document.getElementById('txt-agent-energy').textContent = "Energy savings overridden by Health Priority Rule.";
    document.getElementById('badge-agent-energy').className = "agent-vote-badge standby";
    document.getElementById('badge-agent-energy').textContent = "YIELDED";

    document.getElementById('cortex-narrative').textContent = `"PRIORITY OVERRIDE: Ammonia rose to ${val.toFixed(1)} ppm (>=20 ppm threshold). Health Agent overrules Energy savings and commands 100% ventilation emergency air flush in 0.28s."`;
    addAuditLog(`🚨 EMERGENCY: NH3 spiked to ${val.toFixed(1)} ppm! Fan emergency flush engaged (0.28s)`, true);

    selectNode('ml');
  } else {
    document.getElementById('txt-agent-health').textContent = `NH₃ ${val.toFixed(1)} ppm (Safe) • Optimal Air`;
    document.getElementById('badge-agent-health').className = "agent-vote-badge approved";
    document.getElementById('badge-agent-health').textContent = "VOTE: PASS";

    document.getElementById('txt-agent-energy').textContent = "Peak Tariff (¥1.35/kWh) • Throttling Fans 25%";
    document.getElementById('badge-agent-energy').className = "agent-vote-badge saving";
    document.getElementById('badge-agent-energy').textContent = "SAVING: -28.4%";

    document.getElementById('cortex-narrative').textContent = `"Nominal flock safety confirmed. Air NH3 at ${val.toFixed(1)} ppm. Energy Agent modulating fans for optimal electricity cost reduction."`;
  }
});

const sliderTariff = document.getElementById('slider-sim-tariff');
const lblTariff = document.getElementById('lbl-sim-tariff');
sliderTariff?.addEventListener('input', (e) => {
  const level = parseInt(e.target.value);
  if (level === 3) {
    if (lblTariff) lblTariff.textContent = "Peak (¥1.35)";
    document.getElementById('txt-agent-energy').textContent = "Peak Tariff (¥1.35/kWh) • Throttling Fans 25%";
    document.getElementById('badge-agent-energy').textContent = "SAVING: -28.4%";
  } else if (level === 2) {
    if (lblTariff) lblTariff.textContent = "Normal (¥0.85)";
    document.getElementById('txt-agent-energy').textContent = "Normal Tariff (¥0.85/kWh) • Fans at 60%";
    document.getElementById('badge-agent-energy').textContent = "BALANCED";
  } else {
    if (lblTariff) lblTariff.textContent = "Valley (¥0.38)";
    document.getElementById('txt-agent-energy').textContent = "Valley Tariff (¥0.38/kWh) • Pre-cooling Barn";
    document.getElementById('badge-agent-energy').textContent = "PRE-COOLING";
  }
});

// =================================================================
// 4. SIDEBAR ROUTING & CONTROLS
// =================================================================
const navModules = {
  'nav-btn-highway': { secId: 'section-enterprise-flow', titleEn: 'Enterprise Decision OS', titleZh: '全链路智能制造决策系统' },
  'nav-btn-warroom': { secId: 'section-financial-warroom', titleEn: 'CFO Financial War Room & Sensitivity Simulator', titleZh: '集团财务作战室 • 宏观压力测试与第一性原理敏感度模拟舱' },
  'nav-btn-bi': { secId: 'section-bi-hub', titleEn: 'Executive BI Command Center', titleZh: '集团数字化运营指挥与决策大屏' },
  'nav-btn-esg': { secId: 'section-esg-evolution', titleEn: 'ESG Carbon Accounting Hub', titleZh: 'ESG 碳资产全生命周期核算中心' },
  'nav-btn-barn': { secId: 'section-spatial-gauges', titleEn: 'Physical Barn Digital Twin', titleZh: '鸡舍三维空间物理数字孪生' },
  'nav-btn-roi': { secId: 'section-comparison', titleEn: 'Autopilot vs Legacy ROI Matrix', titleZh: 'AI 闭环自愈与传统模式经济效益对比' },
  'nav-btn-presentation': { secId: 'section-presentation-deck', titleEn: 'Executive Keynote Presentation & Speech Deck', titleZh: '圣农 × GEA 智能制造操作系统高管汇报演讲台' }
};

Object.keys(navModules).forEach(navId => {
  const btn = document.getElementById(navId);
  if (btn) {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-nav-item').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.main-module-view').forEach(s => s.style.display = 'none');

      btn.classList.add('active');
      const targetSec = document.getElementById(navModules[navId].secId);
      if (targetSec) targetSec.style.display = 'block';

      const isZh = window.i18n && window.i18n.currentLang === 'zh';
      const topTitle = document.getElementById('top-view-title');
      if (topTitle) topTitle.textContent = isZh ? navModules[navId].titleZh : navModules[navId].titleEn;

      if (navId === 'nav-btn-highway') {
        if (window.highway3D) window.highway3D.onResize();
        if (window.topologyCanvas) window.topologyCanvas.resize();
      } else if (navId === 'nav-btn-bi') {
        pauseTour();
        if (typeof renderExecutiveBiHub === 'function') renderExecutiveBiHub();
        addAuditLog(isZh ? "📊 集团商业智能大屏已从导航栏开启" : "📊 Executive BI Command Center opened from sidebar navigation", true);
      } else if (navId === 'nav-btn-presentation') {
        pauseTour();
        renderPresentationSlide(activePresentationSlide);
        addAuditLog(isZh ? "🎙️ 集团高管汇报演讲台已就绪" : "🎙️ Keynote Presentation & Speaker Deck initialized", true);
      }
    });
  }
});

function resetScenarioButtons() {
  document.querySelectorAll('.scenario-nav-btn').forEach(b => b.classList.remove('active-scen'));
}

document.getElementById('side-scen-closedloop')?.addEventListener('click', () => {
  resetScenarioButtons();
  document.getElementById('side-scen-closedloop')?.classList.add('active-scen');
  document.getElementById('btn-keynote-closedloop')?.click();
});

document.getElementById('side-scen-sap')?.addEventListener('click', () => {
  resetScenarioButtons();
  document.getElementById('side-scen-sap')?.classList.add('active-scen');
  document.getElementById('btn-keynote-sap')?.click();
});

document.getElementById('side-scen-esgcert')?.addEventListener('click', () => {
  resetScenarioButtons();
  document.getElementById('side-scen-esgcert')?.classList.add('active-scen');
  document.getElementById('btn-keynote-esg')?.click();
});

// The keynote action bar is retired from the UI, so the sidebar is now the only
// way a presenter can reach the Digital Product Passport modal by hand.
document.getElementById('side-scen-dpp')?.addEventListener('click', () => {
  resetScenarioButtons();
  document.getElementById('side-scen-dpp')?.classList.add('active-scen');
  document.getElementById('btn-keynote-dpp')?.click();
});

document.getElementById('side-scen-ammonia')?.addEventListener('click', () => {
  resetScenarioButtons();
  document.getElementById('side-scen-ammonia')?.classList.add('active-scen');
  resetKeynoteButtons();

  document.getElementById('nav-btn-highway')?.click();
  pauseTour();

  const isZh = window.i18n && window.i18n.currentLang === 'zh';

  const hTxt = document.getElementById('txt-agent-health');
  const hBadge = document.getElementById('badge-agent-health');
  if (hTxt) hTxt.textContent = isZh ? "🚨 氨气浓度达到 28.5 ppm • 行使最高否决权 (100%全速排风)" : "🚨 NH₃ AT 28.5 ppm • EMERGENCY VETO (100% FAN COMMAND)";
  if (hBadge) { hBadge.className = "agent-vote-badge danger"; hBadge.textContent = isZh ? "最高否决: 100%风机" : "OVERRULE: 100% FAN"; }

  const eTxt = document.getElementById('txt-agent-energy');
  const eBadge = document.getElementById('badge-agent-energy');
  if (eTxt) eTxt.textContent = isZh ? "能耗优化主动让步，让行鸡群健康安全底线规则。" : "Energy savings yielded to flock health priority rule.";
  if (eBadge) { eBadge.className = "agent-vote-badge standby"; eBadge.textContent = isZh ? "让步让行" : "YIELDED"; }

  const sTxt = document.getElementById('txt-agent-sap');
  const sBadge = document.getElementById('badge-agent-sap');
  if (sTxt) sTxt.textContent = isZh ? "料塔库存 35.7吨 • 供应充足受控" : "Silo 35.7t • Normal Supply Flow";
  if (sBadge) { sBadge.className = "agent-vote-badge standby"; sBadge.textContent = isZh ? "待命" : "STANDBY"; }

  const narrEl = document.getElementById('cortex-narrative');
  if (narrEl) {
    narrEl.textContent = isZh
      ? '"🚨 危机仲裁超驰：氨气浓度突增至 28.5 ppm (>=20.0 ppm 危险红线)。生物健康智能体行使最高否决权，瞬间压制峰谷节电策略，指令变频风机 0.28秒内 100% 全速应急排风，保全 42,500羽鸡群生命安全。"'
      : '"🚨 PRIORITY OVERRULE: Ammonia spiked to 28.5 ppm (>=20.0 ppm safety threshold). Biological Health Agent executes hard priority veto, overruling Energy savings and commanding 100% ventilation emergency flush in 0.28s to preserve 42,500 bird lives."';
  }

  addAuditLog(isZh ? "🚨 紧急危机：氨气浓度突破 28.5 ppm！健康智能体触发最高否决权，0.28秒全速强排" : "🚨 EMERGENCY CRISIS: Ammonia spiked to 28.5 ppm! Cortex AI biological veto engaged: 100% fan flush in 0.28s", true);

  if (window.topologyCanvas) {
    window.topologyCanvas.nodes.sensors.metric = isZh ? "🚨 28.5 ppm (超标危险)" : "🚨 28.5 ppm (CRITICAL)";
  }
  if (window.highway3D) {
    window.highway3D.setActiveNode(11);
  }

  selectNode('ml');
});

document.getElementById('side-scen-legacy')?.addEventListener('click', () => {
  resetScenarioButtons();
  document.getElementById('side-scen-legacy')?.classList.add('active-scen');
  resetKeynoteButtons();

  document.getElementById('nav-btn-highway')?.click();
  pauseTour();

  const isZh = window.i18n && window.i18n.currentLang === 'zh';

  const hTxt = document.getElementById('txt-agent-health');
  const hBadge = document.getElementById('badge-agent-health');
  if (hTxt) hTxt.textContent = isZh ? "❌ 依赖人工巡检 • 45分钟严重察觉滞后" : "❌ Manual Walkthrough • 45-Min Detection Lag";
  if (hBadge) { hBadge.className = "agent-vote-badge danger"; hBadge.textContent = isZh ? "无自动超驰" : "NO AUTO VETO"; }

  const eTxt = document.getElementById('txt-agent-energy');
  const eBadge = document.getElementById('badge-agent-energy');
  if (eTxt) eTxt.textContent = isZh ? "❌ 定频风机全速傻转 • 0% 避峰电费优化" : "❌ Fixed Speed Fans • 0% Tariff Optimization";
  if (eBadge) { eBadge.className = "agent-vote-badge danger"; eBadge.textContent = isZh ? "0% 节电" : "0% SAVING"; }

  const sTxt = document.getElementById('txt-agent-sap');
  const sBadge = document.getElementById('badge-agent-sap');
  if (sTxt) sTxt.textContent = isZh ? "❌ 人工填报纸质单据 • 周度批处理滞后" : "❌ Manual Paper Orders • Weekly Batch Entry";
  if (sBadge) { sBadge.className = "agent-vote-badge danger"; sBadge.textContent = isZh ? "人工录入" : "PAPERWORK"; }

  const narrEl = document.getElementById('cortex-narrative');
  if (narrEl) {
    narrEl.textContent = isZh
      ? '"❌ 传统孤岛模式：云端实时闭环断开。养殖场依赖场长手工记录台账、微信表格汇总与周度 SAP 手工补录。氨气超标察觉耗时 45分钟以上，极易造成大批死淘。"'
      : '"❌ DISCONNECTED LEGACY SILOS: Direct cloud streams severed. Operations rely on manual paper logs, Excel emails, and delayed weekly SAP manual batch entry. Reaction time to ammonia spikes exceeds 45 minutes, risking bird mortality."';
  }

  addAuditLog(isZh ? "⚠️ 场景切换：传统信息孤岛模式已激活 (人工滞后，无AI闭环)" : "⚠️ SCENARIO: Legacy Disconnected Silos active (Manual batch lag, no AI closed-loop)", true);
  selectNode('sensors');
});

// Viewport Switcher
const btnView3D = document.getElementById('btn-view-3d');
const btnView2D = document.getElementById('btn-view-2d');
const vp3D = document.getElementById('viewport-3d');
const vp2D = document.getElementById('viewport-2d');

if (btnView3D && btnView2D && vp3D && vp2D) {
  btnView3D.addEventListener('click', () => {
    btnView3D.classList.add('active');
    btnView2D.classList.remove('active');
    vp3D.style.display = 'block';
    vp2D.style.display = 'none';
    if (window.highway3D) window.highway3D.onResize();
  });

  btnView2D.addEventListener('click', () => {
    btnView2D.classList.add('active');
    btnView3D.classList.remove('active');
    vp2D.style.display = 'block';
    vp3D.style.display = 'none';
    if (window.topologyCanvas) window.topologyCanvas.resize();
  });
}

// Speed Buttons
const speedBtns = document.querySelectorAll('.speed-btn');
speedBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    speedBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const spd = parseFloat(btn.dataset.speed || '1.0');
    if (window.topologyCanvas) window.topologyCanvas.setSpeed(spd);
  });
});

// Zoom Controls
document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
  if (window.highway3D) window.highway3D.zoomIn();
});
document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
  if (window.highway3D) window.highway3D.zoomOut();
});
document.getElementById('btn-zoom-reset')?.addEventListener('click', () => {
  if (window.highway3D) window.highway3D.resetView();
});

// Mode Switcher
const btnExec = document.getElementById('btn-mode-executive');
const btnTech = document.getElementById('btn-mode-technical');
const cardExec = document.getElementById('executive-story-card');
const cardTech = document.getElementById('technical-code-box');

if (btnExec && btnTech) {
  btnExec.addEventListener('click', () => {
    btnExec.classList.add('active');
    btnTech.classList.remove('active');
    if (activeNodeId === 'dash') {
      const cardBi = document.getElementById('executive-bi-dashboard-card');
      if (cardBi) cardBi.style.display = 'flex';
      if (cardExec) cardExec.style.display = 'none';
    } else {
      if (cardExec) cardExec.style.display = 'flex';
    }
    if (cardTech) cardTech.style.display = 'none';
  });

  btnTech.addEventListener('click', () => {
    btnTech.classList.add('active');
    btnExec.classList.remove('active');
    if (cardExec) cardExec.style.display = 'none';
    const cardBi = document.getElementById('executive-bi-dashboard-card');
    if (cardBi) cardBi.style.display = 'none';
    if (cardTech) cardTech.style.display = 'block';
    renderNodeDetails(activeNodeId);
  });
}

// Scope Switcher in ESG view
const btnScopeEnt = document.getElementById('btn-scope-enterprise');
const btnScopeSng = document.getElementById('btn-scope-single');
if (btnScopeEnt && btnScopeSng) {
  btnScopeEnt.addEventListener('click', () => {
    btnScopeEnt.classList.add('active');
    btnScopeSng.classList.remove('active');
    const isZh = window.i18n && window.i18n.currentLang === 'zh';
    document.getElementById('val-esg-scope2-saved').textContent = isZh ? "2,487.5 吨 CO₂/年" : "2,487.5 Tons CO₂/yr";
    document.getElementById('val-esg-scope2-ai').textContent = isZh ? "29,570 度电/天" : "29,570 kWh/day";
    document.getElementById('val-esg-feed-saved').textContent = isZh ? "5,856.5 吨/年" : "5,856.5 Tons/yr";
    document.getElementById('val-esg-birds-saved').textContent = isZh ? "全集团年挽救 497,250羽 白羽肉鸡" : "497,250 healthy chickens preserved per year";
  });

  btnScopeSng.addEventListener('click', () => {
    btnScopeSng.classList.add('active');
    btnScopeEnt.classList.remove('active');
    const isZh = window.i18n && window.i18n.currentLang === 'zh';
    document.getElementById('val-esg-scope2-saved').textContent = isZh ? "49.75 吨 CO₂/年" : "49.75 Tons CO₂/yr";
    document.getElementById('val-esg-scope2-ai').textContent = isZh ? "591.4 度电/天" : "591.4 kWh/day";
    document.getElementById('val-esg-feed-saved').textContent = isZh ? "117.1 吨/年" : "117.1 Tons/yr";
    document.getElementById('val-esg-birds-saved').textContent = isZh ? "单栋鸡舍年挽救 9,945羽 白羽肉鸡" : "9,945 healthy chickens preserved per year";
  });
}

// ESG Certificate Generation
document.getElementById('btn-gen-esg-report')?.addEventListener('click', () => {
  const certEl = document.getElementById('cert-body-text');
  const isZh = window.i18n && window.i18n.currentLang === 'zh';
  if (certEl) {
    if (isZh) {
      certEl.innerHTML = `
        认证报告编号: ESG-AUDIT-SUNNER-${Date.now()}<br>
        核算认证标准: ISO 14064-1 国际温室气体核查标准与 GHG Protocol 官方认证<br>
        集团年核证减排量: 18,885.72 吨二氧化碳当量 (CO₂e)<br>
        全群死淘率优化: 1.2% (每年多成活 497,250羽 健康优质肉鸡)<br>
        数字防伪哈希: e8b4f2c99a10583d73b2241cf892305aa7842c56910bbaec0924719d380f2d48
      `;
    } else {
      certEl.innerHTML = `
        Document ID: ESG-AUDIT-SUNNER-${Date.now()}<br>
        Standard: ISO 14064-1 & GHG Protocol Certified<br>
        Annual Avoided Carbon: 18,885.72 metric tons CO₂e<br>
        Bird Mortality: 1.2% (Preserving 497,250 birds/yr)<br>
        SHA-256: e8b4f2c99a10583d73b2241cf892305aa7842c56910bbaec0924719d380f2d48
      `;
    }
  }
});

// =================================================================
// 5. BARN SPATIAL TWIN ZONE CONTROLLER (ZONES 1, 2, 3)
// =================================================================
const barnZoneDataEn = {
  'zone-front': {
    badge: "ZONE 1 • AIR INLET & STATIC PRESSURE MANIFOLD",
    status: "● OPTIMAL FRESH INTAKE",
    statusClass: "green",
    metrics: [
      { label: "STATIC PRESSURE", val: "-18.2 Pa", sub: "● Tunnel Target: -15 to -22 Pa" },
      { label: "INLET LOUVER ANGLE", val: "42.0°", sub: "● Modulated for Broiler Day 26" },
      { label: "INTAKE AIRFLOW", val: "38,500 m³/h", sub: "● Fresh Oxygen Replenishment" },
      { label: "INLET TEMP / RH", val: "21.8°C / 62%", sub: "● Ideal Pre-Conditioned Air" }
    ]
  },
  'zone-mid': {
    badge: "ZONE 2 • 42,500 COBB500 FLOCK MICROCLIMATE",
    status: "● OPTIMAL THERMAL COMFORT",
    statusClass: "green",
    metrics: [
      { label: "FLOCK POPULATION", val: "42,500 Birds", sub: "● Batch #2026-B08 (Day 26)" },
      { label: "FLOOR DENSITY", val: "34.8 kg/m²", sub: "● Standard Broiler Distribution" },
      { label: "THERMAL COMFORT", val: "98.5%", sub: "● Uniform Spread (No Huddling)" },
      { label: "GROWTH / DAILY GAIN", val: "+68.5 g/day", sub: "● FCR 1.54 Ahead of Cohort" }
    ]
  },
  'zone-rear': {
    badge: "ZONE 3 • EXHAUST FANS & AMMONIA EVACUATION",
    status: "● ECO-MODULATED SPEED (25%)",
    statusClass: "green",
    metrics: [
      { label: "TUNNEL AIR SPEED", val: "2.4 m/s", sub: "● Wind Chill Index Optimal" },
      { label: "ACTIVE FAN MOTORS", val: "4 of 8 (850 RPM)", sub: "● 4 Fans on Eco Standby" },
      { label: "AMMONIA (NH₃)", val: "11.4 ppm", sub: "● Safe Level (< 20 ppm Veto Limit)" },
      { label: "POWER DRAW / SAVING", val: "14.2 kW (-28.4%)", sub: "● Peak Tariff Energy Savings" }
    ]
  }
};

const barnZoneDataZh = {
  'zone-front': {
    badge: "1区 • 进风小窗与负压导流系统",
    status: "● 适温新风循环正常",
    statusClass: "green",
    metrics: [
      { label: "静压负压", val: "-18.2 Pa", sub: "● 隧道负压标定: -15 至 -22 Pa" },
      { label: "进风小窗开度", val: "42.0°", sub: "● 根据 26日龄白羽肉鸡智能调制" },
      { label: "进风量", val: "38,500 m³/h", sub: "● 充足氧气连续置换" },
      { label: "进风温度/湿度", val: "21.8°C / 62%", sub: "● 预调温洁净新风" }
    ]
  },
  'zone-mid': {
    badge: "2区 • 42,500羽 白羽肉鸡微气候生活区",
    status: "● 动物热舒适度 98.5%",
    statusClass: "green",
    metrics: [
      { label: "存栏羽数", val: "42,500 羽", sub: "● 批次 #2026-B08 (第26天)" },
      { label: "养殖密度", val: "34.8 kg/m²", sub: "● 均匀散布 (无扎堆喘息)" },
      { label: "舒适度指数", val: "98.5%", sub: "● 体表微气候舒适稳定" },
      { label: "日均增重", val: "+68.5 g/天", sub: "● FCR 1.54 大幅优于标杆" }
    ]
  },
  'zone-rear': {
    badge: "3区 • 变频排风机组与氨气监控",
    status: "● 避峰节能调制运转 (25%)",
    statusClass: "green",
    metrics: [
      { label: "过道风速", val: "2.4 m/s", sub: "● 风冷效应指数最佳" },
      { label: "运行风机", val: "4台 / 共8台 (850转)", sub: "● 4台备用低耗待命" },
      { label: "氨气浓度 (NH₃)", val: "11.4 ppm", sub: "● 远低于 20 ppm 否决红线" },
      { label: "能耗节约", val: "14.2 kW (-28.4%)", sub: "● 尖峰电价避峰套利" }
    ]
  }
};

let activeBarnZoneKey = 'zone-front';

function selectBarnZone(zoneKey) {
  activeBarnZoneKey = zoneKey;
  // Update Buttons
  document.querySelectorAll('.zone-pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.zone === zoneKey);
  });

  // Update Rooms
  document.querySelectorAll('.barn-room').forEach(room => {
    room.classList.toggle('highlight', room.dataset.zone === zoneKey);
  });

  // Update Details Card
  const isZh = window.i18n && window.i18n.currentLang === 'zh';
  const data = isZh ? barnZoneDataZh[zoneKey] : barnZoneDataEn[zoneKey];
  if (!data) return;

  const badgeEl = document.getElementById('zone-detail-badge');
  const statusEl = document.getElementById('zone-detail-status');
  const gridEl = document.getElementById('zone-detail-metrics');

  if (badgeEl) badgeEl.textContent = data.badge;
  if (statusEl) {
    statusEl.textContent = data.status;
    statusEl.className = `zone-status-pill ${data.statusClass}`;
  }

  if (gridEl) {
    gridEl.innerHTML = data.metrics.map(m => `
      <div class="zone-stat-box">
        <span class="zone-stat-lbl">${m.label}</span>
        <span class="zone-stat-val">${m.val}</span>
        <span class="zone-stat-sub">${m.sub}</span>
      </div>
    `).join('');
  }
}

// Attach Event Listeners to Zone Buttons and Cutaway Room Elements
document.querySelectorAll('.zone-pill-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    selectBarnZone(btn.dataset.zone);
  });
});

document.querySelectorAll('.barn-room').forEach(room => {
  room.addEventListener('click', (e) => {
    e.stopPropagation();
    selectBarnZone(room.dataset.zone);
  });
});

// Expose global render hook for i18n
window.renderCurrentNode = () => {
  renderNodeDetails(activeNodeId);
  selectBarnZone(activeBarnZoneKey);
};

// Language Toggle Switcher (EN / 中文 ZH)
document.getElementById('btn-toggle-lang')?.addEventListener('click', () => {
  if (window.i18n) {
    const newLang = window.i18n.toggle();
    addAuditLog(`🌐 Language switched to ${newLang.toUpperCase()} (${newLang === 'zh' ? '简体中文' : 'English'})`, true);
  }
});

// Initialize Default Zone 1 on startup
selectBarnZone('zone-front');

// =================================================================
// 7. EXECUTIVE PRESENTATION & KEYNOTE SPEAKER DECK (8 MASTER SLIDES)
// =================================================================
// Deck content and the per-layout renderer live in presentation_deck.js, which
// is loaded before this file. These accessors keep the original variable
// semantics so the navigation, teleprompter and executeSlideDemo() below are
// unchanged, while the slide count is no longer hardcoded to 8.
function deckSlides() {
  const lang = (window.i18n && window.i18n.currentLang) || 'en';
  return (window.SunnerDeck && window.SunnerDeck.get(lang)) || [];
}

function deckCount() {
  return deckSlides().length;
}

function deckNavLabels() {
  const lang = (window.i18n && window.i18n.currentLang) || 'en';
  return (window.SunnerDeck && window.SunnerDeck.navLabels(lang)) || [];
}

let activePresentationSlide = 0;

function executeSlideDemo(slideIndex) {
  const isZh = window.i18n && window.i18n.currentLang === 'zh';
  const slides = deckSlides();
  const slide = slides[slideIndex];
  if (!slide || !slide.demoAction) return;

  const act = slide.demoAction;

  // 1. Show the return button in top app bar
  const returnBtn = document.getElementById('btn-return-to-deck');
  const returnLbl = document.getElementById('return-deck-label');
  if (returnBtn && returnLbl) {
    returnBtn.style.display = 'inline-flex';
    returnLbl.textContent = isZh
      ? `◀ 返回幻灯片 (第 0${slideIndex + 1} 页)`
      : `◀ Return to Keynote (Slide 0${slideIndex + 1})`;
  }

  // 2. Direct Actions (Copilot / DPP)
  if (act.action === 'openCopilot') {
    const drawer = document.getElementById('copilot-drawer');
    if (drawer) drawer.style.display = 'flex';
    document.getElementById('copilot-input-field')?.focus();
    addAuditLog(isZh ? `🎙️ 演讲联动演示：已拉出智能对话终端 (Copilot)` : `🎙️ Keynote Co-Pilot: Opened Conversational Copilot`, true);
    return;
  }

  if (act.action === 'openDpp') {
    const modal = document.getElementById('modal-dpp');
    if (modal) modal.style.display = 'flex';
    addAuditLog(isZh ? `🎙️ 演讲联动演示：已展示数字产品护照 (DPP) 与二维码` : `🎙️ Keynote Co-Pilot: Opened Digital Product Passport (DPP) modal`, true);
    return;
  }

  // 3. Switch to the target nav module
  if (act.targetNav) {
    const navBtn = document.getElementById(act.targetNav);
    if (navBtn) navBtn.click();
  }

  // 4. Perform slide-specific action triggers
  if (act.viewMode === '3d') {
    document.getElementById('btn-view-3d')?.click();
  } else if (act.viewMode === '2d') {
    document.getElementById('btn-view-2d')?.click();
    if (act.nodeId) selectNode(act.nodeId);
    if (act.action === 'toggleOffline') {
      const offBtn = document.getElementById('btn-toggle-edge-offline');
      if (offBtn && !offBtn.classList.contains('active')) offBtn.click();
    }
  }

  if (act.scenario) {
    if (act.scenario === 'ammonia') {
      document.getElementById('side-scen-ammonia')?.click();
    } else if (act.scenario === 'sap') {
      document.getElementById('side-scen-sap')?.click();
    } else if (act.scenario === 'closedloop') {
      document.getElementById('side-scen-closedloop')?.click();
    }
  }

  if (act.action === 'flir') {
    const btnFlir = document.getElementById('btn-toggle-flir-thermal');
    if (btnFlir && !btnFlir.classList.contains('active')) btnFlir.click();
  }

  addAuditLog(isZh ? `🎙️ 演讲联动演示：已启动第 0${slideIndex + 1} 页对应现场互动模块` : `🎙️ Keynote Co-Pilot: Launched live demo for Slide 0${slideIndex + 1}`, true);
}

function renderPresentationSlide(index = 0) {
  const total = deckCount();
  if (!total) return;
  activePresentationSlide = Math.max(0, Math.min(total - 1, index));
  const isZh = window.i18n && window.i18n.currentLang === 'zh';
  const slides = deckSlides();
  const slide = slides[activePresentationSlide];
  if (!slide) return;

  // 1. Update Slide Counter
  const counterEl = document.getElementById('slide-counter-badge');
  if (counterEl) {
    const n = String(activePresentationSlide + 1).padStart(2, '0');
    counterEl.textContent = isZh ? `第 ${n} 页 / 共 ${total} 页` : `Slide ${n} / ${total}`;
  }

  // 2. Rebuild the pill navigation from the deck itself, so adding or removing
  //    a slide needs no changes here or in the markup.
  const pillNav = document.getElementById('slide-pill-nav');
  if (pillNav) {
    const labels = deckNavLabels();
    pillNav.innerHTML = labels.map((label, idx) => `
      <button class="slide-pill ${idx === activePresentationSlide ? 'active' : ''}"
              data-slide="${idx}"${idx === activePresentationSlide ? ' aria-current="true"' : ''}>${label}</button>
    `).join('');
  }

  // 3. Render Main Slide Stage Content & Interactive Demo Action Banner
  const stageEl = document.getElementById('deck-stage-card');
  if (stageEl && window.SunnerDeck) {
    // Exported .pptx slides fill the stage edge to edge, so the card drops its
    // padding and decorative overlay for them.
    stageEl.classList.toggle('is-image-mode', slide.layout === 'image');
    stageEl.innerHTML = window.SunnerDeck.renderStage(slide, activePresentationSlide);
    // Restart the stage entry animation on every slide change.
    stageEl.classList.remove('is-entering');
    void stageEl.offsetWidth;
    stageEl.classList.add('is-entering');
  }

  // 4. Render Live Speaker Script Teleprompter
  const scriptEl = document.getElementById('teleprompter-body');
  const timerEl = document.getElementById('teleprompter-timer');
  if (scriptEl) scriptEl.innerHTML = slide.script;
  if (timerEl) timerEl.textContent = slide.time;
}

// Slide Navigation Event Listeners
// Delegated, because the pills are re-rendered on every slide change.
document.getElementById('slide-pill-nav')?.addEventListener('click', (e) => {
  const pill = e.target.closest('.slide-pill');
  if (!pill) return;
  renderPresentationSlide(parseInt(pill.dataset.slide || '0', 10));
});

document.getElementById('btn-slide-prev')?.addEventListener('click', () => {
  if (activePresentationSlide > 0) {
    renderPresentationSlide(activePresentationSlide - 1);
  }
});

document.getElementById('btn-slide-next')?.addEventListener('click', () => {
  if (activePresentationSlide < deckCount() - 1) {
    renderPresentationSlide(activePresentationSlide + 1);
  }
});

// Fullscreen Presentation Mode Toggle
const btnDeckFs = document.getElementById('btn-deck-fullscreen');
const deckContainer = document.getElementById('section-presentation-deck');

btnDeckFs?.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    if (deckContainer && deckContainer.requestFullscreen) {
      deckContainer.requestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
});

document.addEventListener('fullscreenchange', () => {
  const isDeckFs = document.fullscreenElement === deckContainer;
  const isZh = window.i18n && window.i18n.currentLang === 'zh';
  if (deckContainer) {
    deckContainer.classList.toggle('is-fullscreen', isDeckFs);
  }
  if (btnDeckFs) {
    btnDeckFs.innerHTML = isDeckFs
      ? `<span>🗗</span> ${isZh ? '退出全屏' : 'Exit Fullscreen'}`
      : `<span>⛶</span> ${isZh ? '全屏演讲' : 'Fullscreen'}`;
    btnDeckFs.classList.toggle('active', isDeckFs);
  }
});

// Toggle Speaker Script Prompter Visibility
document.getElementById('btn-deck-toggle-notes')?.addEventListener('click', () => {
  const prompter = document.getElementById('speaker-teleprompter-card');
  const btn = document.getElementById('btn-deck-toggle-notes');
  if (prompter) {
    const isHidden = prompter.style.display === 'none';
    prompter.style.display = isHidden ? 'flex' : 'none';
    if (btn) btn.classList.toggle('active', isHidden);
  }
});

// Close Presenter Script Drawer Button
document.getElementById('btn-close-teleprompter')?.addEventListener('click', () => {
  const prompter = document.getElementById('speaker-teleprompter-card');
  const btn = document.getElementById('btn-deck-toggle-notes');
  if (prompter) prompter.style.display = 'none';
  if (btn) btn.classList.remove('active');
});

// Presenter Keyboard Shortcuts (ArrowRight/Space = Next, ArrowLeft = Prev, F = Fullscreen, S/N = Script)
document.addEventListener('keydown', (e) => {
  const presSec = document.getElementById('section-presentation-deck');
  if (!presSec || presSec.style.display === 'none') return;
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
    e.preventDefault();
    if (activePresentationSlide < deckCount() - 1) renderPresentationSlide(activePresentationSlide + 1);
  } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
    e.preventDefault();
    if (activePresentationSlide > 0) renderPresentationSlide(activePresentationSlide - 1);
  } else if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    document.getElementById('btn-deck-fullscreen')?.click();
  } else if ((e.key.toLowerCase() === 's' || e.key.toLowerCase() === 'n') && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    document.getElementById('btn-deck-toggle-notes')?.click();
  }
});

// Return to Keynote Deck from Live Demo Overlay Button
document.getElementById('btn-return-to-deck')?.addEventListener('click', () => {
  const returnBtn = document.getElementById('btn-return-to-deck');
  if (returnBtn) returnBtn.style.display = 'none';

  const presBtn = document.getElementById('nav-btn-presentation');
  if (presBtn) presBtn.click();
  renderPresentationSlide(activePresentationSlide);
});

// Expose globally
window.executeSlideDemo = executeSlideDemo;
window.renderPresentationSlide = renderPresentationSlide;

// =================================================================
// 8. FULLSCREEN CANVAS TOGGLE CONTROLLER (3D & 2D DATA HIGHWAY)
// =================================================================
function toggleCanvasFullscreen() {
  const card = document.getElementById('hero-canvas-card');
  if (!card) return;

  if (!document.fullscreenElement) {
    if (card.requestFullscreen) {
      card.requestFullscreen();
    } else if (card.webkitRequestFullscreen) {
      card.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

document.addEventListener('fullscreenchange', () => {
  const isFs = !!document.fullscreenElement;
  const card = document.getElementById('hero-canvas-card');
  const biHub = document.getElementById('section-bi-hub');

  // Scope the fullscreen class to whichever element actually went fullscreen,
  // so fullscreening the BI Hub no longer restyles the canvas card as well.
  if (card) card.classList.toggle('is-fullscreen', document.fullscreenElement === card);
  if (biHub) biHub.classList.toggle('is-fullscreen', document.fullscreenElement === biHub);

  const btn3d = document.getElementById('btn-fullscreen-3d');
  const btn2d = document.getElementById('btn-fullscreen-2d');
  const btnBiFs = document.getElementById('lbl-bi-hub-fullscreen');
  const isZh = window.i18n && window.i18n.currentLang === 'zh';

  // Labels come from the i18n dictionary rather than hardcoded strings, which
  // previously reinstated emoji on the first fullscreen toggle.
  const dict = (window.i18n && window.i18n.dictionary[window.i18n.currentLang]) || {};
  const enterLbl = dict.btn_fullscreen_2d || (isZh ? '全屏' : 'Fullscreen');
  const exitLbl = dict.btn_exit_fullscreen || (isZh ? '退出全屏' : 'Exit Fullscreen');
  const canvasFs = document.fullscreenElement === card;

  if (btn3d) btn3d.textContent = canvasFs ? exitLbl : enterLbl;
  if (btn2d) btn2d.textContent = canvasFs ? exitLbl : enterLbl;
  if (btnBiFs) btnBiFs.textContent = document.fullscreenElement === biHub ? exitLbl : enterLbl;

  // Trigger 3D WebGL and 2D HTML5 canvas resize
  setTimeout(() => {
    if (window.highway3D) window.highway3D.onResize();
    if (window.topologyCanvas) window.topologyCanvas.resize();
  }, 50);
  setTimeout(() => {
    if (window.highway3D) window.highway3D.onResize();
    if (window.topologyCanvas) window.topologyCanvas.resize();
  }, 200);

  addAuditLog(isFs ? (isZh ? "⛶ 数据管道已进入全屏拓扑模式" : "⛶ Data Highway entered fullscreen mode") : (isZh ? "🗗 数据管道已退出全屏模式" : "🗗 Data Highway exited fullscreen mode"), true);
});

// Event listeners for Fullscreen triggers
document.getElementById('btn-fullscreen-3d')?.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleCanvasFullscreen();
});

document.getElementById('btn-fullscreen-2d')?.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleCanvasFullscreen();
});

// =================================================================
// 9. CFO FINANCIAL WAR ROOM & EBITDA SIMULATOR ENGINE
// =================================================================
let warroomFeedPct = 0;
let warroomHeatOffset = 0;
let warroomPeakTariff = 1.38;
let warroomFleetScale = 600; // Million birds

function updateWarroomMath() {
  const isZh = window.i18n && window.i18n.currentLang === 'zh';
  const flockScaleRatio = warroomFleetScale / 600;
  const baselineMeatTons = 1560000 * flockScaleRatio; // 600M * 2.6kg
  const currentFeedPrice = 3200 * (1 + warroomFeedPct / 100);

  // FCR reduction: baseline 0.06 savings, adjusted for heat stress
  const fcrReduction = Math.max(0.035, 0.060 - (warroomHeatOffset * 0.002));
  const feedSavingsM = (baselineMeatTons * fcrReduction * currentFeedPrice) / 1000000;

  // Mortality avoided: base ¥188.7M + heatwave loss avoidance buffer (up to ¥44.5M)
  const baseMortAvoidedM = 188.70 * flockScaleRatio;
  const heatLossDeflectedM = warroomHeatOffset > 0 ? (warroomHeatOffset * 6.8 * flockScaleRatio) : 0;
  const mortSavingsM = baseMortAvoidedM + heatLossDeflectedM;

  // Power arbitrage: tariff spread against base ¥0.42 valley price
  const tariffSpread = Math.max(0.20, warroomPeakTariff - 0.42);
  const powerSavingsM = (45000 * 365 * tariffSpread * flockScaleRatio) / 1000000;

  // Export green premium: ¥0.40/kg on 300,000t certified export meat
  const exportGreenM = 120.00 * flockScaleRatio;

  // Total EBITDA
  const totalEbitdaM = feedSavingsM + mortSavingsM + powerSavingsM + exportGreenM;
  const fcrSensM = (baselineMeatTons * 0.01 * currentFeedPrice) / 1000000;
  const marginPerBird = (totalEbitdaM * 1000000) / (warroomFleetScale * 1000000);

  // Update KPI displays
  const elEbitda = document.getElementById('val-wk-ebitda');
  const elFcr = document.getElementById('val-wk-fcr');
  const elTail = document.getElementById('val-wk-tailrisk');
  if (elEbitda) elEbitda.innerHTML = `+¥${totalEbitdaM.toFixed(2)}<small>M / yr</small>`;
  if (elFcr) elFcr.innerHTML = `¥${fcrSensM.toFixed(2)}<small>M</small>`;
  if (elTail) elTail.innerHTML = `${(92.3 - (warroomHeatOffset * 0.4)).toFixed(1)}<small>%</small>`;

  // Update Waterfall Bar Values & Widths
  const maxBar = Math.max(feedSavingsM, mortSavingsM, powerSavingsM, exportGreenM, 350);

  const elBarFeed = document.getElementById('wf-bar-feed');
  const elValFeed = document.getElementById('wf-val-feed');
  if (elBarFeed) elBarFeed.style.width = `${Math.min(100, Math.max(8, (feedSavingsM / maxBar) * 100))}%`;
  if (elValFeed) elValFeed.textContent = `+¥${feedSavingsM.toFixed(2)}M`;

  const elBarMort = document.getElementById('wf-bar-mort');
  const elValMort = document.getElementById('wf-val-mort');
  if (elBarMort) elBarMort.style.width = `${Math.min(100, Math.max(8, (mortSavingsM / maxBar) * 100))}%`;
  if (elValMort) elValMort.textContent = `+¥${mortSavingsM.toFixed(2)}M`;

  const elBarPower = document.getElementById('wf-bar-power');
  const elValPower = document.getElementById('wf-val-power');
  if (elBarPower) elBarPower.style.width = `${Math.min(100, Math.max(8, (powerSavingsM / maxBar) * 100))}%`;
  if (elValPower) elValPower.textContent = `+¥${powerSavingsM.toFixed(2)}M`;

  const elBarGreen = document.getElementById('wf-bar-green');
  const elValGreen = document.getElementById('wf-val-green');
  if (elBarGreen) elBarGreen.style.width = `${Math.min(100, Math.max(8, (exportGreenM / maxBar) * 100))}%`;
  if (elValGreen) elValGreen.textContent = `+¥${exportGreenM.toFixed(2)}M`;

  const elTotalVal = document.getElementById('wf-total-val');
  const elMarginBird = document.getElementById('wf-margin-per-bird');
  if (elTotalVal) elTotalVal.textContent = `+¥${totalEbitdaM.toFixed(2)} MILLION RMB`;
  if (elMarginBird) elMarginBird.textContent = isZh ? `+¥${marginPerBird.toFixed(2)} 元 / 羽 净利贡献提升` : `+¥${marginPerBird.toFixed(2)} / Broiler Profit Delta`;
}

function initFinancialWarRoom() {
  const sFeed = document.getElementById('slider-warroom-feed');
  const sHeat = document.getElementById('slider-warroom-heat');
  const sTariff = document.getElementById('slider-warroom-tariff');
  const sFleet = document.getElementById('slider-warroom-fleet');

  const dFeed = document.getElementById('val-disp-feed');
  const dHeat = document.getElementById('val-disp-heat');
  const dTariff = document.getElementById('val-disp-tariff');
  const dFleet = document.getElementById('val-disp-fleet');

  sFeed?.addEventListener('input', (e) => {
    warroomFeedPct = parseFloat(e.target.value);
    const p = 3200 * (1 + warroomFeedPct / 100);
    if (dFeed) dFeed.textContent = `${warroomFeedPct >= 0 ? '+' : ''}${warroomFeedPct}% (¥${Math.round(p)}/t)`;
    updateWarroomMath();
  });

  sHeat?.addEventListener('input', (e) => {
    warroomHeatOffset = parseFloat(e.target.value);
    if (dHeat) dHeat.textContent = `+${warroomHeatOffset.toFixed(1)}°C (${warroomHeatOffset > 3 ? 'Extreme Heatwave' : 'Ambient Summer'})`;
    updateWarroomMath();
  });

  sTariff?.addEventListener('input', (e) => {
    warroomPeakTariff = parseFloat(e.target.value);
    if (dTariff) dTariff.textContent = `¥${warroomPeakTariff.toFixed(2)} / kWh (Peak)`;
    updateWarroomMath();
  });

  sFleet?.addEventListener('input', (e) => {
    warroomFleetScale = parseFloat(e.target.value);
    if (dFleet) dFleet.textContent = `${warroomFleetScale}M Broilers (${Math.round(warroomFleetScale / 12)} Complexes)`;
    updateWarroomMath();
  });

  // Reset Button
  document.getElementById('btn-reset-warroom-sliders')?.addEventListener('click', () => {
    if (sFeed) sFeed.value = 0;
    if (sHeat) sHeat.value = 0;
    if (sTariff) sTariff.value = 1.38;
    if (sFleet) sFleet.value = 600;
    warroomFeedPct = 0; warroomHeatOffset = 0; warroomPeakTariff = 1.38; warroomFleetScale = 600;
    if (dFeed) dFeed.textContent = "0% (¥3,200/t)";
    if (dHeat) dHeat.textContent = "+0.0°C (Normal Summer)";
    if (dTariff) dTariff.textContent = "¥1.38 / kWh (Peak)";
    if (dFleet) dFleet.textContent = "600M Broilers (50 Complexes)";
    updateWarroomMath();
    document.querySelectorAll('.crisis-preset-card').forEach(c => c.classList.remove('active'));
  });

  // Crisis Preset Engine
  window.currentActiveCrisisPreset = 'heatwave';
  function applyCrisisPreset(presetKey) {
    window.currentActiveCrisisPreset = presetKey;
    document.querySelectorAll('.crisis-preset-card').forEach(c => c.classList.remove('active'));
    const isZh = window.i18n && window.i18n.currentLang === 'zh';
    const pbTitle = document.getElementById('playbook-title');
    const pbSub = document.getElementById('playbook-sub');
    const pbStep1 = document.getElementById('pb-step-1');
    const pbStep2 = document.getElementById('pb-step-2');
    const pbStep3 = document.getElementById('pb-step-3');

    if (presetKey === 'heatwave') {
      document.getElementById('btn-preset-heatwave')?.classList.add('active');
      warroomHeatOffset = 4.5;
      warroomPeakTariff = 2.50;
      warroomFeedPct = 0;
      warroomFleetScale = 600;

      if (sHeat) sHeat.value = 4.5;
      if (sTariff) sTariff.value = 2.50;
      if (sFeed) sFeed.value = 0;
      if (sFleet) sFleet.value = 600;

      if (dHeat) dHeat.textContent = isZh ? "+4.5°C (极端热浪 41.5°C)" : "+4.5°C (Extreme Heatwave)";
      if (dTariff) dTariff.textContent = isZh ? "¥2.50 / kWh (电网尖峰电价)" : "¥2.50 / kWh (Grid Peak Crisis)";
      if (dFeed) dFeed.textContent = isZh ? "0% (¥3,200/吨 基准)" : "0% (¥3,200/t Nominal)";
      if (dFleet) dFleet.textContent = isZh ? "6亿羽肉鸡 (50大养殖基地)" : "600M Broilers (50 Complexes)";

      if (pbTitle) pbTitle.textContent = isZh ? "🔥 极端高温热浪与电网尖峰防御策略" : "🔥 Summer Heatwave & Grid Crash Defense Strategy";
      if (pbSub) pbSub.textContent = isZh ? "自动化预冷储能与微雾协同调度" : "Autonomous Pre-Cooling & Pulse Misting Defense";
      if (pbStep1) pbStep1.innerHTML = isZh
        ? "<strong>夜间深谷蓄冷储能:</strong> 00:00-08:00 (¥0.42/度) AI 将 50大基地预降温 1.2°C，在地坪与水线中储存冷量。"
        : "<strong>Nighttime Pre-Cooling Buffer:</strong> Sub-cool all 50 complexes by 1.2°C during valley tariff (¥0.42/kWh) to store thermal mass.";
      if (pbStep2) pbStep2.innerHTML = isZh
        ? "<strong>尖峰负荷压降 -28.4%:</strong> 14:00-17:00 (¥2.50/度) 变频风机智能降速避峰，高压脉冲微雾保持体感舒适。"
        : "<strong>Micro-Misting Dynamic Staging:</strong> Throttle VFD exhaust fans during 14:00-17:00 peak pricing while pulse-misting maintains bird comfort.";
      if (pbStep3) pbStep3.innerHTML = isZh
        ? "<strong>全群 0 死淘避险:</strong> 5天极热期挽救 180万羽肉鸡生命，直接规避 ¥44.50M 灾难性死亡损失。"
        : "<strong>Zero Heat-Shock Mortality:</strong> 5-day heatwave saves 1.8M broilers, avoiding ¥44.50M in catastrophic losses.";

      updateWarroomMath();
      addAuditLog(isZh ? "☀️ [财务作战室] 已加载【夏季高温与电网尖峰预案】(41°C + ¥2.50/度分时电价)。" : "☀️ [WAR ROOM] Loaded Extreme Summer Heatwave (41°C + ¥2.50/kWh peak tariff) scenario.", true);
    }
    else if (presetKey === 'soybean') {
      document.getElementById('btn-preset-soybean')?.classList.add('active');
      warroomFeedPct = 35;
      warroomHeatOffset = 0;
      warroomPeakTariff = 1.38;
      warroomFleetScale = 600;

      if (sFeed) sFeed.value = 35;
      if (sHeat) sHeat.value = 0;
      if (sTariff) sTariff.value = 1.38;
      if (sFleet) sFleet.value = 600;

      if (dFeed) dFeed.textContent = isZh ? "+35% (¥4,320/吨 大豆粮价暴涨)" : "+35% (¥4,320/t Global Shock)";
      if (dHeat) dHeat.textContent = isZh ? "+0.0°C (常温夏粮季)" : "+0.0°C (Normal Summer)";
      if (dTariff) dTariff.textContent = isZh ? "¥1.38 / kWh (峰期)" : "¥1.38 / kWh (Peak)";
      if (dFleet) dFleet.textContent = isZh ? "6亿羽肉鸡 (50大养殖基地)" : "600M Broilers (50 Complexes)";

      if (pbTitle) pbTitle.textContent = isZh ? "🌾 全球大豆饲料价格暴涨对冲策略" : "🌾 Global Soybean Commodity Shock Mitigation";
      if (pbSub) pbSub.textContent = isZh ? "微气候闭环精调压降料肉比 FCR -0.038" : "Closed-Loop Microclimate Tuning to Cut FCR by -0.038";
      if (pbStep1) pbStep1.innerHTML = isZh
        ? "<strong>负压均匀度精细调优:</strong> 自动锁定 -18 Pa 恒定负压，确保全舍无贼风，将饲料转化率提升至最高区间。"
        : "<strong>Tunnel Negative Pressure Tuning:</strong> Lock -18 Pa static pressure to eliminate draft stress and maximize broiler gut nutrient uptake.";
      if (pbStep2) pbStep2.innerHTML = isZh
        ? "<strong>综合料肉比压降至 1.542:</strong> 相比 1.620 传统标杆节省 5,856.5吨 饲料，全集团对冲挽回 ¥149.80M 利润。"
        : "<strong>Drop FCR to 1.542:</strong> Saves 5,856.5t grain vs 1.620 benchmark, recovering ¥149.80M margin across 600M birds.";
      if (pbStep3) pbStep3.innerHTML = isZh
        ? "<strong>SAP 自动化集采防断料:</strong> 智能料塔实时称重，低于 15吨 自动向中粮/益海嘉里签发批次补料 PO 单。"
        : "<strong>Zero-Touch SAP Bulk SCM:</strong> Loadcells trigger automatic purchase orders (BAPI_PO_CREATE1) before silo drops below 15t.";

      updateWarroomMath();
      addAuditLog(isZh ? "🌾 [财务作战室] 已加载【全球大豆原料暴涨预案】(+35% 粮价冲击，AI精调料肉比对冲 ¥1.49亿)。" : "🌾 [WAR ROOM] Loaded Global Soybean Commodity Shock (+35% feed cost, recovering ¥149.80M margin).", true);
    }
    else if (presetKey === 'inverter') {
      document.getElementById('btn-preset-inverter')?.classList.add('active');
      warroomHeatOffset = 1.0;
      warroomPeakTariff = 1.38;
      warroomFeedPct = 0;
      warroomFleetScale = 600;

      if (sHeat) sHeat.value = 1.0;
      if (sTariff) sTariff.value = 1.38;
      if (sFeed) sFeed.value = 0;
      if (sFleet) sFleet.value = 600;

      if (dHeat) dHeat.textContent = isZh ? "+1.0°C (夜间微气候波动)" : "+1.0°C (Night Cold Snap)";
      if (dTariff) dTariff.textContent = isZh ? "¥1.38 / kWh" : "¥1.38 / kWh";
      if (dFeed) dFeed.textContent = isZh ? "0% (¥3,200/吨 基准)" : "0% (¥3,200/t Nominal)";
      if (dFleet) dFleet.textContent = isZh ? "6亿羽肉鸡 (50大养殖基地)" : "600M Broilers (50 Complexes)";

      if (pbTitle) pbTitle.textContent = isZh ? "🚨 凌晨 02:15 变频器跳闸与氨气暴涨自愈" : "🚨 02:15 AM Inverter Power Trip & Ammonia Self-Healing";
      if (pbSub) pbSub.textContent = isZh ? "健康智能体 0.28秒 亚秒级硬超驰能耗智能体" : "0.28s Welfare Agent Hard Priority Veto Execution";
      if (pbStep1) pbStep1.innerHTML = isZh
        ? "<strong>02:14:32 变频器偶发跳闸:</strong> 氨气在 3分钟内自 11.4 ppm 飙升至 28.5 ppm (突破 20.0 ppm 警戒线)。"
        : "<strong>02:14:32 Inverter Trip:</strong> Ammonia surges from 11.4 ppm to 28.5 ppm within 3 minutes (> 20.0 ppm safety threshold).";
      if (pbStep2) pbStep2.innerHTML = isZh
        ? "<strong>健康智能体 0.28秒 硬超驰:</strong> 强制否决能耗节电指令，备用风机全速 850 RPM 强排，30秒恢复安全浓度。"
        : "<strong>0.28s Welfare Priority Veto:</strong> Overrides Energy Agent to spin backup emergency fans at 100% (850 RPM), clearing gas in 30s.";
      if (pbStep3) pbStep3.innerHTML = isZh
        ? "<strong>挽救 48万羽在栏鸡群:</strong> 避免氨气中毒引发群体呼吸道感染与死淘，挽救 ¥10.80M 直接资产。"
        : "<strong>Preserve 480,000 Broilers:</strong> Prevents mass asphyxiation and respiratory rales, safeguarding ¥10.80M in flock assets.";

      updateWarroomMath();
      addAuditLog(isZh ? "🚨 [财务作战室] 已加载【02:15 变频器跳闸与氨气超限自愈】(0.28秒硬超驰挽救 ¥10.8M)。" : "🚨 [WAR ROOM] Loaded 02:15 AM Inverter Power Outage & 0.28s Veto Bypass (Saving ¥10.80M).", true);
    }
    else if (presetKey === 'cbam') {
      document.getElementById('btn-preset-cbam')?.classList.add('active');
      warroomFeedPct = -10;
      warroomHeatOffset = 0;
      warroomPeakTariff = 1.38;
      warroomFleetScale = 600;

      if (sFeed) sFeed.value = -10;
      if (sHeat) sHeat.value = 0;
      if (sTariff) sTariff.value = 1.38;
      if (sFleet) sFleet.value = 600;

      if (dFeed) dFeed.textContent = isZh ? "-10% (绿色认证减碳粮)" : "-10% (Green Grain Supply)";
      if (dHeat) dHeat.textContent = isZh ? "+0.0°C (常温)" : "+0.0°C (Normal)";
      if (dTariff) dTariff.textContent = isZh ? "¥1.38 / kWh" : "¥1.38 / kWh";
      if (dFleet) dFleet.textContent = isZh ? "6亿羽肉鸡 (50大养殖基地)" : "600M Broilers (50 Complexes)";

      if (pbTitle) pbTitle.textContent = isZh ? "🇪🇺 欧盟 CBAM 碳关税与国际出口绿溢价" : "🇪🇺 EU CBAM & Global Green Export Tender Capture";
      if (pbSub) pbSub.textContent = isZh ? "ISO 14064-1 权威真核验 + 数字产品护照 (DPP)" : "ISO 14064-1 Verified Digital Product Passport (DPP)";
      if (pbStep1) pbStep1.innerHTML = isZh
        ? "<strong>权威核验 1.42 kg CO₂e/kg 碳足迹:</strong> 比行业基准 (1.98 kg) 降低 -28.3%，达到 A+ 极优评级。"
        : "<strong>1.42 kg CO₂e/kg Verified Carbon Intensity:</strong> -28.3% lower than industry standard (1.98 kg), achieving Grade A+ certification.";
      if (pbStep2) pbStep2.innerHTML = isZh
        ? "<strong>SHA-256 加密数字产品护照 (DPP):</strong> 扫码即验全冷链零抗生素、动物福利黄金级认证与溯源存证。"
        : "<strong>SHA-256 Encrypted Product Passport:</strong> Scannable QR code proving 100% antibiotic-free, 99.2% welfare, and audited provenance.";
      if (pbStep3) pbStep3.innerHTML = isZh
        ? "<strong>锁定 30万吨出口溢价订单:</strong> 斩获百胜/麦当劳 +¥0.40/kg 绿色溢价，直接新增 ¥120.00M 高毛利收入。"
        : "<strong>Secure 300,000t Export Tender:</strong> Captures +¥0.40/kg green export premium from Yum!/McDonald's, adding +¥120.00M EBITDA.";

      updateWarroomMath();
      addAuditLog(isZh ? "🇪🇺 [财务作战室] 已加载【欧盟 CBAM 碳关税与绿色出口竞标】(+¥0.40/kg 绿溢价新增 ¥1.20亿)。" : "🇪🇺 [WAR ROOM] Loaded EU CBAM & Export Green Tender simulation (+¥120.00M New Revenue).", true);
    }
  }
  window.applyCrisisPreset = applyCrisisPreset;

  // Bind Crisis Preset Buttons
  document.getElementById('btn-preset-heatwave')?.addEventListener('click', () => applyCrisisPreset('heatwave'));
  document.getElementById('btn-preset-soybean')?.addEventListener('click', () => applyCrisisPreset('soybean'));
  document.getElementById('btn-preset-inverter')?.addEventListener('click', () => applyCrisisPreset('inverter'));
  document.getElementById('btn-preset-cbam')?.addEventListener('click', () => applyCrisisPreset('cbam'));

  // Playbook execution button
  document.getElementById('btn-execute-warroom-playbook')?.addEventListener('click', () => {
    const isZh = window.i18n && window.i18n.currentLang === 'zh';
    addAuditLog(isZh ? "⚡ 集团调度中枢：已向 50大基地群发下达 AI 优化运行参数指令！" : "⚡ Enterprise Dispatch: Broadcasted AI optimal operational parameters across all 50 complexes!", true);
    alert(isZh ? "✅ 优化策略已下发至 50大基地 Welotec 边缘网关！已锁定每年 ¥655.5M 预测收益。" : "✅ Optimization playbook dispatched to all 50 Welotec edge gateways! ¥655.5M EBITDA target locked.");
  });

  updateWarroomMath();
}

// =================================================================
// 10. GROK-STYLE CONVERSATIONAL COPILOT CONTROLLER
// =================================================================
function initGrokCopilot() {
  const drawer = document.getElementById('copilot-drawer');
  const btnToggle = document.getElementById('btn-toggle-copilot');
  const btnClose = document.getElementById('btn-close-copilot');
  const input = document.getElementById('copilot-input-field');
  const btnSend = document.getElementById('btn-copilot-send');
  const btnVoice = document.getElementById('btn-copilot-voice');
  const msgs = document.getElementById('copilot-messages');

  const toggleDrawer = () => {
    const isHidden = drawer.style.display === 'none' || !drawer.style.display;
    drawer.style.display = isHidden ? 'flex' : 'none';
    if (isHidden) input?.focus();
  };

  btnToggle?.addEventListener('click', toggleDrawer);
  btnClose?.addEventListener('click', () => { drawer.style.display = 'none'; });

  // Handle preset prompt clicks
  document.querySelectorAll('.cp-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const q = pill.dataset.prompt;
      if (q) handleCopilotQuery(q);
    });
  });

  const sendQuery = () => {
    const q = input?.value.trim();
    if (q) {
      handleCopilotQuery(q);
      if (input) input.value = '';
    }
  };

  btnSend?.addEventListener('click', sendQuery);
  input?.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendQuery(); });

  btnVoice?.addEventListener('click', () => {
    const isZh = window.i18n && window.i18n.currentLang === 'zh';
    if (input) input.value = isZh ? "分析南平一厂当前体感温度与饲料转化率" : "Analyze Nanping Complex 1 current thermal comfort and FCR";
    sendQuery();
  });

  function handleCopilotQuery(promptText) {
    const isZh = window.i18n && window.i18n.currentLang === 'zh';

    // 1. Add User Message
    const uMsg = document.createElement('div');
    uMsg.className = 'copilot-msg user';
    uMsg.innerHTML = `<div class="msg-body"><p>${promptText}</p></div>`;
    msgs?.appendChild(uMsg);
    msgs?.scrollTo({ top: msgs.scrollHeight, behavior: 'smooth' });

    // 2. Add Assistant Thinking Bubble
    const aMsg = document.createElement('div');
    aMsg.className = 'copilot-msg assistant';
    aMsg.innerHTML = `
      <div class="msg-avatar">🤖</div>
      <div class="msg-body">
        <p class="copilot-thinking-text">🧠 <em>${isZh ? '正在从 50大基地 Welotec 边缘网关、Snowflake 与 SAP 提取实时遥测进行 Chain-of-Thought 推理...' : 'Querying 50 Welotec edge nodes, Snowflake Lakehouse, and SAP S/4HANA with Chain-of-Thought...'}</em></p>
      </div>
    `;
    msgs?.appendChild(aMsg);
    msgs?.scrollTo({ top: msgs.scrollHeight, behavior: 'smooth' });

    // 3. Resolve Answer with Deep Reasoning
    setTimeout(() => {
      let answerHtml = "";
      let cotHtml = "";

      const lower = promptText.toLowerCase();
      if (lower.includes('fcr') || lower.includes('drift') || lower.includes('料肉比') || lower.includes('南平')) {
        cotHtml = isZh
          ? `[CoT 推理链路] 1. 查询 Snowflake Silver 表 CLEAN_CLIMATE_METRICS ➔ 2. 匹配 Nanping-01-House03 实时均重 (2.14 kg vs 标准 2.05 kg) ➔ 3. 测算料肉比为 1.54 (行业基线 1.60，优于同批次 3.8%) ➔ 4. 换算年节约大豆饲料 5,856.5 吨。`
          : `[Chain of Thought] 1. Queried Snowflake Silver table CLEAN_CLIMATE_METRICS -> 2. Matched Nanping-01-House03 live bird mass (2.14 kg vs 2.05 kg standard) -> 3. Calculated FCR at 1.54 (industry avg 1.60, +3.8% efficiency) -> 4. Evaluated feed grain savings at 5,856.5 tons/yr.`;
        answerHtml = isZh
          ? `<p><strong>南平一厂 03栋料肉比 (FCR) 分析报告：</strong></p><p>当前批次 42,500羽 白羽肉鸡料肉比达到 <strong>1.54</strong>（领跑行业基准 1.60）。主要归功于 AI 在夜间尖峰电价后实施的 0.3°C 均温微气候补偿，促进了肌间脂肪沉淀并加速日均增重达 +68.5 g/天。</p><p><strong>财务贡献：</strong> 单栋鸡舍年增效 ¥117,100 元，全集团年化增效 <strong>¥299.52M 元</strong>。</p>`
          : `<p><strong>Nanping Complex 01 • House 03 FCR Diagnostic:</strong></p><p>Current flock (42,500 broilers) FCR stands at an industry-leading <strong>1.54</strong> (vs 1.60 benchmark). The key driver is AI's nocturnal thermal compensation (+0.3°C precision control) which boosts nutrient absorption and daily weight gain (+68.5 g/day).</p><p><strong>Financial Impact:</strong> Yields <strong>+¥299.52M / year</strong> EBITDA across the 50-complex fleet.</p>`;
      } else if (lower.includes('heatwave') || lower.includes('42') || lower.includes('热浪') || lower.includes('高温')) {
        cotHtml = isZh
          ? `[CoT 推理链路] 1. 读取环境气象预测 (41.5°C 尖峰) ➔ 2. 检索鸡舍热容储能模型 ➔ 3. 规划谷电期 (00:00-08:00) 预冷 -1.2°C ➔ 4. 尖峰期启动微雾降温与 0.28s 氨气安全闸门 ➔ 5. 规避 44.5M 元死淘与高温应激损失。`
          : `[Chain of Thought] 1. Ingested weather forecast (41.5°C peak) -> 2. Retrieved barn thermal mass inertia model -> 3. Scheduled -1.2°C pre-cooling during valley tariff (00:00-08:00) -> 4. Staged micro-misting and 0.28s ammonia safety override during 14:00-17:00 -> 5. Avoided ¥44.5M mortality risk.`;
        answerHtml = isZh
          ? `<p><strong>42°C 极端热浪防御预案已就绪：</strong></p><p>系统已激活<strong>“蓄冷热电池”</strong>策略：今夜谷电期（¥0.42/度）自动将舍温微降 1.2°C 储存冷量；明日 14:00 尖峰电价期自动阶梯降频排风机至 35%，并同步以 15秒脉冲周期开启高压微雾降温。</p><p><strong>防灾成效：</strong> 阻断 92.3% 高温死淘风险，单次热浪保全资产 <strong>¥44.5M 元</strong>。</p>`
          : `<p><strong>42°C Extreme Heatwave Defense Active:</strong></p><p>The AI pre-cooling thermal battery is armed: barns will be sub-cooled by 1.2°C during tonight's valley tariff (¥0.42/kWh). Tomorrow during peak hours (14:00-17:00), exhaust fans throttle to 35% while high-pressure pulse misting maintains bird comfort.</p><p><strong>Value Protected:</strong> <strong>¥44.5M ($6.3M USD)</strong> in mortality loss prevented.</p>`;
      } else if (lower.includes('ammonia') || lower.includes('veto') || lower.includes('氨气') || lower.includes('否决')) {
        cotHtml = isZh
          ? `[CoT 推理链路] 1. 监测到 Zone 3 氨气探头由 11.4 ppm 跃升至 28.5 ppm ➔ 2. 触碰 >=20.0 ppm 生物安全红线 ➔ 3. 触发 Rule-BIO-01 最高优先权 ➔ 4. 压制 Energy Agent 节电诉求 ➔ 5. 0.28秒执行 100% (850 RPM) 排风。`
          : `[Chain of Thought] 1. Monitored Zone 3 NH3 surge from 11.4 to 28.5 ppm -> 2. Exceeded >=20.0 ppm biological danger redline -> 3. Invoked Rule-BIO-01 Health Priority Veto -> 4. Overruled Energy Agent cost optimization -> 5. Dispatched 100% (850 RPM) emergency fan command in 0.28s.`;
        answerHtml = isZh
          ? `<p><strong>0.28秒 氨气最高否决权判定过程：</strong></p><p>当 3区氨气浓度升至 <strong>28.5 ppm</strong>（超越 20.0 ppm 警戒阈值），生物健康智能体依据底层宪章行使<strong>绝对最高否决权</strong>，在 0.28秒内瞬间剥夺能耗智能体的节电权限，强制所有 12台变频风机拉满 100% 转速（850 RPM）强排氨气。</p><p><strong>生命价值：</strong> 避免了 45分钟人工巡检延迟可能造成的 42,500羽 肉鸡呼吸道死淘。</p>`
          : `<p><strong>0.28s Biological Veto Execution Log:</strong></p><p>When Zone 3 NH₃ reached <strong>28.5 ppm</strong> (>20.0 ppm safety limit), the Health Agent invoked its <strong>constitutional priority veto</strong> in 0.28 seconds, immediately overriding the Energy Agent and spinning all 12 VFD fans to 100% (850 RPM).</p><p><strong>Flock Saved:</strong> Prevented asphyxiation risk for 42,500 broilers during nocturnal hours.</p>`;
      } else if (lower.includes('sap') || lower.includes('feed') || lower.includes('po') || lower.includes('采购') || lower.includes('料塔')) {
        cotHtml = isZh
          ? `[CoT 推理链路] 1. 读取 1号与 2号料塔称重探头数据 (合计 14.8吨) ➔ 2. 触碰 <=15.0吨 警戒线 ➔ 3. 验证最近 24小时采食消耗速率 (12.4吨/天) ➔ 4. 调用 SAP BAPI_PO_CREATE1 ➔ 5. 签发 PO-2026-AUG-889104 (25吨优质大豆料，供应商 VEND-FUJIAN-01)。`
          : `[Chain of Thought] 1. Read Silo 1 & 2 loadcell telemetry (14.8t total) -> 2. Crossed <=15.0t threshold -> 3. Evaluated 24h consumption rate (12.4t/day) -> 4. Called SAP BAPI_PO_CREATE1 -> 5. Created PO-2026-AUG-889104 for 25t feed from VEND-FUJIAN-01.`;
        answerHtml = isZh
          ? `<p><strong>SAP S/4HANA 0.2秒 自动采购单签发成功：</strong></p><p>料塔库存跌至 14.8吨时，AI 自动生成采购订单 <strong>PO-2026-AUG-889104</strong>，采购 25.0吨 <code>MAT-FEED-SOYA-500</code>。供应商（福建饲料一厂）已接收自动排产计划，预计 6小时内送达。</p><p><strong>管理效益：</strong> 零断料风险，每日为基地场长节省 2小时手工提单时间。</p>`
          : `<p><strong>SAP S/4HANA Zero-Touch Auto-PO Executed:</strong></p><p>Silo dropped to 14.8t. AI automatically created Purchase Order <strong>PO-2026-AUG-889104</strong> for 25.0 tons of <code>MAT-FEED-SOYA-500</code> via BAPI in 0.2 seconds. Delivery ETA: 6 hours.</p><p><strong>Efficiency:</strong> Zero human paperwork, 100% feed continuity guaranteed.</p>`;
      } else {
        cotHtml = isZh
          ? `[CoT 推理链路] 1. 解析自然语言指令 ➔ 2. 全网扫描 13大节点数字血缘 ➔ 3. 验证设备与算法闭环自愈响应 ➔ 4. 生成第一性原理决策建议。`
          : `[Chain of Thought] 1. Parsed natural language intent -> 2. Scanned 13-node industrial graph -> 3. Validated autonomous closed-loop state -> 4. Formulated first-principles recommendation.`;
        answerHtml = isZh
          ? `<p><strong>圣农决策中枢实时响应：</strong></p><p>当前全域 50大基地（600M羽白羽肉鸡）系统运行健康度 <strong>99.8%</strong>，闭环响应延迟 &lt;350ms。各项微气候探头与 SAP 自动流转均处于第一性原理最优帕累托前沿。</p>`
          : `<p><strong>Sunner Cortex Decision Hub Response:</strong></p><p>All 50 complexes (600M broilers) are operating at <strong>99.8%</strong> system health with &lt;350ms closed-loop latency. Telemetry, energy arbitrage, and SAP procurement are running on the Pareto frontier.</p>`;
      }

      const bodyEl = aMsg.querySelector('.msg-body');
      if (bodyEl) {
        bodyEl.innerHTML = `
          <div class="copilot-cot-box">${cotHtml}</div>
          <div class="copilot-answer-text">${answerHtml}</div>
        `;
      }
      msgs?.scrollTo({ top: msgs.scrollHeight, behavior: 'smooth' });
      addAuditLog(isZh ? `🧠 [COPILOT] 完成高阶自然语言推理：“${promptText}”` : `🧠 [COPILOT] Resolved natural language reasoning: "${promptText}"`, true);
    }, 400);
  }
}

// =================================================================
// 11. BIO-ACOUSTIC SPECTROGRAM & THERMAL FLIR SUITE
// =================================================================
let spectrogramAnimationId = null;
let coughSpikeActive = false;
let flirThermalActive = false;

function initBioAcousticSpectrogram() {
  const canvas = document.getElementById('canvas-bio-spectrogram');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const numBins = 48;
  const binWidth = canvas.width / numBins;
  let phase = 0;

  function renderSpectrogram() {
    ctx.fillStyle = '#010118';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let y = 20; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw audio frequency bars (chirps in 1.5 - 3.5 kHz range)
    for (let i = 0; i < numBins; i++) {
      const freq = (i / numBins) * 8.0; // 0 - 8 kHz
      let amp = 0;

      // Normal healthy broiler chirp band around 2.0 - 2.8 kHz
      if (freq >= 1.8 && freq <= 3.2) {
        amp = 40 + Math.sin(phase * 3 + i * 0.4) * 25 + Math.random() * 15;
      } else {
        amp = 10 + Math.sin(phase + i) * 6 + Math.random() * 5;
      }

      // If cough spike injected, trigger high-energy harsh rales spike at 4.0 - 6.5 kHz
      if (coughSpikeActive && freq >= 4.0 && freq <= 6.5) {
        amp = 85 + Math.random() * 25;
      }

      const x = i * binWidth;
      const h = Math.min(canvas.height - 10, amp);
      const y = canvas.height - h;

      // Gradient color: Cyan/Green for normal, Amber/Red for cough
      const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
      if (coughSpikeActive && freq >= 4.0 && freq <= 6.5) {
        grad.addColorStop(0, '#f43f5e');
        grad.addColorStop(1, '#f59e0b');
      } else {
        grad.addColorStop(0, '#38bdf8');
        grad.addColorStop(0.5, '#06b6d4');
        grad.addColorStop(1, '#10b981');
      }

      ctx.fillStyle = grad;
      ctx.fillRect(x + 2, y, binWidth - 4, h);
    }

    phase += 0.05;
    spectrogramAnimationId = requestAnimationFrame(renderSpectrogram);
  }

  renderSpectrogram();

  // Cough Spike Injection Button
  document.getElementById('btn-simulate-cough-spike')?.addEventListener('click', () => {
    const isZh = window.i18n && window.i18n.currentLang === 'zh';
    coughSpikeActive = true;

    const badge = document.getElementById('bio-cough-status');
    const lbl = document.getElementById('bio-cough-status-lbl');
    if (badge) { badge.className = "bio-status-badge danger"; }
    if (lbl) { lbl.textContent = isZh ? "🚨 48h 早期呼吸道杂音预警 • 异常指数 0.38 (检出咳嗽)" : "🚨 48h PRE-SYMPTOMATIC WARNING • ANOMALY 0.38 (COUGH RALES)"; }

    addAuditLog(isZh ? "🔬 [生物声学] 2区麦克风捕获异常高频咳嗽杂音 (5.2 kHz)！已提前 48小时启动气溶胶预防护。" : "🔬 [BIO-ACOUSTICS] Captured atypical cough rales (5.2 kHz) in Zone 2! Dispatched 48h early aerosol defense.", true);

    setTimeout(() => {
      coughSpikeActive = false;
      if (badge) { badge.className = "bio-status-badge green"; }
      if (lbl) { lbl.textContent = isZh ? "● 0 异常杂音 / 100% 健康鸣叫曲线" : "● 0 Atypical Rales / 100% Healthy Vocalization"; }
    }, 4500);
  });

  // FLIR Thermal Mode Toggle Button
  document.getElementById('btn-toggle-flir-thermal')?.addEventListener('click', () => {
    const isZh = window.i18n && window.i18n.currentLang === 'zh';
    flirThermalActive = !flirThermalActive;
    const btn = document.getElementById('btn-toggle-flir-thermal');
    const cutaway = document.getElementById('barn-cutaway-container');

    if (btn) btn.classList.toggle('active', flirThermalActive);
    if (cutaway) cutaway.classList.toggle('flir-active', flirThermalActive);

    addAuditLog(isZh ? (flirThermalActive ? "🔥 红外热成像视界已开启：鸡群分布均匀无聚堆" : "🔥 红外热成像视界已关闭") : (flirThermalActive ? "🔥 FLIR Thermal Vision Active: Uniform flock distribution, zero huddling" : "🔥 FLIR Thermal Vision Deactivated"), true);
  });
}

// =================================================================
// 12. TIME-TRAVEL & BLACK-BOX INCIDENT REPLAY ENGINE
// =================================================================
let isTimeReplayPlaying = false;

function initTimeTravelReplay() {
  const btnBookmark = document.getElementById('btn-replay-incident-0214');
  const btnPlay = document.getElementById('btn-time-toggle-play');
  const btnLive = document.getElementById('btn-time-live');
  const timeDisp = document.getElementById('time-travel-timestamp');

  btnBookmark?.addEventListener('click', () => {
    const isZh = window.i18n && window.i18n.currentLang === 'zh';
    if (timeDisp) timeDisp.innerHTML = `<span style="color: #f43f5e;">🔴 REPLAY: 02:14:32 AM (Aug 16)</span>`;
    if (btnPlay) btnPlay.textContent = isZh ? "⏸ 暂停复盘" : "⏸ Pause Replay";
    isTimeReplayPlaying = true;

    // Trigger Ammonia Crisis Veto directly
    document.getElementById('side-scen-ammonia')?.click();
    addAuditLog(isZh ? "⏳ [黑匣子复盘] 已跳跃至 02:14:32 AM：变频风机断电跳闸，氨气飙升至 28.5 ppm，AI 在 0.28秒内执行应急强排。" : "⏳ [BLACK-BOX REPLAY] Jumped to 02:14:32 AM: Inverter tripped, NH3 spiked to 28.5 ppm, AI executed 0.28s emergency veto flush.", true);
  });

  btnLive?.addEventListener('click', () => {
    const isZh = window.i18n && window.i18n.currentLang === 'zh';
    if (timeDisp) timeDisp.textContent = "LIVE (Now: 13:30:00)";
    if (btnPlay) btnPlay.textContent = isZh ? "▶ 复盘" : "▶ Replay";
    isTimeReplayPlaying = false;
    document.getElementById('side-scen-closedloop')?.click();
    addAuditLog(isZh ? "🔴 时空回溯已恢复至实时在线流 (Live Stream)" : "🔴 Time-travel restored to Real-Time Live Stream", true);
  });

  btnPlay?.addEventListener('click', () => {
    const isZh = window.i18n && window.i18n.currentLang === 'zh';
    isTimeReplayPlaying = !isTimeReplayPlaying;
    if (btnPlay) btnPlay.textContent = isTimeReplayPlaying ? (isZh ? "⏸ 暂停复盘" : "⏸ Pause Replay") : (isZh ? "▶ 复盘" : "▶ Replay");
  });
}

// =================================================================
// 13. DIGITAL PRODUCT PASSPORT (DPP) MODAL CONTROLLER
// =================================================================
function initDigitalProductPassport() {
  const modal = document.getElementById('modal-dpp');
  const btnClose = document.getElementById('btn-close-dpp');
  const btnKeynoteDpp = document.getElementById('btn-keynote-dpp');
  const btnDownload = document.getElementById('btn-download-dpp-cert');

  const openDpp = () => {
    if (modal) modal.style.display = 'flex';
    const isZh = window.i18n && window.i18n.currentLang === 'zh';
    addAuditLog(isZh ? "🏷️ [数字护照] 已调取 03栋 BATCH-2026-08A 绿色肉鸡数字产品护照 (DPP)" : "🏷️ [DPP] Loaded Digital Product Passport for BATCH-2026-08A (A+ Green Certified)", true);
  };

  const closeDpp = () => {
    if (modal) modal.style.display = 'none';
  };

  btnKeynoteDpp?.addEventListener('click', openDpp);
  document.getElementById('btn-keynote-warroom')?.addEventListener('click', () => {
    document.getElementById('nav-btn-warroom')?.click();
  });

  btnClose?.addEventListener('click', closeDpp);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeDpp();
  });

  btnDownload?.addEventListener('click', () => {
    const isZh = window.i18n && window.i18n.currentLang === 'zh';
    alert(isZh ? "📄 经过 SHA-256 哈希加密存证的百胜/麦当劳出口数字肉鸡护照 (PDF) 下载成功！" : "📄 Export DPP Certificate (PDF with SHA-256 blockchain signature) downloaded successfully!");
  });
}

// =================================================================
// 14. 1-CLICK 3-MINUTE AUTONOMOUS EXECUTIVE PITCH RUNNER
// =================================================================
function startAutonomousPitch() {
  const isZh = window.i18n && window.i18n.currentLang === 'zh';
  addAuditLog(isZh ? "🎬 [全自动路演] 启动 3分钟高管全自主演示巡航！" : "🎬 [AUTO-PITCH] Launched autonomous 3-minute executive investor pitch!", true);

  // Step 1: Jump to 3D Cyber Highway
  document.getElementById('nav-btn-highway')?.click();
  document.getElementById('btn-view-3d')?.click();

  // Step 2: In 3.5 seconds, trigger Ammonia Emergency
  setTimeout(() => {
    document.getElementById('side-scen-ammonia')?.click();
  }, 3500);

  // Step 3: In 7.5 seconds, jump to CFO Financial War Room
  setTimeout(() => {
    document.getElementById('nav-btn-warroom')?.click();
    document.getElementById('btn-preset-heatwave')?.click();
  }, 7500);

  // Step 4: In 12 seconds, open Barn Spatial Twin with Bio-Acoustics & FLIR
  setTimeout(() => {
    document.getElementById('nav-btn-barn')?.click();
    document.getElementById('btn-toggle-flir-thermal')?.click();
  }, 12000);

  // Step 5: In 16.5 seconds, open Digital Product Passport
  setTimeout(() => {
    document.getElementById('btn-keynote-dpp')?.click();
  }, 16500);

  // Step 6: In 21 seconds, close DPP and open Keynote Presentation Deck
  setTimeout(() => {
    document.getElementById('btn-close-dpp')?.click();
    document.getElementById('nav-btn-presentation')?.click();
  }, 21000);
}

document.getElementById('btn-auto-pitch')?.addEventListener('click', startAutonomousPitch);

// =================================================================
// 15. DEDICATED EXECUTIVE BI COMMAND CENTER ENGINE
// =================================================================
const enterpriseComplexesData = [
  { id: "NP-01", name: "Nanping Complex 01 (HQ)", region: "Fujian (南平)", breed: "sz901", strainName: "Sunner SZ901", houses: 16, birds: 680000, temp: 22.4, nh3: 11.4, silo: 35.7, mode: "0.3s Closed-Loop", fcr: 1.536, powerSaved: 485200, status: "optimal" },
  { id: "NP-02", name: "Nanping Complex 02 (Guangze)", region: "Fujian (光泽)", breed: "sz901", strainName: "Sunner SZ901", houses: 14, birds: 595000, temp: 22.1, nh3: 10.8, silo: 28.4, mode: "0.3s Closed-Loop", fcr: 1.534, powerSaved: 421000, status: "optimal" },
  { id: "NP-03", name: "Nanping Complex 03 (Pucheng)", region: "Fujian (浦城)", breed: "cobb500", strainName: "Cobb500", houses: 12, birds: 510000, temp: 22.8, nh3: 12.1, silo: 18.2, mode: "Eco-Throttled", fcr: 1.548, powerSaved: 389000, status: "optimal" },
  { id: "SM-01", name: "Sanming Complex 01 (Youxi)", region: "Fujian (尤溪)", breed: "sz901", strainName: "Sunner SZ901", houses: 12, birds: 510000, temp: 22.3, nh3: 11.9, silo: 24.5, mode: "0.3s Closed-Loop", fcr: 1.538, powerSaved: 362000, status: "optimal" },
  { id: "SM-02", name: "Sanming Complex 02 (Shaxian)", region: "Fujian (沙县)", breed: "cobb500", strainName: "Cobb500", houses: 10, birds: 425000, temp: 23.0, nh3: 13.2, silo: 14.8, mode: "Auto SAP Reordered", fcr: 1.550, powerSaved: 310000, status: "warning" },
  { id: "GZ-01", name: "Ganzhou Complex 01 (Zifang)", region: "Jiangxi (赣州)", breed: "sz901", strainName: "Sunner SZ901", houses: 16, birds: 680000, temp: 22.6, nh3: 12.5, silo: 42.0, mode: "0.3s Closed-Loop", fcr: 1.537, powerSaved: 478000, status: "optimal" },
  { id: "GZ-02", name: "Ganzhou Complex 02 (Ningdu)", region: "Jiangxi (宁都)", breed: "cobb500", strainName: "Cobb500", houses: 14, birds: 595000, temp: 22.9, nh3: 11.7, silo: 31.2, mode: "0.3s Closed-Loop", fcr: 1.546, powerSaved: 415000, status: "optimal" },
  { id: "PL-01", name: "Pingliang Complex 01 (Kongtong)", region: "Gansu (平凉)", breed: "cobb500", strainName: "Cobb500", houses: 14, birds: 595000, temp: 21.8, nh3: 10.2, silo: 38.5, mode: "0.3s Closed-Loop", fcr: 1.551, powerSaved: 395000, status: "optimal" },
  { id: "PL-02", name: "Pingliang Complex 02 (Jingchuan)", region: "Gansu (泾川)", breed: "cobb500", strainName: "Cobb500", houses: 12, birds: 510000, temp: 23.4, nh3: 14.1, silo: 21.0, mode: "Pulse-Misting Armed", fcr: 1.553, powerSaved: 360000, status: "warning" },
  { id: "ZM-01", name: "Zhumadian Complex 01 (Queshan)", region: "Henan (驻马店)", breed: "sz901", strainName: "Sunner SZ901", houses: 16, birds: 680000, temp: 22.5, nh3: 11.6, silo: 39.8, mode: "0.3s Closed-Loop", fcr: 1.536, powerSaved: 482000, status: "optimal" },
  { id: "ZM-02", name: "Zhumadian Complex 02 (Xiping)", region: "Henan (西平)", breed: "cobb500", strainName: "Cobb500", houses: 12, birds: 510000, temp: 22.7, nh3: 12.0, silo: 26.5, mode: "0.3s Closed-Loop", fcr: 1.547, powerSaved: 375000, status: "optimal" }
];

let activeBiTab = 'tab-bi-complexes';
let activeBiGeo = 'all';
let activeBiTime = 'live24';
let activeBiBreed = 'all';
let activeBiSearchStr = '';

function renderBiNorthStarTiles() {
  const isZh = window.i18n && window.i18n.currentLang === 'zh';
  
  // Calculate scaled throughput based on geo & time
  let throughputNum = "624.50";
  let throughputUnit = isZh ? "M 羽 / 年" : "M Birds / yr";
  let throughputSub = isZh ? "● 162万吨白羽鸡肉 • 100% 自主育种谱系" : "● 1.62M Metric Tons • 100% Pedigree";
  
  let fcrNum = "1.542";
  let fcrVs = isZh ? "对比标杆 1.620" : "vs 1.620";
  let fcrSub = isZh ? "● 年节约饲料大豆玉米 ¥2.995亿元" : "● ¥299.52M Annual Feed Grain Saved";
  
  let powerNum = "¥15.77";
  let powerUnit = isZh ? "M / 年" : "M / yr";
  let powerSub = isZh ? "● 4,820万度负荷转移至谷电 (¥0.42)" : "● 48.2 GWh Shifted to Valley (¥0.42)";
  
  let mortNum = "1.18";
  let mortUnit = "%";
  let mortSub = isZh ? "● 单基地多成活 49.7万羽 • 死淘降低 75%" : "● +497,250 Birds Preserved / Complex";
  
  let carbonNum = "18,886";
  let carbonUnit = isZh ? "吨 CO₂e" : "t CO₂e";
  let carbonSub = isZh ? "● 斩获国家 A+ 级出口绿色数字护照认证" : "● A+ Green Export Passport Certified";
  
  let ebitdaNum = "+¥655.5";
  let ebitdaUnit = isZh ? "M / 年" : "M / yr";
  let ebitdaSub = isZh ? "● $92.3M 美元经常性 EBITDA 增量" : "● $92.3M USD Bottom-Line Delta";

  // Time multipliers & dynamic formatting
  if (activeBiTime === 'live24') {
    const baseDaily = activeBiGeo === 'all' ? 1.71 : (activeBiGeo === 'nanping' ? 0.55 : (activeBiGeo === 'ganzhou' ? 0.41 : 0.35));
    throughputNum = baseDaily.toFixed(2);
    throughputUnit = isZh ? "M 羽 / 24小时" : "M Birds / 24h";
    throughputSub = isZh ? "● 实时 24小时各基地传感器与自动化流水线" : "● Live 24h Real-Time Farm Automation Ingestion";

    powerNum = "¥40.68";
    powerUnit = isZh ? "k / 日" : "k / day";
    powerSub = isZh ? "● 单日转移 13.2万度尖峰电价负荷" : "● 132 MWh Shifted Out of Peak (¥1.38)";

    carbonNum = "51.7";
    carbonUnit = isZh ? "吨 CO₂e / 日" : "t CO₂e / day";
    carbonSub = isZh ? "● 今日电力避峰与饲料节约核算减排" : "● Today's Verified Carbon Abatement";

    ebitdaNum = "+¥1.79";
    ebitdaUnit = isZh ? "M / 日" : "M / day";
    ebitdaSub = isZh ? "● 今日第一性原理量化净利润新增" : "● Today's Real-Time EBITDA Delta";
  } else if (activeBiTime === 'batch7') {
    const baseWeekly = activeBiGeo === 'all' ? 12.00 : (activeBiGeo === 'nanping' ? 3.85 : (activeBiGeo === 'ganzhou' ? 2.88 : 2.45));
    throughputNum = baseWeekly.toFixed(2);
    throughputUnit = isZh ? "M 羽 / 7天批次" : "M Birds / 7d";
    throughputSub = isZh ? "● 7天周度采食、增重与微气候滚动均值" : "● 7-Day Rolling Growth & Climate Mean";

    powerNum = "¥284.8";
    powerUnit = isZh ? "k / 周" : "k / wk";
    powerSub = isZh ? "● 本周削峰填谷节电套利累计" : "● 7-Day Cumulative TOU Arbitrage Savings";

    carbonNum = "362.2";
    carbonUnit = isZh ? "吨 CO₂e / 周" : "t CO₂e / wk";
    carbonSub = isZh ? "● 7天 ISO 14064 周度核算碳足迹" : "● 7-Day ISO 14064 Audited Carbon Footprint";

    ebitdaNum = "+¥12.57";
    ebitdaUnit = isZh ? "M / 周" : "M / wk";
    ebitdaSub = isZh ? "● 本周 EBITDA 净利新增贡献" : "● 7-Day Recurring EBITDA Inflow";
  } else if (activeBiTime === 'cohort42') {
    const baseCohort = activeBiGeo === 'all' ? 72.05 : (activeBiGeo === 'nanping' ? 23.10 : (activeBiGeo === 'ganzhou' ? 17.28 : 14.65));
    throughputNum = baseCohort.toFixed(2);
    throughputUnit = isZh ? "M 羽 / 42天出栏周期" : "M Birds / 42d";
    throughputSub = isZh ? "● 完整 42天出栏大批次均重 2,850g" : "● Full 42-Day Harvest Weight: 2,850g";

    fcrSub = isZh ? "● 42天周期累计节粮 ¥2,496万元" : "● ¥24.96M Feed Grain Saved in Cohort";

    powerNum = "¥1.71";
    powerUnit = isZh ? "M / 周期" : "M / cohort";
    powerSub = isZh ? "● 42天全周期变频与蓄冷节电" : "● 42-Day Dynamic Climate Power Savings";

    carbonNum = "2,173";
    carbonUnit = isZh ? "吨 CO₂e / 周期" : "t CO₂e / cohort";
    carbonSub = isZh ? "● 42天出栏批次碳护照核算总量" : "● Full Cohort Carbon Passport Abatement";

    ebitdaNum = "+¥75.43";
    ebitdaUnit = isZh ? "M / 周期" : "M / cohort";
    ebitdaSub = isZh ? "● 单批次出栏创造 EBITDA 增量" : "● Full 42-Day Harvest EBITDA Margin";
  }

  // Strain variations
  if (activeBiBreed === 'sz901') {
    fcrNum = "1.536";
    fcrVs = isZh ? "对比标杆 1.620 (冠军品系)" : "vs 1.620 (SZ901 Champ)";
    fcrSub = isZh ? "● 圣泽901 日均增重 +71.4g (高出行业 8.2%)" : "● SZ901 Daily Gain +71.4g (+8.2% vs Cobb)";
    mortNum = "1.02";
    mortSub = isZh ? "● 圣泽901 强抗应激性，死淘率仅 1.02%" : "● High Robustness, Mortality Down to 1.02%";
  } else if (activeBiBreed === 'cobb500') {
    fcrNum = "1.548";
    fcrVs = isZh ? "对比标杆 1.620 (Cobb500)" : "vs 1.620 (Cobb500 Std)";
    fcrSub = isZh ? "● Cobb500 国际标杆白羽肉鸡基因品系" : "● Cobb500 Standard Global Broiler Strain";
    mortNum = "1.26";
    mortSub = isZh ? "● Cobb500 闭环自愈死淘率 1.26%" : "● Closed-Loop Mortality at 1.26%";
  }

  // Geo cluster filtering tweaks
  if (activeBiGeo === 'nanping') {
    throughputSub = isZh ? "● 福建南平总部基地 (16大养殖基地核心区)" : "● Fujian Nanping HQ Hub (16 Complexes)";
  } else if (activeBiGeo === 'ganzhou') {
    throughputSub = isZh ? "● 江西赣州基地 (12大养殖基地集群)" : "● Jiangxi Ganzhou Cluster (12 Complexes)";
  } else if (activeBiGeo === 'pingliang') {
    throughputSub = isZh ? "● 甘肃平凉基地 (10大养殖基地北方集群)" : "● Gansu Pingliang Cluster (10 Complexes)";
  } else if (activeBiGeo === 'zhumadian') {
    throughputSub = isZh ? "● 河南驻马店基地 (12大养殖基地中原集群)" : "● Henan Zhumadian Cluster (12 Complexes)";
  }

  // Inject into DOM
  const val1 = document.getElementById('bi-kpi-val-1');
  const sub1 = document.getElementById('bi-kpi-sub-1');
  if (val1) val1.innerHTML = `${throughputNum}<small>${throughputUnit}</small>`;
  if (sub1) sub1.textContent = throughputSub;

  const val2 = document.getElementById('bi-kpi-val-2');
  const sub2 = document.getElementById('bi-kpi-sub-2');
  if (val2) val2.innerHTML = `${fcrNum}<small>${fcrVs}</small>`;
  if (sub2) sub2.textContent = fcrSub;

  const val3 = document.getElementById('bi-kpi-val-3');
  const sub3 = document.getElementById('bi-kpi-sub-3');
  if (val3) val3.innerHTML = `${powerNum}<small>${powerUnit}</small>`;
  if (sub3) sub3.textContent = powerSub;

  const val4 = document.getElementById('bi-kpi-val-4');
  const sub4 = document.getElementById('bi-kpi-sub-4');
  if (val4) val4.innerHTML = `${mortNum}<small>${mortUnit}</small>`;
  if (sub4) sub4.textContent = mortSub;

  const val5 = document.getElementById('bi-kpi-val-5');
  const sub5 = document.getElementById('bi-kpi-sub-5');
  if (val5) val5.innerHTML = `${carbonNum}<small>${carbonUnit}</small>`;
  if (sub5) sub5.textContent = carbonSub;

  const val6 = document.getElementById('bi-kpi-val-6');
  const sub6 = document.getElementById('bi-kpi-sub-6');
  if (val6) val6.innerHTML = `${ebitdaNum}<small>${ebitdaUnit}</small>`;
  if (sub6) sub6.textContent = ebitdaSub;
}

function renderExecutiveBiHub() {
  renderBiNorthStarTiles();
  renderBiFleetTable();
  renderBiClustersList();
  renderBiGrowthSvg();
  renderBiTariffSvg();
  renderBiSilosGrid();
  renderBiRadarSvg();
}

function renderBiFleetTable() {
  const tbody = document.getElementById('tbody-enterprise-complexes');
  if (!tbody) return;

  const isZh = window.i18n && window.i18n.currentLang === 'zh';
  let filtered = enterpriseComplexesData.filter(c => {
    const matchSearch = activeBiSearchStr === '' ||
      c.name.toLowerCase().includes(activeBiSearchStr.toLowerCase()) ||
      c.region.toLowerCase().includes(activeBiSearchStr.toLowerCase()) ||
      c.id.toLowerCase().includes(activeBiSearchStr.toLowerCase());

    const matchGeo = activeBiGeo === 'all' ||
      (activeBiGeo === 'nanping' && (c.region.includes('南平') || c.region.includes('光泽') || c.region.includes('浦城') || c.region.includes('Fujian'))) ||
      (activeBiGeo === 'ganzhou' && (c.region.includes('Jiangxi') || c.region.includes('赣州'))) ||
      (activeBiGeo === 'pingliang' && (c.region.includes('Gansu') || c.region.includes('平凉'))) ||
      (activeBiGeo === 'zhumadian' && (c.region.includes('Henan') || c.region.includes('驻马店')));

    const matchBreed = activeBiBreed === 'all' || c.breed === activeBiBreed;

    return matchSearch && matchGeo && matchBreed;
  });

  tbody.innerHTML = filtered.map(c => {
    let powerDisplay = `¥${(c.powerSaved / 1000).toFixed(1)}k/y`;
    if (activeBiTime === 'live24') {
      powerDisplay = `¥${(c.powerSaved / 365 / 1000).toFixed(1)}k/d`;
    } else if (activeBiTime === 'batch7') {
      powerDisplay = `¥${(c.powerSaved / 52 / 1000).toFixed(1)}k/w`;
    } else if (activeBiTime === 'cohort42') {
      powerDisplay = `¥${(c.powerSaved / 8.7 / 1000).toFixed(1)}k/c`;
    }

    return `
      <tr>
        <td>
          <strong>${c.name}</strong>
          <span class="agent-vote-badge ${c.breed === 'sz901' ? 'purple' : 'cyan'}" style="margin-left: 0.35rem; font-size: 0.68rem; padding: 0.1rem 0.35rem;">${c.strainName}</span><br>
          <small style="color: #94a3b8;">${c.id} • ${c.region}</small>
        </td>
        <td>${c.houses} ${isZh ? '栋舍' : 'Houses'}</td>
        <td><strong>${(c.birds / 10000).toFixed(1)}万</strong> <small>${isZh ? '羽' : 'Birds'}</small></td>
        <td><span class="${c.temp > 23 ? 'amber-text' : 'green-text'}">${c.temp.toFixed(1)}°C</span></td>
        <td><span class="${c.nh3 > 13 ? 'amber-text' : 'green-text'}">${c.nh3.toFixed(1)} ppm</span></td>
        <td>${c.silo.toFixed(1)}t ${c.silo < 15 ? '<span style="color: #f43f5e; font-weight: 800;">(PO Reordered)</span>' : ''}</td>
        <td>
          <span class="agent-vote-badge ${c.status === 'optimal' ? 'green' : 'amber'}">${c.mode}</span>
        </td>
        <td><strong class="cyan-text">${c.fcr.toFixed(3)}</strong></td>
        <td><strong class="green-text">${powerDisplay}</strong></td>
        <td>
          <button class="bi-filter-btn" onclick="inspectComplexDetails('${c.id}')" style="padding: 0.15rem 0.45rem;">
            ${isZh ? '🔍 诊断' : '🔍 Inspect'}
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function inspectComplexDetails(cId) {
  const isZh = window.i18n && window.i18n.currentLang === 'zh';
  const item = enterpriseComplexesData.find(c => c.id === cId) || enterpriseComplexesData[0];
  alert(isZh
    ? `【基地全息诊断】\n基地名称: ${item.name} (${item.strainName})\n批次存栏: ${item.birds.toLocaleString()} 羽\n当前舍温: ${item.temp}°C | 氨气: ${item.nh3} ppm\n料肉比: ${item.fcr} (优于同批次 3.8%)\n年化节电: ¥${item.powerSaved.toLocaleString()} 元\n运行状态: ${item.mode}`
    : `[Complex Holographic Diagnostic]\nComplex: ${item.name} (${item.strainName})\nFlock Population: ${item.birds.toLocaleString()} Broilers\nTemperature: ${item.temp}°C | Ammonia: ${item.nh3} ppm\nFCR: ${item.fcr} (3.8% Ahead of Cohort)\nYTD Power Saved: ¥${item.powerSaved.toLocaleString()} CNY\nAutopilot: ${item.mode}`);
}

function renderBiClustersList() {
  const container = document.getElementById('gis-clusters-list');
  if (!container) return;
  const isZh = window.i18n && window.i18n.currentLang === 'zh';

  const clusters = [
    { name: isZh ? "福建南平总部集群 (16大基地)" : "Fujian Nanping HQ Cluster (16 Complexes)", birds: "960万羽", fcr: "1.541", savings: "¥7.82M", status: "100% Closed Loop", color: "green" },
    { name: isZh ? "江西赣州核心集群 (12大基地)" : "Jiangxi Ganzhou Cluster (12 Complexes)", birds: "720万羽", fcr: "1.544", savings: "¥4.95M", status: "Optimal", color: "green" },
    { name: isZh ? "甘肃平凉北方集群 (10大基地)" : "Gansu Pingliang North Cluster (10 Complexes)", birds: "600万羽", fcr: "1.552", savings: "¥3.85M", status: "Heatwave Defense", color: "cyan" },
    { name: isZh ? "河南驻马店中原集群 (12大基地)" : "Henan Zhumadian Cluster (12 Complexes)", birds: "720万羽", fcr: "1.543", savings: "¥4.82M", status: "Closed Loop", color: "purple" }
  ];

  container.innerHTML = clusters.map(c => `
    <div class="gis-cluster-row">
      <div class="cluster-row-top">
        <span class="cluster-name">${c.name}</span>
        <span class="agent-vote-badge ${c.color}">${c.status}</span>
      </div>
      <div class="cluster-kpis">
        <span>${isZh ? '存栏规模' : 'Flock'}: <strong>${c.birds}</strong></span>
        <span>FCR: <strong class="cyan-text">${c.fcr}</strong></span>
        <span>${isZh ? '累计节电' : 'Saved'}: <strong class="green-text">${c.savings}</strong></span>
      </div>
    </div>
  `).join('');
}

function renderBiGrowthSvg() {
  const stage = document.getElementById('bi-svg-growth-stage');
  if (!stage) return;
  const isZh = window.i18n && window.i18n.currentLang === 'zh';

  // Dynamic parameters based on active strain
  let day26Weight = 2140;
  let day26Delta = "+90g vs Genetic Std";
  let finalWeight = "2,865g";
  let fcrVal = "1.542";
  let actualStroke = "#38bdf8";
  let strainTitle = isZh ? "综合群体 (SZ901 + Cobb500)" : "Fleet Average (SZ901 + Cobb500)";
  let actualPath = "M 60 268 Q 300 220, 540 96 T 860 48";
  let fillPath = "M 60 268 Q 300 220, 540 96 T 860 48 L 860 270 L 60 270 Z";
  let circleY = 96;

  if (activeBiBreed === 'sz901') {
    day26Weight = 2190;
    day26Delta = "+140g (SZ901 冠标增重)";
    finalWeight = "2,910g";
    fcrVal = "1.536";
    actualStroke = "#10b981";
    strainTitle = isZh ? "圣泽901 冠军高抗品系" : "Sunner SZ901 (Champion Line)";
    actualPath = "M 60 268 Q 300 210, 540 84 T 860 38";
    fillPath = "M 60 268 Q 300 210, 540 84 T 860 38 L 860 270 L 60 270 Z";
    circleY = 84;
  } else if (activeBiBreed === 'cobb500') {
    day26Weight = 2090;
    day26Delta = "+40g (Cobb500 国际标杆)";
    finalWeight = "2,820g";
    fcrVal = "1.548";
    actualStroke = "#38bdf8";
    strainTitle = isZh ? "Cobb500 国际白羽品系" : "Cobb500 (White Broiler)";
    actualPath = "M 60 268 Q 300 225, 540 108 T 860 56";
    fillPath = "M 60 268 Q 300 225, 540 108 T 860 56 L 860 270 L 60 270 Z";
    circleY = 108;
  }

  stage.innerHTML = `
    <svg viewBox="0 0 900 320" width="100%" height="100%" style="display: block;">
      <defs>
        <linearGradient id="growthFillGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${actualStroke}" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="${actualStroke}" stop-opacity="0.0"/>
        </linearGradient>
        <linearGradient id="fcrGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#10b981"/>
          <stop offset="100%" stop-color="#34d399"/>
        </linearGradient>
      </defs>

      <!-- Grid lines -->
      <line x1="60" y1="40" x2="860" y2="40" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <line x1="60" y1="100" x2="860" y2="100" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <line x1="60" y1="160" x2="860" y2="160" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <line x1="60" y1="220" x2="860" y2="220" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <line x1="60" y1="270" x2="860" y2="270" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>

      <!-- Y Axis Labels Left (Body Weight) -->
      <text x="50" y="45" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="end">2800g</text>
      <text x="50" y="105" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="end">2100g</text>
      <text x="50" y="165" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="end">1400g</text>
      <text x="50" y="225" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="end">700g</text>
      <text x="50" y="275" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="end">0g</text>

      <!-- X Axis Labels (Days) -->
      <text x="60" y="295" fill="#94a3b8" font-size="10" font-family="monospace">Day 1</text>
      <text x="220" y="295" fill="#94a3b8" font-size="10" font-family="monospace">Day 10</text>
      <text x="380" y="295" fill="#94a3b8" font-size="10" font-family="monospace">Day 20</text>
      <text x="540" y="295" fill="#38bdf8" font-size="11" font-weight="bold" font-family="monospace">Day 26 (Now)</text>
      <text x="700" y="295" fill="#94a3b8" font-size="10" font-family="monospace">Day 35</text>
      <text x="840" y="295" fill="#94a3b8" font-size="10" font-family="monospace">Day 42</text>

      <!-- Standard Benchmark Line (Dotted Gray) -->
      <path d="M 60 268 Q 300 230, 540 115 T 860 65" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="4 4"/>

      <!-- Actual Weight Area & Line -->
      <path d="${fillPath}" fill="url(#growthFillGrad)"/>
      <path d="${actualPath}" fill="none" stroke="${actualStroke}" stroke-width="3.5"/>

      <!-- Current Day 26 Pin -->
      <line x1="540" y1="40" x2="540" y2="270" stroke="${actualStroke}" stroke-width="1.5" stroke-dasharray="2 2"/>
      <circle cx="540" cy="${circleY}" r="6" fill="${actualStroke}" stroke="#ffffff" stroke-width="2"/>
      <rect x="548" y="${circleY - 20}" width="145" height="38" rx="4" fill="rgba(2,2,45,0.95)" stroke="${actualStroke}" stroke-width="1"/>
      <text x="556" y="${circleY - 4}" fill="#ffffff" font-size="10" font-weight="bold" font-family="sans-serif">Day 26: ${day26Weight.toLocaleString()} g</text>
      <text x="556" y="${circleY + 10}" fill="#34d399" font-size="9" font-family="monospace">${day26Delta}</text>

      <!-- FCR Trend Line (Green on secondary scale) -->
      <path d="M 60 140 Q 300 180, 540 210 T 860 235" fill="none" stroke="url(#fcrGrad)" stroke-width="2.5"/>

      <!-- Strain & Filter Title Banner -->
      <rect x="60" y="10" width="300" height="24" rx="4" fill="rgba(15,23,42,0.85)" stroke="rgba(255,255,255,0.1)"/>
      <text x="70" y="26" fill="#38bdf8" font-size="10" font-weight="bold">🧬 ${strainTitle} • ${activeBiTime.toUpperCase()}</text>

      <!-- Legend -->
      <rect x="660" y="12" width="12" height="12" rx="2" fill="${actualStroke}"/>
      <text x="678" y="22" fill="#e2e8f0" font-size="10">${isZh ? '实测均重 (g)' : 'Actual Weight (g)'}</text>
      <line x1="660" y1="32" x2="672" y2="32" stroke="#64748b" stroke-width="2" stroke-dasharray="3 3"/>
      <text x="678" y="36" fill="#94a3b8" font-size="10">Genetic Benchmark</text>
      <line x1="660" y1="46" x2="672" y2="46" stroke="#10b981" stroke-width="2.5"/>
      <text x="678" y="50" fill="#34d399" font-size="10">FCR (${fcrVal})</text>
    </svg>
  `;
}

function renderBiTariffSvg() {
  const stage = document.getElementById('bi-svg-tariff-stage');
  if (!stage) return;
  const isZh = window.i18n && window.i18n.currentLang === 'zh';

  // Dynamic values based on time horizon
  let savedBadge = isZh ? "▼ 削峰 -28.4%" : "▼ -28.4% Cut";
  let savedSub = isZh ? "今日节电 ¥40,684" : "Saved ¥40.68k/d";

  if (activeBiTime === 'batch7') {
    savedSub = isZh ? "本周节电 ¥284,788" : "Saved ¥284.8k/wk";
  } else if (activeBiTime === 'cohort42') {
    savedSub = isZh ? "周期节电 ¥1.71M" : "Saved ¥1.71M/cycle";
  } else if (activeBiTime === 'ytd') {
    savedSub = isZh ? "年度累计 ¥15.77M" : "Saved ¥15.77M/yr";
  }

  stage.innerHTML = `
    <svg viewBox="0 0 900 320" width="100%" height="100%" style="display: block;">
      <defs>
        <linearGradient id="valleyFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#10b981" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#10b981" stop-opacity="0.05"/>
        </linearGradient>
      </defs>

      <!-- Background Tariff Bands -->
      <!-- Valley: 00:00 - 08:00 (width ~ 300px) -->
      <rect x="60" y="30" width="266" height="240" fill="rgba(16,185,129,0.06)"/>
      <text x="140" y="50" fill="#34d399" font-size="10" font-weight="bold" font-family="monospace">VALLEY (¥0.42/kWh)</text>

      <!-- Flat 1: 08:00 - 14:00 (width ~ 200px) -->
      <rect x="326" y="30" width="200" height="240" fill="rgba(59,130,246,0.04)"/>
      <text x="380" y="50" fill="#60a5fa" font-size="10" font-weight="bold" font-family="monospace">FLAT (¥0.85)</text>

      <!-- Peak: 14:00 - 17:00 (width ~ 100px) -->
      <rect x="526" y="30" width="100" height="240" fill="rgba(244,63,94,0.12)"/>
      <text x="535" y="50" fill="#fda4af" font-size="10" font-weight="bold" font-family="monospace">PEAK (¥1.38)</text>

      <!-- Flat 2: 17:00 - 24:00 (width ~ 234px) -->
      <rect x="626" y="30" width="234" height="240" fill="rgba(59,130,246,0.04)"/>
      <text x="690" y="50" fill="#60a5fa" font-size="10" font-weight="bold" font-family="monospace">FLAT (¥0.85)</text>

      <!-- Base Unoptimized Grid Load Curve (Red Line) -->
      <path d="M 60 210 Q 200 200, 326 140 T 526 70 T 626 120 T 860 190" fill="none" stroke="#f43f5e" stroke-width="2.5" stroke-dasharray="4 3"/>

      <!-- AI Optimized Shifted Load (Green Area & Line) -->
      <path d="M 60 120 Q 200 110, 326 155 T 526 215 T 626 160 T 860 180 L 860 270 L 60 270 Z" fill="url(#valleyFill)"/>
      <path d="M 60 120 Q 200 110, 326 155 T 526 215 T 626 160 T 860 180" fill="none" stroke="#10b981" stroke-width="3.5"/>

      <!-- Savings Callout at Peak -->
      <rect x="520" y="110" width="115" height="44" rx="4" fill="rgba(2,2,45,0.95)" stroke="#10b981" stroke-width="1"/>
      <text x="528" y="126" fill="#34d399" font-size="10" font-weight="bold" font-family="sans-serif">${savedBadge}</text>
      <text x="528" y="143" fill="#ffffff" font-size="9" font-family="monospace">${savedSub}</text>

      <!-- X Axis Ticks -->
      <text x="60" y="290" fill="#94a3b8" font-size="9" font-family="monospace">00:00</text>
      <text x="190" y="290" fill="#94a3b8" font-size="9" font-family="monospace">04:00</text>
      <text x="326" y="290" fill="#94a3b8" font-size="9" font-family="monospace">08:00</text>
      <text x="460" y="290" fill="#94a3b8" font-size="9" font-family="monospace">12:00</text>
      <text x="526" y="290" fill="#fda4af" font-size="9" font-weight="bold" font-family="monospace">14:00 (Peak)</text>
      <text x="626" y="290" fill="#94a3b8" font-size="9" font-family="monospace">17:00</text>
      <text x="750" y="290" fill="#94a3b8" font-size="9" font-family="monospace">20:00</text>
      <text x="850" y="290" fill="#94a3b8" font-size="9" font-family="monospace">24:00</text>
    </svg>
  `;
}

function renderBiSilosGrid() {
  const container = document.getElementById('silo-gauges-grid');
  if (!container) return;
  const isZh = window.i18n && window.i18n.currentLang === 'zh';

  const silos = [
    { name: "Silo A1 (House 01)", mass: 38.5, max: 45, burn: "12.2 t/d", status: isZh ? "充足" : "Optimal", tag: "ok" },
    { name: "Silo A2 (House 02)", mass: 35.7, max: 45, burn: "12.4 t/d", status: isZh ? "充足" : "Optimal", tag: "ok" },
    { name: "Silo A3 (House 03)", mass: 14.8, max: 45, burn: "12.5 t/d", status: isZh ? "已触警戒 • 自动补料" : "Auto-PO Triggered", tag: "critical" },
    { name: "Silo A4 (House 04)", mass: 28.2, max: 45, burn: "11.8 t/d", status: isZh ? "充足" : "Optimal", tag: "ok" },
    { name: "Silo B1 (House 05)", mass: 41.0, max: 45, burn: "12.1 t/d", status: isZh ? "充足" : "Optimal", tag: "ok" },
    { name: "Silo B2 (House 06)", mass: 22.4, max: 45, burn: "12.0 t/d", status: isZh ? "正常" : "Normal", tag: "ok" },
    { name: "Silo B3 (House 07)", mass: 18.5, max: 45, burn: "11.9 t/d", status: isZh ? "注意余量" : "Monitor", tag: "low" },
    { name: "Silo B4 (House 08)", mass: 36.8, max: 45, burn: "12.3 t/d", status: isZh ? "充足" : "Optimal", tag: "ok" }
  ];

  container.innerHTML = silos.map(s => {
    const pct = Math.round((s.mass / s.max) * 100);
    return `
      <div class="silo-gauge-card">
        <span class="silo-name">${s.name}</span>
        <div class="silo-graphic-bar">
          <div class="silo-fill-level" style="height: ${pct}%; background: ${s.tag === 'critical' ? '#f43f5e' : (s.tag === 'low' ? '#f59e0b' : 'linear-gradient(180deg, #38bdf8, #0284c7)')};"></div>
        </div>
        <span class="silo-mass-val">${s.mass.toFixed(1)} <small>t</small></span>
        <span class="silo-status-tag ${s.tag}">${s.status}</span>
      </div>
    `;
  }).join('');

  // Render SAP PO Table
  const poTbody = document.getElementById('tbody-sap-pos');
  if (!poTbody) return;

  const pos = [
    { po: "PO-2026-AUG-889104", mat: "MAT-FEED-SOYA-500", qty: "25.0 Tons", time: "13:14:02", lag: "0.21s", supp: "VEND-FUJIAN-01", status: isZh ? "已确认排产" : "Confirmed in SAP" },
    { po: "PO-2026-AUG-889098", mat: "MAT-FEED-SOYA-500", qty: "25.0 Tons", time: "10:45:18", lag: "0.19s", supp: "VEND-FUJIAN-01", status: isZh ? "运输在途中" : "In Transit (ETA 2h)" },
    { po: "PO-2026-AUG-889075", mat: "MAT-FEED-PREMIX-02", qty: "10.0 Tons", time: "08:20:00", lag: "0.24s", supp: "VEND-JIANGXI-03", status: isZh ? "已入库核销" : "Delivered & Verified" }
  ];

  poTbody.innerHTML = pos.map(p => `
    <tr>
      <td><strong>${p.po}</strong></td>
      <td><code>${p.mat}</code></td>
      <td><strong class="cyan-text">${p.qty}</strong></td>
      <td>${p.time}</td>
      <td><span class="green-text">${p.lag}</span></td>
      <td>${p.supp}</td>
      <td><span class="agent-vote-badge green">${p.status}</span></td>
    </tr>
  `).join('');
}

function renderBiRadarSvg() {
  const stage = document.getElementById('bi-svg-radar-stage');
  if (!stage) return;
  const isZh = window.i18n && window.i18n.currentLang === 'zh';

  stage.innerHTML = `
    <svg viewBox="0 0 450 320" width="100%" height="100%" style="display: block;">
      <defs>
        <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#0284c7" stop-opacity="0.1"/>
        </radialGradient>
      </defs>

      <!-- Center circles -->
      <circle cx="225" cy="160" r="100" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <circle cx="225" cy="160" r="75" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <circle cx="225" cy="160" r="50" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <circle cx="225" cy="160" r="25" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>

      <!-- 6 Axis spokes -->
      <line x1="225" y1="160" x2="225" y2="60" stroke="rgba(255,255,255,0.15)"/>
      <line x1="225" y1="160" x2="311" y2="110" stroke="rgba(255,255,255,0.15)"/>
      <line x1="225" y1="160" x2="311" y2="210" stroke="rgba(255,255,255,0.15)"/>
      <line x1="225" y1="160" x2="225" y2="260" stroke="rgba(255,255,255,0.15)"/>
      <line x1="225" y1="160" x2="139" y2="210" stroke="rgba(255,255,255,0.15)"/>
      <line x1="225" y1="160" x2="139" y2="110" stroke="rgba(255,255,255,0.15)"/>

      <!-- Radar Polygon (98.8%, 99.4%, 97.6%, 100%, 99.2%, 98.1%) -->
      <polygon points="225,62 309,112 308,208 225,260 141,208 141,113" fill="url(#radarGrad)" stroke="#38bdf8" stroke-width="2.5"/>

      <!-- Radar Points -->
      <circle cx="225" cy="62" r="4" fill="#38bdf8"/>
      <circle cx="309" cy="112" r="4" fill="#38bdf8"/>
      <circle cx="308" cy="208" r="4" fill="#38bdf8"/>
      <circle cx="225" cy="260" r="4" fill="#38bdf8"/>
      <circle cx="141" cy="208" r="4" fill="#38bdf8"/>
      <circle cx="141" cy="113" r="4" fill="#38bdf8"/>

      <!-- Labels -->
      <text x="225" y="48" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">${isZh ? '体感温度舒适 (98.8%)' : 'Thermal Comfort (98.8%)'}</text>
      <text x="325" y="110" fill="#ffffff" font-size="10" font-weight="bold">${isZh ? '氨气安全 (99.4%)' : 'NH3 Safety (99.4%)'}</text>
      <text x="325" y="215" fill="#ffffff" font-size="10" font-weight="bold">${isZh ? '负压静压 (97.6%)' : 'Static Pressure (97.6%)'}</text>
      <text x="225" y="280" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">${isZh ? '碳核减排 (100%)' : 'Carbon Abatement (100%)'}</text>
      <text x="125" y="215" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="end">${isZh ? '声学生物健康 (99.2%)' : 'Bio-Acoustics (99.2%)'}</text>
      <text x="125" y="110" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="end">${isZh ? '采食饮水均衡 (98.1%)' : 'Feed/Water Intake (98.1%)'}</text>
    </svg>
  `;

  // Render compliance breakdown metrics
  const list = document.getElementById('compliance-metrics-list');
  if (!list) return;

  const metrics = [
    { name: isZh ? "舍内全域均温波动度 (±0.3°C 目标)" : "Barn Thermal Gradient Uniformity (±0.3°C Target)", val: "99.2%", status: "Optimal" },
    { name: isZh ? "氨气浓度安全达标率 (< 15.0 ppm 红线)" : "Ammonia Concentration Safety Compliance (< 15.0 ppm)", val: "99.8%", status: "Optimal" },
    { name: isZh ? "负压静压稳定性 (-15 Pa 至 -22 Pa 目标)" : "Tunnel Static Pressure Stability (-15 to -22 Pa Target)", val: "98.5%", status: "Optimal" },
    { name: isZh ? "生物声学未发病杂音指数 (异常度 < 0.10)" : "Bio-Acoustic Pre-Symptomatic Rales Anomaly Index (< 0.10)", val: "99.4%", status: "Optimal" },
    { name: isZh ? "料塔防断料 JIT 自动化达成率 (100% 免断料)" : "Silo Zero-Runout JIT Procurement Success Rate", val: "100.0%", status: "Optimal" }
  ];

  list.innerHTML = metrics.map(m => `
    <div class="comp-metric-row">
      <span class="comp-metric-name">${m.name}</span>
      <span class="comp-metric-score">${m.val}</span>
    </div>
  `).join('');
}

function initExecutiveBiHub() {
  const isZh = window.i18n && window.i18n.currentLang === 'zh';

  // Tab Switcher
  document.querySelectorAll('.bi-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bi-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.bi-tab-pane').forEach(p => p.style.display = 'none');

      btn.classList.add('active');
      const targetId = btn.dataset.tab;
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.style.display = 'block';
        if (targetId === 'tab-bi-growth') renderBiGrowthSvg();
        if (targetId === 'tab-bi-tariff') renderBiTariffSvg();
        if (targetId === 'tab-bi-sap') renderBiSilosGrid();
        if (targetId === 'tab-bi-health') renderBiRadarSvg();
      }
    });
  });

  // Search input filter
  const searchInput = document.getElementById('input-search-complex');
  searchInput?.addEventListener('input', (e) => {
    activeBiSearchStr = e.target.value;
    renderBiFleetTable();
  });

  // Geo cluster filters
  document.querySelectorAll('#bi-geo-filters .bi-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#bi-geo-filters .bi-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeBiGeo = btn.dataset.geo || 'all';
      renderExecutiveBiHub();
      addAuditLog(isZh ? `📊 商业智能大屏：地理集群切换为 [${btn.textContent.trim()}]` : `📊 BI Hub: Geographic cluster filtered to [${btn.textContent.trim()}]`, true);
    });
  });

  // Time horizon filters
  document.querySelectorAll('#bi-time-filters .bi-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#bi-time-filters .bi-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeBiTime = btn.dataset.time || 'live24';
      renderExecutiveBiHub();
      addAuditLog(isZh ? `📊 商业智能大屏：时间范围切换为 [${btn.textContent.trim()}]` : `📊 BI Hub: Time horizon changed to [${btn.textContent.trim()}]`, true);
    });
  });

  // Breed filters
  document.querySelectorAll('#bi-breed-filters .bi-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#bi-breed-filters .bi-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeBiBreed = btn.dataset.breed || 'all';
      renderExecutiveBiHub();
      addAuditLog(isZh ? `📊 商业智能大屏：肉鸡品系切换为 [${btn.textContent.trim()}]` : `📊 BI Hub: Genetic strain filtered to [${btn.textContent.trim()}]`, true);
    });
  });

  // Export board pack button
  document.getElementById('btn-bi-export-boardpack')?.addEventListener('click', () => {
    alert(isZh
      ? "📊 圣农集团 × GEA 董事会数字化运营决策报告 (PDF / PowerBI Dataset) 已导出并生成！"
      : "📊 Sunner × GEA Board Analytics & Decision Deck (PDF / PowerBI Dataset) generated and downloaded!");
  });

  // Render initial BI views
  renderExecutiveBiHub();
}

// =================================================================
// 16. GLOBAL CLICKABLE INTERACTIVITY & UNIVERSAL HAPTIC REACTION ENGINE
// =================================================================
function initGlobalClickInteractivity() {
  const isZh = window.i18n && window.i18n.currentLang === 'zh';

  // 1. Facility Switcher Badge
  const facilities = [
    { name: "Nanping Complex 01 (HQ)", house: "House 03 • 42.5k Cobb500" },
    { name: "Nanping Complex 02 (Guangze)", house: "House 01 • 45.0k SZ901" },
    { name: "Sanming Complex 01 (Youxi)", house: "House 05 • 42.0k SZ901" },
    { name: "Ganzhou Complex 01 (Zifang)", house: "House 02 • 42.5k Cobb500" },
    { name: "Pingliang Complex 01 (Kongtong)", house: "House 04 • 38.0k Cobb500" },
    { name: "Zhumadian Complex 01 (Queshan)", house: "House 06 • 42.5k SZ901" }
  ];
  let activeFacIdx = 0;
  document.querySelector('.facility-badge')?.addEventListener('click', () => {
    activeFacIdx = (activeFacIdx + 1) % facilities.length;
    const f = facilities[activeFacIdx];
    const infoEl = document.querySelector('.facility-info');
    if (infoEl) {
      infoEl.innerHTML = `<strong>${f.name}</strong><small>${f.house}</small>`;
    }
    const currentIsZh = window.i18n && window.i18n.currentLang === 'zh';
    addAuditLog(currentIsZh ? `📍 切换实时基地焦点: [${f.name}] (${f.house})` : `📍 Switched Facility Focus: [${f.name}] (${f.house})`, true);
  });

  // 2. User Profile Card
  document.querySelector('.user-profile-card')?.addEventListener('click', () => {
    const currentIsZh = window.i18n && window.i18n.currentLang === 'zh';
    alert(currentIsZh
      ? "👤 【操作员身份认证与运行凭证 / Operator Session】\n姓名: Victor Lee (李工)\n岗位: 数字化转型负责人 (CDIO / Operations Lead)\n安全通道: 21Vianet Microsoft Azure China East 2 (上海) 等保三级\n认证状态: TLS 1.3 实时双向加密 • 亚秒级闭环权限已授予"
      : "👤 [Operator Session & Credentials]\nName: Victor Lee\nTitle: CDIO / Operations Lead\nCompliance: 21Vianet Microsoft Azure China East 2 (Shanghai) MLPS Level 3\nChannel: TLS 1.3 Bidirectional Encrypted • Sub-350ms Closed-Loop Authorized");
  });

  // 3. Top Global KPI Pills
  document.querySelectorAll('.top-kpi-pill').forEach((pill, idx) => {
    pill.addEventListener('click', () => {
      if (idx === 0) {
        document.getElementById('nav-btn-barn')?.click();
      } else if (idx === 1) {
        document.getElementById('nav-btn-bi')?.click();
        document.getElementById('btn-tab-tariff')?.click();
      } else if (idx === 2) {
        document.getElementById('side-scen-closedloop')?.click();
      }
    });
  });

  // 4. Return to Keynote Deck Button
  document.getElementById('btn-return-to-deck')?.addEventListener('click', () => {
    document.getElementById('nav-btn-presentation')?.click();
    const btn = document.getElementById('btn-return-to-deck');
    if (btn) btn.style.display = 'none';
  });

  // 5. 2D and 3D Fullscreen Buttons
  document.getElementById('btn-fullscreen-3d')?.addEventListener('click', () => {
    const c = document.getElementById('hero-canvas-card') || document.getElementById('viewport-3d');
    if (c) {
      if (!document.fullscreenElement) c.requestFullscreen?.();
      else document.exitFullscreen?.();
    }
  });

  document.getElementById('btn-fullscreen-2d')?.addEventListener('click', () => {
    const c = document.getElementById('hero-canvas-card') || document.getElementById('viewport-2d');
    if (c) {
      if (!document.fullscreenElement) c.requestFullscreen?.();
      else document.exitFullscreen?.();
    }
  });

  // 6. Presentation Deck Fullscreen & Notes Toggle
  document.getElementById('btn-deck-fullscreen')?.addEventListener('click', () => {
    const deck = document.getElementById('section-presentation-deck');
    if (deck) {
      if (!document.fullscreenElement) deck.requestFullscreen?.();
      else document.exitFullscreen?.();
    }
  });

  document.getElementById('btn-deck-toggle-notes')?.addEventListener('click', () => {
    const notes = document.getElementById('speaker-teleprompter-card');
    const btn = document.getElementById('btn-deck-toggle-notes');
    if (notes && btn) {
      const isHidden = notes.style.display === 'none';
      notes.style.display = isHidden ? 'block' : 'none';
      btn.classList.toggle('active', isHidden);
    }
  });

  // 7. Cortex Multi-Agent Consensus Stack Cards
  const agentDetails = {
    health: {
      zh: "🩺 [生物健康智能体] 实时舍温 22.4°C，氨气 11.4 ppm，静压 -18.2 Pa。微气候舒适度 98.8%。拥有最高安全否决权（氨气 >=20 ppm 时 0.28秒强行拉满风机）。",
      en: "🩺 [Health & Welfare Agent] Real-time temp 22.4°C, NH3 11.4 ppm, static pressure -18.2 Pa. Comfort at 98.8%. Holds ultimate safety veto (0.28s full fan flush if NH3 >= 20 ppm)."
    },
    energy: {
      zh: "⚡ [电价与能耗智能体] 当前处于尖峰电价区间 (¥1.38/kWh)。风机降频至 25% 运行，单日节电 ¥40,684，年化降费 ¥15.77M。",
      en: "⚡ [Energy & Tariff Agent] Peak electricity pricing active (¥1.38/kWh). VFD fans throttled to 25%, saving ¥40,684/day (¥15.77M/year)."
    },
    sap: {
      zh: "📦 [SAP 供应链智能体] 1号与2号料塔实时称重 35.7吨。低于 15.0吨 时将通过 BAPI_PO_CREATE1 在 0.2秒内自动签发 25吨 补料单。",
      en: "📦 [SAP Supply Chain Agent] Silo stock at 35.7t. Automatically dispatches 25t purchase order via BAPI in 0.2s when reserve drops below 15.0t."
    },
    esg: {
      zh: "🌱 [碳减排与 ESG 智能体] Scope 2 绿电避峰减排 2,487.5 吨/年，Scope 3 节粮减排 16,398.2 吨/年。获评国家 A+ 级出口绿色数字护照认证。",
      en: "🌱 [Decarbonization & ESG Agent] Scope 2 power cut saves 2,487.5 t CO2/yr, Scope 3 grain savings avoids 16,398.2 t CO2/yr. Grade A+ certified."
    }
  };

  ['health', 'energy', 'sap', 'esg'].forEach(agentKey => {
    document.getElementById(`card-agent-${agentKey}`)?.addEventListener('click', () => {
      const currentIsZh = window.i18n && window.i18n.currentLang === 'zh';
      const narr = document.getElementById('cortex-narrative');
      if (narr) narr.textContent = `"${agentDetails[agentKey][currentIsZh ? 'zh' : 'en']}"`;
      addAuditLog(agentDetails[agentKey][currentIsZh ? 'zh' : 'en'], true);
    });
  });

  // 8. Cockpit Hero Stat Cards
  document.getElementById('story-kpi-strip')?.addEventListener('click', (e) => {
    const card = e.target.closest('.hero-stat-card');
    if (!card) return;
    const lbl = card.querySelector('.stat-lbl')?.textContent.trim();
    if (lbl?.includes('TEMP')) {
      document.getElementById('nav-btn-barn')?.click();
    } else if (lbl?.includes('AMMONIA') || lbl?.includes('NH')) {
      document.getElementById('side-scen-ammonia')?.click();
    } else if (lbl?.includes('SILO') || lbl?.includes('FEED')) {
      document.getElementById('side-scen-sap')?.click();
    }
  });

  // 9. Real-Time Audit Ticker Rows
  document.getElementById('live-audit-ticker')?.addEventListener('click', (e) => {
    const row = e.target.closest('.ticker-row');
    if (!row) return;
    const currentIsZh = window.i18n && window.i18n.currentLang === 'zh';
    const time = row.querySelector('.tick-time')?.textContent || "13:30:00";
    const msg = row.querySelector('.tick-msg')?.textContent || "Telemetry verified";
    alert(currentIsZh
      ? `🔐 【不可篡改审计账本记录】\n时间戳: ${time}\n交易内容: ${msg}\nSHA-256 哈希: e8b4f2c99a10583d73b2241cf892305a\n存证状态: Palantir Foundry 权威防伪区块链已确认`
      : `🔐 [Immutable Ledger Transaction Proof]\nTimestamp: ${time}\nPayload: ${msg}\nSHA-256 Hash: e8b4f2c99a10583d73b2241cf892305a\nStatus: Palantir Foundry Audited & Verified`);
  });

  // 10. BI North-Star KPI Tiles
  document.querySelectorAll('.bi-stat-card').forEach((card, i) => {
    card.addEventListener('click', () => {
      if (i === 0) {
        document.getElementById('btn-tab-complexes')?.click();
      } else if (i === 1) {
        document.getElementById('btn-tab-growth')?.click();
      } else if (i === 2) {
        document.getElementById('btn-tab-tariff')?.click();
      } else if (i === 3) {
        document.getElementById('btn-tab-health')?.click();
      } else if (i === 4) {
        document.getElementById('nav-btn-esg')?.click();
      } else if (i === 5) {
        document.getElementById('nav-btn-warroom')?.click();
      }
    });
  });

  // 11. Growth Cohort Selector Dropdown
  document.getElementById('select-growth-batch')?.addEventListener('change', (e) => {
    const val = e.target.value;
    if (val === 'batch-sz901') {
      activeBiBreed = 'sz901';
    } else if (val === 'batch-benchmark') {
      activeBiBreed = 'cobb500';
    } else {
      activeBiBreed = 'all';
    }
    document.querySelectorAll('#bi-breed-filters .bi-filter-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.breed === activeBiBreed);
    });
    renderExecutiveBiHub();
  });

  // 12. Silo Gauges Grid Interactivity
  document.getElementById('silo-gauges-grid')?.addEventListener('click', (e) => {
    const card = e.target.closest('.silo-gauge-card');
    if (!card) return;
    const name = card.querySelector('.silo-name')?.textContent || "Silo A3";
    const mass = card.querySelector('.silo-mass-val')?.textContent || "14.8 t";
    const currentIsZh = window.i18n && window.i18n.currentLang === 'zh';
    const confirmPO = confirm(currentIsZh
      ? `🌾 【料塔库存全息诊断】\n料塔标识: ${name}\n当前库存: ${mass}\n日均耗料: 12.4 吨/天\n\n是否立即向 SAP S/4HANA 签发 25吨 补料采购单？`
      : `🌾 [Silo Holographic Diagnostic]\nSilo ID: ${name}\nStock Level: ${mass}\nBurn Rate: 12.4 t/day\n\nDispatch 25.0-ton JIT Purchase Order in SAP S/4HANA?`);
    if (confirmPO) {
      addAuditLog(currentIsZh ? `📦 [SAP 自动补料] 已向供应商签发 PO-2026-AUG-${Math.floor(889000 + Math.random()*1000)} (25.0吨)` : `📦 [SAP Auto-PO] Dispatched PO-2026-AUG-${Math.floor(889000 + Math.random()*1000)} for 25.0 Tons`, true);
      alert(currentIsZh ? "✅ SAP 订单已生成并同步至饲料厂排产计划！" : "✅ SAP PO created and queued for immediate delivery!");
    }
  });

  // 13. SAP PO Table Rows
  document.getElementById('tbody-sap-pos')?.addEventListener('click', (e) => {
    const row = e.target.closest('tr');
    if (!row) return;
    const currentIsZh = window.i18n && window.i18n.currentLang === 'zh';
    const poNum = row.cells[0]?.textContent.trim();
    const mat = row.cells[1]?.textContent.trim();
    const qty = row.cells[2]?.textContent.trim();
    alert(currentIsZh
      ? `📦 【SAP S/4HANA 采购凭证详情】\n采购订单号: ${poNum}\n物料代码: ${mat}\n采购数量: ${qty}\nBAPI 协议: BAPI_PO_CREATE1 (0.21s 极速响应)\n状态: 供应商已确认排产，全冷链运输中`
      : `📦 [SAP S/4HANA PO Voucher]\nPO Number: ${poNum}\nMaterial: ${mat}\nQuantity: ${qty}\nProtocol: BAPI_PO_CREATE1 (0.21s latency)\nStatus: Confirmed & In Transit`);
  });

  // 14. Tariff Breakdown Cards
  document.querySelectorAll('.tariff-card-box').forEach((card, i) => {
    card.addEventListener('click', () => {
      const sliderTariff = document.getElementById('slider-sim-tariff');
      const lblTariff = document.getElementById('lbl-sim-tariff');
      const currentIsZh = window.i18n && window.i18n.currentLang === 'zh';
      if (sliderTariff) {
        sliderTariff.value = i + 1;
        const labels = [
          currentIsZh ? "谷段 (¥0.42/度)" : "Valley (¥0.42)",
          currentIsZh ? "平段 (¥0.85/度)" : "Flat (¥0.85)",
          currentIsZh ? "尖峰 (¥1.38/度)" : "Peak (¥1.38)"
        ];
        if (lblTariff) lblTariff.textContent = labels[i];
        addAuditLog(currentIsZh ? `⚡ 模拟器分时电价设为: ${labels[i]}` : `⚡ Live simulator tariff set to: ${labels[i]}`, true);
      }
    });
  });

  // 15. Compliance Metric Rows
  document.getElementById('compliance-metrics-list')?.addEventListener('click', (e) => {
    const row = e.target.closest('.comp-metric-row');
    if (!row) return;
    const currentIsZh = window.i18n && window.i18n.currentLang === 'zh';
    const name = row.querySelector('.comp-metric-name')?.textContent;
    const score = row.querySelector('.comp-metric-score')?.textContent;
    alert(currentIsZh
      ? `🔬 【微气候合规诊断】\n监测指标: ${name}\n实时达标率: ${score}\n传感器标定: Pt100 / Modbus 双通道冗余 (误差 < ±0.1°C)\n运行建议: 维持当前 0.3s 闭环自愈模式`
      : `🔬 [Microclimate Compliance Check]\nMetric: ${name}\nCompliance Score: ${score}\nCalibration: Dual-channel redundant Pt100/Modbus (< ±0.1°C)\nStatus: Optimal (0.3s closed-loop active)`);
  });

  // 16. GIS Cluster List Click
  document.getElementById('gis-clusters-list')?.addEventListener('click', (e) => {
    const row = e.target.closest('.gis-cluster-row');
    if (!row) return;
    const name = row.querySelector('.cluster-name')?.textContent || '';
    if (name.includes('南平') || name.includes('Nanping')) {
      activeBiGeo = 'nanping';
    } else if (name.includes('赣州') || name.includes('Ganzhou')) {
      activeBiGeo = 'ganzhou';
    } else if (name.includes('平凉') || name.includes('Pingliang')) {
      activeBiGeo = 'pingliang';
    } else if (name.includes('驻马店') || name.includes('Zhumadian')) {
      activeBiGeo = 'zhumadian';
    } else {
      activeBiGeo = 'all';
    }
    document.querySelectorAll('#bi-geo-filters .bi-filter-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.geo === activeBiGeo);
    });
    renderExecutiveBiHub();
  });

  // 17. Fleet Alert Ticker Click
  document.getElementById('bi-fleet-alert-ticker')?.addEventListener('click', (e) => {
    const row = e.target.closest('.alert-row');
    if (!row) return;
    const currentIsZh = window.i18n && window.i18n.currentLang === 'zh';
    alert(currentIsZh
      ? `🚨 【基地实时预警雷达】\n${row.textContent.trim()}\n系统动作: 智能体已自主介入并自愈，无需人工现场干预。`
      : `🚨 [Fleet Exception Alert]\n${row.textContent.trim()}\nAction: Cortex AI has autonomously mitigated the exception.`);
  });

  // 18. Evolution Era Cards
  document.querySelectorAll('.evo-card').forEach((card) => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.evo-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const currentIsZh = window.i18n && window.i18n.currentLang === 'zh';
      const name = card.querySelector('.evo-name')?.textContent;
      addAuditLog(currentIsZh ? `📜 演进阶段切换为: [${name}]` : `📜 Switched evolution era to: [${name}]`, true);
    });
  });

  // 19. ESG 3-Pillars Cards
  document.querySelectorAll('.esg-card').forEach((card) => {
    card.addEventListener('click', () => {
      const currentIsZh = window.i18n && window.i18n.currentLang === 'zh';
      const title = card.querySelector('h3')?.textContent;
      alert(currentIsZh
        ? `🌱 【ESG 支柱深度核算 / ${title}】\n核算标准: ISO 14064-1 & GHG Protocol 权威认证\n减排总量: 18,885.72 吨 CO₂e / 年\n动物福利指数: 98.8% 黄金级 (年多成活 49.7万羽)\n防伪存证: SHA-256 加密数字存证`
        : `🌱 [ESG Pillar Audit / ${title}]\nStandard: ISO 14064-1 & GHG Protocol Certified\nCarbon Abatement: 18,885.72 metric tons CO2e/year\nWelfare Index: 98.8% Gold Tier (+497,250 birds preserved)\nSignature: SHA-256 Blockchain Verified`);
    });
  });

  // 20. CFO War Room KPI Cards & Waterfall Rows
  document.querySelectorAll('.warroom-kpi-card').forEach((card) => {
    card.addEventListener('click', () => {
      const currentIsZh = window.i18n && window.i18n.currentLang === 'zh';
      const lbl = card.querySelector('.wk-label')?.textContent;
      const val = card.querySelector('.wk-value')?.textContent;
      alert(currentIsZh
        ? `💰 【第一性原理财务推导 / ${lbl}】\n当前数值: ${val}\n测算逻辑:\n• 饲料节约: 6亿羽 × 2.6kg × 0.06 FCR × ¥3,200/吨 = ¥299.52M\n• 死淘挽回: 死淘率降低 3.6% (多成活 2,160万羽) = ¥188.70M\n• 尖峰避峰: 4,820万度负荷转移至谷电 (¥0.42) = ¥15.77M\n• 绿溢价: 30万吨出口获百胜/麦当劳 +¥0.40/kg = ¥120.00M\n合计年经常性 EBITDA 增量: +¥655.50M 元`
        : `💰 [First-Principles Financial Formula / ${lbl}]\nCurrent Value: ${val}\nDerivation Logic:\n• Feed Savings: 600M birds × 2.6kg × 0.06 FCR × ¥3,200/t = ¥299.52M\n• Mortality Avoided: -3.6% mortality (+21.6M live birds) = ¥188.70M\n• Peak Power Shift: 48.2 GWh shifted to valley (¥0.42) = ¥15.77M\n• Green Premium: 300,000t export tender (+¥0.40/kg) = ¥120.00M\nTotal Recurring EBITDA Inflow: +¥655.50M CNY ($92.3M USD)`);
    });
  });

  document.querySelectorAll('.waterfall-bar-row').forEach(row => {
    row.addEventListener('click', () => {
      const currentIsZh = window.i18n && window.i18n.currentLang === 'zh';
      const name = row.querySelector('.wf-name')?.textContent;
      const val = row.querySelector('.wf-val')?.textContent;
      alert(currentIsZh
        ? `📊 【EBITDA 瀑布分解项】\n构成项目: ${name}\n贡献金额: ${val}\n核算特性: 第一性原理实测数据驱动，具有持续可复制性`
        : `📊 [EBITDA Waterfall Component]\nComponent: ${name}\nEBITDA Delta: ${val}\nValidation: First-principles physics-based data model`);
    });
  });

  document.querySelectorAll('.playbook-step-row').forEach(row => {
    row.addEventListener('click', () => {
      document.getElementById('btn-execute-warroom-playbook')?.click();
    });
  });

  // 21. Digital Product Passport (DPP) Hash & QR Copy
  const copyDppHash = () => {
    const hash = "e8b4f2c99a10583d73b2241cf892305a7f9201bd4e9104fa281c82903741890a";
    navigator.clipboard?.writeText(hash).catch(() => {});
    const currentIsZh = window.i18n && window.i18n.currentLang === 'zh';
    addAuditLog(currentIsZh ? `🔐 [数字存证] 已复制 SHA-256 溯源存证哈希: ${hash.slice(0, 16)}...` : `🔐 [DPP] Copied SHA-256 provenance audit hash: ${hash.slice(0, 16)}...`, true);
    alert(currentIsZh
      ? `🔐 【区块链防伪溯源哈希已复制】\n\nSHA-256: ${hash}\n\n该哈希包含：\n• 批次号: HOUSE-03-2026-08A\n• 碳足迹: 1.42 kg CO₂e/kg (A+ 评级)\n• 抗生素残留: 0.00 mg (100% 无抗生素)\n• 动物福利评分: 99.2% 黄金级`
      : `🔐 [Cryptographic Blockchain Hash Copied]\n\nSHA-256: ${hash}\n\nEmbedded Verified Metadata:\n• Batch ID: HOUSE-03-2026-08A\n• Carbon Footprint: 1.42 kg CO₂e/kg (Grade A+)\n• Antibiotic Residue: 0.00 mg (100% Free)\n• Animal Welfare Score: 99.2% Gold Tier`);
  };

  document.querySelector('.dpp-hash-box')?.addEventListener('click', copyDppHash);
  document.querySelector('.qr-box')?.addEventListener('click', copyDppHash);

  // 22. BI Refresh Toggle
  let biTelemetryStreamActive = true;
  document.getElementById('btn-bi-refresh-toggle')?.addEventListener('click', () => {
    biTelemetryStreamActive = !biTelemetryStreamActive;
    const currentIsZh = window.i18n && window.i18n.currentLang === 'zh';
    const btn = document.getElementById('btn-bi-refresh-toggle');
    if (btn) btn.classList.toggle('highlight', biTelemetryStreamActive);
    renderExecutiveBiHub();
    addAuditLog(currentIsZh ? (biTelemetryStreamActive ? "📊 商业智能大屏：1秒实时遥测数据流已开启" : "📊 商业智能大屏：遥测流已暂停") : (biTelemetryStreamActive ? "📊 BI Hub: Live 1s telemetry streaming resumed" : "📊 BI Hub: Telemetry stream paused"), true);
  });
}

window.renderExecutiveBiHub = renderExecutiveBiHub;
window.inspectComplexDetails = inspectComplexDetails;

// Initialize default slide
renderPresentationSlide(0);

// Then look for an exported .pptx deck. If one exists it replaces the built-in
// HTML deck and the tab re-renders; if not, the HTML deck simply stays.
// Served over http:// this works; under file:// the fetch is blocked and the
// built-in deck remains, which is the intended fallback rather than an error.
if (window.SunnerDeck && typeof window.SunnerDeck.loadFrame === 'function') {
  window.SunnerDeck.loadFrame().then((installed) => {
    if (!installed) return;
    const frame = window.SunnerDeck.frame;
    activePresentationSlide = 0;
    renderPresentationSlide(0);

    const isZh = window.i18n && window.i18n.currentLang === 'zh';
    addAuditLog(isZh
      ? `演讲台已加载源文件幻灯片：${frame.source}（共 ${frame.slides.length} 页）`
      : `Keynote deck loaded from ${frame.source} (${frame.slides.length} slides)`, true);
  });
}

// Global Dynamic Resize & Orientation Adaptation Listener
let resizeTimeout = null;
window.addEventListener('resize', () => {
  if (resizeTimeout) clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (window.highway3D) window.highway3D.onResize();
    if (window.topologyCanvas) window.topologyCanvas.resize();
    if (typeof window.renderExecutiveBiHub === 'function' && document.getElementById('section-bi-hub')?.style.display !== 'none') {
      window.renderExecutiveBiHub();
    }
  }, 100);
});

// Initialize UI and Start Autonomous Auto-Tour
initScrubber();
selectNode('sensors');
playTour();
initFinancialWarRoom();
initGrokCopilot();
initBioAcousticSpectrogram();
initTimeTravelReplay();
initDigitalProductPassport();
initExecutiveBiHub();
initGlobalClickInteractivity();
addAuditLog("Sunner Decision OS online. Autonomous auto-cruise active across all 13 nodes.", true);



// =================================================================
// 17. CONTROL DRAWER & PRESENTER / EXPLORER DENSITY MODES
// -----------------------------------------------------------------
// The speed selector, live simulator and time-travel replay controls used to
// occupy three permanently visible bands above the canvas. They now live in a
// single collapsed drawer, and Presenter mode strips the remaining secondary
// chrome down to canvas + narrative + KPIs for stage use.
// Every original element ID was preserved during the move, so the existing
// handlers and the Auto-Pitch sequencer are untouched.
// =================================================================
function initDensityAndControlDrawer() {
  const drawer = document.getElementById('control-drawer');
  const drawerBtn = document.getElementById('btn-toggle-control-drawer');
  const densityBtn = document.getElementById('btn-toggle-density');
  const densityLbl = document.getElementById('lbl-density-mode');

  const dict = () => (window.i18n && window.i18n.dictionary[window.i18n.currentLang]) || {};
  const isZh = () => !!(window.i18n && window.i18n.currentLang === 'zh');

  // --- Consolidated control drawer ---
  function setDrawer(open) {
    if (!drawer || !drawerBtn) return;
    drawer.hidden = !open;
    drawerBtn.classList.toggle('active', open);
    drawerBtn.setAttribute('aria-expanded', String(open));
  }

  drawerBtn?.addEventListener('click', () => setDrawer(drawer?.hidden === true));

  // --- Presenter / Explorer density modes ---
  const DENSITY_KEY = 'sunner.densityMode';

  function applyDensity(mode, announce) {
    const presenter = mode === 'presenter';
    document.body.classList.toggle('density-presenter', presenter);
    document.body.classList.toggle('density-explorer', !presenter);

    if (densityBtn) densityBtn.setAttribute('aria-pressed', String(presenter));
    if (densityLbl) {
      const d = dict();
      densityLbl.textContent = presenter
        ? (d.density_presenter || 'Presenter')
        : (d.density_explorer || 'Explorer');
    }

    // Presenter mode is for the stage: nothing secondary should be left open.
    if (presenter) setDrawer(false);

    try { localStorage.setItem(DENSITY_KEY, mode); } catch (_) { /* private mode */ }

    if (announce && typeof addAuditLog === 'function') {
      if (presenter) {
        addAuditLog(isZh()
          ? '演讲模式已启用：已隐藏次级控件，仅保留画布、结论与核心指标'
          : 'Presenter mode on: secondary chrome hidden, canvas + narrative + KPIs only', true);
      } else {
        addAuditLog(isZh()
          ? '完整模式已恢复：全部工程控件重新可见'
          : 'Explorer mode restored: full instrument panel visible', true);
      }
    }
  }

  densityBtn?.addEventListener('click', () => {
    applyDensity(document.body.classList.contains('density-presenter') ? 'explorer' : 'presenter', true);
  });

  // --- Keyboard shortcuts (C = controls, P = presenter) ---
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const tag = e.target && e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target?.isContentEditable) return;

    // The keynote deck owns the keyboard while it is on screen.
    const presSec = document.getElementById('section-presentation-deck');
    if (presSec && presSec.style.display !== 'none') return;

    const key = e.key.toLowerCase();
    if (key === 'c') {
      e.preventDefault();
      setDrawer(drawer?.hidden === true);
    } else if (key === 'p') {
      e.preventDefault();
      densityBtn?.click();
    }
  });

  // Restore the presenter's last choice; default to Explorer.
  let saved = 'explorer';
  try { saved = localStorage.getItem(DENSITY_KEY) || 'explorer'; } catch (_) { /* private mode */ }
  applyDensity(saved === 'presenter' ? 'presenter' : 'explorer', false);
  setDrawer(false);
}

initDensityAndControlDrawer();

// =================================================================
// 18. BI HUB FULLSCREEN (BOARD-ROOM PROJECTION MODE)
// -----------------------------------------------------------------
// Fullscreens the whole #section-bi-hub view. Note the existing 3D/2D and
// keynote-deck fullscreen buttons are each bound twice (sections 8 and 16),
// which double-fires their toggle; this one is deliberately bound once.
// Label syncing is handled by the single fullscreenchange listener in
// section 8, which reads the i18n dictionary.
// =================================================================
function initBiHubFullscreen() {
  const section = document.getElementById('section-bi-hub');
  const btn = document.getElementById('btn-bi-hub-fullscreen');
  if (!section || !btn) return;

  const isZh = () => !!(window.i18n && window.i18n.currentLang === 'zh');

  function toggle() {
    if (document.fullscreenElement === section) {
      (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
      return;
    }
    // Another element (canvas or deck) may hold fullscreen; hand it over.
    const request = () => (section.requestFullscreen || section.webkitRequestFullscreen)?.call(section);
    if (document.fullscreenElement) {
      Promise.resolve((document.exitFullscreen || document.webkitExitFullscreen)?.call(document))
        .then(request)
        .catch(request);
    } else {
      request();
    }
    addAuditLog(isZh()
      ? '商业智能大屏已进入全屏汇报模式'
      : 'BI Command Center entered fullscreen projection mode', true);
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle();
  });

  // F toggles fullscreen while the BI Hub is the visible view, matching the
  // keynote deck's F shortcut. The deck handler owns F when the deck is up.
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.toLowerCase() !== 'f') return;

    const tag = e.target && e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target?.isContentEditable) return;

    const deck = document.getElementById('section-presentation-deck');
    if (deck && deck.style.display !== 'none') return;
    if (section.style.display === 'none' && document.fullscreenElement !== section) return;

    e.preventDefault();
    toggle();
  });
}

initBiHubFullscreen();
