"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import { Search, Filter, Loader2 } from "lucide-react";
import Sidebar from "../dashboard/components/Sidebar";
import { coloringPagesService } from "@/app/services/coloring-pages";
import ColoringCard from "../dashboard/components/ColoringCard";
import { favoritesService } from "@/app/services/favorites";

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
  const [isLoading, setIsLoading] = useState(true);
  const [coloringPages, setColoringPages] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const router = useRouter();

  // Fetch real data from API
  useEffect(() => {
    const fetchColoringPages = async () => {
      setIsLoading(true);
      try {
        const pages = await coloringPagesService.getAllColoringPages();
        setColoringPages(pages);
      } catch (error) {
        console.error("Error fetching coloring pages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchFavorites = async () => {
      try {
        // getFavorites() already returns an array of page IDs
        const favoriteIds = await favoritesService.getFavorites();
        setFavorites(favoriteIds);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setFavorites([]);
      }
    };

    fetchColoringPages();
    fetchFavorites();
  }, []);

  // Filter pages based on search and category
  const filteredPages = coloringPages.filter((page) => {
    const matchesSearch = page.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "favorites" && favorites.includes(page.id));
    return matchesSearch && matchesCategory;
  });

  const handleEditPage = (id: number) => {
    router.push(`/edit/${id}`);
  };

  const handleFavoriteChange = (id: number, isFavorited: boolean) => {
    if (isFavorited) {
      setFavorites((prev) => [...prev, id]);
    } else {
      setFavorites((prev) => prev.filter((pageId) => pageId !== id));
    }
  };

  const handleDeletePage = (id: number) => {
    setColoringPages((prev) => prev.filter((page) => page.id !== id));
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-gray-50 dark:bg-gray-900",
        poppins.variable
      )}
    >
      <Sidebar
        isCollapsed={sidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        className="transition-all duration-300 flex flex-col h-screen"
        style={{ marginLeft: sidebarCollapsed ? "60px" : "240px" }}
      >
        <main className="container mx-auto px-4 py-8 flex-1 overflow-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">
              Coloring Gallery
            </h1>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  placeholder="Search coloring pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>

              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-12 w-12 text-purple-600 dark:text-purple-400 animate-spin" />
            </div>
          ) : filteredPages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredPages.map((page) => (
                <ColoringCard
                  key={page.id}
                  page={page}
                  onEdit={handleEditPage}
                  initialFavorited={favorites.includes(page.id)}
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
        </main>
      </div>
    </div>
  );
}
