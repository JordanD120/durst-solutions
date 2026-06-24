import { GraduationCap, Lightbulb, MapPin, Rocket } from "lucide-react";
import Reveal from "./Reveal";

const points = [
  {
    icon: GraduationCap,
    title: "Engineering Background",
    text: "Built with an engineering mindset: practical systems, clear problem-solving, and attention to detail.",
  },
  {
    icon: Lightbulb,
    title: "AI + Automation Focus",
    text: "Focused on using AI and automation to solve real business problems, not just adding technology for show.",
  },
  {
    icon: MapPin,
    title: "Local Business Friendly",
    text: "Designed for small and local businesses that need clear communication and practical solutions.",
  },
  {
    icon: Rocket,
    title: "Built to Grow",
    text: "Websites and tools are created with future upgrades in mind: SEO, analytics, lead capture, and automation.",
  },
];

export default function About() {
  return (
    <section id="about" className="px-6 py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div>
            <p className="section-label">ABOUT</p>
            <h2 className="section-title">Built by someone who understands systems.</h2>
            <p className="mt-6 leading-8 text-slate-300">
              Durst Solutions was created to help businesses use modern technology without making
              the process confusing. The goal is simple: better websites, smarter workflows, and
              practical AI tools that make businesses look sharper and operate more efficiently.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2">
          {points.map((point, index) => {
            const Icon = point.icon;

            return (
              <Reveal key={point.title} delay={index * 0.08}>
                <div className="glass-card h-full p-6">
                  <Icon className="mb-4 text-cyan-300" />
                  <h3 className="text-xl font-black">{point.title}</h3>
                  <p className="mt-3 leading-7 text-slate-300">{point.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}