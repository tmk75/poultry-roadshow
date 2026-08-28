import { useEffect, useMemo, useState } from "react";

export default function DigitalTwin({ telemetry, tr, t, theme }) {
  const stages = telemetry.stages || [];
  const [history, setHistory] = useState(() => Array.from({ length: 24 }, (_, i) => makeThroughput(Date.now() - (23 - i) * 2200)));

  useEffect(() => {
    setHistory((prev) => [...prev.slice(-23), makeThroughput()]);
  }, [telemetry]);

  const alerts = stages.filter((s) => s.bad);
  const latest = history[history.length - 1];
  const yieldKpi = (telemetry.kpis || []).find((k) => k.id === "yield") || { value: "+1.2", unit: "%" };
  const energyKpi = (telemetry.kpis || []).find((k) => k.id === "energy") || { value: "−14.8", unit: "%" };
  const heroBg = theme === "warm" ? "url('/assets/bg/warm-twin-hero.png')" : "url('/assets/bg/twin-hero.png')";

  return (
    <section className="view active">
      <div className="hero">
        <div className="hero-bg" style={{ backgroundImage: heroBg }}></div>
        {theme === "warm" && (
          <>
            <span className="hero-deco">🐣</span>
            <span className="hero-deco-2">🐤</span>
          </>
        )}
        <div className="hero-content">
          <p className="eyebrow">{t("twin.eyebrow")}</p>
          <h1>{t("twin.title")}</h1>
          <p className="lede">{t("twin.lede")}</p>
        </div>
      </div>

      <section className="panel">
        <div className="panel-head">
          <h2>{t("twin.biTitle")}</h2>
          <span className="bi-live">{t("twin.live")}</span>
        </div>

        <div className="bi-kpis">
          <KpiCard label={tr({ en: "Line throughput", zh: "产线吞吐" })} value={latest.toLocaleString("en-US")} unit="birds/hr" foot={tr({ en: "live", zh: "实时" })} />
          <KpiCard label={tr({ en: "Active alerts", zh: "活动告警" })} value={String(alerts.length)} unit="" foot={alerts.length ? tr({ en: "needs action", zh: "需处理" }) : tr({ en: "all clear", zh: "无" })} alert={alerts.length > 0} />
          <KpiCard label={tr({ en: "Meat yield", zh: "肉品出品率" })} value={yieldKpi.value} unit={yieldKpi.unit} foot={tr({ en: "vs target", zh: "对目标" })} />
          <KpiCard label={tr({ en: "Energy saving", zh: "节能" })} value={energyKpi.value} unit={energyKpi.unit} foot={tr({ en: "vs target", zh: "对目标" })} />
        </div>

        <div className="bi-grid">
          <article className="bi-card bi-card--wide">
            <header className="bi-card-head"><h3>{t("twin.trendTitle")}</h3></header>
            <TrendChart values={history} target={12500} label={t("twin.trendTitle")} />
          </article>
          <article className="bi-card">
            <header className="bi-card-head"><h3>{t("twin.healthTitle")}</h3></header>
            <HealthGauge stages={stages} tr={tr} />
          </article>
          <article className="bi-card bi-card--wide">
            <header className="bi-card-head"><h3>{t("twin.stageTitle")}</h3></header>
            <StageBars stages={stages} tr={tr} />
          </article>
          <article className="bi-card">
            <header className="bi-card-head"><h3>{t("twin.alertsTitle")}</h3></header>
            <AlertsPanel stages={stages} feed={telemetry.feed_events || []} tr={tr} />
          </article>
        </div>

        <div className="bi-table-wrap">
          <table className="bi-table">
            <thead>
              <tr>
                <th>{tr({ en: "Stage", zh: "工位" })}</th>
                <th>{tr({ en: "Metric", zh: "指标" })}</th>
                <th>{tr({ en: "Current", zh: "当前值" })}</th>
                <th>{tr({ en: "Target", zh: "目标范围" })}</th>
                <th>{tr({ en: "Status", zh: "状态" })}</th>
                <th>{tr({ en: "Score", zh: "得分" })}</th>
              </tr>
            </thead>
            <tbody>
              {stages.map((s) => {
                const score = scoreForReading(s);
                const color = scoreColor(score);
                return (
                  <tr key={s.id}>
                    <td><span className="bi-stage-num">{s.num}</span> {tr(s.short || s.label)}</td>
                    <td>{tr(s.metric)}</td>
                    <td className="mono">{s.value}{s.unit}</td>
                    <td className="mono muted">{s.min}–{s.max}{s.unit}</td>
                    <td><span className="bi-status-dot" style={{ background: s.bad ? "var(--red)" : "var(--teal)" }}></span> {s.bad ? tr({ en: "Alert", zh: "告警" }) : tr({ en: "OK", zh: "正常" })}</td>
                    <td className="bi-score">
                      <span className="bi-score-bar"><span style={{ width: `${score}%`, background: color }}></span></span>
                      <span className="mono">{Math.round(score)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

function makeThroughput(t = Date.now()) {
  return Math.round(12000 + Math.sin(t / 60000) * 900 + Math.sin(t / 17000) * 220);
}

function scoreForReading(s) {
  const range = s.max - s.min || 1;
  const mid = (s.min + s.max) / 2;
  const dev = Math.abs(Number(s.value || 0) - mid);
  return Math.max(0, Math.min(100, 100 - (dev / range) * 200));
}

function scoreColor(score) {
  return score >= 80 ? "var(--teal)" : score >= 60 ? "var(--amber)" : "var(--red)";
}

function KpiCard({ label, value, unit, foot, alert }) {
  return (
    <div className={`bi-kpi ${alert ? "alert" : ""}`}>
      <span className="bi-kpi-label">{label}</span>
      <strong className="bi-kpi-value">{value}<small>{unit}</small></strong>
      <span className="bi-kpi-foot">{foot}</span>
    </div>
  );
}

function TrendChart({ values, target, label }) {
  const w = 760;
  const h = 190;
  const pad = 16;
  const all = [...values, target];
  const min = Math.min(...all) - 200;
  const max = Math.max(...all) + 200;
  const span = max - min || 1;
  const x = (i) => pad + (i / (values.length - 1)) * (w - pad * 2);
  const y = (v) => h - pad - ((v - min) / span) * (h - pad * 2);
  const line = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  return (
    <svg className="bi-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label={label}>
      {[0, 1, 2, 3].map((g) => {
        const gy = pad + (g / 3) * (h - pad * 2);
        return <line key={g} x1={pad} y1={gy} x2={w - pad} y2={gy} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 5" />;
      })}
      <line x1={pad} y1={y(target)} x2={w - pad} y2={y(target)} stroke="var(--amber)" strokeWidth="2" strokeDasharray="6 5" />
      <polyline points={line} fill="none" stroke="var(--teal)" strokeWidth="3" strokeLinejoin="round" />
      <circle cx={x(values.length - 1)} cy={y(values[values.length - 1])} r="4" fill="var(--teal)" />
    </svg>
  );
}

function HealthGauge({ stages, tr }) {
  const alerts = stages.filter((s) => s.bad).length;
  const health = Math.round(((stages.length - alerts) / stages.length) * 100);
  const color = health >= 90 ? "var(--teal)" : health >= 70 ? "var(--amber)" : "var(--red)";
  const r = 54;
  const c = 2 * Math.PI * r;
  const filled = (health / 100) * c;

  return (
    <>
      <div className="bi-gauge-wrap">
        <svg className="bi-gauge-svg" viewBox="0 0 140 140" role="img" aria-label={`${health}%`}>
          <circle cx="70" cy="70" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="12" />
          <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${filled} ${c}`} transform="rotate(-90 70 70)" />
        </svg>
        <div className="bi-gauge-center"><strong>{health}%</strong><span>{tr({ en: "healthy", zh: "健康" })}</span></div>
      </div>
      <p className="bi-gauge-note">{alerts ? `${alerts} ${tr({ en: "stations need attention", zh: "个工位需关注" })}` : tr({ en: "All stations within target", zh: "所有工位处于目标范围内" })}</p>
    </>
  );
}

function StageBars({ stages, tr }) {
  return (
    <div className="bi-bars">
      {stages.map((s) => {
        const score = scoreForReading(s);
        return (
          <div className="bi-bar-row" key={s.id}>
            <span className="bi-bar-label">{tr(s.short || s.label)}</span>
            <span className="bi-bar-track"><span className="bi-bar-fill" style={{ width: `${score}%`, background: scoreColor(score) }}></span></span>
            <span className="bi-bar-value">{Math.round(score)}</span>
          </div>
        );
      })}
    </div>
  );
}

function AlertsPanel({ stages, feed, tr }) {
  const bad = stages.filter((s) => s.bad);
  const items = bad.map((s) => ({
    color: "var(--red)",
    text: `${tr(s.short || s.label)}: ${s.value}${s.unit} ${tr({ en: "outside target", zh: "超出目标" })}`
  }));
  feed.slice(0, 3).forEach((f) => items.push({ color: "var(--teal)", text: tr(f) }));
  if (!items.length) items.push({ color: "var(--teal)", text: tr({ en: "All systems normal", zh: "所有系统正常" }) });

  return (
    <div className="bi-alerts">
      {items.slice(0, 5).map((item, i) => (
        <div className="bi-alert" key={i}>
          <span className="bi-alert-dot" style={{ background: item.color }}></span>
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
}
