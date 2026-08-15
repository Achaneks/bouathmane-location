import { CarGrid } from "@/components/site/car-grid";
import { ContactCta } from "@/components/site/contact-cta";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import { Navbar } from "@/components/site/navbar";

// Renders live car inventory and settings (via CarGrid/Footer) — must never
// be frozen as a build-time static snapshot (and static generation would
// fail anyway: there's no reachable database during a Docker image build).
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <CarGrid />
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
