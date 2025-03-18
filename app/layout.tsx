import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { SupabaseProvider } from "@/components/providers/SupabaseProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
