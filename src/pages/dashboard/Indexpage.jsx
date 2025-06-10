import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import TabSwitcher from "@/components/Tabswitcher";
import AuctionCard from "./AuctionCard";
import BidderCard from "./BidderCard";
import { dummyAuction } from "@/data";
import { topBidders } from "@/data";

const IndexPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="ml-0 md:ml-20 min-h-screen">
      {/* <Background /> */}
      <div className="p-6 md:p-8 lg:p-10 ">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">All Auctions</h1>
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
                className="pl-10 pr-4 py-2 border-2 rounded-full w-full"
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
        <div className="flex items-center justify-between mb-6">
          <TabSwitcher />
          <Button
            variant="link"
            className="text-sm text-blue-600 hover:underline"
          >
            View More
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {dummyAuction.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold mb-4">Top Bidders</h2>
          <Button
            variant="link"
            className="text-sm text-blue-600 hover:underline"
          >
            View More
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topBidders.map((bidder) => (
            <BidderCard key={bidder.id} bidder={bidder} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
