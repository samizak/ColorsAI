"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import gsap from "gsap";
import { useSearchParams, useRouter } from "next/navigation";

// Components
import Sidebar from "../dashboard/components/Sidebar";
import ErrorMessage from "../create/components/ErrorMessage";
import Header from "./components/Header";
import ImageEditor from "./components/ImageEditor";
import DeleteConfirmationModal from "@/app/components/DeleteConfirmationModal";
import { coloringPagesService } from "@/app/services/coloring-pages";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
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

  // Fetch image data when component mounts
  useEffect(() => {
    const fetchImageData = async () => {
      if (!id) {
        setError("No image ID provided");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/coloring-pages/${id}`);
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
  }, [id]);

  const handleSave = async () => {
    if (!id || !imageData) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/coloring-pages/${id}`, {
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
    if (!id) return;
    
    setIsDeleting(true);
    try {
      await coloringPagesService.deleteColoringPage(parseInt(id));
      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting coloring page:", error);
      setError(error instanceof Error ? error.message : "Failed to delete coloring page");
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
        className="transition-all duration-300 flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900"
        style={{ marginLeft: sidebarCollapsed ? "60px" : "240px" }}
      >
        <Header
          title={title}
          setTitle={setTitle}
          onSave={handleSave}
          onDelete={() => setShowDeleteModal(true)}
          onDownload={handleDownload}
          isSaving={isSaving}
          isDeleting={isDeleting}
        />

        <main className="container mx-auto px-4 py-4 sm:py-8 flex-1 flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">
            Edit Coloring Page
          </h1>

          {error && <ErrorMessage message={error} />}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 flex-1">
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
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Coloring Page"
        message="Are you sure you want to delete this coloring page? This action cannot be undone and will remove the page from your dashboard and gallery."
      />
    </div>
  );
} 