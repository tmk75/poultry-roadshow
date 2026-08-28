import random
import time
from datetime import datetime


STAGE_DEFS = [
    {"id": "receiving", "unit": "%", "low": 92.0, "high": 99.0, "dec": 1, "delta": 0.8},
    {"id": "stunning", "unit": "A", "low": 14.0, "high": 18.0, "dec": 1, "delta": 0.5},
    {"id": "scald", "unit": "°C", "low": 51.0, "high": 54.0, "dec": 1, "delta": 0.4},
    {"id": "evisceration", "unit": "%", "low": 96.0, "high": 100.0, "dec": 1, "delta": 0.6},
    {"id": "chilling", "unit": "°C", "low": 1.0, "high": 4.0, "dec": 1, "delta": 0.6},
    {"id": "cutup", "unit": "%", "low": 74.0, "high": 80.0, "dec": 1, "delta": 0.5},
    {"id": "further", "unit": "%", "low": 95.0, "high": 99.0, "dec": 1, "delta": 0.4},
    {"id": "packaging", "unit": "%", "low": 99.0, "high": 100.0, "dec": 2, "delta": 0.05},
]


KPI_DEFS = [
    {"id": "yield", "unit": "%", "lo": 1.0, "hi": 1.9, "prefix": "+"},
    {"id": "energy", "unit": "%", "lo": 14.0, "hi": 15.6, "prefix": "−"},
    {"id": "uptime", "unit": "%", "lo": 99.0, "hi": 99.8, "prefix": ""},
    {"id": "safety", "unit": "h", "lo": 48.0, "hi": 48.0, "prefix": ""},
    {"id": "water", "unit": "%", "lo": 18.6, "hi": 20.4, "prefix": "−"},
    {"id": "decision", "unit": "×", "lo": 10.0, "hi": 11.0, "prefix": ""},
]


FEED_EVENTS = [
    ("Stage 04 vision yield holding above threshold.", "第 04 道视觉合格率保持在阈值以上。"),
    ("Chilling setpoint maintained by safety agent.", "安全智能体维持预冷设定温度。"),
    ("Energy request to raise setpoint was overridden.", "能耗智能体提高设定温度的请求已被否决。"),
    ("Plucker 04 vibration within normal range.", "04 号脱羽机振动处于正常范围。"),
    ("Packaging traceability batch verified.", "包装批次可追溯性已验证。"),
    ("Cut-up yield trending positive this shift.", "本班次分割出品率呈正向趋势。"),
    ("Water recovery loop operating at target efficiency.", "水回收回路运行于目标效率。"),
]


ALERT_MESSAGES = {
    "chilling": ("Chilling core temperature above safety limit.", "预冷中心温度超过安全限值。"),
    "evisceration": ("Vision yield below threshold at evisceration.", "掏膛工序视觉合格率低于阈值。"),
}


class TelemetrySimulator:
    def __init__(self):
        self.values = {
            s["id"]: round(random.uniform(s["low"], s["high"]), s["dec"])
            for s in STAGE_DEFS
        }

    def _step_stage(self, stage):
        current = self.values[stage["id"]]
        if stage["id"] == "chilling" and random.random() < 0.08:
            value = random.uniform(2.6, 3.6)
        else:
            value = current + random.uniform(-stage["delta"], stage["delta"])
            value = max(stage["low"], min(stage["high"], value))
        self.values[stage["id"]] = round(value, stage["dec"])

    def _status(self, stage):
        value = self.values[stage["id"]]
        if stage["id"] == "chilling" and value > 2.5:
            return "alert"
        if stage["id"] == "evisceration" and value < 95.0:
            return "warn"
        return "ok"

    def snapshot(self):
        stages = []
        for stage in STAGE_DEFS:
            self._step_stage(stage)
            stages.append(
                {
                    "id": stage["id"],
                    "value": self.values[stage["id"]],
                    "unit": stage["unit"],
                    "status": self._status(stage),
                }
            )

        kpis = []
        for kpi in KPI_DEFS:
            value = kpi["lo"] if kpi["lo"] == kpi["hi"] else round(random.uniform(kpi["lo"], kpi["hi"]), 1)
            kpis.append({"id": kpi["id"], "value": f"{kpi['prefix']}{value}", "unit": kpi["unit"]})

        now = time.strftime("%H:%M:%S")
        feed = [
            {"time": now, "en": en, "zh": zh}
            for en, zh in random.sample(FEED_EVENTS, k=2)
        ]

        alerts = []
        for stage in STAGE_DEFS:
            status = self._status(stage)
            if status in ("alert", "warn"):
                en, zh = ALERT_MESSAGES[stage["id"]]
                alerts.append({"level": status, "en": en, "zh": zh})

        return {
            "ts": datetime.now().isoformat(timespec="seconds"),
            "stages": stages,
            "kpis": kpis,
            "feed": feed,
            "alerts": alerts,
        }
