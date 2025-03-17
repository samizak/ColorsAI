"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function FloatingCrayon({
  color,
  rotation,
  delay,
  className,
}: {
  color: string;
  rotation: number;
  delay: number;
  className: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100, rotate: rotation - 20 }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      transition={{
        duration: 1.8,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
      }}
      className={cn("absolute w-6 h-24", className)}
    >
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [rotation, rotation + 5, rotation] }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="relative h-full"
      >
        <div className={`w-full h-5/6 rounded-t-sm bg-${color}-500 shadow-md`} />
        <div className={`w-full h-1/6 rounded-b-sm bg-${color}-700 shadow-md`} />
      </motion.div>
    </motion.div>
  );
}