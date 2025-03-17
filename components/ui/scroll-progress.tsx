"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ScrollProgress() {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!progressBarRef.current || !progressTextRef.current || !dotsRef.current)
      return;

    // Force a small delay to ensure DOM is fully rendered
    const initTimeout = setTimeout(() => {
      // Create scroll progress animation for the bar
      gsap.to(progressBarRef.current, {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });

      // Update progress percentage text
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
        onUpdate: (self) => {
          if (progressTextRef.current) {
            const progress = Math.round(self.progress * 100);
            progressTextRef.current.innerText = `${progress}%`;
          }
        },
      });

      // Create dots for each section
      const sections = document.querySelectorAll(".scroll-section");
      const dotsContainer = dotsRef.current;

      // We've already checked dotsRef.current is not null above
      // Clear existing dots first
      if (dotsContainer) {
        dotsContainer.innerHTML = "";

        // Simplified dot creation
        dotsContainer.innerHTML = Array.from(sections)
          .map(
            () =>
              `<div class="h-4 w-4 rounded-full bg-gray-300 transition-all duration-300"></div>`
          )
          .join("");

        // Update active dot based on scroll position
        const dots = dotsContainer.querySelectorAll("div");

        sections.forEach((section, index) => {
          ScrollTrigger.create({
            trigger: section,
            start: "top center",
            end: "bottom center",
            onEnter: () => {
              dots.forEach((d, i) => {
                if (i === index) {
                  d.classList.remove("bg-gray-300");
                  d.classList.add("bg-blue-500", "scale-150");
                } else {
                  d.classList.remove("bg-blue-500", "scale-150");
                  d.classList.add("bg-gray-300");
                }
              });
            },
            onEnterBack: () => {
              dots.forEach((d, i) => {
                if (i === index) {
                  d.classList.remove("bg-gray-300");
                  d.classList.add("bg-blue-500", "scale-150");
                } else {
                  d.classList.remove("bg-blue-500", "scale-150");
                  d.classList.add("bg-gray-300");
                }
              });
            },
          });
        });
      }
    }, 500);

    return () => {
      clearTimeout(initTimeout);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center">
      {/* Progress bar */}
      <div className="relative h-40 w-1 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div
          ref={progressBarRef}
          className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-500 to-purple-500"
          style={{ height: "0%" }}
        />
      </div>

      {/* Progress percentage */}
      <div
        ref={progressTextRef}
        className="text-xs font-medium text-gray-700 mb-4"
      >
        0%
      </div>

      {/* Section dots */}
      <div ref={dotsRef} className="flex flex-col space-y-3" />
    </div>
  );
}
