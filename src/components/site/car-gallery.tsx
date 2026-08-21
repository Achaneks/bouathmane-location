"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function CarGallery({ images, name }: { images: string[]; name: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-background">
        {activeImage ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={activeImage}
                alt={name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-background px-6 text-center">
            <span className="font-heading text-3xl italic text-text-secondary sm:text-4xl">
              {name}
            </span>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1} of ${name}`}
              aria-current={index === activeIndex}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition-colors duration-200 sm:h-20 sm:w-28",
                index === activeIndex
                  ? "border-gold"
                  : "border-border opacity-70 hover:opacity-100",
              )}
            >
              <Image src={image} alt="" fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
