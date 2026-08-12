import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import DamEnrichment from "./DamEnrichment";

// ========= 远景水墨山 (painted mountain planes) =========
function DistantMountains({ z, color, baseY = -1.5, count = 8, h = 4, w = 6, opacity = 1 }) {
  const groupRef = useRef();
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.x = Math.sin(t * 0.05) * 0.3;
  });
  return (
    <group ref={groupRef} position={[0, baseY, z]}>
      {Array.from({ length: count }).map((_, i) => {
        const x = (i - (count - 1) / 2) * w;
        const h2 = h * (0.7 + 0.5 * Math.sin(i * 1.7));
        return (
          <mesh key={i} position={[x, h2 / 2, -i * 0.4]}>
            <coneGeometry args={[h2 * 0.55, h2, 5]} />
            <meshBasicMaterial color={color} transparent opacity={opacity} />
            <Edges color="#3a3a4a" threshold={15} />
          </mesh>
        );
      })}
    </group>
  );
}

// ========= 云 (painted-style spheres) =========
function Cloud({ position, scale = 1, color = "#ffffff" }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.x = position[0] + Math.sin(t * 0.2 + position[2]) * 0.6;
    ref.current.position.y = position[1] + Math.sin(t * 0.5 + position[2]) * 0.15;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.6, 12, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0.5, -0.05, 0]}>
        <sphereGeometry args={[0.4, 12, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[-0.5, 0.05, 0]}>
        <sphereGeometry args={[0.45, 12, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0.2, 0.35, 0]}>
        <sphereGeometry args={[0.35, 12, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0.05, -0.18, 0]} scale={[1.05, 0.4, 1]}>
        <sphereGeometry args={[0.6, 12, 8]} />
        <meshBasicMaterial color="#d8d2bf" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function Clouds({ count = 10, yRange = [2, 5], zRange = [-8, -4] }) {
  const positions = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      x: -10 + (i % 5) * 4 + Math.sin(i) * 1.5,
      y: yRange[0] + Math.random() * (yRange[1] - yRange[0]),
      z: zRange[0] + Math.random() * (zRange[1] - zRange[0]),
      scale: 0.7 + Math.random() * 0.5,
    }));
  }, [count, yRange, zRange]);
  return (
    <group>
      {positions.map((p, i) => (
        <Cloud key={i} position={[p.x, p.y, p.z]} scale={p.scale} />
      ))}
    </group>
  );
}

// ========= 大坝主体 (paper-cut 立绘) =========
function DamStructure({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[18, 4.5, 1.4]} />
        <meshBasicMaterial color="#b8a890" />
        <Edges color="#3a2a1a" />
      </mesh>
      <mesh position={[0, 4.5, 0]}>
        <boxGeometry args={[18.6, 0.4, 1.6]} />
        <meshBasicMaterial color="#7a6a55" />
        <Edges color="#3a2a1a" />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[22, 0.6, 2]} />
        <meshBasicMaterial color="#5a4a38" />
        <Edges color="#3a2a1a" />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[-4 + i * 2, 1.2, 0.71]}>
          <boxGeometry args={[1.4, 2, 0.1]} />
          <meshBasicMaterial color={i % 2 === 0 ? "#4a6a8a" : "#5a7a9a"} />
          <Edges color="#2a3a4a" />
        </mesh>
      ))}
      <mesh position={[-11, 1.5, 0]}>
        <boxGeometry args={[1.6, 4, 1.4]} />
        <meshBasicMaterial color="#8a8a8a" />
        <Edges color="#3a3a3a" />
      </mesh>
      <mesh position={[11, 1.5, 0]}>
        <boxGeometry args={[1.6, 4, 1.4]} />
        <meshBasicMaterial color="#8a8a8a" />
        <Edges color="#3a3a3a" />
      </mesh>
      <mesh position={[0, 5.5, 0]}>
        <boxGeometry args={[3, 1, 1.4]} />
        <meshBasicMaterial color="#d4a878" />
        <Edges color="#5a3a1a" />
      </mesh>
      <mesh position={[0, 6.2, 0]}>
        <boxGeometry args={[2.4, 0.3, 1.3]} />
        <meshBasicMaterial color="#c41e1e" />
        <Edges color="#5a0a0a" />
      </mesh>
    </group>
  );
}

