import React from "react";

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
}) => (
  <div
    className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} dark:bg-gray-700 dark:bg-none p-6 rounded-lg border ${borderColor} dark:border-gray-600 hover:shadow-md transition-shadow`}
  >
    <div
      className={`w-12 h-12 bg-gradient-to-r from-${buttonColor}-500 to-${buttonColor}-600 rounded-full flex items-center justify-center mb-4`}
    >
      {icon}
    </div>
    <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
    <button
      onClick={onClick}
      className={`w-full px-4 py-2 bg-white dark:bg-gray-800 text-${buttonColor}-600 dark:text-${buttonColor}-400 border border-${buttonColor}-200 dark:border-${buttonColor}-700 rounded-md hover:bg-${buttonColor}-50 dark:hover:bg-${buttonColor}-900/20 transition-colors cursor-pointer`}
    >
      {buttonText}
    </button>
  </div>
);

export default CreateOption;