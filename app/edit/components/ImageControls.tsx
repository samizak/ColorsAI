import React from "react";
import { ZoomIn, ZoomOut, RotateCw, Move } from "lucide-react";

interface ImageControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  onTogglePan: () => void;
  zoom: number;
  isPanning: boolean;
  sidebarCollapsed: boolean; // Add this prop
}

const ImageControls: React.FC<ImageControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onRotate,
  onTogglePan,
  zoom,
  isPanning,
  sidebarCollapsed,
}) => {
  // Calculate the offset based on sidebar state
  const leftOffset = sidebarCollapsed ? "60px" : "240px";
  
  return (
    <div 
      className="fixed bottom-8 z-10 flex justify-center items-center"
      style={{ 
        left: `calc(50% + ${leftOffset}/2)`, 
        transform: 'translateX(-50%)' 
      }}
    >
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg px-6 py-3 flex items-center space-x-4">
        <button
          onClick={onZoomOut}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          aria-label="Zoom out"
        >
          <ZoomOut className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </button>
        
        <div className="text-gray-800 dark:text-gray-200 font-medium min-w-[60px] text-center">
          {Math.round(zoom * 100)}%
        </div>
        
        <button
          onClick={onZoomIn}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          aria-label="Zoom in"
        >
          <ZoomIn className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </button>
        
        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
        
        <button
          onClick={onRotate}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          aria-label="Rotate"
        >
          <RotateCw className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </button>
        
        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
        
        <button
          onClick={onTogglePan}
          className={`p-2 rounded-full transition-colors ${
            isPanning 
              ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300" 
              : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
          aria-label="Toggle pan mode"
        >
          <Move className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default ImageControls;