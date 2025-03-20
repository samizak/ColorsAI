"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import { Search, Filter, Loader2 } from "lucide-react";
import Sidebar from "../dashboard/components/Sidebar";
import ColoringCard from "../dashboard/components/ColoringCard";
import { useGalleryPages } from "@/app/hooks/useGalleryPages";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

const categories = [
  { id: "all", name: "All Pages" },
  { id: "favorites", name: "Favorites" },
];

export default function GalleryPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const router = useRouter();

  const {
    pages: filteredPages,
    favoriteIds,
    isLoading,
    error,
    mutatePages,
    toggleFavorite,
  } = useGalleryPages(searchQuery, selectedCategory);

  const handleEditPage = (id: number) => {
    router.push(`/edit?id=${id}`);
  };

  const handleFavoriteChange = async (id: number, isFavorited: boolean) => {
    try {
      await toggleFavorite(id);
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  const handleDeletePage = (id: number) => {
    mutatePages((prevPages = []) => prevPages.filter(page => page.id !== id));
  };

  return (
    <div className={cn("min-h-screen bg-gray-50 dark:bg-gray-900", poppins.variable)}>
      <Sidebar
        isCollapsed={sidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main
        className="transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? "60px" : "240px" }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Gallery
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Browse and discover coloring pages
              </p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search coloring pages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium text-sm transition-colors",
                      selectedCategory === category.id
                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                        : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                    )}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-12 w-12 text-purple-600 dark:text-purple-400 animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">Error loading coloring pages</p>
              </div>
            ) : filteredPages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredPages.map((page) => (
                  <ColoringCard
                    key={page.id}
                    page={page}
                    onEdit={handleEditPage}
                    initialFavorited={favoriteIds.includes(page.id)}
                    onFavoriteChange={handleFavoriteChange}
                    onDelete={handleDeletePage}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No coloring pages found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  We couldn't find any coloring pages matching your search
                  criteria. Try adjusting your filters or search term.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
