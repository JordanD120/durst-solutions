"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

type Scores = {
  design: number;
  seo: number;
  mobile: number;
  automation: number;
};

export default function WebsiteAuditTool() {
  const [scores, setScores] = useState<Scores | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function submitAudit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        website: formData.get("website"),
        businessInterest: formData.get("businessInterest"),
      }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      alert(data.error || "Something went wrong.");
      return;
    }

    setScores(data.scores);
    setRecommendations(data.recommendations);
    form.reset();
  }

  return (
    <section id="audit" className="px-6 py-24">
      <div className="mx-auto grid max-w-7xl gap-10 rounded-[2rem] border border-white/10 bg-gradient-to-br from-blue-600/20 via-white/[0.04] to-cyan-400/10 p-8 md:p-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div>
            <p className="section-label">FREE WEBSITE AUDIT</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Get a quick website audit preview.
            </h2>
            <p className="mt-5 leading-8 text-slate-300">
              Enter your info and website. You’ll get a preview score, and the request will appear
              in the admin dashboard.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="glass-card p-6">
            <form onSubmit={submitAudit} className="grid gap-3">
              <input name="name" className="input" placeholder="Name" required />
              <input name="email" type="email" className="input" placeholder="Email" required />
              <input name="website" className="input" placeholder="www.mybusiness.com" required />
              <input
                name="businessInterest"
                className="input"
                placeholder="What do you want to improve?"
              />
              <button className="primary-button justify-center" disabled={loading}>
                {loading ? "Running Audit..." : "Run Free Audit"} <ArrowRight size={18} />
              </button>
            </form>

            {scores && (
              <div className="mt-7 space-y-4">
                {Object.entries(scores).map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-2 flex justify-between capitalize">
                      <p className="font-bold">{label}</p>
                      <p className="font-black">{value}/100</p>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-cyan-300"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-bold">Recommended improvements</p>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
                    {recommendations.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}