/**
 * Sunner Smart Poultry Digital Twin, Enterprise Cyber Highway & ESG Engine
 * Supports Executive Business Story View and Technical Developer Code View.
 */

// Executive Business Story Dictionary (Plain English for Farm Owners & Executives)
const executiveBusinessStories = {
  1: {
    badge: "STEP 1 OF 10: AT THE BARN",
    title: "🌡️ Barn Sensors & Climate Probes",
    summary: "Sensors mounted on barn walls measure air temperature, ammonia levels, and feed silo weights every 10 milliseconds.",
    action: "Verifying that all 42,500 Cobb500 broilers have clean, fresh air (11.4 ppm ammonia) and comfortable warmth (22.4°C).",
    benefit: "Eliminates manual clipboard checks. Farm workers don't have to walk into dusty, hazardous barns just to read thermometers.",
    pills: [
      { label: "🌡️ Temperature", val: "22.4°C (Optimal)" },
      { label: "💨 Ammonia", val: "11.4 ppm (Safe)" },
      { label: "🌾 Feed Silos", val: "35.7 Tons (Adequate)" }
    ]
  },
  2: {
    badge: "STEP 2 OF 10: ON-SITE GATEWAY",
    title: "📟 Secure Farm Computer (Welotec Edge)",
    summary: "A ruggedized industrial computer on the farm wall encrypts the sensor data and transmits it securely to the cloud.",
    action: "Packaging telemetry with high-grade encryption while buffering 48 hours of backup memory in case of internet loss.",
    benefit: "Zero downtime risk. Your poultry ventilation never shuts off or loses control, even during severe weather storms.",
    pills: [
      { label: "🔒 Security", val: "Encrypted TLS 1.3" },
      { label: "💾 Local Buffer", val: "48 Hours Backup" },
      { label: "⚡ Gateway Health", val: "100% Online" }
    ]
  },
  3: {
    badge: "STEP 3 OF 10: PLANT FLOOR",
    title: "🖥️ Farm Control Room Screens (SCADA)",
    summary: "The central touchscreen display in the farm office showing real-time fan speeds and house environmental conditions.",
    action: "Displays live green status indicators across all 3 barn zones (Front Inlets, Center Flock, Rear Exhaust Fans).",
    benefit: "Gives farm managers one simple screen to check the whole complex at a glance without walking miles across the farm.",
    pills: [
      { label: "🚨 Alarm Status", val: "Green (Normal)" },
      { label: "⚙️ Fan Speed", val: "850 RPM" },
      { label: "⚡ Motor Load", val: "14.2 Amps" }
    ]
  },
  4: {
    badge: "STEP 4 OF 10: HISTORICAL DATA",
    title: "📈 Historical Farm Archive (OSIsoft PI)",
    summary: "A high-speed digital flight recorder storing every second of farm history for the past 5 years.",
    action: "Compressing and archiving millions of temperature, humidity, and ammonia readings with 99.9% accuracy.",
    benefit: "Enables agronomists and veterinarians to see exactly how weather shifts affected flock growth over time.",
    pills: [
      { label: "📊 Data Points", val: "1.2 Million / Day" },
      { label: "💾 Storage Efficiency", val: "92% Compression" },
      { label: "📅 History Depth", val: "5 Years Available" }
    ]
  },
  5: {
    badge: "STEP 5 OF 10: FLOCK BATCH",
    title: "📋 Flock Growth & Biosecurity Manager (MES)",
    summary: "Tracks the lifecycle of Batch #2026-B08 (42,500 Cobb500 broilers, currently at Day 26).",
    action: "Comparing daily bird weight gain (target: 68.5g/day) against actual feed consumed (Feed Conversion Ratio: 1.54).",
    benefit: "Predicts harvest readiness date and ensures birds meet premium export weight standards.",
    pills: [
      { label: "🐣 Flock Age", val: "Day 26" },
      { label: "🐔 Bird Count", val: "42,500 Broilers" },
      { label: "🌾 Feed Conversion", val: "1.54 (Excellent)" }
    ]
  },
  6: {
    badge: "STEP 6 OF 10: BUSINESS & FINANCE",
    title: "🏢 Automatic Feed Purchasing (SAP S/4HANA ERP)",
    summary: "Connects farm feed silos directly to your central SAP enterprise inventory ledger.",
    action: "If feed drops below 15 tons, the AI automatically creates a signed Purchase Order for 25 tons from Fujian Feed Co.",
    benefit: "Never run out of feed. Eliminates 2 hours of daily manual paperwork for farm managers.",
    pills: [
      { label: "🌾 Silo Stock", val: "35.7 Tons" },
      { label: "⚠️ Reorder Trigger", val: "15.0 Tons" },
      { label: "📦 Auto-PO Status", val: "Ready (No Delay)" }
    ]
  },
  7: {
    badge: "STEP 7 OF 10: ENTERPRISE LAKEHOUSE",
    title: "❄️ Central Company Data Cloud (Snowflake)",
    summary: "Aggregates live data across all 50 company farms into clean executive dashboards and financial reports.",
    action: "Combines electricity kilowatt costs, feed consumption, and bird mortality into daily profit/loss figures.",
    benefit: "CFOs and executives see company-wide operational efficiency in real time, not at the end of the quarter.",
    pills: [
      { label: "🏢 Farms Connected", val: "50 Barns (2.12M Birds)" },
      { label: "⚡ Daily Telemetry", val: "45 GB / Day" },
      { label: "⏱️ Query Speed", val: "0.08 Seconds" }
    ]
  },
  8: {
    badge: "STEP 8 OF 10: ONTOLOGY",
    title: "🧬 Enterprise Knowledge Map (Palantir Foundry)",
    summary: "Connects physical chickens to feed contracts, farm buildings, and customer delivery orders.",
    action: "Creates a complete 'Farm-to-Fork' digital link from the grain supplier to the final supermarket package.",
    benefit: "100% food traceability. If a customer scans a chicken package QR code, it proves humane, certified origin.",
    pills: [
      { label: "🔗 Traceability", val: "Farm-to-Fork" },
      { label: "🌐 Connected Entities", val: "142,000 Objects" },
      { label: "📋 Audit Ready", val: "100% Verified" }
    ]
  },
  9: {
    badge: "STEP 9 OF 10: DIGITAL TWIN",
    title: "🕸️ Virtual 3D Farm Digital Twin (Neo4j)",
    summary: "A living virtual simulation of the entire barn layout, sensor networks, and fan physics.",
    action: "Simulates airflow dynamics inside House 03 to predict microclimate dead-zones before they harm birds.",
    benefit: "Enables AI agents to test 'what-if' weather scenarios without risking real chickens.",
    pills: [
      { label: "🗺️ Virtual Zones", val: "3 Active Zones" },
      { label: "🎯 Simulation Match", val: "99.2% Accuracy" },
      { label: "🔄 Physics Loop", val: "Live Real-Time" }
    ]
  },
  10: {
    badge: "STEP 10 OF 10: AI DECISION BRAIN",
    title: "🧠 AI Decision Brain & Autonomous Smart Agents",
    summary: "Four specialized AI agents collaborate continuously to protect birds, cut power bills, and order feed.",
    action: "The Health Agent guarantees fresh air, the Energy Agent cuts power during peak rates, and the SAP Agent manages feed.",
    benefit: "Autonomous closed-loop action in 0.3 seconds. Cuts power bills by 28.4% and saves 1,500 bird lives per flock.",
    pills: [
      { label: "⚡ Decision Speed", val: "0.3 Seconds" },
      { label: "💰 Power Cut", val: "-28.4% Bill Reduction" },
      { label: "🐤 Lives Saved", val: "497,250 Birds / Year" }
    ]
  }
};

