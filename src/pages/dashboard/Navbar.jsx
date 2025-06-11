import React, { useState, useEffect } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { supabase } from "@/SupabaseClient";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userInitial, setUserInitial] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error.message);
        setUserInitial(null);
        return;
      }

      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("first_name")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError.message);
          setUserInitial(null);
          return;
        }

        if (profileData && profileData.first_name) {
          const firstLetter = profileData.first_name.charAt(0).toUpperCase();
          setUserInitial(firstLetter);
        } else {
          setUserInitial(null);
        }
      } else {
        setUserInitial(null);
      }
    };

    fetchUser();
  }, []);

  const handleNavigate = () => navigate("/auth");

  return (
    <>
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Logo />

            {/* Right Icons */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="flex items-center space-x-2 mr-4">
                <button className="relative p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl transition-all duration-200 group">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="relative p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl transition-all duration-200 group">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-black text-white text-xs rounded-full flex items-center justify-center font-bold">
                    3
                  </span>
                </button>
              </div>

              {/* Profile Circle or Join Button */}
              {userInitial ? (
                <div className="bg-black text-white font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg shadow-md">
                  {userInitial}
                </div>
              ) : (
                <Button
                  className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-black"
                  onClick={handleNavigate}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Nova
                </Button>
              )}
            </div>

            {/* Mobile Controls */}
            <div className="lg:hidden flex items-center space-x-2">
              <button className="relative p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl transition-all duration-200">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-black rounded-full"></span>
              </button>

              <Button
                variant="outline"
                size="sm"
                onClick={toggleMenu}
                className="border-2 border-gray-300 hover:bg-black hover:text-white hover:border-black transition-all duration-300 rounded-xl"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-500 ease-in-out ${
            isMenuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-4 py-6 bg-white border-t border-gray-100">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search auctions..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Mobile Notifications */}
            <div className="flex items-center justify-center space-x-6 mb-6 py-4 bg-gray-50 rounded-xl">
              <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-black transition-colors duration-200">
                <Heart className="h-6 w-6" />
                <span className="text-xs font-medium">Favorites</span>
              </button>
              <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-black transition-colors duration-200 relative">
                <Bell className="h-6 w-6" />
                <span className="text-xs font-medium">Alerts</span>
                <span className="absolute -top-1 -right-2 h-4 w-4 bg-black text-white text-xs rounded-full flex items-center justify-center font-bold">
                  3
                </span>
              </button>
              <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-black transition-colors duration-200">
                <User className="h-6 w-6" />
                <span className="text-xs font-medium">Profile</span>
              </button>
            </div>

            {/* Mobile Join / Profile */}
            <div className="flex flex-col space-y-4">
              {userInitial ? (
                <div className="w-full flex justify-center">
                  <div className="bg-black text-white font-bold rounded-full w-12 h-12 flex items-center justify-center text-lg shadow-md">
                    {userInitial}
                  </div>
                </div>
              ) : (
                <Button
                  className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-black"
                  onClick={handleNavigate}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Nova
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
