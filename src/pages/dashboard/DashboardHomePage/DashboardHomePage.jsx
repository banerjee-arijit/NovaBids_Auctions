import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import TabSwitcher from "./TabSwitcher";
import AuctionCard from "./AuctionCard";
import AuctionData from "../../../static/AuctionData";

const DashboardHomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="ml-0 md:ml-20 min-h-screen">
      <div className="p-6 md:p-8 lg:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Auctions</h1>
            <p className="text-gray-600">Discover and bid on amazing items</p>
          </div>

          <div className="flex items-center justify-center gap-3   w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                placeholder="Search auctions..."
                className="pl-10 pr-4 py-2 rounded-full w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              )}
            </div>

            <Button variant="outline" className="rounded-full ">
              <SlidersHorizontal size={18} className="mr-2" />
              Filters
            </Button>
          </div>
        </div>
        <TabSwitcher />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {AuctionData.map((value) => (
            <AuctionCard key={value.id} auction={value} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;
