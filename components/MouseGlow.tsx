"use client";

import { useEffect, useState } from "react";

export default function MouseGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleMove(event: MouseEvent) {
      setPosition({ x: event.clientX, y: event.clientY });
      setVisible(true);
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl transition-opacity duration-300"
      style={{
        left: position.x - 144,
        top: position.y - 144,
        opacity: visible ? 1 : 0,
      }}
    />
  );
}