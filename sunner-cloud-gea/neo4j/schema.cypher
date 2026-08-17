// Sunner Digital Twin Graph Schema Definition (Neo4j Cypher)
// Models spatial structure, sensor topologies, flock biology, and actuator states

// Constraints & Indexes
CREATE CONSTRAINT unique_farm_id IF NOT EXISTS FOR (f:Farm) REQUIRE f.id IS UNIQUE;
CREATE CONSTRAINT unique_barn_id IF NOT EXISTS FOR (b:Barn) REQUIRE b.id IS UNIQUE;
CREATE CONSTRAINT unique_zone_id IF NOT EXISTS FOR (z:Zone) REQUIRE z.id IS UNIQUE;
CREATE CONSTRAINT unique_sensor_id IF NOT EXISTS FOR (s:Sensor) REQUIRE s.id IS UNIQUE;
CREATE CONSTRAINT unique_actuator_id IF NOT EXISTS FOR (a:Actuator) REQUIRE a.id IS UNIQUE;

// Bootstrap Topology for Nanping Farm 01, Barn 03
MERGE (farm:Farm {id: "farm-nanping-01", name: "Sunner Nanping Complex 01", region: "Fujian"})
MERGE (barn:Barn {id: "barn-03", name: "Broiler House 03", capacity: 45000, length_m: 120, width_m: 16})
MERGE (farm)-[:HAS_BARN]->(barn)

MERGE (zFront:Zone {id: "zone-front", name: "Inlet & Brooding Zone", position: "FRONT"})
MERGE (zMid:Zone   {id: "zone-mid",   name: "Center Transition Zone", position: "MID"})
MERGE (zRear:Zone  {id: "zone-rear",  name: "Tunnel Exhaust Fan Zone", position: "REAR"})

MERGE (barn)-[:HAS_ZONE]->(zFront)
MERGE (barn)-[:HAS_ZONE]->(zMid)
MERGE (barn)-[:HAS_ZONE]->(zRear)

// Actuators
MERGE (fanBank1:Actuator {id: "act-fan-tunnel-01", type: "VARIABLE_FAN", max_capacity_cfm: 24000, current_speed_pct: 40.0})
MERGE (fanBank2:Actuator {id: "act-fan-tunnel-02", type: "VARIABLE_FAN", max_capacity_cfm: 24000, current_speed_pct: 40.0})
MERGE (heater1:Actuator  {id: "act-heater-front",  type: "GAS_HEATER",   power_kw: 75.0, status: "OFF"})
MERGE (pad1:Actuator     {id: "act-cool-pad-01",   type: "EVAP_PAD",     water_flow_lpm: 0.0, status: "OFF"})

MERGE (zRear)-[:HAS_ACTUATOR]->(fanBank1)
MERGE (zRear)-[:HAS_ACTUATOR]->(fanBank2)
MERGE (zFront)-[:HAS_ACTUATOR]->(heater1)
MERGE (zFront)-[:HAS_ACTUATOR]->(pad1)

// Flock Batch Node
MERGE (flock:Flock {
  id: "flock-2026-batch-08",
  breed: "Cobb500",
  bird_count: 42500,
  age_days: 26,
  target_temperature_c: 21.6,
  max_safe_nh3_ppm: 20.0,
  max_safe_co2_ppm: 3000.0
})
MERGE (barn)-[:HOUSES_FLOCK]->(flock);
