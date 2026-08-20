/**
 * Sunner x GEA - Keynote Deck: content and layout renderer
 * ---------------------------------------------------------------------------
 * Replaces the previous deck, where all eight slides shared one template
 * (badge + title + subtitle + exactly three cards). Repetition was the reason
 * it read as flat: no visual variety and no narrative arc.
 *
 * Slides now declare a `layout`, and each layout renders differently:
 *
 *   statement  - one big claim or equation, minimal supporting text
 *   contrast   - two columns: today's ceiling vs what changes
 *   flow       - ordered pipeline of steps with connectors
 *   stages     - the four-stage maturity timeline
 *   cards      - three supporting cards (kept for the architecture slide)
 *   metrics    - large numbers with provenance for each figure
 *   roadmap    - phased horizon plan
 *
 * Narrative arc: GEA + AI = Future.
 *   1 the equation, 2 where engineering plateaus, 3 what AI adds,
 *   4 how they combine, 5 the maturity path, 6 the architecture,
 *   7 autonomy under pressure, 8 the quantified result, 9 the horizon.
 *
 * Slide objects keep the original contract so app.js navigation, the
 * teleprompter and executeSlideDemo() continue to work unchanged:
 *   topic, title, subtitle, pill, time, script, demoAction, navLabel
 * `demoAction` fields are untouched: badge, title, btnText, targetNav,
 * viewMode, nodeId, scenario, action.
 */

window.SunnerDeck = {
  slides: { en: [], zh: [] },

  /** Slides for the active language, falling back to English. */
  get(lang) {
    const list = this.slides[lang === 'zh' ? 'zh' : 'en'];
    return list && list.length ? list : this.slides.en;
  },

  count(lang) {
    return this.get(lang).length;
  },

  /** Short labels for the top pill navigation. */
  navLabels(lang) {
    return this.get(lang).map((s, i) => s.navLabel || `0${i + 1}`);
  },
};