// ========= 江面 (painted 水面 + 波纹) =========
function YangtzeRiver({ position }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.children.forEach((c, i) => {
      if (c.position && c.name === "wave") {
        c.position.x = -12 + ((t * 1.2 + i * 0.5) % 24);
        c.position.z = position[2] + Math.sin(t * 0.6 + i) * 0.05;
      }
    });
  });
  return (
    <group ref={ref} position={position}>
      {/* === YANGTZE RIVER EXPANDED for grandeur (80x40 main + deeper channels) === */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 40]} />
        <meshBasicMaterial color="#3a6f8a" />
      </mesh>
      {/* deeper mid channel */}
      <mesh position={[0, 0.005, -2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[76, 6]} />
        <meshBasicMaterial color="#1d3f55" transparent opacity={0.6} />
      </mesh>
      {/* foam streaks (denser 28 highlights) */}
      {Array.from({ length: 28 }).map((_, i) => (
        <mesh key={"wave-new-" + i} name="wave" position={[-38 + i * 2.8, 0.02, -10 + (i % 3) * 4]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.9, 0.08]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.55} />
        </mesh>
      ))}
      {/* darker depth ridges for texture */}
      <mesh position={[0, 0.01, -12]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[78, 1.4]} />
        <meshBasicMaterial color="#1f4762" transparent opacity={0.55} />
      </mesh>
      <mesh position={[0, 0.01, 8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 1.2]} />
        <meshBasicMaterial color="#2a4a55" transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

// ========= 龙舟 =========
function DragonBoat({ position, rotation = [0, 0, 0], scale = 1 }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 0.6 + position[0]) * 0.08;
    ref.current.rotation.z = Math.sin(t * 0.5 + position[0]) * 0.06;
  });
  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      <mesh>
        <boxGeometry args={[1.5, 0.3, 0.45]} />
        <meshBasicMaterial color="#c41e1e" />
        <Edges color="#5a0a0a" />
      </mesh>
      <mesh position={[0.85, 0.08, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.18, 0.4, 6]} />
        <meshBasicMaterial color="#d4a020" />
        <Edges color="#5a3a0a" />
      </mesh>
      <mesh position={[0.95, 0.12, 0.12]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#2a1a0a" />
      </mesh>
      <mesh position={[0.95, 0.12, -0.12]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#2a1a0a" />
      </mesh>
      <mesh position={[-0.2, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.18, 12]} />
        <meshBasicMaterial color="#a02020" />
      </mesh>
      {[-0.6, -0.4, 0, 0.2].map((x, i) => (
        <mesh key={i} position={[x, -0.05, 0.35]} rotation={[0, 0, Math.PI / 8]}>
          <boxGeometry args={[0.04, 0.4, 0.04]} />
          <meshBasicMaterial color="#5a3a1a" />
        </mesh>
      ))}
    </group>
  );
}

// ========= 灯笼 =========
function Lantern({ position, color = "#c41e1e", scale = 1 }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.z = Math.sin(t * 0.8 + position[0]) * 0.12;
    ref.current.position.y = position[1] + Math.sin(t * 0.4 + position[0]) * 0.04;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 1, 4]} />
        <meshBasicMaterial color="#3a2010" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.06, 8]} />
        <meshBasicMaterial color="#5a3a1a" />
      </mesh>
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.06, 8]} />
        <meshBasicMaterial color="#5a3a1a" />
      </mesh>
      <mesh position={[0, -0.4, 0]}>
        <coneGeometry args={[0.06, 0.3, 6]} />
        <meshBasicMaterial color="#d4a020" />
      </mesh>
      <mesh position={[-0.08, 0.05, 0.18]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#ffd0d0" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

// ========= 鱼 =========
function Fish({ position, color, delay = 0 }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + delay;
    const jumpT = (t % 3.5) / 3.5;
    if (jumpT < 0.4) {
      ref.current.position.y = position[1] + Math.sin(jumpT * Math.PI * 2.5) * 0.8;
      ref.current.visible = true;
      ref.current.rotation.z = Math.sin(t * 4) * 0.4;
    } else {
      ref.current.visible = false;
    }
  });
  return (
    <group ref={ref} position={position}>
      <mesh rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.08, 0.3, 6]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[-0.15, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[0.12, 0.08]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ========= 牌坊 =========
function Paifang({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[-0.7, 1.2, 0]}>
        <boxGeometry args={[0.18, 2.4, 0.18]} />
        <meshBasicMaterial color="#5a3a1a" />
      </mesh>
      <mesh position={[0.7, 1.2, 0]}>
        <boxGeometry args={[0.18, 2.4, 0.18]} />
        <meshBasicMaterial color="#5a3a1a" />
      </mesh>
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[1.9, 0.18, 0.12]} />
        <meshBasicMaterial color="#7a2222" />
        <Edges color="#3a1010" />
      </mesh>
      <mesh position={[0, 2.4, 0]}>
        <boxGeometry args={[2.2, 0.3, 0.18]} />
        <meshBasicMaterial color="#7a2222" />
        <Edges color="#3a1010" />
      </mesh>
      <mesh position={[0, 1.85, 0]}>
        <boxGeometry args={[1.4, 0.4, 0.05]} />
        <meshBasicMaterial color="#f6efdf" />
        <Edges color="#5a3a1a" />
      </mesh>
      <mesh position={[0, 2.7, 0]}>
        <coneGeometry args={[1.2, 0.4, 4]} />
        <meshBasicMaterial color="#3a2010" />
        <Edges color="#1a0a00" />
      </mesh>
    </group>
  );
}


