import useSWR from 'swr';
import { coloringPagesService } from '@/app/services/coloring-pages';
import { favoritesService } from '@/app/services/favorites';
import { useState, useEffect } from 'react';
import { ColoringPage } from '@/app/services/coloring-pages';
import { createClient } from '@/utils/superbase/client';

const CACHE_KEY_GALLERY = 'gallery-pages';
const CACHE_KEY_FAVORITES = 'favorite-ids';
const CACHE_KEY_USER = 'current-user';

export function useGalleryPages(page = 1, itemsPerPage = 12) {
  const [accumulatedPages, setAccumulatedPages] = useState<ColoringPage[]>([]);
  const supabase = createClient();

  // Fetch current user
  const { data: currentUser } = useSWR(CACHE_KEY_USER, async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  // Fetch gallery pages
  const { data: newPages, error: pagesError, mutate: mutatePages } = useSWR(
    [CACHE_KEY_GALLERY, page],
    () => coloringPagesService.getGalleryPages(page, itemsPerPage),
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

  const isLoading = (!newPages && !pagesError) || (!favoriteIds && !favoritesError);
  const error = pagesError || favoritesError;

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

  const handleDeletePage = async (pageId: number) => {
    try {
      await coloringPagesService.deleteColoringPage(pageId);
      // Update the pages cache optimistically
      setAccumulatedPages(prev => prev.filter(page => page.id !== pageId));
      await mutatePages();
    } catch (error) {
      console.error('Error deleting page:', error);
      throw error;
    }
  };

  return {
    pages: accumulatedPages,
    favoriteIds: favoriteIds || [],
    currentUserId: currentUser?.id,
    isLoading,
    error,
    mutatePages: async (data?: any) => {
      if (typeof data === 'function') {
        setAccumulatedPages(data(accumulatedPages));
      }
      return mutatePages(data);
    },
    mutateFavorites,
    toggleFavorite,
    handleDeletePage,
  };
} 