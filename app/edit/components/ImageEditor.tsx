import { Loader2, ZoomIn, ZoomOut, RotateCw, Move } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

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
  const [isPanning, setIsPanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isPanning) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setIsDragging(true);
    setDragStart({
      x: clientX - position.x,
      y: clientY - position.y
    });

    const container = containerRef.current;
    if (container) {
      container.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!isPanning || !isDragging) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const container = containerRef.current;
    if (container) {
      container.style.cursor = isPanning ? 'grab' : 'default';
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.style.cursor = isPanning ? 'grab' : 'default';

    if (isPanning) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isPanning, isDragging]);

  return (
    <div className="relative w-full">
      {/* Image Container */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-square sm:aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : imageData ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={imageData}
              alt={title}
              className="max-w-full max-h-full object-contain transition-transform duration-300"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                cursor: isPanning ? (isDragging ? 'grabbing' : 'grab') : 'default'
              }}
              draggable={false}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-400 dark:text-gray-500">No image available</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg">
        <button
          onClick={onZoomOut}
          disabled={zoom <= 0.5}
          className={cn(
            "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <div className="px-2 min-w-[3rem] text-center text-sm font-medium">
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={onZoomIn}
          disabled={zoom >= 2}
          className={cn(
            "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        <button
          onClick={() => {
            setIsPanning(!isPanning);
            setIsDragging(false);
            setPosition({ x: 0, y: 0 }); // Reset position when toggling pan mode
          }}
          className={cn(
            "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
            isPanning && "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
          )}
          title="Pan"
        >
          <Move className="w-5 h-5" />
        </button>
        <button
          onClick={onRotate}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Rotate"
        >
          <RotateCw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
} 