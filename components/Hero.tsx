import Link from "next/link";
import { ArrowRight, Code2, Cpu, Sparkles, Zap } from "lucide-react";
import Particles from "./Particles";
import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-36 md:pt-44">
      <Particles />

      <div className="absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/25 blur-3xl" />
      <div className="absolute right-0 top-64 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur">
              <Zap size={16} className="text-cyan-300" />
              Modern Websites • Automation • AI Solutions
            </div>

            <h1 className="max-w-5xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
              Make your business look as modern as the work you do.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              Durst Solutions helps local businesses upgrade their websites, automate repetitive
              work, and use AI to save time, capture leads, and look more professional online.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/#contact" className="primary-button">
                Get a Free Website Audit <ArrowRight size={18} />
              </Link>
              <Link href="/#projects" className="secondary-button">
                View Projects
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="glass-card relative overflow-hidden p-6">
            <div className="absolute right-6 top-6 h-24 w-24 rounded-full bg-cyan-300/20 blur-2xl" />

            <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5">
              <div className="mb-5 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
              </div>

              <div className="space-y-4 font-mono text-sm">
                <p className="text-slate-500">durst-solutions.tsx</p>
                <p>
                  <span className="text-purple-300">const</span>{" "}
                  <span className="text-cyan-300">businessGrowth</span>{" "}
                  <span className="text-slate-400">=</span>{" "}
                  <span className="text-green-300">true</span>
                </p>
                <p>
                  <span className="text-blue-300">build</span>
                  <span className="text-slate-300">(</span>
                  <span className="text-orange-300">"modern website"</span>
                  <span className="text-slate-300">)</span>
                </p>
                <p>
                  <span className="text-blue-300">automate</span>
                  <span className="text-slate-300">(</span>
                  <span className="text-orange-300">"repetitive work"</span>
                  <span className="text-slate-300">)</span>
                </p>
                <p>
                  <span className="text-blue-300">deployAI</span>
                  <span className="text-slate-300">(</span>
                  <span className="text-orange-300">"lead generation"</span>
                  <span className="text-slate-300">)</span>
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                { icon: Code2, label: "Websites" },
                { icon: Cpu, label: "Automation" },
                { icon: Sparkles, label: "AI Tools" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <Icon className="mb-3 text-cyan-300" size={20} />
                    <p className="text-sm font-semibold">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}