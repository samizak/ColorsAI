import React from "react";

interface ExamplePromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const ExamplePrompts: React.FC<ExamplePromptsProps> = ({ onSelectPrompt }) => {
  const examplePrompts = [
    "A magical underwater kingdom",
    "Space explorers on a distant planet",
    "Cute animals having a tea party",
  ];

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">
        Example prompts:
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {examplePrompts.map((examplePrompt) => (
          <button
            key={examplePrompt}
            onClick={() => onSelectPrompt(examplePrompt)}
            className="p-3 text-sm text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
          >
            {examplePrompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamplePrompts;