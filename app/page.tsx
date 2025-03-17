"use client";

import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { CTASection } from "@/components/sections/cta-section";
import { FooterSection } from "@/components/sections/footer-section";
import { ScrollProgress } from "@/components/ui/scroll-progress";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export default function Home() {
  const coloringImages1 = [
    "/images/landing/inspirations/a.png",
    "/images/landing/inspirations/b.png",
    "/images/landing/inspirations/c.png",
    "/images/landing/inspirations/d.png",
    "/images/landing/inspirations/e.png",
    "/images/landing/inspirations/f.png",
    "/images/landing/inspirations/g.png",
    "/images/landing/inspirations/h.png",
    "/images/landing/inspirations/i.png",
  ];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-white",
        poppins.variable
      )}
    >
      <ScrollProgress />
      <HeroSection title1="Magical" title2="Coloring Pages" />
      <FeaturesSection />
      <GallerySection coloringImages1={coloringImages1} />
      <CTASection />
      <FooterSection />
    </div>
  );
}
