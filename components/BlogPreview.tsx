import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blog";
import Reveal from "./Reveal";

export default function BlogPreview() {
  return (
    <section id="blog" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="section-label">BLOG</p>
              <h2 className="section-title">Business technology insights</h2>
              <p className="section-subtitle">
                Educational content helps the website rank over time and shows business owners that
                you understand their problems.
              </p>
            </div>

            <Link href="/blog" className="secondary-button w-fit">
              View Blog <ArrowRight size={18} />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
            <Reveal key={post.title} delay={index * 0.08}>
              <article className="glass-card h-full p-7 transition hover:-translate-y-1 hover:bg-white/[0.075]">
                <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-200">
                  {post.category}
                </span>
                <h3 className="mt-6 text-2xl font-black">{post.title}</h3>
                <p className="mt-4 leading-7 text-slate-300">{post.excerpt}</p>
                <p className="mt-6 text-sm text-slate-500">{post.readTime}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}