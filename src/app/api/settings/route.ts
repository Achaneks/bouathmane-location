import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { SOCIAL_KEYS } from "@/lib/social-links";

export async function GET() {
  const settings = await db.settings.findUnique({ where: { id: "singleton" } });
  return NextResponse.json(settings);
}

interface SettingsPayload {
  phone: string;
  email: string;
  tagline: string;
  socialUrls: Record<string, string>;
}

function isValidPayload(body: unknown): body is SettingsPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;

  if (
    typeof b.phone !== "string" ||
    typeof b.email !== "string" ||
    typeof b.tagline !== "string" ||
    !b.phone.trim() ||
    !b.email.trim() ||
    !b.tagline.trim()
  ) {
    return false;
  }

  if (!b.socialUrls || typeof b.socialUrls !== "object" || Array.isArray(b.socialUrls)) {
    return false;
  }

  const socialUrls = b.socialUrls as Record<string, unknown>;
  return SOCIAL_KEYS.every((key) => socialUrls[key] === undefined || typeof socialUrls[key] === "string");
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!isValidPayload(body)) {
    return NextResponse.json({ error: "Invalid settings payload" }, { status: 400 });
  }

  const settings = await db.settings.update({
    where: { id: "singleton" },
    data: {
      phone: body.phone.trim(),
      email: body.email.trim(),
      tagline: body.tagline.trim(),
      socialUrls: body.socialUrls,
    },
  });

  return NextResponse.json(settings);
}
