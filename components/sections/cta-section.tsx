"use client";

import { motion } from "framer-motion";

export function CTASection() {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative z-10 py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-2xl mx-auto"
        >
          <motion.h2 
            variants={textVariants}
            className="text-3xl md:text-4xl font-bold mb-6 text-gray-800"
          >
            Ready to Create Your Own Coloring Pages?
          </motion.h2>
          
          <motion.p 
            variants={textVariants}
            className="text-lg text-gray-600 mb-8"
          >
            Join thousands of parents and teachers who are using our platform
            to create custom coloring pages that kids absolutely love!
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.3,
              type: "spring",
              stiffness: 200
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started for Free
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}