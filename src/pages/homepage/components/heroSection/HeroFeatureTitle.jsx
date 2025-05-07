import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import HeroBanner from "./HeroBanner";

const HeroFeatureTitle = () => {
  return (
    <>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <HeroBanner Icon={Sparkles} contentText="Powerfull features" />

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl  text-white mb-6"
          >
            Everything You Need to
            <span className="block text-transparent bg-clip-text font-bold bg-gradient-to-r from-[var(--primary-text-color)] to-blue-500">
              Master Digital Auctions
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-800 max-w-2xl mx-auto text-lg"
          >
            Discover our comprehensive suite of auction tools and features
            designed to give you the competitive edge in online bidding.
          </motion.p>
        </div>
      </div>
    </>
  );
};

export default HeroFeatureTitle;