// Technical Developer Payload Dictionary (JSON Schemas)
const technicalTierSchemas = {
  1: {
    title: "Step 1: Siemens S7-1500 PLC & Physical Field Probes",
    proto: "Modbus TCP / Profinet (Port 502)",
    payload: {
      plc_device: "Siemens-S7-1516-3PN/DP",
      ip_address: "192.168.1.10",
      scan_cycle_time_ms: 10,
      modbus_holding_registers: {
        "40100_TEMP_PV": 224,      // 22.4 °C (scale 0.1)
        "40101_HUMIDITY_PV": 625,  // 62.5 % (scale 0.1)
        "40102_NH3_PV": 114,       // 11.4 ppm (scale 0.1)
        "40103_CO2_PV": 1820,      // 1820 ppm (scale 1.0)
        "40200_SILO1_KG": 18500,   // Silo 1 load cell
        "40202_SILO2_KG": 17200    // Silo 2 load cell
      }
    }
  },
  2: {
    title: "Step 2: Welotec egOS Industrial Edge Gateway (EG500)",
    proto: "MQTT v5 / Sparkplug B with TLS 1.3",
    payload: {
      topic: "sunner/farm-nanping-01/barn-03/zone-rear/climate",
      gateway_id: "gw-welotec-np01-b03",
      firmware: "egOS-v3.4.2-sunner",
      timestamp: new Date().toISOString(),
      metrics: {
        temperature_celsius: 22.4,
        relative_humidity_percent: 62.5,
        ammonia_nh3_ppm: 11.4,
        carbon_dioxide_co2_ppm: 1820.0
      },
      silos: { total_feed_tons: 35.7 },
      quality_flag: "GOOD"
    }
  },
  3: {
    title: "Step 3: Inductive Ignition SCADA & HMI",
    proto: "OPC UA Server (Port 4840)",
    payload: {
      scada_tag_path: "[Sunner_OT]/Nanping_01/Barn_03/Zone_Rear/NH3_PV",
      alarm_state: "NORMAL",
      hmi_screen: "Screen_Barn03_Overview",
      fan_feedback_rpm: 850.0
    }
  },
  4: {
    title: "Step 4: OSIsoft PI Process Historian",
    proto: "PI Web API / Swinging Door Compression",
    payload: {
      pi_server: "PISERVER-NANPING-PROD",
      pi_points: [
        { name: "NP01_B03_ZR_NH3.PV", value: 11.4, status: "Good", compression: "Swinging Door Ex 0.05" },
        { name: "NP01_B03_ZR_TEMP.PV", value: 22.4, status: "Good" }
      ]
    }
  },
  5: {
    title: "Step 5: MES / MOM (Manufacturing Execution System)",
    proto: "ISA-88 Batch Record / REST API",
    payload: {
      batch_id: "FLOCK-2026-B08",
      house_id: "BARN-03",
      breed: "Cobb500 Broiler",
      bird_count: 42500,
      flock_age_days: 26,
      actual_fcr: 1.54,
      biosecurity_audit_status: "PASSED_LEVEL_3"
    }
  },
  6: {
    title: "Step 6: SAP S/4HANA Cloud (Enterprise ERP)",
    proto: "SAP OData / BAPI RFC (BAPI_PO_CREATE1)",
    payload: {
      material_id: "MAT-FEED-SOYA-500",
      plant: "PLANT-NANPING-1000",
      current_inventory_tons: 35.7,
      reorder_threshold_tons: 15.0,
      reorder_status: "INVENTORY_HEALTHY",
      automated_purchase_order: null
    }
  },
  7: {
    title: "Step 7: Snowflake Data Cloud (Lakehouse Medallion)",
    proto: "Snowpipe Streaming / SQL Dynamic Tables",
    payload: {
      bronze: "SUNNER_LAKEHOUSE.BRONZE.RAW_MQTT_EVENTS",
      silver: "SUNNER_LAKEHOUSE.SILVER.CLEAN_CLIMATE_METRICS",
      gold: "SUNNER_LAKEHOUSE.GOLD.FLOCK_DAILY_ECONOMICS"
    }
  },
  8: {
    title: "Step 8: Palantir Foundry Enterprise Ontology",
    proto: "Semantic Archetype / Object Graph Sync",
    payload: {
      root_object: "FlockBatchObject:FLOCK-2026-B08",
      linked_ontology_objects: [
        "BarnZoneObject:barn-03/zone-rear",
        "FeedInventoryObject:SILO-01-02",
        "AnimalWelfareRiskObject:PROFILE_GREEN"
      ]
    }
  },
  9: {
    title: "Step 9: Neo4j Knowledge Graph & Digital Twin",
    proto: "Bolt Protocol (bolt://localhost:7687)",
    payload: {
      nodes_synchronized: ["Farm:farm-nanping-01", "Barn:barn-03", "Zone:zone-rear", "Flock:FLOCK-2026-B08"],
      edges_active: 12
    }
  },
  10: {
    title: "Step 10: Snowflake Cortex AI & Multi-Agent Cognitive Fabric",
    proto: "Cortex LLM API / Agentic Closed-Loop Event Bus",
    payload: {
      cortex_llm_model: "snowflake-cortex-arctic-instruct",
      consensus: {
        health_agent: "Welfare Safe (98.5%)",
        energy_agent: "Eco Peak Save (25%)",
        sap_agent: "Silo Inventory OK (35.7t)",
        esg_agent: "Carbon Reduced -28.4%"
      },
      natural_language_briefing: "Cortex AI Operational Briefing: House 03 operating in nominal eco-modulation. Energy Agent reduced fan power to 25% during Peak Tariff, saving 7.2 kWh/hour (CNY 9.72/hr). Feed inventory is healthy (35.7t)."
    }
  }
};

