import SmoothScroll from "@/components/providers/SmoothScroll";
import Preloader from "@/components/ui/Preloader";
import CustomCursor from "@/components/ui/CustomCursor";
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

export default function Home() {
  return (
    <>
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
    </>
  );
}
