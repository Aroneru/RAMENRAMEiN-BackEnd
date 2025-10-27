import HeroSection from "./components/compro/HeroSection";
import AboutSection from "./components/compro/AboutSection";
import MenuHighlight from "./components/compro/MenuHighlight";
import LocationSection from "./components/compro/LocationSection";
import AccessSection from "./components/compro/AccessSection";
import GallerySection from "./components/compro/GallerySection";

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

