import { SettingsForm } from "@/components/admin/settings-form";

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-2xl italic text-text-primary">Settings</h2>
        <p className="text-sm text-text-secondary">
          Manage the contact details and social links shown in the site footer.
        </p>
      </div>
      <SettingsForm />
    </div>
  );
}
