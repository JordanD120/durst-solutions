import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";

export default function AboutPage() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <div className="pt-24">
          <About />
          <Contact />
        </div>
        <Footer />
      </main>
    </PageTransition>
  );
}