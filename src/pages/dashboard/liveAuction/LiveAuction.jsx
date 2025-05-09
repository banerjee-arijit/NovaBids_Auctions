import React from "react";
import TabSwitcher from "../dashboardIndexPage/TabSwitcher";

const LiveAuction = () => {
  return (
    <div className="ml-20 min-h-screen">
      <div className="p-6 md:p-8 lg:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center">
              <h1 className="text-3xl font-bold">Live Auctions</h1>
              <div className="ml-3 flex items-center bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                LIVE
              </div>
            </div>
            <p className="text-gray-600">Happening right now</p>
          </div>
        </div>
        <TabSwitcher />
      </div>
    </div>
  );
};

export default LiveAuction;
