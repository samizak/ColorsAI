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
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={page.image}
          alt={page.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          priority={isFirstCard}
        />
        <button
          onClick={handleFavoriteClick}
          disabled={isLoading}
          className={cn(
            "absolute top-2 right-2 p-2 rounded-full",
            "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
            "hover:bg-white dark:hover:bg-gray-700 transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary-500",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-colors duration-200",
              isFavorited
                ? "fill-red-500 stroke-red-500"
                : "fill-none stroke-gray-600 dark:stroke-gray-400"
            )}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{page.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Created: {page.created}</p>
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
