import { faqs } from "@/config/site";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Preloader from "@/components/ui/Preloader";
import CustomCursor from "@/components/ui/CustomCursor";
import WhatsAppWidget from "@/components/ui/WhatsAppWidget";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import About from "@/components/sections/About";
import Reviews from "@/components/sections/Reviews";
import Services from "@/components/sections/Services";
import ServiceDetails from "@/components/sections/ServiceDetails";
import Projects from "@/components/sections/Projects";
import Testimonials from "@/components/sections/Testimonials";
import Process from "@/components/sections/Process";
import ValueProps from "@/components/sections/ValueProps";
import WhyUs from "@/components/sections/WhyUs";
import Results from "@/components/sections/Results";
import LeadMagnet from "@/components/sections/LeadMagnet";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";

/** FAQPage schema belongs to the page whose FAQs these are, not to
 *  every page in the site. */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SmoothScroll />
      <Preloader />
      <CustomCursor />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <About />
        <Reviews />
        <Services />
        <ServiceDetails />
        <Projects />
        <Testimonials />
        <Process />
        <ValueProps />
        <WhyUs />
        <Results />
        <LeadMagnet />
        <FAQ />
      </main>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}
