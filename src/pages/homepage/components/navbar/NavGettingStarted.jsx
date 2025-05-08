"use client";

import {
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import NavListItem from "./NavListItem";
import { Rocket } from "lucide-react";

export default function NavGettingStarted() {
  return (
    <div className="relative">
      <NavigationMenuTrigger>Launch Novabid</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
          {/* Hero item */}
          <li className="row-span-3">
            <NavigationMenuLink asChild>
              <a
                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                href="/"
              >
                <Rocket className="h-6 w-6" />
                <div className="mb-2 mt-4 text-lg font-medium">
                  Join NovaBid
                </div>
                <p className="text-sm leading-tight text-muted-foreground">
                  Sign up and start bidding on exclusive items. Join thousands
                  of users today.
                </p>
              </a>
            </NavigationMenuLink>
          </li>

          {/* Internal Link */}
          <NavListItem title="Login or Signup" to="/auth">
            Access your Novabid dashboard by securely logging in or registering.
          </NavListItem>

          {/* External Video */}
          <NavListItem
            href="https://www.youtube.com/watch?v=AcYF18oGn6Y&ab_channel=CosdenSolutions"
            title="Watch Intro Video"
          >
            Get a quick overview of how Novabid works in under 2 minutes.
          </NavListItem>

          {/* Internal Link */}
          <NavListItem title="Meet Our Team" to="/meet_team">
            Learn about the passionate team behind Novabid.
          </NavListItem>
        </ul>
      </NavigationMenuContent>
    </div>
  );
}
