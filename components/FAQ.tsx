import Reveal from "./Reveal";

const faqs = [
  {
    q: "Do you work with small local businesses?",
    a: "Yes. Durst Solutions is focused on helping local businesses improve websites, automate repetitive work, and use AI in practical ways.",
  },
  {
    q: "Can you update an existing website?",
    a: "Yes. Existing websites can be redesigned, reorganized, made mobile-friendly, improved for SEO, and connected to better contact systems.",
  },
  {
    q: "What can you automate?",
    a: "Common examples include lead tracking, spreadsheet cleanup, email follow-ups, form submissions, reports, and customer intake workflows.",
  },
  {
    q: "Can I approve reviews before they show?",
    a: "Yes. The planned review system is approval-based, meaning reviews are submitted privately and only approved testimonials appear publicly.",
  },
  {
    q: "Is the AI chatbot real yet?",
    a: "The current chatbot is a frontend demo. The real version can be connected to OpenAI and trained on Durst Solutions services.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="section-label">FAQ</p>
          <h2 className="section-title">Questions businesses ask</h2>
        </Reveal>

        <div className="mt-10 grid gap-4">
          {faqs.map((faq, index) => (
            <Reveal key={faq.q} delay={index * 0.05}>
              <div className="glass-card p-6">
                <h3 className="text-lg font-black">{faq.q}</h3>
                <p className="mt-3 leading-7 text-slate-300">{faq.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}