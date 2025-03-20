"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import { Search, Filter, Sparkles, Loader2 } from "lucide-react";
import Image from "next/image";
import Sidebar from "../dashboard/components/Sidebar";
import { coloringPagesService } from "@/app/services/coloring-pages";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

const categories = [
  { id: "all", name: "All Pages" },
  { id: "nature", name: "Nature" },
  { id: "animals", name: "Animals" },
  { id: "fantasy", name: "Fantasy" },
];

export default function GalleryPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [coloringPages, setColoringPages] = useState<any[]>([]);
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

    fetchColoringPages();
  }, []);

  // Filter pages based on search and category
  const filteredPages = coloringPages.filter((page) => {
    const matchesSearch = page.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      (page.category && page.category.toLowerCase() === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handlePageClick = (id: number) => {
    // Navigate to the edit page or show a preview
    router.push(`/edit/${id}`);
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
                <div
                  key={page.id}
                  onClick={() => handlePageClick(page.id)}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md cursor-pointer group"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={page.image}
                      alt={page.title}
                      fill
                      className="object-cover transition-all duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end">
                      <div className="p-4 w-full">
                        <div className="flex items-center justify-between">
                          <span className="text-white text-sm font-medium">
                            {page.likes ? `${page.likes} likes` : ""}
                          </span>
                          <Sparkles className="h-4 w-4 text-yellow-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {page.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {page.category ? page.category.charAt(0).toUpperCase() + page.category.slice(1) : "Uncategorized"}
                    </p>
                  </div>
                </div>
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
