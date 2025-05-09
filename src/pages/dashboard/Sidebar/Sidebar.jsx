import React, { useState } from "react";
import { Home, Users, Book, LogIn, Settings, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const navItems = [
    { icon: <Home strokeWidth={1.5} />, path: "/dashboard", label: "Home" },
    { icon: <Users strokeWidth={1.5} />, path: "/meet_Team", label: "Team" },
    { icon: <Book strokeWidth={1.5} />, path: "/docs", label: "Docs" },
    { icon: <LogIn strokeWidth={1.5} />, path: "/auth", label: "Login" },
    {
      icon: <Settings strokeWidth={1.5} />,
      path: "/settings",
      label: "Settings",
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-screen bg-white/70 border-r border-gray-300 shadow-xl backdrop-blur-lg transition-all duration-300 hidden md:flex flex-col z-50",
          expanded ? "w-64" : "w-20"
        )}
      >
        <div className="relative h-full w-full">
          {/* Expander */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="absolute -right-3 top-12 bg-blue-100 p-1 rounded-full shadow-lg hover:bg-blue-200 transition-all z-20"
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 text-blue-600 transition-transform duration-200",
                expanded ? "rotate-180" : "rotate-0"
              )}
            />
          </button>

          {/* Logo */}
          <div className="p-5 h-20 flex items-center justify-center mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shadow">
              <span className="text-blue-600 font-bold text-xl">S</span>
            </div>
            {expanded && (
              <span className="text-blue-700 font-semibold ml-3 text-lg animate-fade-in">
                Dashboard
              </span>
            )}
          </div>

          {/* Navigation */}
          <div className="px-3 flex flex-col gap-2">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  to={item.path}
                  key={index}
                  className={cn(
                    "group relative flex items-center gap-4 px-3 py-3 rounded-md transition-all duration-200",
                    isActive
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <div
                    className={cn(
                      "flex-shrink-0 w-7 h-7 flex items-center justify-center",
                      isActive
                        ? "text-blue-700"
                        : "text-gray-500 group-hover:text-blue-600"
                    )}
                  >
                    {item.icon}
                  </div>

                  {expanded ? (
                    <span className="text-sm font-medium animate-fade-in">
                      {item.label}
                    </span>
                  ) : (
                    <div className="absolute left-full ml-2 bg-white border shadow-md text-gray-700 text-xs px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {item.label}
                    </div>
                  )}

                  {isActive && (
                    <span className="absolute inset-0 rounded-md border border-blue-200 animate-pulse pointer-events-none"></span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full h-16 bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-lg flex justify-around items-center z-50 md:hidden">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              to={item.path}
              key={index}
              className="relative flex flex-col items-center justify-center w-16"
            >
              {isActive && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-600"></div>
              )}

              <div
                className={cn(
                  "flex items-center justify-center h-9 w-9 rounded-md transition-all duration-200",
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-500"
                )}
              >
                {item.icon}
              </div>

              <span
                className={cn(
                  "text-xs mt-1 font-medium",
                  isActive ? "text-blue-600" : "text-gray-500"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Sidebar;
