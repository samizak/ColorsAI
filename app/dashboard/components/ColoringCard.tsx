import Image from "next/image";
import React from "react";
import { Printer, Edit2 } from "lucide-react";

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
}) => (
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

export default ColoringCard;