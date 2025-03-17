"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<
    "recent" | "favorites" | "created"
  >("recent");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Sample coloring pages data
  const coloringPages = [
    {
      id: 1,
      title: "Magical Unicorn",
      image: "/images/landing/inspirations/a.png",
      created: "2023-05-15",
    },
    {
      id: 2,
      title: "Space Adventure",
      image: "/images/landing/inspirations/b.png",
      created: "2023-05-14",
    },
    {
      id: 3,
      title: "Enchanted Forest",
      image: "/images/landing/inspirations/c.png",
      created: "2023-05-13",
    },
    {
      id: 4,
      title: "Ocean Friends",
      image: "/images/landing/inspirations/d.png",
      created: "2023-05-12",
    },
    {
      id: 5,
      title: "Dinosaur World",
      image: "/images/landing/inspirations/e.png",
      created: "2023-05-11",
    },
    {
      id: 6,
      title: "Fairy Garden",
      image: "/images/landing/inspirations/f.png",
      created: "2023-05-10",
    },
  ];

  // Handle create new page
  const handleCreateNew = () => {
    router.push("/create");
  };

  // Handle logout
  const handleLogout = () => {
    // Here you would implement actual logout logic
    // For example: await supabase.auth.signOut()
    router.push("/auth");
  };

  return (
    <div className={cn("min-h-screen bg-gray-50", poppins.variable)}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-purple-600">
            Magical Coloring
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              Create New
            </button>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <span className="text-gray-700 font-medium">JD</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      John Doe
                    </p>
                    <p className="text-xs text-gray-500">
                      john.doe@example.com
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Your Coloring Pages
        </h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("recent")}
            className={cn(
              "px-4 py-2 font-medium text-sm mr-4",
              activeTab === "recent"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Recent
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={cn(
              "px-4 py-2 font-medium text-sm mr-4",
              activeTab === "favorites"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Favorites
          </button>
          <button
            onClick={() => setActiveTab("created")}
            className={cn(
              "px-4 py-2 font-medium text-sm",
              activeTab === "created"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Created by You
          </button>
        </div>

        {/* Grid of coloring pages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {coloringPages.map((page) => (
            <div
              key={page.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={page.image}
                  alt={page.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-800">{page.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Created: {page.created}
                </p>
                <div className="flex mt-4 gap-2">
                  <button className="flex-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded text-sm font-medium hover:bg-purple-200 transition-colors">
                    Print
                  </button>
                  <button
                    onClick={() => router.push(`/edit/${page.id}`)}
                    className="flex-1 px-3 py-1.5 bg-pink-100 text-pink-700 rounded text-sm font-medium hover:bg-pink-200 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {coloringPages.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No coloring pages yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first coloring page to get started
            </p>
            <button
              onClick={handleCreateNew}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              Create New Page
            </button>
          </div>
        )}

        {/* Create new section */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Create Something New
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-lg border border-purple-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Text to Coloring Page
              </h3>
              <p className="text-gray-600 mb-4">
                Describe any idea and watch it transform into a perfect coloring
                page
              </p>
              <button
                onClick={() => router.push("/create/text-to-image")}
                className="w-full px-4 py-2 bg-white text-purple-600 border border-purple-200 rounded-md hover:bg-purple-50 transition-colors"
              >
                Get Started
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Image to Coloring Page
              </h3>
              <p className="text-gray-600 mb-4">
                Upload any image and convert it into a beautiful coloring page
              </p>
              <button
                onClick={() => router.push("/create/image-to-coloring")}
                className="w-full px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
              >
                Upload Image
              </button>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Browse Templates
              </h3>
              <p className="text-gray-600 mb-4">
                Choose from our collection of ready-to-print coloring templates
              </p>
              <button
                onClick={() => router.push("/templates")}
                className="w-full px-4 py-2 bg-white text-amber-600 border border-amber-200 rounded-md hover:bg-amber-50 transition-colors"
              >
                View Templates
              </button>
            </div>
          </div>
        </div>

        {/* Recent activity section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Recent Activity
          </h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="divide-y divide-gray-200">
              {/* Activity items */}
              <div className="p-4 flex items-center hover:bg-gray-50">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    You completed "Magical Unicorn" coloring page
                  </p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
                <button className="text-sm text-purple-600 hover:text-purple-800">
                  View
                </button>
              </div>

              <div className="p-4 flex items-center hover:bg-gray-50">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    You created "Space Adventure" coloring page
                  </p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
                <button className="text-sm text-purple-600 hover:text-purple-800">
                  View
                </button>
              </div>

              <div className="p-4 flex items-center hover:bg-gray-50">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-4">
                  <svg
                    className="w-5 h-5 text-pink-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    You favorited "Enchanted Forest" coloring page
                  </p>
                  <p className="text-xs text-gray-500">5 days ago</p>
                </div>
                <button className="text-sm text-purple-600 hover:text-purple-800">
                  View
                </button>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 text-center">
              <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2023 Magical Coloring. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                href="/terms"
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                Privacy
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
