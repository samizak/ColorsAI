import { createClient } from "@/utils/superbase/client";

export const favoritesService = {
  async getFavorites() {
    const supabase = createClient();
    const { data: favorites, error } = await supabase
      .from("favorites")
      .select("coloring_page_id");

    if (error) {
      console.error("Error fetching favorites:", error);
      return [];
    }

    return favorites.map(fav => fav.coloring_page_id);
  },

  async getFavoriteCount() {
    const supabase = createClient();
    const { count, error } = await supabase
      .from("favorites")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error fetching favorite count:", error);
      return 0;
    }

    return count || 0;
  },

  async toggleFavorite(coloringPageId: number) {
    const supabase = createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // Check if already favorited
    const { data: existing, error: checkError } = await supabase
      .from("favorites")
      .select("id")
      .eq("coloring_page_id", coloringPageId)
      .eq("user_id", user.id)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking favorite status:", checkError);
      throw checkError;
    }

    // If already favorited, remove it
    if (existing) {
      const { error: deleteError } = await supabase
        .from("favorites")
        .delete()
        .eq("id", existing.id);

      if (deleteError) {
        console.error("Error removing favorite:", deleteError);
        throw deleteError;
      }
      
      return false; // Not favorited anymore
    } 
    // Otherwise, add it
    else {
      const { error: insertError } = await supabase
        .from("favorites")
        .insert({ 
          coloring_page_id: coloringPageId,
          user_id: user.id
        });

      if (insertError) {
        console.error("Error adding favorite:", insertError);
        throw insertError;
      }
      
      return true; // Now favorited
    }
  }
};