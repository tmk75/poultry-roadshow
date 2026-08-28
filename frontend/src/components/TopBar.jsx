import { useEffect, useState } from "react";

export default function TopBar({ view, setView, t, lang, theme, onToggleLang, onToggleTheme }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const tabs = [
    ["line", "nav.line"],
    ["agents", "nav.agents"],
    ["twin", "nav.twin"],
    ["roadshow", "nav.roadshow"]
  ];

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark">GEA <span className="gea">×</span> Digit(AI)</span>
        <span className="brand-sub">{t("brand.sub")}</span>
      </div>
      <nav className="tabs" aria-label="Primary navigation">
        {tabs.map(([id, key]) => (
          <button
            key={id}
            type="button"
            className={`tab ${view === id ? "active" : ""}`}
            onClick={() => setView(id)}
          >
            {t(key)}
          </button>
        ))}
      </nav>
      <div className="topbar-actions">
        <span className="live-badge"><span className="live-dot"></span>LIVE</span>
        <span className="clock">{now.toLocaleTimeString("en-GB")}</span>
        <button type="button" className="lang-toggle" onClick={onToggleTheme}>
          {theme === "dark" ? "Warm" : "Dark"}
        </button>
        <button type="button" className="lang-toggle" onClick={onToggleLang}>
          {lang === "en" ? "中文" : "EN"}
        </button>
      </div>
    </header>
  );
}
