import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart, Printer, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { favoritesService } from '@/app/services/favorites';

interface ColoringPage {
  id: number;
  title: string;
  image: string;
  created: string;
}

interface ColoringCardProps {
  page: ColoringPage;
  onEdit: (id: number) => void;
  initialFavorited?: boolean;
  onFavoriteChange?: (id: number, isFavorited: boolean) => void;
  isFirstCard?: boolean;
}

export default function ColoringCard({
  page,
  onEdit,
  initialFavorited = false,
  onFavoriteChange,
  isFirstCard = false,
}: ColoringCardProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteClick = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const newFavoriteState = await favoritesService.toggleFavorite(page.id);
      setIsFavorited(newFavoriteState);
      onFavoriteChange?.(page.id, newFavoriteState);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={page.image}
          alt={page.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={isFirstCard}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-3 w-full">
            <h3 className="font-medium text-white">{page.title}</h3>
          </div>
        </div>
        <button
          onClick={handleFavoriteClick}
          disabled={isLoading}
          className={cn(
            "absolute top-2 right-2 p-2 rounded-full",
            "bg-white/90 backdrop-blur-sm shadow-sm",
            "transition-all duration-300 transform",
            "hover:scale-110 hover:bg-white",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
        >
          <Heart
            size={20}
            className={cn(
              "transition-colors duration-300",
              isFavorited ? "fill-red-500 stroke-red-500" : "stroke-gray-600"
            )}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-800">{page.title}</h3>
        <p className="text-sm text-gray-500 mt-1">Created: {page.created}</p>
        <div className="flex mt-4 gap-2">
          <button className="flex-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-md text-sm font-medium hover:bg-purple-200 transition-colors cursor-pointer flex items-center justify-center gap-1">
            <Printer size={16} />
            Print
          </button>
          <button
            onClick={() => onEdit(page.id)}
            className="flex-1 px-3 py-1.5 bg-pink-100 text-pink-700 rounded-md text-sm font-medium hover:bg-pink-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <Edit size={16} />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
