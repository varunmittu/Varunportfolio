import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';

function Avatar() {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#4F46E5" />
    </mesh>
  );
}

export default function ThreeScene() {
  return (
    <Canvas style={{ height: '400px' }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Avatar />
        <OrbitControls enableZoom={false} />
      </Suspense>
    </Canvas>
  );
}