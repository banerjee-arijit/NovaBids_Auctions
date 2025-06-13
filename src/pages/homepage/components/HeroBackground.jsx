import { useEffect, useState } from "react";

const HeroBackground = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0  overflow-hidden pointer-events-none rounded-md">
      {/* Top right decoration */}
      <div
        className={`absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-bl from-blue-400/20 to-purple-500/20 blur-3xl transform transition-opacity duration-1000 ease-in-out ${
          isVisible ? "opacity-70" : "opacity-0"
        }`}
      />

      {/* Bottom left decoration */}
      <div
        className={`absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-tr from-blue-400/10 to-purple-500/10 blur-3xl transform transition-opacity duration-1000 ease-in-out delay-300 ${
          isVisible ? "opacity-70" : "opacity-0"
        }`}
      />

      {/* Floating elements */}
      <div className="absolute inset-0">
        {/* Auction item 1 */}
        <div
          className={`absolute top-1/4 right-[15%] h-12 w-12 rounded-lg bg-gradient-to-br from-purple-400/30 to-blue-500/30 shadow-xl backdrop-blur-md transform transition-all duration-1000 ease-out ${
            isVisible ? "opacity-70 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{
            transitionDelay: "400ms",
            animation: isVisible
              ? "float 8s ease-in-out infinite alternate"
              : "none",
          }}
        />

        {/* Auction item 2 */}
        <div
          className={`absolute bottom-1/3 left-[20%] h-14 w-14 rounded-full bg-gradient-to-bl from-blue-400/30 to-cyan-500/30 shadow-xl backdrop-blur-md transform transition-all duration-1000 ease-out ${
            isVisible ? "opacity-70 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{
            transitionDelay: "600ms",
            animation: isVisible
              ? "float 10s ease-in-out infinite alternate-reverse"
              : "none",
          }}
        />

        {/* Auction item 3 */}
        <div
          className={`absolute top-2/3 right-[25%] h-10 w-10 rotate-45 bg-gradient-to-tr from-amber-400/30 to-orange-500/30 shadow-xl backdrop-blur-md transform transition-all duration-1000 ease-out ${
            isVisible ? "opacity-70 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{
            transitionDelay: "800ms",
            animation: isVisible
              ? "float 12s ease-in-out infinite alternate"
              : "none",
          }}
        />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-slate-200/70 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
    </div>
  );
};

export default HeroBackground;