// UI State
let currentExplanationMode = 'executive'; // 'executive' or 'technical'
let activeTier = 1;
let isEnterpriseScope = true;

// DOM View Style Switcher (Executive vs Technical Code)
const btnModeExec = document.getElementById('btn-mode-executive');
const btnModeTech = document.getElementById('btn-mode-technical');
const boxExecStory = document.getElementById('executive-story-card');
const boxTechCode = document.getElementById('technical-code-box');

function setExplanationMode(mode) {
  currentExplanationMode = mode;
  btnModeExec.classList.toggle('active', mode === 'executive');
  btnModeTech.classList.toggle('active', mode === 'technical');

  if (mode === 'executive') {
    boxExecStory.style.display = 'flex';
    boxTechCode.style.display = 'none';
  } else {
    boxExecStory.style.display = 'none';
    boxTechCode.style.display = 'flex';
  }
  renderTierView(activeTier);
}

if (btnModeExec) btnModeExec.addEventListener('click', () => setExplanationMode('executive'));
if (btnModeTech) btnModeTech.addEventListener('click', () => setExplanationMode('technical'));

// Render Selected Tier Information
function renderTierView(tierNum) {
  activeTier = tierNum;

  // 1. Render Executive Business Story Card
  const story = executiveBusinessStories[tierNum];
  if (story) {
    document.getElementById('story-step-badge').textContent = story.badge;
    document.getElementById('story-step-title').textContent = story.title;
    document.getElementById('story-step-summary').textContent = story.summary;
    document.getElementById('story-detail-action').textContent = story.action;
    document.getElementById('story-detail-benefit').textContent = story.benefit;

    const kpiContainer = document.getElementById('story-kpi-strip');
    if (kpiContainer) {
      kpiContainer.innerHTML = story.pills.map(p => `
        <div class="story-kpi-pill">${p.label}: <strong>${p.val}</strong></div>
      `).join('');
    }
  }

  // 2. Render Technical Code Box (If opened)
  const tech = technicalTierSchemas[tierNum];
  if (tech) {
    const elTitle = document.getElementById('inspector-tier-title');
    const elProto = document.getElementById('inspector-proto-badge');
    const elCode = document.getElementById('inspector-code-block');
    if (elTitle) elTitle.textContent = tech.title;
    if (elProto) elProto.textContent = tech.proto;
    if (elCode) elCode.textContent = JSON.stringify(tech.payload, null, 2);
  }
}

