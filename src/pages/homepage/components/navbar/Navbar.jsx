import React, { useState } from "react";
import {
  Rocket,
  UserPlus,
  Play,
  Menu,
  X,
  Bell,
  Search,
  Heart,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/common/Logo";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/auth");
  };

  return (
    <>
      {/* Main Navbar */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Artistic Logo */}
            <Logo />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
