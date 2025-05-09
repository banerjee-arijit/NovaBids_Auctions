import SidebarHeader from "./SidebarHeader";
import SidebarCreateButton from "./SidebarCreateButton";
import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";

const Sidebar = ({ collapsed, setCollapsed, className = "" }) => {
  return (
    <div
      className={`bg-white border-r border-gray-200 transition-all duration-300 h-screen fixed left-0 top-0 z-40 ${
        collapsed ? "w-20" : "w-64"
      } ${className}`}
    >
      <div className="flex flex-col h-full">
        <SidebarHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <SidebarCreateButton collapsed={collapsed} />
        <SidebarMenu collapsed={collapsed} />
        <SidebarFooter collapsed={collapsed} />
      </div>
    </div>
  );
};

export default Sidebar;
