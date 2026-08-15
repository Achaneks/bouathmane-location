import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TiktokIcon,
  TwitterIcon,
  YoutubeIcon,
} from "@/components/icons/social-icons";
import { Logo } from "@/components/site/logo";
import { db } from "@/lib/db";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { normalizeSocialUrls, SOCIAL_KEYS, type SocialKey } from "@/lib/social-links";

const SOCIAL_ICON_RULES: {
  test: (url: string) => boolean;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { test: (url) => url.includes("instagram.com"), icon: InstagramIcon },
  { test: (url) => url.includes("youtube.com"), icon: YoutubeIcon },
  { test: (url) => url.includes("twitter.com") || url.includes("x.com"), icon: TwitterIcon },
  { test: (url) => url.includes("facebook.com"), icon: FacebookIcon },
  { test: (url) => url.includes("linkedin.com"), icon: LinkedinIcon },
  { test: (url) => url.includes("tiktok.com"), icon: TiktokIcon },
];

function getSocialIcon(url: string) {
  return SOCIAL_ICON_RULES.find(({ test }) => test(url))?.icon ?? null;
}

export async function Footer() {
  const settings = await db.settings.findUnique({ where: { id: "singleton" } });
  const socialUrls = normalizeSocialUrls(settings?.socialUrls);
  const phone = settings?.phone ?? "";
  const email = settings?.email ?? "";
  const tagline = settings?.tagline ?? "";
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 text-center sm:grid-cols-3 sm:text-left">
          <div className="flex flex-col items-center gap-4 sm:items-start">
            <Link href="#hero" aria-label={SITE_NAME}>
              <Logo />
            </Link>
            <p className="font-heading text-lg italic text-gold">{tagline}</p>
            <p className="line-clamp-2 max-w-xs text-sm text-text-secondary">
              {SITE_DESCRIPTION}
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 sm:items-start">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              Contact Us
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-gold"
              >
                <Phone className="size-4 text-gold" />
                {phone}
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-gold"
              >
                <Mail className="size-4 text-gold" />
                {email}
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 sm:items-start">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              Follow Us
            </h3>
            <div className="flex items-center gap-3">
              {SOCIAL_KEYS.map((key: SocialKey) => {
                const url = socialUrls[key];
                if (!url) return null;

                const Icon = getSocialIcon(url);
                if (!Icon) return null;

                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="flex size-9 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-gold/30 hover:text-gold"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-text-muted sm:flex-row">
          <p>
            &copy; {year} {SITE_NAME} — Morocco
          </p>
          <p>Made with ❤️ in Morocco</p>
        </div>
      </div>
    </footer>
  );
}
