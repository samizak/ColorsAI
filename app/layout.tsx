import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: 'ColorAI - AI-Powered Coloring Page Generator',
  description: 'Create, edit, and share coloring pages powered by AI',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
