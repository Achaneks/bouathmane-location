"use client";

import { Component, Suspense, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, type MotionValue } from "framer-motion";
import { HeroScene } from "@/components/site/hero-scene";

function CanvasFallback() {
  return <div className="absolute inset-0 bg-[#0A0A0B]" />;
}

class CanvasErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return <CanvasFallback />;
    return this.props.children;
  }
}

export default function HeroCanvas({
  y,
  active,
}: {
  y: MotionValue<number>;
  active: boolean;
}) {
  return (
    <motion.div style={{ y }} className="pointer-events-none fixed inset-0 -z-10">
      <CanvasErrorBoundary>
        <Suspense fallback={<CanvasFallback />}>
          <Canvas
            camera={{ position: [0, 0.8, 6], fov: 42 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 1.5]}
            frameloop={active ? "always" : "never"}
          >
            <HeroScene />
          </Canvas>
        </Suspense>
      </CanvasErrorBoundary>
    </motion.div>
  );
}
