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

    return favorites.map(
      (fav: { coloring_page_id: any }) => fav.coloring_page_id
    );
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
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Check if already favorited - FIX: Use match instead of eq for numeric values
    const { data: existing, error: checkError } = await supabase
      .from("favorites")
      .select("id")
      .eq("coloring_page_id", coloringPageId.toString()) // Convert to string
      .eq("user_id", user.id)
      .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no record exists

    if (checkError) {
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
      const { error: insertError } = await supabase.from("favorites").insert({
        coloring_page_id: coloringPageId,
        user_id: user.id,
      });

      if (insertError) {
        console.error("Error adding favorite:", insertError);
        throw insertError;
      }

      return true; // Now favorited
    }
  },
};
