import AdminPreview from "@/components/AdminPreview";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";

export default function AdminPage() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <div className="pt-24">
          <AdminPreview />
        </div>
        <Footer />
      </main>
    </PageTransition>
  );
}