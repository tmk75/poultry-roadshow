/**
 * GEA x GEA - Keynote Deck: content and layout renderer
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

window.KeynoteDeck = {
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
        ${s.graphic ? `<div class="statement-figure">${resolveGraphic(s.graphic)}</div>` : ''}
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

  /** Three fused pillars: PHYSICAL x DIGIT x (AI). The thesis slide. */
  function pillars(s) {
    return `
      ${s.graphic ? `<div class="pillars-figure">${resolveGraphic(s.graphic)}</div>` : ''}
      <div class="slide-pillars">
        ${s.pillars.map((p, i) => `
          ${i > 0 ? '<span class="pillar-join" aria-hidden="true">×</span>' : ''}
          <div class="pillar ${p.accent ? 'accent' : ''}">
            <span class="pillar-tag">${esc(p.tag)}</span>
            <p class="pillar-text">${p.text}</p>
          </div>
        `).join('')}
      </div>
      ${s.fusion ? `<p class="pillars-fusion">${s.fusion}</p>` : ''}
    `;
  }

  /** Stacked capability layers, read top-down. The Digit(AI) stack slide. */
  function stack(s) {
    return `
      <div class="slide-stack">
        ${s.layers.map(l => `
          <div class="stack-row ${l.star ? 'is-star' : ''}">
            <div class="stack-row-head">
              <span class="stack-row-tag">${esc(l.tag)}</span>
              ${l.star ? `<span class="stack-star">${esc(l.star)}</span>` : ''}
            </div>
            <p class="stack-row-text">${l.text}</p>
          </div>
        `).join('')}
      </div>
      ${s.footnote ? `<p class="stack-footnote">${s.footnote}</p>` : ''}
    `;
  }

  /** Titled columns of short bullets. Impact vectors, and similar. */
  function columns(s) {
    return `
      <div class="slide-columns" style="--col-count:${(s.columns || []).length}">
        ${s.columns.map(c => `
          <div class="col-block ${c.accent ? 'accent' : ''}">
            <span class="col-tag">${esc(c.tag)}</span>
            ${c.lead ? `<p class="col-lead">${c.lead}</p>` : ''}
            <ul class="col-list">
              ${c.items.map(i => `<li>${i}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
      ${s.footnote ? `<p class="columns-footnote">${s.footnote}</p>` : ''}
    `;
  }

  const LAYOUTS = { statement, contrast, flow, stages, cards, metrics, roadmap, chart, pillars, stack, columns, image };

  /**
   * Builds the full slide stage markup: header, layout body, optional demo
   * banner. `index` is only used for the demo trigger's onclick binding.
   */
  /**
   * A slide exported from the source .pptx. Rendered edge to edge with no
   * header or footer chrome, because the slide already carries its own title,
   * strap line and page number.
   */
  function image(s) {
    // width/height hints let the browser reserve layout before decode, and
    // decoding="async" keeps the decode off the main thread. The bitmap is
    // already resident from preloadFrameImages(), so this paints immediately.
    const dims = (Deck.frame && Deck.frame.width && Deck.frame.height)
      ? ` width="${Deck.frame.width}" height="${Deck.frame.height}"` : '';
    return `
      <div class="slide-image-frame">
        <img class="slide-image" src="${esc(s.image)}" alt="${esc(s.alt || '')}"
             decoding="async" fetchpriority="high" draggable="false"${dims}>
      </div>
    `;
  }

  Deck.renderStage = function (slide, index) {
    if (!slide) return '';

    // Exported slides bypass the header/footer chrome entirely.
    if (slide.layout === 'image') {
      return `
        ${image(slide)}
        ${slide.demoAction ? `
          <div class="slide-live-demo-banner is-under-image">
            <div class="demo-banner-left">
              <span class="demo-banner-badge">${esc(slide.demoAction.badge || 'LIVE DEMO')}</span>
              <span class="demo-banner-title">${esc(slide.demoAction.title || '')}</span>
            </div>
            <button class="btn-launch-live-demo" id="btn-slide-demo-trigger"
                    onclick="executeSlideDemo(${Number(index) || 0})">
              ${esc(slide.demoAction.btnText)}
            </button>
          </div>
        ` : ''}
      `;
    }

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

      ${Deck.footer ? `<div class="slide-footer-rule">${esc(Deck.footer)}</div>` : ''}

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
})(window.KeynoteDeck);

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

  /** PHYSICAL x DIGIT x (AI) fusing into one operating layer. */
  function fusionDiagram(labels) {
    const l = labels || {};
    const ring = (cx, fill, stroke, tag) => `
      <circle cx="${cx}" cy="42" r="30" fill="${fill}" stroke="${stroke}" stroke-width="1.1"/>
      <text x="${cx}" y="45" text-anchor="middle" fill="#fff" font-size="8" font-weight="700">${tag}</text>
    `;
    return `
      <svg class="deck-svg" viewBox="0 0 200 96" role="img"
           aria-label="${l.aria || 'Physical, digital and AI overlapping to form one intelligent operating layer'}">
        <g opacity="0.92">
          ${ring(56, 'rgba(56,189,248,0.14)', C.dim, l.physical || 'PHYSICAL')}
          ${ring(100, 'rgba(56,189,248,0.2)', C.cyan, l.digit || 'DIGIT')}
          ${ring(144, 'rgba(16,185,129,0.2)', C.green, l.ai || '(AI)')}
        </g>
        <text x="100" y="88" text-anchor="middle" fill="${C.text}" font-size="6.5">
          ${l.caption || 'One intelligent operating layer'}
        </text>
      </svg>
    `;
  }

  /** Build in China, then export the architecture globally. */
  function chinaGlobal(labels) {
    const l = labels || {};
    return `
      <svg class="deck-svg" viewBox="0 0 200 84" role="img"
           aria-label="${l.aria || 'Build and prove in China, then export the architecture, agents and playbooks globally'}">
        <defs>
          <marker id="cg-arrow" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="4.5" markerHeight="4.5" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="${C.cyan}"/>
          </marker>
        </defs>

        <rect x="8" y="20" width="66" height="40" rx="5" fill="rgba(56,189,248,0.18)" stroke="${C.cyan}" stroke-width="1.1"/>
        <text x="41" y="38" text-anchor="middle" fill="#fff" font-size="8" font-weight="700">${l.china || 'CHINA'}</text>
        <text x="41" y="48" text-anchor="middle" fill="${C.text}" font-size="5.5">${l.chinaSub || 'build & prove'}</text>

        <rect x="126" y="20" width="66" height="40" rx="5" fill="rgba(3,3,139,0.5)" stroke="${C.dim}" stroke-width="1.1" stroke-dasharray="4 2"/>
        <text x="159" y="38" text-anchor="middle" fill="#fff" font-size="8" font-weight="700">${l.global || 'GLOBAL'}</text>
        <text x="159" y="48" text-anchor="middle" fill="${C.text}" font-size="5.5">${l.globalSub || 'export the system'}</text>

        <line x1="78" y1="34" x2="120" y2="34" stroke="${C.cyan}" stroke-width="1.3" marker-end="url(#cg-arrow)"/>
        <text x="99" y="30" text-anchor="middle" fill="${C.cyan}" font-size="5.5">${l.exportLbl || 'agents, playbooks'}</text>

        <line x1="120" y1="48" x2="80" y2="48" stroke="${C.faint}" stroke-width="1" stroke-dasharray="3 2"/>
        <text x="100" y="58" text-anchor="middle" fill="${C.text}" font-size="5.5">${l.stays || 'data stays local'}</text>

        <text x="100" y="76" text-anchor="middle" fill="${C.text}" font-size="6">${l.foot || 'Data gravity respected. Intelligence and architecture scale.'}</text>
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
    tierStack,
    fusionDiagram,
    chinaGlobal
  };
})(window.KeynoteDeck);

// The strap line that appears on every slide of the source deck.
window.KeynoteDeck.footer = 'GEA × Digit(AI) · IN CHINA FOR CHINA · CHINA → GLOBAL';

// ===========================================================================
// ENGLISH - Act I: the thesis, why it matters, the stack, China
// Narrative and terminology follow the GEA + Digit(AI) = THE FUTURE deck.
// ===========================================================================

window.KeynoteDeck.slides.en.push(
  // --- 01 -----------------------------------------------------------------
  {
    navLabel: '01. The Future',
    layout: 'statement',
    topic: 'THE PROPOSITION',
    title: 'GEA + Digit(AI) = The Future',
    subtitle: 'Digital and AI fused into one operating system for the process industry. In China, for China, with global reach.',
    pill: 'IN CHINA · FOR CHINA · CHINA → GLOBAL',
    time: 'Target time: 1.5 min',
    equation: {
      aria: 'GEA plus Digit AI equals the future',
      operators: ['+', '='],
      terms: [
        { main: 'GEA', sub: 'Machines, process plants, real-world impact' },
        { main: 'Digit(AI)', sub: 'Platforms and intelligence fused into one layer', accent: true },
        { main: 'The Future', sub: 'A new operating system for industry' }
      ]
    },
    lead: 'Not two programmes running in parallel. <strong>One operating layer</strong> — and AI is the prime example of something built in China that scales to the world.',
    points: [
      'The process industry is the foundation of civilization: food, pharma, energy, materials.',
      'China is the proving ground: highest complexity, highest volume, fastest learning loops.',
      'The lighthouse is a 50-complex operation — 600M broilers a year, running autonomously today.'
    ],
    demoAction: {
      badge: 'LIVE DEMO',
      title: 'See the operating layer running live across 50 complexes.',
      btnText: 'Open the 3D data highway',
      targetNav: 'nav-btn-highway',
      viewMode: '3d',
      scenario: 'closedloop'
    },
    script: `
      <p><span class="script-highlight">"GEA plus Digit(AI) equals the future. I want to be precise about what that means, because it is not a slogan."</span></p>
      <p>The process industry is the foundation of civilization — food, pharma, energy, materials. GEA builds the machines that industry runs on. Digit(AI) is what decides how those machines are used.</p>
      <div class="script-callout">
        <strong>The claim:</strong> this is not two programmes running in parallel. It is a single operating layer. And AI is the prime example of a system built in China that scales to the world.
      </div>
      <p>Everything I show you after this is running today in production: fifty complexes, six hundred million broilers a year. Not a pilot.</p>
    `
  },

  // --- 02 -----------------------------------------------------------------
  {
    navLabel: '02. The Thesis',
    layout: 'pillars',
    topic: 'THE THESIS',
    title: 'Digit(AI) is not digital plus AI',
    subtitle: 'It is the fusion of digital platforms and artificial intelligence into a single intelligent operating layer.',
    pill: 'FUSION, NOT ADDITION',
    time: 'Target time: 2 min',
    graphic: {
      type: 'fusionDiagram',
      args: [{
        aria: 'Physical, Digit and AI overlapping to form one intelligent operating layer',
        physical: 'PHYSICAL',
        digit: 'DIGIT',
        ai: '(AI)',
        caption: 'Overlapping, not stacked — one intelligent operating layer'
      }]
    },
    pillars: [
      { tag: 'PHYSICAL', text: 'GEA machines, process plants, and real-world impact. The layer that sets the physical ceiling.' },
      { tag: 'DIGIT', text: 'Platforms, data, edge and cloud, secure connectivity. The layer that makes the plant legible.', accent: true },
      { tag: '(AI)', text: 'Agents, models, optimization, autonomous control. The layer that decides and acts.', accent: true }
    ],
    fusion: 'Multiplied, not added. Remove any one and the other two stop compounding — which is why digital transformation programmes that bolt AI on at the end stall.',
    demoAction: {
      badge: 'LIVE DEMO',
      title: 'Watch four agents negotiate a live decision and write it back to the plant floor.',
      btnText: 'Open the agent consensus stream',
      targetNav: 'nav-btn-highway',
      viewMode: '3d',
      scenario: 'closedloop'
    },
    script: `
      <p><span class="script-highlight">"Digit(AI) is not digital plus AI. It is the fusion of the two into a single intelligent operating layer."</span></p>
      <p>Three layers. <strong>Physical</strong>: GEA machines and process plants — real-world impact, and the ceiling on what is physically achievable. <strong>Digit</strong>: platforms, data, edge and cloud, secure connectivity — the layer that makes the plant legible. <strong>(AI)</strong>: agents, models, optimization, autonomous control — the layer that decides and acts.</p>
      <div class="script-callout">
        <strong>Why the distinction matters commercially:</strong> these multiply, they do not add. Remove any one and the other two stop compounding. That is exactly why digital transformation programmes that treat AI as a phase-three bolt-on stall at dashboards.
      </div>
      <p>Let me show you the (AI) layer actually negotiating a decision.</p>
    `
  },

  // --- 03 -----------------------------------------------------------------
  {
    navLabel: '03. Why It Matters',
    layout: 'metrics',
    topic: 'WHY THIS MATTERS',
    title: 'A new operating system for industry, not an incremental gain',
    subtitle: 'The process industry is the foundation of civilization. Food. Pharma. Energy. Materials. This is what changes when the operating layer is intelligent.',
    pill: 'BUILT WHERE IT SCALES FASTEST',
    time: 'Target time: 2 min',
    metrics: [
      {
        value: '10x',
        unit: '',
        label: 'Faster decision cycles',
        bars: { beforePct: 10, afterPct: 100, lowerIsBetter: false },
        source: 'Loops close in <strong>under 350 ms</strong>, not at the next shift handover.'
      },
      {
        value: '30',
        unit: '%+',
        label: 'OEE uplift in lighthouse plants',
        bars: { beforePct: 70, afterPct: 100, lowerIsBetter: false },
        source: 'Availability, performance and quality, measured continuously.'
      },
      {
        value: 'Zero',
        unit: '',
        label: 'Unplanned downtime as the target',
        bars: { beforePct: 100, afterPct: 12 },
        source: 'Predicted from actuator duty cycles before failure, not after.'
      },
      {
        value: '∞',
        unit: '',
        label: 'Learning loops across the fleet',
        bars: { beforePct: 20, afterPct: 100, lowerIsBetter: false },
        source: 'Every plant improves from every other plant. This is the compounding term.'
      }
    ],
    caveat: 'The fourth number is the one that matters strategically. The first three are per-plant gains and any vendor can quote them. Fleet learning loops are the only term that compounds — and they need scale and complexity to work, which is what makes China the proving ground.',
    demoAction: {
      badge: 'LIVE DEMO',
      title: 'Stress-test the economics against feed price, tariff and mortality assumptions.',
      btnText: 'Open the CFO war room',
      targetNav: 'nav-btn-warroom'
    },
    script: `
      <p><span class="script-highlight">"Digit(AI) is not incremental improvement. It is a new operating system for industry — built where it scales fastest."</span></p>
      <p>Ten times faster decision cycles: loops closing in under three hundred and fifty milliseconds rather than at the next shift handover. Thirty percent-plus OEE uplift in lighthouse plants. Zero unplanned downtime as the target, not the aspiration.</p>
      <div class="script-callout">
        <strong>The fourth number is the strategic one:</strong> infinite learning loops across the fleet. The first three are per-plant gains and any vendor can quote them. Fleet learning is the only term that <em>compounds</em> — and it needs scale and complexity to work. That is precisely why China is the proving ground rather than a rollout region.
      </div>
      <p>The war room lets you push the assumptions yourself.</p>
    `
  },

  // --- 04 -----------------------------------------------------------------
  {
    navLabel: '04. The Stack',
    layout: 'stack',
    topic: 'THE Digit(AI) STACK',
    title: 'From atom to algorithm, China-ready by design',
    subtitle: 'Four layers. Compliance is designed into the architecture rather than added as a policy document.',
    pill: 'CHINA-READY BY DESIGN',
    time: 'Target time: 2 min',
    layers: [
      {
        tag: 'HUMAN + MACHINE',
        text: 'Augmented operators · Decision support · Zero-friction collaboration · Local language and process fluency'
      },
      {
        tag: 'AI & AGENTS',
        star: 'PRIME EXAMPLE',
        text: 'Process optimization · Predictive control · Executive companions · <strong>Built in China, designed for global scale</strong>'
      },
      {
        tag: 'DATA & CLOUD',
        text: 'Unified data fabric · Azure China / multi-cloud · Digital twins · Data residency and PIPL alignment'
      },
      {
        tag: 'EDGE & IIoT',
        text: 'Secure remote access · Real-time sensors · Gateways · Local intelligence · China-compliant OT paths'
      }
    ],
    footnote: 'In production this is Welotec edge gateways polling Modbus every 10 ms with a 48-hour local buffer, streaming into Snowflake and Foundry inside 21Vianet Azure China East 2, with agents closing the loop back to the PLCs.',
    demoAction: {
      badge: 'LIVE DEMO',
      title: 'Inspect all 13 tiers and the protocol boundary between OT and IT.',
      btnText: 'Open the 2D architecture pipeline',
      targetNav: 'nav-btn-highway',
      viewMode: '2d',
      nodeId: 'edge'
    },
    script: `
      <p><span class="script-highlight">"From atom to algorithm — and China-ready by design, which is a different claim from China-compatible."</span></p>
      <p>Bottom layer, <strong>edge and IIoT</strong>: secure remote access, real-time sensors, gateways, local intelligence, China-compliant OT paths. Above it, <strong>data and cloud</strong>: a unified data fabric on Azure China, digital twins, data residency and PIPL alignment. Then <strong>AI and agents</strong> — the prime example layer: process optimization, predictive control, executive companions, built in China and designed for global scale. On top, <strong>human plus machine</strong>: augmented operators with local language and process fluency.</p>
      <div class="script-callout">
        <strong>Concretely, in production:</strong> Welotec gateways polling Modbus every ten milliseconds with a forty-eight hour local buffer, streaming into Snowflake and Foundry inside 21Vianet Azure China East 2, with agents closing the loop back to the PLCs.
      </div>
      <p>Let me open the pipeline so you can see every tier and every protocol.</p>
    `
  }
);

// ===========================================================================
// ENGLISH - Act II: China as proving ground, and the lighthouse proof
// ===========================================================================

window.KeynoteDeck.slides.en.push(
  // --- 05 -----------------------------------------------------------------
  {
    navLabel: '05. In China',
    layout: 'contrast',
    topic: 'IN CHINA, FOR CHINA',
    title: 'Digit(AI) accelerates when it is local by design',
    subtitle: 'Local architecture, local speed, local talent, local value capture — and the architecture still exports.',
    pill: 'AI = CHINA → GLOBAL PROOF',
    time: 'Target time: 2.5 min',
    divider: 'enables',
    before: {
      tag: 'WHAT LOCAL BY DESIGN MEANS',
      heading: 'Built here, not adapted here',
      items: [
        '<strong>Local architecture:</strong> cloud, edge and AI meeting CSL, DSL and PIPL from day one',
        '<strong>Local speed:</strong> decision loops measured in days, not quarters',
        '<strong>Local talent:</strong> the China digital unit owns execution and ecosystem',
        '<strong>Local value:</strong> solutions built for Chinese customers and plants first'
      ],
      footnote: 'Compliance as architecture, not as a policy someone has to remember.'
    },
    after: {
      tag: 'WHY IT EXPORTS',
      heading: 'China → Global proof',
      items: [
        '<strong>Build and prove here:</strong> highest complexity and volume give the strongest learning loops',
        '<strong>Then export the system:</strong> models, agents and playbooks become global templates',
        '<strong>Data gravity respected:</strong> local data stays local; intelligence and architecture scale',
        '<strong>Strategic autonomy:</strong> one architecture that works under any regime'
      ],
      footnote: 'The asset that crosses the border is the architecture, never the data.'
    },
    demoAction: {
      badge: 'LIVE DEMO',
      title: 'Cut the connection and watch the edge keep running on its local buffer.',
      btnText: 'Simulate a network outage',
      targetNav: 'nav-btn-highway',
      viewMode: '2d',
      action: 'toggleOffline'
    },
    script: `
      <p><span class="script-highlight">"Digit(AI) accelerates when it is local by design. I want to separate that from the usual localisation story."</span></p>
      <p>Local architecture: cloud, edge and AI meeting CSL, DSL and PIPL from day one — compliance as architecture, not as a policy document. Local speed: decision loops in days, not quarters. Local talent: the China digital unit owns execution and the ecosystem. Local value: built for Chinese plants first.</p>
      <div class="script-callout">
        <strong>And here is the part that makes this a strategy rather than a regional programme:</strong> China has the highest complexity and the highest volume, which produces the strongest learning loops anywhere. So we build and prove here — then export the models, agents and playbooks as global templates. Local data stays local. The asset that crosses the border is the architecture, never the data.
      </div>
      <p>Let me cut the connection live so you can see the local buffer take over.</p>
    `
  },

  // --- 06 -----------------------------------------------------------------
  {
    navLabel: '06. The Ceiling',
    layout: 'chart',
    topic: 'THE LIGHTHOUSE · WHERE THE MARGIN HIDES',
    title: 'Excellent machines, waiting to be told what to do',
    subtitle: 'House 03 at the lighthouse complex. A best-in-class GEA house still runs on setpoints a human chose hours ago, against conditions that moved minutes ago.',
    pill: 'PHYSICAL WITHOUT Digit(AI)',
    time: 'Target time: 2 min',
    graphic: {
      type: 'ammoniaTimeline',
      args: [{
        aria: 'Ammonia across 24 hours: manual control repeatedly breaches the 20 ppm limit, autonomous control holds below it',
        limit: '20 ppm welfare limit',
        manual: 'Manual, per shift',
        auto: 'Digit(AI), continuous',
        breach: 'Limit breached'
      }]
    },
    caption: 'Ammonia in one house across 24 hours. Same machines, same house — only the operating layer differs.',
    notes: [
      { title: 'Manual saws', text: 'Levels climb until someone notices, then over-purge. Two breaches in a single day.' },
      { title: 'Digit(AI) holds', text: 'Continuous correction keeps a steady margin below the limit, with no dramatic purges.' },
      { title: 'Blind to price', text: 'Manual ventilation runs identically at peak tariff and at 03:00. Nobody is arbitraging.' },
      { title: 'Not a machine fault', text: 'This is the ceiling of the physical layer alone. The hardware was never the constraint.' }
    ],
    demoAction: {
      badge: 'LIVE DEMO',
      title: 'Compare an autonomous house against a manually operated one, side by side.',
      btnText: 'Open the ROI comparison',
      targetNav: 'nav-btn-roi'
    },
    script: `
      <p><span class="script-highlight">"Let me make the thesis concrete, because this is where the margin has been hiding."</span></p>
      <p>This is one house across twenty-four hours. Same machines, same building. The only difference is the operating layer. Manual control saws — levels climb until somebody notices, then over-purge. Two breaches of the welfare limit in a single day. Digit(AI) holds a steady margin underneath, continuously.</p>
      <div class="script-callout">
        <strong>The point to land:</strong> this is not a machine fault. The physical layer was never the constraint. It is the ceiling of physical-only operation — excellent equipment waiting to be told what to do.
      </div>
      <p>And notice the manual line runs identically at peak tariff and at three in the morning. Nobody is arbitraging price, because nobody can watch it continuously.</p>
    `
  },

  // --- 07 -----------------------------------------------------------------
  {
    navLabel: '07. Autonomy',
    layout: 'chart',
    topic: 'THE LIGHTHOUSE · AUTONOMY UNDER PRESSURE',
    title: '02:14:32 — a failure, with nobody awake',
    subtitle: 'A ventilation inverter trips at peak tariff. Two agents disagree. Welfare wins, in 280 milliseconds, with no human in the loop.',
    pill: 'AUTONOMY AS DEFAULT',
    time: 'Target time: 2.5 min',
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
    caption: 'Recorded trace from House 03, 02:14:30 to 02:19. No human intervention at any point.',
    notes: [
      { title: '02:14:32 — fault', text: 'A ventilation inverter trips. Airflow drops, NH₃ climbs from 11.4 ppm toward the limit.' },
      { title: 'Agents disagree', text: 'Peak tariff is active. Energy is throttling to save cost and proposes holding the throttle.' },
      { title: '+0.28 s — veto', text: 'Health projects a breach and <strong>overrides Energy</strong>. Fans to 100%, flush cycle starts.' },
      { title: 'Governed, not improvised', text: 'Welfare outranks cost by rule, not by configuration. Cost of the override: ¥41.' }
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
      <p><span class="script-highlight">"Autonomy as default is one of the first principles in this deck. Here is what it looks like when it is tested."</span></p>
      <p>Two fourteen in the morning. A ventilation inverter trips. Airflow drops, ammonia climbs toward the welfare limit. Nobody is in the building. And electricity is at peak tariff, so the Energy agent is actively throttling to save money and proposes holding that throttle.</p>
      <div class="script-callout">
        <strong>What happened next is the whole governance argument:</strong> the Health agent projected a breach and vetoed Energy outright. Fans to a hundred percent, flush started. Two hundred and eighty milliseconds. Welfare outranks cost <em>by rule</em>, not by configuration — which is what makes autonomy acceptable to a veterinarian and to an auditor.
      </div>
      <p>It cost forty-one yuan in peak electricity. The morning shift arrived to a maintenance order, not a crisis. Let me replay it from the black box.</p>
    `
  }
);

