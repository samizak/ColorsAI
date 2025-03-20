import { createClient } from "@/utils/superbase/client";

export const coloringPagesService = {
  async getUserGeneratedPages() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("coloring_pages")
      .select("*")
      .eq("is_ai_generated", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user generated pages:", error);
      throw error;
    }

    return data || [];
  },

  async getRecentPages() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("coloring_pages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching recent pages:", error);
      throw error;
    }

    return data || [];
  },

  async getTotalPagesCount() {
    const supabase = createClient();
    
    const { count, error } = await supabase
      .from("coloring_pages")
      .select("*", { count: "exact", head: true });
      
    if (error) {
      console.error("Error fetching total pages count:", error);
      throw error;
    }
    
    return count || 0;
  },

  async deleteColoringPage(id: number) {
    const supabase = createClient();

    const { error } = await supabase
      .from("coloring_pages")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting coloring page:", error);
      throw error;
    }

    return true;
  },
};
