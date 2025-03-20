import { useState, useRef } from "react";
import { Heart, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { favoritesService } from "@/app/services/favorites";
import { coloringPagesService } from "@/app/services/coloring-pages";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import Image from "next/image";

interface ColoringCardProps {
  page: {
    id: number;
    title: string;
    image: string;
  };
  onEdit: (id: number) => void;
  initialFavorited: boolean;
  onFavoriteChange: (id: number, isFavorited: boolean) => void;
  onDelete: (id: number) => void;
}

export default function ColoringCard({
  page,
  onEdit,
  initialFavorited,
  onFavoriteChange,
  onDelete,
}: ColoringCardProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const pendingRequest = useRef<boolean>(false);
  const lastClickTime = useRef<number>(0);
  const CLICK_DELAY = 500; // Minimum time between clicks (500ms)

  const handleFavoriteClick = async () => {
    const now = Date.now();
    if (pendingRequest.current || now - lastClickTime.current < CLICK_DELAY) {
      return; // Prevent rapid clicking and concurrent requests
    }

    lastClickTime.current = now;
    pendingRequest.current = true;

    // Optimistically update the UI
    const newFavoritedState = !isFavorited;
    setIsFavorited(newFavoritedState);
    onFavoriteChange(page.id, newFavoritedState);

    try {
      // Make the API call in the background
      await favoritesService.toggleFavorite(page.id);
    } catch (error) {
      // If the API call fails, revert the optimistic update
      console.error("Error toggling favorite:", error);
      setIsFavorited(!newFavoritedState);
      onFavoriteChange(page.id, !newFavoritedState);
    } finally {
      pendingRequest.current = false;
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering other click events
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await coloringPagesService.deleteColoringPage(page.id);
      onDelete(page.id);
    } catch (error) {
      console.error("Error deleting coloring page:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md group">
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
              <button
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
              </button>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">
              {page.title}
            </h4>
            <button
              onClick={handleFavoriteClick}
              className={cn(
                "p-1.5 rounded-full transition-all duration-200 cursor-pointer transform hover:scale-110 active:scale-95",
                isFavorited
                  ? "text-pink-500 dark:text-pink-400"
                  : "text-gray-400 dark:text-gray-500 hover:text-pink-500 dark:hover:text-pink-400"
              )}
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-all duration-200",
                  isFavorited ? "fill-current" : "fill-none"
                )}
              />
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Coloring Page"
        message={`Are you sure you want to delete "${page.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}
