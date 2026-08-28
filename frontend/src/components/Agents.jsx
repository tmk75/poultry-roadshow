export default function Agents({ telemetry, tr, t, theme }) {
  const agents = telemetry.agents || [];
  const negotiation = telemetry.negotiation || [];
  const heroBg = theme === "warm" ? "url('/assets/bg/warm-agents-hero.png')" : "url('/assets/bg/agents-hero.png')";

  return (
    <section className="view active">
      <div className="hero">
        <div className="hero-bg" style={{ backgroundImage: heroBg }}></div>
        {theme === "warm" && (
          <>
            <span className="hero-deco">🤖</span>
            <span className="hero-deco-2">🐓</span>
          </>
        )}
        <div className="hero-content">
          <p className="eyebrow">{t("agents.eyebrow")}</p>
          <h1>{t("agents.title")}</h1>
          <p className="lede">{t("agents.lede")}</p>
        </div>
      </div>

      <div className="agent-grid">
        {agents.map((a, idx) => (
          <div className="agent-card" key={a.id}>
            {theme === "warm" && <WarmAgentIcon index={idx} color={a.color} />}
            <div className="agent-header">
              <span className="agent-name">{tr(a.name)}</span>
              <span className={`status-pill active`}>{tr(a.role)}</span>
            </div>
            <div className="agent-role">{tr(a.role)}</div>
            <div className="agent-state">{tr(a.state)}</div>
          </div>
        ))}
      </div>

      <section className="panel">
        <div className="panel-head"><h2>{t("agents.negotiation")}</h2></div>
        <div className="neg-feed">
          {negotiation.map((n, i) => (
            <div className="neg-row" key={i}>
              <span className={`agent-dot ${n.color}`}></span>
              <span className="neg-msg">{tr(n.text)}</span>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

function WarmAgentIcon({ index, color }) {
  const badgeColor = color === "red" ? "#E53935" : color === "amber" ? "#FFA726" : "#4FC3F7";
  return (
    <svg className="agent-icon" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <rect width="52" height="52" rx="16" fill="#FFF8E1" />
      <ellipse cx="26" cy="34" rx="12" ry="10" fill="#FFD54F" stroke="#F9A825" strokeWidth="1.5" />
      <rect x="18" y="14" width="16" height="14" rx="5" fill="#FFD54F" stroke="#F9A825" strokeWidth="1.5" />
      <line x1="26" y1="14" x2="26" y2="10" stroke="#F9A825" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="26" cy="9" r="2" fill={badgeColor} />
      <rect x="20" y="18" width="4" height="3" rx="1" fill={badgeColor} />
      <rect x="28" y="18" width="4" height="3" rx="1" fill={badgeColor} />
      {index === 0 && (
        <>
          <path d="M26 38 L22 35 L22 31 L26 29 L30 31 L30 35Z" fill="#66BB6A" stroke="#2E7D32" strokeWidth="1" />
          <path d="M24 33 L25.5 34.5 L28 31.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {index === 1 && (
        <circle cx="26" cy="34" r="5" fill="#66BB6A" stroke="#2E7D32" strokeWidth="1" />
      )}
      {index === 2 && (
        <path d="M28 28 L24 34 L27 34 L24 40 L30 33 L27 33Z" fill="#FFA726" stroke="#E65100" strokeWidth="0.8" />
      )}
      {index === 3 && (
        <g fill="#4FC3F7">
          <rect x="21" y="37" width="3" height="4" rx="1" />
          <rect x="25" y="34" width="3" height="7" rx="1" />
          <rect x="29" y="31" width="3" height="10" rx="1" />
        </g>
      )}
      <path d="M21 44 L20 48 M21 44 L22 48 M31 44 L30 48 M31 44 L32 48" stroke="#FFA726" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
