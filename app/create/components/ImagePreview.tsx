import React from "react";

interface ImagePreviewProps {
  imageUrl: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl }) => {
  return (
    <div className="mb-4 flex-1 flex flex-col min-h-0">
      <div className="relative w-full flex-1 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <img
          src={imageUrl}
          alt="Generated coloring page"
          className="w-full h-full object-contain bg-white"
        />
      </div>
    </div>
  );
};

export default ImagePreview;