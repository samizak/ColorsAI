import React from "react";
import Image from "next/image";

interface ImagePreviewProps {
  imageUrl: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl }) => {
  return (
    <div className="mb-4 flex-1 flex flex-col min-h-0">
      <div className="relative w-full flex-1 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="relative w-full h-full">
          <Image
            src={imageUrl}
            alt="Generated coloring page"
            fill
            className="object-contain bg-white"
            unoptimized // Required for base64 images
            priority // Load this image immediately as it's the main content
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;