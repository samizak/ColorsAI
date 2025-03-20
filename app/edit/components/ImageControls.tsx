import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ImageControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
}

export default function ImageControls({
  onZoomIn,
  onZoomOut,
  onRotate,
}: ImageControlsProps) {
  return (
    <div className="flex gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-1 rounded-lg">
      <button
        onClick={onZoomIn}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
        title="Zoom in"
      >
        <ZoomIn className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      </button>
      <button
        onClick={onZoomOut}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
        title="Zoom out"
      >
        <ZoomOut className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      </button>
      <button
        onClick={onRotate}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
        title="Rotate"
      >
        <RotateCcw className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      </button>
    </div>
  );
} 