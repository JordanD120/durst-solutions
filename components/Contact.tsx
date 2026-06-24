import { Mail, Phone, Send } from "lucide-react";
import { site } from "@/lib/site";
import Reveal from "./Reveal";

export default function Contact() {
  return (
    <section id="contact" className="px-6 py-24">
      <Reveal>
        <div className="mx-auto grid max-w-7xl gap-10 rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/20 md:p-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="section-label">CONTACT</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Ready to modernize your business?
            </h2>
            <p className="mt-5 leading-8 text-slate-300">
              Request a free website audit, ask about automation, or describe an AI tool you want
              built for your business.
            </p>

            <div className="mt-8 space-y-4 text-slate-300">
              <a href={`tel:${site.phone}`} className="flex items-center gap-3 transition hover:text-white">
                <Phone size={18} className="text-cyan-300" />
                {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 transition hover:text-white">
                <Mail size={18} className="text-cyan-300" />
                {site.email}
              </a>
            </div>
          </div>

          <form
            action={`mailto:${site.email}`}
            method="post"
            encType="text/plain"
            className="grid gap-4"
          >
            <input name="name" className="input" placeholder="Name" required />
            <input name="email" type="email" className="input" placeholder="Email" required />
            <input name="businessWebsite" className="input" placeholder="Business website" />
            <select name="service" className="input">
              <option>Website redesign</option>
              <option>Automation</option>
              <option>AI chatbot</option>
              <option>Website audit</option>
              <option>Not sure yet</option>
            </select>
            <textarea
              name="message"
              className="input min-h-32"
              placeholder="What do you need help with?"
              required
            />
            <button className="primary-button justify-center">
              Send Request <Send size={18} />
            </button>
          </form>
        </div>
      </Reveal>
    </section>
  );
}