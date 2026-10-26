import * as THREE from 'three';

export type BaseballController = { spin: () => void; reset: () => void; setRolling: (enabled: boolean) => void; dispose: () => void };
type Callbacks = { ready: () => void; unavailable: () => void; playbackChanged?: (state: { rolling: boolean; reducedMotion: boolean }) => void };

/** Original geometry and procedural grain; no external textures or model requests. */
export function createBaseball(host: HTMLElement, callbacks: Callbacks): BaseballController {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 20);
  camera.position.z = 4.65;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x879a93, 2.3));
  const key = new THREE.DirectionalLight(0xffffff, 3.2);
  key.position.set(-3, 4, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xf6b1aa, 0.8);
  fill.position.set(3, -1, 2);
  scene.add(fill);

  // Deterministic fine grain adds leather texture without an image request.
  const grain = new Uint8Array(128 * 128 * 4);
  let seed = 7;
  for (let i = 0; i < grain.length; i += 4) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const shade = 130 + seed % 120;
    grain[i] = grain[i + 1] = grain[i + 2] = shade;
    grain[i + 3] = 255;
  }
  const texture = new THREE.DataTexture(grain, 128, 128);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  const leather = new THREE.MeshStandardMaterial({ color: 0xfffdf7, roughness: 0.78, bumpMap: texture, bumpScale: 0.014 });
  const seamMaterial = new THREE.MeshStandardMaterial({ color: 0xd7bcaa, roughness: 1 });
  const thread = new THREE.MeshStandardMaterial({ color: 0xc34558, roughness: 0.74 });
  const sphereGeometry = new THREE.SphereGeometry(1, 48, 32);
  const ball = new THREE.Group();
  ball.add(new THREE.Mesh(sphereGeometry, leather));
  scene.add(ball);

  class SeamCurve extends THREE.Curve<THREE.Vector3> {
    constructor() { super(); }
    getPoint(t: number, target = new THREE.Vector3()) {
      const angle = t * Math.PI * 2;
      return target.set(Math.cos(angle), Math.sin(angle), 1.35 * Math.cos(2 * angle)).normalize().multiplyScalar(1.003);
    }
  }
  const seam = new SeamCurve();
  const seamGeometry = new THREE.TubeGeometry(seam, 256, 0.004, 4, true);
  ball.add(new THREE.Mesh(seamGeometry, seamMaterial));

  const stitchGeometry = new THREE.CylinderGeometry(0.006, 0.006, 1, 5);
  const stitches = new THREE.InstancedMesh(stitchGeometry, thread, 256);
  const dummy = new THREE.Object3D();
  const yAxis = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < 128; i++) {
    const t = i / 128;
    const normal = seam.getPoint(t).normalize();
    const tangent = seam.getTangent(t).normalize();
    const across = new THREE.Vector3().crossVectors(normal, tangent).normalize();
    for (let side = 0; side < 2; side++) {
      const direction = side === 0 ? -1 : 1;
      const a = normal.clone().addScaledVector(across, direction * 0.005).addScaledVector(tangent, -0.013).normalize().multiplyScalar(1.012);
      const b = normal.clone().addScaledVector(across, direction * 0.052).addScaledVector(tangent, 0.025).normalize().multiplyScalar(1.009);
      const line = b.clone().sub(a);
      dummy.position.copy(a).add(b).multiplyScalar(0.5);
      dummy.quaternion.setFromUnitVectors(yAxis, line.clone().normalize());
      dummy.scale.set(1, line.length(), 1);
      dummy.updateMatrix();
      stitches.setMatrixAt(i * 2 + side, dummy.matrix);
    }
  }
  ball.add(stitches);
  const initial = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.12, -0.15, -0.22));
  ball.quaternion.copy(initial);

  let frame = 0;
  let disposed = false;
  let visible = false;
  let lost = false;
  let announced = false;
  let rollingRequested = true;
  let lastTime: number | null = null;
  let motion: { start: number; from: THREE.Quaternion } | null = null;
  let pointer: { id: number; x: number; y: number; type: string } | null = null;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const turn = new THREE.Quaternion();
  const xAxis = new THREE.Vector3(1, 0, 0);
  const rollAxis = new THREE.Vector3(0.35, 1, 0.12).normalize();
  const rolling = () => rollingRequested && !preference.matches;
  const announcePlayback = () => callbacks.playbackChanged?.({ rolling: rolling(), reducedMotion: preference.matches });

  function schedule() {
    if (!frame && !disposed && visible && !document.hidden && !lost) frame = requestAnimationFrame(render);
  }
  function render(now: number) {
    frame = 0;
    if (disposed || !visible || document.hidden || lost) return;
    const delta = lastTime === null ? 0 : Math.min(Math.max((now - lastTime) / 1000, 0), 0.05);
    lastTime = now;
    if (motion) {
      const progress = Math.min((now - motion.start) / 1000, 1);
      const eased = 1 - (1 - progress) ** 3;
      ball.quaternion.copy(motion.from).premultiply(turn.setFromAxisAngle(yAxis, Math.PI * 2 * eased));
      ball.position.y = Math.sin(progress * Math.PI) * 0.13;
      if (progress === 1) motion = null;
    } else if (rolling() && !pointer) {
      ball.quaternion.premultiply(turn.setFromAxisAngle(rollAxis, delta * 0.42));
    }
    try {
      renderer.render(scene, camera);
      if (!announced) { announced = true; callbacks.ready(); }
    } catch {
      lost = true;
      releasePointer(); stop();
      callbacks.unavailable();
    }
    if ((motion || (rolling() && !pointer)) && !lost) schedule();
  }
  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    motion = null;
    lastTime = null;
    ball.position.y = 0;
  }
  function rotate(x: number, y: number) {
    stop();
    ball.quaternion.premultiply(turn.setFromAxisAngle(yAxis, x));
    ball.quaternion.premultiply(turn.setFromAxisAngle(xAxis, y));
    schedule();
  }
  function reset() { stop(); ball.quaternion.copy(initial); schedule(); }
  function spin() {
    stop();
    if (preference.matches) { rotate(Math.PI / 3, 0); return; }
    motion = { start: performance.now(), from: ball.quaternion.clone() };
    schedule();
  }
  function setRolling(enabled: boolean) {
    if (disposed) return;
    rollingRequested = enabled;
    stop(); announcePlayback(); schedule();
  }
  function resize() {
    if (disposed) return;
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    schedule();
  }
  function pointerDown(event: PointerEvent) {
    if (event.button !== 0 || disposed || lost || pointer) return;
    stop();
    schedule();
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, type: event.pointerType };
    host.setPointerCapture(event.pointerId);
    if (event.pointerType === 'mouse') host.focus({ preventScroll: true });
  }
  function pointerMove(event: PointerEvent) {
    if (!pointer || pointer.id !== event.pointerId) return;
    const scale = Math.PI * 1.5 / host.clientWidth;
    rotate((event.clientX - pointer.x) * scale, pointer.type === 'touch' ? 0 : (event.clientY - pointer.y) * scale);
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  }
  function pointerEnd(event: PointerEvent) {
    if (pointer?.id !== event.pointerId) return;
    releasePointer();
    lastTime = null;
    schedule();
  }
  function releasePointer() {
    const active = pointer;
    pointer = null;
    if (active && host.hasPointerCapture(active.id)) host.releasePointerCapture(active.id);
  }
  function keyDown(event: KeyboardEvent) {
    if (disposed || lost) return;
    const step = Math.PI / 12;
    const moves: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (event.key === 'Home') { event.preventDefault(); reset(); }
    else if (event.key === ' ') { event.preventDefault(); if (!event.repeat) setRolling(!rollingRequested); }
    else if (moves[event.key]) { event.preventDefault(); rotate(...moves[event.key]); }
  }
  function contextLost(event: Event) {
    event.preventDefault();
    lost = true;
    releasePointer();
    stop();
    callbacks.unavailable();
  }
  function contextRestored() { if (disposed) return; lost = false; announced = false; lastTime = null; resize(); schedule(); }
  function visibilityChanged() { if (document.hidden) { releasePointer(); stop(); } else { lastTime = null; schedule(); } }
  function preferenceChanged() { stop(); announcePlayback(); schedule(); }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const intersectionObserver = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    if (visible) { lastTime = null; schedule(); } else { releasePointer(); stop(); }
  });
  intersectionObserver.observe(host);
  host.addEventListener('pointerdown', pointerDown);
  host.addEventListener('pointermove', pointerMove);
  host.addEventListener('pointerup', pointerEnd);
  host.addEventListener('pointercancel', pointerEnd);
  host.addEventListener('lostpointercapture', pointerEnd);
  host.addEventListener('keydown', keyDown);
  canvas.addEventListener('webglcontextlost', contextLost);
  canvas.addEventListener('webglcontextrestored', contextRestored);
  document.addEventListener('visibilitychange', visibilityChanged);
  preference.addEventListener('change', preferenceChanged);
  announcePlayback();
  resize();

  return { spin, reset, setRolling, dispose() {
    disposed = true;
    releasePointer();
    stop();
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    host.removeEventListener('pointerdown', pointerDown);
    host.removeEventListener('pointermove', pointerMove);
    host.removeEventListener('pointerup', pointerEnd);
    host.removeEventListener('pointercancel', pointerEnd);
    host.removeEventListener('lostpointercapture', pointerEnd);
    host.removeEventListener('keydown', keyDown);
    canvas.removeEventListener('webglcontextlost', contextLost);
    canvas.removeEventListener('webglcontextrestored', contextRestored);
    document.removeEventListener('visibilitychange', visibilityChanged);
    preference.removeEventListener('change', preferenceChanged);
    stitches.dispose();
    sphereGeometry.dispose(); seamGeometry.dispose(); stitchGeometry.dispose();
    leather.dispose(); seamMaterial.dispose(); thread.dispose(); texture.dispose();
    renderer.dispose();
    canvas.remove();
  } };
}
