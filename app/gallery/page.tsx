"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGalleryPages } from "@/app/hooks/useGalleryPages";

// Components
import Sidebar from "../dashboard/components/Sidebar";
import ColoringCard from "../dashboard/components/ColoringCard";
import ColoringCardSkeleton from "../dashboard/components/ColoringCardSkeleton";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

const ITEMS_PER_PAGE = 12;

export default function GalleryPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const {
    pages,
    favoriteIds,
    currentUserId,
    isLoading,
    error,
    mutatePages,
    toggleFavorite,
    handleDeletePage,
  } = useGalleryPages(page, ITEMS_PER_PAGE);

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

  const handleFavoriteChange = async (pageId: number, isFavorited: boolean) => {
    try {
      await toggleFavorite(pageId);
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  const handleDeleteConfirm = async (pageId: number) => {
    try {
      await handleDeletePage(pageId);
      // Show success toast or feedback here if needed
    } catch (error) {
      console.error("Error deleting page:", error);
      // Show error toast or feedback here if needed
    }
  };

  const loadMorePages = () => {
    setIsLoadingMore(true);
    setPage(prev => prev + 1);
  };

  // Reset loading more state when new data arrives
  useEffect(() => {
    setIsLoadingMore(false);
  }, [pages]);

  // Calculate hasMore based on the current page's data length
  const hasMore = pages?.length === ITEMS_PER_PAGE * page;

  return (
    <div className={cn("min-h-screen bg-gray-50 dark:bg-gray-900", poppins.variable)}>
      <Sidebar
        isCollapsed={sidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        ref={mainContentRef}
        className="transition-all duration-300 min-h-screen bg-gray-50 dark:bg-gray-900"
        style={{ marginLeft: sidebarCollapsed ? "60px" : "240px" }}
      >
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Gallery
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Explore and discover coloring pages created by the community
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            {isLoading && page === 1 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                  <ColoringCardSkeleton key={index} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">Error loading gallery pages</p>
              </div>
            ) : pages && pages.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {pages.map((page) => (
                    <ColoringCard
                      key={page.id}
                      page={page}
                      onEdit={(id) => router.push(`/edit?id=${id}`)}
                      initialFavorited={favoriteIds.includes(page.id)}
                      onFavoriteChange={handleFavoriteChange}
                      onDelete={page.user_id === currentUserId ? handleDeleteConfirm : undefined}
                      hideDelete={page.user_id !== currentUserId}
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
                {isLoadingMore && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                    {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                      <ColoringCardSkeleton key={`loading-more-${index}`} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-300">
                  No coloring pages available yet
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
