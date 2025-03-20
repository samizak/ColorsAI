import useSWR from 'swr';
import { coloringPagesService } from '@/app/services/coloring-pages';
import { favoritesService } from '@/app/services/favorites';

const CACHE_KEY_GALLERY = 'gallery-pages';
const CACHE_KEY_FAVORITES = 'favorite-ids';

export function useGalleryPages(searchQuery: string = '', category: string = 'all') {
  // Fetch all gallery pages
  const { data: pages, error: pagesError, mutate: mutatePages } = useSWR(
    CACHE_KEY_GALLERY,
    coloringPagesService.getAllColoringPages,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  );

  // Fetch favorite IDs
  const { data: favoriteIds, error: favoritesError, mutate: mutateFavorites } = useSWR(
    CACHE_KEY_FAVORITES,
    favoritesService.getFavorites,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const isLoading = (!pages && !pagesError) || (!favoriteIds && !favoritesError);
  const error = pagesError || favoritesError;

  // Filter pages based on search and category
  const filteredPages = (pages || []).filter((page) => {
    const matchesSearch = page.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      category === "all" ||
      (category === "favorites" && (favoriteIds || []).includes(page.id));
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = async (pageId: number) => {
    try {
      const newFavoritedState = await favoritesService.toggleFavorite(pageId);
      
      // Update the favorites cache optimistically
      await mutateFavorites((prev: number[] = []) => {
        if (newFavoritedState) {
          return [...prev, pageId];
        } else {
          return prev.filter(id => id !== pageId);
        }
      }, false); // false means no revalidation needed
      
      return newFavoritedState;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  };

  return {
    pages: filteredPages,
    favoriteIds: favoriteIds || [],
    isLoading,
    error,
    mutatePages,
    mutateFavorites,
    toggleFavorite,
  };
} 