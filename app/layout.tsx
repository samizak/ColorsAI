import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { SupabaseProvider } from "@/components/providers/SupabaseProvider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastContainer } from "@/components/ui/Toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>
          <ThemeProvider>
            <SmoothScrollProvider>{children}</SmoothScrollProvider>
          </ThemeProvider>
        </SupabaseProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