// Synchronize Canvas Auto-Tour with UI
window.selectTierFromCanvas = function(tierNum) {
  renderTierView(tierNum);
};

// DOM Tab Switching
const tabEnterprise = document.getElementById('tab-btn-enterprise');
const tabEsg = document.getElementById('tab-btn-esg');
const tabBarn = document.getElementById('tab-btn-barn');
const tabComp = document.getElementById('tab-btn-comparison');

const secEnterprise = document.getElementById('section-enterprise-flow');
const secEsg = document.getElementById('section-esg-evolution');
const secBarn = document.getElementById('section-spatial-gauges');
const secComp = document.getElementById('section-comparison');

function switchTab(activeTab, activeSec) {
  [tabEnterprise, tabEsg, tabBarn, tabComp].forEach(t => t.classList.remove('active'));
  [secEnterprise, secEsg, secBarn, secComp].forEach(s => s.style.display = 'none');
  
  activeTab.classList.add('active');
  activeSec.style.display = 'block';
}

if (tabEnterprise) tabEnterprise.addEventListener('click', () => switchTab(tabEnterprise, secEnterprise));
if (tabEsg) tabEsg.addEventListener('click', () => switchTab(tabEsg, secEsg));
if (tabBarn) tabBarn.addEventListener('click', () => switchTab(tabBarn, secBarn));
if (tabComp) tabComp.addEventListener('click', () => switchTab(tabComp, secComp));

// 4-Stage Evolution Stepper Clicks
document.querySelectorAll('.evo-step-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.evo-step-card').forEach(c => c.classList.remove('active-step'));
    card.classList.add('active-step');
  });
});