(function (Deck) {
  'use strict';

  const esc = (v) => String(v == null ? '' : v);

  /**
   * Turns a slide's `graphic` declaration into SVG markup.
   * Accepts either a builder name, or { type, args } for parameterised ones.
   * Unknown names render nothing rather than breaking the slide.
   */
  function resolveGraphic(g) {
    if (!g) return '';
    const lib = Deck.graphics || {};
    if (typeof g === 'string') return typeof lib[g] === 'function' ? lib[g]() : '';
    if (typeof lib[g.type] !== 'function') return '';
    return lib[g.type].apply(null, g.args || []);
  }

  // --- layout renderers -----------------------------------------------------

  function statement(s) {
    const eq = s.equation;
    return `
      <div class="slide-statement">
        ${eq ? `
          <div class="statement-equation" role="img" aria-label="${esc(eq.aria || '')}">
            ${eq.terms.map((t, i) => `
              ${i > 0 ? `<span class="eq-operator" aria-hidden="true">${esc(eq.operators[i - 1] || '+')}</span>` : ''}
              <span class="eq-term ${t.accent ? 'accent' : ''}">
                <span class="eq-term-main">${esc(t.main)}</span>
                <span class="eq-term-sub">${esc(t.sub)}</span>
              </span>
            `).join('')}
          </div>
        ` : ''}
        ${s.lead ? `<p class="statement-lead">${s.lead}</p>` : ''}
        ${s.points ? `
          <ul class="statement-points">
            ${s.points.map(p => `<li>${p}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `;
  }

  function contrast(s) {
    const col = (c, kind) => `
      <div class="contrast-col ${kind}">
        <span class="contrast-tag">${esc(c.tag)}</span>
        <h3 class="contrast-heading">${esc(c.heading)}</h3>
        <ul class="contrast-list">
          ${c.items.map(i => `<li><span class="contrast-mark" aria-hidden="true"></span><span>${i}</span></li>`).join('')}
        </ul>
        ${c.footnote ? `<p class="contrast-foot">${c.footnote}</p>` : ''}
      </div>
    `;
    return `
      <div class="slide-contrast">
        ${col(s.before, 'is-before')}
        <div class="contrast-divider" aria-hidden="true"><span>${esc(s.divider || '')}</span></div>
        ${col(s.after, 'is-after')}
      </div>
    `;
  }

  /** Graphic + compact notes. Used where the visual carries the argument. */
  function chart(s) {
    return `
      <div class="slide-chart">
        <figure class="chart-figure">
          ${resolveGraphic(s.graphic)}
          ${s.caption ? `<figcaption class="chart-caption">${s.caption}</figcaption>` : ''}
        </figure>
        <ul class="chart-notes">
          ${(s.notes || []).map(n => `
            <li>
              <strong class="chart-note-title">${esc(n.title)}</strong>
              <span class="chart-note-text">${n.text}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  function flow(s) {
    return `
      ${s.graphic ? `<div class="slide-flow-figure">${resolveGraphic(s.graphic)}</div>` : ''}
      <div class="slide-flow">
        ${s.steps.map((st, i) => `
          <div class="flow-step">
            <span class="flow-step-index">${String(i + 1).padStart(2, '0')}</span>
            <h3 class="flow-step-title">${esc(st.title)}</h3>
            <p class="flow-step-text">${st.text}</p>
            ${st.meta ? `<span class="flow-step-meta">${esc(st.meta)}</span>` : ''}
          </div>
          ${i < s.steps.length - 1 ? '<span class="flow-connector" aria-hidden="true"></span>' : ''}
        `).join('')}
      </div>
    `;
  }

  function stages(s) {
    return `
      <div class="slide-stages">
        <div class="stages-curve" aria-hidden="true">${resolveGraphic('capabilityCurve')}</div>
        <div class="stages-track" aria-hidden="true"></div>
        ${s.stages.map(st => `
          <div class="stage-item ${st.state || ''}">
            <span class="stage-node" aria-hidden="true"></span>
            <span class="stage-era">${esc(st.era)}</span>
            <h3 class="stage-title">${esc(st.title)}</h3>
            <p class="stage-text">${st.text}</p>
            <span class="stage-status">${esc(st.status)}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  function cards(s) {
    const grid = `
      <div class="slide-grid-3col">
        ${s.cards.map(c => `
          <div class="slide-card-block">
            <h3 class="slide-card-title">${esc(c.title)}</h3>
            <div class="slide-card-metric">${esc(c.metric)}</div>
            <p class="slide-card-text">${c.text}</p>
          </div>
        `).join('')}
      </div>
    `;
    // An optional side figure turns the card row into a diagram-plus-detail slide.
    if (!s.figure) return grid;
    return `
      <div class="slide-cards-with-figure">
        <aside class="cards-figure">
          ${resolveGraphic(s.figure)}
          ${s.figureCaption ? `<span class="cards-figure-caption">${esc(s.figureCaption)}</span>` : ''}
        </aside>
        ${grid}
      </div>
    `;
  }

  function metrics(s) {
    return `
      <div class="slide-metrics">
        ${s.metrics.map(m => `
          <div class="metric-block">
            <span class="metric-value">${esc(m.value)}<small>${esc(m.unit || '')}</small></span>
            <span class="metric-label">${esc(m.label)}</span>
            ${m.bars ? `<div class="metric-bars">${resolveGraphic({ type: 'miniBars', args: [m.bars] })}</div>` : ''}
            <span class="metric-source">${m.source}</span>
          </div>
        `).join('')}
      </div>
      ${s.caveat ? `<p class="metrics-caveat">${s.caveat}</p>` : ''}
    `;
  }

  function roadmap(s) {
    return `
      <div class="slide-roadmap">
        ${s.horizons.map((h, hi) => `
          <div class="horizon-col">
            <div class="horizon-rings">${resolveGraphic({ type: 'scopeRings', args: [hi, h.title] })}</div>
            <span class="horizon-when">${esc(h.when)}</span>
            <h3 class="horizon-title">${esc(h.title)}</h3>
            <ul class="horizon-list">
              ${h.items.map(i => `<li>${i}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
      ${s.closing ? `<p class="roadmap-closing">${s.closing}</p>` : ''}
    `;
  }

  const LAYOUTS = { statement, contrast, flow, stages, cards, metrics, roadmap, chart };

  /**
   * Builds the full slide stage markup: header, layout body, optional demo
   * banner. `index` is only used for the demo trigger's onclick binding.
   */
  Deck.renderStage = function (slide, index) {
    if (!slide) return '';
    const body = (LAYOUTS[slide.layout] || cards)(slide);

    return `
      <div class="slide-header-box">
        <div class="slide-heading-group">
          <span class="slide-topic-badge">${esc(slide.topic)}</span>
          <h2 class="slide-title">${slide.title}</h2>
          ${slide.subtitle ? `<p class="slide-subtitle">${slide.subtitle}</p>` : ''}
        </div>
        ${slide.pill ? `<span class="slide-badge-pill">${esc(slide.pill)}</span>` : ''}
      </div>

      <div class="slide-body slide-body-${esc(slide.layout || 'cards')}">
        ${body}
      </div>

      ${slide.demoAction ? `
        <div class="slide-live-demo-banner">
          <div class="demo-banner-left">
            <span class="demo-banner-badge">${esc(slide.demoAction.badge)}</span>
            <span class="demo-banner-title">${esc(slide.demoAction.title)}</span>
          </div>
          <button class="btn-launch-live-demo" id="btn-slide-demo-trigger"
                  onclick="executeSlideDemo(${Number(index) || 0})">
            ${esc(slide.demoAction.btnText)}
          </button>
        </div>
      ` : ''}
    `;
  };
})(window.SunnerDeck);

// ===========================================================================
// ENGLISH DECK - Act I: the equation, the ceiling, the new capability
// ===========================================================================

window.SunnerDeck.slides.en.push(
  // --- 01 -----------------------------------------------------------------
  {
    navLabel: '01. The Equation',
    layout: 'statement',
    topic: 'THE PREMISE',
    title: 'GEA + AI = Future',
    subtitle: 'Proven process engineering, plus a decision layer that runs it. Sunner: 50 complexes, 600M broilers a year.',
    pill: 'SUNNER × GEA',
    time: 'Target time: 1.5 min',
    equation: {
      aria: 'GEA process engineering plus artificial intelligence equals autonomous production',
      operators: ['+', '='],
      terms: [
        { main: 'GEA', sub: 'Process engineering, thermal systems, hygienic design' },
        { main: 'AI', sub: 'Perception, prediction, arbitration, closed-loop action', accent: true },
        { main: 'Future', sub: 'Plants that tune themselves, bird by bird, hour by hour' }
      ]
    },
    lead: 'GEA already builds the equipment that sets the physical limit of what a poultry operation can achieve. AI decides <strong>how that equipment is used</strong> — continuously, and faster than any human shift can react.',
    points: [
      'Hardware defines the ceiling. Decisions determine how close you get to it.',
      'Today those decisions are made on fixed schedules by people watching dials.',
      'The gap between the two is where the margin has been sitting all along.'
    ],
    demoAction: {
      badge: 'LIVE DEMO',
      title: 'See the live data path from barn sensors to autonomous action across 50 complexes.',
      btnText: 'Open the 3D data highway',
      targetNav: 'nav-btn-highway',
      viewMode: '3d',
      scenario: 'closedloop'
    },
    script: `
      <p><span class="script-highlight">"Everything I'm going to show you rests on one equation: GEA plus AI equals the future of this industry."</span></p>
      <p>GEA is already world-class at the physical layer: ventilation, thermal systems, feed handling, hygienic design. That equipment sets the ceiling on what a poultry operation can physically achieve.</p>
      <div class="script-callout">
        <strong>The argument in one line:</strong> hardware defines the ceiling, but <strong>decisions</strong> determine how close you get to it. Today those decisions are made on fixed timers by people reading dials on a shift rota. That gap is where the margin has been sitting all along.
      </div>
      <p>Over the next few slides I'll show you what closing that gap looks like — and what it's worth.</p>
    `
  },

  // --- 02 -----------------------------------------------------------------
  {
    navLabel: '02. The Ceiling',
    layout: 'chart',
    graphic: {
      type: 'ammoniaTimeline',
      args: [{
        aria: 'Ammonia across 24 hours: manual control repeatedly breaches the 20 ppm limit, autonomous control holds well below it',
        limit: '20 ppm welfare limit',
        manual: 'Manual, per shift',
        auto: 'Autonomous, continuous',
        breach: 'Limit breached'
      }]
    },
    caption: 'Ammonia in one house across 24 hours. Same fans, same house — only the control regime differs.',
    notes: [
      { title: 'Manual saws', text: 'Levels climb until someone notices, then over-purge. Two breaches in a single day.' },
      { title: 'Autonomous holds', text: 'Continuous correction keeps a steady margin below the limit, with no dramatic purges.' },
      { title: 'Peak tariff blind', text: 'Manual ventilation runs identically at peak price and at 03:00. Nobody is arbitraging.' },
      { title: 'Not an equipment fault', text: 'This is the ceiling of manual control, not a limitation of the hardware.' }
    ],
    topic: 'WHY EXCELLENT EQUIPMENT STILL LEAVES MARGIN BEHIND',
    title: 'The engineering is not the constraint. The control loop is.',
    subtitle: 'A best-in-class house still runs on setpoints a human chose hours ago, against conditions that changed minutes ago.',
    pill: 'THE REAL BOTTLENECK',
    time: 'Target time: 2 min',
    divider: 'becomes',
    before: {
      tag: 'TODAY',
      heading: 'Excellent hardware, open loop',
      items: [
        'Setpoints fixed per shift, adjusted only once someone notices',
        'Ammonia read on walk-through rounds, not continuously',
        'Ventilation runs the same at peak tariff as at 03:00',
        'Health problems visible only once birds are already sick'
      ],
      footnote: 'Nothing here is a failure of engineering. It is the limit of manual control.'
    },
    after: {
      tag: 'WITH A DECISION LAYER',
      heading: 'Same hardware, closed loop',
      items: [
        'Setpoints recalculated continuously against live conditions',
        'NH₃, humidity, CO₂ and temperature sampled every 10 ms',
        'Load shifted out of peak tariff when welfare margin allows',
        'Respiratory distress flagged from flock audio, 48 h early'
      ],
      footnote: 'The equipment does not change. What changes is how well it is driven.'
    },
    demoAction: {
      badge: 'LIVE DEMO',
      title: 'Compare an autonomous house against a manually operated one, side by side.',
      btnText: 'Open the ROI comparison',
      targetNav: 'nav-btn-roi'
    },
    script: `
      <p><span class="script-highlight">"I want to be precise about where the problem is, because it is not the equipment."</span></p>
      <p>Take a best-in-class house. The fans, the heat exchangers, the feed lines are all excellent. But the setpoints driving them were chosen by a person, at the start of a shift, against conditions that have since moved. Ammonia gets checked when someone walks through. Ventilation runs identically at peak tariff and at three in the morning. Feed is reordered from an eyeball estimate.</p>
      <div class="script-callout">
        <strong>The point:</strong> none of that is an engineering failure. It is the ceiling of manual control. Same hardware, closed loop instead of open, and the performance changes materially — without replacing a single fan.
      </div>
      <p>The comparison view makes this concrete: two houses, identical equipment, different control regimes.</p>
    `
  },

  // --- 03 -----------------------------------------------------------------
  {
    navLabel: '03. What AI Adds',
    layout: 'flow',
    graphic: {
      type: 'controlLoop',
      args: [
        ['Sense', 'Predict', 'Arbitrate', 'Act'],
        { value: '< 350', unit: 'ms per loop', aria: 'A closed loop of sense, predict, arbitrate and act, completing in under 350 milliseconds' }
      ]
    },
    topic: 'THE FOUR THINGS A DECISION LAYER DOES',
    title: 'Sense, predict, arbitrate, act — in under a third of a second',
    subtitle: 'Not a dashboard that reports what happened. A loop that closes before a human could read the alert.',
    pill: 'CLOSED LOOP < 350 ms',
    time: 'Target time: 2 min',
    steps: [
      {
        title: 'Sense',
        text: 'Temperature, humidity, NH₃, CO₂, fan speed, silo weight and flock audio, polled at <strong>10 ms</strong> over Modbus and OPC UA.',
        meta: '13 tiers, Level 0 to Level 6'
      },
      {
        title: 'Predict',
        text: 'Models project where conditions are heading: thermal comfort drift, ammonia accumulation, respiratory distress from audio signature, silo run-out date.',
        meta: 'Up to 48 h ahead'
      },
      {
        title: 'Arbitrate',
        text: 'Specialist agents argue. Energy wants to throttle at peak tariff; Health holds a welfare floor. <strong>Health always has the veto.</strong>',
        meta: 'Welfare outranks cost, by rule'
      },
      {
        title: 'Act',
        text: 'The decision is written back to the PLCs as new setpoints, and to SAP as a purchase order — signed, logged, and reversible.',
        meta: 'Every action audited'
      }
    ],
    demoAction: {
      badge: 'LIVE DEMO',
      title: 'Watch four agents reach consensus on a live decision and write it back to the floor.',
      btnText: 'Open the agent consensus stream',
      targetNav: 'nav-btn-highway',
      viewMode: '3d',
      scenario: 'closedloop'
    },
    script: `
      <p><span class="script-highlight">"When I say AI here, I mean four specific things — not a chatbot, and not a dashboard."</span></p>
      <p>First, <strong>sense</strong>: every relevant variable, every ten milliseconds, including flock audio. Second, <strong>predict</strong>: where is this heading, up to forty-eight hours out. Third, <strong>arbitrate</strong>: this is the part people underestimate. Energy wants to throttle fans at peak tariff to save money. Health refuses if it would push ammonia toward the welfare limit.</p>
      <div class="script-callout">
        <strong>The rule that makes this safe to deploy:</strong> Health holds an absolute veto over Energy. Welfare outranks cost, by design, not by configuration. That is what makes autonomy acceptable to a veterinarian and to an auditor.
      </div>
      <p>Fourth, <strong>act</strong>: setpoints back to the PLC, purchase orders into SAP, every action logged and reversible. Let me show you the consensus happening live.</p>
    `
  }
);

// ===========================================================================
// ENGLISH DECK - Act II: how they combine, the maturity path, the architecture
// ===========================================================================

window.SunnerDeck.slides.en.push(
  // --- 04 -----------------------------------------------------------------
  {
    navLabel: '04. Combined',
    layout: 'chart',
    graphic: {
      type: 'layerStack',
      args: [{
        aria: 'The AI decision layer sends setpoints down to the GEA physical layer, which sends telemetry back up',
        aiTitle: 'AI decision layer',
        aiSub: 'Which setpoint, when, and why',
        geaTitle: 'GEA physical layer',
        geaSub: 'Capacity, accuracy, interlocks',
        interface: 'Interface: a setpoint',
        down: 'setpoint',
        up: 'telemetry',
        foot: 'Interlocks stay in hardware and cannot be overridden from software'
      }]
    },
    caption: 'One interface in each direction: a setpoint down, telemetry up. Nothing else crosses the boundary.',
    notes: [
      { title: 'GEA guarantees the physics', text: 'Capacity curves, weighing accuracy, hygienic design, and mechanical interlocks.' },
      { title: 'AI contributes the intent', text: 'Which setpoint, at which minute, for which house — with welfare, price and carbon weighed together.' },
      { title: 'Interlocks are untouchable', text: 'The decision layer proposes a setpoint. It cannot override a hardware interlock.' },
      { title: 'No recertification', text: 'Because the interface is a setpoint, the AI layer retrofits onto installed equipment.' }
    ],
    topic: 'WHERE GEA ENDS AND THE DECISION LAYER BEGINS',
    title: 'GEA supplies the actuators. AI supplies the intent.',
    subtitle: 'A clean division of responsibility: the physical layer stays GEA, the decision layer sits above it, and the interface between them is a setpoint.',
    pill: 'ONE CLEAR INTERFACE',
    time: 'Target time: 1.5 min',
    divider: 'drives',
    before: {
      tag: 'GEA LAYER — PHYSICAL',
      heading: 'What the equipment guarantees',
      items: [
        'Ventilation and heat exchange capacity, with known curves',
        'Feed handling and weighing accuracy',
        'Mechanical interlocks that software cannot override',
        'Predictable behaviour at every commanded setpoint'
      ],
      footnote: 'This is the layer that must never be surprised by software.'
    },
    after: {
      tag: 'AI LAYER — DECISION',
      heading: 'What the decision layer contributes',
      items: [
        'Which setpoint, at which minute, for which house',
        'Welfare, energy price and carbon weighed in one decision',
        'Early warning from signals no operator can watch non-stop',
        'A written, auditable reason for every action taken'
      ],
      footnote: 'It never bypasses an interlock. It only ever proposes a setpoint.'
    },
    demoAction: {
      badge: 'LIVE DEMO',
      title: 'Inspect the 13-tier pipeline and the exact protocol boundary between OT and IT.',
      btnText: 'Open the 2D architecture pipeline',
      targetNav: 'nav-btn-highway',
      viewMode: '2d',
      nodeId: 'edge'
    },
    script: `
      <p><span class="script-highlight">"The most common objection I get is: are you letting software drive my plant? So let me be exact about the boundary."</span></p>
      <p>GEA owns the physical layer: capacity, accuracy, hygiene, and above all the mechanical interlocks. Those interlocks cannot be overridden from software, ever. The decision layer sits above and only does one thing to the equipment: it proposes a setpoint.</p>
      <div class="script-callout">
        <strong>Why this division matters commercially:</strong> it means the AI layer can be added to installed GEA equipment without recertifying the machinery. The interface is a setpoint, not a redesign.
      </div>
      <p>The 2D pipeline shows exactly where that boundary sits, protocol by protocol.</p>
    `
  },

  // --- 05 -----------------------------------------------------------------
  {
    navLabel: '05. Maturity Path',
    layout: 'stages',
    topic: 'FOUR STAGES, AND WHERE SUNNER IS NOW',
    title: 'Nobody jumps straight to autonomy',
    subtitle: 'Each stage is independently valuable and pays for the next. The failure mode is trying to skip one.',
    pill: 'STAGE 4 IN PRODUCTION',
    time: 'Target time: 2 min',
    stages: [
      {
        era: 'STAGE 1',
        title: 'Automation',
        text: 'PLCs and timers execute reliably. Data stays trapped on the shop floor.',
        status: 'Complete',
        state: 'is-done'
      },
      {
        era: 'STAGE 2',
        title: 'Digitalization',
        text: 'Telemetry leaves the barn. Edge gateways, cloud ingestion, one historical record you can query.',
        status: 'Complete',
        state: 'is-done'
      },
      {
        era: 'STAGE 3',
        title: 'AI Transformation',
        text: 'Models forecast and recommend. A human still approves every change.',
        status: 'Complete',
        state: 'is-done'
      },
      {
        era: 'STAGE 4',
        title: 'Agentic Autonomy',
        text: 'Agents negotiate and act inside hard welfare bounds. Humans set the bounds and audit outcomes.',
        status: 'Live now',
        state: 'is-current'
      }
    ],
    demoAction: {
      badge: 'LIVE DEMO',
      title: 'See the four stages mapped against measured outcomes at each step.',
      btnText: 'Open the evolution matrix',
      targetNav: 'nav-btn-esg'
    },
    script: `
      <p><span class="script-highlight">"I want to set expectations honestly: nobody goes from timers to autonomy in one procurement cycle."</span></p>
      <p>Stage one is automation — reliable execution, data trapped on the floor. Stage two gets telemetry out of the barn into one queryable record. Stage three adds forecasting, with a human approving every change. Stage four is where agents act on their own inside bounds that humans set.</p>
      <div class="script-callout">
        <strong>The critical point for planning:</strong> each stage pays for the next on its own merits. The failure mode I see across the industry is trying to buy stage four while still at stage one — the data foundation isn't there, and the models have nothing trustworthy to learn from.
      </div>
      <p>Sunner has worked through all four. That's why we can show you stage four running rather than describing it.</p>
    `
  },

  // --- 06 -----------------------------------------------------------------
  {
    navLabel: '06. Architecture',
    layout: 'cards',
    figure: { type: 'tierStack', args: [['L6  BI & board', 'L5  ERP / SAP', 'L4  MOM / MES', 'L3  SCADA', 'L2  Edge gateway', 'L1  PLC', 'L0  Sensors']] },
    figureCaption: 'Level 0 to Level 6',
    topic: 'THE ENGINEERING UNDERNEATH',
    title: 'Thirteen tiers from barn floor to boardroom, inside China',
    subtitle: 'Built to survive severed fibre, and to satisfy CSL, DSL and PIPL data-localization requirements without exception.',
    pill: 'MLPS 2.0 LEVEL 3',
    time: 'Target time: 2 min',
    cards: [
      {
        title: 'Industrial edge',
        metric: '48 h buffer',
        text: 'Welotec egOS gateways poll Modbus at 10 ms with TLS 1.3. On connection loss they buffer <strong>48 hours to NVRAM</strong> and keep the local control loop running. A typhoon does not stop the house from ventilating.'
      },
      {
        title: 'In-country cloud',
        metric: '100% localized',
        text: 'All telemetry and models stay in <strong>21Vianet Azure China East 2</strong> in Shanghai. No personal or production data crosses the border, satisfying CSL, DSL and PIPL by architecture rather than by policy.'
      },
      {
        title: 'Lakehouse and ontology',
        metric: '250k rows/s',
        text: 'Snowpipe streams into <strong>Snowflake</strong>, modelled in <strong>Palantir Foundry</strong> and a Neo4j twin that knows which fan serves which zone of which flock — so a decision can be traced to the asset it touched.'
      }
    ],
    demoAction: {
      badge: 'LIVE DEMO',
      title: 'Cut the internet connection and watch the edge keep running on its local buffer.',
      btnText: 'Simulate a network outage',
      targetNav: 'nav-btn-highway',
      viewMode: '2d',
      action: 'toggleOffline'
    },
    script: `
      <p><span class="script-highlight">"Autonomy is only credible if the architecture underneath it is boring and robust. So here is the engineering."</span></p>
      <p>At the edge, Welotec gateways poll every ten milliseconds over TLS 1.3. If the fibre is cut — and in mountain sites it does get cut — they buffer forty-eight hours to NVRAM and, critically, <strong>keep the local control loop running</strong>. The house keeps ventilating whether or not the cloud is reachable.</p>
      <div class="script-callout">
        <strong>On compliance:</strong> everything stays inside 21Vianet Azure China East 2 in Shanghai. Data localization under CSL, DSL and PIPL is handled by the architecture, not by a policy document that someone has to remember to follow.
      </div>
      <p>Let me cut the connection live so you can see the buffer take over.</p>
    `
  }
);

// ===========================================================================
// ENGLISH DECK - Act III: autonomy under pressure, the result, the horizon
// ===========================================================================

window.SunnerDeck.slides.en.push(
  // --- 07 -----------------------------------------------------------------
  {
    navLabel: '07. Under Pressure',
    layout: 'chart',
    graphic: {
      type: 'incidentTimeline',
      args: [{
        aria: 'Ammonia climbs after the inverter trips, the health agent vetoes at 0.28 seconds, and levels recover',
        limit: '20 ppm welfare limit',
        trip: 'inverter trips',
        veto: 'health veto, 0.28 s',
        recover: 'levels recover'
      }]
    },
    caption: 'Recorded ammonia trace from House 03, 02:14:30 to 02:19. No human intervention at any point.',
    notes: [
      { title: '02:14:32 — fault', text: 'A ventilation inverter trips. Airflow drops and NH₃ starts climbing from 11.4 ppm.' },
      { title: 'Conflict', text: 'Peak tariff is active. The Energy agent is throttling and proposes holding the throttle.' },
      { title: '+0.28 s — veto', text: 'Health projects a breach within minutes and <strong>overrides Energy</strong>. Fans to 100%, flush starts.' },
      { title: 'Consequence', text: 'Maintenance order raised, incident written to the ledger. Cost of the override: ¥41.' }
    ],
    topic: 'A REAL INCIDENT, REPLAYED',
    title: '02:14:32 — an inverter trips and nobody is awake',
    subtitle: 'The night a ventilation inverter failed at peak tariff. Four agents, one veto, 280 milliseconds, no human in the loop.',
    pill: 'RESOLVED IN 0.28 s',
    time: 'Target time: 2.5 min',
    steps: [
      {
        title: 'Fault',
        text: 'A ventilation inverter trips in House 03. Airflow drops. <strong>NH₃ starts climbing</strong> from 11.4 ppm toward the 20 ppm welfare limit.',
        meta: '02:14:32.000'
      },
      {
        title: 'Conflict',
        text: 'Electricity is at peak tariff. The Energy agent is actively throttling to save cost and proposes holding the throttle.',
        meta: 'Cost vs welfare'
      },
      {
        title: 'Veto',
        text: 'The Health agent projects a welfare breach within minutes and <strong>vetoes Energy outright</strong>. Remaining fans go to 100% and the litter flush cycle starts.',
        meta: '02:14:32.280'
      },
      {
        title: 'Consequence',
        text: 'A maintenance order is raised against the failed inverter, the incident is written to the immutable ledger, and the morning shift arrives to a report rather than a crisis.',
        meta: 'Cost accepted: ¥41'
      }
    ],
    demoAction: {
      badge: 'LIVE DEMO',
      title: 'Replay this exact incident from the black box, decision by decision.',
      btnText: 'Replay the 02:14 incident',
      targetNav: 'nav-btn-highway',
      viewMode: '3d',
      scenario: 'ammonia'
    },
    script: `
      <p><span class="script-highlight">"Let me give you the slide I would want to see if I were sitting where you are. Not a happy path — a failure."</span></p>
      <p>Two fourteen in the morning. A ventilation inverter trips in House 03. Airflow drops and ammonia starts climbing from eleven and a half parts per million toward the twenty ppm welfare limit. Nobody is in the building.</p>
      <p>Here is where it gets interesting. Electricity is at peak tariff, so the Energy agent is actively throttling fans to save money, and it proposes holding that throttle.</p>
      <div class="script-callout">
        <strong>What happened next is the whole argument for this architecture:</strong> the Health agent projected a welfare breach within minutes and vetoed Energy outright. Remaining fans to a hundred percent, flush cycle started. Two hundred and eighty milliseconds, start to finish. It cost forty-one yuan in peak electricity and it saved the flock.
      </div>
      <p>The morning shift arrived to a maintenance order and an incident report, not a crisis. Let me replay it from the black box so you can watch the veto land.</p>
    `
  },

  // --- 08 -----------------------------------------------------------------
  {
    navLabel: '08. The Result',
    layout: 'metrics',
    topic: 'WHAT IT IS WORTH, AND WHERE EACH NUMBER COMES FROM',
    title: 'The same equipment, driven better, at fleet scale',
    subtitle: 'Annualised across 50 complexes. Every figure below traces to a measured stream, not a projection.',
    pill: '+¥655.5M ANNUAL EBITDA',
    time: 'Target time: 2.5 min',
    metrics: [
      {
        value: '1.54',
        unit: 'FCR',
        label: 'Feed conversion, from 1.68',
        bars: { beforePct: 100, afterPct: 92 },
        source: 'Measured per batch. <strong>5,856 t grain saved.</strong>'
      },
      {
        value: '-28.4',
        unit: '%',
        label: 'Peak-period power draw',
        bars: { beforePct: 100, afterPct: 72 },
        source: 'Shifted only where welfare allowed. <strong>¥14.85M.</strong>'
      },
      {
        value: '18,886',
        unit: 't CO₂e',
        label: 'Verified carbon abatement',
        bars: { beforePct: 34, afterPct: 100, lowerIsBetter: false },
        source: 'Scope 2 grid, Scope 3 feed. <strong>ISO 14064-1.</strong>'
      },
      {
        value: '98.8',
        unit: '%',
        label: 'Welfare compliance',
        bars: { beforePct: 88, afterPct: 99, lowerIsBetter: false },
        source: 'House-hours inside bounds, audited continuously.'
      }
    ],
    caveat: 'Payback under 2.5 months at this scale. Caveat worth stating: this is Sunner\'s fleet, already at stage three. A site starting at stage one funds the foundation first.',
    demoAction: {
      badge: 'LIVE DEMO',
      title: 'Stress-test these numbers yourself against feed price, tariff and mortality assumptions.',
      btnText: 'Open the CFO war room',
      targetNav: 'nav-btn-warroom'
    },
    script: `
      <p><span class="script-highlight">"Now the numbers — and I'm going to tell you where each one comes from, because a metric without provenance is marketing."</span></p>
      <p>Feed conversion from one sixty-eight down to one fifty-four. That is measured feed mass in against live weight out, per batch, not a model output. It is five thousand eight hundred tonnes of grain not consumed.</p>
      <p>Peak electricity draw down twenty-eight percent, by shifting load out of peak windows <em>only</em> where the welfare margin allowed it. Nearly fifteen million yuan. Carbon abatement of eighteen thousand tonnes, ISO 14064-1 validated across Scope 2 and Scope 3.</p>
      <div class="script-callout">
        <strong>The caveat I want on the record:</strong> these figures are from Sunner's fleet, which already had stages one through three in place. If your site is starting at stage one, expect to fund the data foundation first and see returns after. Anyone promising you stage-four numbers on a stage-one estate is selling you something.
      </div>
      <p>The war room lets you push feed price, tariff and mortality assumptions yourself and watch the EBITDA move.</p>
    `
  },

  // --- 09 -----------------------------------------------------------------
  {
    navLabel: '09. The Horizon',
    layout: 'roadmap',
    topic: 'WHAT COMES NEXT',
    title: 'From one autonomous house to a self-optimising network',
    subtitle: 'The equation does not stop at the barn. Each horizon widens the scope of what the decision layer can reason about.',
    pill: 'GEA + AI = FUTURE',
    time: 'Target time: 2 min',
    horizons: [
      {
        when: 'NOW',
        title: 'Autonomous house',
        items: [
          'Closed-loop climate and feed inside welfare bounds',
          'Automatic replenishment against measured silo weight',
          'Continuous welfare and carbon audit trail',
          'Running today across the Sunner fleet'
        ]
      },
      {
        when: 'NEXT 12 MONTHS',
        title: 'Autonomous site',
        items: [
          'Houses coordinate instead of optimising in isolation',
          'Site-level load shaping against the grid tariff curve',
          'Predictive maintenance from actuator duty cycles',
          'Processing schedule fed by live growth forecasts'
        ]
      },
      {
        when: 'HORIZON',
        title: 'Self-optimising network',
        items: [
          'Fleet-wide learning: every house improves from all houses',
          'Hatchery through processing planned as one system',
          'Carbon and welfare as live constraints, not annual reports',
          'GEA equipment that arrives pre-integrated with the decision layer'
        ]
      }
    ],
    closing: 'The equipment sets the ceiling. The decision layer decides how close you get. <strong>GEA + AI = Future.</strong>',
    demoAction: {
      badge: 'LIVE DEMO',
      title: 'Ask the system a question in plain language and watch it reason over live plant data.',
      btnText: 'Open the AI copilot',
      action: 'openCopilot'
    },
    script: `
      <p><span class="script-highlight">"Let me close where I started, because the equation scales beyond the barn."</span></p>
      <p>Today it is the autonomous house: closed-loop climate and feed inside welfare bounds, running now across the Sunner fleet. Within twelve months, the autonomous site — houses coordinating rather than each optimising alone, load shaped against the grid curve, maintenance predicted from actuator duty cycles, and the processing schedule driven by live growth forecasts.</p>
      <div class="script-callout">
        <strong>The horizon worth building toward together:</strong> a self-optimising network, where every house learns from all houses, hatchery through processing is planned as one system, and carbon and welfare are live constraints rather than annual reports. And GEA equipment that ships pre-integrated with the decision layer.
      </div>
      <p>The equipment sets the ceiling. The decision layer decides how close you get. <strong>GEA plus AI equals the future.</strong> Ask the copilot anything you like — it is reasoning over live plant data, not a script."</p>
    `
  }
);

// ===========================================================================
// 中文演讲稿 - 第一部分：核心命题、当前瓶颈、AI 带来的能力
// ===========================================================================

window.SunnerDeck.slides.zh.push(
  // --- 01 -----------------------------------------------------------------
  {
    navLabel: '01. 核心命题',
    layout: 'statement',
    topic: '核心命题',
    title: 'GEA + AI = 未来',
    subtitle: '成熟可靠的工艺装备，加上一个真正驾驶它的决策层。圣农：50 大基地，年出栏 6 亿羽。',
    pill: '圣农 × GEA',
    time: '建议时长：1.5 分钟',
    equation: {
      aria: 'GEA 工艺装备 加上 人工智能 等于 自主化生产',
      operators: ['+', '='],
      terms: [
        { main: 'GEA', sub: '工艺装备、热力系统、卫生级设计' },
        { main: 'AI', sub: '感知、预测、仲裁、闭环执行', accent: true },
        { main: '未来', sub: '按羽、按小时自我调优的工厂' }
      ]
    },
    lead: 'GEA 的装备决定了一个养殖场在物理上能达到的上限；而 AI 决定<strong>这些装备被如何使用</strong>——持续不断，且比任何人工班次的反应都更快。',
    points: [
      '硬件决定天花板，决策决定你离天花板有多近。',
      '今天这些决策仍由人按固定班次、盯着仪表做出。',
      '两者之间的差距，正是长期被留在桌面上的利润。'
    ],
    demoAction: {
      badge: '现场演示',
      title: '查看从舍内传感器到自主执行的实时数据链路，覆盖 50 大基地。',
      btnText: '打开 3D 数据管道',
      targetNav: 'nav-btn-highway',
      viewMode: '3d',
      scenario: 'closedloop'
    },
    script: `
      <p><span class="script-highlight">"今天我要讲的全部内容，都建立在一个等式上：GEA 加 AI，等于这个行业的未来。"</span></p>
      <p>GEA 在物理层已经做到世界一流：通风、热交换、饲喂输送、卫生级设计。这些装备决定了一个养殖场在物理上能达到的上限。</p>
      <div class="script-callout">
        <strong>一句话概括论点：</strong>硬件决定天花板，但<strong>决策</strong>决定你离天花板有多近。今天这些决策仍然由人按固定定时器、看着仪表、按班次做出。这个差距，就是长期被留在桌面上的利润。
      </div>
      <p>接下来几页，我会说明弥合这个差距是什么样子，以及它值多少钱。</p>
    `
  },

  // --- 02 -----------------------------------------------------------------
  {
    navLabel: '02. 真正瓶颈',
    layout: 'chart',
    graphic: {
      type: 'ammoniaTimeline',
      args: [{
        aria: '24 小时氨气曲线：人工控制多次突破 20 ppm 上限，自主控制始终保持在上限之下',
        limit: '20 ppm 福利上限',
        manual: '人工，按班次',
        auto: '自主，连续',
        breach: '突破上限'
      }]
    },
    caption: '同一栋舍 24 小时氨气曲线。风机相同、鸡舍相同，唯一的差别是控制方式。',
    notes: [
      { title: '人工呈锯齿', text: '氨气一路攀升到有人发现，再过度排风。一天之内两次突破上限。' },
      { title: '自主保持稳定', text: '连续微调，始终在上限之下留出稳定余量，不需要剧烈排风。' },
      { title: '对电价无感', text: '人工通风在峰电和凌晨三点完全一样，没有人在做峰谷套利。' },
      { title: '不是装备问题', text: '这是人工控制的天然上限，而不是硬件能力不足。' }
    ],
    topic: '为什么一流装备仍然会留下利润空间',
    title: '瓶颈不在工艺，而在控制回路',
    subtitle: '即使是最好的鸡舍，运行的仍是几小时前由人设定的参数，而现场工况在几分钟前就已经变了。',
    pill: '真正的瓶颈',
    time: '建议时长：2 分钟',
    divider: '转变为',
    before: {
      tag: '现状',
      heading: '一流硬件，开环运行',
      items: [
        '参数按班次固定，等人发现问题后才调整',
        '氨气靠巡舍抽查，而非连续监测',
        '峰电时段与凌晨三点的通风策略完全相同',
        '等到能看出健康问题时，鸡群已经病了'
      ],
      footnote: '这些都不是工艺的失败，而是人工控制的天然极限。'
    },
    after: {
      tag: '引入决策层后',
      heading: '同样硬件，闭环运行',
      items: [
        '参数依据实时工况持续重算',
        '氨气、湿度、CO₂、温度每 10 毫秒采样',
        '福利余量允许时，主动把负荷移出峰电时段',
        '通过鸡群声学提前 48 小时识别呼吸道异常'
      ],
      footnote: '装备本身没有变，变的是它被驾驶的水平。'
    },
    demoAction: {
      badge: '现场演示',
      title: '并排对比自主运行鸡舍与人工运行鸡舍的实际差异。',
      btnText: '打开 ROI 对比视图',
      targetNav: 'nav-btn-roi'
    },
    script: `
      <p><span class="script-highlight">"我想把问题定位说得非常精确，因为问题不在装备本身。"</span></p>
      <p>拿一栋最高标准的鸡舍来说：风机、热交换、料线都是一流的。但驱动它们的参数，是一个人在班次开始时设定的，而工况此后一直在变。氨气要等人巡舍时才测；峰电和凌晨三点的通风一模一样；补料靠目测存量。</p>
      <div class="script-callout">
        <strong>关键点：</strong>以上没有一项是工艺失败，而是人工控制的上限。同样的硬件，把开环换成闭环，性能就会有实质提升——一台风机都不用换。
      </div>
      <p>对比视图会把这一点讲得很具体：两栋舍，装备完全相同，控制方式不同。</p>
    `
  },

  // --- 03 -----------------------------------------------------------------
  {
    navLabel: '03. AI 的作用',
    layout: 'flow',
    graphic: {
      type: 'controlLoop',
      args: [
        ['感知', '预测', '仲裁', '执行'],
        { value: '< 350', unit: '毫秒/闭环', aria: '感知、预测、仲裁、执行构成闭环，全程不到 350 毫秒' }
      ]
    },
    topic: '决策层实际做的四件事',
    title: '感知、预测、仲裁、执行——全程不到三分之一秒',
    subtitle: '不是一块事后汇报的看板，而是一个在人还没读完告警之前就已闭合的回路。',
    pill: '闭环 < 350 毫秒',
    time: '建议时长：2 分钟',
    steps: [
      {
        title: '感知',
        text: '温度、湿度、NH₃、CO₂、风机转速、料塔重量与鸡群声音，通过 Modbus 与 OPC UA 以 <strong>10 毫秒</strong>周期采集。',
        meta: '13 个层级，L0 到 L6'
      },
      {
        title: '预测',
        text: '模型推演趋势走向：热舒适度漂移、氨气累积、声学特征中的呼吸道异常、料塔耗尽时点。',
        meta: '最长提前 48 小时'
      },
      {
        title: '仲裁',
        text: '专责智能体相互博弈。能耗体要在峰电时段降频，健康体守住福利底线。<strong>健康体始终拥有否决权。</strong>',
        meta: '规则层面：福利高于成本'
      },
      {
        title: '执行',
        text: '决策以新参数写回 PLC，并以采购订单写入 SAP——已签核、已留痕、可回溯撤销。',
        meta: '每一次动作均可审计'
      }
    ],
    demoAction: {
      badge: '现场演示',
      title: '观察四个智能体就一次真实决策达成共识，并写回现场。',
      btnText: '打开智能体共识流',
      targetNav: 'nav-btn-highway',
      viewMode: '3d',
      scenario: 'closedloop'
    },
    script: `
      <p><span class="script-highlight">"我这里说的 AI，指的是四件具体的事——不是聊天机器人，也不是看板。"</span></p>
      <p>第一，<strong>感知</strong>：所有相关变量，每十毫秒一次，包括鸡群声音。第二，<strong>预测</strong>：趋势往哪走，最长看到四十八小时。第三，<strong>仲裁</strong>：这一环最容易被低估。能耗体想在峰电时段降低风机转速省钱，健康体如果判断这会把氨气推向福利上限，就会拒绝。</p>
      <div class="script-callout">
        <strong>让自主化可以放心上线的那条规则：</strong>健康体对能耗体拥有绝对否决权。福利高于成本，是设计写死的，不是配置项。这一点才让兽医和审计都能接受自主决策。
      </div>
      <p>第四，<strong>执行</strong>：参数写回 PLC，采购单进 SAP，每一步留痕且可撤销。下面我把共识过程现场放给各位看。</p>
    `
  }
);

// ===========================================================================
// 中文演讲稿 - 第二部分：分工边界、成熟度路径、底层架构
// ===========================================================================

window.SunnerDeck.slides.zh.push(
  // --- 04 -----------------------------------------------------------------
  {
    navLabel: '04. 分工边界',
    layout: 'chart',
    graphic: {
      type: 'layerStack',
      args: [{
        aria: 'AI 决策层向下发送设定值到 GEA 物理层，物理层向上回传遥测数据',
        aiTitle: 'AI 决策层',
        aiSub: '给出哪个设定值、在何时、为什么',
        geaTitle: 'GEA 物理层',
        geaSub: '能力、精度、机械联锁',
        interface: '接口：一个设定值',
        down: '设定值',
        up: '遥测',
        foot: '联锁保留在硬件层，软件无法越过'
      }]
    },
    caption: '每个方向只有一个接口：向下是设定值，向上是遥测。没有其他东西跨越这条边界。',
    notes: [
      { title: 'GEA 保证物理性能', text: '能力曲线、称重精度、卫生级设计，以及机械安全联锁。' },
      { title: 'AI 贡献决策意图', text: '在哪一分钟、对哪一栋舍给出哪个设定值，同时权衡福利、电价与碳排。' },
      { title: '联锁不可触碰', text: '决策层只提出设定值，无法越过任何硬件联锁。' },
      { title: '无需重新认证', text: '正因为接口只是设定值，AI 层可以叠加在已投产装备上。' }
    ],
    topic: 'GEA 的边界在哪里，决策层从哪里开始',
    title: 'GEA 提供执行机构，AI 提供意图',
    subtitle: '职责划分非常清晰：物理层归 GEA，决策层在其之上，两者之间的接口只是一个"设定值"。',
    pill: '一个清晰的接口',
    time: '建议时长：1.5 分钟',
    divider: '驱动',
    before: {
      tag: 'GEA 层 — 物理',
      heading: '装备负责保证的部分',
      items: [
        '通风与热交换能力，具备已知性能曲线',
        '饲喂输送与称重精度',
        '软件无法越过的机械安全联锁',
        '在任何指令设定值下的可预期行为'
      ],
      footnote: '这一层绝不允许被软件"意外"。'
    },
    after: {
      tag: 'AI 层 — 决策',
      heading: '决策层负责贡献的部分',
      items: [
        '在哪一分钟、对哪一栋舍、给出哪一个设定值',
        '福利、电价与碳排在同一次决策中权衡',
        '从人工无法持续盯守的信号中给出早期预警',
        '为每一次动作留下可审计的书面理由'
      ],
      footnote: '它从不绕过联锁，它只提出设定值。'
    },
    demoAction: {
      badge: '现场演示',
      title: '查看 13 层管道，以及 OT 与 IT 之间精确的协议边界。',
      btnText: '打开 2D 架构管道',
      targetNav: 'nav-btn-highway',
      viewMode: '2d',
      nodeId: 'edge'
    },
    script: `
      <p><span class="script-highlight">"我最常被问到的质疑是：你是要让软件来开我的工厂吗？所以我把边界讲清楚。"</span></p>
      <p>GEA 掌管物理层：能力、精度、卫生，尤其是机械联锁。这些联锁永远不允许被软件越过。决策层位于其上，对装备只做一件事：提出一个设定值。</p>
      <div class="script-callout">
        <strong>这个分工在商务上的意义：</strong>它意味着 AI 层可以叠加在已投产的 GEA 装备上，而无需对机械部分重新认证。接口是一个设定值，不是一次重新设计。
      </div>
      <p>2D 管道视图会逐个协议地展示这条边界具体落在哪里。</p>
    `
  },

  // --- 05 -----------------------------------------------------------------
  {
    navLabel: '05. 成熟度路径',
    layout: 'stages',
    topic: '四个阶段，以及圣农当前的位置',
    title: '没有人能一步跨到自主化',
    subtitle: '每个阶段都独立产生价值，并为下一阶段付账。真正的失败模式是试图跳过其中一个。',
    pill: '第四阶段已投产',
    time: '建议时长：2 分钟',
    stages: [
      {
        era: '第一阶段',
        title: '自动化',
        text: 'PLC 与定时器可靠执行，数据仍被锁在车间现场。',
        status: '已完成',
        state: 'is-done'
      },
      {
        era: '第二阶段',
        title: '数字化',
        text: '遥测数据走出鸡舍。边缘网关、云端接入，形成一份可查询的历史底账。',
        status: '已完成',
        state: 'is-done'
      },
      {
        era: '第三阶段',
        title: 'AI 转型',
        text: '模型开始预测与建议，但每一次变更仍需人工审批。',
        status: '已完成',
        state: 'is-done'
      },
      {
        era: '第四阶段',
        title: '自主智能体',
        text: '智能体在硬性福利边界内自行博弈并执行。人负责设定边界并审计结果。',
        status: '当前运行中',
        state: 'is-current'
      }
    ],
    demoAction: {
      badge: '现场演示',
      title: '查看四个阶段与各阶段实测成效的对应关系。',
      btnText: '打开演进矩阵',
      targetNav: 'nav-btn-esg'
    },
    script: `
      <p><span class="script-highlight">"我想把预期讲得诚实一些：没有人能在一个采购周期内，从定时器直接跨到自主化。"</span></p>
      <p>第一阶段是自动化——执行可靠，数据锁在现场。第二阶段把遥测数据从鸡舍取出，形成一份可查询的底账。第三阶段加入预测，但每次变更都要人批。第四阶段，智能体在人设定的边界内自行执行。</p>
      <div class="script-callout">
        <strong>规划上最关键的一点：</strong>每个阶段都能靠自身价值为下一阶段付账。我在行业里看到的失败模式，是还停在第一阶段就想直接买第四阶段——数据底座没有，模型也就没有可信的学习素材。
      </div>
      <p>圣农把四个阶段都走完了。所以我们今天可以把第四阶段现场跑给各位看，而不是只做描述。</p>
    `
  },

  // --- 06 -----------------------------------------------------------------
  {
    navLabel: '06. 底层架构',
    layout: 'cards',
    figure: { type: 'tierStack', args: [['L6  商业智能', 'L5  ERP / SAP', 'L4  MOM / MES', 'L3  SCADA', 'L2  边缘网关', 'L1  PLC', 'L0  传感器']] },
    figureCaption: '第 0 层至第 6 层',
    topic: '底层工程实现',
    title: '从鸡舍地面到董事会的 13 个层级，全部在境内',
    subtitle: '按"光缆被挖断也能撑住"来设计，并无例外地满足《网络安全法》《数据安全法》与《个人信息保护法》的数据本地化要求。',
    pill: '等保 2.0 三级',
    time: '建议时长：2 分钟',
    cards: [
      {
        title: '工业边缘',
        metric: '48 小时缓存',
        text: '德国 Welotec egOS 网关以 10 毫秒周期轮询 Modbus，采用 TLS 1.3 加密。断网时向 NVRAM <strong>缓存 48 小时</strong>，并保持本地控制回路继续运行。台风不会让鸡舍停止通风。'
      },
      {
        title: '境内云',
        metric: '100% 本地化',
        text: '全部遥测与模型均保存在<strong>世纪互联 Azure 中国东部 2</strong>（上海）。无任何个人信息或生产数据出境，以架构而非制度文件满足三法要求。'
      },
      {
        title: '湖仓与本体',
        metric: '25 万行/秒',
        text: 'Snowpipe 流式接入 <strong>Snowflake</strong>，在 <strong>Palantir Foundry</strong> 与 Neo4j 数字孪生中建模——系统清楚哪台风机服务于哪个批次的哪个区域，因此每个决策都能追溯到它触及的具体资产。'
      }
    ],
    demoAction: {
      badge: '现场演示',
      title: '现场切断互联网连接，观察边缘侧依靠本地缓存继续运行。',
      btnText: '模拟断网场景',
      targetNav: 'nav-btn-highway',
      viewMode: '2d',
      action: 'toggleOffline'
    },
    script: `
      <p><span class="script-highlight">"自主化要可信，底下的架构必须足够朴素、足够稳。所以这一页讲工程。"</span></p>
      <p>边缘侧，Welotec 网关以十毫秒周期、TLS 1.3 加密轮询。如果光缆被挖断——在山区站点这是真会发生的——它会向 NVRAM 缓存四十八小时，并且关键在于<strong>保持本地控制回路继续运行</strong>。无论云端是否可达，鸡舍照常通风。</p>
      <div class="script-callout">
        <strong>关于合规：</strong>所有数据都留在世纪互联 Azure 中国东部 2（上海）。三法要求的数据本地化，是由架构保证的，而不是靠一份需要有人记得去执行的制度文件。
      </div>
      <p>下面我现场把连接切断，让各位看缓存接管的过程。</p>
    `
  }
);

// ===========================================================================
// 中文演讲稿 - 第三部分：压力下的自主决策、量化成效、未来展望
// ===========================================================================

window.SunnerDeck.slides.zh.push(
  // --- 07 -----------------------------------------------------------------
  {
    navLabel: '07. 压力实测',
    layout: 'chart',
    graphic: {
      type: 'incidentTimeline',
      args: [{
        aria: '变频器跳闸后氨气攀升，健康智能体在 0.28 秒时否决，随后水平回落',
        limit: '20 ppm 福利上限',
        trip: '变频器跳闸',
        veto: '健康否决，0.28 秒',
        recover: '水平回落'
      }]
    },
    caption: '03 号舍实测氨气曲线，02:14:30 至 02:19。全程无人介入。',
    notes: [
      { title: '02:14:32 — 故障', text: '通风变频器跳闸，风量下降，氨气从 11.4 ppm 开始攀升。' },
      { title: '冲突', text: '正处峰电时段，能耗体正在降频，并提议维持降频。' },
      { title: '+0.28 秒 — 否决', text: '健康体推演出数分钟内将突破底线，<strong>直接否决能耗体</strong>。风机拉满，启动冲洗。' },
      { title: '后续', text: '自动生成检修工单，事故写入台账。此次否决的代价：41 元。' }
    ],
    topic: '一次真实事故的完整复盘',
    title: '凌晨 02:14:32——变频器跳闸，现场无人',
    subtitle: '那一夜，峰电时段通风变频器故障。四个智能体、一次否决、280 毫秒，全程无人介入。',
    pill: '0.28 秒内处置完毕',
    time: '建议时长：2.5 分钟',
    steps: [
      {
        title: '故障',
        text: '03 号舍通风变频器跳闸，风量下降，<strong>氨气开始从 11.4 ppm 攀升</strong>，逼近 20 ppm 福利上限。',
        meta: '02:14:32.000'
      },
      {
        title: '冲突',
        text: '当时正处峰电时段，能耗智能体正在主动降频省钱，并提议维持降频状态。',
        meta: '成本 vs 福利'
      },
      {
        title: '否决',
        text: '健康智能体推演出数分钟内将突破福利底线，<strong>直接否决能耗体</strong>。其余风机拉满至 100%，同时启动垫料排风冲洗。',
        meta: '02:14:32.280'
      },
      {
        title: '后续',
        text: '针对故障变频器自动生成检修工单，事故完整写入不可篡改台账。早班到场时看到的是一份报告，而不是一场危机。',
        meta: '接受的代价：41 元'
      }
    ],
    demoAction: {
      badge: '现场演示',
      title: '从黑匣子逐步复盘这次真实事故的每一个决策。',
      btnText: '复盘 02:14 事故',
      targetNav: 'nav-btn-highway',
      viewMode: '3d',
      scenario: 'ammonia'
    },
    script: `
      <p><span class="script-highlight">"这一页是我如果坐在各位的位置上，最想看到的一页。不是顺利的路径，而是一次故障。"</span></p>
      <p>凌晨两点十四分，03 号舍通风变频器跳闸。风量下降，氨气从十一点四 ppm 开始往二十 ppm 的福利上限爬。舍内没有人。</p>
      <p>接下来是有意思的地方。当时正是峰电时段，能耗智能体正在主动降低风机转速省钱，并且提议继续维持这个降频。</p>
      <div class="script-callout">
        <strong>下一步发生的事，正是这套架构存在的全部理由：</strong>健康智能体推演出数分钟内会突破福利底线，直接否决了能耗体。其余风机拉满，冲洗启动。全程两百八十毫秒。它多花了四十一元峰电电费，保住了整批鸡群。
      </div>
      <p>早班到场时，看到的是一张检修工单和一份事故报告，不是一场危机。下面我从黑匣子复盘，各位可以看到那次否决是怎么落下去的。</p>
    `
  },

  // --- 08 -----------------------------------------------------------------
  {
    navLabel: '08. 量化成效',
    layout: 'metrics',
    topic: '值多少钱，以及每个数字从哪里来',
    title: '同样的装备，被驾驶得更好，放大到集团规模',
    subtitle: '按 50 大基地年化计算。下列每一个数字都能追溯到实测数据流，而不是推算。',
    pill: '年化 EBITDA +6.555 亿元',
    time: '建议时长：2.5 分钟',
    metrics: [
      {
        value: '1.54',
        unit: '料肉比',
        label: '料肉比，由 1.68 降至 1.54',
        bars: { beforePct: 100, afterPct: 92 },
        source: '按批次实测。<strong>累计节约粮食 5,856 吨。</strong>'
      },
      {
        value: '-28.4',
        unit: '%',
        label: '峰电时段用电负荷',
        bars: { beforePct: 100, afterPct: 72 },
        source: '仅在福利余量允许时移峰。<strong>节约 1,485 万元。</strong>'
      },
      {
        value: '18,886',
        unit: '吨 CO₂e',
        label: '经核证的碳减排量',
        bars: { beforePct: 34, afterPct: 100, lowerIsBetter: false },
        source: '范围二电网替代，范围三饲料节约。<strong>ISO 14064-1 核证。</strong>'
      },
      {
        value: '98.8',
        unit: '%',
        label: '动物福利合规评分',
        bars: { beforePct: 88, afterPct: 99, lowerIsBetter: false },
        source: '福利边界内舍时占比，连续审计而非抽样。'
      }
    ],
    caveat: '在此规模下，决策层投资回收期短于 2.5 个月。需要如实说明的前提：以上数字来自圣农已经完成第一至第三阶段建设的集团实况。若某站点仍处于第一阶段，应先投入数据底座建设，收益随后到来。',
    demoAction: {
      badge: '现场演示',
      title: '用您自己的饲料价格、电价与死淘率假设，对这些数字做压力测试。',
      btnText: '打开财务作战室',
      targetNav: 'nav-btn-warroom'
    },
    script: `
      <p><span class="script-highlight">"下面讲数字。我会说明每一个数字从哪里来，因为没有出处的指标只是营销。"</span></p>
      <p>料肉比从一点六八降到一点五四。这是按批次实测投料量对出栏活重算出来的，不是模型输出。折算下来是五千八百多吨粮食没有被消耗掉。</p>
      <p>峰电负荷下降二十八个百分点，而且<em>仅</em>在福利余量允许的情况下移峰。接近一千五百万元。碳减排一万八千多吨，范围二与范围三均已通过 ISO 14064-1 核证。</p>
      <div class="script-callout">
        <strong>我想留在记录里的前提说明：</strong>这些数字来自圣农的集团实况，而圣农已经完成了第一到第三阶段的建设。如果贵方站点还在第一阶段，应当预期先投数据底座、收益随后到来。任何人拿第四阶段的数字向还在第一阶段的资产承诺回报，那是在推销。
      </div>
      <p>财务作战室可以让各位自己推动饲料价格、电价和死淘率假设，实时看 EBITDA 的变化。</p>
    `
  },

  // --- 09 -----------------------------------------------------------------
  {
    navLabel: '09. 未来展望',
    layout: 'roadmap',
    topic: '下一步走向哪里',
    title: '从一栋自主鸡舍，到一张自我优化的生产网络',
    subtitle: '这个等式并不止步于鸡舍。每一个阶段都在拓宽决策层可以推理的范围。',
    pill: 'GEA + AI = 未来',
    time: '建议时长：2 分钟',
    horizons: [
      {
        when: '当前',
        title: '自主鸡舍',
        items: [
          '在福利边界内闭环控制环境与饲喂',
          '按实测料塔重量自动补料',
          '连续的福利与碳排审计留痕',
          '已在圣农集团全面运行'
        ]
      },
      {
        when: '未来 12 个月',
        title: '自主场区',
        items: [
          '各栋舍协同调度，而非各自孤立寻优',
          '面向电网峰谷曲线的场区级负荷整形',
          '基于执行机构工作循环的预测性维护',
          '以实时生长预测驱动屠宰加工排程'
        ]
      },
      {
        when: '远期',
        title: '自我优化网络',
        items: [
          '集团级学习：每一栋舍都从全部舍的经验中改进',
          '从孵化到加工，作为一个系统统一规划',
          '碳排与福利成为实时约束，而非年度报告',
          'GEA 装备出厂即预集成决策层'
        ]
      }
    ],
    closing: '装备决定天花板，决策层决定你离它有多近。<strong>GEA + AI = 未来。</strong>',
    demoAction: {
      badge: '现场演示',
      title: '用自然语言向系统提问，观察它基于实时生产数据进行推理。',
      btnText: '打开 AI 智能副驾',
      action: 'openCopilot'
    },
    script: `
      <p><span class="script-highlight">"最后我回到开头，因为这个等式可以放大到鸡舍之外。"</span></p>
      <p>今天是自主鸡舍：在福利边界内闭环控制环境与饲喂，已在圣农全面运行。未来十二个月是自主场区——各栋舍协同而非各自寻优，负荷面向电网曲线整形，维护由执行机构工作循环预测，屠宰排程由实时生长预测驱动。</p>
      <div class="script-callout">
        <strong>值得双方共同建设的远期目标：</strong>一张自我优化的网络——每栋舍都从全部舍的经验中学习，从孵化到加工统一规划，碳排与福利成为实时约束而非年度报告。以及，GEA 装备出厂即预集成决策层。
      </div>
      <p>装备决定天花板，决策层决定你离它有多近。<strong>GEA 加 AI，等于未来。</strong>各位可以随意向智能副驾提问——它是在实时生产数据上推理，不是念稿。"</p>
    `
  }
);

// ===========================================================================
// GRAPHICS - inline SVG, no external assets
// ---------------------------------------------------------------------------
// Every graphic is pure SVG with a viewBox so it scales cleanly from a laptop
// to a projector, and uses the existing theme colours. Decorative wrappers are
// aria-hidden; anything carrying information gets a role and a label.
// ===========================================================================

(function (Deck) {
  'use strict';

  const C = {
    cyan: '#38bdf8',
    green: '#10b981',
    amber: '#f59e0b',
    danger: '#f43f5e',
    dim: 'rgba(255,255,255,0.28)',
    faint: 'rgba(255,255,255,0.12)',
    text: 'rgba(255,255,255,0.62)'
  };

  /** NH₃ over 24 h: manual control saws across the limit, autonomous holds under. */
  function ammoniaTimeline(labels) {
    const l = labels || {};
    // Manual: repeated climb-and-purge, breaching the limit twice.
    const manual = 'M0,74 L26,38 L38,60 L64,22 L76,52 L104,16 L116,46 L146,26 L158,56 L186,30 L200,58';
    // Autonomous: small ripple well below the limit line.
    const auto = 'M0,78 L28,72 L52,76 L78,70 L104,75 L130,69 L156,74 L182,71 L200,74';
    return `
      <svg class="deck-svg" viewBox="0 0 200 104" preserveAspectRatio="none"
           role="img" aria-label="${l.aria || 'Ammonia over 24 hours: manual control repeatedly breaches the limit, autonomous control stays below it'}">
        <defs>
          <linearGradient id="nh3-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${C.green}" stop-opacity="0.22"/>
            <stop offset="100%" stop-color="${C.green}" stop-opacity="0"/>
          </linearGradient>
        </defs>

        <!-- welfare limit -->
        <line x1="0" y1="28" x2="200" y2="28" stroke="${C.danger}" stroke-width="0.8" stroke-dasharray="3 2"/>
        <text x="1" y="24" fill="${C.danger}" font-size="6">${l.limit || '20 ppm welfare limit'}</text>

        <!-- baseline -->
        <line x1="0" y1="92" x2="200" y2="92" stroke="${C.faint}" stroke-width="0.8"/>

        <path d="${auto} L200,92 L0,92 Z" fill="url(#nh3-fill)"/>
        <path d="${manual}" fill="none" stroke="${C.amber}" stroke-width="1.4" stroke-linejoin="round"/>
        <path d="${auto}" fill="none" stroke="${C.green}" stroke-width="1.6" stroke-linejoin="round"/>

        <!-- breach markers -->
        <circle cx="64" cy="22" r="2.4" fill="${C.danger}"/>
        <circle cx="104" cy="16" r="2.4" fill="${C.danger}"/>

        <text x="1" y="101" fill="${C.text}" font-size="5.5">00:00</text>
        <text x="176" y="101" fill="${C.text}" font-size="5.5">24:00</text>
      </svg>
      <div class="deck-svg-legend">
        <span><i style="background:${C.amber}"></i>${l.manual || 'Manual, per shift'}</span>
        <span><i style="background:${C.green}"></i>${l.auto || 'Autonomous, continuous'}</span>
        <span><i style="background:${C.danger}"></i>${l.breach || 'Limit breached'}</span>
      </div>
    `;
  }

  /** The four-step control loop, drawn as an actual closed cycle. */
  function controlLoop(steps, centre) {
    const items = steps || [];
    const pos = [{ x: 100, y: 16 }, { x: 168, y: 60 }, { x: 100, y: 104 }, { x: 32, y: 60 }];
    return `
      <svg class="deck-svg" viewBox="0 0 200 120" role="img" aria-label="${(centre && centre.aria) || 'Closed control loop: sense, predict, arbitrate, act'}">
        <defs>
          <marker id="loop-arrow" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="${C.cyan}"/>
          </marker>
        </defs>

        <!-- cycle path, four arcs so each leg carries an arrowhead -->
        <g fill="none" stroke="${C.cyan}" stroke-width="1.1" stroke-opacity="0.75" marker-end="url(#loop-arrow)">
          <path d="M118,22 A56,42 0 0 1 160,46"/>
          <path d="M162,76 A56,42 0 0 1 120,99"/>
          <path d="M80,99 A56,42 0 0 1 39,76"/>
          <path d="M38,45 A56,42 0 0 1 80,22"/>
        </g>

        <circle cx="100" cy="60" r="21" fill="rgba(3,3,139,0.55)" stroke="${C.faint}"/>
        <text x="100" y="58" text-anchor="middle" fill="#fff" font-size="9" font-weight="700">${(centre && centre.value) || '< 350'}</text>
        <text x="100" y="67" text-anchor="middle" fill="${C.text}" font-size="5.5">${(centre && centre.unit) || 'ms'}</text>

        ${items.slice(0, 4).map((s, i) => `
          <g>
            <circle cx="${pos[i].x}" cy="${pos[i].y}" r="12" fill="rgba(3,3,139,0.8)" stroke="${C.cyan}" stroke-width="1"/>
            <text x="${pos[i].x}" y="${pos[i].y + 3}" text-anchor="middle" fill="${C.cyan}" font-size="8" font-weight="700">${i + 1}</text>
            <text x="${pos[i].x}" y="${pos[i].y + (i === 2 ? 26 : (i === 0 ? -16 : 0))}"
                  text-anchor="middle" fill="#fff" font-size="7.5" font-weight="600"
                  transform="${i === 1 ? 'translate(-30,20)' : (i === 3 ? 'translate(30,20)' : '')}">${s}</text>
          </g>
        `).join('')}
      </svg>
    `;
  }

  /** GEA physical layer, the setpoint interface, and the AI decision layer. */
  function layerStack(labels) {
    const l = labels || {};
    const band = (y, h, fill, stroke, title, sub, titleColor) => `
      <rect x="10" y="${y}" width="180" height="${h}" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="0.9"/>
      <text x="20" y="${y + 13}" fill="${titleColor || '#fff'}" font-size="8.5" font-weight="700">${title}</text>
      ${sub ? `<text x="20" y="${y + 23}" fill="${C.text}" font-size="6">${sub}</text>` : ''}
    `;
    return `
      <svg class="deck-svg" viewBox="0 0 200 124" role="img" aria-label="${l.aria || 'The AI decision layer proposes setpoints down to the GEA physical layer, which reports telemetry back up'}">
        ${band(6, 30, 'rgba(3,3,139,0.55)', C.cyan, l.aiTitle || 'AI decision layer', l.aiSub || 'Which setpoint, when, and why', C.cyan)}
        ${band(88, 30, 'rgba(2,2,45,0.75)', C.dim, l.geaTitle || 'GEA physical layer', l.geaSub || 'Capacity, accuracy, interlocks')}

        <!-- the interface between them -->
        <rect x="10" y="50" width="180" height="24" rx="4" fill="none" stroke="${C.faint}" stroke-dasharray="3 2"/>
        <text x="100" y="65" text-anchor="middle" fill="#fff" font-size="7.5" font-weight="600">${l.interface || 'Interface: a setpoint'}</text>

        <!-- down: command, up: telemetry -->
        <g stroke="${C.cyan}" stroke-width="1.1" fill="none">
          <path d="M58,38 L58,48" marker-end="url(#stack-down)"/>
        </g>
        <g stroke="${C.green}" stroke-width="1.1" fill="none">
          <path d="M142,86 L142,76" marker-end="url(#stack-up)"/>
        </g>
        <defs>
          <marker id="stack-down" viewBox="0 0 6 6" refX="3" refY="4" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M0,0 L6,0 L3,6 Z" fill="${C.cyan}"/>
          </marker>
          <marker id="stack-up" viewBox="0 0 6 6" refX="3" refY="2" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M3,0 L6,6 L0,6 Z" fill="${C.green}"/>
          </marker>
        </defs>
        <text x="62" y="46" fill="${C.cyan}" font-size="5.5">${l.down || 'setpoint'}</text>
        <text x="106" y="84" fill="${C.green}" font-size="5.5" text-anchor="start">${l.up || 'telemetry'}</text>

        <text x="100" y="122" text-anchor="middle" fill="${C.text}" font-size="6">${l.foot || 'Interlocks stay in hardware and cannot be overridden'}</text>
      </svg>
    `;
  }

  /** The 02:14 incident: ammonia climbing, the veto, and recovery. */
  function incidentTimeline(l) {
    const lab = l || {};
    return `
      <svg class="deck-svg" viewBox="0 0 200 108" role="img" aria-label="${lab.aria || 'Ammonia climbs after an inverter trip, the health agent vetoes at 0.28 seconds, and levels recover'}">
        <line x1="0" y1="30" x2="200" y2="30" stroke="${C.danger}" stroke-width="0.8" stroke-dasharray="3 2"/>
        <text x="1" y="26" fill="${C.danger}" font-size="6">${lab.limit || '20 ppm welfare limit'}</text>
        <line x1="0" y1="94" x2="200" y2="94" stroke="${C.faint}" stroke-width="0.8"/>

        <!-- steady, then the trip, then the climb, veto, and recovery -->
        <path d="M0,80 L46,79" fill="none" stroke="${C.green}" stroke-width="1.6"/>
        <path d="M46,79 L92,44" fill="none" stroke="${C.danger}" stroke-width="1.6"/>
        <path d="M92,44 L120,52 L160,72 L200,78" fill="none" stroke="${C.green}" stroke-width="1.6"/>

        <!-- trip marker -->
        <line x1="46" y1="30" x2="46" y2="94" stroke="${C.amber}" stroke-width="0.7" stroke-dasharray="2 2"/>
        <circle cx="46" cy="79" r="2.4" fill="${C.amber}"/>
        <text x="49" y="90" fill="${C.amber}" font-size="6">${lab.trip || 'inverter trips'}</text>

        <!-- veto marker -->
        <line x1="92" y1="30" x2="92" y2="94" stroke="${C.cyan}" stroke-width="0.7" stroke-dasharray="2 2"/>
        <circle cx="92" cy="44" r="3" fill="${C.cyan}"/>
        <text x="95" y="42" fill="${C.cyan}" font-size="6.5" font-weight="700">${lab.veto || 'health veto, 0.28 s'}</text>

        <text x="150" y="90" fill="${C.green}" font-size="6">${lab.recover || 'levels recover'}</text>
        <text x="1" y="104" fill="${C.text}" font-size="5.5">02:14:30</text>
        <text x="172" y="104" fill="${C.text}" font-size="5.5">02:19</text>
      </svg>
    `;
  }

  /** Before/after bar pair, used beside each headline metric. */
  function miniBars(opts) {
    const o = opts || {};
    const before = Math.max(2, Math.min(100, Number(o.beforePct) || 100));
    const after = Math.max(2, Math.min(100, Number(o.afterPct) || 60));
    const better = o.lowerIsBetter !== false;
    return `
      <svg class="deck-svg deck-svg-bars" viewBox="0 0 100 26" preserveAspectRatio="none" aria-hidden="true">
        <rect x="0" y="3" width="${before}" height="7" rx="1.5" fill="${C.dim}"/>
        <rect x="0" y="15" width="${after}" height="7" rx="1.5" fill="${better ? C.green : C.cyan}"/>
      </svg>
    `;
  }

  /** Expanding scope: house, then site, then network. */
  function scopeRings(index, label) {
    const active = Number(index) || 0;
    const rings = [14, 24, 34];
    return `
      <svg class="deck-svg deck-svg-rings" viewBox="0 0 80 80" role="img" aria-label="${label || 'Scope of optimisation'}">
        ${rings.map((r, i) => `
          <circle cx="40" cy="40" r="${r}"
                  fill="${i === active ? 'rgba(56,189,248,0.12)' : 'none'}"
                  stroke="${i <= active ? C.cyan : C.faint}"
                  stroke-width="${i === active ? 1.6 : 0.9}"
                  ${i > active ? 'stroke-dasharray="3 3"' : ''}/>
        `).join('')}
        <circle cx="40" cy="40" r="4" fill="${C.cyan}"/>
      </svg>
    `;
  }

  /** Capability rising across the four maturity stages. */
  function capabilityCurve() {
    return `
      <svg class="deck-svg deck-svg-curve" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="cap-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${C.cyan}" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="${C.cyan}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="M0,37 C50,35 90,28 120,20 C150,12 175,6 200,3 L200,40 L0,40 Z" fill="url(#cap-fill)"/>
        <path d="M0,37 C50,35 90,28 120,20 C150,12 175,6 200,3" fill="none" stroke="${C.cyan}" stroke-width="1.2" stroke-opacity="0.8"/>
      </svg>
    `;
  }

  /** Level 0 to Level 6 as a compact stack, for the architecture slide. */
  function tierStack(labels) {
    const rows = labels || ['L6 BI', 'L5 ERP', 'L4 MOM', 'L3 SCADA', 'L2 Edge', 'L1 PLC', 'L0 Sensors'];
    const h = 11;
    return `
      <svg class="deck-svg deck-svg-tiers" viewBox="0 0 120 ${rows.length * (h + 2)}" role="img" aria-label="Thirteen tiers from field sensors to business intelligence">
        ${rows.map((r, i) => {
          const y = i * (h + 2);
          const isEdge = /edge/i.test(r);
          return `
            <rect x="0" y="${y}" width="120" height="${h}" rx="2"
                  fill="${isEdge ? 'rgba(56,189,248,0.18)' : 'rgba(3,3,139,0.4)'}"
                  stroke="${isEdge ? C.cyan : C.faint}" stroke-width="0.7"/>
            <text x="5" y="${y + 7.6}" fill="${isEdge ? C.cyan : 'rgba(255,255,255,0.75)'}" font-size="6">${r}</text>
          `;
        }).join('')}
      </svg>
    `;
  }

  Deck.graphics = {
    ammoniaTimeline,
    controlLoop,
    layerStack,
    incidentTimeline,
    miniBars,
    scopeRings,
    capabilityCurve,
    tierStack
  };
})(window.SunnerDeck);
