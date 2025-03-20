"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import gsap from "gsap";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2, Download, Share2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";

// Components
import Sidebar from "../dashboard/components/Sidebar";
import ErrorMessage from "../create/components/ErrorMessage";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export default function EditPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pageId = searchParams.get("id");

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

  // Fetch image data when component mounts
  useEffect(() => {
    const fetchImageData = async () => {
      if (!pageId) {
        setError("No image ID provided");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/coloring-pages/${pageId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch image");
        }

        setImageData(data.image);
        setTitle(data.title);
      } catch (error) {
        console.error("Error fetching image:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch image");
      } finally {
        setIsLoading(false);
      }
    };

    fetchImageData();
  }, [pageId]);

  const handleSave = async () => {
    if (!pageId || !imageData) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/coloring-pages/${pageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          image: imageData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save changes");
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving changes:", error);
      setError(error instanceof Error ? error.message : "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!pageId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/coloring-pages/${pageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete image");
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting image:", error);
      setError(error instanceof Error ? error.message : "Failed to delete image");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleDownload = () => {
    if (!imageData) return;
    
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `${title || 'coloring-page'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent dark:text-white text-lg font-medium mx-12"
                  placeholder="Enter a title for your coloring page"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Share"
                >
                  <Share2 className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-5 w-5 text-red-500 dark:text-red-400" />
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto flex items-center">
          <div className="container mx-auto px-4 py-8">
            {error && <ErrorMessage message={error} />}

            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {isLoading ? (
                  <div className="aspect-square flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                  </div>
                ) : imageData ? (
                  <div className="relative">
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <button
                        onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))}
                        className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <ZoomIn className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </button>
                      <button
                        onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
                        className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <ZoomOut className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </button>
                      <button
                        onClick={() => setRotation(prev => prev + 90)}
                        className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <RotateCcw className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </button>
                    </div>
                    <div 
                      className="relative aspect-square transition-transform duration-200"
                      style={{ 
                        transform: `scale(${zoom}) rotate(${rotation}deg)`,
                        transformOrigin: 'center center'
                      }}
                    >
                      <Image
                        src={imageData}
                        alt={title}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square flex items-center justify-center text-gray-500 dark:text-gray-400">
                    No image available
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Delete Coloring Page
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this coloring page? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 