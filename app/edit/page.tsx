"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import gsap from "gsap";
import { useSearchParams } from "next/navigation";

// Components
import Sidebar from "../dashboard/components/Sidebar";
import ErrorMessage from "../create/components/ErrorMessage";
import Header from "./components/Header";
import ImageEditor from "./components/ImageEditor";
import DeleteModal from "./components/DeleteModal";

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

      window.location.href = "/dashboard";
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

      window.location.href = "/dashboard";
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
        <Header
          title={title}
          setTitle={setTitle}
          onSave={handleSave}
          onDelete={() => setShowDeleteModal(true)}
          onDownload={handleDownload}
          isSaving={isSaving}
        />

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 sm:py-8 sm:px-4">
            {error && <ErrorMessage message={error} />}

            <ImageEditor
              isLoading={isLoading}
              imageData={imageData}
              title={title}
              zoom={zoom}
              rotation={rotation}
              onZoomIn={() => setZoom(prev => Math.min(prev + 0.1, 2))}
              onZoomOut={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
              onRotate={() => setRotation(prev => prev + 90)}
            />
          </div>
        </main>

        <DeleteModal
          isOpen={showDeleteModal}
          isDeleting={isDeleting}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
} 