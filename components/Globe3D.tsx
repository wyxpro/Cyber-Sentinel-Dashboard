
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE_CORE from 'three';

const THREE = THREE_CORE;

// Constants for Three.js elements to bypass JSX typing issues
const ThreeGroup = 'group' as any;
const ThreeMeshBasicMaterial = 'meshBasicMaterial' as any;
const ThreeMeshStandardMaterial = 'meshStandardMaterial' as any;
const ThreeAmbientLight = 'ambientLight' as any;
const ThreePointLight = 'pointLight' as any;
const ThreeMesh = 'mesh' as any;
const ThreeTorusGeometry = 'torusGeometry' as any;

/**
 * Security Node - Blue glowing spheres as seen in the reference
 */
const SecurityNode = ({ position }: { position: THREE_CORE.Vector3 }) => {
  const meshRef = useRef<THREE_CORE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.15;
      meshRef.current.scale.set(s, s, s);
    }
  });

  return (
    <ThreeGroup position={position}>
      <ThreeMesh ref={meshRef}>
        <Sphere args={[0.045, 16, 16]}>
          <ThreeMeshBasicMaterial color="#3b82f6" />
        </Sphere>
      </ThreeMesh>
      {/* Halo for the node */}
      <ThreeMesh>
        <Sphere args={[0.1, 16, 16]}>
          <ThreeMeshBasicMaterial color="#3b82f6" transparent opacity={0.15} />
        </Sphere>
      </ThreeMesh>
    </ThreeGroup>
  );
};

/**
 * Data Trail - Ribbon-like attack arc with a migrating colored dot head
 */
const DataTrail = ({ start, end, color }: { start: THREE_CORE.Vector3, end: THREE_CORE.Vector3, color: string }) => {
  const curve = useMemo(() => {
    const dist = start.distanceTo(end);
    // Higher mid point for more pronounced arcs like in the reference
    const mid = start.clone().lerp(end, 0.5).normalize().multiplyScalar(2 + dist * 0.5);
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [start, end]);

  const headRef = useRef<THREE_CORE.Mesh>(null);
  const tailRef = useRef<THREE_CORE.Mesh>(null);
  const progressRef = useRef(Math.random()); // Random start offset for "migration" feel

  useFrame((state) => {
    if (headRef.current) {
      // Update migration progress
      progressRef.current = (progressRef.current + 0.002) % 1.0;
      
      const headPos = curve.getPointAt(progressRef.current);
      headRef.current.position.copy(headPos);
      
      const nextPos = curve.getPointAt(Math.min(1, progressRef.current + 0.01));
      headRef.current.lookAt(nextPos);

      // Tail follows slightly behind
      if (tailRef.current) {
        const tailProgress = (progressRef.current - 0.04 + 1.0) % 1.0;
        const tailPos = curve.getPointAt(tailProgress);
        tailRef.current.position.copy(tailPos);
        tailRef.current.lookAt(headPos);
        
        // Pulse visibility and scale
        const s = 1.2 + Math.sin(state.clock.elapsedTime * 8) * 0.3;
        headRef.current.scale.set(s, s, s);
      }
    }
  });

  // Create a thick tube path geometry for the "ribbon"
  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, 0.012, 8, false);
  }, [curve]);

  return (
    <ThreeGroup>
      {/* The visible glowing arc "ribbon" */}
      <ThreeMesh geometry={tubeGeometry}>
        <ThreeMeshBasicMaterial color={color} transparent opacity={0.2} />
      </ThreeMesh>

      {/* Faint Path Trace */}
      <ThreeMesh geometry={tubeGeometry}>
        <ThreeMeshBasicMaterial color={color} transparent opacity={0.05} wireframe />
      </ThreeMesh>

      {/* Migrating Header (The colored dot) */}
      <ThreeMesh ref={headRef}>
        <Sphere args={[0.045, 12, 12]}>
          <ThreeMeshBasicMaterial color={color} transparent opacity={1} />
        </Sphere>
        {/* Core highlight for the dot to make it pop */}
        <Sphere args={[0.02, 8, 8]}>
          <ThreeMeshBasicMaterial color="#ffffff" />
        </Sphere>
        <ThreePointLight distance={0.8} intensity={2.5} color={color} />
      </ThreeMesh>

      {/* Secondary trailing pulse light */}
      <ThreeMesh ref={tailRef}>
        <Sphere args={[0.025, 8, 8]}>
          <ThreeMeshBasicMaterial color={color} transparent opacity={0.4} />
        </Sphere>
        <ThreePointLight distance={0.5} intensity={1} color={color} />
      </ThreeMesh>
    </ThreeGroup>
  );
};

