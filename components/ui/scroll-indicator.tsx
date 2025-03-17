"use client";

import { motion } from "framer-motion";
import { useCallback } from "react";

export function ScrollIndicator() {
  const scrollToFeatures = useCallback(() => {
    // Get the features section element
    const featuresSection = document.querySelector('#features-section');
    
    if (featuresSection) {
      // Scroll to the features section
      window.scrollTo({
        top: featuresSection.getBoundingClientRect().top + window.scrollY,
        behavior: 'smooth'
      });
    }
  }, []);

  return (
    <motion.div 
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3, duration: 1 }}
      onClick={scrollToFeatures}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-gray-500 text-sm mb-2">Scroll Down</span>
      <motion.div
        className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center p-1"
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        <motion.div 
          className="w-1.5 h-1.5 bg-gray-400 rounded-full"
          initial={{ y: 0 }}
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      </motion.div>
    </motion.div>
  );
}