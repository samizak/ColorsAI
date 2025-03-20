import { useState } from "react";
import { Heart, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { favoritesService } from "@/app/services/favorites";

interface ColoringCardProps {
  page: {
    id: number;
    title: string;
    image: string;
  };
  onEdit: (id: number) => void;
  initialFavorited: boolean;
  onFavoriteChange: (id: number, isFavorited: boolean) => void;
}

export default function ColoringCard({
  page,
  onEdit,
  initialFavorited,
  onFavoriteChange,
}: ColoringCardProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteClick = async () => {
    setIsLoading(true);
    try {
      const newFavoritedState = await favoritesService.toggleFavorite(page.id);
      setIsFavorited(newFavoritedState);
      onFavoriteChange(page.id, newFavoritedState);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={page.image}
          alt={page.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(page.id)}
            className="absolute bottom-3 left-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Edit className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">
            {page.title}
          </h4>
          <button
            onClick={handleFavoriteClick}
            disabled={isLoading}
            className={cn(
              "p-1.5 rounded-full transition-colors",
              isFavorited
                ? "text-pink-500 dark:text-pink-400"
                : "text-gray-400 dark:text-gray-500 hover:text-pink-500 dark:hover:text-pink-400"
            )}
          >
            <Heart
              className={cn(
                "h-4 w-4",
                isFavorited ? "fill-current" : "fill-none"
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
