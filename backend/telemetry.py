import random
import time
from datetime import datetime, timezone


STAGES = [
    {"id": "receiving", "num": "01", "label": {"en": "Live Receiving", "zh": "活禽接收"}, "short": {"en": "Receiving", "zh": "接收"}, "metric": {"en": "Welfare score", "zh": "福利评分"}, "unit": "%", "min": 92, "max": 99},
    {"id": "stunning", "num": "02", "label": {"en": "Stunning", "zh": "致晕"}, "short": {"en": "Stunning", "zh": "致晕"}, "metric": {"en": "Current", "zh": "电流"}, "unit": "A", "min": 14, "max": 18},
    {"id": "scald", "num": "03", "label": {"en": "Scald & Pluck", "zh": "浸烫与脱羽"}, "short": {"en": "Scald", "zh": "浸烫"}, "metric": {"en": "Water temp", "zh": "水温"}, "unit": "°C", "min": 51, "max": 54},
    {"id": "evisceration", "num": "04", "label": {"en": "Evisceration", "zh": "掏膛"}, "short": {"en": "Evisceration", "zh": "掏膛"}, "metric": {"en": "Vision yield", "zh": "视觉合格率"}, "unit": "%", "min": 96, "max": 100},
    {"id": "chilling", "num": "05", "label": {"en": "Chilling", "zh": "预冷"}, "short": {"en": "Chilling", "zh": "预冷"}, "metric": {"en": "Core temp", "zh": "中心温度"}, "unit": "°C", "min": 1, "max": 4},
    {"id": "cutup", "num": "06", "label": {"en": "Cut-up · Debone", "zh": "分割·剔骨"}, "short": {"en": "Cut-up", "zh": "分割"}, "metric": {"en": "Yield", "zh": "出品率"}, "unit": "%", "min": 74, "max": 80},
    {"id": "further", "num": "07", "label": {"en": "Further Processing", "zh": "调理加工"}, "short": {"en": "Further", "zh": "调理"}, "metric": {"en": "Quality", "zh": "质量指数"}, "unit": "%", "min": 95, "max": 99},
    {"id": "packaging", "num": "08", "label": {"en": "Packaging", "zh": "包装"}, "short": {"en": "Packaging", "zh": "包装"}, "metric": {"en": "Traceability", "zh": "可追溯率"}, "unit": "%", "min": 99, "max": 100},
]


KPIS = [
    {"id": "yield", "label": {"en": "Meat yield", "zh": "肉品出品率"}, "value": "+1.2", "unit": "%", "target": {"en": "+1–2%", "zh": "+1–2%"}, "trend": "up", "good": True},
    {"id": "energy", "label": {"en": "Energy", "zh": "能耗"}, "value": "−14.8", "unit": "%", "target": {"en": "−15%", "zh": "−15%"}, "trend": "down", "good": True},
    {"id": "uptime", "label": {"en": "Line uptime", "zh": "产线稼动率"}, "value": "99.2", "unit": "%", "target": {"en": "99%+", "zh": "99%+"}, "trend": "flat", "good": True},
    {"id": "safety", "label": {"en": "Food safety", "zh": "食品安全"}, "value": "48", "unit": "h", "target": {"en": "48h earlier", "zh": "提前48小时"}, "trend": "up", "good": True},
]


AGENTS = [
    {"id": "safety", "name": {"en": "Safety & Health", "zh": "安全与健康"}, "role": {"en": "Ammonia, welfare, food safety", "zh": "氨气、福利、食品安全"}, "color": "red", "state": {"en": "Holding chill at 2.1°C after salmonella signal.", "zh": "检测到沙门氏菌信号，保持预冷 2.1°C。"}},
    {"id": "yield", "name": {"en": "Yield Optimizer", "zh": "出品率优化"}, "role": {"en": "Vision grading, cut-up yield", "zh": "视觉分级、分割出品率"}, "color": "teal", "state": {"en": "Suggesting +0.4% cut pattern for breast fillets.", "zh": "建议调整胸肉分割方案，提升 0.4%。"}},
    {"id": "energy", "name": {"en": "Energy Arbitrage", "zh": "能耗优化"}, "role": {"en": "TOU tariffs, chilling setpoints", "zh": "分时电价、预冷设定"}, "color": "amber", "state": {"en": "Wants to raise chill setpoint to save power.", "zh": "希望提高预冷温度以节省电力。"}},
    {"id": "maintenance", "name": {"en": "Predictive Maintenance", "zh": "预测性维护"}, "role": {"en": "Pluckers, pumps, compressors", "zh": "脱羽机、泵、压缩机"}, "color": "teal", "state": {"en": "Plucker 4 vibration trending up; no action needed yet.", "zh": "4 号脱羽机振动上升，暂无需处理。"}},
]


FEED_EVENTS = [
    {"en": "Stage 04 vision yield improved to 98.1%.", "zh": "第 04 道视觉合格率提升至 98.1%。"},
    {"en": "Chilling setpoint held at 2.1°C by safety agent.", "zh": "安全智能体将预冷温度维持在 2.1°C。"},
    {"en": "Energy agent requests setpoint increase — overridden.", "zh": "能耗智能体请求提高设定值 —— 已否决。"},
    {"en": "Plucker 04 vibration within normal range.", "zh": "04 号脱羽机振动处于正常范围。"},
    {"en": "Packaging traceability batch verified.", "zh": "包装批次可追溯性已验证。"},
]


NEGOTIATION = [
    {"color": "amber", "text": {"en": "Energy: raise chill from 2.1°C to 3.0°C to cut 6% power.", "zh": "能耗：将预冷温度从 2.1°C 提高至 3.0°C，可节电 6%。"}},
    {"color": "red", "text": {"en": "Safety: veto. Salmonella signal requires ≤2.5°C.", "zh": "安全：否决。沙门氏菌信号要求温度 ≤2.5°C。"}},
    {"color": "teal", "text": {"en": "Coordinator: safety wins; energy waits for next valley tariff.", "zh": "协调器：安全优先；能耗优化等待下一谷时电价。"}},
]


class TelemetrySimulator:
    def __init__(self):
        self.values = {
            s["id"]: round(random.uniform(s["min"], s["max"]), 1)
            for s in STAGES
        }

    def _step_stage(self, stage):
        current = self.values[stage["id"]]
        if stage["id"] == "chilling" and random.random() < 0.08:
            value = random.uniform(2.6, 3.6)
        else:
            delta = (stage["max"] - stage["min"]) * 0.06
            value = current + random.uniform(-delta, delta)
            value = max(stage["min"], min(stage["max"], value))
        self.values[stage["id"]] = round(value, 1)

    def snapshot(self):
        for stage in STAGES:
            self._step_stage(stage)

        stages = []
        for stage in STAGES:
            value = self.values[stage["id"]]
            bad = stage["id"] == "chilling" and value > 2.5
            stages.append({
                "id": stage["id"],
                "num": stage["num"],
                "label": stage["label"],
                "short": stage["short"],
                "metric": stage["metric"],
                "unit": stage["unit"],
                "min": stage["min"],
                "max": stage["max"],
                "value": value,
                "bad": bad,
            })

        return {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "stages": stages,
            "kpis": KPIS,
            "agents": AGENTS,
            "feed_events": FEED_EVENTS,
            "negotiation": NEGOTIATION,
        }
