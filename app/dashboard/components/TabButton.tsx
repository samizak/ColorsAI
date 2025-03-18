import { cn } from "@/lib/utils";
import React from "react";

const TabButton = ({
  active,
  label,
  onClick,
  icon,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "px-4 py-2 font-medium text-sm mr-4 flex items-center gap-2 transition-all duration-200",
      active
        ? "text-purple-600 border-b-2 border-purple-600"
        : "text-gray-500 hover:text-gray-700"
    )}
  >
    {icon}
    {label}
  </button>
);

export default TabButton;