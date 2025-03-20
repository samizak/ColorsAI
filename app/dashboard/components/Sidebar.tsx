"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import gsap from "gsap";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Home,
  Image as LucideImage,
  User,
  Settings,
  PlusCircle,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";

// Menu items configuration
const MENU_ITEMS = [
  { icon: <Home size={20} />, label: "Dashboard", href: "/dashboard" },
  { icon: <PlusCircle size={20} />, label: "Create", href: "/create" },
  { icon: <LucideImage size={20} />, label: "Gallery", href: "/gallery" },
];

const Sidebar = ({
  isCollapsed,
  toggleCollapse,
}: {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useSupabase();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  // Animation for sidebar collapse/expand
  useEffect(() => {
    if (sidebarRef.current) {
      gsap.to(sidebarRef.current, {
        width: isCollapsed ? 60 : 240,
        duration: 0.5,
        ease: "power3.inOut",
      });
    }
  }, [isCollapsed]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getUserInitial = () => {
    const fullName = user?.user_metadata?.full_name || user?.email || "User";
    return fullName.charAt(0).toUpperCase();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      window.location.href = "/auth";
    }
  };

  return (
    <div
      ref={sidebarRef}
      className="fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-20"
      style={{ width: isCollapsed ? "60px" : "240px" }}
    >
      <div className="flex flex-col h-full">
        {/* Header with logo and collapse button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <Link
            href="/"
            className="text-xl font-bold text-gray-600 dark:text-white flex flex-row gap-2 justify-center items-center"
          >
            <Image src="/logo.png" alt="ColorAI" width={32} height={32} />
            {!isCollapsed && <span>ColorAI</span>}
          </Link>
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer text-gray-600 dark:text-gray-400"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        <nav className="flex-1 flex flex-col justify-between p-2">
          {/* Main navigation links */}
          <div className="space-y-1">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-1",
                  isCollapsed ? "justify-center" : "justify-start"
                )}
              >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </div>

          {/* User profile section */}
          <div
            className="border-t border-gray-200 dark:border-gray-800 pt-2"
            ref={profileMenuRef}
          >
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className={cn(
                "w-full px-3 py-2 flex items-center gap-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors relative cursor-pointer",
                profileMenuOpen && "bg-purple-50 dark:bg-purple-900/20",
                isCollapsed && "justify-center"
              )}
            >
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 flex items-center justify-center font-medium">
                {getUserInitial()}
              </div>

              {!isCollapsed && (
                <div className="flex-1 text-left flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {user?.user_metadata?.full_name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[140px]">
                      {user?.email || "user@email.com"}
                    </p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "text-gray-400 transition-transform",
                      profileMenuOpen && "rotate-180"
                    )}
                  />
                </div>
              )}
            </button>

            {/* Profile Popup Menu */}
            {profileMenuOpen && (
              <div className="absolute bottom-[55px] left-0 min-w-[240px] p-2 z-50">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user?.user_metadata?.full_name || "User"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user?.email || "user@email.com"}
                    </p>
                  </div>

                  {/* Menu items */}
                  <MenuLink
                    href="/profile"
                    icon={<User size={16} />}
                    label="Your Profile"
                  />

                  {/* Dark Mode Toggle */}
                  <div
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors flex items-center justify-between cursor-pointer"
                    onClick={toggleTheme}
                  >
                    <div className="flex items-center gap-2">
                      {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                      {isDarkMode ? "Light Mode" : "Dark Mode"}
                    </div>
                    <ThemeToggle isDarkMode={isDarkMode} />
                  </div>

                  <MenuLink
                    href="/settings"
                    icon={<Settings size={16} />}
                    label="Settings"
                  />

                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

// Helper components
const MenuLink = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) => (
  <Link
    href={href}
    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
  >
    {icon}
    {label}
  </Link>
);

const ThemeToggle = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <div className="relative inline-block w-10 align-middle select-none">
    <input
      type="checkbox"
      name="darkMode"
      id="darkMode"
      checked={isDarkMode}
      readOnly
      className="sr-only peer"
    />
    <label
      htmlFor="darkMode"
      onClick={(e) => e.stopPropagation()}
      className="block h-6 overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4"
    ></label>
  </div>
);

export default Sidebar;
