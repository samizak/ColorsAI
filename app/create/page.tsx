"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Replace react-hot-toast with sonner
import gsap from "gsap";
import { Send, Sparkles, X, Loader2 } from "lucide-react";

// Components
import Sidebar from "../dashboard/components/Sidebar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export default function CreatePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      const data = await response.json();
      const imageUrl = `data:image/png;base64,${data.imageData}`;
      setGeneratedImage(imageUrl);

      // Handle the saved image information
      if (data.savedImage) {
        // Show a success message with Sonner
        toast.success("Image saved to your collection!", {
          description: "You can find it in your dashboard.",
          action: {
            label: "View",
            onClick: () => router.push("/dashboard"),
          },
        });

        console.log("Toast success");

        // You can store the ID for later use
        const imageId = data.savedImage.id;

        // Update the continue button to go to the edit page with the saved image ID
        const continueButton = document.querySelector("button[data-continue]");
        if (continueButton) {
          continueButton.addEventListener("click", () => {
            router.push(`/edit/${imageId}`);
          });
        }
      } else if (data.message) {
        // Show informational message
        toast.info(data.message);
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image", {
        description: "Please try again later.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Add this to suppress hydration warnings
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // Mark as client-side rendered after hydration
    setIsClient(true);
  }, []);

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
        className="transition-all duration-300 flex flex-col h-screen"
        style={{ marginLeft: sidebarCollapsed ? "60px" : "240px" }}
      >
        <main className="container mx-auto px-4 py-8 flex-1 overflow-hidden">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
            Create a Coloring Page
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 flex flex-col h-[calc(100vh-13rem)] overflow-hidden">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Text to Coloring Page
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Describe what you want to see in your coloring page, and our AI
              will create it for you.
            </p>

            {generatedImage ? (
              <div className="mb-4 flex-1 flex flex-col min-h-0">
                <div className="relative w-full flex-1 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img
                    src={generatedImage}
                    alt="Generated coloring page"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4 min-h-0">
                {isGenerating ? (
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 text-purple-600 dark:text-purple-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300">
                      Generating your coloring page...
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      Enter a prompt below to generate your coloring page
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      For example: "A magical forest with unicorns and fairies"
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">
                Example prompts:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  "A magical underwater kingdom",
                  "Space explorers on a distant planet",
                  "Cute animals having a tea party",
                ].map((examplePrompt) => (
                  <button
                    key={examplePrompt}
                    onClick={() => setPrompt(examplePrompt)}
                    className="p-3 text-sm text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md border border-gray-200 dark:border-gray-600"
                  >
                    {examplePrompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Fixed prompt input at bottom */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="container mx-auto">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your coloring page..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isGenerating) {
                      handleGenerateImage();
                    }
                  }}
                />
                {prompt && (
                  <button
                    onClick={() => setPrompt("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <button
                onClick={handleGenerateImage}
                disabled={isGenerating || !prompt.trim()}
                className={cn(
                  "p-3 rounded-lg flex items-center justify-center",
                  isGenerating || !prompt.trim()
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-purple-600 dark:bg-purple-700 text-white hover:bg-purple-700 dark:hover:bg-purple-800"
                )}
              >
                {isGenerating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
