import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const FONT = 'https://fonts.gstatic.com/s/zcoolxiaowei/v15/i7dMIFFrTRywPpUVX9_RJyM1YFI.ttf';

const DISPLAYS = [
  { id: 'apple', name: '苹果 II', sub: '1977 · 个人电脑的黎明', body: '#dccd9f', dark: '#b8a878', screen: 'apple' },
  { id: 'pc', name: '长城 0520', sub: '1985 · 国产微机记忆', body: '#d8dce0', dark: '#aab2ba', screen: 'boot' },
  { id: 'fc', name: '红白机 FC', sub: '1983 · 像素游戏启蒙', body: '#d5d5d5', dark: '#b0b0b0', screen: 'game' },
  { id: 'gb', name: '掌机 Game Boy', sub: '1989 · 口袋里的快乐', body: '#c9d2da', dark: '#9aa6b0', screen: 'tetris' },
  { id: 'mainframe', name: '大型计算机', sub: '1970s · 机房里的巨兽', body: '#3d4a5c', dark: '#2b3544', screen: 'matrix' },
];

// Procedural CRT screen textures
function drawScreen(kind) {
  const w = 512;
  const h = 384;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');

  if (kind === 'apple') {
    const grad = g.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#a8ccff');
    grad.addColorStop(1, '#5b8fe0');
    g.fillStyle = grad;
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#1d2c4a';
    g.textAlign = 'center';
    g.font = 'bold 48px "Courier New", monospace';
    g.fillText('Apple ][', w / 2, h / 2 - 18);
    g.font = '28px "Courier New", monospace';
    g.fillText('HELLO YICHANG', w / 2, h / 2 + 34);
    const colors = ['#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#007aff', '#af52de'];
    colors.forEach((col, i) => {
      g.fillStyle = col;
      g.fillRect(0, h - 36 + i * 5, w, 5);
    });
  } else if (kind === 'boot') {
    g.fillStyle = '#050805';
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#33ff66';
    g.textAlign = 'left';
    g.font = '26px "Courier New", monospace';
    ['YICHANG PC-88 BIOS V1.0', 'MEMORY OK 640K', 'DISK 0: MS-DOS 3.30', 'C:> BASIC', '_'].forEach((ln, i) => {
      g.fillText(ln, 28, 64 + i * 42);
    });
  } else if (kind === 'game') {
    const sky = g.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#7ec8ff');
    sky.addColorStop(1, '#cfeaff');
    g.fillStyle = sky;
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#ffe066';
    g.beginPath();
    g.arc(440, 64, 34, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = 'rgba(255,255,255,0.9)';
    [[120, 80], [280, 130]].forEach(([cx, cy]) => {
      g.beginPath();
      g.arc(cx, cy, 22, 0, Math.PI * 2);
      g.arc(cx + 26, cy + 4, 18, 0, Math.PI * 2);
      g.arc(cx - 26, cy + 6, 16, 0, Math.PI * 2);
      g.fill();
    });
    g.fillStyle = '#8a5a2a';
    g.fillRect(0, h - 70, w, 70);
    g.fillStyle = '#6e3f1c';
    for (let x = 0; x < w; x += 48) g.fillRect(x, h - 70, 24, 10);
    g.fillStyle = '#c0392b';
    for (let row = 0; row < 3; row++) {
      for (let i = 0; i < 5; i++) g.fillRect(40 + i * 44, 150 + row * 30, 40, 26);
    }
    g.fillStyle = '#2d3a4a';
    g.fillRect(40, 240, 40, 26);
    g.fillStyle = '#2ecc71';
    g.fillRect(320, 180, 64, 110);
    g.fillStyle = '#27ae60';
    g.fillRect(312, 160, 80, 26);
    g.fillStyle = '#e74c3c';
    g.fillRect(210, 258, 34, 34);
    g.fillStyle = '#f8c471';
    g.fillRect(214, 252, 26, 8);
    g.fillStyle = '#ffffff';
    g.font = 'bold 22px monospace';
    g.fillText('1-1  SCORE 008800', 24, 40);
  } else if (kind === 'tetris') {
    g.fillStyle = '#9aa7b5';
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#5a6a78';
    g.font = 'bold 22px monospace';
    g.textAlign = 'center';
    g.fillText('TETRIS  HI 04200', w / 2, 30);
    const cell = 30;
    const ox = 60;
    const oy = 66;
    g.strokeStyle = 'rgba(0,0,0,0.15)';
    for (let r = 0; r < 10; r++) {
      for (let col = 0; col < 10; col++) g.strokeRect(ox + col * cell, oy + r * cell, cell, cell);
    }
    const drawPiece = (cells, color, dx, dy) => {
      g.fillStyle = color;
      cells.forEach(([a, b]) => g.fillRect(ox + (a + dx) * cell + 2, oy + (b + dy) * cell + 2, cell - 4, cell - 4));
    };
    drawPiece([[0, 0], [1, 0], [2, 0], [2, 1]], '#e74c3c', 1, 1);
    drawPiece([[0, 0], [1, 0], [2, 0], [1, 1]], '#f1c40f', 1, 3);
    drawPiece([[0, 0], [0, 1], [1, 1], [1, 0]], '#2ecc71', 5, 4);
    drawPiece([[0, 0], [1, 0], [2, 0], [3, 0]], '#3498db', 2, 7);
  } else {
    g.fillStyle = '#000000';
    g.fillRect(0, 0, w, h);
    g.font = '20px monospace';
    g.textAlign = 'left';
    const cols = Math.floor(w / 22);
    for (let i = 0; i < cols; i++) {
      const len = 8 + Math.floor(Math.random() * 14);
      const start = Math.floor(Math.random() * 18);
      for (let j = 0; j < len; j++) {
        const ch = String.fromCharCode(0x30a0 + Math.floor(Math.random() * 90));
        g.globalAlpha = j === len - 1 ? 1 : 0.25 + (j / len) * 0.6;
        g.fillText(ch, i * 22, (start + j) * 22);
      }
    }
    g.globalAlpha = 1;
    g.fillStyle = '#d4ffdf';
    g.font = 'bold 24px monospace';
    g.textAlign = 'center';
    g.fillText('MAINFRAME.SYS', w / 2, 360);
  }

  // CRT scanlines + vignette
  g.fillStyle = 'rgba(0,0,0,0.22)';
  for (let y = 0; y < h; y += 4) g.fillRect(0, y, w, 2);
  const vg = g.createRadialGradient(w / 2, h / 2, h * 0.4, w / 2, h / 2, w * 0.75);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(0,0,0,0.35)');
  g.fillStyle = vg;
  g.fillRect(0, 0, w, h);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Rainbow apple logo (Apple II style)
function drawAppleLogo() {
  const s = 256;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const g = c.getContext('2d');
  const cx = s / 2;
  const cy = s / 2 + 6;
  g.fillStyle = '#7ec8a8';
  g.beginPath();
  g.arc(cx, cy, 78, 0, Math.PI * 2);
  g.fill();
  g.save();
  g.globalCompositeOperation = 'destination-out';
  g.beginPath();
  g.arc(cx + 48, cy - 34, 32, 0, Math.PI * 2);
  g.fill();
  g.restore();
  const colors = ['#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#007aff', '#af52de'];
  colors.forEach((col, i) => {
    g.save();
    g.beginPath();
    g.arc(cx, cy, 78, 0, Math.PI * 2);
    g.clip();
    g.fillStyle = col;
    g.fillRect(cx - 90, cy - 78 + i * 14, 180, 7);
    g.restore();
  });
  g.fillStyle = '#4caf50';
  g.beginPath();
  g.ellipse(cx + 4, cy - 92, 26, 10, -0.5, 0, Math.PI * 2);
  g.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function Screen({ kind, width, height, position, emissive = 2 }) {
  const texture = useMemo(() => drawScreen(kind), [kind]);
  return (
    <mesh position={position}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function Pedestal() {
  return (
    <group>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[2.3, 0.9, 1.2]} />
        <meshStandardMaterial color="#20242c" roughness={0.7} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.93, 0]}>
        <boxGeometry args={[2.5, 0.07, 1.4]} />
        <meshStandardMaterial color="#39404c" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2.3, 0.1, 1.2]} />
        <meshStandardMaterial color="#2b3038" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Plaque({ name, sub }) {
  return (
    <group position={[0, 0.62, 0.63]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 0.42, 0.04]} />
        <meshStandardMaterial color="#232830" roughness={0.8} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[1.66, 0.3, 0.02]} />
        <meshStandardMaterial color="#0f1420" emissive="#1a6fd0" emissiveIntensity={0.25} roughness={0.6} />
      </mesh>
      <Text position={[0, 0.09, 0.045]} fontSize={0.16} color="#d7ecff" anchorX="center" anchorY="middle" font={FONT}>
        {name}
      </Text>
      <Text position={[0, -0.09, 0.045]} fontSize={0.085} color="#6f93b8" anchorX="center" anchorY="middle" font={FONT}>
        {sub}
      </Text>
    </group>
  );
}

