"use client";

import { Component, Suspense, useEffect, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, type MotionValue } from "framer-motion";
import { HeroScene, type ResponsiveTier } from "@/components/site/hero-scene";

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

function useResponsiveTier(): ResponsiveTier {
  const [tier, setTier] = useState<ResponsiveTier>("desktop");

  useEffect(() => {
    function update() {
      const width = window.innerWidth;
      if (width < MOBILE_BREAKPOINT) setTier("mobile");
      else if (width < TABLET_BREAKPOINT) setTier("tablet");
      else setTier("desktop");
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return tier;
}

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
  const tier = useResponsiveTier();

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
            <HeroScene tier={tier} />
          </Canvas>
        </Suspense>
      </CanvasErrorBoundary>
    </motion.div>
  );
}
