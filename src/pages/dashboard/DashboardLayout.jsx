import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";

const DashboardLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      {/* Fixed Sidebar */}
      <div
        style={{
          width: "250px",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <Sidebar />
      </div>

      <div style={{ marginLeft: "250px", padding: "1rem", flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
