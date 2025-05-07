"use client";

import {
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import NavListItem from "./NavListItem";

const components = [
  {
    title: "How to Login",
    href: "/docs/how-to-login",
    description:
      "Step-by-step guide to logging in securely to your Novabid account.",
  },
  {
    title: "How to Register",
    href: "/docs/how-to-register",
    description:
      "Create your Novabid account and get started with bidding in minutes.",
  },
  {
    title: "How to Place a Bid",
    href: "/docs/how-to-place-bid",
    description:
      "Learn how to participate in live auctions and place your first bid.",
  },
  {
    title: "How to Track Your Bids",
    href: "/docs/track-bids",
    description:
      "Easily monitor your ongoing and past bids with our tracking dashboard.",
  },
  {
    title: "How to Win an Auction",
    href: "/docs/how-to-win",
    description:
      "Tips and strategies to increase your chances of winning bids.",
  },
  {
    title: "How to Claim Your Winning Item",
    href: "/docs/claim-item",
    description:
      "Understand the steps to claim, pay for, and receive your winning auction items.",
  },
];

export default function NavComponents() {
  return (
    <div className="relative">
      <NavigationMenuTrigger>Get Tutorial</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
          {components.map((component) => (
            <NavListItem
              key={component.title}
              title={component.title}
              href={component.href}
            >
              {component.description}
            </NavListItem>
          ))}
        </ul>
      </NavigationMenuContent>
    </div>
  );
}
