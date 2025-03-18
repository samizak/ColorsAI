import Image from "next/image";
import React, { useState } from "react";
import { Printer, Edit2, Heart } from "lucide-react";

type ColoringPage = {
  id: number;
  title: string;
  image: string;
  created: string;
};

const ColoringCard = ({
  page,
  onEdit,
}: {
  page: ColoringPage;
  onEdit: (id: number) => void;
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={page.image}
          alt={page.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-3 w-full">
            <h3 className="font-medium text-white">{page.title}</h3>
          </div>
        </div>
        {/* Favorite button in top-right corner */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full shadow-sm hover:bg-white transition-colors z-10 cursor-pointer"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? "fill-pink-500 text-pink-500" : "text-gray-500"
            }`}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-800">{page.title}</h3>
        <p className="text-sm text-gray-500 mt-1">Created: {page.created}</p>
        <div className="flex mt-4 gap-2">
          <button className="flex-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-md text-sm font-medium hover:bg-purple-200 transition-colors cursor-pointer flex items-center justify-center gap-1">
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={() => onEdit(page.id)}
            className="flex-1 px-3 py-1.5 bg-pink-100 text-pink-700 rounded-md text-sm font-medium hover:bg-pink-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColoringCard;
