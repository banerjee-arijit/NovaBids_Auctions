import React from "react";

const HeroFooter = () => {
  return (
    <div className="relative h-screen mt-60 bg-white">
      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        <div className="max-w-3xl text-center">
          <h1 className="mb-8 text-4xl tracking-tight sm:text-6xl lg:text-7xl text-gray-900">
            Your Next Great{" "}
            <span className="text-[var(--primary-text-color)]">Auction</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
            Build your perfect auction with ease. Our platform lets you create
            and participate in auctions like never before—secure, seamless, and
            customizable.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button className="rounded-lg px-6 py-3 font-medium bg-[#0ea5e9] text-white hover:bg-[#38bdf8] transition">
              Get Started
            </button>
            <button className="rounded-lg border px-6 py-3 font-medium border-gray-300 bg-white text-gray-800 hover:bg-gray-100 transition">
              Learn More
            </button>
          </div>

          {/* Contact Email */}
          <p className="text-sm text-gray-500">
            Contact us at{" "}
            <a
              href="mailto:arijitbanerjee873@gmail.com"
              className="text-blue-500 hover:underline"
            >
              arijitbanerjee873@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroFooter;
