import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export interface Favorite {
  id: string;
  user_id: string;
  coloring_page_id: number;
  created_at: string;
}

export const favoritesService = {
  async getFavorites(): Promise<number[]> {
    const { data: favorites, error } = await supabase
      .from('favorites')
      .select('coloring_page_id');

    if (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }

    return favorites.map(fav => fav.coloring_page_id);
  },

  async toggleFavorite(coloringPageId: number): Promise<boolean> {
    // First check if the page is already favorited
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('coloring_page_id', coloringPageId)
      .single();

    if (existing) {
      // Remove from favorites
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('coloring_page_id', coloringPageId);

      if (error) {
        console.error('Error removing favorite:', error);
        return false;
      }
      return false;
    } else {
      // Add to favorites
      const { error } = await supabase
        .from('favorites')
        .insert([
          {
            coloring_page_id: coloringPageId,
          }
        ]);

      if (error) {
        console.error('Error adding favorite:', error);
        return false;
      }
      return true;
    }
  },

  async getFavoriteCount(): Promise<number> {
    const { count, error } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error getting favorite count:', error);
      return 0;
    }

    return count || 0;
  }
}; 