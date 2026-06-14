export interface SocialLinks {
  instagram: string;
  tiktok: string;
  facebook: string;
  youtube: string;
  twitter: string;
  linkedin: string;
}

export interface SiteSettings {
  phone: string;
  email: string;
  tagline: string;
  description: string;
  socials: SocialLinks;
}

export const defaultSettings: SiteSettings = {
  phone: "+212 600 000 000",
  email: "contact@bouathmaneloc.com",
  tagline: "Premium Car Rental in Morocco",
  description:
    "Drive in style with our curated fleet of premium and luxury vehicles, available across Morocco with instant WhatsApp booking.",
  socials: {
    instagram: "",
    tiktok: "",
    facebook: "",
    youtube: "",
    twitter: "",
    linkedin: "",
  },
};

const STORAGE_KEY = "bouathmane-settings";

/** Fired on the same tab whenever settings are saved, so live consumers (e.g. the footer) can refresh. */
export const SETTINGS_CHANGED_EVENT = "bouathmane-settings-changed";

export function getSettings(): SiteSettings {
  if (typeof window === "undefined") return defaultSettings;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;

    const parsed = JSON.parse(raw) as Partial<SiteSettings>;
    return {
      ...defaultSettings,
      ...parsed,
      socials: { ...defaultSettings.socials, ...parsed.socials },
    };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: SiteSettings): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event(SETTINGS_CHANGED_EVENT));
}
