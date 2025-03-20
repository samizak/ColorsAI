import { toast, Toaster } from "sonner";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

export const ToastContainer = () => {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        className: "dark:bg-gray-800 dark:text-white dark:border-gray-700",
        duration: 4000,
        style: {
          maxWidth: "420px",
          width: "100%",
        },
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
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action && {
        label: options.action.label,
        onClick: options.action.onClick,
      },
      className:
        "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
    });
  },

  error: (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action && {
        label: options.action.label,
        onClick: options.action.onClick,
      },
      className:
        "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
    });
  },

  info: (message: string, options?: ToastOptions) => {
    return toast.info(message, {
      icon: <Info className="h-5 w-5 text-blue-500" />,
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action && {
        label: options.action.label,
        onClick: options.action.onClick,
      },
      className:
        "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
    });
  },
};
