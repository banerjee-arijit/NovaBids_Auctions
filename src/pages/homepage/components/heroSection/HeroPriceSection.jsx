import React from "react";
import { Check } from "lucide-react";

const HeroPriceSection = () => {
  return (
    <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="mx-auto aspect-1155/678 w-288.75 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>

      {/* Heading */}
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base font-semibold text-indigo-600">
          Live Auction Plan
        </h2>
        <p className="mt-2 text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
          Experience Premium Live Auctions
        </p>
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-gray-600">
        Unlock all the best features for high-end, real-time auction experiences
        and direct seller interactions.
      </p>

      <div className="mx-auto mt-16 max-w-xl">
        <div className="bg-gray-900 rounded-3xl p-10 shadow-2xl ring-1 ring-gray-900/10">
          <h3 className="text-indigo-400 text-base font-semibold">
            Live Auction Access
          </h3>
          <p className="mt-4 text-white text-5xl font-semibold tracking-tight">
            Rs.650
          </p>
          <p className="mt-1 text-gray-400 text-base">/month</p>

          <p className="mt-6 text-gray-300 text-base">
            Ideal for creators and sellers who want real-time interaction and
            maximum reach through live auctions.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-gray-300">
            {[
              "Unlimited Live Auctions",
              "Extended Auction Duration",
              "Live Conference-Style Auctions",
              "Personal Talks with Buyers/Sellers",
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-x-3">
                <Check className="h-5 w-5 text-indigo-400" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <a
            href="#"
            className="mt-10 block rounded-md bg-indigo-500 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-400"
          >
            Start Live Auctions Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroPriceSection;
