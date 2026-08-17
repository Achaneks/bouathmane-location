"use client";

import { Suspense, useEffect, useMemo, useRef, useState, Component, type ReactNode } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, Sparkles, Stars, useGLTF } from "@react-three/drei";
import { Box3, Mesh, MeshPhysicalMaterial, Vector3, type Group } from "three";

const CAR_MODEL_URL = "https://threejs.org/examples/models/gltf/ferrari.glb";

const PAINT_MATERIAL_NAMES = new Set(["Body_Color", "_0098_DodgerBlue", "plastic_gray"]);
const GLASS_MATERIAL_NAMES = new Set(["Glass_Gray"]);
const WHEEL_MATERIAL_NAMES = new Set(["metal_gray"]);
const CHROME_MATERIAL_NAMES = new Set(["metal_chrome"]);
const CARBON_MATERIAL_NAMES = new Set(["Carbon_Fiber"]);
const TAILLIGHT_MATERIAL_NAMES = new Set(["Taillight_Glass"]);
const SIGNAL_MATERIAL_NAMES = new Set(["Turn_Signal_LED"]);
const HEADLIGHT_MATERIAL_NAMES = new Set(["Projector_Glass"]);
const CALIPER_MESH_PATTERN = /^brake(_\d+)?$/;

/**
 * Starfield background — rendered in a separate, full-screen fixed Canvas
 * behind everything. No lighting needed (Stars/Sparkles are self-lit), so
 * it stays lightweight and independent of the car scene.
 */
export function HeroStarfield() {
  return (
    <>
      <Stars radius={150} depth={80} count={9000} factor={3} saturation={0.4} fade speed={0.3} />
      <Stars radius={100} depth={50} count={400} factor={8} saturation={0.5} fade speed={0.6} />
      <Sparkles count={70} scale={[16, 9, 10]} size={2.5} speed={0.25} color="#C9A84C" opacity={0.6} />
    </>
  );
}

