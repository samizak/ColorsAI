"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type GalleryProps = {
  coloringImages1: string[];
};

export function GallerySection({ coloringImages1 }: GalleryProps) {
  // Combine all images into a single array
  const allImages = [...coloringImages1];

  return (
    <section className="relative z-10 py-16 overflow-hidden bg-gray-100">
      <div className="mb-12 text-center">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
          Endless Inspiration
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          Browse through our gallery of coloring pages for inspiration or jump
          right in and create your own!
        </p>
      </div>

      {/* Single row with infinite scroll */}
      <div className="relative">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-30%" }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
          className="flex whitespace-nowrap"
        >
          {/* Triple the images to ensure plenty of content for wider screens */}
          {[...allImages, ...allImages, ...allImages].map((image, index) => (
            <div
              key={index}
              className="inline-block px-3 w-[100px] h-[300px] relative"
            >
              <div className="w-full h-full rounded-lg overflow-hidden bg-white p-2 shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="relative w-full h-full rounded-md overflow-hidden">
                  <Image
                    src={image}
                    alt={`Inspiration ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
