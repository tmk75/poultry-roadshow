import { useEffect, useState } from "react";
import { fetchTelemetry } from "./api.js";
import { LanguageProvider, useLanguage } from "./i18n.jsx";
import TopBar from "./components/TopBar.jsx";
import LiveLine from "./components/LiveLine.jsx";
import Agents from "./components/Agents.jsx";
import DigitalTwin from "./components/DigitalTwin.jsx";
import Presentation from "./components/Presentation.jsx";

function Shell() {
  const { t, tr, lang, toggle } = useLanguage();
  const [view, setView] = useState("line");
  const [telemetry, setTelemetry] = useState(null);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    let alive = true;
    async function load() {
      const data = await fetchTelemetry();
      if (alive) setTelemetry(data);
    }
    load();
    const id = setInterval(load, 2200);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  if (!telemetry) return <div className="loading">Loading…</div>;

  const tickerItems = [
    ...(telemetry.kpis || []).map((k) => `${tr(k.label)} ${k.value}${k.unit}`),
    ...(telemetry.feed_events || []).slice(0, 3).map(tr)
  ];

  return (
    <div className="app">
      <TopBar
        view={view}
        setView={setView}
        t={t}
        lang={lang}
        theme={theme}
        onToggleLang={toggle}
        onToggleTheme={() => setTheme((v) => (v === "dark" ? "warm" : "dark"))}
      />
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {tickerItems.concat(tickerItems).map((item, i) => (
            <span className="ticker-item" key={i}>{item}</span>
          ))}
        </div>
      </div>
      <main className="content">
        {view === "line" && <LiveLine telemetry={telemetry} tr={tr} t={t} theme={theme} />}
        {view === "agents" && <Agents telemetry={telemetry} tr={tr} t={t} theme={theme} />}
        {view === "twin" && <DigitalTwin telemetry={telemetry} tr={tr} t={t} theme={theme} />}
        {view === "roadshow" && <Presentation t={t} tr={tr} theme={theme} />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Shell />
    </LanguageProvider>
  );
}
