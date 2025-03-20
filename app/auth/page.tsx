"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { ElegantShape } from "@/components/ui/elegant-shape";
import { FloatingCrayon } from "@/components/ui/floating-crayon";
import { SignInForm } from "@/components/auth/sign-in-form";
import { RegisterForm } from "@/components/auth/register-form";
import gsap from "gsap";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

// Create a client component that uses useSearchParams
function AuthContent() {
  const [activeTab, setActiveTab] = useState<"signin" | "register">("signin");
  const backLinkRef = useRef<HTMLAnchorElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const backLink = backLinkRef.current;
    const arrow = arrowRef.current;
    const text = textRef.current;
    
    if (!backLink || !arrow || !text) return;
    
    // Initial setup
    gsap.set(arrow, { x: 0 });
    gsap.set(text, { color: "#4B5563" });
    gsap.set(backLink, { boxShadow: "0 0 0 rgba(168, 85, 247, 0)" });
    
    // Create hover animation timeline
    const tl = gsap.timeline({ paused: true });
    tl.to(arrow, { x: -5, duration: 0.3, ease: "power2.out" })
      .to(text, { color: "#9333EA", duration: 0.3, ease: "power2.out" }, 0)
      .to(backLink, { boxShadow: "0 2px 4px rgba(168, 85, 247, 0.3)", duration: 0.3, ease: "power2.out" }, 0);
    
    // Add event listeners
    const handleMouseEnter = () => tl.play();
    const handleMouseLeave = () => tl.reverse();
    
    backLink.addEventListener("mouseenter", handleMouseEnter);
    backLink.addEventListener("mouseleave", handleMouseLeave);
    
    // Cleanup
    return () => {
      backLink.removeEventListener("mouseenter", handleMouseEnter);
      backLink.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className={cn("min-h-screen bg-gray-50", poppins.variable)}>
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/[0.02] via-transparent to-pink-500/[0.02] blur-3xl" />

      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-blue-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-pink-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <FloatingCrayon
          color="red"
          rotation={15}
          delay={0.3}
          className="left-[10%] top-[30%]"
        />

        <FloatingCrayon
          color="blue"
          rotation={-10}
          delay={0.5}
          className="right-[15%] top-[40%]"
        />
      </div>

      {/* Auth content */}
      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          {/* Logo and back link */}
          <div className="mb-8 text-center">
            <Link
              ref={backLinkRef}
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors"
            >
              <span ref={arrowRef} className="mr-2">
                ←
              </span>
              <span ref={textRef}>Back to home</span>
            </Link>
            <div className="mt-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Magic Coloring
              </h1>
              <p className="text-gray-600 mt-2">
                Create beautiful coloring pages with AI
              </p>
            </div>
          </div>

          {/* Auth card */}
          <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab("signin")}
                className={`px-4 py-2 font-medium text-sm mr-4 ${
                  activeTab === "signin"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "register"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Register
              </button>
            </div>

            {/* Form */}
            {activeTab === "signin" ? <SignInForm /> : <RegisterForm />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