// ESG Scope Toggle (Enterprise 50 Barns vs Single Barn)
const btnScopeEnterprise = document.getElementById('btn-scope-enterprise');
const btnScopeSingle = document.getElementById('btn-scope-single');

const elFleetBirds = document.getElementById('val-fleet-birds');
const elTotalGhg = document.getElementById('val-total-ghg-saved');
const elScope2Base = document.getElementById('val-esg-scope2-base');
const elScope2Ai = document.getElementById('val-esg-scope2-ai');
const elScope2Saved = document.getElementById('val-esg-scope2-saved');
const elScope3Saved = document.getElementById('val-esg-scope3-saved');
const elFeedSaved = document.getElementById('val-esg-feed-saved');
const elMortBase = document.getElementById('val-esg-mort-base');
const elMortAi = document.getElementById('val-esg-mort-ai');
const elBirdsSaved = document.getElementById('val-esg-birds-saved');
const elWorkerSaved = document.getElementById('val-esg-worker-saved');

function renderEsgMetrics(enterprise) {
  isEnterpriseScope = enterprise;
  if (btnScopeEnterprise) btnScopeEnterprise.classList.toggle('active', enterprise);
  if (btnScopeSingle) btnScopeSingle.classList.toggle('active', !enterprise);

  if (enterprise) {
    if (elFleetBirds) elFleetBirds.textContent = "2,125,000 Birds (50 Barns)";
    if (elTotalGhg) elTotalGhg.textContent = "18,885.7 t CO₂e/yr";
    if (elScope2Base) elScope2Base.textContent = "41,300 kWh/day";
    if (elScope2Ai) elScope2Ai.textContent = "29,570 kWh/day";
    if (elScope2Saved) elScope2Saved.textContent = "2,487.5 t CO₂e/yr";
    if (elScope3Saved) elScope3Saved.textContent = "16,398.2 t CO₂e/yr";
    if (elFeedSaved) elFeedSaved.textContent = "5,856.5 tons/yr";
    if (elMortBase) elMortBase.textContent = "4.8% (102,000 lost/batch)";
    if (elMortAi) elMortAi.textContent = "1.2% (25,500 lost/batch)";
    if (elBirdsSaved) elBirdsSaved.textContent = "497,250 broiler lives preserved per year";
    if (elWorkerSaved) elWorkerSaved.textContent = "52,925 worker hrs/year";
  } else {
    if (elFleetBirds) elFleetBirds.textContent = "42,500 Birds (House 03)";
    if (elTotalGhg) elTotalGhg.textContent = "377.7 t CO₂e/yr";
    if (elScope2Base) elScope2Base.textContent = "826.0 kWh/day";
    if (elScope2Ai) elScope2Ai.textContent = "591.4 kWh/day";
    if (elScope2Saved) elScope2Saved.textContent = "49.75 t CO₂e/yr";
    if (elScope3Saved) elScope3Saved.textContent = "327.9 t CO₂e/yr";
    if (elFeedSaved) elFeedSaved.textContent = "117.1 tons/yr";
    if (elMortBase) elMortBase.textContent = "4.8% (2,040 lost/batch)";
    if (elMortAi) elMortAi.textContent = "1.2% (510 lost/batch)";
    if (elBirdsSaved) elBirdsSaved.textContent = "9,945 broiler lives preserved per year";
    if (elWorkerSaved) elWorkerSaved.textContent = "1,058 worker hrs/year";
  }
}

if (btnScopeEnterprise) btnScopeEnterprise.addEventListener('click', () => renderEsgMetrics(true));
if (btnScopeSingle) btnScopeSingle.addEventListener('click', () => renderEsgMetrics(false));

// Generate Certified ESG Audit Report
const btnGenEsg = document.getElementById('btn-gen-esg-report');
if (btnGenEsg) {
  btnGenEsg.addEventListener('click', () => {
    const docId = `ESG-AUDIT-SUNNER-${Date.now()}`;
    const certBox = document.getElementById('cert-body-text');
    if (certBox) {
      certBox.innerHTML = `
        <strong>Document ID:</strong> ${docId}<br>
        <strong>Certification:</strong> GHG Protocol & ISO 14064-1:2018 Certified<br>
        <strong>Scope:</strong> 50 Broiler Houses (2,125,000 Birds)<br>
        <strong>Annual Carbon Avoided:</strong> 18,885.72 metric tons CO₂e<br>
        <strong>Humane Lives Preserved:</strong> 497,250 broilers/yr (Mortality: 1.2% vs 4.8%)<br>
        <strong>Worker Safety Gain:</strong> 52,925 hours/yr (-82.9%)<br>
        <strong>Digital Signature:</strong> SHA256:e8b4f2c99a10583d73b2241cf892305aa7842c56910bbaec0924719d380f2d48
      `;
    }
  });
}

