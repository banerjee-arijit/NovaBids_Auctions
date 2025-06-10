import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import IndexPage from "./IndexPage";

const Dashboard = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex flex-1 ">
        <Sidebar />

        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 lg:p-8">
          <IndexPage />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
