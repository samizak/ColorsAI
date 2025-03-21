import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageEditorProps {
  isLoading: boolean;
  imageData: string | null;
  title: string;
  zoom: number;
  rotation: number;
  isPanning?: boolean;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
  isLoading,
  imageData,
  title,
  zoom,
  rotation,
  isPanning = false,
}) => {
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isCurrentlyPanning, setIsCurrentlyPanning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset pan position when panning is disabled
  useEffect(() => {
    if (!isPanning) {
      setIsCurrentlyPanning(false);
    }
  }, [isPanning]);

  // Pan handlers with improved performance
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isPanning || !imageData) return;

    e.preventDefault(); // Prevent default browser drag behavior
    setIsCurrentlyPanning(true);
    setStartPos({
      x: e.clientX - panPosition.x,
      y: e.clientY - panPosition.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isCurrentlyPanning || !isPanning || !imageData) return;

    e.preventDefault(); // Prevent default browser behavior

    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      setPanPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y,
      });
    });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isCurrentlyPanning) {
      e.preventDefault();
      setIsCurrentlyPanning(false);
    }
  };

  // Add global mouse up handler to ensure panning stops even if mouse is released outside the component
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsCurrentlyPanning(false);
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      window.addEventListener("mouseup", handleGlobalMouseUp);
    };
  }, []);

  // Determine the cursor style based on the current state
  const getCursorStyle = () => {
    if (!imageData) return "";
    if (!isPanning) return "";
    return isCurrentlyPanning ? "cursor-grabbing" : "cursor-grab";
  };

  return (
    <div className="flex flex-col h-full">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-gray-200"></div>
        </div>
      ) : (
        <div
          ref={containerRef}
          className={`relative flex-1 my-4 flex items-center justify-center overflow-hidden ${getCursorStyle()}`}
          style={{ minHeight: "60vh", touchAction: "none" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {imageData ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <div
                className="relative w-4/5"
                style={{
                  height: "700px",
                  maxHeight: "50%",
                }}
              >
                <Image
                  src={imageData}
                  alt={title || "Coloring page"}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-contain transition-transform"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg) translate(${
                      panPosition.x / zoom
                    }px, ${panPosition.y / zoom}px)`,
                    pointerEvents: isPanning ? "none" : "auto", // Prevent image from capturing events during panning
                  }}
                  unoptimized
                  draggable="false"
                />
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                No image available
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
