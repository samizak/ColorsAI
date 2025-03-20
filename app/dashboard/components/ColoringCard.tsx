import { useState, useRef, useEffect } from "react";
import { Heart, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { favoritesService } from "@/app/services/favorites";
import { coloringPagesService } from "@/app/services/coloring-pages";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import Image from "next/image";
import DeleteConfirmationModal from "@/app/components/DeleteConfirmationModal";

interface ColoringCardProps {
  page: {
    id: number;
    title: string;
    image: string;
  };
  onEdit: (id: number) => void;
  onDelete?: (id: number) => void;
  initialFavorited: boolean;
  onFavoriteChange: (pageId: number, isFavorited: boolean) => void;
  hideDelete?: boolean;
}

export default function ColoringCard({
  page,
  onEdit,
  onDelete,
  initialFavorited,
  onFavoriteChange,
  hideDelete = false,
}: ColoringCardProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setIsFavorited(initialFavorited);
  }, [initialFavorited]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUpdating) return;

    setIsUpdating(true);
    const newState = !isFavorited;
    setIsFavorited(newState);

    try {
      await onFavoriteChange(page.id, newState);
    } catch (error) {
      if (isMounted.current) {
        setIsFavorited(!newState);
      }
      console.error("Error updating favorite:", error);
    } finally {
      if (isMounted.current) {
        setIsUpdating(false);
      }
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (onDelete) {
        await onDelete(page.id);
      }
    } catch (error) {
      console.error("Error deleting page:", error);
    }
  };

  return (
    <>
      <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="relative aspect-square rounded-t-lg overflow-hidden">
          <Image
            src={page.image}
            alt={page.title}
            fill
            className="object-cover transition-all duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="absolute bottom-3 left-3 flex gap-2">
              <button
                onClick={() => onEdit(page.id)}
                className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <Edit className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </button>
              {!hideDelete && onDelete && (
                <button
                  onClick={handleDeleteClick}
                  className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-red-100 dark:hover:bg-red-900/90 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {page.title}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleFavoriteClick}
                disabled={isUpdating}
                className={cn(
                  "p-2 rounded-full transition-colors duration-200 cursor-pointer",
                  isFavorited
                    ? "text-pink-600 dark:text-pink-400"
                    : "text-gray-400 hover:text-pink-600 dark:hover:text-pink-400"
                )}
              >
                <Heart
                  className={cn("h-5 w-5", isFavorited ? "fill-current" : "")}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
