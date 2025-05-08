"use client";

import {
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import NavListItem from "./NavListItem";

const components = [
  {
    title: "How to Login",
    to: "/docs",
    description:
      "Step-by-step guide to logging in securely to your Novabid account.",
  },
  {
    title: "How to Register",
    to: "/docs",
    description:
      "Create your Novabid account and get started with bidding in minutes.",
  },
  {
    title: "How to Place a Bid",
    to: "/docs",
    description:
      "Learn how to participate in live auctions and place your first bid.",
  },
  {
    title: "How to Track Your Bids",
    to: "/docs",
    description:
      "Easily monitor your ongoing and past bids with our tracking dashboard.",
  },
  {
    title: "How to Win an Auction",
    to: "/docs",
    description:
      "Tips and strategies to increase your chances of winning bids.",
  },
  {
    title: "How to Claim Your Winning Item",
    to: "/docs",
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
              to={component.to}
            >
              {component.description}
            </NavListItem>
          ))}
        </ul>
      </NavigationMenuContent>
    </div>
  );
}
