import { SettingsForm } from "@/components/admin/settings-form";
import { db } from "@/lib/db";
import { normalizeSocialUrls } from "@/lib/social-links";

// Always reflects live settings — must never be frozen as a build-time
// static snapshot (and static generation would fail anyway: there's no
// reachable database during a Docker image build).
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await db.settings.findUnique({ where: { id: "singleton" } });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-2xl italic text-text-primary">Settings</h2>
        <p className="text-sm text-text-secondary">
          Manage the contact details and social links shown in the site footer.
        </p>
      </div>
      <SettingsForm
        settings={{
          phone: settings?.phone ?? "",
          email: settings?.email ?? "",
          tagline: settings?.tagline ?? "",
          socialUrls: normalizeSocialUrls(settings?.socialUrls),
        }}
      />
    </div>
  );
}
