import About from "@/components/About";
import AIChatbot from "@/components/AIChatbot";
import BlogPreview from "@/components/BlogPreview";
import Contact from "@/components/Contact";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import MouseGlow from "@/components/MouseGlow";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import Portfolio from "@/components/Portfolio";
import Reviews from "@/components/Reviews";
import Services from "@/components/Services";
import Stats from "@/components/Stats";
import WebsiteAuditTool from "@/components/WebsiteAuditTool";

export default function Home() {
  return (
    <PageTransition>
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        <MouseGlow />
        <div className="relative z-10">
          <Navbar />
          <Hero />
          <Stats />
          <Services />
          <WebsiteAuditTool />
          <Portfolio />
          <About />
          <Reviews />
          <BlogPreview />
          <FAQ />
          <Contact />
          <Footer />
          <AIChatbot />
        </div>
      </main>
    </PageTransition>
  );
}