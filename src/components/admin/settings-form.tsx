"use client";

import { useEffect, useState, type ComponentType } from "react";
import { Mail, Phone } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TiktokIcon,
  TwitterIcon,
  YoutubeIcon,
} from "@/components/icons/social-icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  defaultSettings,
  getSettings,
  saveSettings,
  type SiteSettings,
} from "@/lib/settings";

const SOCIAL_FIELDS: {
  key: keyof SiteSettings["socials"];
  label: string;
  placeholder: string;
  icon: ComponentType<{ className?: string }>;
}[] = [
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourpage", icon: InstagramIcon },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@yourpage", icon: TiktokIcon },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourpage", icon: FacebookIcon },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourchannel", icon: YoutubeIcon },
  { key: "twitter", label: "Twitter", placeholder: "https://twitter.com/yourhandle", icon: TwitterIcon },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/yourpage", icon: LinkedinIcon },
];

export function SettingsForm() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), 2500);
    return () => clearTimeout(timer);
  }, [showToast]);

  function updateField<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function updateSocial(key: keyof SiteSettings["socials"], value: string) {
    setSettings((prev) => ({
      ...prev,
      socials: { ...prev.socials, [key]: value },
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveSettings(settings);
    setShowToast(true);
  }

  const filledSocials = SOCIAL_FIELDS.filter(({ key }) => settings.socials[key].trim());

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="font-heading text-lg italic text-text-primary">
            Contact Information
          </CardTitle>
          <CardDescription>
            Shown in the &quot;Contact Us&quot; column of the site footer.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+212 6XX XXX XXX"
                value={settings.phone}
                onChange={(event) => updateField("phone", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="contact@example.com"
                value={settings.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Footer preview</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <span className="flex items-center gap-2 text-sm text-text-secondary">
                <Phone className="size-4 text-gold" />
                {settings.phone || "—"}
              </span>
              <span className="flex items-center gap-2 text-sm text-text-secondary">
                <Mail className="size-4 text-gold" />
                {settings.email || "—"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="font-heading text-lg italic text-text-primary">
            Social Media Accounts
          </CardTitle>
          <CardDescription>
            Add links to your social profiles. Empty fields are hidden from the footer.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {SOCIAL_FIELDS.map(({ key, label, placeholder, icon: Icon }) => (
              <div key={key} className="flex flex-col gap-2">
                <Label htmlFor={key}>{label}</Label>
                <div className="relative">
                  <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-secondary" />
                  <Input
                    id={key}
                    name={key}
                    placeholder={placeholder}
                    className="pl-9"
                    value={settings.socials[key]}
                    onChange={(event) => updateSocial(key, event.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Footer preview</p>
            {filledSocials.length > 0 ? (
              <div className="flex items-center gap-3">
                {filledSocials.map(({ key, icon: Icon }) => (
                  <span
                    key={key}
                    className="flex size-9 items-center justify-center rounded-full border border-border text-text-secondary"
                  >
                    <Icon className="size-4" />
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted">No social links added yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">Save Changes</Button>
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg border border-available/30 bg-available/15 px-4 py-3 text-sm font-medium text-available shadow-lg">
          Settings saved
        </div>
      )}
    </form>
  );
}
