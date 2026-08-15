"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/utils";

export function ContactCta({ phone }: { phone: string }) {
  const message = "Hello, I'd like to know more about your car rental fleet.";
  const href = getWhatsAppLink(phone, message);

  return (
    <section id="contact" className="border-t border-border bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-heading text-4xl italic text-text-primary sm:text-5xl">
            Ready to hit the road in <span className="text-gold">style</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary">
            Our team is available around the clock. Send us a message on
            WhatsApp and we&apos;ll help you pick the perfect car, arrange
            delivery, and answer any questions.
          </p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full border border-gold px-8 text-sm font-medium uppercase tracking-[0.2em] text-gold transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.3)]"
          >
            <MessageCircle className="size-4" />
            Message Us
          </a>
        </motion.div>
      </div>
    </section>
  );
}