// Canvas HUD Controls: Auto-Cruise & Warp Speed
const btnToggleAutoCruise = document.getElementById('btn-toggle-autocruise');
const lblAutoCruise = document.getElementById('lbl-autocruise');
if (btnToggleAutoCruise) {
  btnToggleAutoCruise.addEventListener('click', () => {
    if (window.highwayViz) {
      const state = window.highwayViz.toggleAutoCruise();
      lblAutoCruise.textContent = `Auto-Tour: ${state ? 'ON' : 'OFF'}`;
      btnToggleAutoCruise.className = state ? 'btn btn-primary' : 'btn btn-outline';
    }
  });
}

const btnToggleWarp = document.getElementById('btn-toggle-warpspeed');
const lblWarp = document.getElementById('lbl-warpspeed');
if (btnToggleWarp) {
  btnToggleWarp.addEventListener('click', () => {
    if (window.highwayViz) {
      const state = window.highwayViz.toggleWarpSpeed();
      lblWarp.textContent = state ? 'High Activity: 50x' : 'High Activity Mode';
      btnToggleWarp.className = state ? 'btn btn-primary' : 'btn btn-warning';
    }
  });
}

// Trigger Low-Feed Auto PO in SAP (Plain English Story)
const btnSapTrigger = document.getElementById('btn-sap-po-trigger');
if (btnSapTrigger) {
  btnSapTrigger.addEventListener('click', () => {
    executiveBusinessStories[6].action = "🚨 Silo level dropped to 11.0 tons (< 15.0 ton safety limit). The AI generated signed Purchase Order #PO_4500892140 for 25.0 tons with Fujian Feed Co.";
    executiveBusinessStories[6].pills = [
      { label: "🌾 Silo Stock", val: "11.0 Tons (Critical Low)" },
      { label: "📦 Auto-PO Created", val: "#PO_4500892140 Signed" },
      { label: "🚚 Delivery", val: "Tomorrow 08:00 UTC" }
    ];

    const elCortexNarrative = document.getElementById('cortex-narrative');
    if (elCortexNarrative) {
      elCortexNarrative.textContent = "Executive Alert: Feed silos reached low reorder threshold (11.0t < 15.0t). The SAP Supply Chain AI Agent autonomously ordered 25.0 tons from Fujian Feed Co. with zero human paperwork required.";
    }

    const elChipSap = document.getElementById('chip-sap-act');
    if (elChipSap) elChipSap.innerHTML = "📦 SAP Agent: <strong>Auto-PO #PO_4500892140 Signed (25t)</strong>";

    renderTierView(6);
  });
}

// Trigger Ammonia Hazard (Plain English Story)
const btnAmmoniaRipple = document.getElementById('btn-ammonia-ripple');
if (btnAmmoniaRipple) {
  btnAmmoniaRipple.addEventListener('click', () => {
    if (window.highwayViz) {
      window.highwayViz.triggerCrisisMode(9000);
    }
    const elChipHealth = document.getElementById('chip-health-act');
    if (elChipHealth) elChipHealth.innerHTML = "🩺 Health Agent: <strong>🚨 100% Emergency Fan Flush</strong>";
    
    const elCortexNarrative = document.getElementById('cortex-narrative');
    if (elCortexNarrative) {
      elCortexNarrative.textContent = "Critical Safety Action: Ammonia surged to 28.5 ppm in Zone 3. The Health AI Agent instantly overrode peak electricity savings to run fans at 100%, protecting 42,500 chickens from respiratory damage in 0.3 seconds.";
    }
    renderTierView(10);
  });
}

// Reset
const btnReset = document.getElementById('btn-reset-pipeline');
if (btnReset) {
  btnReset.addEventListener('click', () => {
    renderTierView(1);
  });
}

// Clock
setInterval(() => {
  const clockEl = document.getElementById('live-clock');
  if (clockEl) clockEl.textContent = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
}, 1000);

// Initialize default view
setExplanationMode('executive');
renderEsgMetrics(true);
renderTierView(1);
