"use client";

import { useEffect, useState } from "react";

/**
 * ProgressBar - Barra de progreso de scroll
 * 
 * Muestra en la parte inferior de la pantalla el % de scroll.
 * Color: primary (terracota)
 */
export function ProgressBar() {
  const [scrolled, setScrolled] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolledPercent = height > 0 ? (winScroll / height) * 100 : 0;
      setScrolled(scrolledPercent);
    };

    // Initial calculation
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 h-1 bg-primary transition-all duration-300 z-50"
      style={{ width: `${scrolled}%` }}
      role="progressbar"
      aria-valuenow={Math.round(scrolled)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progreso de lectura de la página"
    />
  );
}
