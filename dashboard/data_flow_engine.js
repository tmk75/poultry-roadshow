/**
 * GEA Digit(AI) • Precision-Aligned 2D Industrial Graph & Decision Canvas
 * Features:
 * - Perfectly aligned 4-level architectural grid with clean vertical columns
 * - Dedicated toolbar header with zero overlap over canvas stage
 * - 🔍 End-to-End Lineage Tracer (Focus & Dim non-connected paths)
 * - 🩻 Live Protocol & Latency X-Ray Mode (Modbus :502, Sparkplug B, SAP RFC, Bolt :7687)
 * - 🎯 Subsystem Filter Chips (OT Shopfloor, Ops & ERP, Cloud Lakehouse, AI Autopilot)
 * - ⚡ Offline Edge Fault & 48h NVRAM Buffer Simulation
 * - 📦 Click-to-Inspect Flying Packets with JSON Popovers
 */

class IndustrialTopologyCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.scenario = 'digital';
    this.selectedNodeId = 'sensors';
    this.hoveredNodeId = null;

    // 5 High-Impact 2D Capabilities State
    this.xrayMode = false;
    this.lineageTracer = true;
    this.subsystemFilter = 'all'; // 'all', 'ot', 'ops', 'cloud', 'ai'
    this.edgeOffline = false;
    this.bufferedPacketsCount = 0;
    this.inspectedPacket = null;

    this.speedMultiplier = 0.6;
    this.isPaused = false;

    this.packets = [];
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.width = 1000;
    this.height = 500;

    this.initNodes();
    this.initEdges();
    this.init();
  }

  initNodes() {
    // ===============================================================
    // PERFECTLY ALIGNED 4-ROW × 3/4-COLUMN GRID COORDINATES
    // Row 1 (y: 55): 4 nodes across cols 120, 370, 620, 870
    // Rows 2, 3, 4 (y: 175, 295, 415): 3 nodes across cols 180, 500, 820
    // ===============================================================
    this.nodes = {
      // -------------------------------------------------------------
      // ROW 1: LEVEL 0-2 (Shopfloor OT & Edge) - 4 Evenly Spaced Cols
      // -------------------------------------------------------------
      sensors: {
        id: 'sensors',
        num: '01',
        name: 'Barn Sensors & PLCs',
        sub: '10ms Modbus RTU / TCP',
        tier: 'SHOPFLOOR',
        subsystem: 'ot',
        color: '#14b8a6',
        icon: '⚡',
        metric: '22.4°C • 11.4 ppm',
        xrayProto: 'Modbus TCP / Port 502',
        latency: '10ms scan',
        gridRow: 1, gridCol: 1,
        x: 180, y: 55
      },
      edge: {
        id: 'edge',
        num: '02',
        name: 'Welotec Edge Gateway',
        sub: 'MQTT Sparkplug B • TLS',
        tier: 'ON-SITE EDGE',
        subsystem: 'ot',
        color: '#f97316',
        icon: '📟',
        metric: '100% TLS • 48h Buffer',
        xrayProto: 'MQTT Sparkplug B / TLS 1.3',
        latency: '15ms processing',
        gridRow: 1, gridCol: 2,
        x: 393, y: 55
      },
      scada: {
        id: 'scada',
        num: '03',
        name: 'SCADA HMI Server',
        sub: 'Ignition • OPC UA Tags',
        tier: 'PLANT FLOOR',
        subsystem: 'ot',
        color: '#06b6d4',
        icon: '🖥️',
        metric: '850 RPM • Normal',
        xrayProto: 'OPC UA / Port 4840',
        latency: '50ms polling',
        gridRow: 1, gridCol: 3,
        x: 607, y: 55
      },
      hist: {
        id: 'hist',
        num: '04',
        name: 'OSIsoft PI Historian',
        sub: 'Swinging Door Archive',
        tier: 'DATA STORE',
        subsystem: 'ot',
        color: '#38bdf8',
        icon: '📈',
        metric: '1.2M Rec/d • 5-Yr',
        xrayProto: 'PI Web API / SDK',
        latency: '1s interval',
        gridRow: 1, gridCol: 4,
        x: 820, y: 55
      },

      // -------------------------------------------------------------
      // ROW 2: LEVEL 3-4 (Operations & ERP) - Perfectly Aligned Cols A, B, C
      // -------------------------------------------------------------
      mes: {
        id: 'mes',
        num: '05',
        name: 'MES (Flock Lifecycle)',
        sub: 'Batch #2026-B08 • Day 26',
        tier: 'EXECUTION',
        subsystem: 'ops',
        color: '#8b5cf6',
        icon: '📋',
        metric: 'FCR 1.54 • Gain 68.5g',
        xrayProto: 'ISA-88 Batch Record',
        latency: '100ms sync',
        gridRow: 2, gridCol: 1,
        x: 180, y: 175
      },
      mom: {
        id: 'mom',
        num: '06',
        name: 'MOM Operations Hub',
        sub: '50-Barn Dispatch Matrix',
        tier: 'OPERATIONS',
        subsystem: 'ops',
        color: '#eab308',
        icon: '🏭',
        metric: '50 Barns • 2.12M Birds',
        xrayProto: 'ISA-95 Operations JSON',
        latency: '250ms dispatch',
        gridRow: 2, gridCol: 2,
        x: 500, y: 175
      },
      sap: {
        id: 'sap',
        num: '07',
        name: 'SAP S/4HANA ERP',
        sub: 'BAPI_PO_CREATE1 Ledger',
        tier: 'ENTERPRISE',
        subsystem: 'ops',
        color: '#10b981',
        icon: '🏢',
        metric: 'Silo 35.7t • Auto-PO',
        xrayProto: 'SAP RFC / BAPI_PO_CREATE1',
        latency: '1.2s transaction',
        gridRow: 2, gridCol: 3,
        x: 820, y: 175
      },

      // -------------------------------------------------------------
      // ROW 3: LEVEL 5 (Cloud Lakehouse & Semantics) - Perfectly Aligned Cols A, B, C
      // -------------------------------------------------------------
      snowflake: {
        id: 'snowflake',
        num: '08',
        name: 'Snowflake Data Cloud',
        sub: 'Bronze -> Silver -> Gold',
        tier: 'LAKEHOUSE',
        subsystem: 'cloud',
        color: '#0284c7',
        icon: '❄️',
        metric: '45 GB/d • Snowpipe',
        xrayProto: 'Snowpipe Streaming / SQL',
        latency: '0.08s query',
        gridRow: 3, gridCol: 1,
        x: 180, y: 295
      },
      foundry: {
        id: 'foundry',
        num: '09',
        name: 'Palantir Foundry',
        sub: 'Semantic Models & Actions',
        tier: 'ORCHESTRATION',
        subsystem: 'cloud',
        color: '#6366f1',
        icon: '🧬',
        metric: '142k Connected Objects',
        xrayProto: 'Foundry Action Bus',
        latency: '85ms semantic sync',
        gridRow: 3, gridCol: 2,
        x: 500, y: 295
      },
      ontology: {
        id: 'ontology',
        num: '10',
        name: 'Enterprise Ontology',
        sub: 'Live Object Graph',
        tier: 'ONTOLOGY',
        subsystem: 'cloud',
        color: '#ec4899',
        icon: '🔗',
        metric: 'Farm-to-Fork Lineage',
        xrayProto: 'Object Graph Schema',
        latency: '30ms graph traversal',
        gridRow: 3, gridCol: 3,
        x: 820, y: 295
      },

      // -------------------------------------------------------------
      // ROW 4: LEVEL 6 (Intelligence & Autopilot) - Perfectly Aligned Cols A, B, C
      // -------------------------------------------------------------
      twin: {
        id: 'twin',
        num: '11',
        name: 'Digital Twin (Neo4j)',
        sub: 'CFD Airflow & Thermal',
        tier: 'SIMULATION',
        subsystem: 'ai',
        color: '#84cc16',
        icon: '🕸️',
        metric: '99.2% Physics Match',
        xrayProto: 'Neo4j Bolt :7687 / CFD',
        latency: '120ms what-if sim',
        gridRow: 4, gridCol: 1,
        x: 180, y: 415
      },
      ml: {
        id: 'ml',
        num: '12',
        name: 'ML & Cortex AI Agents',
        sub: 'Multi-Agent Consensus',
        tier: 'DECISION CORE',
        subsystem: 'ai',
        color: '#d946ef',
        icon: '🧠',
        metric: '0.3s Closed Loop • -28.4%',
        xrayProto: 'Cortex Multi-Agent Bus',
        latency: '310ms consensus',
        gridRow: 4, gridCol: 2,
        x: 500, y: 415
      },
      dash: {
        id: 'dash',
        num: '13',
        name: 'Executive BI & Dashboards',
        sub: 'Role-Based Decision Apps',
        tier: 'PRESENTATION',
        subsystem: 'ai',
        color: '#3b82f6',
        icon: '📊',
        metric: 'ISO 14064 Verified',
        xrayProto: 'GraphQL / Real-Time WSS',
        latency: '45ms render',
        gridRow: 4, gridCol: 3,
        x: 820, y: 415
      }
    };
  }

  initEdges() {
    this.edges = [
      // 1. Telemetry & Sensor Climate Flow (Ice Cyan #00f2fe)
      { id: 'e1', from: 'sensors', to: 'edge', flowType: 'telemetry', color: '#00f2fe', label: 'Modbus 10ms', xray: 'Modbus TCP :502', samplePayload: { temp: 22.4, nh3: 11.4, silo_t: 35.7 }, speed: 0.005 },
      { id: 'e2', from: 'edge', to: 'scada', flowType: 'telemetry', color: '#00f2fe', label: 'OPC-UA Tags', xray: 'OPC UA :4840', samplePayload: { fan_rpm: 850, mode: 'AI_ECO', alarm: 'OK' }, speed: 0.005 },
      { id: 'e3', from: 'scada', to: 'hist', flowType: 'telemetry', color: '#00f2fe', label: '1s Archive', xray: 'PI Web API', samplePayload: { point: 'NP01_B03_NH3', compDev: 0.15 }, speed: 0.004 },
      { id: 'e4', from: 'edge', to: 'snowflake', flowType: 'telemetry', color: '#00f2fe', label: 'Direct IIoT Stream', xray: 'MQTT Sparkplug B (TLS 1.3)', samplePayload: { active_kw: 41.2, gateway: 'gw-welotec-03' }, speed: 0.006, isBypass: true },

      // 2. Operations, ERP & Silo Inventory Flow (Golden Amber #f59e0b)
      { id: 'e6', from: 'scada', to: 'mes', flowType: 'operations', color: '#f59e0b', label: 'OEE Status', xray: 'ISA-88 Events', samplePayload: { flock_age: 26, mortality_pct: 1.2 }, speed: 0.005 },
      { id: 'e7', from: 'mes', to: 'mom', flowType: 'operations', color: '#f59e0b', label: 'FCR & Growth', xray: 'ISA-95 Dispatch', samplePayload: { daily_gain_g: 68.5, fcr: 1.54 }, speed: 0.005 },
      { id: 'e8', from: 'mom', to: 'sap', flowType: 'operations', color: '#f59e0b', label: 'Feed & Labor', xray: 'SAP RFC Sync', samplePayload: { grain_used_t: 1.25, job: 'DISPATCH_DONE' }, speed: 0.005 },
      { id: 'e9', from: 'sap', to: 'mom', flowType: 'operations', color: '#f59e0b', label: 'PO Release', xray: 'SAP BAPI_PO_CREATE1', samplePayload: { po_num: '4500892140', qty_t: 25.0 }, speed: 0.005, isBiDir: true },
      { id: 'e10', from: 'mom', to: 'mes', flowType: 'operations', color: '#f59e0b', label: 'Dispatch', xray: 'Work Orders', samplePayload: { feeding_curve: 'COBB500_D26' }, speed: 0.005, isBiDir: true },
      { id: 'e13', from: 'sap', to: 'snowflake', flowType: 'operations', color: '#f59e0b', label: 'Cost Models', xray: 'SAP Delta Ingest', samplePayload: { soya_price_cny: 3450.0 }, speed: 0.005 },

      // 3. Central Lakehouse, Semantics & Ontology Flow (Indigo / Royal Blue #818cf8)
      { id: 'e5', from: 'hist', to: 'snowflake', flowType: 'lakehouse', color: '#818cf8', label: 'Archive Export', xray: 'Snowpipe Ingestion', samplePayload: { batch: '5YR_COHORT_AGG' }, speed: 0.004 },
      { id: 'e11', from: 'mes', to: 'snowflake', flowType: 'lakehouse', color: '#818cf8', label: 'Batch Lots', xray: 'Snowpipe Bronze', samplePayload: { lot_id: 'LOT_NP01_2026' }, speed: 0.005 },
      { id: 'e12', from: 'mom', to: 'snowflake', flowType: 'lakehouse', color: '#818cf8', label: 'Ops Telemetry', xray: 'Snowpipe Bronze', samplePayload: { fleet_barns: 50, safety_idx: 99.4 }, speed: 0.005 },
      { id: 'e14', from: 'snowflake', to: 'foundry', flowType: 'lakehouse', color: '#818cf8', label: 'Medallion Sync', xray: 'Snowflake Silver->Gold', samplePayload: { enriched_rows: 124000 }, speed: 0.006 },
      { id: 'e15', from: 'foundry', to: 'snowflake', flowType: 'lakehouse', color: '#818cf8', label: 'Write-Back', xray: 'Governance Write-Back', samplePayload: { sha256: 'e8b4f2c99a10' }, speed: 0.005, isBiDir: true },
      { id: 'e16', from: 'foundry', to: 'ontology', flowType: 'lakehouse', color: '#818cf8', label: 'Object Sync', xray: 'Archetype Bindings', samplePayload: { objects_linked: 142500 }, speed: 0.006 },
      { id: 'e17', from: 'ontology', to: 'twin', flowType: 'lakehouse', color: '#818cf8', label: 'Physics Map', xray: 'Neo4j Bolt :7687', samplePayload: { mesh_points: 3600, air_velocity: 2.2 }, speed: 0.005 },
      { id: 'e18', from: 'ontology', to: 'ml', flowType: 'lakehouse', color: '#818cf8', label: 'AI Features', xray: 'Cortex Feature Store', samplePayload: { tariff_cny: 1.35, risk_idx: 0.02 }, speed: 0.006 },
      { id: 'e19', from: 'ontology', to: 'dash', flowType: 'lakehouse', color: '#818cf8', label: 'Decision Feeds', xray: 'GraphQL Query', samplePayload: { iso_audit: 'VALIDATED' }, speed: 0.006 },

      // 4. Autonomous Closed-Loop Return Control (Emerald Green #10b981)
      { id: 'e20', from: 'ml', to: 'edge', flowType: 'closed_loop', color: '#10b981', label: 'Sub-350ms Closed-Loop', xray: 'Autonomous Edge Overrides (0.28s)', samplePayload: { fan_override_pct: 25.0, latency_ms: 280 }, speed: 0.008, isReturn: true }
    ];
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Spawn 14 disciplined, purposeful color-coded packets
    for (let i = 0; i < 14; i++) {
      this.spawnPacket(Math.random());
    }

    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('click', (e) => this.onClick(e));

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height || 500;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  toggleXray() {
    this.xrayMode = !this.xrayMode;
    return this.xrayMode;
  }

  toggleLineage() {
    this.lineageTracer = !this.lineageTracer;
    return this.lineageTracer;
  }

  setSubsystem(subsystemKey) {
    this.subsystemFilter = subsystemKey;
  }

  toggleEdgeOffline() {
    this.edgeOffline = !this.edgeOffline;
    if (this.edgeOffline) {
      this.bufferedPacketsCount = 1420;
    } else {
      this.bufferedPacketsCount = 0;
      for (let i = 0; i < 6; i++) {
        this.spawnPacket(0);
      }
    }
    return this.edgeOffline;
  }

  setSpeed(multiplier) {
    this.speedMultiplier = multiplier;
  }

  getScaledNodePos(node) {
    const scaleX = (this.width - 140) / 920;
    const scaleY = (this.height - 70) / 440;
    return {
      x: 70 + (node.x - 100) * scaleX,
      y: 28 + (node.y - 25) * scaleY,
      w: 142 * Math.min(scaleX, 1.1),
      h: 48 * Math.min(scaleY, 1.1)
    };
  }

  getConnectedNodeIds(activeId) {
    if (!this.lineageTracer || !activeId) return null;
    const connected = new Set([activeId]);

    this.edges.forEach(e => {
      if (e.from === activeId) connected.add(e.to);
      if (e.to === activeId) connected.add(e.from);
    });
    return connected;
  }

  onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    this.hoveredNodeId = null;
    Object.keys(this.nodes).forEach(id => {
      const node = this.nodes[id];
      const pos = this.getScaledNodePos(node);
      if (mx >= pos.x - pos.w / 2 && mx <= pos.x + pos.w / 2 &&
          my >= pos.y - pos.h / 2 && my <= pos.y + pos.h / 2) {
        this.hoveredNodeId = id;
      }
    });

    this.canvas.style.cursor = this.hoveredNodeId ? 'pointer' : 'default';
  }

  onClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const clickedPacket = this.packets.find(p => {
      if (!p.currentPos) return false;
      const dx = mx - p.currentPos.x;
      const dy = my - p.currentPos.y;
      return Math.sqrt(dx * dx + dy * dy) < 14;
    });

    if (clickedPacket) {
      this.inspectedPacket = clickedPacket;
      if (typeof window.showPacketInspectionModal === 'function') {
        window.showPacketInspectionModal(clickedPacket);
      }
      return;
    }

    if (this.hoveredNodeId) {
      this.selectedNodeId = this.hoveredNodeId;
      this.inspectedPacket = null;
      if (typeof window.onTopologyNodeSelected === 'function') {
        window.onTopologyNodeSelected(this.hoveredNodeId);
      }
    } else {
      this.inspectedPacket = null;
    }
  }

  spawnPacket(initialT = 0) {
    const edge = this.edges[Math.floor(Math.random() * this.edges.length)];

    this.packets.push({
      edge,
      t: initialT,
      speed: edge.speed * (0.9 + Math.random() * 0.2),
      payload: edge.samplePayload,
      color: edge.color
    });
  }

  drawArchitecturalBands() {
    const scaleY = (this.height - 70) / 440;
    const bands = [
      { name: 'LEVEL 0-2 • SHOPFLOOR OT & INDUSTRIAL EDGE', y: 0, h: 104, color: 'rgba(3, 3, 139, 0.22)' },
      { name: 'LEVEL 3-4 • OPERATIONS & ENTERPRISE ERP', y: 118, h: 104, color: 'rgba(3, 3, 139, 0.22)' },
      { name: 'LEVEL 5 • ENTERPRISE LAKEHOUSE & ONTOLOGY', y: 236, h: 104, color: 'rgba(3, 3, 139, 0.22)' },
      { name: 'LEVEL 6 • SPATIAL DIGITAL TWIN & CORTEX AI', y: 354, h: 104, color: 'rgba(3, 3, 139, 0.22)' }
    ];

    bands.forEach(b => {
      const py = 12 + b.y * scaleY;
      const ph = b.h * scaleY;

      this.ctx.fillStyle = b.color;
      this.ctx.fillRect(8, py, this.width - 16, ph);

      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      this.ctx.strokeRect(8, py, this.width - 16, ph);

      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '800 8.5px Plus Jakarta Sans, sans-serif';
      this.ctx.fillText(b.name, 16, py + 13);
    });
  }

  drawConduits(connectedSet) {
    this.edges.forEach(edge => {
      const n1 = this.nodes[edge.from];
      const n2 = this.nodes[edge.to];
      if (!n1 || !n2) return;

      if (this.subsystemFilter !== 'all') {
        if (n1.subsystem !== this.subsystemFilter && n2.subsystem !== this.subsystemFilter) {
          return;
        }
      }

      const p1 = this.getScaledNodePos(n1);
      const p2 = this.getScaledNodePos(n2);

      const midX = (p1.x + p2.x) / 2;
      let midY = (p1.y + p2.y) / 2;

      if (edge.isBypass) midY -= 38;
      if (edge.isReturn) midY += 50;
      if (edge.isBiDir) midY += 10;

      const isLineageActive = connectedSet ? (connectedSet.has(edge.from) && connectedSet.has(edge.to)) : true;
      const isEdgeOfflineSevered = this.edgeOffline && (edge.isBypass || edge.to === 'snowflake');

      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);

      if (isEdgeOfflineSevered) {
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeStyle = '#f43f5e';
        this.ctx.lineWidth = 1.8;
        this.ctx.stroke();
        this.ctx.setLineDash([]);
      } else if (edge.isReturn) {
        this.ctx.strokeStyle = isLineageActive ? 'rgba(16, 185, 129, 0.9)' : 'rgba(16, 185, 129, 0.25)';
        this.ctx.lineWidth = isLineageActive ? 2.5 : 1.2;
        this.ctx.shadowColor = '#10b981';
        this.ctx.shadowBlur = isLineageActive ? 10 : 0;
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
      } else {
        this.ctx.strokeStyle = edge.color;
        this.ctx.globalAlpha = isLineageActive ? 0.4 : 0.1;
        this.ctx.lineWidth = isLineageActive ? 1.6 : 1.0;
        this.ctx.stroke();
        this.ctx.globalAlpha = 1.0;
      }

      // X-Ray Protocol Badge
      if (this.xrayMode && this.width > 760 && isLineageActive) {
        const textT = 0.5;
        const tx = (1 - textT) * (1 - textT) * p1.x + 2 * (1 - textT) * textT * midX + textT * textT * p2.x;
        const ty = (1 - textT) * (1 - textT) * p1.y + 2 * (1 - textT) * textT * midY + textT * textT * p2.y;

        this.ctx.fillStyle = '#03038b';
        this.ctx.strokeStyle = isEdgeOfflineSevered ? '#f43f5e' : (edge.isReturn ? '#10b981' : edge.color);
        this.ctx.lineWidth = 1.2;
        const badgeW = edge.xray.length * 5.2 + 10;
        this.ctx.beginPath();
        this.ctx.roundRect(tx - badgeW / 2, ty - 8, badgeW, 16, 4);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = isEdgeOfflineSevered ? '#fda4af' : '#ffffff';
        this.ctx.font = '700 7.8px JetBrains Mono, monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(isEdgeOfflineSevered ? 'OFFLINE BUFFER' : edge.xray, tx, ty + 3);
        this.ctx.textAlign = 'left';
      }
    });
  }

  drawPackets(connectedSet) {
    if (this.isPaused) return;

    for (let i = this.packets.length - 1; i >= 0; i--) {
      const p = this.packets[i];
      p.t += p.speed * this.speedMultiplier;

      if (p.t >= 1.0) {
        this.packets.splice(i, 1);
        this.spawnPacket(0);
        continue;
      }

      const n1 = this.nodes[p.edge.from];
      const n2 = this.nodes[p.edge.to];
      if (!n1 || !n2) continue;

      if (this.subsystemFilter !== 'all') {
        if (n1.subsystem !== this.subsystemFilter && n2.subsystem !== this.subsystemFilter) {
          continue;
        }
      }

      const isLineageActive = connectedSet ? (connectedSet.has(p.edge.from) && connectedSet.has(p.edge.to)) : true;
      if (!isLineageActive) continue;

      const p1 = this.getScaledNodePos(n1);
      const p2 = this.getScaledNodePos(n2);
      const midX = (p1.x + p2.x) / 2;
      let midY = (p1.y + p2.y) / 2;

      if (p.edge.isBypass) midY -= 38;
      if (p.edge.isReturn) midY += 50;
      if (p.edge.isBiDir) midY += 10;

      const t = p.t;
      const curX = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * midX + t * t * p2.x;
      const curY = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * midY + t * t * p2.y;

      p.currentPos = { x: curX, y: curY };

      // Draw Distinct Functional Color Capsule with Glow
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 10;
      this.ctx.beginPath();
      this.ctx.arc(curX, curY, p.edge.isReturn ? 4.0 : 3.0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }
  }

  drawNodes(time, connectedSet) {
    Object.keys(this.nodes).forEach(id => {
      const node = this.nodes[id];
      const pos = this.getScaledNodePos(node);
      const isSelected = this.selectedNodeId === id;
      const isHovered = this.hoveredNodeId === id;

      const isSubsystemActive = (this.subsystemFilter === 'all' || node.subsystem === this.subsystemFilter);
      const isLineageActive = connectedSet ? connectedSet.has(id) : true;
      const isFaded = !isSubsystemActive || (!isLineageActive && !isSelected);

      const x = pos.x - pos.w / 2;
      const y = pos.y - pos.h / 2;

      // Legible alpha when dimmed
      this.ctx.globalAlpha = isFaded ? 0.45 : 1.0;

      // 1. Halo Glow
      if (isSelected || isHovered) {
        this.ctx.fillStyle = isSelected ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)';
        this.ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.4)';
        this.ctx.lineWidth = isSelected ? 2.0 : 1.0;
        this.ctx.beginPath();
        this.ctx.roundRect(x - 2, y - 2, pos.w + 4, pos.h + 4, 8);
        this.ctx.fill();
        this.ctx.stroke();
      }

      // 2. Node Container in GEA Royal Blue (#03038b)
      this.ctx.fillStyle = isSelected ? '#03038b' : 'rgba(3, 3, 139, 0.88)';
      this.ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.28)';
      this.ctx.lineWidth = isSelected ? 1.6 : 1;
      this.ctx.beginPath();
      this.ctx.roundRect(x, y, pos.w, pos.h, 6);
      this.ctx.fill();
      this.ctx.stroke();

      // 3. Left Accent Strip
      this.ctx.fillStyle = isSelected ? '#ffffff' : '#38bdf8';
      this.ctx.fillRect(x + 2, y + 6, 2.5, pos.h - 12);

      // 4. Number Pill in Crisp Pure White
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.roundRect(x + 8, y + 5, 18, 13, 3);
      this.ctx.fill();

      this.ctx.fillStyle = '#03038b';
      this.ctx.font = 'bold 8.5px Plus Jakarta Sans, sans-serif';
      this.ctx.fillText(node.num, x + 11, y + 15);

      // 5. Title & Icon in Crisp White
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '700 10px Plus Jakarta Sans, sans-serif';
      this.ctx.fillText(`${node.icon} ${node.name}`, x + 30, y + 15);

      // 6. Subtitle or X-Ray Latency in Crisp Light Silver
      this.ctx.fillStyle = isSelected ? '#ffffff' : '#e2e8f0';
      this.ctx.font = '600 7.8px JetBrains Mono, monospace';

      if (this.xrayMode) {
        this.ctx.fillText(`⏱️ ${node.latency}`, x + 8, y + 32);
      } else if (id === 'edge' && this.edgeOffline) {
        this.ctx.fillStyle = '#fbbf24';
        this.ctx.fillText(`⚠️ NVRAM: ${this.bufferedPacketsCount} evts buffered`, x + 8, y + 32);
      } else {
        this.ctx.fillText(node.metric, x + 8, y + 32);
      }

      this.ctx.globalAlpha = 1.0;
    });
  }

  drawPacketInspector() {
    if (!this.inspectedPacket || !this.inspectedPacket.currentPos) return;

    const px = this.inspectedPacket.currentPos.x;
    const py = this.inspectedPacket.currentPos.y;
    const p = this.inspectedPacket;

    const popW = 210;
    const popH = 85;
    const popX = Math.min(this.width - popW - 15, Math.max(15, px - popW / 2));
    const popY = Math.max(15, py - popH - 12);

    this.ctx.fillStyle = 'rgba(2, 2, 45, 0.96)';
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 1.5;
    this.ctx.shadowColor = '#38bdf8';
    this.ctx.shadowBlur = 12;
    this.ctx.beginPath();
    this.ctx.roundRect(popX, popY, popW, popH, 8);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;

    // Header
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 9px JetBrains Mono, monospace';
    this.ctx.fillText(`📦 PACKET PAYLOAD [${p.edge.xray}]`, popX + 10, popY + 16);

    // JSON Payload
    this.ctx.fillStyle = '#38bdf8';
    this.ctx.font = '500 8.5px JetBrains Mono, monospace';
    const jsonStr = JSON.stringify(p.payload, null, 1);
    const lines = jsonStr.split('\n');
    lines.slice(0, 4).forEach((line, idx) => {
      this.ctx.fillText(line, popX + 10, popY + 32 + idx * 12);
    });
  }

  setScenario(scenarioName) {
    this.scenario = scenarioName;
    if (scenarioName === 'legacy') {
      this.edgeOffline = true;
    } else {
      this.edgeOffline = false;
    }
  }

  setSpeed(speed) {
    this.speedMultiplier = speed;
  }

  animate() {
    // Schedule first so the loop keeps ticking and resumes when shown again.
    requestAnimationFrame(this.animate);

    // Skip the 2D draw while the Data Highway view is hidden (e.g. while
    // presenting) or the tab is backgrounded. offsetWidth/Height are 0 when an
    // ancestor is display:none.
    if ((this.canvas.offsetWidth === 0 && this.canvas.offsetHeight === 0) || document.hidden) return;

    const time = performance.now() * 0.001;
    this.ctx.clearRect(0, 0, this.width, this.height);

    const connectedSet = this.getConnectedNodeIds(this.selectedNodeId);

    this.drawArchitecturalBands();
    this.drawConduits(connectedSet);
    this.drawPackets(connectedSet);
    this.drawNodes(time, connectedSet);
    this.drawPacketInspector();
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.topologyCanvas = new IndustrialTopologyCanvas('canvas-topology-flow');
});
