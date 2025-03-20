import useSWR from 'swr';
import { coloringPagesService } from '@/app/services/coloring-pages';
import { favoritesService } from '@/app/services/favorites';
import { TabType } from '@/app/dashboard/components/types';

const CACHE_KEY_PAGES = 'coloring-pages';
const CACHE_KEY_FAVORITES = 'favorite-ids';
const CACHE_KEY_USER_PAGES = 'user-generated-pages';

export function useColoringPages(page = 1, itemsPerPage = 12, activeTab: TabType = "created") {
  // Fetch all pages
  const { data: pages, error: pagesError, mutate: mutatePages } = useSWR(
    [CACHE_KEY_PAGES, page],
    () => coloringPagesService.getRecentPages(page, itemsPerPage),
    {
      revalidateOnFocus: false, // Don't revalidate on window focus
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

  // Fetch user generated pages
  const { data: userPages, error: userPagesError, mutate: mutateUserPages } = useSWR(
    [CACHE_KEY_USER_PAGES, page],
    () => coloringPagesService.getUserGeneratedPages(page, itemsPerPage),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const isLoading = 
    (!pages && !pagesError) || 
    (!favoriteIds && !favoritesError) || 
    (activeTab === "created" && !userPages && !userPagesError);

  const error = pagesError || favoritesError || (activeTab === "created" ? userPagesError : null);

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
    pages: pages || [],
    favoriteIds: favoriteIds || [],
    userPages: userPages || [],
    isLoading,
    error,
    mutatePages,
    mutateFavorites,
    mutateUserPages,
    toggleFavorite,
  };
} 