"use client";

import { useState } from "react";
import Reveal from "./Reveal";

type AdminData = {
  leads: any[];
  audits: any[];
  reviews: any[];
};

export default function AdminPreview() {
  const [password, setPassword] = useState("");
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadAdminData() {
    setLoading(true);

    const response = await fetch("/api/admin", {
      headers: {
        "x-admin-password": password,
      },
    });

    const json = await response.json();
    setLoading(false);

    if (!response.ok) {
      alert(json.error || "Unauthorized");
      return;
    }

    setData(json);
  }

  async function updateItem(type: string, id: string, action: string) {
    const response = await fetch("/api/admin", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ type, id, action }),
    });

    if (!response.ok) {
      alert("Update failed.");
      return;
    }

    await loadAdminData();
  }

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="section-label">ADMIN</p>
          <h1 className="section-title">Durst Solutions admin dashboard</h1>
          <p className="section-subtitle">
            Manage leads, audit requests, and review approvals.
          </p>
        </Reveal>

        <div className="mt-10 glass-card grid gap-3 p-6 md:grid-cols-[1fr_auto]">
          <input
            type="password"
            className="input"
            placeholder="Admin password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button onClick={loadAdminData} className="primary-button justify-center">
            {loading ? "Loading..." : "Load Admin Data"}
          </button>
        </div>

        {data && (
          <div className="mt-10 grid gap-8">
            <AdminSection title="Leads">
              {data.leads.map((lead) => (
                <AdminCard key={lead.id}>
                  <p className="font-black">{lead.name}</p>
                  <p className="text-slate-300">{lead.email}</p>
                  <p className="text-slate-400">{lead.business_website}</p>
                  <p className="mt-3">{lead.message}</p>
                  <p className="mt-2 text-sm text-cyan-300">Status: {lead.status}</p>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => updateItem("lead", lead.id, "contacted")} className="secondary-button">
                      Mark Contacted
                    </button>
                    <button onClick={() => updateItem("lead", lead.id, "closed")} className="secondary-button">
                      Close
                    </button>
                  </div>
                </AdminCard>
              ))}
            </AdminSection>

            <AdminSection title="Audit Requests">
              {data.audits.map((audit) => (
                <AdminCard key={audit.id}>
                  <p className="font-black">{audit.name}</p>
                  <p className="text-slate-300">{audit.email}</p>
                  <p className="text-slate-400">{audit.website}</p>
                  <p className="mt-2 text-sm">
                    Design {audit.design_score} | SEO {audit.seo_score} | Mobile {audit.mobile_score} | Automation {audit.automation_score}
                  </p>
                  <p className="mt-2 text-sm text-cyan-300">Status: {audit.status}</p>
                  <button onClick={() => updateItem("audit", audit.id, "reviewed")} className="secondary-button mt-4">
                    Mark Reviewed
                  </button>
                </AdminCard>
              ))}
            </AdminSection>

            <AdminSection title="Reviews">
              {data.reviews.map((review) => (
                <AdminCard key={review.id}>
                  <p className="font-black">{review.name}</p>
                  <p className="text-slate-400">{review.role}</p>
                  <p className="mt-3">“{review.quote}”</p>
                  <p className="mt-2 text-sm text-cyan-300">
                    Approved: {String(review.approved)}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => updateItem("review", review.id, "approve")} className="primary-button">
                      Approve
                    </button>
                    <button onClick={() => updateItem("review", review.id, "reject")} className="secondary-button">
                      Reject
                    </button>
                  </div>
                </AdminCard>
              ))}
            </AdminSection>
          </div>
        )}
      </div>
    </section>
  );
}

function AdminSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-black">{title}</h2>
      <div className="grid gap-4 lg:grid-cols-2">{children}</div>
    </div>
  );
}

function AdminCard({ children }: { children: React.ReactNode }) {
  return <div className="glass-card p-5">{children}</div>;
}