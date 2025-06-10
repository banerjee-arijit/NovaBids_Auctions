import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import TabSwitcher from "@/components/Tabswitcher";
import AuctionCard from "./AuctionCard";
import BidderCard from "./BidderCard";
import { topBidders } from "@/data";
import { supabase } from "@/SupabaseClient";
import toast from "react-hot-toast";

const IndexPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const { data, error } = await supabase
        .from("auctions")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;

      setAuctions(data || []);
    } catch (error) {
      console.error("Error fetching auctions:", error);
      toast.error("Failed to load auctions");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      fetchAuctions();
      return;
    }

    try {
      const { data, error } = await supabase
        .from("auctions")
        .select("*")
        .or(
          `name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`
        )
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;

      setAuctions(data || []);
    } catch (error) {
      console.error("Error searching auctions:", error);
      toast.error("Failed to search auctions");
    }
  };

  return (
    <div className="ml-0 md:ml-20 min-h-screen">
      <div className="p-6 md:p-8 lg:p-10 ">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">All Auctions</h1>
            <p className="text-gray-600">Discover and bid on amazing items</p>
          </div>

          <div className="flex items-center justify-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                placeholder="Search auctions..."
                className="pl-10 pr-4 py-2 border-2 rounded-full w-full"
                value={searchQuery}
                onChange={handleSearch}
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    setSearchQuery("");
                    fetchAuctions();
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <Button variant="outline" className="rounded-full">
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

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64"></div>
                <div className="mt-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : auctions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No auctions found</p>
          </div>
        )}
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
