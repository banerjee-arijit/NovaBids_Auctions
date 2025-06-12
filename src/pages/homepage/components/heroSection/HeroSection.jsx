import Logo from "@/components/common/Logo";
import HeroBackground from "./HeroBackground";
import HeroBanner from "./HeroBanner";
import HeroFooter from "./HeroFooter";
import HeroTitle from "./HeroTitle";
import { Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import Herofeature from "./Herofeature";
import { useAuth } from "@/context/Authcontex";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import HeroPriceSection from "./HeroPriceSection";

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div>
      <div className="sticky top-0 left-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-gray-300 flex items-center justify-between px-4 sm:px-8 py-4">
        <Logo />
      </div>
      <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden z-0">
        <HeroBackground />
        <div className="relative z-10 px-4 sm:px-8 flex flex-col items-center justify-center text-center">
          <HeroBanner
            Icon={Gavel}
            contentText="The Future of Digital Auctions"
          />
          <HeroTitle />
        </div>
      </section>

      <Herofeature />
      <HeroPriceSection />
      <HeroFooter />
    </div>
  );
};

export default HeroSection;
