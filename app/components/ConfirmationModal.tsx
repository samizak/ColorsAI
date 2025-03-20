import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonClass?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  confirmButtonClass = "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" 
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onCancel}
            className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300">{message}</p>
        </div>
        
        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              "px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm cursor-pointer",
              confirmButtonClass
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;