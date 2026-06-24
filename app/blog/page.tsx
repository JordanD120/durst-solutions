import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import Reveal from "@/components/Reveal";
import { blogPosts } from "@/data/blog";

export default function BlogPage() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-slate-950 text-white">
        <Navbar />

        <section className="px-6 pb-24 pt-36">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="section-label">BLOG</p>
              <h1 className="section-title">Business technology insights</h1>
              <p className="section-subtitle">
                Articles for local businesses about websites, automation, and practical AI.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {blogPosts.map((post, index) => (
                <Reveal key={post.title} delay={index * 0.08}>
                  <article className="glass-card h-full p-7">
                    <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-200">
                      {post.category}
                    </span>
                    <h2 className="mt-6 text-2xl font-black">{post.title}</h2>
                    <p className="mt-4 leading-7 text-slate-300">{post.excerpt}</p>
                    <p className="mt-6 text-sm text-slate-500">{post.readTime}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </PageTransition>
  );
}