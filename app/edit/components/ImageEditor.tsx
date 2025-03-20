import Image from "next/image";
import ImageControls from "./ImageControls";

interface ImageEditorProps {
  isLoading: boolean;
  imageData: string | null;
  title: string;
  zoom: number;
  rotation: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
}

export default function ImageEditor({
  isLoading,
  imageData,
  title,
  zoom,
  rotation,
  onZoomIn,
  onZoomOut,
  onRotate,
}: ImageEditorProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="aspect-square flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : imageData ? (
          <div className="relative">
            <div className="absolute top-4 right-4 z-10">
              <ImageControls
                onZoomIn={onZoomIn}
                onZoomOut={onZoomOut}
                onRotate={onRotate}
              />
            </div>
            <div 
              className="relative aspect-square transition-transform duration-200"
              style={{ 
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center center'
              }}
            >
              <Image
                src={imageData}
                alt={title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
              />
            </div>
          </div>
        ) : (
          <div className="aspect-square flex items-center justify-center text-gray-500 dark:text-gray-400">
            No image available
          </div>
        )}
      </div>
    </div>
  );
} 