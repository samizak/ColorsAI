"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Heart, PlusCircle, Printer, PenTool } from "lucide-react";
import { favoritesService } from "@/app/services/favorites";
import { coloringPagesService } from "@/app/services/coloring-pages";
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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("created");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [coloringPages, setColoringPages] = useState<ColoringPage[]>([]);
  const [userGeneratedPages, setUserGeneratedPages] = useState<ColoringPage[]>([]);
  const [totalPagesCount, setTotalPagesCount] = useState(0);
  const [loadedPages, setLoadedPages] = useState<ColoringPage[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;
  const mainContentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [favorites, count, totalCount] = await Promise.all([
          favoritesService.getFavorites(),
          favoritesService.getFavoriteCount(),
          coloringPagesService.getTotalPagesCount(),
        ]);
        setFavoriteIds(favorites);
        setFavoriteCount(count);
        setTotalPagesCount(totalCount);
        setHasMore(totalCount > ITEMS_PER_PAGE);

        // Load initial batch of pages
        if (activeTab === "created") {
          const initialPages = await coloringPagesService.getUserGeneratedPages(1, ITEMS_PER_PAGE);
          setUserGeneratedPages(initialPages);
          setLoadedPages(initialPages);
        } else if (activeTab === "favorites") {
          const initialPages = await coloringPagesService.getRecentPages(1, ITEMS_PER_PAGE);
          setColoringPages(initialPages);
          setLoadedPages(initialPages);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [activeTab]);

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
    // Optimistically update the UI
    if (isFavorited) {
      setFavoriteIds((prev) => [...prev, pageId]);
      setFavoriteCount((prev) => prev + 1);
    } else {
      setFavoriteIds((prev) => prev.filter((id) => id !== pageId));
      setFavoriteCount((prev) => prev - 1);
    }
  };

  const loadMorePages = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      let newPages: ColoringPage[];

      if (activeTab === "created") {
        newPages = await coloringPagesService.getUserGeneratedPages(nextPage, ITEMS_PER_PAGE);
        setUserGeneratedPages(prev => [...prev, ...newPages]);
      } else if (activeTab === "favorites") {
        newPages = await coloringPagesService.getRecentPages(nextPage, ITEMS_PER_PAGE);
        setColoringPages(prev => [...prev, ...newPages]);
      } else {
        newPages = [];
      }

      setLoadedPages(prev => [...prev, ...newPages]);
      setHasMore(newPages.length === ITEMS_PER_PAGE);
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more pages:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Get pages based on active tab
  const getDisplayedPages = () => {
    if (activeTab === "favorites") {
      return coloringPages.filter((page) => favoriteIds.includes(page.id));
    } else if (activeTab === "created") {
      return userGeneratedPages;
    } else {
      return [];
    }
  };

  const displayedPages = getDisplayedPages();

  const handleDeletePage = (pageId: number) => {
    setColoringPages((prev) => prev.filter((page) => page.id !== pageId));
    setUserGeneratedPages((prev) => prev.filter((page) => page.id !== pageId));

    if (favoriteIds.includes(pageId)) {
      setFavoriteIds((prev) => prev.filter((id) => id !== pageId));
      setFavoriteCount((prev) => prev - 1);
    }
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
        ref={mainContentRef}
        className="transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? "60px" : "240px" }}
      >
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Overview
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Track your coloring page statistics
            </p>
          </div>

          {/* Stats Grid */}
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
                    {totalPagesCount}
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

          {/* Your Coloring Pages */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Your Coloring Pages
            </h3>

            {/* Tabs - Reordered and removed Recent tab */}
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
                <PenTool className="w-4 h-4 " />
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
            ) : loadedPages.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {loadedPages.map((page) => (
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
                      disabled={isLoadingMore}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isLoadingMore ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Loading...
                        </>
                      ) : (
                        'Load More'
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <EmptyState onCreateNew={() => handleCreateNew()} />
            )}

            {/* Create Section */}
            <CreateSection onCreateNew={handleCreateNew} />
          </div>
        </main>
      </div>
    </div>
  );
}
