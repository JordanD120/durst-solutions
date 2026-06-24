import { BarChart3, FileText, MessageSquare, WalletCards } from "lucide-react";
import Reveal from "./Reveal";

const portalItems = [
  {
    icon: BarChart3,
    title: "Project Progress",
    text: "Clients can see what stage their website, automation, or AI project is in.",
  },
  {
    icon: FileText,
    title: "Files & Deliverables",
    text: "Store proposals, project files, website copy, and final deliverables.",
  },
  {
    icon: MessageSquare,
    title: "Client Messages",
    text: "Keep project communication organized in one place.",
  },
  {
    icon: WalletCards,
    title: "Invoices & Payments",
    text: "Future portal feature for invoices, payment links, and service history.",
  },
];

export default function ClientPortalPreview() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="section-label">CLIENT PORTAL</p>
          <h1 className="section-title">Client portal prototype</h1>
          <p className="section-subtitle">
            This creates a professional SaaS-style direction for Durst Solutions. The real version
            will need login accounts, database storage, and permissions.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {portalItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal key={item.title} delay={index * 0.08}>
                <div className="glass-card p-7">
                  <Icon className="mb-5 text-cyan-300" />
                  <h2 className="text-2xl font-black">{item.title}</h2>
                  <p className="mt-3 leading-7 text-slate-300">{item.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}