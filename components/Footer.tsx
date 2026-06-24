import Link from "next/link";
import { Sparkles } from "lucide-react";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-10">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3 font-black">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600">
              <Sparkles size={18} />
            </span>
            {site.name}
          </div>
          <p className="mt-4 max-w-md leading-7 text-slate-400">{site.description}</p>
        </div>

        <div>
          <p className="font-bold">Site</p>
          <div className="mt-4 grid gap-3 text-sm text-slate-400">
            <Link href="/#services" className="hover:text-white">Services</Link>
            <Link href="/#projects" className="hover:text-white">Projects</Link>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <Link href="/about" className="hover:text-white">About</Link>
          </div>
        </div>

        <div>
          <p className="font-bold">Contact</p>
          <div className="mt-4 grid gap-3 text-sm text-slate-400">
            <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
            <a href={`tel:${site.phone}`} className="hover:text-white">{site.phone}</a>
            <Link href="/#contact" className="hover:text-white">Free Website Audit</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-sm text-slate-500">
        © 2026 Durst Solutions. Modern Websites • Automation • AI Solutions.
      </div>
    </footer>
  );
}