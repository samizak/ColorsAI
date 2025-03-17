"use client";

import { motion } from "framer-motion";
import { Pacifico, Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { ElegantShape } from "@/components/ui/elegant-shape";
import { FloatingCrayon } from "@/components/ui/floating-crayon";
import { ScrollIndicator } from "@/components/ui/scroll-indicator";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export function HeroSection({
  title1 = "Magical",
  title2 = "Coloring Pages",
}: {
  title1?: string;
  title2?: string;
}) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <div className="relative">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/[0.02] via-transparent to-pink-500/[0.02] blur-3xl" />

      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-blue-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-pink-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-purple-500/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-yellow-500/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />

        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-green-500/[0.15]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />

        <FloatingCrayon
          color="red"
          rotation={15}
          delay={0.3}
          className="left-[10%] top-[30%]"
        />

        <FloatingCrayon
          color="blue"
          rotation={-10}
          delay={0.5}
          className="right-[15%] top-[40%]"
        />

        <FloatingCrayon
          color="green"
          rotation={5}
          delay={0.7}
          className="left-[25%] bottom-[20%]"
        />

        <FloatingCrayon
          color="yellow"
          rotation={-20}
          delay={0.4}
          className="right-[20%] bottom-[25%]"
        />
      </div>

      {/* Hero content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 min-h-screen flex items-center justify-center">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
              <span
                className={cn(
                  "bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-700",
                  poppins.className
                )}
              >
                {title1}
              </span>
              <br />
              <span
                className={cn(
                  "bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-blue-600 relative",
                  pacifico.className
                )}
              >
                {title2.split("").map((char, index) => (
                  <motion.span
                    key={`${char}-${index}`}
                    className="inline-block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.1,
                      delay: 1.5 + index * 0.1,
                      ease: "easeInOut",
                    }}
                    style={{
                      textShadow: "0px 0px 12px rgba(150,100,255,0.4)",
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-blue-600"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: title2.length * 0.1,
                    delay: 1.5,
                    ease: "easeInOut",
                  }}
                />
              </span>
            </h1>
          </motion.div>

          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="pt-8"
          >
            <div className="flex flex-col gap-2 text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2, duration: 0.5 }}
                className="font-medium bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
              >
                Spark Your Imagination with Magical Coloring Pages
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5, duration: 0.5 }}
                className="font-light tracking-wide text-md"
              >
                Generate unique, enchanting designs in seconds — perfect for
                kids, families, and anyone who loves to color
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              Start Creating Now
            </button>
          </motion.div>
        </div>

        {/* Add the scroll indicator */}
        <ScrollIndicator />
      </div>
    </div>
  );
}