function DisplayUnit({ d, index }) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef();
  const ledRef = useRef(null);
  const appleLogo = useMemo(() => drawAppleLogo(), []);
  const x = (index - (DISPLAYS.length - 1) / 2) * 4.9;

  useFrame((state) => {
    if (!groupRef.current) return;
    const target = hovered ? 1.07 : 1;
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, target, 0.12));
    if (ledRef.current) {
      ledRef.current.material.emissiveIntensity = 1.2 + Math.sin(state.clock.elapsedTime * 6 + index * 2) * 0.9;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[x, 0, -9]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <Pedestal />

      {d.id === 'apple' && (
        <group>
          <mesh position={[0, 1.95, -0.1]}>
            <boxGeometry args={[1.15, 1.0, 0.9]} />
            <meshStandardMaterial color={d.dark} roughness={0.6} />
          </mesh>
          <Screen kind="apple" width={0.92} height={0.78} position={[0, 1.98, 0.36]} />
          <mesh position={[0, 1.32, 0.05]}>
            <boxGeometry args={[1.6, 0.45, 1.0]} />
            <meshStandardMaterial color={d.body} roughness={0.7} />
          </mesh>
          <mesh position={[0.52, 1.32, 0.56]}>
            <planeGeometry args={[0.3, 0.3]} />
            <meshBasicMaterial map={appleLogo} toneMapped={false} transparent />
          </mesh>
          <mesh position={[0, 1.08, 0.58]}>
            <boxGeometry args={[1.3, 0.05, 0.45]} />
            <meshStandardMaterial color="#4a4a52" roughness={0.8} />
          </mesh>
        </group>
      )}

      {d.id === 'pc' && (
        <group>
          <mesh position={[-0.5, 1.85, 0.05]}>
            <boxGeometry args={[0.85, 1.35, 0.7]} />
            <meshStandardMaterial color={d.body} roughness={0.7} />
          </mesh>
          {[-0.05, 0.25, 0.55].map((dy, i) => (
            <mesh key={i} position={[-0.5, 1.5 + dy, 0.42]}>
              <boxGeometry args={[0.55, 0.05, 0.03]} />
              <meshStandardMaterial color="#232323" roughness={0.9} />
            </mesh>
          ))}
          <mesh position={[-0.5, 1.12, 0.42]}>
            <boxGeometry args={[0.16, 0.16, 0.03]} />
            <meshStandardMaterial color="#22ff88" emissive="#22ff88" emissiveIntensity={1.4} />
          </mesh>
          <mesh position={[0.45, 1.95, -0.1]}>
            <boxGeometry args={[1.2, 1.05, 0.95]} />
            <meshStandardMaterial color={d.dark} roughness={0.6} />
          </mesh>
          <Screen kind="boot" width={0.95} height={0.8} position={[0.45, 1.98, 0.38]} />
          <mesh position={[0, 1.1, 0.58]}>
            <boxGeometry args={[1.35, 0.05, 0.45]} />
            <meshStandardMaterial color="#4a4a52" roughness={0.8} />
          </mesh>
        </group>
      )}

      {d.id === 'fc' && (
        <group>
          <mesh position={[0, 2.05, -0.15]}>
            <boxGeometry args={[1.65, 1.35, 0.85]} />
            <meshStandardMaterial color={d.dark} roughness={0.6} />
          </mesh>
          <Screen kind="game" width={1.35} height={1.08} position={[0, 2.08, 0.28]} />
          <mesh position={[0, 1.25, 0.1]}>
            <boxGeometry args={[1.5, 0.4, 0.95]} />
            <meshStandardMaterial color={d.body} roughness={0.7} />
          </mesh>
          <mesh position={[0, 1.52, 0.1]}>
            <boxGeometry args={[0.55, 0.12, 0.4]} />
            <meshStandardMaterial color="#7a3232" roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.05, 0.55]}>
            <boxGeometry args={[0.85, 0.08, 0.35]} />
            <meshStandardMaterial color="#3a3a42" roughness={0.8} />
          </mesh>
        </group>
      )}

      {d.id === 'gb' && (
        <group>
          <mesh position={[0, 1.05, 0]}>
            <boxGeometry args={[1.0, 0.3, 0.5]} />
            <meshStandardMaterial color="#31363f" roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.55, 0.05]} rotation={[-0.12, 0, 0]}>
            <boxGeometry args={[1.15, 0.65, 0.3]} />
            <meshStandardMaterial color={d.body} roughness={0.6} />
          </mesh>
          <Screen kind="tetris" width={0.8} height={0.62} position={[0, 1.63, 0.21]} />
          <mesh position={[-0.33, 1.28, 0.22]}>
            <boxGeometry args={[0.12, 0.42, 0.05]} />
            <meshStandardMaterial color="#23262c" roughness={0.9} />
          </mesh>
          <mesh position={[-0.33, 1.28, 0.22]}>
            <boxGeometry args={[0.42, 0.12, 0.05]} />
            <meshStandardMaterial color="#23262c" roughness={0.9} />
          </mesh>
          <mesh position={[0.3, 1.34, 0.22]}>
            <boxGeometry args={[0.16, 0.16, 0.05]} />
            <meshStandardMaterial color="#8a2f3a" roughness={0.9} />
          </mesh>
          <mesh position={[0.46, 1.2, 0.22]}>
            <boxGeometry args={[0.16, 0.16, 0.05]} />
            <meshStandardMaterial color="#8a2f3a" roughness={0.9} />
          </mesh>
        </group>
      )}

      {d.id === 'mainframe' && (
        <group>
          <mesh position={[0, 2.1, 0]}>
            <boxGeometry args={[1.7, 2.4, 1.1]} />
            <meshStandardMaterial color={d.body} roughness={0.5} metalness={0.4} />
          </mesh>
          {[1.05, 1.55, 2.05, 2.55].map((y, i) => (
            <group key={i} position={[0, y, 0.57]}>
              <mesh>
                <boxGeometry args={[1.2, 0.26, 0.12]} />
                <meshStandardMaterial color={d.dark} roughness={0.7} />
              </mesh>
              <mesh ref={ledRef} position={[-0.35, 0, 0.07]}>
                <boxGeometry args={[0.06, 0.06, 0.02]} />
                <meshStandardMaterial color="#33ff88" emissive="#33ff88" emissiveIntensity={1.4} />
              </mesh>
              <mesh position={[0.3, 0, 0.07]}>
                <boxGeometry args={[0.05, 0.05, 0.02]} />
                <meshStandardMaterial color="#ffcc33" emissive="#ffcc33" emissiveIntensity={0.9} />
              </mesh>
            </group>
          ))}
          <mesh position={[0, 3.55, -0.1]}>
            <boxGeometry args={[0.95, 0.8, 0.6]} />
            <meshStandardMaterial color={d.dark} roughness={0.6} />
          </mesh>
          <Screen kind="matrix" width={0.7} height={0.55} position={[0, 3.58, 0.2]} />
        </group>
      )}

      <Plaque name={d.name} sub={d.sub} />
    </group>
  );
}

