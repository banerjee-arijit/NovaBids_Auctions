"use client";

import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import NavGettingStarted from "./NavGettingStarted";

export default function Navbar() {
  return (
    <div className="w-full flex items-center justify-between px-6 md:py-4 p-8 relative z-10">
      <Link
        to="/"
        className="flex items-center gap-2 text-xl font-bold text-primary z-10 max-sm:hidden"
      >
        <Rocket className="h-6 w-6 text-primary" />
        <span>NOVAbids</span>
      </Link>

      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <NavigationMenu>
          <NavigationMenuList className="flex items-center gap-4">
            <NavigationMenuItem>
              <NavGettingStarted />
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/docs">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Get Help
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/auth/register">
          <Button className="hidden md:inline-flex">Join Novabids</Button>
        </Link>
      </div>
    </div>
  );
}
