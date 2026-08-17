/**
 * Sunner Cyber-Physical Data Highway: HTML5 Canvas 60FPS Particle Flow Engine
 * Renders glowing multi-tier conduits, morphing data packets, and automated auto-cruise camera tracking.
 */

class DataHighwayVisualizer {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.particles = [];
    this.maxParticles = options.maxParticles || 45;
    this.warpSpeed = false;
    this.crisisMode = false;
    this.autoCruise = true;
    this.activeNodeIndex = 0;
    this.autoCruiseTimer = 0;
    this.packetCount = 0;

    // Node definitions (10 Industrial Tiers)
    this.nodes = [
      { id: 1, name: "Siemens PLC", sub: "Modbus TCP", lvl: "L0/1", icon: "⚡", color: "#00f2fe", x: 0.08, y: 0.35, shape: "hex_cube" },
      { id: 2, name: "Welotec egOS", sub: "Sparkplug B", lvl: "L2", icon: "📟", color: "#10b981", x: 0.18, y: 0.65, shape: "json_frame" },
      { id: 3, name: "Ignition SCADA", sub: "OPC UA", lvl: "L3", icon: "🖥️", color: "#f59e0b", x: 0.30, y: 0.25, shape: "sine_wave" },
      { id: 4, name: "OSIsoft PI", sub: "Historian", lvl: "L3", icon: "📈", color: "#38bdf8", x: 0.38, y: 0.75, shape: "pi_point" },
      { id: 5, name: "MES / MOM", sub: "Batch ISA-88", lvl: "L3", icon: "📋", color: "#818cf8", x: 0.50, y: 0.35, shape: "batch_card" },
      { id: 6, name: "SAP S/4HANA", sub: "ERP Auto-PO", lvl: "L4", icon: "🏢", color: "#fbbf24", x: 0.60, y: 0.70, shape: "sap_gold" },
      { id: 7, name: "Snowflake", sub: "Medallion Lake", lvl: "L5", icon: "❄️", color: "#60a5fa", x: 0.70, y: 0.30, shape: "crystal" },
      { id: 8, name: "Palantir Foundry", sub: "Ontology", lvl: "L5", icon: "🧬", color: "#c084fc", x: 0.80, y: 0.65, shape: "ontology" },
      { id: 9, name: "Neo4j Twin", sub: "Graph Bolt", lvl: "L5+", icon: "🕸️", color: "#34d399", x: 0.88, y: 0.35, shape: "graph" },
      { id: 10, name: "Cortex AI", sub: "Multi-Agent", lvl: "L6+", icon: "🧠", color: "#ec4899", x: 0.95, y: 0.55, shape: "neural_core" }
    ];

    this.initCanvasSize();
    window.addEventListener('resize', () => this.initCanvasSize());
    
    // Spawn initial particles
    this.seedParticles();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initCanvasSize() {
    const parent = this.canvas.parentElement;
    this.width = this.canvas.width = parent.clientWidth || 1400;
    this.height = this.canvas.height = 360;
  }

  getNodePos(node) {
    return {
      x: node.x * this.width,
      y: node.y * this.height
    };
  }

  seedParticles() {
    for (let i = 0; i < this.maxParticles; i++) {
      this.spawnParticle(Math.random() * (this.nodes.length - 1));
    }
  }

  spawnParticle(startSegment = 0) {
    const seg = Math.floor(startSegment);
    const fromNode = this.nodes[seg];
    const toNode = this.nodes[(seg + 1) % this.nodes.length];
    
    this.particles.push({
      segment: seg,
      progress: Math.random(),
      speed: (this.warpSpeed ? 0.015 : 0.005) + Math.random() * 0.003,
      size: 4 + Math.random() * 4,
      color: fromNode.color,
      shape: fromNode.shape,
      tail: []
    });
  }

