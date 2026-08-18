/**
 * Sunner Intelligence • AAA-Grade 3D Cyber-Physical Roadshow Universe
 * Three.js WebGL Engine:
 * - Ultra-high-fidelity 13 procedural 3D models with active micro-animations
 * - High-definition floating 3D canvas labels with glowing glass capsules
 * - Volumetric multi-directional glowing conduits and high-arcing direct IIoT bypasses
 * - Live reactive simulation states (Ammonia slider, Power tariff modulation, SAP Auto-PO)
 * - Interactive 3D Zoom In/Out/Reset, Mouse Wheel Zoom, and Smooth Keynote Camera Choreography
 */

class Highway3DEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.nodes = [];
    this.nodeMeshes = [];
    this.nodeMap = {};
    this.conduits = [];
    this.conduitSplines = [];
    this.particles = [];
    this.orbitingObjects = [];
    this.animatedFans = [];

    this.activeNodeIndex = 0;
    this.hoveredNodeIndex = -1;

    // Camera initial position & zoom defaults
    this.defaultCameraPos = new THREE.Vector3(0, 160, 340);
    this.defaultLookAt = new THREE.Vector3(0, 15, 0);

    this.targetCameraPos = new THREE.Vector3(0, 160, 340);
    this.currentCameraPos = new THREE.Vector3(0, 160, 340);
    this.targetLookAt = new THREE.Vector3(0, 15, 0);
    this.currentLookAt = new THREE.Vector3(0, 15, 0);

    this.autoTour = false;
    this.autoTourTimer = 0;
    this.autoTourInterval = 6.0;
    this.crisisMode = false;
    this.isUserInteracting = false;
    this.fanSpeedMultiplier = 1.0;

    this.init();
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || 540;

    // 1. Scene & Atmospheric GEA Deep Blue Fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x020224);
    this.scene.fog = new THREE.FogExp2(0x020224, 0.0012);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 3500);
    this.camera.position.copy(this.currentCameraPos);

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 4. Volumetric GEA Blue & White Lighting
    const ambientLight = new THREE.AmbientLight(0x03038b, 2.4);
    this.scene.add(ambientLight);

    const whiteKeyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    whiteKeyLight.position.set(200, 320, 150);
    this.scene.add(whiteKeyLight);

    const geaFillLight = new THREE.DirectionalLight(0x2563eb, 2.8);
    geaFillLight.position.set(-200, 240, -150);
    this.scene.add(geaFillLight);

    const centerPointLight = new THREE.PointLight(0x38bdf8, 2.8, 1100);
    centerPointLight.position.set(0, 120, 0);
    this.scene.add(centerPointLight);

    // 5. Floor Grid with Illuminated Center Rings
    this.buildCyberGrid();

    // 6. Build the 13 Procedural 3D Architectural Nodes
    this.buildArchitectural3DNodes();

    // 7. Build Multi-Directional 3D Conduits
    this.buildMultiDirectionalConduits();

    // 8. Spawn Flowing 3D Particles
    this.spawnParticles(110);

    // 9. Interaction Listeners
    this.initInteraction();

    // 10. Resize
    window.addEventListener('resize', () => this.onResize());

    // Start 60FPS Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  buildCyberGrid() {
    const grid = new THREE.GridHelper(1400, 70, 0xffffff, 0x03038b);
    grid.position.y = -25;
    grid.material.opacity = 0.28;
    grid.material.transparent = true;
    this.scene.add(grid);

    // Concentric Center Rings in GEA Blue & White
    const circleGeo = new THREE.RingGeometry(135, 138, 64);
    const circleMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.45 });
    const circleMesh = new THREE.Mesh(circleGeo, circleMat);
    circleMesh.rotation.x = Math.PI / 2;
    circleMesh.position.y = -24;
    this.scene.add(circleMesh);
  }

  // Create High-Definition 3D Canvas Floating Text Sprites in GEA Blue & White
  createHighResFloatingLabel(numStr, nameStr, subStr, colorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');

    // Deep GEA Blue Pill Background Container with Crisp White Border
    ctx.fillStyle = 'rgba(3, 3, 139, 0.92)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(12, 12, 488, 136, 24);
    ctx.fill();
    ctx.stroke();

    // Left Number Pill in Crisp White
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(24, 24, 60, 48, 12);
    ctx.fill();

    ctx.fillStyle = '#03038b';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(numStr, 54, 48);

    // Title Text in Pure White
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(nameStr, 96, 50);

    // Subtitle Text in Crisp Ice
    ctx.fillStyle = '#e0e7ff';
    ctx.font = '600 20px sans-serif';
    ctx.fillText(subStr, 28, 115);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(38, 12, 1);
    return sprite;
  }

  buildArchitectural3DNodes() {
    const nodeDefs = [
      // Level 0-2 (Shopfloor & Edge)
      { id: 'sensors', num: '01', name: 'Sensors & PLCs', sub: 'Modbus 10ms • Pt100 • Silos', color: 0x2dd4bf, pos: [-360, 0, 110], type: 'barn' },
      { id: 'edge', num: '02', name: 'Welotec Edge', sub: 'MQTT Sparkplug B • TLS 1.3', color: 0xfb923c, pos: [-250, 8, -40], type: 'edge' },
      { id: 'scada', num: '03', name: 'SCADA & HMI', sub: 'Ignition OPC-UA • Real-Time Tags', color: 0x22d3ee, pos: [-145, 5, 90], type: 'scada' },
      { id: 'hist', num: '04', name: 'OSIsoft PI', sub: '5-Yr Time Series • Swinging Door', color: 0x7dd3fc, pos: [-40, 15, -60], type: 'historian' },

      // Level 3-4 (Operations & ERP)
      { id: 'mes', num: '05', name: 'MES Execution', sub: 'Flock Lifecycle • Cobb500 Batch', color: 0xa78bfa, pos: [-190, 20, 220], type: 'mes' },
      { id: 'mom', num: '06', name: 'MOM (Operations)', sub: 'Multi-Barn Dispatch • Scheduling', color: 0xfbbf24, pos: [-65, 22, 170], type: 'mom' },
      { id: 'sap', num: '07', name: 'SAP S/4HANA', sub: 'ERP Ledger • BAPI_PO_CREATE1', color: 0x34d399, pos: [65, 25, 230], type: 'sap' },

      // Level 5 (Enterprise Cloud & Semantics)
      { id: 'snowflake', num: '08', name: 'Snowflake Cloud', sub: 'Medallion Lake • Snowpipe Stream', color: 0x38bdf8, pos: [65, 30, -70], type: 'snowflake' },
      { id: 'foundry', num: '09', name: 'Palantir Foundry', sub: 'Semantics & Action Orchestration', color: 0x818cf8, pos: [170, 32, 60], type: 'foundry' },
      { id: 'ontology', num: '10', name: 'Enterprise Ontology', sub: '142k Objects • Farm-to-Fork Links', color: 0xf472b6, pos: [275, 28, -60], type: 'ontology' },

      // Level 6 (Intelligence & Decision Apps)
      { id: 'twin', num: '11', name: 'Digital Twin', sub: 'Neo4j CFD Airflow & Thermal Mesh', color: 0xa3e635, pos: [180, 15, 240], type: 'twin' },
      { id: 'ml', num: '12', name: 'Cortex AI Core', sub: 'Multi-Agent Consensus (310ms)', color: 0xe879f9, pos: [290, 38, 120], type: 'cortex' },
      { id: 'dash', num: '13', name: 'Executive BI', sub: 'Role Apps • Certified ISO 14064', color: 0x60a5fa, pos: [385, 20, 240], type: 'dash' }
    ];

    nodeDefs.forEach((def, index) => {
      const group = new THREE.Group();
      group.position.set(...def.pos);

      // Base Floating Hexagon Platform
      const hexGeo = new THREE.CylinderGeometry(20, 22, 4, 6);
      const hexMat = new THREE.MeshStandardMaterial({
        color: 0x080f20,
        roughness: 0.2,
        metalness: 0.9,
        emissive: def.color,
        emissiveIntensity: 0.35
      });
      const hexBase = new THREE.Mesh(hexGeo, hexMat);
      group.add(hexBase);

      // Glowing Neon Energy Ring around Base
      const ringGeo = new THREE.TorusGeometry(24, 1.0, 8, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: def.color, transparent: true, opacity: 0.85 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);

      // High-Definition Floating 3D Label
      const labelColor = `#${def.color.toString(16).padStart(6, '0')}`;
      const sprite = this.createHighResFloatingLabel(def.num, def.name, def.sub, labelColor);
      sprite.position.set(0, 42, 0);
      group.add(sprite);

      const coreMesh = new THREE.Group();

      // ===============================================================
      // 13 PROCEDURAL 3D ARCHITECTURAL MODELS
      // ===============================================================
      if (def.type === 'barn') {
        // NODE 1: 3D POULTRY BARN WITH SPINNING VENTILATION FAN
        const barnBody = new THREE.Mesh(
          new THREE.BoxGeometry(26, 13, 17),
          new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7, roughness: 0.3 })
        );
        barnBody.position.y = 10;
        coreMesh.add(barnBody);

        const roof = new THREE.Mesh(
          new THREE.ConeGeometry(18, 9, 4),
          new THREE.MeshStandardMaterial({ color: 0x2dd4bf, emissive: 0x2dd4bf, emissiveIntensity: 0.4, wireframe: true })
        );
        roof.position.y = 19;
        roof.rotation.y = Math.PI / 4;
        coreMesh.add(roof);

        const fan = new THREE.Mesh(
          new THREE.BoxGeometry(8, 1.5, 0.8),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
        );
        fan.position.set(13.2, 10, 0);
        fan.rotation.y = Math.PI / 2;
        coreMesh.add(fan);
        this.animatedFans.push(fan);

      } else if (def.type === 'edge') {
        // NODE 2: WELOTEC EDGE GATEWAY WITH PULSING RADIO RINGS
        const server = new THREE.Mesh(
          new THREE.BoxGeometry(16, 18, 12),
          new THREE.MeshStandardMaterial({ color: 0x7c2d12, emissive: 0xfb923c, emissiveIntensity: 0.4 })
        );
        server.position.y = 13;
        coreMesh.add(server);

        const ant = new THREE.Mesh(
          new THREE.CylinderGeometry(0.8, 0.8, 14, 8),
          new THREE.MeshBasicMaterial({ color: 0xfb923c })
        );
        ant.position.set(5, 26, 0);
        coreMesh.add(ant);

        const wave = new THREE.Mesh(
          new THREE.TorusGeometry(9, 0.6, 8, 24),
          new THREE.MeshBasicMaterial({ color: 0xfb923c, transparent: true, opacity: 0.6 })
        );
        wave.position.set(5, 33, 0);
        wave.rotation.x = Math.PI / 2;
        coreMesh.add(wave);
        this.orbitingObjects.push({ mesh: wave, type: 'pulse_wave' });

      } else if (def.type === 'scada') {
        // NODE 3: SCADA HOLOGRAPHIC DISPLAY PODIUM
        const stand = new THREE.Mesh(
          new THREE.CylinderGeometry(4, 6, 12, 12),
          new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 })
        );
        stand.position.y = 8;
        coreMesh.add(stand);

        const screen = new THREE.Mesh(
          new THREE.PlaneGeometry(18, 11),
          new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x22d3ee, emissiveIntensity: 0.7, side: THREE.DoubleSide, wireframe: true })
        );
        screen.position.set(0, 16, 2);
        screen.rotation.x = -0.3;
        coreMesh.add(screen);

      } else if (def.type === 'historian') {
        // NODE 4: OSISOFT PI PROCESS HISTORIAN (ROTATING DISKS)
        for (let d = 0; d < 3; d++) {
          const disk = new THREE.Mesh(
            new THREE.CylinderGeometry(11 - d * 1.5, 11 - d * 1.5, 3, 16),
            new THREE.MeshStandardMaterial({ color: 0x0284c7, emissive: 0x7dd3fc, emissiveIntensity: 0.5, metalness: 0.8 })
          );
          disk.position.y = 8 + d * 5;
          coreMesh.add(disk);
          this.orbitingObjects.push({ mesh: disk, type: 'disk_rotate', dir: d % 2 === 0 ? 1 : -1 });
        }

      } else if (def.type === 'mes') {
        // NODE 5: MES FLOCK LIFECYCLE BATCH PLATFORM
        const platform = new THREE.Mesh(
          new THREE.BoxGeometry(16, 4, 16),
          new THREE.MeshStandardMaterial({ color: 0x312e81, emissive: 0xa78bfa, emissiveIntensity: 0.4 })
        );
        platform.position.y = 6;
        coreMesh.add(platform);

        const batchCube = new THREE.Mesh(
          new THREE.DodecahedronGeometry(8, 0),
          new THREE.MeshStandardMaterial({ color: 0xa78bfa, emissive: 0xa78bfa, emissiveIntensity: 0.7, wireframe: true })
        );
        batchCube.position.y = 16;
        coreMesh.add(batchCube);
        this.orbitingObjects.push({ mesh: batchCube, type: 'spin_slow' });

      } else if (def.type === 'mom') {
        // NODE 6: MOM OPERATIONS MATRIX HUB
        const momCore = new THREE.Mesh(
          new THREE.BoxGeometry(14, 14, 14),
          new THREE.MeshStandardMaterial({ color: 0x78350f, emissive: 0xfbbf24, emissiveIntensity: 0.6, wireframe: true })
        );
        momCore.position.y = 14;
        coreMesh.add(momCore);
        this.orbitingObjects.push({ mesh: momCore, type: 'spin_slow' });

      } else if (def.type === 'sap') {
        // NODE 7: SAP S/4HANA GOLDEN ERP WITH 3 ORBITING GOLD COINS
        const goldVault = new THREE.Mesh(
          new THREE.OctahedronGeometry(13, 0),
          new THREE.MeshStandardMaterial({ color: 0x34d399, emissive: 0x059669, emissiveIntensity: 0.8, metalness: 0.95, roughness: 0.1 })
        );
        goldVault.position.y = 15;
        coreMesh.add(goldVault);
        this.orbitingObjects.push({ mesh: goldVault, type: 'spin_slow' });

        for (let c = 0; c < 3; c++) {
          const coin = new THREE.Mesh(
            new THREE.CylinderGeometry(3, 3, 0.6, 12),
            new THREE.MeshStandardMaterial({ color: 0x6ee7b7, emissive: 0x10b981, emissiveIntensity: 0.9 })
          );
          coreMesh.add(coin);
          this.orbitingObjects.push({ mesh: coin, type: 'orbit_satellite', radius: 18, speed: 1.5 + c * 0.3, offset: (c * Math.PI * 2) / 3 });
        }

      } else if (def.type === 'snowflake') {
        // NODE 8: SNOWFLAKE CRYSTAL LAKEHOUSE WITH MEDALLION RINGS
        const crystal = new THREE.Mesh(
          new THREE.IcosahedronGeometry(14, 0),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.8, wireframe: true })
        );
        crystal.position.y = 15;
        coreMesh.add(crystal);
        this.orbitingObjects.push({ mesh: crystal, type: 'spin_slow' });

        const medRing = new THREE.Mesh(
          new THREE.TorusGeometry(18, 0.6, 6, 24),
          new THREE.MeshBasicMaterial({ color: 0x60a5fa })
        );
        medRing.position.y = 15;
        medRing.rotation.x = Math.PI / 3;
        coreMesh.add(medRing);
        this.orbitingObjects.push({ mesh: medRing, type: 'spin_ring' });

      } else if (def.type === 'foundry') {
        // NODE 9: PALANTIR FOUNDRY GEODESIC CONSTELLATION
        const poly = new THREE.Mesh(
          new THREE.IcosahedronGeometry(11, 1),
          new THREE.MeshStandardMaterial({ color: 0x818cf8, emissive: 0x6366f1, emissiveIntensity: 0.6, wireframe: true })
        );
        poly.position.y = 15;
        coreMesh.add(poly);
        this.orbitingObjects.push({ mesh: poly, type: 'spin_slow' });

      } else if (def.type === 'ontology') {
        // NODE 10: ENTERPRISE ONTOLOGY OBJECT GRAPH SPHERE
        const ontSphere = new THREE.Mesh(
          new THREE.SphereGeometry(12, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0xf472b6, emissive: 0xdb2777, emissiveIntensity: 0.7, wireframe: true })
        );
        ontSphere.position.y = 15;
        coreMesh.add(ontSphere);
        this.orbitingObjects.push({ mesh: ontSphere, type: 'spin_slow' });

      } else if (def.type === 'twin') {
        // NODE 11: NEO4J 3D SPATIAL DIGITAL TWIN
        const twinSphere = new THREE.Mesh(
          new THREE.SphereGeometry(12, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0xa3e635, emissive: 0x65a30d, emissiveIntensity: 0.6, wireframe: true })
        );
        twinSphere.position.y = 15;
        coreMesh.add(twinSphere);
        this.orbitingObjects.push({ mesh: twinSphere, type: 'spin_slow' });

      } else if (def.type === 'cortex') {
        // NODE 12: CORTEX AI WITH 4 ORBITING SMART AGENTS
        const aiCore = new THREE.Mesh(
          new THREE.SphereGeometry(14, 24, 24),
          new THREE.MeshStandardMaterial({ color: 0xe879f9, emissive: 0xc026d3, emissiveIntensity: 1.2, roughness: 0.1 })
        );
        aiCore.position.y = 16;
        coreMesh.add(aiCore);
        this.orbitingObjects.push({ mesh: aiCore, type: 'spin_slow' });

        const agentColors = [0xef4444, 0xf59e0b, 0x3b82f6, 0x10b981];
        for (let a = 0; a < 4; a++) {
          const drone = new THREE.Mesh(
            new THREE.SphereGeometry(2.5, 8, 8),
            new THREE.MeshBasicMaterial({ color: agentColors[a] })
          );
          coreMesh.add(drone);
          this.orbitingObjects.push({ mesh: drone, type: 'orbit_satellite', radius: 24, speed: 2.0, offset: (a * Math.PI * 2) / 4 });
        }

      } else if (def.type === 'dash') {
        // NODE 13: DASHBOARDS & BI WALL
        const dashWall = new THREE.Mesh(
          new THREE.BoxGeometry(20, 14, 2),
          new THREE.MeshStandardMaterial({ color: 0x1e3a8a, emissive: 0x60a5fa, emissiveIntensity: 0.7, wireframe: true })
        );
        dashWall.position.y = 15;
        coreMesh.add(dashWall);
        this.orbitingObjects.push({ mesh: dashWall, type: 'spin_slow' });
      }

      group.add(coreMesh);
      group.userData = { ...def, coreMesh, ring, hexBase, index };

      this.scene.add(group);
      this.nodes.push(group);
      this.nodeMap[def.id] = group;
      this.nodeMeshes.push(hexBase);
    });
  }

  buildMultiDirectionalConduits() {
    this.conduitSplines = [];

    const edgeDefs = [
      // 1. Telemetry & Sensor Climate Flow (Ice Cyan 0x00f2fe)
      { from: 'sensors', to: 'edge', color: 0x00f2fe, archY: 20 },
      { from: 'edge', to: 'scada', color: 0x00f2fe, archY: 20 },
      { from: 'scada', to: 'hist', color: 0x00f2fe, archY: 20 },
      { from: 'edge', to: 'snowflake', color: 0x00f2fe, archY: 85 },

      // 2. Operations, ERP & Silo Inventory Flow (Golden Amber 0xf59e0b)
      { from: 'scada', to: 'mes', color: 0xf59e0b, archY: 25 },
      { from: 'mes', to: 'mom', color: 0xf59e0b, archY: 20 },
      { from: 'mom', to: 'sap', color: 0xf59e0b, archY: 20 },
      { from: 'sap', to: 'mom', color: 0xf59e0b, archY: -15 },
      { from: 'mom', to: 'mes', color: 0xf59e0b, archY: -15 },
      { from: 'sap', to: 'snowflake', color: 0xf59e0b, archY: 40 },

      // 3. Central Lakehouse, Semantics & Ontology Flow (Indigo 0x818cf8)
      { from: 'hist', to: 'snowflake', color: 0x818cf8, archY: 45 },
      { from: 'mes', to: 'snowflake', color: 0x818cf8, archY: 50 },
      { from: 'mom', to: 'snowflake', color: 0x818cf8, archY: 45 },
      { from: 'snowflake', to: 'foundry', color: 0x818cf8, archY: 25 },
      { from: 'foundry', to: 'snowflake', color: 0x818cf8, archY: -20 },
      { from: 'foundry', to: 'ontology', color: 0x818cf8, archY: 30 },
      { from: 'ontology', to: 'twin', color: 0x818cf8, archY: 35 },
      { from: 'ontology', to: 'ml', color: 0x818cf8, archY: 25 },
      { from: 'ontology', to: 'dash', color: 0x818cf8, archY: 30 },

      // 4. AUTONOMOUS CLOSED-LOOP RETURN BEAM (Emerald Green 0x10b981)
      { from: 'ml', to: 'edge', color: 0x10b981, archY: 95, isReturn: true }
    ];

    edgeDefs.forEach(e => {
      const n1 = this.nodeMap[e.from];
      const n2 = this.nodeMap[e.to];
      if (!n1 || !n2) return;

      const p1 = n1.position;
      const p2 = n2.position;

      const mid = new THREE.Vector3(
        (p1.x + p2.x) / 2,
        Math.max(p1.y, p2.y) + e.archY,
        (p1.z + p2.z) / 2
      );

      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(p1.x, p1.y + 14, p1.z),
        mid,
        new THREE.Vector3(p2.x, p2.y + 14, p2.z)
      );

      this.conduitSplines.push({ curve, ...e });

      const tubeGeo = new THREE.TubeGeometry(curve, 32, e.isReturn ? 2.2 : 1.2, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: e.color,
        transparent: true,
        opacity: e.isReturn ? 0.65 : 0.28
      });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      this.scene.add(tube);
      this.conduits.push(tube);
    });
  }

  spawnParticles(count = 42) {
    const geo = new THREE.SphereGeometry(2.4, 8, 8);

    for (let i = 0; i < count; i++) {
      const splineIdx = Math.floor(Math.random() * this.conduitSplines.length);
      const splineDef = this.conduitSplines[splineIdx];

      const mat = new THREE.MeshBasicMaterial({ color: splineDef.color });
      const mesh = new THREE.Mesh(geo, mat);

      this.scene.add(mesh);
      this.particles.push({
        mesh,
        splineIdx,
        t: Math.random(),
        speed: (splineDef.isReturn ? 0.005 : 0.0035) + Math.random() * 0.0015
      });
    }
  }

  // Zoom Controls
  zoomIn() {
    this.targetCameraPos.z = Math.max(100, this.targetCameraPos.z - 60);
    this.targetCameraPos.y = Math.max(50, this.targetCameraPos.y - 25);
  }

  zoomOut() {
    this.targetCameraPos.z = Math.min(600, this.targetCameraPos.z + 60);
    this.targetCameraPos.y = Math.min(400, this.targetCameraPos.y + 25);
  }

  resetView() {
    this.targetCameraPos.copy(this.defaultCameraPos);
    this.targetLookAt.copy(this.defaultLookAt);
    this.setActiveNode(0);
  }

  setActiveNode(index) {
    this.activeNodeIndex = Math.max(0, Math.min(this.nodes.length - 1, index));
    const targetNode = this.nodes[this.activeNodeIndex];

    this.targetCameraPos.set(
      targetNode.position.x * 0.75,
      targetNode.position.y + 110,
      targetNode.position.z + 180
    );
    this.targetLookAt.set(
      targetNode.position.x,
      targetNode.position.y + 14,
      targetNode.position.z
    );

    this.autoTourTimer = 0;
  }

  toggleAutoTour() {
    this.autoTour = !this.autoTour;
    this.autoTourTimer = 0;
    if (this.autoTour) {
      this.setActiveNode(this.activeNodeIndex);
    }
    return this.autoTour;
  }

  setSimulatedAmmonia(nh3Level) {
    if (nh3Level >= 20.0) {
      this.fanSpeedMultiplier = 3.5; // Fast emergency spin
      this.conduits.forEach(c => c.material.color.setHex(0xf43f5e));
    } else {
      this.fanSpeedMultiplier = 0.5; // Modulated eco-spin
      this.conduits.forEach((c, idx) => {
        const splineDef = this.conduitSplines[idx];
        if (splineDef) c.material.color.setHex(splineDef.color);
      });
    }
  }

  triggerCrisisMode(durationMs = 9000) {
    this.crisisMode = true;
    this.fanSpeedMultiplier = 4.0;
    this.conduits.forEach(c => c.material.color.setHex(0xf43f5e));
    this.particles.forEach(p => p.mesh.material.color.setHex(0xf43f5e));

    setTimeout(() => {
      this.crisisMode = false;
      this.fanSpeedMultiplier = 1.0;
      this.conduits.forEach((c, idx) => {
        const splineDef = this.conduitSplines[idx];
        if (splineDef) c.material.color.setHex(splineDef.color);
      });
      this.particles.forEach(p => {
        const splineDef = this.conduitSplines[p.splineIdx];
        if (splineDef) p.mesh.material.color.setHex(splineDef.color);
      });
    }, durationMs);
  }

  initInteraction() {
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    this.container.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        this.isUserInteracting = true;
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        prevMouse = { x: e.clientX, y: e.clientY };

        this.targetCameraPos.x -= dx * 0.9;
        this.targetCameraPos.y += dy * 0.9;
        this.targetCameraPos.y = Math.max(50, Math.min(420, this.targetCameraPos.y));
      }
    });

    this.container.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
      setTimeout(() => { this.isUserInteracting = false; }, 2000);
    });

    // Mouse Wheel Zoom
    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomDelta = e.deltaY * 0.18;
      this.targetCameraPos.z = Math.max(90, Math.min(650, this.targetCameraPos.z + zoomDelta));
      this.targetCameraPos.y = Math.max(45, Math.min(450, this.targetCameraPos.y + zoomDelta * 0.45));
    }, { passive: false });

    // Click Raycaster on 3D Nodes
    this.container.addEventListener('click', () => {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.nodeMeshes, false);

      if (intersects.length > 0) {
        const parentNode = intersects[0].object.parent;
        if (parentNode && parentNode.userData && typeof parentNode.userData.index === 'number') {
          const nodeId = parentNode.userData.id;
          if (typeof window.selectNodeFrom3D === 'function') {
            window.selectNodeFrom3D(nodeId, parentNode.userData.index);
          }
        }
      }
    });
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight || 540;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(this.animate);

    const time = performance.now() * 0.001;

    // 1. Animate Procedural Orbiting 3D Objects
    this.orbitingObjects.forEach(obj => {
      if (obj.type === 'spin_slow') {
        obj.mesh.rotation.y += 0.012;
      } else if (obj.type === 'disk_rotate') {
        obj.mesh.rotation.y += 0.02 * obj.dir;
      } else if (obj.type === 'spin_ring') {
        obj.mesh.rotation.z += 0.02;
      } else if (obj.type === 'pulse_wave') {
        obj.mesh.scale.setScalar(1.0 + Math.sin(time * 4) * 0.25);
      } else if (obj.type === 'orbit_satellite') {
        const angle = time * obj.speed + obj.offset;
        obj.mesh.position.set(
          Math.cos(angle) * obj.radius,
          15 + Math.sin(angle * 2) * 3,
          Math.sin(angle) * obj.radius
        );
      }
    });

    // 2. Animate Barn Fan Blades
    this.animatedFans.forEach(fan => {
      fan.rotation.x += (this.crisisMode ? 0.35 : 0.08) * this.fanSpeedMultiplier;
    });

    // 3. Highlight Active 3D Node
    this.nodes.forEach((node, idx) => {
      const ring = node.userData.ring;
      if (ring) ring.rotation.z += 0.015;
      const isActive = idx === this.activeNodeIndex;
      node.scale.lerp(new THREE.Vector3(isActive ? 1.25 : 1.0, isActive ? 1.25 : 1.0, isActive ? 1.25 : 1.0), 0.1);
    });

    // 4. Animate Flowing Particles
    this.particles.forEach(p => {
      p.t += p.speed;
      if (p.t > 1.0) p.t = 0;

      const splineDef = this.conduitSplines[p.splineIdx];
      if (splineDef && splineDef.curve) {
        const pos = splineDef.curve.getPoint(p.t);
        p.mesh.position.copy(pos);
      }
    });

    // 5. Camera Physics Lerping
    this.currentCameraPos.lerp(this.targetCameraPos, 0.045);
    this.currentLookAt.lerp(this.targetLookAt, 0.05);

    this.camera.position.copy(this.currentCameraPos);
    this.camera.lookAt(this.currentLookAt);

    // 6. Auto-Tour
    if (this.autoTour && !this.isUserInteracting) {
      this.autoTourTimer += 0.016;
      if (this.autoTourTimer >= this.autoTourInterval) {
        this.autoTourTimer = 0;
        const nextIndex = (this.activeNodeIndex + 1) % this.nodes.length;
        this.setActiveNode(nextIndex);
        const nextNode = this.nodes[nextIndex];

        if (typeof window.selectNodeFrom3D === 'function' && nextNode) {
          window.selectNodeFrom3D(nextNode.userData.id, nextIndex);
        }
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Global initialization
function initHighway3D() {
  if (!window.highway3D) {
    window.highway3D = new Highway3DEngine('canvas-3d-highway-container');
  }
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initHighway3D);
} else {
  initHighway3D();
}
