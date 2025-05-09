import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SidebarCreateButton = ({ collapsed }) => {
  return (
    <div className="p-4">
      <Link to="/create-auction">
        <Button className="w-full rounded-full button-gradient text-white border-none flex items-center gap-2">
          <Plus size={16} />
          {!collapsed && <span>Create Auction</span>}
        </Button>
      </Link>
    </div>
  );
};

export default SidebarCreateButton;
