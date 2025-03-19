"use client";

import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Upload Your Own
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Upload any image and convert it into a beautiful coloring page
          </p>
          
          <button
            className={cn(
              "w-full px-6 py-3 rounded-lg transition-all duration-200",
              "bg-white dark:bg-gray-800",
              "text-blue-600 dark:text-blue-300",
              "border-2 border-blue-200 dark:border-blue-400/30",
              "hover:bg-blue-50 dark:hover:bg-blue-400/10",
              "focus:outline-none focus:ring-2",
              "focus:ring-blue-500 dark:focus:ring-blue-300",
              "focus:ring-offset-2 dark:focus:ring-offset-gray-800",
              "font-medium",
              "flex items-center justify-center gap-2"
            )}
          >
            <Upload className="w-5 h-5" />
            Upload Image
          </button>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
            Supported formats: PNG, JPG, JPEG (max 10MB)
          </p>
        </div>
      </div>
    </div>
  );
} 