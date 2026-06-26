"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import Reveal from "./Reveal";

type Review = {
  id: string;
  name: string;
  role: string | null;
  rating: number;
  quote: string;
};

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadReviews() {
      const response = await fetch("/api/public-reviews");
      const data = await response.json();

      if (response.ok) {
        setReviews(data.reviews);
      }
    }

    loadReviews();
  }, []);

  async function submitReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        role: formData.get("role"),
        email: formData.get("email"),
        rating: formData.get("rating"),
        quote: formData.get("quote"),
      }),
    });

    if (response.ok) {
      setSubmitted(true);
      form.reset();
    } else {
      alert("Something went wrong.");
    }
  }

  return (
    <section id="reviews" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="section-label">REVIEWS</p>
          <h2 className="section-title">Testimonials with approval control</h2>
          <p className="section-subtitle">
            Reviews are submitted privately and only appear publicly after approval.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {reviews.length === 0 ? (
            <div className="glass-card p-7 text-slate-300">
              Approved reviews will appear here.
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="glass-card h-full p-7">
                <div className="flex gap-1 text-yellow-300">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-5 text-lg leading-8 text-slate-200">“{review.quote}”</p>
                <p className="mt-6 font-bold">{review.name}</p>
                <p className="text-sm text-slate-400">{review.role}</p>
              </div>
            ))
          )}

          <form onSubmit={submitReview} className="glass-card grid gap-3 p-7">
            <h3 className="text-2xl font-black">Submit a review</h3>
            {submitted && (
              <p className="rounded-2xl bg-cyan-300/10 p-3 text-sm text-cyan-100">
                Review submitted. It will appear after approval.
              </p>
            )}
            <input name="name" className="input" placeholder="Name" required />
            <input name="role" className="input" placeholder="Business / Role" />
            <input name="email" type="email" className="input" placeholder="Email" />
            <select name="rating" className="input" defaultValue="5">
              <option value="5">5 stars</option>
              <option value="4">4 stars</option>
              <option value="3">3 stars</option>
              <option value="2">2 stars</option>
              <option value="1">1 star</option>
            </select>
            <textarea name="quote" className="input min-h-28" placeholder="Your review" required />
            <button className="primary-button justify-center">Submit Review</button>
          </form>
        </div>
      </div>
    </section>
  );
}