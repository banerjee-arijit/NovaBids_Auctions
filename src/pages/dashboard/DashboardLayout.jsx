import { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(true);

  const sidebarWidth = collapsed ? "5rem" : "16rem";

  return (
    <div style={{ display: "flex" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        style={{
          marginLeft: sidebarWidth,
          padding: "1rem",
          transition: "margin-left 0.3s ease",
          flex: 1,
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
