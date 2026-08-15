export const SOCIAL_KEYS = [
  "instagram",
  "tiktok",
  "facebook",
  "youtube",
  "twitter",
  "linkedin",
] as const;

export type SocialKey = (typeof SOCIAL_KEYS)[number];

export type SocialUrls = Record<SocialKey, string>;

export const EMPTY_SOCIAL_URLS: SocialUrls = {
  instagram: "",
  tiktok: "",
  facebook: "",
  youtube: "",
  twitter: "",
  linkedin: "",
};

/** Safely coerces the untyped Prisma `Json` column into a known, fully-populated shape. */
export function normalizeSocialUrls(raw: unknown): SocialUrls {
  const value =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};

  return SOCIAL_KEYS.reduce((acc, key) => {
    acc[key] = typeof value[key] === "string" ? (value[key] as string) : "";
    return acc;
  }, {} as SocialUrls);
}
