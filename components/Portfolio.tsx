import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import Reveal from "./Reveal";

export default function Portfolio() {
  return (
    <section id="projects" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="section-label">PORTFOLIO</p>
          <h2 className="section-title">Case studies, tools, and demos</h2>
          <p className="section-subtitle">
            Early portfolio pieces that show the direction of Durst Solutions: modern websites,
            automation tools, and AI-powered business systems.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {projects.map((project, index) => (
            <Reveal key={project.title} delay={index * 0.06}>
              <article className="glass-card group h-full overflow-hidden p-7 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.075]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-200">
                      {project.category}
                    </span>
                    <span className="ml-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                      {project.status}
                    </span>
                  </div>

                  <div className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 transition group-hover:-translate-y-1 group-hover:translate-x-1">
                    <ArrowUpRight size={18} />
                  </div>
                </div>

                <h3 className="mt-6 text-2xl font-black">{project.title}</h3>
                <p className="mt-4 leading-7 text-slate-300">{project.description}</p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-bold text-white">Problem</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{project.problem}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Solution</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{project.solution}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.results.map((result) => (
                    <span key={result} className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                      {result}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}