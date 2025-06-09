import Logo from "@/components/Logo";
import HeroBackground from "./HeroBackground";
import HeroBanner from "./HeroBanner";
import HeroFeatureCard from "./HeroFeatureCard";
import HeroFeatureTitle from "./HeroFeatureTitle";
import HeroFooter from "./HeroFooter";
import HeroTitle from "./HeroTitle";
import HeroVideo from "./HeroVideo";
import { Gavel } from "lucide-react";

const HeroSection = () => {
  return (
    <div>
      <div className="absolute top-4 left-4 z-20">
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

      <div className="py-10 bg-white">
        <HeroVideo />
      </div>
      <HeroFeatureTitle />
      {/* <HeroFeatureCard /> */}
      <HeroFooter />
    </div>
  );
};

export default HeroSection;
