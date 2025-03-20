import React from "react";
import { Sparkles } from "lucide-react";

interface GenerationPlaceholderProps {
  isGenerating: boolean;
}

const GenerationPlaceholder: React.FC<GenerationPlaceholderProps> = ({ isGenerating }) => {
  return (
    <div className="flex items-center justify-center flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4 min-h-0">
      {isGenerating ? (
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-200 dark:border-purple-400/30 border-t-purple-600 dark:border-t-purple-400 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Generating your coloring page...
          </p>
        </div>
      ) : (
        <div className="text-center p-6">
          <Sparkles className="h-12 w-12 text-purple-400 dark:text-purple-300 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Enter a prompt below to generate your coloring page
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            For example: &quot;A magical forest with unicorns and fairies&quot;
          </p>
        </div>
      )}
    </div>
  );
};

export default GenerationPlaceholder;