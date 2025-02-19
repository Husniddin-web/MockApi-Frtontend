import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { useTheme } from "../context/ThemeContext";

function StarField() {
  const ref = useRef();
  const { isDark } = useTheme();

  // Generate sphere points with valid positions
  const sphere = random.inSphere(new Float32Array(5000), {
    radius: 1.2,
    randomize: true,
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={sphere}
        stride={3}
        frustumCulled={false}
        key={sphere.length} // Add key to force re-render when points change
      >
        <PointMaterial
          transparent
          color={isDark ? "#fff" : "#000"}
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function Stars() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        style={{ position: "absolute" }}
        onCreated={({ gl }) => {
          gl.setClearColor("#00000000", 0); // Set transparent background
        }}
      >
        <StarField />
      </Canvas>
    </div>
  );
}
