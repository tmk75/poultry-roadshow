# Skill: Multi-Agent Negotiation & Conflict Resolution Rules

## Scope
Defines the authoritative conflict resolution policy between the **Health & Biosecurity Agent** and the **Energy Optimization Agent** for Sunner Poultry Barn environmental control.

---

## Conflict Resolution Hierarchy & Invariants

```
+-------------------------------------------------------------+
| TIER 1 (CRITICAL SAFETY): Respiratory & Toxic Gas Alerts    |
|   - NH3 >= 20.0 ppm OR CO2 >= 3000 ppm                      |
|   - Action: 100% Emergency Tunnel Ventilation Forced        |
|   - OVERRIDES ALL ENERGY CONSTRAINTS UNCONDITIONALLY        |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| TIER 2 (THERMAL SAFETY): Flock Heat/Cold Stress Invariants  |
|   - Temperature deviations > ±2.5°C from target age curve   |
|   - Action: Heaters or evaporative cooling pads activated   |
|   - OVERRIDES ENERGY PEAK TARIFF CURTAILMENT               |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| TIER 3 (NORMAL OPERATIONAL OPTIMIZATION): Energy Efficiency  |
|   - Environment within nominal welfare bounds               |
|   - NH3 < 15.0 ppm, CO2 < 2000 ppm, Temp within ±1.0°C      |
|   - Action: Variable frequency fans modulated for tariffs   |
+-------------------------------------------------------------+
```

## Policy Rules
1. **Rule H-01 (Ammonia Hazard):** When ammonia ($NH_3$) exceeds $20.0\text{ ppm}$, minimum ventilation is immediately elevated to $100\%$. Energy agent requests to reduce fan speeds (even during super-peak electricity tariffs) are **REJECTED** with status `OVERRULED_BY_HEALTH_CRITICAL`.
2. **Rule H-02 (Carbon Dioxide Hazard):** When $CO_2$ exceeds $3000\text{ ppm}$, ventilation rate must increase by at least $35\%$ over baseline.
3. **Rule H-03 (Thermal Comfort Override):** If house temperature exceeds $Target + 2.5^\circ\text{C}$ or falls below $Target - 2.5^\circ\text{C}$, temperature regulation takes absolute precedence over kilowatt-hour reduction requests.
4. **Rule E-01 (Nominal Optimization):** If all Tier 1 and Tier 2 parameters are within green thresholds, the Energy Agent is permitted to shift fan speeds, stagger heating cycles, and pre-cool or pre-ventilate before peak tariff windows.
5. **Rule Audit-01 (Audit Trail):** Every resolved conflict must emit a structured decision artifact logging:
   - `timestamp`
   - `zone_id`
   - `health_proposed_action`
   - `energy_proposed_action`
   - `final_action`
   - `overriding_rule`
   - `welfare_score`
