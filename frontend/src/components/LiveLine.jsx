export default function LiveLine({ telemetry, tr, t, theme }) {
  const kpis = (telemetry.kpis || []).slice(0, 4);
  const stages = telemetry.stages || [];
  const feed = telemetry.feed_events || [];
  const alerts = stages.filter((s) => s.bad);
  const heroBg = theme === "warm" ? "url('/assets/bg/warm-line-hero.png')" : "url('/assets/bg/line-hero.png')";

  return (
    <section className="view active">
      <div className="hero">
        <div className="hero-bg" style={{ backgroundImage: heroBg }}></div>
        {theme === "warm" && (
          <>
            <span className="hero-deco">🐔</span>
            <span className="hero-deco-2">🥚</span>
          </>
        )}
        <div className="hero-content">
          <p className="eyebrow">{t("line.eyebrow")}</p>
          <h1>{t("line.title")}</h1>
          <p className="lede">{t("line.lede")}</p>
        </div>
      </div>

      <div className="kpi-grid">
        {kpis.map((k, idx) => {
          const arrow = k.trend === "up" ? "▲" : k.trend === "down" ? "▼" : "◆";
          return (
            <div className="kpi-card" key={k.id}>
              {theme === "warm" ? <WarmKpiIcon index={idx} /> : <KpiIcon index={idx} />}
              <div className="kpi-label">{tr(k.label)}</div>
              <div className="kpi-value">
                {k.value}<span className="kpi-unit">{k.unit}</span>
              </div>
              <span className={`kpi-trend ${k.good ? "good" : "bad"}`}>{arrow} {tr(k.target)}</span>
            </div>
          );
        })}
      </div>

      <section className="panel">
        <div className="panel-head"><h2>{t("line.flowTitle")}</h2></div>
        <div className="stage-flow">
          {stages.map((s) => (
            <div className={`stage-card ${s.bad ? "alert" : ""}`} key={s.id}>
              <span className="stage-num">{s.num}</span>
              <span className="stage-name">{tr(s.short || s.label)}</span>
              <span className="stage-metric">{s.value}{s.unit}</span>
              <span className={`status-dot ${s.bad ? "alert" : "normal"}`}></span>
            </div>
          ))}
        </div>
      </section>

      <div className="two-col">
        <section className="panel">
          <div className="panel-head"><h2>{t("line.feedTitle")}</h2></div>
          <div className="feed">
            {feed.slice(0, 5).map((f, i) => (
              <div className="feed-row" key={i}>
                <span className="feed-time">now-{i}</span>
                <span className="feed-msg">{tr(f)}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="panel">
          <div className="panel-head"><h2>{t("line.alertsTitle")}</h2></div>
          <div className="alerts">
            {alerts.length ? alerts.map((s) => (
              <div className="alert-row" key={s.id}>
                {tr(s.label)}: {s.value}{s.unit}
              </div>
            )) : <div className="muted">All systems normal</div>}
          </div>
        </section>
      </div>
    </section>
  );
}

function KpiIcon({ index }) {
  const icons = [
    <path d="M8 24l6-8 5 5 5-7 6 4" stroke="#14D2B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
    <><circle cx="18" cy="18" r="9" stroke="#14D2B6" strokeWidth="2" /><path d="M18 9v9l5 5" stroke="#14D2B6" strokeWidth="2" strokeLinecap="round" /></>,
    <path d="M20 8l-6 10h6l-4 10 10-12h-6l4-8z" stroke="#14D2B6" strokeWidth="1.8" strokeLinejoin="round" fill="none" />,
    <><path d="M10 26 A10 10 0 1 1 26 26" stroke="#14D2B6" strokeWidth="2" strokeLinecap="round" fill="none" /><path d="M10 26 A10 10 0 0 1 24.7 12.5" stroke="#14D2B6" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.4" /><circle cx="18" cy="18" r="2.5" fill="#14D2B6" /></>
  ];
  return (
    <svg className="kpi-icon" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <rect width="36" height="36" rx="10" fill="rgba(20, 210, 182, 0.10)" />
      {icons[index % icons.length]}
    </svg>
  );
}

function WarmKpiIcon({ index }) {
  const icons = [
    <g>
      <ellipse cx="18" cy="22" rx="9" ry="8" fill="#FFD54F" stroke="#F9A825" strokeWidth="1.5" />
      <circle cx="18" cy="11" r="5" fill="#FFD54F" stroke="#F9A825" strokeWidth="1.5" />
      <path d="M15 6 Q16 4 18 6 Q20 4 21 6" stroke="#E53935" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M20 12 L23 13 L20 14Z" fill="#FFA726" />
      <circle cx="19.5" cy="11" r="1.2" fill="#3E2723" />
      <path d="M10 21 Q8 18 11 17 Q13 19 12 22" fill="#F9A825" stroke="#E65100" strokeWidth="0.8" />
      <path d="M15 30 L14 33 M15 30 L16 33 M21 30 L20 33 M21 30 L22 33" stroke="#FFA726" strokeWidth="1.5" strokeLinecap="round" />
    </g>,
    <g>
      <path d="M18 5 C12 5 9 11 9 17 C9 23 13 28 18 28 C23 28 27 23 27 17 C27 11 24 5 18 5Z" fill="#FFF9C4" stroke="#F9A825" strokeWidth="1.8" />
      <circle cx="18" cy="18" r="5" fill="#FFD54F" stroke="#F9A825" strokeWidth="1.2" />
      <circle cx="15" cy="15" r="1.5" fill="rgba(255,255,255,0.7)" />
    </g>,
    <g>
      <path d="M18 27 C18 27 11 19 11 13 C11 8 14 5 18 5 C22 5 25 8 25 13 C25 19 18 27 18 27Z" fill="#FFF9C4" stroke="#F9A825" strokeWidth="1.5" />
      <line x1="18" y1="27" x2="18" y2="5" stroke="#F9A825" strokeWidth="1.2" />
      <path d="M18 11 L14 9 M18 14 L13 13 M18 17 L13 17 M18 11 L22 9 M18 14 L23 13 M18 17 L23 17" stroke="#FFD54F" strokeWidth="1" strokeLinecap="round" />
      <path d="M20 9 L17 15 L20 15 L16 23" stroke="#FFA726" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>,
    <g>
      <path d="M7 15 L18 6 L29 15 L29 28 L7 28Z" fill="#FFECB3" stroke="#F9A825" strokeWidth="1.5" />
      <path d="M7 15 L18 6 L29 15" stroke="#E53935" strokeWidth="2" strokeLinejoin="round" fill="none" />
      <rect x="14" y="20" width="8" height="8" rx="4" fill="#F9A825" stroke="#E65100" strokeWidth="1.2" />
      <rect x="9" y="18" width="5" height="4" rx="1" fill="#4FC3F7" stroke="#0277BD" strokeWidth="0.8" />
      <rect x="22" y="18" width="5" height="4" rx="1" fill="#4FC3F7" stroke="#0277BD" strokeWidth="0.8" />
    </g>
  ];
  return (
    <svg className="kpi-icon" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <rect width="36" height="36" rx="12" fill="#FFF8E1" />
      {icons[index % icons.length]}
    </svg>
  );
}
