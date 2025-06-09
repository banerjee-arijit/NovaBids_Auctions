import React, { useState } from "react";
import {
  Plus,
  Radio,
  Grid3X3,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const menuItems = [
    { icon: Plus, label: "Create Auction", active: false },
    { icon: Radio, label: "Live Auctions", active: true },
    { icon: Grid3X3, label: "All Auctions", active: false },
    { icon: User, label: "My Auctions", active: false },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden  lg:flex flex-col bg-white border-r border-gray-200 shadow-md transition-all duration-500 ${
          isCollapsed ? "w-20" : "w-72"
        } h-screen sticky top-0 z-40`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="bg-black p-2 rounded-xl">
                <Grid3X3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-800">Dashboard</span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSidebar}
            className="border border-gray-300 text-gray-700 hover:bg-black hover:text-white rounded-xl p-2 transition-all duration-300"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`flex items-center w-full space-x-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                  item.active
                    ? "bg-black text-white shadow"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 ${
                    item.active ? "text-white" : "text-gray-500"
                  }`}
                />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings */}
        <div className="border-t border-gray-200 p-4">
          <button className="flex items-center space-x-4 w-full text-gray-700 hover:bg-gray-100 px-4 py-3 rounded-xl transition-all duration-300">
            <Settings className="h-5 w-5 text-gray-500" />
            {!isCollapsed && (
              <span className="text-sm font-medium">Settings</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50">
        <div className="flex items-center justify-around px-3 py-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`flex flex-col items-center px-3 py-1 rounded-xl text-xs transition-all duration-200 ${
                item.active
                  ? "text-black font-semibold"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              <item.icon className="h-5 w-5 mb-1" />
              {item.label.split(" ")[0]}
            </button>
          ))}
          <button className="flex flex-col items-center px-3 py-1 text-gray-600 hover:text-black text-xs">
            <Settings className="h-5 w-5 mb-1" />
            Settings
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
