import { CheckCircle2, Eye, Shield, Star } from "lucide-react";
import Reveal from "./Reveal";

const adminItems = [
  {
    icon: Star,
    title: "Review Approval",
    text: "Approve or reject reviews before they appear publicly.",
  },
  {
    icon: Eye,
    title: "Lead Tracking",
    text: "View website audit requests and contact form submissions.",
  },
  {
    icon: CheckCircle2,
    title: "Project Updates",
    text: "Add project case studies without editing the main homepage code.",
  },
  {
    icon: Shield,
    title: "Protected Access",
    text: "This will need authentication before being used for real clients.",
  },
];

export default function AdminPreview() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="section-label">ADMIN DASHBOARD</p>
          <h1 className="section-title">Admin dashboard prototype</h1>
          <p className="section-subtitle">
            This is the frontend concept. Real admin features need authentication, a database, and
            protected routes before going live.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {adminItems.map((item, index) => {
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