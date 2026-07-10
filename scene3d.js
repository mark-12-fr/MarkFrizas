/* =============================================
   3D BACKGROUND SCENE — Three.js
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
  camera.position.z = 10;

  var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  /* ── Shapes ── */
  var colors = [0x3b82f6, 0x06b6d4, 0x8b5cf6, 0x34d399];
  var geos = [
    new THREE.TorusKnotGeometry(0.55, 0.18, 64, 8),
    new THREE.IcosahedronGeometry(0.5, 0),
    new THREE.OctahedronGeometry(0.5, 0),
    new THREE.TorusGeometry(0.5, 0.18, 16, 32),
  ];

  var shapes = [];
  for (var i = 0; i < 7; i++) {
    var g = geos[i % geos.length];
    var m = new THREE.MeshBasicMaterial({
      color: colors[i % colors.length],
      wireframe: true,
      transparent: true,
      opacity: 0.15 + Math.random() * 0.3,
    });
    var mesh = new THREE.Mesh(g, m);
    mesh.position.x = (Math.random() - 0.5) * 14;
    mesh.position.y = (Math.random() - 0.5) * 10;
    mesh.position.z = (Math.random() - 0.5) * 6 - 2;
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    mesh.scale.setScalar(0.6 + Math.random() * 0.8);
    scene.add(mesh);
    shapes.push({
      mesh: mesh,
      rotSpeed: 0.2 + Math.random() * 0.4,
      floatSpeed: 0.002 + Math.random() * 0.003,
      floatAmp: 0.15 + Math.random() * 0.25,
      baseY: mesh.position.y,
      baseX: mesh.position.x,
      index: i,
    });
  }

  /* ── Mouse ── */
  var mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', function (e) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  /* ── Animate ── */
  function animate() {
    requestAnimationFrame(animate);
    var t = Date.now() * 0.001;

    for (var i = 0; i < shapes.length; i++) {
      var s = shapes[i];
      s.mesh.rotation.x += 0.004 * s.rotSpeed;
      s.mesh.rotation.y += 0.007 * s.rotSpeed;
      s.mesh.position.y = s.baseY + Math.sin(t * s.floatSpeed + s.index) * s.floatAmp;
      s.mesh.position.x = s.baseX + Math.sin(t * s.floatSpeed * 0.7 + s.index) * s.floatAmp * 0.3;
    }

    camera.position.x += (mouseX * 0.6 - camera.position.x) * 0.04;
    camera.position.y += (mouseY * 0.4 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  /* ── Resize ── */
  window.addEventListener('resize', function () {
    var w = container.clientWidth;
    var h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();
