"use client";

import { useEffect, useState } from "react";
import {
  defaultSettings,
  getSettings,
  SETTINGS_CHANGED_EVENT,
  type SiteSettings,
} from "@/lib/settings";

export function useSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    setSettings(getSettings());

    function refresh() {
      setSettings(getSettings());
    }

    window.addEventListener("storage", refresh);
    window.addEventListener(SETTINGS_CHANGED_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(SETTINGS_CHANGED_EVENT, refresh);
    };
  }, []);

  return settings;
}
