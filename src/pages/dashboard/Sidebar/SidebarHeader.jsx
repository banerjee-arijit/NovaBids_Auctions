import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const SidebarHeader = ({ collapsed, setCollapsed }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100">
      {!collapsed ? (
        <Link to="/" className="flex items-center">
          <span className="font-bold text-xl text-gradient">NovaBid</span>
        </Link>
      ) : (
        <div className="mx-auto">
          <span className="font-bold text-xl text-gradient">N</span>
        </div>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </Button>
    </div>
  );
};

export default SidebarHeader;
