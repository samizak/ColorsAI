"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Clock, Heart, Edit } from "lucide-react";
import { favoritesService } from "@/app/services/favorites";

// Components
import Sidebar from "./components/Sidebar";
import StatsSection from "./components/StatsSection";
import TabButton from "./components/TabButton";
import ColoringCard from "./components/ColoringCard";
import EmptyState from "./components/EmptyState";
import CreateSection from "./components/CreateSection";

// Data and Types
import { COLORING_PAGES } from "./components/data";
import { TabType } from "./components/types";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("recent");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load favorites on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const [favorites, count] = await Promise.all([
          favoritesService.getFavorites(),
          favoritesService.getFavoriteCount()
        ]);
        setFavoriteIds(favorites);
        setFavoriteCount(count);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Animation for main content margin adjustment
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
    if (isFavorited) {
      setFavoriteIds(prev => [...prev, pageId]);
      setFavoriteCount(prev => prev + 1);
    } else {
      setFavoriteIds(prev => prev.filter(id => id !== pageId));
      setFavoriteCount(prev => prev - 1);
    }
  };

  // Filter pages based on active tab
  const filteredPages = COLORING_PAGES.filter(page => {
    if (activeTab === "favorites") {
      return favoriteIds.includes(page.id);
    }
    // Add more filters for other tabs if needed
    return true;
  });

  return (
    <div className={cn("min-h-screen bg-gray-50", poppins.variable)}>
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
          {/* Stats Section */}
          <StatsSection
            totalPages={COLORING_PAGES.length}
            totalFavorites={favoriteCount}
            totalPrinted={0}
          />

          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Your Coloring Pages
          </h1>

          <div className="flex border-b border-gray-200 mb-8">
            <TabButton
              active={activeTab === "recent"}
              label="Recent"
              onClick={() => setActiveTab("recent")}
              icon={<Clock size={16} />}
            />
            <TabButton
              active={activeTab === "favorites"}
              label="Favorites"
              onClick={() => setActiveTab("favorites")}
              icon={<Heart size={16} />}
            />
            <TabButton
              active={activeTab === "created"}
              label="Created by You"
              onClick={() => setActiveTab("created")}
              icon={<Edit size={16} />}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredPages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredPages.map((page) => (
                <ColoringCard
                  key={page.id}
                  page={page}
                  onEdit={(id) => router.push(`/edit/${id}`)}
                  initialFavorited={favoriteIds.includes(page.id)}
                  onFavoriteChange={handleFavoriteChange}
                />
              ))}
            </div>
          ) : (
            <EmptyState onCreateNew={() => handleCreateNew()} />
          )}

          {/* Create Section */}
          <CreateSection onCreateNew={handleCreateNew} />
        </main>
      </div>
    </div>
  );
}
