"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

const HeroCanvas = dynamic(() => import("@/components/site/hero-canvas"), {
  ssr: false,
  loading: () => (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-[#0A0A0B]" />
  ),
});

const HeroCarCanvas = dynamic(() => import("@/components/site/hero-car-canvas"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#0A0A0B]/40" />,
});

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function Hero() {
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, (value) => value * -0.2);
  const canvasY = useTransform(scrollY, (value) => value * -0.2);
  const [canvasActive, setCanvasActive] = useState(true);

  useEffect(() => {
    const onScroll = () => setCanvasActive(window.scrollY < window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <HeroCanvas y={canvasY} active={canvasActive} />

      <section
        id="hero"
        className="relative grid h-[100svh] min-h-[640px] w-full grid-rows-[45%_55%] md:grid-cols-2 md:grid-rows-1"
      >
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-background" />

        <motion.div
          style={{ y: textY }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col items-start justify-center px-4 pt-[20vh] text-left sm:px-6 md:pt-0 md:pl-60 lg:pl-32"
        >
          <motion.span
            variants={itemVariants}
            className="mb-6 text-xs font-medium uppercase tracking-[0.4em] text-gold"
          >
            Morocco &bull; Luxury Rentals
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="font-heading text-5xl italic leading-[1.05] text-text-primary sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Bouathmane Location
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-xl text-base text-text-secondary sm:text-lg"
          >
            Premium cars. Instant WhatsApp booking.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-10">
            <a
              href="#fleet"
              className="inline-flex h-12 items-center justify-center rounded-full border border-gold px-8 text-sm font-medium uppercase tracking-[0.2em] text-gold transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.3)]"
            >
              Explore the Fleet
            </a>
          </motion.div>
        </motion.div>

        <div className="relative z-10 h-full w-full">
          <HeroCarCanvas active={canvasActive} />
        </div>

        <motion.a
          href="#fleet"
          aria-label="Scroll to fleet"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-text-secondary transition-colors hover:text-gold"
        >
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="block"
          >
            <ChevronDown className="size-6" />
          </motion.span>
        </motion.a>
      </section>
    </>
  );
}
