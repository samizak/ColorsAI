"use client";

import { cn } from "@/lib/utils";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
});

export function FooterSection() {
  return (
    <footer className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3
              className={cn(
                "text-2xl font-bold text-gray-800",
                pacifico.className
              )}
            >
              Magical Coloring Pages
            </h3>
            <p className="text-gray-600 mt-2">
              Bringing imagination to life, one page at a time.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              About
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Privacy
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Terms
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Contact
            </a>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Magical Coloring Pages. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
