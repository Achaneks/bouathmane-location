import { cache } from "react";
import { db } from "@/lib/db";

/**
 * Deduped per-request: multiple Server Components can call this on the same
 * page render (e.g. CarGrid, ContactCta, Footer) without triggering
 * duplicate queries against the singleton row.
 */
export const getSettings = cache(() =>
  db.settings.findUnique({ where: { id: "singleton" } }),
);