// ========= 5-tier ship lock (Three Gorges Dam south-side locks) =========
function ShipLock({ position, scale = 1 }) {
  const chambers = [0, 1, 2, 3, 4];
  return (
    <group position={position} scale={scale}>
      {chambers.map((i) => (
        <group key={"lock-" + i} position={[-i * 1.4, 0, -i * 2.6]}>
          <mesh position={[-1.6, 0.8, 0]}>
            <boxGeometry args={[0.4, 1.6, 2.2]} />
            <meshBasicMaterial color="#9a8a78" />
            <Edges color="#3a2a1a" />
          </mesh>
          <mesh position={[1.6, 0.8, 0]}>
            <boxGeometry args={[0.4, 1.6, 2.2]} />
            <meshBasicMaterial color="#9a8a78" />
            <Edges color="#3a2a1a" />
          </mesh>
          <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.8, 2.0]} />
            <meshBasicMaterial color="#3a6f8a" />
          </mesh>
          <mesh position={[0, 0.5, -1.05]}>
            <boxGeometry args={[2.8, 0.9, 0.1]} />
            <meshBasicMaterial color="#c41e1e" />
            <Edges color="#5a0a0a" />
          </mesh>
          <mesh position={[0, 0.5, 1.05]}>
            <boxGeometry args={[2.8, 0.9, 0.1]} />
            <meshBasicMaterial color="#c41e1e" />
            <Edges color="#5a0a0a" />
          </mesh>
          <mesh position={[-1.8, 1.4, -1.05]}>
            <boxGeometry args={[0.4, 1.2, 0.5]} />
            <meshBasicMaterial color="#d4a878" />
            <Edges color="#3a2a1a" />
          </mesh>
          <mesh position={[1.8, 1.4, -1.05]}>
            <boxGeometry args={[0.4, 1.2, 0.5]} />
            <meshBasicMaterial color="#d4a878" />
            <Edges color="#3a2a1a" />
          </mesh>
          <mesh position={[-1.8, 1.4, 1.05]}>
            <boxGeometry args={[0.4, 1.2, 0.5]} />
            <meshBasicMaterial color="#d4a878" />
            <Edges color="#3a2a1a" />
          </mesh>
          <mesh position={[1.8, 1.4, 1.05]}>
            <boxGeometry args={[0.4, 1.2, 0.5]} />
            <meshBasicMaterial color="#d4a878" />
            <Edges color="#3a2a1a" />
          </mesh>
        </group>
      ))}
      <mesh position={[-2.8, 2.2, -5.2]}>
        <boxGeometry args={[1.6, 0.8, 1.0]} />
        <meshBasicMaterial color="#e8d4b0" />
        <Edges color="#3a2a1a" />
      </mesh>
      <mesh position={[-2.8, 2.6, -5.2]}>
        <boxGeometry args={[1.0, 0.3, 0.7]} />
        <meshBasicMaterial color="#c41e1e" />
        <Edges color="#5a0a0a" />
      </mesh>
    </group>
  );
}

// ========= Cargo barge (3 stacked containers + bridge cabin) =========
function CargoShip({ position, rotation = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[3.4, 0.24, 0.7]} />
        <meshBasicMaterial color="#2a2a2a" />
        <Edges color="#0a0a0a" />
      </mesh>
      <mesh position={[1.7, 0.12, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.35, 0.6, 4]} />
        <meshBasicMaterial color="#2a2a2a" />
        <Edges color="#0a0a0a" />
      </mesh>
      <mesh position={[-1.0, 0.48, 0]}>
        <boxGeometry args={[1.2, 0.42, 0.55]} />
        <meshBasicMaterial color="#c41e1e" />
        <Edges color="#5a0a0a" />
      </mesh>
      <mesh position={[0.15, 0.48, 0]}>
        <boxGeometry args={[1.0, 0.42, 0.55]} />
        <meshBasicMaterial color="#3a6f9a" />
        <Edges color="#1a3a5a" />
      </mesh>
      <mesh position={[0.15, 0.92, 0]}>
        <boxGeometry args={[1.0, 0.42, 0.55]} />
        <meshBasicMaterial color="#e89a1a" />
        <Edges color="#7a4a0a" />
      </mesh>
      <mesh position={[1.45, 0.55, 0]}>
        <boxGeometry args={[0.55, 0.8, 0.55]} />
        <meshBasicMaterial color="#f6efdf" />
        <Edges color="#5a4a3a" />
      </mesh>
      <mesh position={[1.45, 1.05, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.2, 6]} />
        <meshBasicMaterial color="#c41e1e" />
      </mesh>
    </group>
  );
}

