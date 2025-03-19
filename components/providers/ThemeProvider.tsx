"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      // Save preference to localStorage
      localStorage.setItem("darkMode", newValue ? "dark" : "light");
      
      // Toggle dark class on document
      if (newValue) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      
      return newValue;
    });
  };

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    // Set initial theme based on saved preference or system preference
    const initialDarkMode = savedTheme === "dark" || (!savedTheme && prefersDark);
    
    setIsDarkMode(initialDarkMode);
    
    if (initialDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}