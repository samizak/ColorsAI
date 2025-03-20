import React from "react";
import { Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  setPrompt,
  isGenerating,
  onGenerate,
}) => {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-[9px]">
      <div className="container mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your coloring page..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isGenerating) {
                  onGenerate();
                }
              }}
            />
            {prompt && (
              <button
                onClick={() => setPrompt("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
              >
                <X className="w-7 h-7" />
              </button>
            )}
          </div>
          <button
            onClick={onGenerate}
            disabled={isGenerating || !prompt.trim()}
            className={cn(
              "p-3 rounded-lg flex items-center justify-center cursor-pointer",
              isGenerating || !prompt.trim()
                ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            )}
          >
            {isGenerating ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
