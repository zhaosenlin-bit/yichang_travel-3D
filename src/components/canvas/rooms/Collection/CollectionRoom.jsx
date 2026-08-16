import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const FONT = 'https://fonts.gstatic.com/s/zcoolxiaowei/v15/i7dMIFFrTRywPpUVX9_RJyM1YFI.ttf';

const EXHIBITS = [
  { id: 'ding', name: '青铜鼎', sub: '商周礼器 · 巴楚重器', color: '#8a6a3b', body: '#7a5c2e' },
  { id: 'bi', name: '玉璧', sub: '祭礼玉器 · 天圆地方', color: '#9fc9a8', body: '#7fb293' },
  { id: 'vase', name: '青花瓷', sub: '元明青花 · 网口喂晕', color: '#3f6fa8', body: '#2f5580' },
  { id: 'bell', name: '编钟', sub: '楚国乐礼 · 乐之圣器', color: '#b98a2f', body: '#9c721f' },
  { id: 'lacquer', name: '漆器', sub: '楚式漆艺 · 朱红黑色', color: '#a03a2a', body: '#8a2f22' },
];

// Draw a procedural artifact sprite
function drawArtifact(id) {
  const s = 256;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const g = c.getContext('2d');
  const ex = EXHIBITS.find((e) => e.id === id) || EXHIBITS[0];

  g.fillStyle = '#f7f1e3';
  g.fillRect(0, 0, s, s);

  // subtle paper texture
  g.fillStyle = 'rgba(180,150,100,0.08)';
  for (let i = 0; i < 90; i++) {
    g.beginPath();
    g.arc(Math.random() * s, Math.random() * s, 1 + Math.random() * 3, 0, Math.PI * 2);
    g.fill();
  }

  const cx = s / 2;
  const cy = s / 2 + 8;
  g.lineJoin = 'round';

  if (id === 'ding') {
    // bronze ding: legs + bowl + handles
    g.fillStyle = ex.body;
    g.beginPath(); g.moveTo(cx - 22, cy + 52); g.lineTo(cx - 16, cy + 88); g.lineTo(cx - 6, cy + 88); g.lineTo(cx - 4, cy + 54); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(cx + 22, cy + 52); g.lineTo(cx + 16, cy + 88); g.lineTo(cx + 6, cy + 88); g.lineTo(cx + 4, cy + 54); g.closePath(); g.fill();
    g.beginPath(); g.ellipse(cx, cy + 20, 58, 40, 0, 0, Math.PI * 2); g.fill();
    g.fillRect(cx - 58, cy - 16, 116, 26);
    // rim
    g.fillStyle = ex.color;
    g.beginPath(); g.ellipse(cx, cy - 18, 58, 14, 0, 0, Math.PI * 2); g.fill();
    // handles
    g.strokeStyle = ex.body; g.lineWidth = 10;
    g.beginPath(); g.arc(cx - 58, cy + 4, 14, -Math.PI / 2, Math.PI / 2); g.stroke();
    g.beginPath(); g.arc(cx + 58, cy + 4, 14, Math.PI / 2, -Math.PI / 2); g.stroke();
    // taotie pattern
    g.strokeStyle = 'rgba(60,40,10,0.5)'; g.lineWidth = 3;
    for (let i = -2; i <= 2; i++) {
      g.beginPath(); g.moveTo(cx + i * 20 - 6, cy - 4); g.lineTo(cx + i * 20 + 6, cy - 4); g.stroke();
    }
  } else if (id === 'bi') {
    g.strokeStyle = ex.body; g.lineWidth = 30;
    g.beginPath(); g.arc(cx, cy, 64, 0, Math.PI * 2); g.stroke();
    g.strokeStyle = '#f7f1e3'; g.lineWidth = 4;
    g.beginPath(); g.arc(cx, cy, 64, 0, Math.PI * 2); g.stroke();
    g.strokeStyle = ex.color; g.lineWidth = 6;
    g.beginPath(); g.arc(cx, cy, 40, 0, Math.PI * 2); g.stroke();
    g.fillStyle = '#f7f1e3';
    g.beginPath(); g.arc(cx, cy, 18, 0, Math.PI * 2); g.fill();
  } else if (id === 'vase') {
    g.fillStyle = '#f4f7fa';
    g.beginPath();
    g.moveTo(cx - 18, cy + 70);
    g.bezierCurveTo(cx - 26, cy + 30, cx - 30, cy + 8, cx - 24, cy - 20);
    g.bezierCurveTo(cx - 12, cy - 52, cx - 34, cy - 66, cx - 28, cy - 84);
    g.lineTo(cx + 28, cy - 84);
    g.bezierCurveTo(cx + 34, cy - 66, cx + 12, cy - 52, cx + 24, cy - 20);
    g.bezierCurveTo(cx + 30, cy + 8, cx + 26, cy + 30, cx + 18, cy + 70);
    g.closePath(); g.fill();
    // blue glaze patterns
    g.strokeStyle = '#2f5580'; g.lineWidth = 4;
    for (let i = -2; i <= 2; i++) {
      g.beginPath(); g.ellipse(cx + i * 10, cy + 8, 7, 18, 0, 0, Math.PI * 2); g.stroke();
    }
    g.beginPath(); g.arc(cx, cy - 30, 18, 0, Math.PI * 2); g.stroke();
  } else if (id === 'bell') {
    g.fillStyle = ex.body;
    g.beginPath(); g.ellipse(cx, cy + 16, 34, 46, 0, 0, Math.PI * 2); g.fill();
    g.fillRect(cx - 34, cy - 26, 68, 12);
    g.strokeStyle = ex.color; g.lineWidth = 8;
    g.beginPath(); g.arc(cx, cy - 40, 24, Math.PI, 0); g.stroke();
    g.fillStyle = ex.color;
    g.beginPath(); g.arc(cx, cy + 62, 7, 0, Math.PI * 2); g.fill();
    g.strokeStyle = 'rgba(60,40,10,0.45)'; g.lineWidth = 2;
    for (let i = -2; i <= 2; i++) {
      g.beginPath(); g.moveTo(cx + i * 12, cy - 8); g.lineTo(cx + i * 12, cy + 34); g.stroke();
    }
  } else {
    // lacquer box
    g.fillStyle = ex.body;
    g.beginPath(); g.roundRect(cx - 56, cy - 34, 112, 68, 12); g.fill();
    g.fillStyle = ex.color;
    g.beginPath(); g.roundRect(cx - 56, cy - 46, 112, 16, 8); g.fill();
    g.strokeStyle = '#e8c96a'; g.lineWidth = 3;
    g.beginPath(); g.roundRect(cx - 42, cy - 20, 84, 40, 6); g.stroke();
    g.beginPath(); g.arc(cx, cy, 8, 0, Math.PI * 2); g.stroke();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function ExhibitFrame({ ex, index }) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef();
  const texture = useMemo(() => drawArtifact(ex.id), [ex.id]);
  const x = (index - (EXHIBITS.length - 1) / 2) * 3.4;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const target = hovered ? 1.06 : 1;
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, target, 0.12));
    groupRef.current.position.y = 2.6 + Math.sin(t * 0.8 + index) * 0.05;
  });

  return (
    <group
      ref={groupRef}
      position={[x, 2.6, -10]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      {/* gold frame */}
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[2.1, 2.6, 0.1]} />
        <meshStandardMaterial color="#c9a24b" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* artifact image */}
      <mesh position={[0, 0.06, 0]}>
        <planeGeometry args={[1.9, 1.9]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* plaque */}
      <group position={[0, -1.62, 0]}>
        <mesh position={[0, 0, -0.02]}>
          <boxGeometry args={[1.7, 0.42, 0.05]} />
          <meshStandardMaterial color="#f3ead8" roughness={0.9} />
        </mesh>
        <Text position={[0, 0.08, 0.02]} fontSize={0.16} color="#3a2a1a" anchorX="center" anchorY="middle" font={FONT}>
          {ex.name}
        </Text>
        <Text position={[0, -0.08, 0.02]} fontSize={0.09} color="#8a7a5a" anchorX="center" anchorY="middle" font={FONT}>
          {ex.sub}
        </Text>
      </group>
    </group>
  );
}

