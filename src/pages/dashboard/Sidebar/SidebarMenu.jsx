import { useLocation, Link } from "react-router-dom";
import {
  Home,
  Search,
  Clock,
  Heart,
  DollarSign,
  User,
  Bell,
  Settings,
} from "lucide-react";

const SidebarMenu = ({ collapsed }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Clock, label: "Live Auctions", path: "live-auctions" },
    { icon: DollarSign, label: "My Bids", path: "my-bids" },
  ];

  const secondaryItems = [
    { icon: User, label: "Profile", path: "profile" },
    { icon: Bell, label: "Notifications", path: "notifications" },
    { icon: Settings, label: "Settings", path: "settings" },
  ];

  return (
    <nav className="flex-1 overflow-y-auto p-4">
      <ul className="space-y-2">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              to={item.path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "bg-novablue-50 text-novablue-600"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 pt-4 border-t border-gray-100">
        <h3
          className={`text-xs uppercase text-gray-500 mb-2 ${
            collapsed ? "text-center" : ""
          }`}
        >
          {!collapsed && "Account"}
        </h3>
        <ul className="space-y-2">
          {secondaryItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-novablue-50 text-novablue-600"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <item.icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default SidebarMenu;