// ========= Passenger ship (sleek white multi-deck) =========
function PassengerShip({ position, rotation = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[2.6, 0.2, 0.55]} />
        <meshBasicMaterial color="#f6efdf" />
        <Edges color="#5a4a3a" />
      </mesh>
      <mesh position={[1.35, 0.1, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.28, 0.5, 4]} />
        <meshBasicMaterial color="#f6efdf" />
        <Edges color="#5a4a3a" />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[2.2, 0.2, 0.5]} />
        <meshBasicMaterial color="#f6efdf" />
        <Edges color="#5a4a3a" />
      </mesh>
      <mesh position={[-0.2, 0.7, 0]}>
        <boxGeometry args={[1.7, 0.18, 0.45]} />
        <meshBasicMaterial color="#f6efdf" />
        <Edges color="#5a4a3a" />
      </mesh>
      <mesh position={[-0.5, 0.92, 0]}>
        <boxGeometry args={[0.9, 0.18, 0.4]} />
        <meshBasicMaterial color="#f6efdf" />
        <Edges color="#5a4a3a" />
      </mesh>
      {[-0.85, -0.5, -0.15, 0.2, 0.55].map((x, i) => (
        <mesh key={"pw-" + i} position={[x, 0.28, 0.28]}>
          <boxGeometry args={[0.18, 0.08, 0.02]} />
          <meshBasicMaterial color="#3a4a5a" />
        </mesh>
      ))}
      <mesh position={[0.7, 1.12, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.4, 6]} />
        <meshBasicMaterial color="#c41e1e" />
      </mesh>
    </group>
  );
}

// ========= Container ship (12 stacked containers + bridge cabin) =========
function ContainerShip({ position, rotation = [0, 0, 0], scale = 1 }) {
  const palette = ["#c41e1e", "#3a6f9a", "#e89a1a", "#5a7a58", "#7a5a3a"];
  const containers = [];
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 3; y++) {
      containers.push({ x, y, color: palette[(x + y) % palette.length] });
    }
  }
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[5.2, 0.3, 1.3]} />
        <meshBasicMaterial color="#1a1a1a" />
        <Edges color="#000000" />
      </mesh>
      <mesh position={[2.7, 0.15, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.6, 0.8, 4]} />
        <meshBasicMaterial color="#1a1a1a" />
        <Edges color="#000000" />
      </mesh>
      <mesh position={[-2.3, 0.85, 0]}>
        <boxGeometry args={[0.7, 1.1, 0.9]} />
        <meshBasicMaterial color="#f6efdf" />
        <Edges color="#5a4a3a" />
      </mesh>
      <mesh position={[-2.3, 1.5, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.5]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      {containers.map((c, i) => (
        <mesh key={"cs-" + i} position={[-1.5 + c.x * 0.9, 0.55 + c.y * 0.45, 0]}>
          <boxGeometry args={[0.82, 0.42, 0.85]} />
          <meshBasicMaterial color={c.color} />
          <Edges color="#1a1a1a" />
        </mesh>
      ))}
    </group>
  );
}