// Floating data particles for retro-tech ambience
function FloatingBits() {
  const refs = useRef([]);
  const COUNT = 26;
  const seeds = useMemo(() => Array.from({ length: COUNT }, (_, i) => ({
    x: (Math.random() - 0.5) * 22,
    y: 1 + Math.random() * 5,
    z: -4 - Math.random() * 5,
    speed: 0.3 + Math.random() * 0.6,
    phase: Math.random() * Math.PI * 2,
    color: ['#33ff88', '#33ccff', '#ffcc33'][i % 3],
  })), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    seeds.forEach((s, i) => {
      const m = refs.current[i];
      if (!m) return;
      m.position.y = s.y + Math.sin(t * s.speed + s.phase) * 0.4;
      m.position.x = s.x + Math.cos(t * s.speed * 0.6 + s.phase) * 0.5;
    });
  });

  return (
    <group>
      {seeds.map((s, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)} position={[s.x, s.y, s.z]}>
          <boxGeometry args={[0.07, 0.07, 0.07]} />
          <meshBasicMaterial color={s.color} toneMapped={false} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
}

const ComputerMuseumRoom = ({ showRoom, onReady, isExiting, isWarmup }) => {
  const hasSignaledReady = useRef(false);
  const frameCount = useRef(0);

  useFrame(() => {
    if (!hasSignaledReady.current) {
      frameCount.current++;
      if (frameCount.current >= 12) {
        hasSignaledReady.current = true;
        onReady?.();
      }
    }
  });

  return (
    <group position={[0, 0.5, -18]}>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[26, 20]} />
        <meshStandardMaterial color="#141821" roughness={0.85} metalness={0.2} />
      </mesh>
      <gridHelper args={[25, 25, '#2a3b52', '#1c2634']} position={[0, 0.001, 0]} />
      {/* glow strips on floor edges */}
      {[[-12.8, 0, 0, Math.PI / 2], [12.8, 0, 0, -Math.PI / 2]].map(([x, y, z, rot], i) => (
        <mesh key={i} position={[x, 0.012, 0]} rotation={[rot, 0, 0]}>
          <planeGeometry args={[20, 0.06]} />
          <meshBasicMaterial color="#33ccff" toneMapped={false} transparent opacity={0.55} />
        </mesh>
      ))}
      {/* back wall */}
      <mesh position={[0, 3.4, -11]}>
        <planeGeometry args={[26, 8.2]} />
        <meshStandardMaterial color="#1a2230" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.4, -10.98]}>
        <planeGeometry args={[24, 6.6]} />
        <meshStandardMaterial color="#202b3c" roughness={0.85} />
      </mesh>
      {/* side walls */}
      <mesh position={[-13.1, 3.4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[20, 8.2]} />
        <meshStandardMaterial color="#161d29" roughness={0.9} />
      </mesh>
      <mesh position={[13.1, 3.4, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[20, 8.2]} />
        <meshStandardMaterial color="#161d29" roughness={0.9} />
      </mesh>
      {/* ceiling + neon strips */}
      <mesh position={[0, 8.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 20]} />
        <meshStandardMaterial color="#10151d" roughness={0.95} />
      </mesh>
      {[-6, 0, 6].map((x, i) => (
        <mesh key={i} position={[x, 8.0, 0]}>
          <boxGeometry args={[0.08, 0.03, 16]} />
          <meshBasicMaterial color={i === 1 ? '#33ff88' : '#33ccff'} toneMapped={false} />
        </mesh>
      ))}

      {/* neon title */}
      <Text position={[0, 6.6, -10.8]} fontSize={0.62} color="#7fe8ff" anchorX="center" anchorY="middle" font={FONT} outlineWidth={0.03} outlineColor="#0a1626">
        {'电脑博物馆'}
      </Text>
      <Text position={[0, 5.95, -10.8]} fontSize={0.17} color="#5a7fa0" anchorX="center" anchorY="middle" font={FONT}>
        {'RETRO COMPUTER MUSEUM · 致我们回不去的 1980s'}
      </Text>

      {DISPLAYS.map((d, i) => (
        <DisplayUnit key={d.id} d={d} index={i} />
      ))}

      <FloatingBits />
    </group>
  );
};

export default ComputerMuseumRoom;
