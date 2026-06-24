"use client";

import { useState } from "react";
import { ArrowRight, Gauge, Search, ShieldCheck, Smartphone, WandSparkles } from "lucide-react";
import Reveal from "./Reveal";

function scoreFromUrl(url: string, offset: number) {
  const clean = url.trim().toLowerCase();
  const total = clean.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return 68 + ((total + offset) % 28);
}

export default function WebsiteAuditTool() {
  const [url, setUrl] = useState("");
  const [submittedUrl, setSubmittedUrl] = useState("");

  const scores = submittedUrl
    ? [
        { label: "Design", value: scoreFromUrl(submittedUrl, 3), icon: WandSparkles },
        { label: "Mobile", value: scoreFromUrl(submittedUrl, 9), icon: Smartphone },
        { label: "SEO Basics", value: scoreFromUrl(submittedUrl, 15), icon: Search },
        { label: "Trust", value: scoreFromUrl(submittedUrl, 21), icon: ShieldCheck },
      ]
    : [];

  return (
    <section id="audit" className="px-6 py-24">
      <div className="mx-auto grid max-w-7xl gap-10 rounded-[2rem] border border-white/10 bg-gradient-to-br from-blue-600/20 via-white/[0.04] to-cyan-400/10 p-8 md:p-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div>
            <p className="section-label">FREE WEBSITE AUDIT</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Turn your website into a better sales tool.
            </h2>
            <p className="mt-5 leading-8 text-slate-300">
              Enter a website to preview the audit experience. This is currently a frontend demo.
              The real version can connect to speed, SEO, accessibility, and AI analysis tools.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="glass-card p-6">
            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                if (url.trim()) setSubmittedUrl(url.trim());
              }}
            >
              <input
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="examplebusiness.com"
                className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-slate-950/80 px-4 text-white outline-none transition focus:border-cyan-300"
              />
              <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 font-bold transition hover:bg-blue-500">
                Run Demo Audit <ArrowRight size={18} />
              </button>
            </form>

            {submittedUrl ? (
              <div className="mt-7 space-y-4">
                <div className="flex items-center gap-3 text-slate-300">
                  <Gauge className="text-cyan-300" />
                  Demo results for <span className="font-bold text-white">{submittedUrl}</span>
                </div>

                {scores.map((score) => {
                  const Icon = score.icon;

                  return (
                    <div key={score.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="flex items-center gap-2 font-bold">
                          <Icon size={18} className="text-cyan-300" />
                          {score.label}
                        </p>
                        <p className="font-black">{score.value}/100</p>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-cyan-300 transition-all duration-700"
                          style={{ width: `${score.value}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
                The real version will generate a report covering mobile design, conversion issues,
                SEO basics, website speed, and automation opportunities.
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}