// ===========================================================================
// ENGLISH - Act III: the result, impact vectors, the mindset, the close
// ===========================================================================

window.KeynoteDeck.slides.en.push(
  // --- 08 -----------------------------------------------------------------
  {
    navLabel: '08. The Result',
    layout: 'metrics',
    topic: 'THE LIGHTHOUSE · WHAT IT RETURNED',
    title: 'Fleet scale, with provenance for every number',
    subtitle: 'Annualised across 50 complexes and 600M broilers. Each figure traces to a measured stream, not a projection.',
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
    caveat: 'Payback under 2.5 months at this scale. Caveat worth stating plainly: the lighthouse already had the edge and data layers in place. A site starting without them funds that foundation first and sees these returns after.',
    demoAction: {
      badge: 'LIVE DEMO',
      title: 'Open the fleet analytics across all 50 complexes.',
      btnText: 'Open the BI command center',
      targetNav: 'nav-btn-bi'
    },
    script: `
      <p><span class="script-highlight">"Now the return — and I will tell you where each number comes from, because a metric without provenance is marketing."</span></p>
      <p>Feed conversion from one sixty-eight to one fifty-four, measured per batch as feed mass in against live weight out. Five thousand eight hundred tonnes of grain not consumed. Peak power draw down twenty-eight percent, shifted only where the welfare margin allowed. Carbon abatement of eighteen thousand tonnes, ISO 14064-1 validated.</p>
      <div class="script-callout">
        <strong>The caveat I want on the record:</strong> the lighthouse already had the edge and data layers in place. If a site is starting without them, it funds that foundation first and sees these returns after. Anyone promising you these numbers on an unconnected estate is selling you something.
      </div>
      <p>Payback under two and a half months at this scale.</p>
    `
  },

  // --- 09 -----------------------------------------------------------------
  {
    navLabel: '09. Impact Vectors',
    layout: 'columns',
    topic: 'IMPACT VECTORS',
    title: 'Where Digit(AI) compounds',
    subtitle: 'Operations and commercial gains are per-plant. Scale via AI is the term that compounds across the fleet.',
    pill: 'AI LEADS THE CHINA → GLOBAL PATH',
    time: 'Target time: 2 min',
    columns: [
      {
        tag: 'OPERATIONS',
        items: [
          'Predictive maintenance',
          'Real-time OEE and yield',
          'Autonomous setpoints',
          'Energy optimization'
        ]
      },
      {
        tag: 'COMMERCIAL',
        items: [
          'Revenue intelligence',
          'Lead-to-Cash velocity',
          'Service productization',
          'Outcome-based models'
        ]
      },
      {
        tag: 'SCALE VIA AI',
        accent: true,
        lead: 'The compounding column.',
        items: [
          'China AI lighthouse',
          'China → Global agents',
          'Fleet learning loops',
          'Reusable AI playbooks'
        ]
      }
    ],
    footnote: 'The first two columns are worth real money and any credible vendor can deliver them. The third is the one that turns a China programme into a global capability — and it only exists if the first two are built on one architecture rather than fifty local integrations.',
    demoAction: {
      badge: 'LIVE DEMO',
      title: 'Ask the operating layer a question in plain language and watch it reason over live plant data.',
      btnText: 'Open the AI copilot',
      action: 'openCopilot'
    },
    script: `
      <p><span class="script-highlight">"Where does Digit(AI) actually compound? Three vectors, and they are not equal."</span></p>
      <p><strong>Operations</strong>: predictive maintenance, real-time OEE and yield, autonomous setpoints, energy optimization. <strong>Commercial</strong>: revenue intelligence, Lead-to-Cash velocity, service productization, outcome-based models.</p>
      <div class="script-callout">
        <strong>The third column is the strategic one:</strong> scale via AI. China AI lighthouse, China to Global agents, fleet learning loops, reusable playbooks. The first two columns are worth real money and any credible vendor can deliver them. The third turns a China programme into a global capability — and it only exists if the first two are built on <em>one</em> architecture rather than fifty local integrations.
      </div>
      <p>That is the single most important architectural decision in this whole programme.</p>
    `
  },

  // --- 10 -----------------------------------------------------------------
  {
    navLabel: '10. The Mindset',
    layout: 'flow',
    topic: 'THE MINDSET',
    title: 'First principles for Digit(AI)',
    subtitle: 'Four rules that decide whether this becomes an operating layer or another dashboard programme.',
    pill: 'HOW WE BUILD',
    time: 'Target time: 2 min',
    steps: [
      {
        title: 'Physics first',
        text: 'Understand the real process constraints <strong>before</strong> adding software layers. The welfare limit and the fan curve are facts, not parameters.',
        meta: 'Constraints before code'
      },
      {
        title: 'Data as a product',
        text: 'Every plant becomes a continuous source of learning — locally and globally. Data has owners, contracts and quality gates.',
        meta: 'Owned, not collected'
      },
      {
        title: 'Autonomy as default',
        text: 'Design for systems that improve themselves. <strong>Humans supervise exceptions</strong> rather than approving routine decisions.',
        meta: 'Humans on the exceptions'
      },
      {
        title: 'AI: China → Global',
        text: 'Build and prove Digit(AI) in China. Export the architecture, agents and playbooks worldwide.',
        meta: 'Architecture travels, data does not'
      }
    ],
    demoAction: {
      badge: 'LIVE DEMO',
      title: 'See the four-stage maturity path and where the fleet sits on it today.',
      btnText: 'Open the evolution matrix',
      targetNav: 'nav-btn-esg'
    },
    script: `
      <p><span class="script-highlight">"Four first principles. These are the rules that decide whether this becomes an operating layer or another dashboard programme."</span></p>
      <p><strong>Physics first</strong>: understand the real process constraints before adding software. The welfare limit and the fan curve are facts, not parameters someone can tune. <strong>Data as a product</strong>: every plant is a continuous source of learning, with owners, contracts and quality gates — owned, not merely collected.</p>
      <div class="script-callout">
        <strong>Autonomy as default</strong> is the one that changes the operating model: design for systems that improve themselves, and put humans on the <em>exceptions</em> rather than in the approval path for routine decisions. If a human has to approve every setpoint, you have built a dashboard.
      </div>
      <p>And fourth: build and prove in China, then export the architecture, agents and playbooks worldwide.</p>
    `
  },

  // --- 11 -----------------------------------------------------------------
  {
    navLabel: '11. Let\'s Engineer It',
    layout: 'statement',
    topic: 'THE CLOSE',
    title: 'The future is not a destination. It is a system we build.',
    subtitle: 'GEA + Digit(AI) · In China · For China · For the world.',
    pill: 'LET\'S ENGINEER IT',
    time: 'Target time: 1.5 min',
    graphic: {
      type: 'chinaGlobal',
      args: [{
        aria: 'Build and prove in China, then export agents and playbooks globally while data stays local',
        china: 'CHINA',
        chinaSub: 'build & prove',
        global: 'GLOBAL',
        globalSub: 'export the system',
        exportLbl: 'models, agents, playbooks',
        stays: 'data stays local',
        foot: 'Data gravity respected. Intelligence and architecture scale.'
      }]
    },
    equation: {
      aria: 'Build and prove in China, then export the architecture globally',
      operators: ['→'],
      terms: [
        { main: 'Proven', sub: '50 complexes, 600M birds, autonomous today' },
        { main: 'Exportable', sub: 'Models, agents and playbooks as global templates', accent: true }
      ]
    },
    lead: '<strong>AI is the first system we take from China to Global.</strong> The lighthouse is already running — the question is which plant is next, not whether it works.',
    points: [
      'The architecture is proven at fleet scale, not in a pilot.',
      'Compliance is designed in, so expansion is an engineering task rather than a legal one.',
      'Local data stays local. The intelligence travels.'
    ],
    demoAction: {
      badge: 'LIVE DEMO',
      title: 'Walk the whole operating layer end to end, from barn sensor to boardroom.',
      btnText: 'Open the live operating layer',
      targetNav: 'nav-btn-highway',
      viewMode: '3d',
      scenario: 'closedloop'
    },
    script: `
      <p><span class="script-highlight">"The future is not a destination. It is a system we build."</span></p>
      <p>What I have shown you is not a roadmap. It is running: fifty complexes, six hundred million birds a year, agents closing loops in under three hundred and fifty milliseconds, welfare governed by rule, every action audited.</p>
      <div class="script-callout">
        <strong>The strategic claim to close on:</strong> AI is the first system we take from China to Global. The architecture is proven at fleet scale rather than in a pilot. Compliance is designed in, so expanding is an engineering task rather than a legal one. Local data stays local — the intelligence travels.
      </div>
      <p>GEA plus Digit(AI). In China, for China, for the world. <strong>Let's engineer it.</strong>"</p>
    `
  }
);

