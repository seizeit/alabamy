"use client";

import { useEffect, useRef, useState } from "react";

export function SmartNav({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY;
      // Always show when near top
      if (currentY < 100) {
        setVisible(true);
      } else if (currentY < lastScrollY.current) {
        // Scrolling up
        setVisible(true);
      } else if (currentY > lastScrollY.current + 5) {
        // Scrolling down (with 5px threshold to avoid jitter)
        setVisible(false);
      }
      lastScrollY.current = currentY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 bg-gray-950 border-b border-white/10 shadow-lg transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {children}
    </nav>
  );
}
