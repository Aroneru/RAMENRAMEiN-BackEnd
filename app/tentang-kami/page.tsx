import HeroTentangKami from "../components/compro/tentangkami/HeroTentangKami";
import SejarahSection from "../components/compro/tentangkami/SejarahSection";
import OwnerSection from "../components/compro/tentangkami/OwnerSection";
import SuasanaSection from "../components/compro/tentangkami/SuasanaSection";

export default function TentangKamiPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <HeroTentangKami />
      <SejarahSection />
      <OwnerSection />
      <SuasanaSection />
    </div>
  );
}
