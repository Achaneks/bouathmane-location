"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#fleet", label: "Our Fleet" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-border bg-background/85 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <nav
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-4 transition-[height] duration-300 sm:px-6 lg:px-8",
          scrolled ? "h-16" : "h-20",
        )}
      >
        <Link href="#hero" className="flex shrink-0 items-center" aria-label={SITE_NAME}>
          <Image
            src="/bouathmane-navbar-dark.svg"
            alt={SITE_NAME}
            width={213}
            height={40}
            priority
            className={cn(
              "w-auto transition-[height] duration-300",
              scrolled ? "h-10 sm:h-12" : "h-16 sm:h-24",
            )}
          />
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary transition-colors hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <a
            href="#fleet"
            className="inline-flex h-9 items-center justify-center rounded-full border border-gold px-6 text-xs font-medium uppercase tracking-[0.2em] text-gold transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.3)]"
          >
            Book Now
          </a>
        </div>

        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="text-text-primary hover:bg-surface-elevated md:hidden"
              >
                <Menu className="size-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            }
          />
          <SheetContent side="right">
            <SheetTitle className="px-6 pt-6">
              <Image
                src="/bouathmane-navbar-dark.svg"
                alt={SITE_NAME}
                width={213}
                height={40}
                className="h-14 w-auto"
              />
            </SheetTitle>
            <div className="mt-6 flex flex-col gap-1 px-6">
              {NAV_LINKS.map((link) => (
                <SheetClose
                  key={link.href}
                  render={
                    <a
                      href={link.href}
                      className="rounded-md px-3 py-3 text-base text-text-secondary transition-colors hover:bg-surface hover:text-gold"
                    >
                      {link.label}
                    </a>
                  }
                />
              ))}
              <SheetClose
                render={
                  <a
                    href="#fleet"
                    className="mt-4 inline-flex h-11 items-center justify-center rounded-full border border-gold text-sm font-medium uppercase tracking-[0.2em] text-gold"
                  >
                    Book Now
                  </a>
                }
              />
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
