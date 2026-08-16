import { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural equirectangular panorama of the Three Gorges Dam (Photo-Sphere style)
function drawRidge(g, w, baseY, amp, peaks, seed, minW) {
  g.beginPath();
  g.moveTo(0, baseY);
  for (let i = 0; i <= peaks; i++) {
    const x = (i / peaks) * w;
    const y = baseY - amp * (0.35 + Math.abs(Math.sin(i * 1.7 + seed)) * 0.65);
    g.lineTo(x, y);
  }
  g.lineTo(w, baseY + 60);
  g.lineTo(0, baseY + 60);
  g.closePath();
  g.fill();
}

function makePanoramaTexture() {
  const w = 2048;
  const h = 1024;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');

  // Sky
  const sky = g.createLinearGradient(0, 0, 0, h * 0.62);
  sky.addColorStop(0, '#3f7fb8');
  sky.addColorStop(0.55, '#8fc4e4');
  sky.addColorStop(1, '#d9eef8');
  g.fillStyle = sky;
  g.fillRect(0, 0, w, h * 0.62);

  // Sun + glow
  const sunX = w * 0.74;
  const sunY = h * 0.15;
  const glow = g.createRadialGradient(sunX, sunY, 8, sunX, sunY, 130);
  glow.addColorStop(0, 'rgba(255,246,218,0.95)');
  glow.addColorStop(1, 'rgba(255,246,218,0)');
  g.fillStyle = glow;
  g.fillRect(sunX - 140, sunY - 140, 280, 280);
  g.fillStyle = '#fff7dd';
  g.beginPath();
  g.arc(sunX, sunY, 32, 0, Math.PI * 2);
  g.fill();

  // Mountain layers
  g.fillStyle = '#a3bdcb';
  drawRidge(g, w, h * 0.36, h * 0.20, 6, 3, 180);
  g.fillStyle = '#7ba394';
  drawRidge(g, w, h * 0.44, h * 0.16, 8, 7, 110);
  g.fillStyle = '#55795f';
  drawRidge(g, w, h * 0.54, h * 0.12, 11, 13, 70);

  // River
  const riverY = h * 0.60;
  const river = g.createLinearGradient(0, riverY - 12, 0, riverY + 64);
  river.addColorStop(0, '#cfe8f5');
  river.addColorStop(0.35, '#5d9fc4');
  river.addColorStop(1, '#2f6f96');
  g.fillStyle = river;
  g.fillRect(0, riverY - 8, w, 72);
  g.strokeStyle = 'rgba(255,255,255,0.30)';
  g.lineWidth = 2;
  for (let i = 0; i < 46; i++) {
    const x = (i * 47) % w;
    const y = riverY + (i % 5) * 8 + 4;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + 30, y + 5);
    g.stroke();
  }

  // Dam wall (centered)
  const damX = w / 2;
  const damTop = riverY - 40;
  g.fillStyle = '#d9dee2';
  g.fillRect(damX - 124, damTop, 248, 56);
  g.fillStyle = '#b7bec5';
  for (let i = 0; i < 7; i++) {
    g.fillRect(damX - 104 + i * 34, damTop + 8, 15, 40);
  }
  g.fillStyle = '#eef1f3';
  g.fillRect(damX - 128, damTop - 7, 256, 10);
  // crane silhouette
  g.strokeStyle = '#c9a24b';
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(damX - 84, damTop);
  g.lineTo(damX - 112, damTop - 66);
  g.stroke();
  g.strokeStyle = '#3f3f3f';
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(damX - 112, damTop - 66);
  g.lineTo(damX - 94, damTop - 66);
  g.stroke();

  // Foreground bank
  g.fillStyle = '#3f5a3a';
  g.fillRect(0, riverY + 64, w, h - riverY - 64);
  g.fillStyle = '#2f442b';
  g.fillRect(0, h - 46, w, 46);

  // Painted title + hint (visible when facing the dam)
  g.fillStyle = 'rgba(255,255,255,0.92)';
  g.font = 'bold 46px "Microsoft YaHei", "PingFang SC", sans-serif';
  g.textAlign = 'center';
  g.shadowColor = 'rgba(0,0,0,0.45)';
  g.shadowBlur = 10;
  g.fillText('三峡大坝 · 全景', damX, damTop - 48);
  g.font = '30px "Microsoft YaHei", "PingFang SC", sans-serif';
  g.fillStyle = 'rgba(255,255,255,0.82)';
  g.fillText('拖拽环视 · 滚轮缩放', damX, riverY + 108);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const PanoramaRoom = ({ showRoom, onReady, isExiting, isWarmup }) => {
  const { camera, gl } = useThree();
  const sphereRef = useRef();
  const yaw = useRef(0);
  const pitch = useRef(0);
  const fov = useRef(62);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const hasSignaledReady = useRef(false);
  const frameCount = useRef(0);

  const texture = useMemo(() => makePanoramaTexture(), []);

  useEffect(() => {
    const el = gl.domElement;
    const down = (e) => {
      dragging.current = true;
      last.current = { x: e.clientX, y: e.clientY };
    };
    const move = (e) => {
      if (!dragging.current) return;
      yaw.current -= (e.clientX - last.current.x) * 0.004;
      pitch.current = THREE.MathUtils.clamp(pitch.current - (e.clientY - last.current.y) * 0.004, -1.15, 1.15);
      last.current = { x: e.clientX, y: e.clientY };
    };
    const up = () => { dragging.current = false; };
    const wheel = (e) => {
      fov.current = THREE.MathUtils.clamp(fov.current + e.deltaY * 0.04, 28, 85);
    };
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    el.addEventListener('wheel', wheel, { passive: true });
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      el.removeEventListener('wheel', wheel);
    };
  }, [gl]);

  useFrame((state, delta) => {
    if (sphereRef.current) sphereRef.current.position.copy(camera.position);

    if (isExiting) {
      // Restore default FOV so the corridor isn't left zoomed after leaving
      camera.fov = THREE.MathUtils.lerp(camera.fov, 60, 0.1);
      camera.updateProjectionMatrix();
      return;
    }

    if (!dragging.current) yaw.current += delta * 0.04; // slow auto-rotate
    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw.current;
    camera.rotation.x = pitch.current;
    camera.fov = THREE.MathUtils.lerp(camera.fov, fov.current, 0.12);
    camera.updateProjectionMatrix();

    if (!hasSignaledReady.current) {
      frameCount.current++;
      if (frameCount.current >= 8) {
        hasSignaledReady.current = true;
        onReady?.();
      }
    }
  });

  return (
    <group>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[48, 64, 32]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>
    </group>
  );
};

export default PanoramaRoom;
