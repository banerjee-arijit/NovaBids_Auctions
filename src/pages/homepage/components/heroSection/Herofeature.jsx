import { Gavel, ShieldCheck, Clock } from "lucide-react"; // Lucide icons

const features = [
  {
    name: "Real-time Bidding",
    description:
      "Place bids and watch the competition in real-time with instant updates, no page refresh needed!",
    icon: Gavel,
  },
  {
    name: "Secure Transactions",
    description:
      "All payments and user data are protected with advanced encryption and trusted payment gateways.",
    icon: ShieldCheck,
  },
  {
    name: "Scheduled Auctions",
    description:
      "Create or join timed auctions with automatic start and end, making the process seamless.",
    icon: Clock,
  },
];

export default function Herofeature() {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className=" max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-indigo-600">
                Power your auctions
              </h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                Smarter. Faster. Safer.
              </p>
              <p className="mt-6 text-lg/8 text-gray-600">
                Our platform makes it easy to buy and sell through secure,
                real-time auctions. Whether you're an individual or a business,
                everything you need is just a click away.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon
                        aria-hidden="true"
                        className="absolute top-1 left-1 size-5 text-indigo-600"
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
            src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
            width={2432}
            height={1442}
            className="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-228 md:-ml-4 lg:-ml-0"
          />
        </div>
      </div>
    </div>
  );
}
