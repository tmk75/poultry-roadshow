import React, { createContext, useContext, useState } from "react";

const dict = {
  en: {
    "brand.sub": "PFA Poultry · Plant OS",
    "nav.line": "Live Line",
    "nav.agents": "AI Agents",
    "nav.twin": "Digital Twin",
    "nav.roadshow": "Presentation",
    "line.eyebrow": "One bird · one data thread · eight stages",
    "line.title": "The connected processing plant",
    "line.lede": "From live receiving to packaging, every stage is sensed, connected and optimizable.",
    "line.flowTitle": "Eight-stage data thread",
    "line.feedTitle": "Live telemetry",
    "line.alertsTitle": "Active alerts",
    "agents.eyebrow": "Agentic autonomy on the line",
    "agents.title": "AI agents with one shared objective",
    "agents.lede": "Safety and biosecurity always override energy and yield targets.",
    "agents.negotiation": "Negotiation feed",
    "twin.eyebrow": "Operations · live intelligence",
    "twin.title": "Plant performance at a glance",
    "twin.lede": "Yield, energy, uptime, and line health across the processing plant.",
    "twin.biTitle": "Operations intelligence",
    "twin.live": "Live · updates every 2s",
    "twin.trendTitle": "Line throughput trend",
    "twin.healthTitle": "Line health",
    "twin.stageTitle": "Stage performance vs target",
    "twin.alertsTitle": "Active alerts",
    "roadshow.eyebrow": "The Sunner story · built with GEA",
    "roadshow.title": "Presentation",
    "roadshow.ppt": "Download PPT",
    "roadshow.narrative": "Narrative",
    "roadshow.fullscreen": "Fullscreen",
    "roadshow.autoplay": "Autoplay",
    "roadshow.prev": "Previous",
    "roadshow.next": "Next",
    "roadshow.note": "Use the arrow keys to navigate."
  },
  zh: {
    "brand.sub": "PFA 家禽 · 工厂操作系统",
    "nav.line": "实时产线",
    "nav.agents": "AI 智能体",
    "nav.twin": "数字孪生",
    "nav.roadshow": "演示",
    "line.eyebrow": "一只禽 · 一条数据链 · 八道工序",
    "line.title": "全流程互联的加工工厂",
    "line.lede": "从活禽接收到包装，每一道工序都被感知、连接与优化。",
    "line.flowTitle": "八道工序数据链",
    "line.feedTitle": "实时遥测",
    "line.alertsTitle": "当前告警",
    "agents.eyebrow": "产线之上的智能体自治",
    "agents.title": "围绕同一目标协同的 AI 智能体",
    "agents.lede": "安全与生物安全始终优先于能耗与产出目标。",
    "agents.negotiation": "协商记录",
    "twin.eyebrow": "运营 · 实时智能",
    "twin.title": "工厂绩效一览",
    "twin.lede": "加工厂全线的出品率、能耗、稼动率与产线健康度。",
    "twin.biTitle": "运营智能",
    "twin.live": "实时 · 每 2 秒更新",
    "twin.trendTitle": "产线吞吐趋势",
    "twin.healthTitle": "产线健康度",
    "twin.stageTitle": "工位目标达成",
    "twin.alertsTitle": "活动告警",
    "roadshow.eyebrow": "圣农故事 · 与 GEA 共建",
    "roadshow.title": "演示文稿",
    "roadshow.ppt": "下载 PPT",
    "roadshow.narrative": "叙述",
    "roadshow.fullscreen": "全屏",
    "roadshow.autoplay": "自动播放",
    "roadshow.prev": "上一页",
    "roadshow.next": "下一页",
    "roadshow.note": "使用方向键翻页。"
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  const t = (key) => dict[lang][key] ?? key;
  const tr = (obj) => {
    if (!obj) return "";
    if (typeof obj === "object") return obj[lang] ?? obj.en ?? "";
    return obj;
  };
  const toggle = () => setLang((prev) => (prev === "en" ? "zh" : "en"));

  return (
    <LanguageContext.Provider value={{ lang, t, tr, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
