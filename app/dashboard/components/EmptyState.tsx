import React from "react";
import { FilePlus } from "lucide-react";

const EmptyState = ({ onCreateNew }: { onCreateNew: () => void }) => (
  <div className="text-center py-16">
    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
      <FilePlus className="w-12 h-12 text-gray-400" />
    </div>
    <h3 className="text-xl font-medium text-gray-800 mb-2">
      No coloring pages yet
    </h3>
    <p className="text-gray-600 mb-6">
      Create your first coloring page to get started
    </p>
    <button
      onClick={onCreateNew}
      className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full shadow-md hover:shadow-lg transition-shadow cursor-pointer"
    >
      Create New Page
    </button>
  </div>
);

export default EmptyState;