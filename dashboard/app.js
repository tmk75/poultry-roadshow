(function () {
  const D = window.APP_DATA;
  const tr = window.I18N.tr;

  let deckIndex = 0;
  let feedTimer = null;
  let deckTimer = null;
  let negotiationTimer = null;
  let negotiationIdx = 0;
  let apiOnline = false;
  let roadshowMode = "ppt";
  let deckAutoplay = true;

  const DECK = [
    {
      layout: "title",
      kicker: { en: "GEA CHINA × Digit(AI) · PFA POULTRY", zh: "GEA 中国 × Digit(AI) · PFA 家禽" },
      title: { en: "GEA × Digit(AI) = the future", zh: "GEA × Digit(AI) = 未来" },
      sub: { en: "The intelligent poultry plant — one operating system from bird to bite.", zh: "智能家禽工厂——从禽到餐的单一操作系统。" },
      body: { en: "In China · for China · with global reach", zh: "在中国 · 为中国 · 面向全球" }
    },
    {
      layout: "split",
      kicker: { en: "02 · The thesis", zh: "02 · 核心主张" },
      title: { en: "Not digital plus AI.", zh: "不是数字加 AI。" },
      body: { en: "Digit(AI) is the fusion of digital platforms and artificial intelligence into a single intelligent operating layer — for the poultry plant.", zh: "Digit(AI) 将数字平台与人工智能融合为家禽工厂的单一智能操作系统。" },
      accent: { en: "One fused layer for the whole plant — not three parallel programs.", zh: "为整个工厂提供一个融合层，而非三个并行的项目。" }
    },
    {
      layout: "stats",
      kicker: { en: "03 · Why poultry, why now", zh: "03 · 为什么是家禽，为什么是现在" },
      title: { en: "China is the proving ground.", zh: "中国是试验场。" },
      body: { en: "Scale, speed and scrutiny make AI inevitable.", zh: "规模、速度与监管，使 AI 成为必然。" },
      stats: [
        { value: "26.6 Mt", label: { en: "China poultry meat output 2024 (+3.8% YoY)", zh: "2024 中国禽肉产量 (+3.8% 同比)" } },
        { value: "20B+", label: { en: "Birds processed in China every year", zh: "中国每年加工禽只" } },
        { value: "No.2", label: { en: "World poultry producer — still growing", zh: "全球第二大禽肉生产国，且仍在增长" } }
      ]
    },
    {
      layout: "stats",
      kicker: { en: "04 · The Sunner story · built with GEA", zh: "04 · 圣农故事 · 与 GEA 共建" },
      title: { en: "A success story GEA China helped write.", zh: "GEA 中国共同书写成功故事。" },
      body: { en: "Full-chain integration is the ideal foundation for what comes next.", zh: "全产业链一体化是下一阶段的理想基础。" },
      stats: [
        { value: "¥20.1B", label: { en: "Revenue 2025 (+8.1%)", zh: "2025 营收 (+8.1%)" } },
        { value: "800M", label: { en: "White-feather broilers capacity / year", zh: "年白羽肉鸡产能" } },
        { value: "No.1", label: { en: "Asia's largest full-chain player — world No.6", zh: "亚洲最大全产业链企业 · 全球第六" } },
        { value: "圣泽901", label: { en: "Self-bred genetics — broke 100 yrs of foreign monopoly", zh: "自主育种——打破百年国外垄断" } }
      ]
    },
    {
      layout: "stages",
      kicker: { en: "05 · The connected bird", zh: "05 · 互联的一只禽" },
      title: { en: "One bird. One data thread. Eight stages.", zh: "一只禽，一条数据链，八道工序。" },
      body: { en: "From live receiving to packaging — every step sensed, connected and optimizable.", zh: "从活禽接收到包装——每一步都被感知、连接与优化。" }
    },
    {
      layout: "stack",
      kicker: { en: "06 · The Digit(AI) stack", zh: "06 · Digit(AI) 技术栈" },
      title: { en: "Four layers, one operating system.", zh: "四层架构，一个操作系统。" },
      items: [
        { title: { en: "Edge & IIoT", zh: "边缘与 IIoT" }, body: { en: "Line-side vision & sensors, gateways, China-compliant OT paths", zh: "线边视觉与传感器、网关、合规 OT 路径" } },
        { title: { en: "Data & Cloud", zh: "数据与云" }, body: { en: "Plant data fabric, Azure China, digital twins, PIPL alignment", zh: "工厂数据编织、Azure 中国、数字孪生、PIPL 合规" } },
        { title: { en: "AI & Agents ★", zh: "AI 与智能体 ★" }, body: { en: "Carcass grading, yield, food-safety early warning, AI Foundry", zh: "胴体分级、出品率、食品安全预警、AI Foundry" } },
        { title: { en: "Human + Machine", zh: "人机协同" }, body: { en: "Augmented operators, line-side decision support, Chinese-language interfaces", zh: "增强型操作员、线边决策支持、中文界面" } }
      ]
    },
    {
      layout: "stack",
      kicker: { en: "07 · The intelligence engine", zh: "07 · 智能引擎" },
      title: { en: "Powered by what the enterprise already runs.", zh: "由企业现有系统驱动。" },
      items: [
        { title: { en: "SAP Business Backbone", zh: "SAP 业务主干" }, body: { en: "S/4HANA: orders, batches, costs, supply chain — system of record", zh: "S/4HANA：订单、批次、成本、供应链——记录系统" } },
        { title: { en: "Ontology Semantic Layer", zh: "本体语义层" }, body: { en: "One shared language for assets, process steps, flocks and lots", zh: "资产、工序、禽群与批次的统一语言" } },
        { title: { en: "AI Foundry", zh: "AI Foundry" }, body: { en: "Azure AI Foundry on Azure China: build, deploy, govern", zh: "Azure 中国上的 AI Foundry：构建、部署、治理" } }
      ]
    },
    {
      layout: "act",
      kicker: { en: "Act II · Digit(AI) × Sunner", zh: "第二幕 · Digit(AI) × 圣农" },
      title: { en: "Same plants. Same birds. New intelligence.", zh: "同样的工厂，同样的禽，新的智能。" },
      body: { en: "How GEA Digit(AI) can take Sunner to another level.", zh: "GEA Digit(AI) 如何将圣农带到新高度。" }
    },
    {
      layout: "powers",
      kicker: { en: "09 · Six AI superpowers", zh: "09 · 六大 AI 能力" },
      title: { en: "New intelligence on top.", zh: "产线之上，叠加新智能。" },
      items: [
        { value: "+1–2%", title: { en: "Meat yield", zh: "肉品出品率" }, body: { en: "Vision carcass grading + yield-optimized cut-up", zh: "视觉胴体分级与出品率优化分割" } },
        { value: "−15%", title: { en: "Energy", zh: "能耗" }, body: { en: "Autonomous chilling & scalding setpoints", zh: "预冷与浸烫自主设定" } },
        { value: "99%+", title: { en: "Line uptime", zh: "产线稼动率" }, body: { en: "Predictive maintenance before failures", zh: "故障前预测性维护" } },
        { value: "48h", title: { en: "Earlier warning", zh: "提前预警" }, body: { en: "Salmonella & Campylobacter signals", zh: "沙门氏菌与弯曲杆菌信号" } },
        { value: "−20%", title: { en: "Water & chemicals", zh: "水与化学品" }, body: { en: "Smart washdown and process-water optimization", zh: "智能清洗与工艺水优化" } },
        { value: "10×", title: { en: "Faster decisions", zh: "更快决策" }, body: { en: "Decisions in hours, not weeks", zh: "数小时而非数周完成决策" } }
      ]
    },
    {
      layout: "stack",
      kicker: { en: "10 · In China for China", zh: "10 · 在中国，为中国" },
      title: { en: "Local by design. Global by reach.", zh: "本地化设计，全球化延伸。" },
      items: [
        { title: { en: "Local architecture", zh: "本地架构" }, body: { en: "CSL / DSL / PIPL compliant", zh: "符合 CSL / DSL / PIPL" } },
        { title: { en: "Local speed", zh: "本地速度" }, body: { en: "Decisions in days, not quarters", zh: "以天而非季度完成决策" } },
        { title: { en: "Local talent & partners", zh: "本地人才与伙伴" }, body: { en: "China unit owns execution", zh: "中国团队主导执行" } },
        { title: { en: "Local value capture", zh: "本地价值落地" }, body: { en: "Chinese poultry customers first", zh: "中国禽业客户优先" } }
      ]
    },
    {
      layout: "stack",
      kicker: { en: "11 · Repeat the story everywhere", zh: "11 · 将故事复制到全球" },
      title: { en: "The Sunner playbook is a template.", zh: "圣农剧本是可复制的模板。" },
      items: [
        { title: { en: "01 · Proven", zh: "01 · 已验证" }, body: { en: "GEA China × Sunner: equipment, partnership and trust", zh: "GEA 中国 × 圣农：设备、合作与信任" } },
        { title: { en: "02 · Amplified", zh: "02 · 被放大" }, body: { en: "Digit(AI) overlays the same plants", zh: "Digit(AI) 叠加于同样产线" } },
        { title: { en: "03 · Repeated", zh: "03 · 被复制" }, body: { en: "Scales to every China integrator and global poultry player", zh: "扩展至中国及全球禽业企业" } }
      ],
      foot: { en: "禾丰 · 温氏 · 正大 · 新希望 — and poultry players worldwide", zh: "禾丰 · 温氏 · 正大 · 新希望——以及全球禽业企业" }
    },
    {
      layout: "closing",
      title: { en: "The future is a system we build.", zh: "未来是我们构建的系统。" },
      sub: { en: "GEA × Digit(AI) · PFA Poultry", zh: "GEA × Digit(AI) · PFA 家禽" },
      body: { en: "The Sunner story, ready to repeat everywhere. Let's engineer it.", zh: "圣农故事，准备好复制到全球。让我们共同打造。" }
    }
  ];

  const AI_STAGE_IDS = ["evisceration", "chilling", "cutup"];
  let twinSelected = "chilling";
  let currentReadings = D.STAGES.map((s) => D.stageReading(s));
  let twinHistory = [];

  function renderKpis() {
    const grid = document.getElementById("kpiGrid");
    grid.innerHTML = "";
    D.KPIS.forEach((kpi) => {
      const el = document.createElement("div");
      el.className = "kpi";
      el.dataset.kpi = kpi.id;
      el.innerHTML = `
        <div class="kpi-label">${tr(kpi.label)}</div>
        <div class="kpi-value"><span class="num">${kpi.value}</span><span class="kpi-unit">${kpi.unit}</span></div>
        <div class="kpi-foot">
          <span class="trend ${kpi.trend} ${kpi.good ? "good" : "bad"}">${kpi.trend === "up" ? "▲" : kpi.trend === "down" ? "▼" : "◆"}</span>
          <span>${tr(kpi.target)}</span>
        </div>
      `;
      grid.appendChild(el);
    });
  }

  function renderStages() {
    const container = document.getElementById("stageFlow");
    window.Flow.renderStageFlow(container, D.STAGES);
    const readings = D.STAGES.map((s) => D.stageReading(s));
    window.Flow.updateStageFlow(container, readings);
  }

  function renderAgents() {
    const grid = document.getElementById("agentGrid");
    grid.innerHTML = "";
    D.AGENTS.forEach((a) => {
      const el = document.createElement("div");
      el.className = "agent";
      el.dataset.color = a.color;
      el.innerHTML = `
        <div class="agent-top">
          <div>
            <h3 class="agent-name">${tr(a.name)}</h3>
            <div class="agent-role">${tr(a.role)}</div>
          </div>
          <span class="agent-dot ${a.color === "amber" ? "amber" : a.color}"></span>
        </div>
        <div class="agent-state">${tr(a.state)}</div>
      `;
      grid.appendChild(el);
    });

    const feed = document.getElementById("negotiationFeed");
    feed.innerHTML = "";
    appendNegotiation(D.NEGOTIATION[0]);
  }

  function renderTwin() {
    const map = document.getElementById("twinMap");
    const spacing = 110;
    const startX = 60;
    let nodes = "";
    D.STAGES.forEach((s, i) => {
      const cx = startX + i * spacing;
      const name = tr(s.short || s.label);
      nodes += `
        <g class="twin-station ${s.id === twinSelected ? "selected" : ""}" data-stage="${s.id}">
          <rect class="twin-box" x="${cx - 42}" y="58" width="84" height="64" rx="10"/>
          <circle class="twin-status" cx="${cx}" cy="46" r="7" fill="#0E7C7B"/>
          <text class="twin-num" x="${cx}" y="82" text-anchor="middle" fill="#8A7B66" font-size="10">${s.num}</text>
          <text class="twin-name" x="${cx}" y="104" text-anchor="middle" fill="#2A2118" font-size="11">${name}</text>
          <text class="twin-val" x="${cx}" y="164" text-anchor="middle" fill="#6B5D4C" font-size="12">--</text>
        </g>`;
    });
    const lineEnd = startX + (D.STAGES.length - 1) * spacing;
    map.innerHTML = `
      <svg viewBox="0 0 960 190" role="img" aria-label="${tr({ en: "Processing line map", zh: "加工产线图" })}">
        <line x1="${startX}" y1="136" x2="${lineEnd}" y2="136" stroke="#DDCBAC" stroke-width="3" stroke-linecap="round"/>
        ${nodes}
        <circle r="4" fill="#F5A623">
          <animateMotion dur="3.6s" repeatCount="indefinite" path="M${startX},136 H${lineEnd}" />
        </circle>
        <circle r="4" fill="#0E7C7B">
          <animateMotion dur="4.4s" begin="1.2s" repeatCount="indefinite" path="M${startX},136 H${lineEnd}" />
        </circle>
        <circle r="4" fill="#A83230">
          <animateMotion dur="5.2s" begin="2.4s" repeatCount="indefinite" path="M${startX},136 H${lineEnd}" />
        </circle>
      </svg>`;
    updateTwin(currentReadings);
    renderTwinDetail(currentReadings);
  }

  function updateTwin(readings) {
    const map = document.getElementById("twinMap");
    if (!map) return;
    readings.forEach((r) => {
      const g = map.querySelector(`[data-stage="${r.stage.id}"]`);
      if (!g) return;
      const val = g.querySelector(".twin-val");
      const dot = g.querySelector(".twin-status");
      if (val) val.textContent = `${r.value}${r.stage.unit}`;
      if (dot) dot.setAttribute("fill", r.bad ? "#A83230" : "#0E7C7B");
    });
    map.querySelectorAll(".twin-station").forEach((n) => n.classList.remove("selected"));
    const selected = map.querySelector(`[data-stage="${twinSelected}"]`);
    if (selected) selected.classList.add("selected");
    renderTwinDetail(readings);
    renderTwinKpis(readings);
    renderTwinStations(readings);
  }

  function renderTwinKpis(readings) {
    const el = document.getElementById("twinKpis");
    if (!el) return;
    const list = readings || currentReadings;
    const alerts = list.filter((r) => r.bad).length;
    const uptime = D.KPIS.find((k) => k.id === "uptime") || { value: "99.2", unit: "%" };
    const energy = D.KPIS.find((k) => k.id === "energy") || { value: "-14.8", unit: "%" };
    const kpis = [
      { label: { en: "Stations online", zh: "在线工位" }, value: `${list.length - alerts}/${list.length}` },
      { label: { en: "Active alerts", zh: "活动告警" }, value: String(alerts), alert: alerts > 0 },
      { label: { en: "Line uptime", zh: "产线稼动率" }, value: `${uptime.value}${uptime.unit}` },
      { label: { en: "Energy saving", zh: "节能" }, value: `${energy.value}${energy.unit}` }
    ];
    el.innerHTML = kpis.map((k) => `
      <div class="twin-kpi ${k.alert ? "alert" : ""}">
        <div class="twin-kpi-label">${tr(k.label)}</div>
        <div class="twin-kpi-value">${k.value}</div>
      </div>`).join("");
  }

  function renderTwinStations(readings) {
    const el = document.getElementById("twinStations");
    if (!el) return;
    const list = readings || currentReadings;
    el.innerHTML = list.map((r) => {
      const s = r.stage;
      const active = s.id === twinSelected ? "active" : "";
      const state = r.bad ? "alert" : "ok";
      return `
        <button type="button" class="twin-station-item ${active}" data-stage="${s.id}">
          <span class="twin-station-num">${s.num}</span>
          <span class="twin-station-label">${tr(s.short || s.label)}</span>
          <span class="twin-station-metric">${r.value}${s.unit}</span>
          <span class="twin-station-state ${state}" aria-label="${state === "alert" ? tr({ en: "Alert", zh: "告警" }) : tr({ en: "Normal", zh: "正常" })}"></span>
        </button>`;
    }).join("");
    el.querySelectorAll(".twin-station-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        twinSelected = btn.dataset.stage;
        updateTwin(currentReadings);
      });
    });
  }

  function renderTwinDetail(readings) {
    const el = document.getElementById("twinDetail");
    if (!el) return;
    const stage = D.STAGES.find((s) => s.id === twinSelected) || D.STAGES[0];
    const r = (readings || currentReadings).find((x) => x.stage.id === stage.id) || { value: "--" };
    const status = r.bad ? "alert" : "ok";
    const statusLabel = status === "alert"
      ? tr({ en: "Needs attention", zh: "需要关注" })
      : tr({ en: "Normal", zh: "正常" });

    const extra = [
      { label: { en: "Throughput", zh: "吞吐量" }, value: `${(stage.id.charCodeAt(0) % 40) + 80} pcs/min` },
      { label: { en: "Energy", zh: "能耗" }, value: `${(stage.id.charCodeAt(1) % 12) + 18} kW` },
      { label: { en: "Quality", zh: "质量" }, value: `${r.bad ? 94 : 98}%` }
    ];

    const base = Number(r.value) || 50;
    const amp = stage.unit === "°C" ? 0.7 : 2;
    const pts = Array.from({ length: 12 }, (_, i) => Math.max(0, base + Math.sin(i * 0.9) * amp));
    const min = Math.min(...pts);
    const max = Math.max(...pts);
    const span = max - min || 1;
    const w = 220;
    const h = 58;
    const coords = pts.map((v, i) => `${(i / (pts.length - 1) * w).toFixed(0)},${(h - ((v - min) / span) * h).toFixed(0)}`).join(" ");

    el.innerHTML = `
      <div class="td-head">
        <span class="td-status ${status}"></span>
        <span>${tr(stage.short || stage.label)}</span>
      </div>
      <div class="td-value">${r.value}<span class="td-unit">${stage.unit}</span></div>
      <div class="td-badge ${status}">${statusLabel}</div>
      <div class="td-metrics">
        ${extra.map((m) => `<div class="td-metric"><span>${tr(m.label)}</span><strong>${m.value}</strong></div>`).join("")}
      </div>
      <svg class="td-spark" viewBox="0 0 220 58" preserveAspectRatio="none">
        <polyline points="${coords}" fill="none" stroke="#0E7C7B" stroke-width="2"/>
      </svg>
    `;
  }

  function makeThroughput(t) {
    const ts = t || Date.now();
    return Math.round(12000 + Math.sin(ts / 60000) * 900 + Math.sin(ts / 17000) * 220);
  }

  function renderTwin() {
    if (!document.getElementById("biKpis")) return;
    if (!twinHistory.length) {
      const now = Date.now();
      for (let i = 23; i >= 0; i--) {
        const t = now - i * 2200;
        twinHistory.push({ t, v: makeThroughput(t) });
      }
    }
    renderTwinBI(currentReadings);
  }

  function updateTwin(readings) {
    currentReadings = readings || currentReadings;
    twinHistory.push({ t: Date.now(), v: makeThroughput() });
    if (twinHistory.length > 24) twinHistory.shift();
    renderTwinBI(currentReadings);
  }

  function renderTwinBI(readings) {
    renderTwinKpis(readings);
    renderTwinTrend();
    renderTwinGauge(readings);
    renderTwinBars(readings);
    renderTwinAlerts(readings);
    renderTwinTable(readings);
  }

  function renderTwinKpis(readings) {
    const el = document.getElementById("biKpis");
    if (!el) return;
    const alerts = readings.filter((r) => r.bad).length;
    const latest = twinHistory.length ? twinHistory[twinHistory.length - 1].v : makeThroughput();
    const yieldKpi = D.KPIS.find((k) => k.id === "yield") || { value: "+1.2", unit: "%" };
    const energyKpi = D.KPIS.find((k) => k.id === "energy") || { value: "-14.8", unit: "%" };
    const kpis = [
      { label: { en: "Line throughput", zh: "产线吞吐" }, value: latest.toLocaleString("en-US"), unit: "birds/hr", foot: { en: "live", zh: "实时" } },
      { label: { en: "Active alerts", zh: "活动告警" }, value: String(alerts), unit: "", foot: alerts ? { en: "needs action", zh: "需处理" } : { en: "all clear", zh: "无" }, alert: alerts > 0 },
      { label: { en: "Meat yield", zh: "肉品出品率" }, value: yieldKpi.value, unit: yieldKpi.unit, foot: { en: "vs target", zh: "对目标" } },
      { label: { en: "Energy saving", zh: "节能" }, value: energyKpi.value, unit: energyKpi.unit, foot: { en: "vs target", zh: "对目标" } }
    ];
    el.innerHTML = kpis.map((k) => `
      <div class="bi-kpi ${k.alert ? "alert" : ""}">
        <span class="bi-kpi-label">${tr(k.label)}</span>
        <strong class="bi-kpi-value">${k.value}<small>${k.unit}</small></strong>
        <span class="bi-kpi-foot">${tr(k.foot)}</span>
      </div>`).join("");
  }

  function renderTwinTrend() {
    const el = document.getElementById("biTrend");
    if (!el) return;
    const values = twinHistory.map((d) => d.v);
    const target = 12500;
    const w = 760;
    const h = 190;
    const pad = 16;
    const all = values.concat(target);
    const min = Math.min(...all) - 200;
    const max = Math.max(...all) + 200;
    const span = max - min || 1;
    const x = (i) => pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = (v) => h - pad - ((v - min) / span) * (h - pad * 2);
    const line = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
    const grid = [0, 1, 2, 3].map((g) => {
      const gy = (pad + (g / 3) * (h - pad * 2)).toFixed(1);
      return `<line x1="${pad}" y1="${gy}" x2="${w - pad}" y2="${gy}" stroke="var(--border)" stroke-width="1" stroke-dasharray="3 5"/>`;
    }).join("");
    el.innerHTML = `
      <svg class="bi-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="${tr({ en: "Line throughput trend", zh: "产线吞吐趋势" })}">
        ${grid}
        <line x1="${pad}" y1="${y(target).toFixed(1)}" x2="${w - pad}" y2="${y(target).toFixed(1)}" stroke="var(--amber)" stroke-width="2" stroke-dasharray="6 5"/>
        <polyline points="${line}" fill="none" stroke="var(--teal)" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="${x(values.length - 1).toFixed(1)}" cy="${y(values[values.length - 1]).toFixed(1)}" r="4" fill="var(--teal)"/>
      </svg>`;
  }

  function renderTwinGauge(readings) {
    const el = document.getElementById("biGauge");
    if (!el) return;
    const alerts = readings.filter((r) => r.bad).length;
    const health = Math.round(((readings.length - alerts) / readings.length) * 100);
    const color = health >= 90 ? "var(--teal)" : health >= 70 ? "var(--amber)" : "var(--red)";
    const r = 54;
    const c = 2 * Math.PI * r;
    const filled = (health / 100) * c;
    el.innerHTML = `
      <div class="bi-gauge-wrap">
        <svg class="bi-gauge-svg" viewBox="0 0 140 140" role="img" aria-label="${health}%">
          <circle cx="70" cy="70" r="${r}" fill="none" stroke="var(--surface-2)" stroke-width="12"/>
          <circle cx="70" cy="70" r="${r}" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${filled.toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 70 70)"/>
        </svg>
        <div class="bi-gauge-center"><strong>${health}%</strong><span>${tr({ en: "healthy", zh: "健康" })}</span></div>
      </div>
      <p class="bi-gauge-note">${alerts ? `${alerts} ${tr({ en: "stations need attention", zh: "个工位需关注" })}` : tr({ en: "All stations within target", zh: "所有工位处于目标范围内" })}</p>`;
  }

  function scoreForReading(r) {
    const s = r.stage;
    const range = s.max - s.min || 1;
    const mid = (s.min + s.max) / 2;
    const dev = Math.abs(Number(r.value || 0) - mid);
    return Math.max(0, Math.min(100, 100 - (dev / range) * 200));
  }

  function scoreColor(score) {
    return score >= 80 ? "var(--teal)" : score >= 60 ? "var(--amber)" : "var(--red)";
  }

  function renderTwinBars(readings) {
    const el = document.getElementById("biBars");
    if (!el) return;
    el.innerHTML = readings.map((r) => {
      const score = scoreForReading(r);
      return `
        <div class="bi-bar-row">
          <span class="bi-bar-label">${tr(r.stage.short || r.stage.label)}</span>
          <span class="bi-bar-track"><span class="bi-bar-fill" style="width:${score}%;background:${scoreColor(score)}"></span></span>
          <span class="bi-bar-value mono">${Math.round(score)}</span>
        </div>`;
    }).join("");
  }

  function renderTwinAlerts(readings) {
    const el = document.getElementById("biAlerts");
    if (!el) return;
    const bad = readings.filter((r) => r.bad);
    const items = bad.map((r) => ({
      color: "var(--red)",
      text: `${tr(r.stage.short || r.stage.label)}: ${r.value}${r.stage.unit} ${tr({ en: "outside target", zh: "超出目标" })}`
    }));
    D.FEED_EVENTS.slice(0, 3).forEach((f) => items.push({ color: "var(--teal)", text: tr(f) }));
    if (!items.length) items.push({ color: "var(--teal)", text: tr({ en: "All systems normal", zh: "所有系统正常" }) });
    el.innerHTML = items.slice(0, 5).map((i) => `
      <div class="bi-alert">
        <span class="bi-alert-dot" style="background:${i.color}"></span>
        <span>${i.text}</span>
      </div>`).join("");
  }

  function renderTwinTable(readings) {
    const el = document.getElementById("biTable");
    if (!el) return;
    const rows = readings.map((r) => {
      const score = scoreForReading(r);
      return `
        <tr>
          <td><span class="bi-stage-num">${r.stage.num}</span> ${tr(r.stage.short || r.stage.label)}</td>
          <td>${tr(r.stage.metric)}</td>
          <td class="mono">${r.value}${r.stage.unit}</td>
          <td class="mono muted">${r.stage.min}–${r.stage.max}${r.stage.unit}</td>
          <td><span class="bi-status-dot" style="background:${r.bad ? "var(--red)" : "var(--teal)"}"></span> ${r.bad ? tr({ en: "Alert", zh: "告警" }) : tr({ en: "OK", zh: "正常" })}</td>
          <td class="bi-score"><span class="bi-score-bar"><span style="width:${score}%;background:${scoreColor(score)}"></span></span><span class="mono">${Math.round(score)}</span></td>
        </tr>`;
    }).join("");
    el.innerHTML = `
      <thead><tr>
        <th>${tr({ en: "Stage", zh: "工位" })}</th>
        <th>${tr({ en: "Metric", zh: "指标" })}</th>
        <th>${tr({ en: "Current", zh: "当前值" })}</th>
        <th>${tr({ en: "Target", zh: "目标范围" })}</th>
        <th>${tr({ en: "Status", zh: "状态" })}</th>
        <th>${tr({ en: "Score", zh: "得分" })}</th>
      </tr></thead>
      <tbody>${rows}</tbody>`;
  }

  function renderDeck() {
    const deck = document.getElementById("deck");
    if (roadshowMode === "ppt") {
      deck.className = "deck deck-ppt";
      deck.innerHTML = `<div class="ppt-frame"><img src="assets/slides/slide-${deckIndex + 1}.png" alt="Slide ${deckIndex + 1}"></div>`;
    } else {
      const slide = DECK[deckIndex];
      deck.className = "deck deck-" + (slide.layout || "split");
      deck.innerHTML = slideHTML(slide);
    }
    deck.classList.remove("deck-enter");
    void deck.offsetWidth;
    deck.classList.add("deck-enter");
    document.getElementById("deckCounter").textContent = `${deckIndex + 1} / ${DECK.length}`;
    document.getElementById("deckProgress").style.width = `${((deckIndex + 1) / DECK.length) * 100}%`;
    renderDots();
  }

  function slideHTML(slide) {
    const kicker = slide.kicker ? `<div class="deck-kicker">${tr(slide.kicker)}</div>` : "";
    const title = slide.title ? `<div class="deck-title">${tr(slide.title)}</div>` : "";
    const sub = slide.sub ? `<div class="deck-sub">${tr(slide.sub)}</div>` : "";
    const body = slide.body ? `<p class="deck-body">${tr(slide.body)}</p>` : "";

    switch (slide.layout) {
      case "title":
        return `${kicker}${title}${sub}${body}<div class="deck-art"><img src="assets/image1.png" alt=""><img src="assets/image3.png" alt=""></div>`;
      case "split":
        return `${kicker}${title}<div class="deck-split">${body}<div class="deck-accent">${tr(slide.accent)}</div></div>`;
      case "stats":
        return `${kicker}${title}${body}<div class="deck-stats">${(slide.stats || []).map((s) => `<div class="dstat"><div class="dstat-val">${s.value}</div><div class="dstat-label">${tr(s.label)}</div></div>`).join("")}</div>`;
      case "stages":
        return `${kicker}${title}${body}<div class="deck-stages">${D.STAGES.map((s) => `<div class="dstage ${AI_STAGE_IDS.includes(s.id) ? "ai" : ""}"><span>${s.num}</span><strong>${tr(s.short || s.label)}</strong><small>${AI_STAGE_IDS.includes(s.id) ? "AI" : "·"}</small></div>`).join("")}</div>`;
      case "stack":
        return `${kicker}${title}<div class="deck-list">${(slide.items || []).map((it) => `<div class="ditem"><h3>${tr(it.title)}</h3><p>${tr(it.body)}</p></div>`).join("")}</div>${slide.foot ? `<p class="deck-foot">${tr(slide.foot)}</p>` : ""}`;
      case "powers":
        return `${kicker}${title}<div class="deck-powers">${(slide.items || []).map((it) => `<div class="dpower"><div class="dpower-val">${it.value}</div><div class="dpower-title">${tr(it.title)}</div><div class="dpower-body">${tr(it.body)}</div></div>`).join("")}</div>`;
      case "act":
        return `${kicker}<div class="deck-title deck-title-xl">${tr(slide.title)}</div>${body}`;
      case "closing":
        return `<div class="deck-title deck-title-xl">${tr(slide.title)}</div>${sub}${body}`;
      default:
        return `${kicker}${title}${body}`;
    }
  }

  function renderDots() {
    const dots = document.getElementById("slideDots");
    if (!dots) return;
    dots.innerHTML = "";
    DECK.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "dot" + (i === deckIndex ? " active" : "");
      b.setAttribute("aria-label", `${i + 1}`);
      b.addEventListener("click", () => {
        deckIndex = i;
        renderDeck();
        scheduleDeck();
      });
      dots.appendChild(b);
    });
  }

  function pushFeed() {
    const feed = document.getElementById("telemetryFeed");
    const msg = D.FEED_EVENTS[Math.floor(Math.random() * D.FEED_EVENTS.length)];
    const row = document.createElement("div");
    row.className = "feed-row";
    const time = new Date().toLocaleTimeString([], { hour12: false });
    row.innerHTML = `<span class="feed-time">${time}</span><span class="feed-msg">${tr(msg)}</span>`;
    feed.prepend(row);
    while (feed.children.length > 8) feed.removeChild(feed.lastChild);
  }

  function pushAlerts() {
    const alerts = document.getElementById("alerts");
    const hasChill = Math.random() < 0.35;
    if (!hasChill) return;
    const row = document.createElement("div");
    row.className = "alert-row";
    row.textContent = tr({ en: "Chilling core temperature approached safety limit; safety agent held setpoint.", zh: "预冷中心温度接近安全限值；安全智能体已保持设定温度。" });
    alerts.prepend(row);
    while (alerts.children.length > 5) alerts.removeChild(alerts.lastChild);
  }

  function applyApiData(data) {
    if (!data || !Array.isArray(data.stages)) return;

    const container = document.getElementById("stageFlow");
    const byId = {};
    D.STAGES.forEach((s) => (byId[s.id] = s));
    const readings = data.stages
      .filter((s) => byId[s.id])
      .map((s) => ({
        stage: byId[s.id],
        value: Number(s.value).toFixed(1),
        bad: s.status !== "ok",
      }));
    currentReadings = readings;
    window.Flow.updateStageFlow(container, readings);
    updateTwin(readings);

    const grid = document.getElementById("kpiGrid");
    (data.kpis || []).forEach((k) => {
      const card = grid.querySelector(`[data-kpi="${k.id}"]`);
      if (!card) return;
      const num = card.querySelector(".num");
      const unit = card.querySelector(".kpi-unit");
      if (num) num.textContent = k.value;
      if (unit) unit.textContent = k.unit;
    });

    const feed = document.getElementById("telemetryFeed");
    (data.feed || []).slice().reverse().forEach((item) => {
      const row = document.createElement("div");
      row.className = "feed-row";
      row.innerHTML = `<span class="feed-time">${item.time || ""}</span><span class="feed-msg">${tr(item)}</span>`;
      feed.prepend(row);
    });
    while (feed.children.length > 8) feed.removeChild(feed.lastChild);

    const alerts = document.getElementById("alerts");
    alerts.innerHTML = "";
    (data.alerts || []).forEach((a) => {
      const row = document.createElement("div");
      row.className = "alert-row";
      row.textContent = tr(a);
      alerts.appendChild(row);
    });
  }

  async function pollApi() {
    try {
      const res = await fetch("/api/telemetry", { cache: "no-store" });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = await res.json();
      apiOnline = true;
      applyApiData(data);
    } catch (err) {
      apiOnline = false;
    }
  }

  function appendNegotiation(item) {
    const feed = document.getElementById("negotiationFeed");
    if (!feed) return;
    const row = document.createElement("div");
    row.className = "feed-row";
    row.style.animation = "slide-in 0.3s ease";
    row.innerHTML = `<span class="agent-dot ${item.color === "amber" ? "amber" : item.color}" style="margin-top:0.15rem"></span><span class="feed-msg">${tr(item.text)}</span>`;
    feed.prepend(row);
    while (feed.children.length > 7) feed.removeChild(feed.lastChild);
  }

  function negotiateTick() {
    negotiationIdx = (negotiationIdx + 1) % D.NEGOTIATION.length;
    appendNegotiation(D.NEGOTIATION[negotiationIdx]);
  }

  function buildTicker() {
    const track = document.getElementById("tickerTrack");
    const items = [];
    D.KPIS.forEach((k) => items.push(`${tr(k.label)} ${k.value}${k.unit}`));
    D.FEED_EVENTS.forEach((f) => items.push(tr(f)));
    const half = items.map((t) => `<span class="ticker-item">${t}</span>`).join("");
    track.innerHTML = half + half;
  }

  function goDeck(dir) {
    deckIndex = (deckIndex + dir + DECK.length) % DECK.length;
    renderDeck();
    scheduleDeck();
  }

  function scheduleDeck() {
    clearInterval(deckTimer);
    deckTimer = null;
    if (!deckAutoplay) return;
    deckTimer = setInterval(() => goDeck(1), 6000);
  }

  function toggleDeckAutoplay() {
    deckAutoplay = !deckAutoplay;
    const btn = document.getElementById("deckAutoplay");
    if (btn) {
      btn.classList.toggle("active", deckAutoplay);
      btn.setAttribute("aria-pressed", String(deckAutoplay));
    }
    scheduleDeck();
  }

  function toggleDeckFullscreen() {
    const deck = document.getElementById("deck");
    if (!document.fullscreenElement) {
      if (deck.requestFullscreen) deck.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }

  function tick() {
    if (apiOnline) return;
    currentReadings = D.STAGES.map((s) => D.stageReading(s));
    window.Flow.updateStageFlow(document.getElementById("stageFlow"), currentReadings);
    updateTwin(currentReadings);
    pushFeed();
    pushAlerts();
  }

  function renderAll() {
    renderKpis();
    renderStages();
    renderAgents();
    renderTwin();
    renderDeck();
  }

  function switchView(view) {
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
    document.getElementById(`view-${view}`).classList.add("active");
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.view === view));
  }

  function bind() {
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", () => switchView(tab.dataset.view));
    });

    document.getElementById("langToggle").addEventListener("click", () => {
      window.I18N.toggle();
      renderAll();
    });

    document.querySelectorAll("#roadshowMode .mode-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        roadshowMode = btn.dataset.mode;
        document.querySelectorAll("#roadshowMode .mode-btn").forEach((b) => b.classList.toggle("active", b === btn));
        renderDeck();
        scheduleDeck();
      });
    });

    document.getElementById("deckPrev").addEventListener("click", () => {
      goDeck(-1);
    });

    document.getElementById("deckNext").addEventListener("click", () => {
      goDeck(1);
    });

    document.getElementById("deckFullscreen").addEventListener("click", toggleDeckFullscreen);
    document.getElementById("deckAutoplay").addEventListener("click", toggleDeckAutoplay);

    document.addEventListener("keydown", (e) => {
      if (document.getElementById("view-roadshow").classList.contains("active")) {
        if (e.key === "ArrowRight") goDeck(1);
        if (e.key === "ArrowLeft") goDeck(-1);
        if (e.key.toLowerCase() === "f") toggleDeckFullscreen();
      }
    });
  }

  function init() {
    window.I18N.apply();
    bind();
    renderAll();
    buildTicker();
    feedTimer = setInterval(tick, 2200);
    setInterval(pollApi, 2000);
    negotiationTimer = setInterval(negotiateTick, 2800);
    scheduleDeck();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
