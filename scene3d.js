/* =============================================
   3D BACKGROUND SCENE — Three.js (Enhanced)
   ============================================= */

(function () {
  var hero = document.querySelector('.hero');
  if (!hero || typeof THREE === 'undefined') return;

  var container = document.createElement('div');
  container.id = 'three-container';
  container.style.cssText = 'position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;';
  hero.insertBefore(container, hero.firstChild);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 12;

  var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  var colors = [0x3b82f6, 0x06b6d4, 0x8b5cf6, 0x34d399, 0xf59e0b, 0xef4444];
  var geos = [
    new THREE.TorusKnotGeometry(0.55, 0.18, 64, 8),
    new THREE.IcosahedronGeometry(0.5, 0),
    new THREE.OctahedronGeometry(0.5, 0),
    new THREE.TorusGeometry(0.5, 0.18, 16, 32),
    new THREE.DodecahedronGeometry(0.45, 0),
    new THREE.ConeGeometry(0.5, 0.8, 6),
  ];

  var shapes = [];

  /* big wireframe shapes */
  for (var i = 0; i < 10; i++) {
    var g = geos[i % geos.length];
    var isSolid = i % 3 === 0;
    var m = isSolid
      ? new THREE.MeshBasicMaterial({
          color: colors[i % colors.length],
          transparent: true,
          opacity: 0.06,
          side: THREE.DoubleSide,
        })
      : new THREE.MeshBasicMaterial({
          color: colors[i % colors.length],
          wireframe: true,
          transparent: true,
          opacity: 0.12 + Math.random() * 0.2,
        });
    var mesh = new THREE.Mesh(g, m);
    mesh.position.x = (Math.random() - 0.5) * 16;
    mesh.position.y = (Math.random() - 0.5) * 12;
    mesh.position.z = (Math.random() - 0.5) * 8 - 1;
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    mesh.scale.setScalar(0.5 + Math.random() * 1);
    scene.add(mesh);
    shapes.push({
      mesh: mesh,
      rotSpeed: 0.15 + Math.random() * 0.35,
      floatSpeed: 0.001 + Math.random() * 0.003,
      floatAmp: 0.2 + Math.random() * 0.3,
      baseY: mesh.position.y,
      baseX: mesh.position.x,
      baseZ: mesh.position.z,
      index: i,
    });
  }

  /* small floating particles */
  var particleGeo = new THREE.BufferGeometry();
  var particleCount = 120;
  var positions = new Float32Array(particleCount * 3);
  for (var i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  var particleMat = new THREE.PointsMaterial({
    color: 0x3b82f6,
    size: 0.06,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
  });
  var particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  /* second particle system - accent color */
  var particleGeo2 = new THREE.BufferGeometry();
  var positions2 = new Float32Array(80 * 3);
  for (var i = 0; i < 80; i++) {
    positions2[i * 3] = (Math.random() - 0.5) * 18;
    positions2[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions2[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
  }
  particleGeo2.setAttribute('position', new THREE.BufferAttribute(positions2, 3));
  var particleMat2 = new THREE.PointsMaterial({
    color: 0x06b6d4,
    size: 0.04,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
  });
  var particles2 = new THREE.Points(particleGeo2, particleMat2);
  scene.add(particles2);

  /* Mouse */
  var mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', function (e) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  /* Animate */
  function animate() {
    requestAnimationFrame(animate);
    var t = Date.now() * 0.001;

    for (var i = 0; i < shapes.length; i++) {
      var s = shapes[i];
      s.mesh.rotation.x += 0.003 * s.rotSpeed;
      s.mesh.rotation.y += 0.006 * s.rotSpeed;
      s.mesh.position.y = s.baseY + Math.sin(t * s.floatSpeed + s.index) * s.floatAmp;
      s.mesh.position.x = s.baseX + Math.sin(t * s.floatSpeed * 0.6 + s.index * 1.3) * s.floatAmp * 0.25;
      s.mesh.position.z = s.baseZ + Math.sin(t * s.floatSpeed * 0.4 + s.index * 0.7) * 0.5;
    }

    /* rotate particle systems */
    particles.rotation.y += 0.0003;
    particles.rotation.x += 0.0001;
    particles2.rotation.y -= 0.0004;
    particles2.rotation.z += 0.0001;

    camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.035;
    camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.035;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', function () {
    var w = container.clientWidth;
    var h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();
