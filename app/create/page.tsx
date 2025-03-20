"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import gsap from "gsap";

// Components
import Sidebar from "../dashboard/components/Sidebar";
import ImagePreview from "./components/ImagePreview";
import GenerationPlaceholder from "./components/GenerationPlaceholder";
import ExamplePrompts from "./components/ExamplePrompts";
import PromptInput from "./components/PromptInput";
import ErrorMessage from "./components/ErrorMessage";

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
  const [error, setError] = useState<string | null>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

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
    setError(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      if (!data.imageData) {
        throw new Error("No image data received");
      }

      const imageUrl = `data:image/png;base64,${data.imageData}`;
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsGenerating(false);
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

            {error && <ErrorMessage message={error} />}

            {generatedImage ? (
              <ImagePreview imageUrl={generatedImage} />
            ) : (
              <GenerationPlaceholder isGenerating={isGenerating} />
            )}

            <ExamplePrompts onSelectPrompt={setPrompt} />
          </div>
        </main>

        <PromptInput
          prompt={prompt}
          setPrompt={setPrompt}
          isGenerating={isGenerating}
          onGenerate={handleGenerateImage}
        />
      </div>
    </div>
  );
}
