"use client";

import { Component, Suspense, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { HeroCarScene } from "@/components/site/hero-scene";

function CanvasFallback() {
  return <div className="absolute inset-0" />;
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

/**
 * Car canvas — fills whatever container it's placed in (the hero's grid
 * cell: right column on desktop, bottom strip on mobile). Unlike the
 * starfield canvas, this is NOT position:fixed/absolute over the full
 * screen — its size comes entirely from its parent container via normal
 * layout, which is what keeps it from ever overlapping the hero text.
 */
export default function HeroCarCanvas({ active }: { active: boolean }) {
  return (
    <div className="relative h-full w-full">
      <CanvasErrorBoundary>
        <Suspense fallback={<CanvasFallback />}>
          <Canvas
            camera={{ position: [0, 0.6, 5.5], fov: 40 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 1.5]}
            frameloop={active ? "always" : "never"}
          >
            <HeroCarScene />
          </Canvas>
        </Suspense>
      </CanvasErrorBoundary>
    </div>
  );
}
