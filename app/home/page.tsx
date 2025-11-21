import HeroSection from "../components/compro/home/HeroSection";
import AboutSection from "../components/compro/home/AboutSection";
import MenuHighlight from "../components/compro/home/MenuHighlight";
import LocationSection from "../components/compro/home/LocationSection";
import AccessSection from "../components/compro/home/AccessSection";
import GallerySection from "../components/compro/home/GallerySection";

// Disable caching to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <MenuHighlight />
      <LocationSection />
      <AccessSection />
      <GallerySection />
    </main>
  );
}

