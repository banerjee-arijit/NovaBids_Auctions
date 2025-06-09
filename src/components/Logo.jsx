import React from "react";
import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center space-x-4">
      <Link
        to="/"
        className="flex items-center gap-2 text-xl font-bold text-primary z-10 "
      >
        <Rocket className="h-6 w-6 text-primary" />
        <span>NOVAbids</span>
      </Link>
    </div>
  );
};

export default Logo;
