"use client";

import { toast, Toaster } from "sonner";
import { CheckCircle, AlertCircle, Info } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";

export const ToastContainer = () => {
  // Get the current theme from your ThemeProvider
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <Toaster
      position="bottom-center"
      theme={isDarkMode ? "dark" : "light"}
      toastOptions={{
        className: "border shadow-lg",
        style: {
          maxWidth: "420px",
          width: "100%",
        },
        // Custom styles for light/dark mode
        classNames: {
          toast: "group toast",
          title: "font-medium text-gray-900 dark:text-white",
          description: "text-gray-600 dark:text-gray-300 text-sm",
          actionButton: "bg-purple-600 text-white hover:bg-purple-700",
          cancelButton: "text-gray-500 dark:text-gray-400",
          success: "border-green-100 dark:border-green-900/30 dark:bg-gray-800",
          error: "border-red-100 dark:border-red-900/30 dark:bg-gray-800",
          info: "border-blue-100 dark:border-blue-900/30 dark:bg-gray-800",
        },
        duration: 4000,
      }}
    />
  );
};

interface ToastOptions {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      icon: (
        <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
      ),
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action && {
        label: options.action.label,
        onClick: options.action.onClick,
      },
    });
  },

  error: (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      icon: <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />,
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action && {
        label: options.action.label,
        onClick: options.action.onClick,
      },
    });
  },

  info: (message: string, options?: ToastOptions) => {
    return toast.info(message, {
      icon: <Info className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action && {
        label: options.action.label,
        onClick: options.action.onClick,
      },
    });
  },
};
