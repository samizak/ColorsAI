import { createClient } from "@/utils/superbase/client";

export interface ColoringPage {
  id: number;
  title: string;
  image: string;
  user_id: string;
  is_ai_generated: boolean;
  created_at: string;
}

export const coloringPagesService = {
  async getUserGeneratedPages(page: number = 1, limit: number = 12) {
    const supabase = createClient();
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error } = await supabase
      .from("coloring_pages")
      .select("*")
      .eq("is_ai_generated", true)
      .order("created_at", { ascending: false })
      .range(start, end);

    if (error) {
      console.error("Error fetching user generated pages:", error);
      throw error;
    }

    return (data || []) as ColoringPage[];
  },

  async getRecentPages(page: number = 1, limit: number = 12) {
    const supabase = createClient();
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error } = await supabase
      .from("coloring_pages")
      .select("*")
      .order("created_at", { ascending: false })
      .range(start, end);

    if (error) {
      console.error("Error fetching recent pages:", error);
      throw error;
    }

    return (data || []) as ColoringPage[];
  },

  async getAllColoringPages() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("coloring_pages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all coloring pages:", error);
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

  async deleteColoringPage(id: number): Promise<boolean> {
    const supabase = createClient();
    
    try {
      // First delete the image from storage
      const { data: page } = await supabase
        .from('coloring_pages')
        .select('image_url')
        .eq('id', id)
        .single();

      if (page?.image_url) {
        const imagePath = page.image_url.split('/').pop(); // Get the filename from URL
        if (imagePath) {
          const { error: storageError } = await supabase.storage
            .from('coloring-pages')
            .remove([imagePath]);
          
          if (storageError) {
            console.error('Error deleting image from storage:', storageError);
          }
        }
      }

      // Then delete the database record
      const { error } = await supabase
        .from('coloring_pages')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting coloring page:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteColoringPage:', error);
      throw error;
    }
  },

  async getGalleryPages(page: number = 1, limit: number = 12): Promise<ColoringPage[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('coloring_pages')
      .select('*')
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      console.error('Error fetching gallery pages:', error);
      throw new Error('Failed to fetch gallery pages');
    }

    return data || [];
  },
};
