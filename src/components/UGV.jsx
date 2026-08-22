import { useRef } from "react";

export default function UGV({ position = [0, 0.75, 0] }) {
  const ugvRef = useRef();

  return (
    <group ref={ugvRef} position={position}>
      {/* Main chassis */}
      <mesh castShadow>
        <boxGeometry args={[2.5, 0.7, 1.6]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>

      {/* Upper body */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[1.5, 0.4, 1.2]} />
        <meshStandardMaterial color="#666666" />
      </mesh>

      {/* Sensor mast */}
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.7, 16]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Sensor */}
      <mesh position={[0, 1.45, 0]}>
        <boxGeometry args={[0.4, 0.25, 0.4]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      {/* Wheels */}
      {[
        [-0.9, -0.25, 0.85],
        [0.9, -0.25, 0.85],
        [-0.9, -0.25, -0.85],
        [0.9, -0.25, -0.85],
      ].map((wheelPosition, index) => (
        <mesh
          key={index}
          position={wheelPosition}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.4, 0.4, 0.3, 24]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      ))}
    </group>
  );
}