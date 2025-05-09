import { NavLink } from "react-router-dom";
import { Home, Clock, DollarSign, User, Bell, Settings } from "lucide-react";

const SidebarMenu = ({ collapsed }) => {
  const mainItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" }, // ✅ full path
    { icon: Clock, label: "Live Auctions", path: "/dashboard/live-auctions" },
    { icon: DollarSign, label: "My Bids", path: "/dashboard/my-bids" },
  ];

  const secondaryItems = [
    { icon: User, label: "Profile", path: "profile" },
    { icon: Bell, label: "Notifications", path: "notifications" },
    { icon: Settings, label: "Settings", path: "settings" },
  ];

  const baseClasses =
    "group flex items-center relative space-x-2 px-3 py-2 rounded-lg transition-all";

  const getLinkClasses = ({ isActive }) =>
    `${baseClasses} ${
      isActive
        ? "bg-blue-50 text-[var(--primary-text-color)]  "
        : "text-gray-700 border-transparent hover:bg-gray-100 hover:text-novablue-600"
    }`;

  const ActiveIndicator = () => (
    <div className="absolute right-2 h-2 w-2 bg-novablue-600 rounded-full" />
  );

  return (
    <nav className="flex-1 overflow-y-auto p-4">
      <ul className="space-y-2">
        {mainItems.map((item, index) => (
          <li key={index}>
            <NavLink to={item.path} className={getLinkClasses} end>
              <item.icon
                size={20}
                className="transition-transform group-hover:scale-110"
              />
              {!collapsed && <span>{item.label}</span>}
              {/* The NavLink "className" function passes a isActive flag */}
              {/*
                We can conditionally render the indicator by using the function prop form.
                This approach ensures that the indicator appears only when the link is active.
              */}
              {({ isActive }) => isActive && <ActiveIndicator />}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="mt-8 pt-4 border-t border-gray-100">
        {!collapsed && (
          <h3 className="text-xs uppercase text-gray-500 mb-2">Account</h3>
        )}
        <ul className="space-y-2">
          {secondaryItems.map((item, index) => (
            <li key={index}>
              <NavLink to={item.path} className={getLinkClasses} end>
                <item.icon
                  size={20}
                  className="transition-transform group-hover:scale-110"
                />
                {!collapsed && <span>{item.label}</span>}
                {({ isActive }) => isActive && <ActiveIndicator />}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default SidebarMenu;
