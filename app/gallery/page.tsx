"use client";

import React from "react";
import { ImageIcon, Construction } from "lucide-react";
import Link from "next/link";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Gallery Page
        </h1>
        
        <div className="flex items-center justify-center mb-4">
          <Construction className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
          <p className="text-gray-500 dark:text-gray-400">Under Construction</p>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Our gallery is coming soon! We're working on creating a beautiful space to showcase all your coloring creations.
        </p>
        
        <Link 
          href="/dashboard" 
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors cursor-pointer"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}