// ===========================================================================
// 中文 - 第一部分：命题、论点、意义、技术栈
// ===========================================================================

window.KeynoteDeck.slides.zh.push(
  // --- 01 -----------------------------------------------------------------
  {
    navLabel: '01. 未来命题',
    layout: 'statement',
    topic: '核心命题',
    title: 'GEA + Digit(AI) = 未来',
    subtitle: '数字化与人工智能融合为流程工业的同一个操作系统。在中国、为中国，并具备全球辐射力。',
    pill: '在中国 · 为中国 · 中国 → 全球',
    time: '建议时长：1.5 分钟',
    equation: {
      aria: 'GEA 加 Digit(AI) 等于未来',
      operators: ['+', '='],
      terms: [
        { main: 'GEA', sub: '装备、流程工厂、真实世界的产出' },
        { main: 'Digit(AI)', sub: '平台与智能融合为同一层', accent: true },
        { main: '未来', sub: '工业的新一代操作系统' }
      ]
    },
    lead: '不是两个并行推进的项目，而是<strong>同一个操作层</strong>——而 AI 正是"生于中国、走向全球"最典型的范例。',
    points: [
      '流程工业是现代文明的基础：食品、医药、能源、材料。',
      '中国是最佳验证场：复杂度最高、体量最大、学习闭环最快。',
      '这座灯塔工厂——50 大基地、年出栏 6 亿羽，今天已在自主运行。'
    ],
    demoAction: {
      badge: '现场演示',
      title: '查看这一操作层在 50 大基地的实时运行状况。',
      btnText: '打开 3D 数据管道',
      targetNav: 'nav-btn-highway',
      viewMode: '3d',
      scenario: 'closedloop'
    },
    script: `
      <p><span class="script-highlight">"GEA 加 Digit(AI) 等于未来。我想把这句话讲得非常精确，因为它不是一句口号。"</span></p>
      <p>流程工业是现代文明的基础——食品、医药、能源、材料。GEA 制造工业赖以运转的装备，而 Digit(AI) 决定这些装备被如何使用。</p>
      <div class="script-callout">
        <strong>核心主张：</strong>这不是两个并行推进的项目，而是同一个操作层。并且，AI 正是"生于中国、走向全球"最典型的范例。
      </div>
      <p>接下来我展示的一切，今天都已在生产现场运行：50 大基地，年出栏 6 亿羽。不是试点。</p>
    `
  },

  // --- 02 -----------------------------------------------------------------
  {
    navLabel: '02. 融合论点',
    layout: 'pillars',
    topic: '核心论点',
    title: 'Digit(AI) 不是"数字化 + AI"',
    subtitle: '它是数字化平台与人工智能融合而成的同一个智能操作层。',
    pill: '是融合，不是相加',
    time: '建议时长：2 分钟',
    graphic: {
      type: 'fusionDiagram',
      args: [{
        aria: '物理层、数字层与 AI 层相互交叠，构成同一个智能操作层',
        physical: '物理层',
        digit: '数字层',
        ai: '(AI)',
        caption: '是交叠，而非堆叠——同一个智能操作层'
      }]
    },
    pillars: [
      { tag: '物理层 PHYSICAL', text: 'GEA 装备、流程工厂与真实产出。这一层决定物理上的天花板。' },
      { tag: '数字层 DIGIT', text: '平台、数据、边缘与云、安全连接。这一层让工厂"可被读懂"。', accent: true },
      { tag: '智能层 (AI)', text: '智能体、模型、寻优、自主控制。这一层负责决策并执行。', accent: true }
    ],
    fusion: '三者是相乘关系，不是相加。缺任何一层，另外两层就不再产生复利——这正是那些把 AI 放到最后阶段"外挂"上去的数字化项目最终停滞的原因。',
    demoAction: {
      badge: '现场演示',
      title: '观察四个智能体就一次真实决策达成共识，并写回现场。',
      btnText: '打开智能体共识流',
      targetNav: 'nav-btn-highway',
      viewMode: '3d',
      scenario: 'closedloop'
    },
    script: `
      <p><span class="script-highlight">"Digit(AI) 不是数字化加 AI，而是两者融合成同一个智能操作层。"</span></p>
      <p>三层。<strong>物理层</strong>：GEA 装备与流程工厂，产生真实产出，也决定物理上限。<strong>数字层</strong>：平台、数据、边缘与云、安全连接，让工厂可被读懂。<strong>智能层</strong>：智能体、模型、寻优、自主控制，负责决策与执行。</p>
      <div class="script-callout">
        <strong>这个区分在商业上的意义：</strong>三者相乘，而非相加。缺任何一层，另外两层就不再产生复利。这正是那些把 AI 当作第三阶段"外挂"的数字化项目，最终只停留在看板层面的原因。
      </div>
      <p>下面我把智能层真正参与决策博弈的过程放给各位看。</p>
    `
  },

  // --- 03 -----------------------------------------------------------------
  {
    navLabel: '03. 为何重要',
    layout: 'metrics',
    topic: '为何重要',
    title: '这是工业的新操作系统，而不是一次渐进优化',
    subtitle: '流程工业是现代文明的基础：食品、医药、能源、材料。当操作层变得智能，改变的是这些指标。',
    pill: '建在扩张最快的地方',
    time: '建议时长：2 分钟',
    metrics: [
      {
        value: '10x',
        unit: '',
        label: '决策周期加速',
        bars: { beforePct: 10, afterPct: 100, lowerIsBetter: false },
        source: '闭环在 <strong>350 毫秒内</strong>完成，而不是等到下一次交班。'
      },
      {
        value: '30',
        unit: '%+',
        label: '灯塔工厂 OEE 提升',
        bars: { beforePct: 70, afterPct: 100, lowerIsBetter: false },
        source: '可用率、性能与质量，连续计量而非抽样。'
      },
      {
        value: '零',
        unit: '',
        label: '非计划停机作为新目标',
        bars: { beforePct: 100, afterPct: 12 },
        source: '依据执行机构工作循环在故障前预测，而非事后处理。'
      },
      {
        value: '∞',
        unit: '',
        label: '集团级学习闭环',
        bars: { beforePct: 20, afterPct: 100, lowerIsBetter: false },
        source: '每个工厂都从其他所有工厂的经验中改进。这才是复利项。'
      }
    ],
    caveat: '第四个数字才是战略意义所在。前三个是单厂收益，任何一家供应商都能报出来。只有集团级学习闭环会产生复利——而它需要足够的规模与复杂度才能成立，这正是中国成为验证场而非推广区的原因。',
    demoAction: {
      badge: '现场演示',
      title: '用您自己的饲料价格、电价与死淘率假设做压力测试。',
      btnText: '打开财务作战室',
      targetNav: 'nav-btn-warroom'
    },
    script: `
      <p><span class="script-highlight">"Digit(AI) 不是渐进优化，而是工业的新操作系统——并且要建在它扩张最快的地方。"</span></p>
      <p>决策周期快十倍：闭环在三百五十毫秒内完成，而不是等到下一次交班。灯塔工厂 OEE 提升百分之三十以上。非计划停机以"零"为目标，而不是作为愿望。</p>
      <div class="script-callout">
        <strong>第四个数字才是战略层面的：</strong>集团级无限学习闭环。前三个是单厂收益，任何供应商都能报。只有第四项会<em>产生复利</em>，而它需要规模与复杂度才成立。这正是中国是验证场、而不是推广区的原因。
      </div>
      <p>财务作战室可以让各位自己推动这些假设。</p>
    `
  },

  // --- 04 -----------------------------------------------------------------
  {
    navLabel: '04. 技术栈',
    layout: 'stack',
    topic: 'Digit(AI) 技术栈',
    title: '从原子到算法，生而合规',
    subtitle: '四层架构。合规由架构本身保证，而不是靠一份制度文件补齐。',
    pill: '生而符合中国监管',
    time: '建议时长：2 分钟',
    layers: [
      {
        tag: '人机协同 HUMAN + MACHINE',
        text: '增强型操作员 · 决策支持 · 零摩擦协作 · 本地语言与工艺语境'
      },
      {
        tag: 'AI 与智能体 AI & AGENTS',
        star: '典型范例',
        text: '工艺寻优 · 预测性控制 · 高管智能助手 · <strong>生于中国，为全球规模而设计</strong>'
      },
      {
        tag: '数据与云 DATA & CLOUD',
        text: '统一数据底座 · Azure 中国 / 多云 · 数字孪生 · 数据驻留与个保法合规'
      },
      {
        tag: '边缘与物联 EDGE & IIoT',
        text: '安全远程接入 · 实时传感 · 网关 · 本地智能 · 符合中国监管的 OT 通道'
      }
    ],
    footnote: '在生产现场的具体落地：Welotec 边缘网关以 10 毫秒周期轮询 Modbus，具备 48 小时本地缓存，数据流入位于世纪互联 Azure 中国东部 2 的 Snowflake 与 Foundry，智能体再把闭环写回 PLC。',
    demoAction: {
      badge: '现场演示',
      title: '查看全部 13 个层级，以及 OT 与 IT 之间的协议边界。',
      btnText: '打开 2D 架构管道',
      targetNav: 'nav-btn-highway',
      viewMode: '2d',
      nodeId: 'edge'
    },
    script: `
      <p><span class="script-highlight">"从原子到算法——而且是生而合规，这与"兼容中国监管"是两个不同的说法。"</span></p>
      <p>最底层<strong>边缘与物联</strong>：安全远程接入、实时传感、网关、本地智能、符合监管的 OT 通道。之上是<strong>数据与云</strong>：统一数据底座、Azure 中国、数字孪生、数据驻留与个保法合规。再往上是 <strong>AI 与智能体</strong>——典型范例层：工艺寻优、预测性控制、高管智能助手，生于中国、为全球规模而设计。最上层是<strong>人机协同</strong>。</p>
      <div class="script-callout">
        <strong>在生产现场的具体落地：</strong>Welotec 网关以十毫秒周期轮询 Modbus，48 小时本地缓存，数据流入世纪互联 Azure 中国东部 2 的 Snowflake 与 Foundry，智能体把闭环写回 PLC。
      </div>
      <p>下面我打开管道视图，各位可以看到每一层与每一个协议。</p>
    `
  }
);