// Central bronze ding on a rotating pedestal
function CenterPiece() {
  const groupRef = useRef();
  useFrame((state, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.35;
  });
  return (
    <group position={[0, 0.9, -4.5]}>
      <mesh position={[0, -0.75, 0]}>
        <cylinderGeometry args={[1.1, 1.3, 0.5, 32]} />
        <meshStandardMaterial color="#b9a98a" roughness={0.8} />
      </mesh>
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* legs */}
        {[0, 1, 2].map((i) => {
          const a = (i / 3) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.5, -0.55, Math.sin(a) * 0.5]} rotation={[a, 0, 0]}>
              <cylinderGeometry args={[0.06, 0.09, 0.5, 8]} />
              <meshStandardMaterial color="#6e5430" metalness={0.5} roughness={0.5} />
            </mesh>
          );
        })}
        {/* bowl */}
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.62, 0.45, 0.55, 24]} />
          <meshStandardMaterial color="#8a6a3b" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* rim */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.68, 0.68, 0.1, 24]} />
          <meshStandardMaterial color="#b98a2f" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* handles */}
        {[0, 1].map((i) => (
          <mesh key={i} position={[(i ? 1 : -1) * 0.68, 0.1, 0]} rotation={[0, 0, i ? Math.PI / 2 : -Math.PI / 2]}>
            <torusGeometry args={[0.16, 0.05, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#6e5430" metalness={0.5} roughness={0.5} />
          </mesh>
        ))}
      </group>
      <Text position={[0, 1.15, 0]} fontSize={0.2} color="#3a2a1a" anchorX="center" anchorY="middle" font={FONT}>
        {'巴楚宝器 · 卷己之地'}
      </Text>
    </group>
  );
}

