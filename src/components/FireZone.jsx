import { useMemo } from "react";

export default function FireZone({
  position = [12, 0.1, -5],
  radius = 3,
}) {
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      x: (Math.random() - 0.5) * radius,
      y: Math.random() * 2,
      z: (Math.random() - 0.5) * radius,
      size: 0.2 + Math.random() * 0.3,
    }));
  }, [radius]);

  return (
    <group position={position}>
      {/* Fire zone ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius, 32]} />
        <meshStandardMaterial color="#5a1a00" />
      </mesh>

      {/* Flames */}
      {particles.map((particle, index) => (
        <mesh
          key={index}
          position={[particle.x, particle.y, particle.z]}
        >
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshStandardMaterial
            color="#ff5500"
            emissive="#ff2200"
            emissiveIntensity={2}
          />
        </mesh>
      ))}
    </group>
  );
}