// ===========================================================================
// 中文 - 第二部分：在中国为中国，以及灯塔实证
// ===========================================================================

window.KeynoteDeck.slides.zh.push(
  // --- 05 -----------------------------------------------------------------
  {
    navLabel: '05. 在中国',
    layout: 'contrast',
    topic: '在中国，为中国',
    title: 'Digit(AI) 只有"生于本地"才能加速',
    subtitle: '本地架构、本地速度、本地人才、本地价值——同时架构本身依然可以输出。',
    pill: 'AI = 中国 → 全球的样板',
    time: '建议时长：2.5 分钟',
    divider: '支撑',
    before: {
      tag: '"生于本地"意味着什么',
      heading: '在这里建成，而非在这里适配',
      items: [
        '<strong>本地架构：</strong>云、边缘与 AI 从第一天起即满足《网络安全法》《数据安全法》《个人信息保护法》',
        '<strong>本地速度：</strong>决策闭环以天计，而不是以季度计',
        '<strong>本地人才：</strong>中国数字化团队自主掌控交付与生态',
        '<strong>本地价值：</strong>方案优先为中国客户与中国工厂而建'
      ],
      footnote: '合规由架构保证，而不是靠某个人记得去执行制度。'
    },
    after: {
      tag: '为什么它可以输出',
      heading: '中国 → 全球的实证路径',
      items: [
        '<strong>在中国建成并验证：</strong>最高复杂度与最大体量带来最强的学习闭环',
        '<strong>再输出整套系统：</strong>模型、智能体与方法论成为全球模板',
        '<strong>尊重数据引力：</strong>本地数据留在本地，智能与架构对外扩展',
        '<strong>战略自主：</strong>同一套架构可在任何监管环境下运行'
      ],
      footnote: '跨境流动的资产是架构，永远不是数据。'
    },
    demoAction: {
      badge: '现场演示',
      title: '现场切断连接，观察边缘侧依靠本地缓存继续运行。',
      btnText: '模拟断网场景',
      targetNav: 'nav-btn-highway',
      viewMode: '2d',
      action: 'toggleOffline'
    },
    script: `
      <p><span class="script-highlight">"Digit(AI) 只有生于本地才能加速。我想把这一点与常见的"本地化"叙事区分开。"</span></p>
      <p>本地架构：云、边缘与 AI 从第一天起就满足三法——合规由架构保证，而不是一份制度文件。本地速度：决策闭环以天计而非季度计。本地人才：中国数字化团队自主掌控交付与生态。本地价值：优先为中国工厂而建。</p>
      <div class="script-callout">
        <strong>接下来这部分，才让它成为战略而不是区域项目：</strong>中国拥有全球最高的复杂度与最大的体量，因此能产生最强的学习闭环。所以我们在这里建成并验证，然后把模型、智能体与方法论作为全球模板输出。本地数据留在本地，跨境流动的资产是架构，永远不是数据。
      </div>
      <p>下面我现场切断连接，各位可以看到本地缓存接管的过程。</p>
    `
  },

  // --- 06 -----------------------------------------------------------------
  {
    navLabel: '06. 真正瓶颈',
    layout: 'chart',
    topic: '灯塔实证 · 利润藏在哪里',
    title: '一流装备，仍在等人下指令',
    subtitle: '灯塔工厂 03 号舍。即使是最高标准的鸡舍，运行的仍是几小时前由人设定的参数，而工况在几分钟前就已改变。',
    pill: '只有物理层，没有 Digit(AI)',
    time: '建议时长：2 分钟',
    graphic: {
      type: 'ammoniaTimeline',
      args: [{
        aria: '24 小时氨气曲线：人工控制多次突破 20 ppm 上限，自主控制始终保持在上限之下',
        limit: '20 ppm 福利上限',
        manual: '人工，按班次',
        auto: 'Digit(AI)，连续',
        breach: '突破上限'
      }]
    },
    caption: '同一栋舍 24 小时氨气曲线。装备相同、鸡舍相同，唯一差别是操作层。',
    notes: [
      { title: '人工呈锯齿', text: '一路攀升到有人发现，再过度排风。一天之内两次突破上限。' },
      { title: 'Digit(AI) 保持稳定', text: '连续微调，始终在上限之下留出稳定余量，无需剧烈排风。' },
      { title: '对电价无感', text: '人工通风在峰电和凌晨三点完全一样，没有人在做峰谷套利。' },
      { title: '不是装备问题', text: '这是"仅有物理层"的天然上限。硬件从来不是瓶颈。' }
    ],
    demoAction: {
      badge: '现场演示',
      title: '并排对比自主运行鸡舍与人工运行鸡舍的实际差异。',
      btnText: '打开 ROI 对比视图',
      targetNav: 'nav-btn-roi'
    },
    script: `
      <p><span class="script-highlight">"让我把论点落到实处，因为利润一直藏在这里。"</span></p>
      <p>这是一栋舍 24 小时的曲线。装备相同、建筑相同，唯一差别是操作层。人工控制呈锯齿——一路升到有人发现，再过度排风，一天之内两次突破福利上限。Digit(AI) 则连续地在上限之下保持稳定余量。</p>
      <div class="script-callout">
        <strong>需要讲透的一点：</strong>这不是装备故障。物理层从来不是瓶颈。这是"仅有物理层"运行方式的天然上限——一流装备在等人下指令。
      </div>
      <p>并且请注意，人工那条线在峰电和凌晨三点完全一样。没有人在套利电价，因为没有人能持续盯住它。</p>
    `
  },

  // --- 07 -----------------------------------------------------------------
  {
    navLabel: '07. 自主决策',
    layout: 'chart',
    topic: '灯塔实证 · 压力下的自主决策',
    title: '02:14:32——一次故障，现场无人',
    subtitle: '峰电时段通风变频器跳闸。两个智能体意见相反。福利胜出，用时 280 毫秒，全程无人介入。',
    pill: '自主为默认',
    time: '建议时长：2.5 分钟',
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
    caption: '03 号舍实测曲线，02:14:30 至 02:19。全程无人介入。',
    notes: [
      { title: '02:14:32 — 故障', text: '通风变频器跳闸，风量下降，氨气自 11.4 ppm 向上限攀升。' },
      { title: '智能体分歧', text: '正处峰电时段，能耗体正在降频省钱，并提议维持降频。' },
      { title: '+0.28 秒 — 否决', text: '健康体推演出将突破底线，<strong>直接否决能耗体</strong>。风机拉满，启动冲洗。' },
      { title: '受治理，非临场应变', text: '福利高于成本是规则写死的，不是配置项。此次否决代价：41 元。' }
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
      <p><span class="script-highlight">"「自主为默认」是这份材料里的第一性原理之一。下面是它被真正考验时的样子。"</span></p>
      <p>凌晨两点十四分，通风变频器跳闸。风量下降，氨气向福利上限攀升，舍内无人。而当时正是峰电时段，能耗智能体正在主动降频省钱，并提议维持降频。</p>
      <div class="script-callout">
        <strong>接下来发生的事，正是整个治理机制的论证：</strong>健康智能体推演出将突破底线，直接否决能耗体。风机拉满，冲洗启动。二百八十毫秒。福利高于成本是<em>规则</em>写死的，不是配置项——这才让兽医和审计都能接受自主决策。
      </div>
      <p>它多花了四十一元峰电电费。早班到场看到的是一张检修工单，不是一场危机。下面从黑匣子复盘。</p>
    `
  }
);

// ===========================================================================
// 中文 - 第三部分：量化成效、复利方向、思维原则、收尾
// ===========================================================================

window.KeynoteDeck.slides.zh.push(
  // --- 08 -----------------------------------------------------------------
  {
    navLabel: '08. 量化成效',
    layout: 'metrics',
    topic: '灯塔实证 · 回报',
    title: '集团规模，且每个数字都有出处',
    subtitle: '按 50 大基地、6 亿羽年出栏年化计算。每一项都可追溯到实测数据流，而非推算。',
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
    caveat: '在此规模下投资回收期短于 2.5 个月。需要如实说明：这座灯塔工厂此前已建成边缘层与数据层。若某站点尚不具备，应先投入这部分基础建设，收益随后到来。',
    demoAction: {
      badge: '现场演示',
      title: '打开覆盖全部 50 大基地的集团级分析大屏。',
      btnText: '打开商业智能中心',
      targetNav: 'nav-btn-bi'
    },
    script: `
      <p><span class="script-highlight">"下面讲回报。我会说明每个数字的出处，因为没有出处的指标只是营销。"</span></p>
      <p>料肉比从一点六八到一点五四，按批次以实测投料量对出栏活重计算，折合五千八百多吨粮食未被消耗。峰电负荷下降二十八个百分点，且仅在福利余量允许时移峰。碳减排一万八千多吨，已通过 ISO 14064-1 核证。</p>
      <div class="script-callout">
        <strong>需要留在记录里的前提：</strong>这座灯塔工厂此前已建成边缘层与数据层。若贵方站点尚不具备，应先投入这部分基础建设，收益随后到来。任何人拿这些数字向尚未联网的资产承诺回报，那是在推销。
      </div>
      <p>在此规模下，回收期短于两个半月。</p>
    `
  },

  // --- 09 -----------------------------------------------------------------
  {
    navLabel: '09. 复利方向',
    layout: 'columns',
    topic: '价值复利方向',
    title: 'Digit(AI) 在哪里产生复利',
    subtitle: '运营与商业收益属于单厂层面；只有"以 AI 规模化"这一项会在集团层面产生复利。',
    pill: 'AI 引领中国 → 全球',
    time: '建议时长：2 分钟',
    columns: [
      {
        tag: '运营 OPERATIONS',
        items: [
          '预测性维护',
          '实时 OEE 与收率',
          '自主设定值',
          '能耗寻优'
        ]
      },
      {
        tag: '商业 COMMERCIAL',
        items: [
          '收入智能分析',
          '线索到回款效率',
          '服务产品化',
          '基于成效的商业模式'
        ]
      },
      {
        tag: '以 AI 规模化',
        accent: true,
        lead: '真正产生复利的一列。',
        items: [
          '中国 AI 灯塔',
          '中国 → 全球智能体',
          '集团级学习闭环',
          '可复用的 AI 方法论'
        ]
      }
    ],
    footnote: '前两列确实值钱，任何有实力的供应商都能交付。第三列才是把一个中国项目变成全球能力的关键——而它成立的前提，是前两列建在同一套架构上，而不是五十个各自为政的本地集成。',
    demoAction: {
      badge: '现场演示',
      title: '用自然语言向操作层提问，观察它基于实时生产数据推理。',
      btnText: '打开 AI 智能副驾',
      action: 'openCopilot'
    },
    script: `
      <p><span class="script-highlight">"Digit(AI) 究竟在哪里产生复利？三个方向，而它们并不等价。"</span></p>
      <p><strong>运营</strong>：预测性维护、实时 OEE 与收率、自主设定值、能耗寻优。<strong>商业</strong>：收入智能分析、线索到回款效率、服务产品化、基于成效的商业模式。</p>
      <div class="script-callout">
        <strong>第三列才是战略性的：</strong>以 AI 规模化——中国 AI 灯塔、中国到全球的智能体、集团级学习闭环、可复用方法论。前两列任何有实力的供应商都能交付；第三列才能把一个中国项目变成全球能力，而前提是前两列建在<em>同一套</em>架构上，而不是五十个各自为政的本地集成。
      </div>
      <p>这是整个项目里最关键的一个架构决策。</p>
    `
  },

  // --- 10 -----------------------------------------------------------------
  {
    navLabel: '10. 思维原则',
    layout: 'flow',
    topic: '思维方式',
    title: 'Digit(AI) 的第一性原理',
    subtitle: '四条原则，决定这最终成为一个操作层，还是又一个看板项目。',
    pill: '我们如何建设',
    time: '建议时长：2 分钟',
    steps: [
      {
        title: '物理优先',
        text: '在叠加软件层<strong>之前</strong>，先搞清真实工艺约束。福利上限与风机曲线是事实，不是可调参数。',
        meta: '先约束，后代码'
      },
      {
        title: '数据即产品',
        text: '每个工厂都成为持续的学习来源——本地与全球同时受益。数据要有归属、契约与质量门。',
        meta: '被拥有，而非被收集'
      },
      {
        title: '自主为默认',
        text: '按"系统自我改进"来设计。<strong>人只监管例外</strong>，而不是逐条审批常规决策。',
        meta: '人守在例外上'
      },
      {
        title: 'AI：中国 → 全球',
        text: '在中国建成并验证 Digit(AI)，再把架构、智能体与方法论输出到全球。',
        meta: '架构走出去，数据留下来'
      }
    ],
    demoAction: {
      badge: '现场演示',
      title: '查看四阶段成熟度路径，以及集团当前所处的位置。',
      btnText: '打开演进矩阵',
      targetNav: 'nav-btn-esg'
    },
    script: `
      <p><span class="script-highlight">"四条第一性原理。它们决定这件事最终成为一个操作层，还是又一个看板项目。"</span></p>
      <p><strong>物理优先</strong>：先搞清真实工艺约束，再叠加软件。福利上限和风机曲线是事实，不是谁可以随手调的参数。<strong>数据即产品</strong>：每个工厂都是持续学习来源，要有归属、契约与质量门——是被拥有，而不只是被收集。</p>
      <div class="script-callout">
        <strong>「自主为默认」是真正改变运营模式的那一条：</strong>按系统自我改进来设计，把人放在<em>例外</em>上，而不是常规决策的审批链里。如果每个设定值都要人批，那你建的就是一块看板。
      </div>
      <p>第四条：在中国建成并验证，再把架构、智能体与方法论输出到全球。</p>
    `
  },

  // --- 11 -----------------------------------------------------------------
  {
    navLabel: '11. 一起把它造出来',
    layout: 'statement',
    topic: '收尾',
    title: '未来不是一个终点，而是我们亲手建造的系统。',
    subtitle: 'GEA + Digit(AI) · 在中国 · 为中国 · 也为世界。',
    pill: '一起把它造出来',
    time: '建议时长：1.5 分钟',
    graphic: {
      type: 'chinaGlobal',
      args: [{
        aria: '在中国建成并验证，再把智能体与方法论输出到全球，数据留在本地',
        china: '中国',
        chinaSub: '建成并验证',
        global: '全球',
        globalSub: '输出整套系统',
        exportLbl: '模型、智能体、方法论',
        stays: '数据留在本地',
        foot: '尊重数据引力。智能与架构对外扩展。'
      }]
    },
    equation: {
      aria: '在中国验证，向全球输出架构',
      operators: ['→'],
      terms: [
        { main: '已验证', sub: '50 大基地、6 亿羽，今天已自主运行' },
        { main: '可输出', sub: '模型、智能体与方法论成为全球模板', accent: true }
      ]
    },
    lead: '<strong>AI 是我们从中国带向全球的第一个系统。</strong>灯塔已经在跑——现在的问题是"下一个工厂是哪一个"，而不是"这套东西行不行"。',
    points: [
      '架构已在集团规模上验证，而不是停留在试点。',
      '合规生于架构，因此扩张是工程问题，而不是法律问题。',
      '本地数据留在本地，走出去的是智能。'
    ],
    demoAction: {
      badge: '现场演示',
      title: '端到端走一遍完整操作层：从舍内传感器到董事会。',
      btnText: '打开实时操作层',
      targetNav: 'nav-btn-highway',
      viewMode: '3d',
      scenario: 'closedloop'
    },
    script: `
      <p><span class="script-highlight">"未来不是一个终点，而是我们亲手建造的系统。"</span></p>
      <p>我今天展示的不是路线图，而是正在运行的系统：50 大基地、年出栏 6 亿羽、智能体在 350 毫秒内闭环、福利由规则守护、每个动作可审计。</p>
      <div class="script-callout">
        <strong>作为收尾的战略主张：</strong>AI 是我们从中国带向全球的第一个系统。架构已在集团规模验证，而非试点。合规生于架构，因此扩张是工程问题而不是法律问题。本地数据留在本地——走出去的是智能。
      </div>
      <p>GEA 加 Digit(AI)。在中国、为中国，也为世界。<strong>让我们一起把它造出来。</strong>"</p>
    `
  }
);

// ===========================================================================
// DECK FRAME - present the real .pptx instead of an HTML re-creation
// ---------------------------------------------------------------------------
// tools/pptx-to-deck.ps1 exports the source deck to dashboard/deck/slides/*.png
// plus a manifest. When that manifest is present it becomes the active deck, and
// the surrounding shell is reused unchanged: pill navigation, prev/next, arrow
// keys, fullscreen, the speaker-notes teleprompter, and the live-demo buttons.
//
// The built-in HTML deck stays as a fallback for when no export exists yet.
// ===========================================================================

(function (Deck) {
  'use strict';

  Deck.frame = { loaded: false, source: null, slides: [], aspect: 16 / 9 };

  /** Trims a slide title down to something that fits a navigation pill. */
  function navLabel(index, title) {
    const n = String(index).padStart(2, '0');
    if (!title) return n;
    const clean = title.replace(/\s+/g, ' ').trim();
    const short = clean.length > 22 ? clean.slice(0, 21).trimEnd() + '…' : clean;
    return `${n}. ${short}`;
  }

  const escapeHtml = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  /** Speaker-notes markup, or guidance when the source deck has no notes. */
  function scriptFor(notes, index, source) {
    if (notes && notes.trim()) {
      return notes.split(/\n{2,}/).map(p => `<p>${escapeHtml(p)}</p>`).join('');
    }
    return `
      <p><span class="script-highlight">No speaker notes on slide ${index} of ${escapeHtml(source || 'the deck')}.</span></p>
      <div class="script-callout">
        Add notes in PowerPoint's notes pane, then re-run
        <strong>tools\\pptx-to-deck.ps1</strong>. They will appear here automatically,
        and the deck images will refresh at the same time.
      </div>
    `;
  }

  /**
   * Loads the exported deck. Returns true when slides were installed.
   * Fails quietly: a missing manifest simply means no export exists yet, and a
   * fetch error under file:// is expected rather than exceptional.
   */
  Deck.loadFrame = function () {
    if (typeof fetch !== 'function') return Promise.resolve(false);

    const bust = `?t=${Date.now()}`;

    // Parse as text and strip any byte-order marks. Windows editors and
    // PowerShell add one, a leading BOM makes JSON.parse throw, and a file that
    // has been re-encoded a couple of times can carry more than one.
    const getJson = (url) => fetch(url + bust, { cache: 'no-store' })
      .then(r => (r.ok ? r.text() : null))
      .then(t => (t ? JSON.parse(t.replace(/^\uFEFF+/, '').trim()) : null));

    return getJson('deck/manifest.json')
      .then(manifest => {
        if (!manifest || !Array.isArray(manifest.slides) || !manifest.slides.length) return false;

        // Demo hooks are optional and hand-edited, so a syntax error there must
        // not take the whole deck down with it.
        return getJson('deck/demo-hooks.json')
          .catch(() => null)
          .then(hooks => install(manifest, hooks || {}));
      })
      .catch(() => false);
  };

  function install(manifest, hooks) {
    const source = manifest.source || 'deck';
    const aspect = (manifest.width && manifest.height)
      ? manifest.width / manifest.height
      : 16 / 9;

    Deck.frame = {
      loaded: true,
      source,
      aspect,
      width: manifest.width || null,
      height: manifest.height || null,
      generated: manifest.generated || null,
      engine: manifest.engine || null,
      slides: manifest.slides.map((s, i) => {
        const n = s.index || i + 1;
        const hook = hooks[String(n)] || hooks[n] || null;
        return {
          layout: 'image',
          image: 'deck/' + String(s.file || '').replace(/^\.?\//, ''),
          alt: s.title ? `Slide ${n}: ${s.title}` : `Slide ${n}`,
          navLabel: navLabel(n, s.title),
          topic: source,
          title: s.title || `Slide ${n}`,
          time: '',
          script: scriptFor(s.notes, n, source),
          demoAction: (hook && hook.btnText) ? hook : null
        };
      })
    };

    preloadFrameImages();
    return true;
  }

  /**
   * Decodes every slide image once, up front, and keeps a live reference so the
   * decoded bitmap stays resident. Without this, each slide change recreates the
   * <img> and the browser re-decodes a ~1080p PNG on the main thread, which is
   * the residual hitch when navigating the deck. img.decode() does the work off
   * the main thread; the retained array prevents the cache from evicting it.
   */
  function preloadFrameImages() {
    Deck._preloaded = [];
    (Deck.frame.slides || []).forEach(s => {
      if (!s.image) return;
      const im = new Image();
      im.decoding = 'async';
      im.src = s.image;
      if (typeof im.decode === 'function') { im.decode().catch(() => {}); }
      Deck._preloaded.push(im);
    });
  }

  /** True when the exported deck is driving the presentation tab. */
  Deck.usingFrame = function () {
    return !!(Deck.frame && Deck.frame.loaded && Deck.frame.slides.length);
  };
})(window.KeynoteDeck);

// The exported deck, when present, outranks the built-in HTML deck. Language
// does not switch it, because the source file is whatever the presenter built.
window.KeynoteDeck.get = function (lang) {
  if (this.usingFrame && this.usingFrame()) return this.frame.slides;
  const list = this.slides[lang === 'zh' ? 'zh' : 'en'];
  return list && list.length ? list : this.slides.en;
};