// ========= 主装饰组 =========
const YichangDamDecorations = () => {
  return (
    <group>
      {/* === DISTANT MOUNTAINS EXPANDED (denser for scale: 14 / 13 / 12 peaks) === */}
      <DistantMountains z={-32} color="#7a8aa0" baseY={-1.5} count={14} h={7} w={5} opacity={0.5} />
      <DistantMountains z={-25} color="#8a9aa8" baseY={-1.5} count={13} h={6} w={4.5} opacity={0.7} />
      <DistantMountains z={-18} color="#a8b0bc" baseY={-1.5} count={12} h={4} w={4} opacity={0.85} />

      <YangtzeRiver position={[0, -1.6, -10]} />

      <DamStructure position={[0, 0, -8]} />

      <Paifang position={[-6, -1.5, -5]} scale={0.9} />
      <Paifang position={[6, -1.5, -5]} scale={0.9} />

      <Lantern position={[-3, 6, -7.5]} color="#c41e1e" scale={1.2} />
      <Lantern position={[3, 6, -7.5]} color="#c41e1e" scale={1.2} />
      <Lantern position={[-6, 3, -4.5]} color="#e89a1a" scale={0.9} />
      <Lantern position={[6, 3, -4.5]} color="#e89a1a" scale={0.9} />
      <Lantern position={[0, 6.5, -7.5]} color="#ffd700" scale={1.4} />

      <DragonBoat position={[-5, -1.3, -8]} scale={1.2} />
      <DragonBoat position={[5, -1.3, -7]} scale={1.2} />
      <DragonBoat position={[0, -1.3, -6]} scale={0.9} />

      {/* === NEW: ship lock + cargo/passenger/container ships for Three Gorges harbor === */}
      <ShipLock position={[-9, -1.5, -4]} scale={0.7} />
      <CargoShip position={[-3, -1.4, -3]} scale={1.0} rotation={[0, 0.3, 0]} />
      <CargoShip position={[3, -1.4, -4]} scale={1.0} rotation={[0, -0.2, 0]} />
      <PassengerShip position={[5, -1.4, -2]} scale={0.85} rotation={[0, -0.4, 0]} />
      <PassengerShip position={[-5, -1.4, -2]} scale={0.85} rotation={[0, 0.5, 0]} />
      <ContainerShip position={[7, -1.4, -3]} scale={0.6} rotation={[0, -0.3, 0]} />

      <Fish position={[-3, -1.4, -6]} color="#7ba8c0" delay={0} />
      <Fish position={[-1, -1.4, -5.5]} color="#a8c8e0" delay={1.5} />
      <Fish position={[2, -1.4, -6.5]} color="#5a8db0" delay={2.8} />

      <Clouds count={12} yRange={[3, 7]} zRange={[-7, -3]} />

      {/* === Dam enrichment: cranes, birds, trees, sailboats, bridges, driftwood === */}
      <DamEnrichment />

      {/* === THREE GORGES RESERVOIR EXPANDED (120x60 main, 10 sub-strips) for grandeur behind dam === */}
      <group position={[0, -1.4, -22]}>
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[120, 60]} />
          <meshBasicMaterial color="#5a8fa8" side={THREE.DoubleSide} />
        </mesh>
        {/* channel ridge (mid-water) */}
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[118, 4]} />
          <meshBasicMaterial color="#366580" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
        {/* horizontal ripple strips */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <mesh key={"rw-" + i} position={[-50 + i * 11, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[6, 50]} />
            <meshBasicMaterial color="#7baac6" transparent opacity={0.55} side={THREE.DoubleSide} />
          </mesh>
        ))}
        {/* foam cap ripples near dam */}
        <mesh position={[0, 0.02, 18]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[110, 6]} />
          <meshBasicMaterial color="#9bcadb" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      </group>
      {/* === ZIGUI TOWN SILHOUETTE (z=-40, doubled to 8 peaks + curved line) === */}
      <group position={[0, 0, -40]}>
        {/* original 4 cones preserved */}
        <mesh position={[-8, 1.2, 0]}><coneGeometry args={[2.4, 3, 3]} /><meshBasicMaterial color="#5a6878" /></mesh>
        <mesh position={[-2, 0.9, 0]}><coneGeometry args={[1.8, 2.2, 3]} /><meshBasicMaterial color="#6a7888" /></mesh>
        <mesh position={[4, 1.4, 0]}><coneGeometry args={[2.8, 3.6, 3]} /><meshBasicMaterial color="#5a6878" /></mesh>
        <mesh position={[9, 0.8, 0]}><coneGeometry args={[2, 2.4, 3]} /><meshBasicMaterial color="#6a7888" /></mesh>
        {/* additional 4 peaks for richer skyline */}
        <mesh position={[13, 1.0, 0]}><coneGeometry args={[1.6, 2.0, 3]} /><meshBasicMaterial color="#5a6878" /></mesh>
        <mesh position={[-12, 1.1, 0]}><coneGeometry args={[1.4, 1.8, 3]} /><meshBasicMaterial color="#6a7888" /></mesh>
        <mesh position={[6, 1.6, -1]}><coneGeometry args={[1.5, 2.3, 3]} /><meshBasicMaterial color="#5a6878" /></mesh>
        <mesh position={[-5, 1.3, -1]}><coneGeometry args={[1.2, 1.6, 3]} /><meshBasicMaterial color="#6a7888" /></mesh>
      </group>
    </group>
  );
};

export default YichangDamDecorations;
