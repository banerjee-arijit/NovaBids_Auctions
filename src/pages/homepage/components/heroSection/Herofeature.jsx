import { Gavel, ShieldCheck, Clock } from "lucide-react";
import dashboard from "../../../../asserts/dashoard.png";
import HeroBanner from "./HeroBanner";

const features = [
  {
    name: "Live Bidding",
    description:
      "Experience real-time bidding with instant updates and live auction tracking, making every bid count!",
    icon: Gavel,
  },
  {
    name: "Secure Authentication",
    description:
      "Advanced security with multi-factor authentication and encrypted data protection for your peace of mind.",
    icon: ShieldCheck,
  },
  {
    name: "Modern Auction",
    description:
      "State-of-the-art auction platform with smart bidding features and seamless user experience.",
    icon: Clock,
  },
];

export default function Herofeature() {
  return (
    <div className="overflow-hidden bg-gray-900 py-24 sm:py-32">
      <div className="max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-indigo-400">
                Next-Gen Auction Platform
              </h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Live. Secure. Modern.
              </p>

              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-300 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-white">
                      <feature.icon
                        aria-hidden="true"
                        className="absolute top-1 left-1 size-5 text-indigo-400"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <img
            alt="Auction platform screenshot"
            src={dashboard}
            width={2432}
            height={1442}
            className="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-white/10 sm:w-228 md:-ml-4 lg:-ml-0"
          />
        </div>
      </div>
    </div>
  );
}
