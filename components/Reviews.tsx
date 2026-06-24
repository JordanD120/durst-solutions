"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { reviews } from "@/data/reviews";
import Reveal from "./Reveal";

export default function Reviews() {
  const approvedReviews = reviews.filter((review) => review.approved);
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="reviews" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="section-label">REVIEWS</p>
          <h2 className="section-title">Testimonials with approval control</h2>
          <p className="section-subtitle">
            The public site only displays approved reviews. This avoids spam, fake reviews, and
            unserious submissions.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {approvedReviews.map((review, index) => (
            <Reveal key={review.name} delay={index * 0.08}>
              <div className="glass-card h-full p-7">
                <div className="flex gap-1 text-yellow-300">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-5 text-lg leading-8 text-slate-200">“{review.quote}”</p>
                <div className="mt-6">
                  <p className="font-bold">{review.name}</p>
                  <p className="text-sm text-slate-400">{review.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <h3 className="text-2xl font-black">Review submission preview</h3>
                <p className="mt-3 leading-7 text-slate-300">
                  This form shows the future review flow. Later, submissions will go to a database,
                  wait for approval, and only approved reviews will show publicly.
                </p>
              </div>

              {submitted ? (
                <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-5 text-cyan-100">
                  Review received in demo mode. Backend approval system comes next.
                </div>
              ) : (
                <form
                  className="grid gap-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <input className="input" placeholder="Name" />
                  <input className="input" placeholder="Business / Role" />
                  <textarea className="input min-h-28" placeholder="Your review" />
                  <button className="primary-button w-full justify-center">Submit Review</button>
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}