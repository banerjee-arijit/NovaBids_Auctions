import { Tabs } from "@/components/ui/LandingPageTabs/tabs";
import HeroSectionFeatureData from "@/static/HeroSectionFeatureData";

const HeroFeatureCard = () => {
  return (
    <div className="h-[30rem] md:h-[40rem] relative  flex flex-col max-w-5xl mx-auto w-full items-start justify-start my-10 md:my-40 px-4 md:px-0">
      <Tabs tabs={HeroSectionFeatureData} />
    </div>
  );
};

export default HeroFeatureCard;
