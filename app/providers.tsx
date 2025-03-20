"use client";

import { ToastContainer } from "@/components/ui/Toast";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SupabaseProvider } from "@/components/providers/SupabaseProvider";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SupabaseProvider>
        <SmoothScrollProvider>
          {children}
          <ToastContainer />
        </SmoothScrollProvider>
      </SupabaseProvider>
    </ThemeProvider>
  );
}