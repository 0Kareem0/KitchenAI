import React, { useEffect, useState } from "react";

export default function Confetti({ active }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (active) {
      const colors = ["#E05638", "#FF8A65", "#10B981", "#F59E0B", "#8B5CF6", "#3B82F6"];
      const newParticles = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, // percentage width
        y: -10,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        speedX: (Math.random() - 0.5) * 6,
        speedY: Math.random() * 8 + 4,
        opacity: 1
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!particles.length) return null;

  return (
    <div className="confetti-container" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, overflow: "hidden" }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size * 1.4}px`,
            backgroundColor: p.color,
            borderRadius: "2px",
            transform: `rotate(${p.rotation}deg)`,
            opacity: p.opacity,
            animation: `confettiFall 2.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`
          }}
        />
      ))}
    </div>
  );
}