const CollectionRoom = ({ showRoom, onReady, isExiting, isWarmup }) => {
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
        <meshStandardMaterial color="#8f6f4a" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[25.4, 19.4]} />
        <meshStandardMaterial color="#a98a5f" roughness={0.95} />
      </mesh>
      {/* back wall */}
      <mesh position={[0, 3.2, -11]}>
        <planeGeometry args={[26, 7.5]} />
        <meshStandardMaterial color="#efe4cf" roughness={0.95} />
      </mesh>
      <mesh position={[0, 6.5, -11]}>
        <planeGeometry args={[26, 0.3]} />
        <meshStandardMaterial color="#c9a24b" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* side walls */}
      <mesh position={[-13.1, 3.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[20, 7.5]} />
        <meshStandardMaterial color="#e8dcc4" roughness={0.95} />
      </mesh>
      <mesh position={[13.1, 3.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[20, 7.5]} />
        <meshStandardMaterial color="#e8dcc4" roughness={0.95} />
      </mesh>
      {/* ceiling */}
      <mesh position={[0, 7.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 20]} />
        <meshStandardMaterial color="#f5efe0" roughness={0.95} />
      </mesh>

      {/* title */}
      <Text position={[0, 5.6, -9.5]} fontSize={0.5} color="#3a2a1a" anchorX="center" anchorY="middle" font={FONT} outlineWidth={0.02} outlineColor="#fffaf0">
        {'宜昌文物数字展厅'}
      </Text>
      <Text position={[0, 5.0, -9.5]} fontSize={0.16} color="#7a6a4a" anchorX="center" anchorY="middle" font={FONT}>
        {'移动鼠标浏览 · 古今相融'}
      </Text>

      {EXHIBITS.map((ex, i) => (
        <ExhibitFrame key={ex.id} ex={ex} index={i} />
      ))}

      <CenterPiece />
    </group>
  );
};

export default CollectionRoom;
