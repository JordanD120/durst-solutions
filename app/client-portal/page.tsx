import ClientPortalPreview from "@/components/ClientPortalPreview";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";

export default function ClientPortalPage() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <div className="pt-24">
          <ClientPortalPreview />
        </div>
        <Footer />
      </main>
    </PageTransition>
  );
}