"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/providers/SupabaseProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

// Types
type TabType = "recent" | "favorites" | "created";
type ColoringPage = {
  id: number;
  title: string;
  image: string;
  created: string;
};

// Sample data
const COLORING_PAGES: ColoringPage[] = [
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

// Components
const UserAvatar = ({ initials }: { initials: string }) => (
  <span className="text-gray-700 font-medium">{initials}</span>
);

const UserMenu = ({
  user,
  onLogout,
}: {
  user: any;
  onLogout: () => Promise<void>;
}) => (
  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
    <div className="px-4 py-2 border-b border-gray-100">
      <p className="text-sm font-medium text-gray-900">
        {user?.user_metadata?.full_name || "User"}
      </p>
      <p className="text-xs text-gray-500">{user?.email}</p>
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
      onClick={onLogout}
      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
    >
      Sign out
    </button>
  </div>
);

const TabButton = ({
  active,
  label,
  onClick,
  icon,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "px-4 py-2 font-medium text-sm mr-4 flex items-center gap-2 transition-all duration-200",
      active
        ? "text-purple-600 border-b-2 border-purple-600"
        : "text-gray-500 hover:text-gray-700"
    )}
  >
    {icon}
    {label}
  </button>
);

// Remove the tab buttons that are outside the main component
// They should only be used inside the Dashboard component

const ColoringCard = ({
  page,
  onEdit,
}: {
  page: ColoringPage;
  onEdit: (id: number) => void;
}) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
    <div className="relative h-48 overflow-hidden">
      <Image
        src={page.image}
        alt={page.title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
        <div className="p-3 w-full">
          <h3 className="font-medium text-white">{page.title}</h3>
        </div>
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-medium text-gray-800">{page.title}</h3>
      <p className="text-sm text-gray-500 mt-1">Created: {page.created}</p>
      <div className="flex mt-4 gap-2">
        <button className="flex-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-md text-sm font-medium hover:bg-purple-200 transition-colors cursor-pointer flex items-center justify-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print
        </button>
        <button
          onClick={() => onEdit(page.id)}
          className="flex-1 px-3 py-1.5 bg-pink-100 text-pink-700 rounded-md text-sm font-medium hover:bg-pink-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          Edit
        </button>
      </div>
    </div>
  </div>
);

const CreateOption = ({
  title,
  description,
  icon,
  buttonText,
  onClick,
  gradientFrom,
  gradientTo,
  buttonColor,
  borderColor,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  onClick: () => void;
  gradientFrom: string;
  gradientTo: string;
  buttonColor: string;
  borderColor: string;
}) => (
  <div
    className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} p-6 rounded-lg border ${borderColor} hover:shadow-md transition-shadow`}
  >
    <div
      className={`w-12 h-12 bg-gradient-to-r from-${buttonColor}-500 to-${buttonColor}-600 rounded-full flex items-center justify-center mb-4`}
    >
      {icon}
    </div>
    <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <button
      onClick={onClick}
      className={`w-full px-4 py-2 bg-white text-${buttonColor}-600 border border-${buttonColor}-200 rounded-md hover:bg-${buttonColor}-50 transition-colors cursor-pointer`}
    >
      {buttonText}
    </button>
  </div>
);

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("recent");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, signOut } = useSupabase();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name) return "U";
    const names = (user.user_metadata.full_name as string).split(" ");
    return names.length >= 2
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : (user.user_metadata.full_name as string).substring(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      window.location.href = "/auth";
    }
  };

  const handleCreateNew = (path: string = "/create") => router.push(path);

  return (
    <div className={cn("min-h-screen bg-gray-50", poppins.variable)}>
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-purple-600">
            Magical Coloring
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleCreateNew()}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              Create New
            </button>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer"
              >
                <UserAvatar initials={getUserInitials()} />
              </button>

              {userMenuOpen && <UserMenu user={user} onLogout={handleLogout} />}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Your Coloring Pages
        </h1>

        <div className="flex border-b border-gray-200 mb-8">
          {/* Replace the mapping with individual TabButton components that include icons */}
          <TabButton
            active={activeTab === "recent"}
            label="Recent"
            onClick={() => setActiveTab("recent")}
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <TabButton
            active={activeTab === "favorites"}
            label="Favorites"
            onClick={() => setActiveTab("favorites")}
            icon={
              <svg
                className="w-4 h-4"
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
            }
          />
          <TabButton
            active={activeTab === "created"}
            label="Created by You"
            onClick={() => setActiveTab("created")}
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {COLORING_PAGES.map((page) => (
            <ColoringCard
              key={page.id}
              page={page}
              onEdit={(id) => router.push(`/edit/${id}`)}
            />
          ))}
        </div>

        {COLORING_PAGES.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
              onClick={() => handleCreateNew()}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              Create New Page
            </button>
          </div>
        )}

        <div className="mt-16 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Create Something New
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 mr-4">
                  <svg
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Pages
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {COLORING_PAGES.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-pink-100 mr-4">
                  <svg
                    className="h-6 w-6 text-pink-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Favorites</p>
                  <p className="text-2xl font-semibold text-gray-900">3</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Printed</p>
                  <p className="text-2xl font-semibold text-gray-900">12</p>
                </div>
              </div>
            </div>
          </div>
          <CreateOption
            title="Text to Coloring Page"
            description="Describe any idea and watch it transform into a perfect coloring page"
            icon={
              <svg
                className="w-6 h-6 text-white"
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
            }
            buttonText="Get Started"
            onClick={() => handleCreateNew("/create/text-to-image")}
            gradientFrom="from-pink-50"
            gradientTo="to-purple-50"
            buttonColor="purple"
            borderColor="border-purple-100"
          />
          <CreateOption
            title="Upload Your Own"
            description="Upload any image and convert it into a beautiful coloring page"
            icon={
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
            buttonText="Upload Image"
            onClick={() => handleCreateNew("/create/upload")}
            gradientFrom="from-blue-50"
            gradientTo="to-cyan-50"
            buttonColor="blue"
            borderColor="border-blue-100"
          />
          <CreateOption
            title="Browse Templates"
            description="Choose from our collection of ready-to-color templates"
            icon={
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            }
            buttonText="View Templates"
            onClick={() => handleCreateNew("/templates")}
            gradientFrom="from-green-50"
            gradientTo="to-teal-50"
            buttonColor="green"
            borderColor="border-green-100"
          />
        </div>
      </main>
    </div>
  );
}