  drawConduits() {
    const ctx = this.ctx;
    
    // Connect sequential nodes with glowing bezier energy conduits
    for (let i = 0; i < this.nodes.length - 1; i++) {
      const p1 = this.getNodePos(this.nodes[i]);
      const p2 = this.getNodePos(this.nodes[i + 1]);
      
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2 + ((i % 2 === 0) ? -20 : 20);

      // Outer conduit glow
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
      ctx.strokeStyle = this.crisisMode ? "rgba(239, 68, 68, 0.4)" : "rgba(6, 182, 212, 0.18)";
      ctx.lineWidth = 6;
      ctx.stroke();

      // Inner conduit core
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
      ctx.strokeStyle = this.crisisMode ? "rgba(239, 68, 68, 0.8)" : "rgba(255, 255, 255, 0.35)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Closed-loop return conduit: Node 10 (Cortex AI) -> Node 1 (Siemens PLC)
    const pLast = this.getNodePos(this.nodes[9]);
    const pFirst = this.getNodePos(this.nodes[0]);
    ctx.beginPath();
    ctx.moveTo(pLast.x, pLast.y);
    ctx.bezierCurveTo(this.width * 0.7, this.height * 0.95, this.width * 0.3, this.height * 0.95, pFirst.x, pFirst.y);
    ctx.strokeStyle = this.crisisMode ? "rgba(239, 68, 68, 0.9)" : "rgba(236, 72, 153, 0.4)";
    ctx.lineWidth = this.crisisMode ? 4 : 2;
    ctx.setLineDash([6, 6]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawNodes() {
    const ctx = this.ctx;
    const now = Date.now() * 0.003;

    this.nodes.forEach((node, idx) => {
      const pos = this.getNodePos(node);
      const isAutoActive = this.activeNodeIndex === idx;
      const isCrisisActive = this.crisisMode && (idx === 0 || idx === 1 || idx === 2 || idx === 9);

      // Orbital outer pulse ring
      ctx.beginPath();
      const radius = 22 + (isAutoActive ? Math.sin(now * 3) * 4 : 0);
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = isCrisisActive ? "#ef4444" : (isAutoActive ? "#38bdf8" : "rgba(255, 255, 255, 0.15)");
      ctx.lineWidth = isAutoActive ? 3 : 1;
      ctx.stroke();

      // Node Hub Core Background
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 18, 0, Math.PI * 2);
      ctx.fillStyle = isCrisisActive ? "rgba(239, 68, 68, 0.3)" : "rgba(15, 23, 42, 0.85)";
      ctx.fill();
      ctx.strokeStyle = node.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Node Icon
      ctx.font = "14px 'Inter', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.icon, pos.x, pos.y);

      // Node Title and Level Labels
      ctx.font = "bold 11px 'Outfit', sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(node.name, pos.x, pos.y + 30);

      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.fillStyle = node.color;
      ctx.fillText(`${node.lvl} • ${node.sub}`, pos.x, pos.y + 43);
    });
  }

  updateAndDrawParticles() {
    const ctx = this.ctx;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.progress += p.speed;

      if (p.progress >= 1.0) {
        p.progress = 0;
        p.segment = (p.segment + 1) % this.nodes.length;
        p.color = this.nodes[p.segment].color;
        p.shape = this.nodes[p.segment].shape;
        this.packetCount++;
      }

      const p1 = this.getNodePos(this.nodes[p.segment]);
      const nextIdx = (p.segment + 1) % this.nodes.length;
      const p2 = this.getNodePos(this.nodes[nextIdx]);

      // Calculate bezier curve position
      let currX, currY;
      if (p.segment === 9) {
        // Return loop
        const t = p.progress;
        const cx1 = this.width * 0.7;
        const cy1 = this.height * 0.95;
        const cx2 = this.width * 0.3;
        const cy2 = this.height * 0.95;
        currX = (1 - t) ** 3 * p1.x + 3 * (1 - t) ** 2 * t * cx1 + 3 * (1 - t) * t ** 2 * cx2 + t ** 3 * p2.x;
        currY = (1 - t) ** 3 * p1.y + 3 * (1 - t) ** 2 * t * cy1 + 3 * (1 - t) * t ** 2 * cy2 + t ** 3 * p2.y;
      } else {
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2 + ((p.segment % 2 === 0) ? -20 : 20);
        const t = p.progress;
        currX = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * midX + t * t * p2.x;
        currY = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * midY + t * t * p2.y;
      }

      // Store tail positions
      p.tail.push({ x: currX, y: currY });
      if (p.tail.length > 8) p.tail.shift();

      // Draw particle tail
      ctx.beginPath();
      for (let j = 0; j < p.tail.length; j++) {
        const tPos = p.tail[j];
        if (j === 0) ctx.moveTo(tPos.x, tPos.y);
        else ctx.lineTo(tPos.x, tPos.y);
      }
      ctx.strokeStyle = this.crisisMode ? "rgba(239, 68, 68, 0.4)" : p.color;
      ctx.lineWidth = p.size * 0.5;
      ctx.stroke();

      // Draw Morphing Data Packet Shape
      ctx.save();
      ctx.translate(currX, currY);

      if (p.shape === "hex_cube") {
        // Raw Modbus Hex Cube (PLC)
        ctx.fillStyle = this.crisisMode ? "#ef4444" : "#00f2fe";
        ctx.fillRect(-4, -4, 8, 8);
      } else if (p.shape === "sap_gold") {
        // Golden SAP S/4HANA Coin
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#fbbf24";
        ctx.fill();
      } else if (p.shape === "crystal") {
        // Snowflake Lakehouse Crystal Shard
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(5, 0);
        ctx.lineTo(0, 6);
        ctx.lineTo(-5, 0);
        ctx.closePath();
        ctx.fillStyle = "#60a5fa";
        ctx.fill();
      } else if (p.shape === "neural_core") {
        // Cortex AI Neural Sphere
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#ec4899";
        ctx.shadowColor = "#ec4899";
        ctx.shadowBlur = 12;
        ctx.fill();
      } else {
        // Standard JSON Particle
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = this.crisisMode ? "#ef4444" : p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
      }
      ctx.restore();
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Auto-cruise camera progression
    if (this.autoCruise) {
      this.autoCruiseTimer += 0.015;
      if (this.autoCruiseTimer > 1.0) {
        this.autoCruiseTimer = 0;
        this.activeNodeIndex = (this.activeNodeIndex + 1) % this.nodes.length;
        if (typeof window.selectTierFromCanvas === 'function') {
          window.selectTierFromCanvas(this.activeNodeIndex + 1);
        }
      }
    }

    this.drawConduits();
    this.updateAndDrawParticles();
    this.drawNodes();

    // Update live HUD packet stats
    const counterEl = document.getElementById('val-canvas-packet-count');
    if (counterEl) {
      counterEl.textContent = `${this.packetCount.toLocaleString()} Pkts/min`;
    }

    requestAnimationFrame(this.animate);
  }

  toggleAutoCruise() {
    this.autoCruise = !this.autoCruise;
    return this.autoCruise;
  }

  toggleWarpSpeed() {
    this.warpSpeed = !this.warpSpeed;
    this.particles.forEach(p => p.speed = (this.warpSpeed ? 0.015 : 0.005) + Math.random() * 0.003);
    return this.warpSpeed;
  }

  triggerCrisisMode(durationMs = 8000) {
    this.crisisMode = true;
    setTimeout(() => {
      this.crisisMode = false;
    }, durationMs);
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.highwayViz = new DataHighwayVisualizer('canvas-data-highway');
});
