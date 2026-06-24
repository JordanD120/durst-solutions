import AnimatedCounter from "./AnimatedCounter";
import Reveal from "./Reveal";

const stats = [
  { value: 100, suffix: "%", label: "Custom-built site ownership" },
  { value: 24, suffix: "hr", label: "Typical first response goal" },
  { value: 3, suffix: "x", label: "Core service focus areas" },
  { value: 0, suffix: "$", label: "Vercel hosting cost to start" },
];

export default function Stats() {
  return (
    <section className="px-6 py-16">
      <Reveal>
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card p-6">
              <p className="text-4xl font-black text-white">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}