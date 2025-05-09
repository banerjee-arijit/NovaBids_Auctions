import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";

const SidebarFooter = ({ collapsed }) => {
  return (
    <div className="p-4 border-t border-gray-100">
      <Link
        to="/logout"
        className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <LogOut size={20} />
        {!collapsed && <span>Logout</span>}
      </Link>
    </div>
  );
};

export default SidebarFooter;
