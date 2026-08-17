# Skill: Industrial MQTT Schema Rules

## Scope
Defines formatting and validation rules for all edge telemetry payloads originating from Welotec egOS industrial gateways on Sunner farm sites.

## Topic Hierarchy
All telemetry topics must follow the format:
`sunner/{farm_id}/{barn_id}/{zone_id}/{telemetry_type}`

Examples:
- `sunner/farm-nanping-01/barn-03/zone-front/climate`
- `sunner/farm-nanping-01/barn-03/zone-mid/climate`
- `sunner/farm-nanping-01/barn-03/silo-01/feed`

## Payload Invariants
1. **Timestamp:** ISO-8601 UTC string (`YYYY-MM-DDTHH:MM:SS.fffZ`) or Unix millisecond integer.
2. **Schema Version:** Every payload MUST contain `schema_version: "1.0.0"`.
3. **Gateway Metadata:** Payloads must include `gateway_id` and `firmware_version`.
4. **Sensor Health:** Sensor readings must carry quality flags (`GOOD`, `DEGRADED`, `FAULT`).
5. **Payload Size:** Edge payloads must not exceed 4KB to optimize narrowband cellular/LoRa backhaul.