const GlobeScene = () => {
  const globeRef = useRef<THREE_CORE.Group>(null);
  
  // Use high-contrast earth textures
  const [colorMap, nightMap] = useLoader(THREE.TextureLoader, [
    'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
    'https://threejs.org/examples/textures/planets/earth_lights_2048.png'
  ]);

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.0004;
    }
  });

  // Generate data points for the visualization
  const { nodes, arcs } = useMemo(() => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
    const nodes: THREE_CORE.Vector3[] = [];
    const arcs: { start: THREE_CORE.Vector3; end: THREE_CORE.Vector3; color: string }[] = [];

    // Fewer nodes to keep the surface clean
    for (let i = 0; i < 10; i++) {
      const phi = (Math.random() * 0.5 + 0.15) * Math.PI;
      const theta = Math.random() * Math.PI * 2;
      const pos = new THREE.Vector3().setFromSphericalCoords(2.01, phi, theta);
      nodes.push(pos);
    }

    // Significantly reduced number of arcs (migration trails)
    for (let i = 0; i < 6; i++) {
      const start = nodes[Math.floor(Math.random() * nodes.length)];
      const end = nodes[Math.floor(Math.random() * nodes.length)];
      if (start.distanceTo(end) > 0.8) {
        arcs.push({ start, end, color: colors[i % colors.length] });
      }
    }
    return { nodes, arcs };
  }, []);

  return (
    <ThreeGroup>
      {/* Outermost dotted grid shell removed as requested */}

      <ThreeGroup ref={globeRef}>
        {/* Main Earth Body */}
        <ThreeMesh>
          <Sphere args={[2, 64, 64]}>
            <ThreeMeshStandardMaterial 
              map={colorMap} 
              emissiveMap={nightMap}
              emissive="#00f2ff"
              emissiveIntensity={2.8}
              color="#0f172a" 
              roughness={0.4}
              metalness={0.7}
            />
          </Sphere>
        </ThreeMesh>

        {/* Outer Surface "Glow" Wireframe (Subtle detail near surface) */}
        <ThreeMesh>
          <Sphere args={[2.005, 64, 64]}>
            <ThreeMeshBasicMaterial color="#00f2ff" transparent opacity={0.03} wireframe />
          </Sphere>
        </ThreeMesh>

        {/* Interactive Data Nodes */}
        {nodes.map((pos, i) => <SecurityNode key={i} position={pos} />)}

        {/* Migrating Data Arcs (Reduced to 6 trails) */}
        {arcs.map((arc, i) => <DataTrail key={i} {...arc} />)}
      </ThreeGroup>

      {/* Large Decorative Technical Rings */}
      <ThreeGroup rotation={[Math.PI / 3, 0, 0]}>
         <ThreeMesh>
            <ThreeTorusGeometry args={[3.0, 0.005, 16, 100]} />
            <ThreeMeshBasicMaterial color="#3b82f6" transparent opacity={0.15} />
         </ThreeMesh>
      </ThreeGroup>
    </ThreeGroup>
  );
};

const Globe3D: React.FC = () => {
  return (
    <div className="w-full h-full relative overflow-hidden group">
      {/* Background glow vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(0,102,255,0.08)_0%,_transparent_80%)]" />

      <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 1.8, 6.8]} fov={38} />
        
        <ThreeAmbientLight intensity={0.4} />
        <ThreePointLight position={[10, 15, 10]} intensity={2} color="#ffffff" />
        <ThreePointLight position={[-10, -5, -10]} intensity={1.2} color="#3b82f6" />
        
        <React.Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.08} floatIntensity={0.15}>
            <GlobeScene />
          </Float>
        </React.Suspense>
        
        <Stars radius={150} depth={50} count={6000} factor={4} saturation={0} fade speed={1.2} />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.6}
        />
      </Canvas>

      {/* High Fidelity Overlay Elements */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Animated Tech HUD Ring */}
        <div className="absolute w-[500px] h-[500px] border-2 border-blue-500/5 rounded-full animate-[spin_180s_linear_infinite]" />
        <div className="absolute w-[600px] h-[600px] border border-dashed border-cyan-400/5 rounded-full animate-[spin_100s_linear_infinite_reverse]" />
        
        {/* Bottom Shade Mask */}
        <div className="absolute bottom-0 left-0 w-full h-[250px] bg-gradient-to-t from-[#000814] to-transparent z-10" />
      </div>
    </div>
  );
};

export default Globe3D;
