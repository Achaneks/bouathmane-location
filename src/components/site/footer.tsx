import Image from "next/image";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { FacebookIcon, InstagramIcon } from "@/components/icons/social-icons";
import { SITE_NAME, WHATSAPP_NUMBER } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-4 py-10 text-center sm:grid-cols-3 sm:px-6 sm:text-left lg:px-8">
        <Link
          href="#hero"
          className="flex justify-self-center sm:justify-self-start"
          aria-label={SITE_NAME}
        >
          <Image
            src="/bouathmane-navbar-dark.svg"
            alt={SITE_NAME}
            width={213}
            height={40}
            className="h-8 w-auto"
          />
        </Link>

        <p className="text-xs text-text-muted">
          &copy; {year} {SITE_NAME}. All rights reserved.
        </p>

        <div className="flex items-center justify-center gap-3 sm:justify-self-end">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="flex size-9 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-gold/30 hover:text-gold"
          >
            <WhatsAppIcon className="size-4" />
          </a>
          <a
            href="#"
            aria-label="Instagram"
            className="flex size-9 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-gold/30 hover:text-gold"
          >
            <InstagramIcon className="size-4" />
          </a>
          <a
            href="#"
            aria-label="Facebook"
            className="flex size-9 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-gold/30 hover:text-gold"
          >
            <FacebookIcon className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
