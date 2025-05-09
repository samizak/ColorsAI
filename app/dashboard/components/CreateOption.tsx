import React from "react";
import { cn } from "@/lib/utils";

const CreateOption = ({
  title,
  description,
  icon,
  buttonText,
  onClick,
  gradientFrom,
  gradientTo,
  buttonColor,
  borderColor,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  onClick: () => void;
  gradientFrom: string;
  gradientTo: string;
  buttonColor: string;
  borderColor: string;
}) => {
  // Get the correct background color class for the icon container
  const getIconBgClass = () => {
    switch (buttonColor) {
      case 'purple':
        return 'bg-purple-500';
      case 'blue':
        return 'bg-blue-500';
      case 'green':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Map button colors to their respective Tailwind classes for hover effects
  const getHoverClasses = () => {
    switch (buttonColor) {
      case 'purple':
        return 'hover:bg-purple-50 dark:hover:bg-purple-900/20';
      case 'blue':
        return 'hover:bg-blue-50 dark:hover:bg-blue-900/20';
      case 'green':
        return 'hover:bg-green-50 dark:hover:bg-green-900/20';
      default:
        return 'hover:bg-gray-50 dark:hover:bg-gray-700';
    }
  };

  // Get text and border color classes
  const getButtonColorClasses = () => {
    switch (buttonColor) {
      case 'purple':
        return 'text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-400/30';
      case 'blue':
        return 'text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-400/30';
      case 'green':
        return 'text-green-600 dark:text-green-300 border-green-200 dark:border-green-400/30';
      default:
        return 'text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-400/30';
    }
  };

  return (
    <div
      className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} dark:bg-gray-700 dark:bg-none p-6 rounded-lg border ${borderColor} dark:border-gray-600 hover:shadow-md transition-shadow h-full flex flex-col`}
    >
      <div>
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center mb-4 text-white",
            getIconBgClass()
          )}
        >
          {icon}
        </div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
      </div>

      <div className="mt-auto">
        <button
          onClick={onClick}
          className={cn(
            "w-full px-4 py-2 rounded-md transition-all duration-200 cursor-pointer",
            "bg-white dark:bg-gray-800",
            "border-2",
            getButtonColorClasses(),
            getHoverClasses(),
            "focus:outline-none focus:ring-2",
            `focus:ring-${buttonColor}-500 dark:focus:ring-${buttonColor}-300`,
            "focus:ring-offset-2 dark:focus:ring-offset-gray-700",
            "font-medium"
          )}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default CreateOption;
