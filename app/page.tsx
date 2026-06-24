import {
  ArrowRight,
  Bot,
  Code2,
  Globe,
  Mail,
  Phone,
  Sparkles,
  Star,
  Workflow,
  Zap,
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Modern Websites",
    desc: "Fast, clean, mobile-friendly websites that make businesses look professional and convert visitors into leads.",
  },
  {
    icon: Workflow,
    title: "Automation",
    desc: "Automate forms, emails, spreadsheets, reports, data collection, and repetitive business workflows.",
  },
  {
    icon: Bot,
    title: "AI Solutions",
    desc: "Custom AI chatbots, lead qualification tools, business assistants, and smart internal systems.",
  },
];

const projects = [
  {
    title: "Local Business Website Redesign",
    tag: "Website",
    desc: "Modernized an outdated business website with improved layout, stronger calls-to-action, and mobile-first design.",
  },
  {
    title: "Google Maps Lead Scraper",
    tag: "Automation",
    desc: "Built a tool to collect local business leads, emails, phone numbers, websites, and distance data.",
  },
  {
    title: "AI Website Audit System",
    tag: "AI Tool",
    desc: "A planned tool that analyzes a business website for design, speed, SEO, and automation opportunities.",
  },
];

const faqs = [
  {
    q: "Do you work with small local businesses?",
    a: "Yes. Durst Solutions is built specifically to help local businesses improve their websites, automate work, and use AI practically.",
  },
  {
    q: "Can you update an existing website?",
    a: "Yes. I can modernize existing websites, improve the layout, add contact forms, and make the site more professional.",
  },
  {
    q: "Do you offer free website audits?",
    a: "Yes. I can review your website and identify design, mobile, speed, SEO, and automation opportunities.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-bold tracking-tight">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600">
              <Sparkles size={18} />
            </div>
            Durst Solutions
          </div>

          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#services" className="hover:text-white">Services</a>
            <a href="#projects" className="hover:text-white">Projects</a>
            <a href="#reviews" className="hover:text-white">Reviews</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </div>

          <a
            href="#contact"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-blue-100"
          >
            Free Audit
          </a>
        </div>
      </nav>

      <section className="relative overflow-hidden px-6 pb-24 pt-36">
        <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="absolute right-10 top-56 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              <Zap size={16} className="text-cyan-300" />
              Websites • Automation • AI Solutions
            </div>

            <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">
              Build a business website that actually looks modern.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              I help local businesses upgrade their online presence, automate repetitive work,
              and use AI to save time and generate more leads.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-4 font-semibold transition hover:bg-blue-500"
              >
                Get a Free Website Audit <ArrowRight size={18} />
              </a>
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-7 py-4 font-semibold text-slate-200 transition hover:bg-white/10"
              >
                View Projects
              </a>
            </div>
          </div>

          <div className="mt-20 grid gap-4 md:grid-cols-4">
            {[
              ["Fast", "Modern performance"],
              ["Mobile", "Responsive layouts"],
              ["AI", "Smart workflows"],
              ["Local", "Built for businesses"],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
                <p className="text-2xl font-bold">{title}</p>
                <p className="mt-2 text-sm text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <p className="font-semibold text-cyan-300">SERVICES</p>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">What I build</h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="group rounded-3xl border border-white/10 bg-white/[0.04] p-8 transition hover:-translate-y-1 hover:bg-white/[0.07]"
                >
                  <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-blue-600/20 text-cyan-300">
                    <Icon />
                  </div>
                  <h3 className="text-2xl font-bold">{service.title}</h3>
                  <p className="mt-4 leading-7 text-slate-300">{service.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-10 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 to-cyan-400/10 p-8 md:grid-cols-2 md:p-12">
          <div>
            <p className="font-semibold text-cyan-300">FREE WEBSITE AUDIT</p>
            <h2 className="mt-3 text-4xl font-bold">Not sure what your website is missing?</h2>
          </div>
          <div className="text-slate-300">
            <p className="leading-8">
              I’ll review your current website for design, mobile responsiveness, speed,
              contact forms, SEO basics, and automation opportunities.
            </p>
            <a
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-950"
            >
              Request Audit <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <section id="projects" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <p className="font-semibold text-cyan-300">PROJECTS</p>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">Case studies & demos</h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {projects.map((project) => (
              <div key={project.title} className="rounded-3xl border border-white/10 bg-slate-900 p-7">
                <span className="rounded-full bg-blue-600/20 px-3 py-1 text-sm text-cyan-300">
                  {project.tag}
                </span>
                <h3 className="mt-6 text-2xl font-bold">{project.title}</h3>
                <p className="mt-4 leading-7 text-slate-300">{project.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-semibold text-cyan-300">REVIEWS</p>
          <h2 className="mt-3 text-4xl font-bold">Approved client testimonials</h2>

          <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <div className="flex justify-center gap-1 text-yellow-300">
              {[1, 2, 3, 4, 5].map((i) => <Star key={i} fill="currentColor" size={22} />)}
            </div>
            <p className="mt-6 text-xl leading-8 text-slate-200">
              “Jordan is building practical tools for businesses that want modern websites,
              automation, and AI without overcomplicating the process.”
            </p>
            <p className="mt-6 font-semibold">Durst Solutions Demo Review</p>
            <p className="text-sm text-slate-400">Replace with real client reviews later</p>
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <p className="font-semibold text-cyan-300">FAQ</p>
          <h2 className="mt-3 text-4xl font-bold">Questions businesses ask</h2>

          <div className="mt-10 grid gap-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <h3 className="font-bold">{faq.q}</h3>
                <p className="mt-3 text-slate-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-10 rounded-3xl border border-white/10 bg-slate-900 p-8 md:grid-cols-2 md:p-12">
          <div>
            <p className="font-semibold text-cyan-300">CONTACT</p>
            <h2 className="mt-3 text-4xl font-bold">Ready to modernize your business?</h2>
            <p className="mt-5 leading-8 text-slate-300">
              Reach out for a free website audit, automation idea, or AI solution.
            </p>

            <div className="mt-8 space-y-4 text-slate-300">
              <p className="flex items-center gap-3">
                <Phone size={18} /> (972) 697-3090
              </p>
              <p className="flex items-center gap-3">
                <Mail size={18} /> contact@jordandurst.com
              </p>
            </div>
          </div>

          <form className="space-y-4">
            <input className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500" placeholder="Name" />
            <input className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500" placeholder="Email" />
            <input className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500" placeholder="Business Website" />
            <textarea className="min-h-32 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500" placeholder="What do you need help with?" />
            <button className="w-full rounded-xl bg-blue-600 px-6 py-4 font-semibold transition hover:bg-blue-500">
              Submit Request
            </button>
            <p className="text-xs text-slate-500">
              This form is visual for now. We’ll connect it to email next.
            </p>
          </form>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-500">
        © 2026 Durst Solutions. Modern Websites • Automation • AI Solutions.
      </footer>
    </main>
  );
}