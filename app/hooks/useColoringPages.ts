import useSWR from 'swr';
import { coloringPagesService } from '@/app/services/coloring-pages';
import { favoritesService } from '@/app/services/favorites';
import { TabType } from '@/app/dashboard/components/types';
import { useState, useEffect } from 'react';
import { ColoringPage } from '@/app/services/coloring-pages';

const CACHE_KEY_PAGES = 'coloring-pages';
const CACHE_KEY_FAVORITES = 'favorite-ids';
const CACHE_KEY_USER_PAGES = 'user-generated-pages';

export function useColoringPages(page = 1, itemsPerPage = 12, activeTab: TabType = "created") {
  const [accumulatedPages, setAccumulatedPages] = useState<ColoringPage[]>([]);
  const [accumulatedUserPages, setAccumulatedUserPages] = useState<ColoringPage[]>([]);

  // Fetch all pages
  const { data: newPages, error: pagesError, mutate: mutatePages } = useSWR(
    [CACHE_KEY_PAGES, page],
    () => coloringPagesService.getRecentPages(page, itemsPerPage),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
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
  const { data: newUserPages, error: userPagesError, mutate: mutateUserPages } = useSWR(
    [CACHE_KEY_USER_PAGES, page],
    () => coloringPagesService.getUserGeneratedPages(page, itemsPerPage),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  // Accumulate pages when new data arrives
  useEffect(() => {
    if (newPages) {
      setAccumulatedPages(prev => {
        const newPageIds = new Set(newPages.map(page => page.id));
        const filteredPrev = prev.filter(page => !newPageIds.has(page.id));
        return [...filteredPrev, ...newPages];
      });
    }
  }, [newPages]);

  // Accumulate user pages when new data arrives
  useEffect(() => {
    if (newUserPages) {
      setAccumulatedUserPages(prev => {
        const newPageIds = new Set(newUserPages.map(page => page.id));
        const filteredPrev = prev.filter(page => !newPageIds.has(page.id));
        return [...filteredPrev, ...newUserPages];
      });
    }
  }, [newUserPages]);

  const isLoading = 
    (!newPages && !pagesError) || 
    (!favoriteIds && !favoritesError) || 
    (activeTab === "created" && !newUserPages && !userPagesError);

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
      }, false);
      
      return newFavoritedState;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  };

  // We no longer clear accumulated pages when tab changes
  // This ensures we maintain the data across tab switches
  // useEffect(() => {
  //   setAccumulatedPages([]);
  //   setAccumulatedUserPages([]);
  // }, [activeTab]);

  const allPages = activeTab === "created" ? accumulatedUserPages : accumulatedPages;
  const displayedPages = activeTab === "favorites" 
    ? allPages.filter(page => favoriteIds?.includes(page.id))
    : allPages;

  return {
    pages: allPages,
    favoriteIds: favoriteIds || [],
    userPages: displayedPages,
    isLoading,
    error,
    mutatePages: async (data?: any) => {
      if (typeof data === 'function') {
        setAccumulatedPages(data(accumulatedPages));
      }
      return mutatePages(data);
    },
    mutateFavorites,
    mutateUserPages: async (data?: any) => {
      if (typeof data === 'function') {
        setAccumulatedUserPages(data(accumulatedUserPages));
      }
      return mutateUserPages(data);
    },
    toggleFavorite,
  };
} 