const particles = Array.from({ length: 90 }, (_, index) => ({
  id: index,
  left: (index * 37) % 100,
  top: (index * 61) % 100,
  delay: (index % 10) * 0.4,
  duration: 8 + (index % 7),
  size: 2 + (index % 3),
}));

export default function Particles() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="particle absolute rounded-full bg-cyan-300/40"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: particle.size,
            height: particle.size,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
}