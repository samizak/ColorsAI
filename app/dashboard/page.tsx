"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Heart, PlusCircle, Printer, PenTool } from "lucide-react";
import { useColoringPages } from "@/app/hooks/useColoringPages";
import { ColoringPage } from "@/app/services/coloring-pages";

// Components
import Sidebar from "./components/Sidebar";
import ColoringCard from "./components/ColoringCard";
import EmptyState from "./components/EmptyState";
import CreateSection from "./components/CreateSection";
import ColoringCardSkeleton from "./components/ColoringCardSkeleton";

import { TabType } from "./components/types";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

const ITEMS_PER_PAGE = 12;

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("created");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [page, setPage] = useState(1);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const {
    pages,
    favoriteIds,
    userPages,
    isLoading,
    error,
    mutatePages,
    mutateFavorites,
    mutateUserPages,
    toggleFavorite,
  } = useColoringPages(page, ITEMS_PER_PAGE, activeTab);

  // Animation for sidebar collapse
  useEffect(() => {
    if (mainContentRef.current) {
      gsap.to(mainContentRef.current, {
        marginLeft: sidebarCollapsed ? 60 : 240,
        duration: 0.5,
        ease: "power3.inOut",
      });
    }
  }, [sidebarCollapsed]);

  const handleCreateNew = (path: string = "/create") => router.push(path);

  const handleFavoriteChange = async (pageId: number, isFavorited: boolean) => {
    try {
      await toggleFavorite(pageId);
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  const handleDeletePage = async (pageId: number) => {
    // Update all caches to remove the deleted page
    mutatePages((prevPages: ColoringPage[] = []) => 
      prevPages.filter(page => page.id !== pageId)
    );
    mutateUserPages((prevPages: ColoringPage[] = []) => 
      prevPages.filter(page => page.id !== pageId)
    );
    if (favoriteIds.includes(pageId)) {
      mutateFavorites((prev: number[] = []) => 
        prev.filter(id => id !== pageId)
      );
    }
  };

  const loadMorePages = () => {
    setPage(prev => prev + 1);
  };

  // Get pages based on active tab
  const displayedPages = activeTab === "favorites" 
    ? (pages || []).filter(page => favoriteIds.includes(page.id))
    : userPages || [];

  const hasMore = displayedPages.length === ITEMS_PER_PAGE * page;

  return (
    <div className={cn("min-h-screen bg-gray-50 dark:bg-gray-900", poppins.variable)}>
      <Sidebar
        isCollapsed={sidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        ref={mainContentRef}
        className="transition-all duration-300 flex flex-col h-screen"
        style={{ marginLeft: sidebarCollapsed ? "60px" : "240px" }}
      >
        <main className="container mx-auto px-4 py-8 flex-1">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Your Coloring Pages
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Manage and organize your coloring pages
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <PlusCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Total Pages
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {(pages || []).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-pink-100 dark:bg-pink-900/30">
                  <Heart className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Favorites
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {favoriteIds.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Printer className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Printed
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    0
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
              <button
                onClick={() => setActiveTab("created")}
                className={cn(
                  "px-4 py-2 font-medium text-sm mr-4 flex items-center gap-2 transition-all duration-200 cursor-pointer",
                  activeTab === "created"
                    ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                )}
              >
                <PenTool className="w-4 h-4" />
                Created by You
              </button>
              <button
                onClick={() => setActiveTab("favorites")}
                className={cn(
                  "px-4 py-2 font-medium text-sm mr-4 flex items-center gap-2 transition-all duration-200 cursor-pointer",
                  activeTab === "favorites"
                    ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                )}
              >
                <Heart className="w-4 h-4" />
                Favorites
              </button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                  <ColoringCardSkeleton key={index} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">Error loading coloring pages</p>
              </div>
            ) : displayedPages && displayedPages.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {displayedPages.map((page) => (
                    <ColoringCard
                      key={page.id}
                      page={page}
                      onEdit={(id) => router.push(`/edit?id=${id}`)}
                      initialFavorited={favoriteIds.includes(page.id)}
                      onFavoriteChange={handleFavoriteChange}
                      onDelete={handleDeletePage}
                    />
                  ))}
                </div>
                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={loadMorePages}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            ) : (
              <EmptyState onCreateNew={() => handleCreateNew()} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
