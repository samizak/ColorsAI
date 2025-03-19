"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Send, Sparkles } from "lucide-react";

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
    } catch (error) {
      console.error("Error generating image:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={cn("min-h-screen bg-gray-50", poppins.variable)}>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Create a Coloring Page
          </h1>

          <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex flex-col h-[calc(100vh-13rem)] overflow-hidden">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Text to Coloring Page
            </h2>
            <p className="text-gray-600 mb-6">
              Describe what you want to see in your coloring page, and our AI
              will create it for you.
            </p>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-1 bg-purple-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 w-1/3"></div>
              </div>
              <span className="text-sm font-medium text-gray-600">
                Step 1 of 3
              </span>
            </div>

            {generatedImage ? (
              <div className="mb-4 flex-1 flex flex-col min-h-0">
                <div className="relative w-full flex-1 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={generatedImage}
                    alt="Generated coloring page"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex justify-end mt-4 gap-3">
                  <button
                    onClick={() => setGeneratedImage(null)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Regenerate
                  </button>
                  <button
                    onClick={() => router.push(`/edit/new`)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Continue to Edit
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center flex-1 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 mb-4 min-h-0">
                {isGenerating ? (
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
                    <p className="text-gray-600">
                      Generating your coloring page...
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Enter a prompt below to generate your coloring page
                    </p>
                    <p className="text-sm text-gray-500">
                      For example: "A magical forest with unicorns and fairies"
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <h3 className="text-md font-medium text-gray-700">
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
                    className="p-3 text-sm text-left bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200"
                  >
                    {examplePrompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Fixed prompt input at bottom */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="container mx-auto">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your coloring page..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isGenerating) {
                      handleGenerateImage();
                    }
                  }}
                />
                {prompt && (
                  <button
                    onClick={() => setPrompt("")}
                    className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <button
                onClick={handleGenerateImage}
                disabled={isGenerating || !prompt.trim()}
                className={cn(
                  "p-3 rounded-lg flex items-center justify-center",
                  isGenerating || !prompt.trim()
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                )}
              >
                {isGenerating ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
