import React, { useState } from "react";
import TabSwitcher from "../dashboardIndexPage/TabSwitcher";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import AuctionData from "../../../static/AuctionData";
import FeaturedAuction from "./FeaturedAuction";
import AuctionCard from "../dashboardIndexPage/AuctionCard";

const LiveAuction = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const liveAuctions = AuctionData.filter((auction) => auction.isLive);

  const filteredAuctions = liveAuctions.filter((auction) => {
    const matchesSearch =
      auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auction.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    return (
      matchesSearch &&
      auction.category.toLowerCase() === activeTab.toLowerCase()
    );
  });

  const featuredAuction = liveAuctions[0];

  return (
    <div className="min-h-screen ">
      <div className=" min-h-screen">
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

            <div className="relative w-full md:w-64">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Search live auctions..."
                className="pl-10 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <TabSwitcher onTabChange={setActiveTab} />

          {featuredAuction && <FeaturedAuction auction={featuredAuction} />}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuctions
              .filter((auction) => auction !== featuredAuction)
              .map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveAuction;
