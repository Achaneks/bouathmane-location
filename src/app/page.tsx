import { CarGrid } from "@/components/site/car-grid";
import { ContactCta } from "@/components/site/contact-cta";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import { Navbar } from "@/components/site/navbar";

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