function CarModel() {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(CAR_MODEL_URL);
  const { viewport } = useThree();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { model, scale, center, size } = useMemo(() => {
    const cloned = scene.clone(true);

    const paint = new MeshPhysicalMaterial({
      color: "#070707",
      metalness: 0.85,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.5,
    });

    const glass = new MeshPhysicalMaterial({
      color: "#0d1114",
      metalness: 0,
      roughness: 0.05,
      transmission: 0.92,
      thickness: 0.4,
      ior: 1.52,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.4,
    });

    const wheelMetal = new MeshPhysicalMaterial({
      color: "#b0b2b6",
      metalness: 0.9,
      roughness: 0.35,
      clearcoat: 0.3,
      clearcoatRoughness: 0.25,
      envMapIntensity: 0.4,
    });

    const chrome = new MeshPhysicalMaterial({
      color: "#e9e9ed",
      metalness: 1,
      roughness: 0.05,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.2,
    });

    const carbon = new MeshPhysicalMaterial({
      color: "#1a1a1c",
      metalness: 0.3,
      roughness: 0.45,
      clearcoat: 0.6,
      clearcoatRoughness: 0.35,
      envMapIntensity: 0.35,
    });

    const taillight = new MeshPhysicalMaterial({
      color: "#ff1a1a",
      emissive: "#ff1414",
      emissiveIntensity: 2.5,
      metalness: 0,
      roughness: 0.25,
      transmission: 0.6,
      thickness: 0.3,
      ior: 1.4,
      clearcoat: 1,
    });

    const signalLed = new MeshPhysicalMaterial({
      color: "#ff9a2e",
      metalness: 0,
      roughness: 0.15,
      transmission: 0.5,
      thickness: 0.3,
      ior: 1.45,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 0.6,
    });

    const headlight = new MeshPhysicalMaterial({
      color: "#eaf2ff",
      emissive: "#cfe6ff",
      emissiveIntensity: 0.6,
      metalness: 0,
      roughness: 0.1,
      transmission: 0.7,
      thickness: 0.3,
      ior: 1.45,
      clearcoat: 1,
    });

    const caliper = new MeshPhysicalMaterial({
      color: "#c81e1e",
      metalness: 0.3,
      roughness: 0.35,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
    });

    cloned.traverse((child) => {
      if (child instanceof Mesh) {
        const material = Array.isArray(child.material) ? child.material[0] : child.material;
        const name = material?.name;

        if (CALIPER_MESH_PATTERN.test(child.name)) {
          child.material = caliper;
        } else if (name && PAINT_MATERIAL_NAMES.has(name)) {
          child.material = paint;
        } else if (name && GLASS_MATERIAL_NAMES.has(name)) {
          child.material = glass;
        } else if (name && WHEEL_MATERIAL_NAMES.has(name)) {
          child.material = wheelMetal;
        } else if (name && CHROME_MATERIAL_NAMES.has(name)) {
          child.material = chrome;
        } else if (name && CARBON_MATERIAL_NAMES.has(name)) {
          child.material = carbon;
        } else if (name && TAILLIGHT_MATERIAL_NAMES.has(name)) {
          child.material = taillight;
        } else if (name && SIGNAL_MATERIAL_NAMES.has(name)) {
          child.material = signalLed;
        } else if (name && HEADLIGHT_MATERIAL_NAMES.has(name)) {
          child.material = headlight;
        }
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const box = new Box3().setFromObject(cloned);
    const size = new Vector3();
    const boxCenter = new Vector3();
    box.getSize(size);
    box.getCenter(boxCenter);

    const horizontal = Math.max(size.x, size.z);
    const vertical = size.y;

    // "Contain" fit: the car now lives in its own dedicated container
    // (a grid cell, not a full-screen canvas shared with text), so it no
    // longer needs to dodge anything — just fit within whatever width/height
    // that container gives it. Taking the smaller of the two candidate
    // scales guarantees it never overflows either axis, regardless of the
    // container's aspect ratio (wide-short on mobile, narrow-tall on desktop).
    const widthFitFactor = isDesktop ? 0.7 * 0.75 : 0.7; // 25% smaller fit-width on desktop only, fixes right-edge cutoff
    const scaleToFitWidth = horizontal > 0 ? (viewport.width * widthFitFactor) / horizontal : 1;
    const scaleToFitHeight = vertical > 0 ? (viewport.height * 0.65) / vertical : 1;

    return {
      model: cloned,
      scale: Math.min(scaleToFitWidth, scaleToFitHeight),
      center: boxCenter,
      size,
    };
  }, [scene, viewport.width, viewport.height, isDesktop]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={scale}>
      <primitive object={model} position={[-center.x, -center.y, -center.z]} />
      <ContactShadows
        position={[0, -size.y / 2 + 0.005, 0]}
        opacity={0.65}
        scale={Math.max(size.x, size.z) * 2.6}
        blur={2.4}
        far={size.y * 1.2}
        resolution={256}
        frames={1}
        color="#000000"
      />
    </group>
  );
}

useGLTF.preload(CAR_MODEL_URL);

class CarErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

/**
 * Car scene — rendered in its own Canvas, sized by its grid container
 * (right column on desktop, bottom strip on mobile). Carries its own
 * lighting rig since a separate WebGL context shares nothing with the
 * starfield canvas. The car is centered at the origin and the default
 * camera (positioned on-axis, no X offset) looks straight down -Z through
 * it, so no explicit lookAt/tracking logic is needed anymore.
 */
export function HeroCarScene() {
  return (
    <>
      <Environment resolution={256}>
        <Lightformer form="rect" color="#C9A84C" intensity={8} position={[-6, 5, 4]} scale={[6, 10, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" color="#ffffff" intensity={13} position={[6, 1, 3]} scale={[6, 10, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" color="#ffffff" intensity={3} position={[0, 6, -5]} scale={[8, 8, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" color="#C9A84C" intensity={4} position={[0, -5, 2]} scale={[10, 6, 1]} target={[0, 0, 0]} />
      </Environment>

      <pointLight position={[-6, 5, 4]} color="#C9A84C" intensity={90} />
      <pointLight position={[6, 1, 3]} color="#ffffff" intensity={100} />
      <pointLight position={[0, -5, 2]} color="#C9A84C" intensity={30} />

      <Suspense fallback={null}>
        <CarErrorBoundary>
          <CarModel />
        </CarErrorBoundary>
      </Suspense>
    </>
  );
}
