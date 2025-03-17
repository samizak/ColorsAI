"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Feature = {
  title: string;
  description: string;
  image: string;
};

// Define features with images from the landing page
const defaultFeatures: Feature[] = [
  {
    title: "Kid-Friendly Designs",
    description:
      "Age-appropriate content with just the right level of detail for little artists",
    image: "/images/landing/feature/kid-friendly.jpg",
  },
  {
    title: "Custom Coloring Pages",
    description:
      "Turn any image into a coloring page with our AI-powered technology",
    image: "/images/landing/feature/custom-coloring.webp",
  },
  {
    title: "Unlimited Variety",
    description:
      "From dinosaurs to princesses, create any theme your child can imagine",
    image: "/images/landing/feature/unlimited-variety.webp",
  },
];

export function FeaturesSection({
  features = defaultFeatures,
}: {
  features?: Feature[];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!sectionRef.current) return;

    // Set up panels for pinning
    const panels = panelsRef.current;

    // Create a timeline for each panel
    panels.forEach((panel, i) => {
      // Create a timeline for each panel
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top top",
          end: "+=100%",
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          markers: false,
        },
      });

      // Animate the content
      const title = panel.querySelector(".feature-title");
      const description = panel.querySelector(".feature-description");
      const image = panel.querySelector(".feature-image");
      const imageWrapper = panel.querySelector(".image-wrapper");
      const hoverInstruction = panel.querySelector(".hover-instruction");

      // Initial state
      gsap.set([title, description], { opacity: 0, y: 50 });
      gsap.set(image, { opacity: 0, scale: 0.8 });
      gsap.set(hoverInstruction, { opacity: 0, y: 20 });

      // Animation timeline
      tl.to(title, { opacity: 1, y: 0, duration: 0.3 })
        .to(description, { opacity: 1, y: 0, duration: 0.3 }, "-=0.1")
        .to(image, { opacity: 1, scale: 1, duration: 0.4 }, "-=0.2")
        .to(imageWrapper, { y: -20, duration: 0.3 }, "-=0.2")
        .to(hoverInstruction, { opacity: 0.8, y: 0, duration: 0.3 }, "-=0.1")
        .to({}, { duration: 0.5 }) // Pause at the end
        .to(
          [title, description, image, hoverInstruction],
          {
            opacity: 0,
            y: -50,
            scale: 0.9,
            duration: 0.3,
            stagger: 0.05,
          },
          "+=0.5"
        );
    });

    // Clean up ScrollTrigger instances when component unmounts
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [features.length]);

  // Add panel to refs
  const addToRefs = (el: HTMLDivElement) => {
    if (el && !panelsRef.current.includes(el)) {
      panelsRef.current.push(el);
    }
  };

  return (
    <div id="features-section" ref={sectionRef} className="relative z-10">
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800">
            Turn Ideas Into Beautiful Coloring Pages
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Scroll down to discover our amazing features
          </p>
        </div>
      </div>

      {features.map((feature, index) => (
        <div
          key={index}
          ref={addToRefs}
          className="h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-50"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
              <div className="w-full md:w-1/2 space-y-6">
                <h3 className="feature-title text-3xl md:text-5xl font-bold text-gray-800">
                  {feature.title}
                </h3>
                <p className="feature-description text-lg md:text-xl text-gray-600">
                  {feature.description}
                </p>
              </div>

              <div className="w-full md:w-1/2 image-wrapper">
                <div className="feature-image relative w-full aspect-square max-w-xl mx-auto rounded-2xl overflow-hidden shadow-2xl group">
                  {/* Original image */}
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    priority
                    className="object-cover transition-opacity duration-1000 group-hover:opacity-0"
                  />

                  {/* Colored version that appears on hover */}
                  <Image
                    src={feature.image
                      .replace(".jpg", "-coloured.jpg")
                      .replace(".webp", "-coloured.webp")}
                    alt={`${feature.title} (Colored)`}
                    fill
                    priority
                    className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

                  {/* Crayon animations that appear on hover */}
                  <div className="crayon-container absolute inset-0 pointer-events-none hidden md:block">
                    {/* Red crayon */}
                    <div className="absolute -top-32 left-1/3 opacity-0 group-hover:opacity-100 group-hover:-top-24 transition-all duration-500 ease-out transform -rotate-12">
                      <div className="w-6 h-24">
                        <div className="h-5/6 w-full bg-red-500 rounded-t-sm"></div>
                        <div className="h-1/6 w-full bg-red-700 rounded-b-sm"></div>
                      </div>
                    </div>

                    {/* Blue crayon */}
                    <div className="absolute -right-32 top-1/3 opacity-0 group-hover:opacity-100 group-hover:-right-24 transition-all duration-700 delay-100 ease-out transform rotate-45">
                      <div className="w-6 h-24">
                        <div className="h-5/6 w-full bg-blue-500 rounded-t-sm"></div>
                        <div className="h-1/6 w-full bg-blue-700 rounded-b-sm"></div>
                      </div>
                    </div>

                    {/* Green crayon */}
                    <div className="absolute -bottom-32 right-1/3 opacity-0 group-hover:opacity-100 group-hover:-bottom-24 transition-all duration-600 delay-200 ease-out transform rotate-12">
                      <div className="w-6 h-24">
                        <div className="h-5/6 w-full bg-green-500 rounded-t-sm"></div>
                        <div className="h-1/6 w-full bg-green-700 rounded-b-sm"></div>
                      </div>
                    </div>

                    {/* Yellow crayon */}
                    <div className="absolute -left-32 bottom-1/3 opacity-0 group-hover:opacity-100 group-hover:-left-24 transition-all duration-800 delay-300 ease-out transform -rotate-45">
                      <div className="w-6 h-24">
                        <div className="h-5/6 w-full bg-yellow-500 rounded-t-sm"></div>
                        <div className="h-1/6 w-full bg-yellow-700 rounded-b-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover instruction text - moved below the image */}
                <div className="hover-instruction text-center mt-4 opacity-0 group-hover:opacity-0 transition-opacity duration-300 hidden md:block">
                  <p className="text-gray-800 text-sm font-medium px-4 py-2 bg-yellow-100 border border-yellow-300 inline-block rounded-full shadow-sm">
                    ✨ Hover over image to see it colored ✨
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800">
            Ready to Start Creating?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Join thousands of parents and teachers who are using our platform to
            create custom coloring pages that kids absolutely love!
          </p>
          <button className="px-8 py-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            Start Creating
          </button>
        </div>
      </div>
    </div>
  );
}
