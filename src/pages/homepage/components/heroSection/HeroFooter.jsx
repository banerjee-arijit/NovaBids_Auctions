import { Button } from "@/components/ui/button";

const HeroFooter = () => {
  return (
    <div className="relative h-screen mt-60 bg-white">
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
            <Button>Lunch NovaBids</Button>
            <Button variant="outline">Contact Us</Button>
          </div>

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
