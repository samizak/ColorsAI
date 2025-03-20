import React from "react";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const EmptyState = ({ onCreateNew }: { onCreateNew: () => void }) => (
  <div className="text-center py-16 px-4 rounded-xl bg-white/5 dark:bg-gray-800/20 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center">
      <PlusCircle className="w-10 h-10 text-purple-500 dark:text-purple-400" />
    </div>
    <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-3">
      No coloring pages yet
    </h3>
    <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
      Create your first coloring page to get started
    </p>
    <button
      onClick={onCreateNew}
      className={cn(
        "px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full",
        "shadow-lg hover:shadow-purple-500/20 dark:hover:shadow-purple-500/10",
        "transition-all duration-300 transform hover:-translate-y-1",
        "font-medium flex items-center justify-center gap-2 mx-auto"
      )}
    >
      <PlusCircle className="w-4 h-4" />
      Create New Page
    </button>
  </div>
);

export default EmptyState;