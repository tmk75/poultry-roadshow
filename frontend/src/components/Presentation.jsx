import { useEffect, useRef, useState } from "react";

const DECK = [
  { kicker: "GEA CHINA × Digit(AI) · PFA POULTRY", title: "GEA × Digit(AI) = the future", body: "The intelligent poultry plant — one operating system from bird to bite." },
  { kicker: "02 · The thesis", title: "Not digital plus AI.", body: "One fused layer for the whole plant — not three parallel programs." },
  { kicker: "03 · Why poultry, why now", title: "China is the proving ground.", body: "World-scale volume, exacting food safety, and a need for faster decisions." },
  { kicker: "04 · Proof", title: "Sunner is the reference.", body: "Eight live stages, one data thread, and AI agents with shared objectives." }
];

export default function Presentation({ t, tr, theme }) {
  const [mode, setMode] = useState("ppt");
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const deckRef = useRef(null);
  const slideCount = theme === "dark" ? 11 : 12;
  const slidesDir = theme === "dark" ? "slides-dark" : "slides";
  const pptxHref = theme === "dark"
    ? "/assets/GEA_DigitAI_Sunner_reauthor.pptx"
    : "/assets/GEA_DigitAI_Sunner_poultry_v4.pptx";

  useEffect(() => {
    setIndex((i) => Math.min(i, slideCount - 1));
  }, [slideCount]);

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slideCount), 6000);
    return () => clearInterval(id);
  }, [autoplay, slideCount]);

  const go = (dir) => setIndex((i) => (i + dir + slideCount) % slideCount);
  const slide = DECK[index % DECK.length];
  const heroBg = theme === "warm" ? "url('/assets/bg/warm-slide-cover.png')" : "url('/assets/bg/slide-cover.png')";

  const toggleFullscreen = () => {
    const el = deckRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

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
          <p className="eyebrow">{t("roadshow.eyebrow")}</p>
          <h1>{t("roadshow.title")}</h1>
        </div>
      </div>

      <div className="roadshow-toolbar">
        <div className="mode-switch">
          <button type="button" className={`mode-btn ${mode === "ppt" ? "active" : ""}`} onClick={() => setMode("ppt")}>PPT</button>
          <button type="button" className={`mode-btn ${mode === "story" ? "active" : ""}`} onClick={() => setMode("story")}>{t("roadshow.narrative")}</button>
        </div>
        <div className="toolbar-actions">
          <button type="button" className={`btn ${autoplay ? "active" : ""}`} onClick={() => setAutoplay((v) => !v)}>{t("roadshow.autoplay")}</button>
          <button type="button" className="btn" onClick={toggleFullscreen}>{t("roadshow.fullscreen")}</button>
          <a className="btn primary" href={pptxHref} download>{t("roadshow.ppt")}</a>
        </div>
      </div>

      <section className={`deck ${mode === "ppt" ? "deck-ppt" : "deck-story"}`} ref={deckRef}>
        {mode === "ppt" ? (
          <div className="ppt-frame"><img src={`/assets/${slidesDir}/slide-${index + 1}.png`} alt={`Slide ${index + 1}`} /></div>
        ) : (
          <div className="deck-story-content">
            <div className="deck-kicker">{slide.kicker}</div>
            <div className="deck-title">{slide.title}</div>
            <p className="deck-body">{slide.body}</p>
          </div>
        )}
      </section>

      <div className="deck-progress"><span style={{ width: `${((index + 1) / slideCount) * 100}%` }}></span></div>
      <div className="deck-controls">
        <button type="button" className="btn" onClick={() => go(-1)}>{t("roadshow.prev")}</button>
        <span className="deck-counter">{index + 1} / {slideCount}</span>
        <button type="button" className="btn primary" onClick={() => go(1)}>{t("roadshow.next")}</button>
      </div>
      <p className="deck-hint">{t("roadshow.note")}</p>
    </section>
  );
}
