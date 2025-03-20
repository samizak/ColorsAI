"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type GalleryProps = {
  coloringImages1: string[];
};

export function GallerySection({ coloringImages1 }: GalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !galleryRef.current ||
      !trackRef.current ||
      typeof window === "undefined"
    )
      return;

    const track = trackRef.current;
    const images = track.querySelectorAll(".gallery-item");

    // Calculate the width of the track based on the images
    const trackWidth = Array.from(images).reduce(
      (width, img) => width + (img as HTMLElement).offsetWidth + 20, // Adding gap
      0
    );

    // Set the track width
    gsap.set(track, { width: trackWidth });

    // Create the horizontal scrolling animation
    const scrollTween = gsap.to(track, {
      x: `-${trackWidth - window.innerWidth + 1000}px`, // Increased offset for more scrolling distance
      ease: "none",
      scrollTrigger: {
        id: "galleryScroll",
        trigger: galleryRef.current,
        start: "top top",
        end: () => `+=${trackWidth * 2}`, // Increased scrolling distance by 20%
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        markers: false,
      },
    });

    // Animate images on scroll
    images.forEach((image, i) => {
      gsap.fromTo(
        image,
        {
          y: i % 2 === 0 ? 50 : -50,
          opacity: 0.3,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: image,
            start: "left right-=100",
            end: "right left+=100",
            scrub: true,
            containerAnimation: scrollTween,
          },
        }
      );
    });

    // Make sure to refresh ScrollTrigger after everything is set up
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [coloringImages1.length]);

  return (
    <section
      ref={galleryRef}
      className="relative z-10 overflow-hidden bg-gray-100"
    >
      <div className="h-screen flex flex-col">
        <div className="py-12 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
            Endless Inspiration
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto px-4">
            Browse through our gallery of coloring pages for inspiration or jump
            right in and create your own!
          </p>
        </div>

        <div className="flex-1 overflow-hidden">
          <div
            ref={trackRef}
            className="gallery-track h-full flex items-center pl-[10vw]"
          >
            {coloringImages1.map((image, index) => (
              <div
                key={index}
                className={`gallery-item flex-shrink-0 mx-10 ${
                  index % 2 === 0 ? "mt-20" : "-mt-20"
                }`}
              >
                <div className="w-[350px] h-[450px] rounded-xl overflow-hidden bg-white p-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`Inspiration ${index + 1}`}
                      fill
                      priority={index < 3} // Add priority to first 3 images that are likely above the fold
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 350px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 text-white">
                        <p className="font-medium">Coloring Page {index + 1}</p>
                        <p className="text-sm opacity-80">
                          Click to create similar
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
