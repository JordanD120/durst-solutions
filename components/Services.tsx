import { Bot, Check, Globe, Workflow } from "lucide-react";
import { services } from "@/data/services";
import Reveal from "./Reveal";

const icons = {
  globe: Globe,
  workflow: Workflow,
  bot: Bot,
};

export default function Services() {
  return (
    <section id="services" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="section-label">SERVICES</p>
          <h2 className="section-title">What Durst Solutions builds</h2>
          <p className="section-subtitle">
            Practical technology for businesses that need better websites, less busywork, and
            smarter systems.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = icons[service.icon as keyof typeof icons];

            return (
              <Reveal key={service.title} delay={index * 0.08}>
                <div className="glass-card group h-full p-8 transition duration-300 hover:-translate-y-2 hover:bg-white/[0.075]">
                  <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-blue-600/20 text-cyan-300 ring-1 ring-cyan-300/20 transition group-hover:scale-105">
                    <Icon />
                  </div>

                  <h3 className="text-2xl font-black">{service.title}</h3>
                  <p className="mt-4 leading-7 text-slate-300">{service.description}</p>

                  <ul className="mt-6 space-y-3">
                    {service.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-3 text-sm text-slate-300">
                        <Check size={16} className="text-cyan-300" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}