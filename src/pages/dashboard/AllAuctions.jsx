import React, { useState, useEffect } from "react";
import { supabase } from "@/SupabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import AuctionCard from "./AuctionCard";

const AllAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 5;

  const fetchAuctions = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      let query = supabase
        .from("auctions")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(
          `name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`
        );
      }

      // Add pagination
      const from = isLoadMore ? page * ITEMS_PER_PAGE : 0;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      if (isLoadMore) {
        setAuctions((prev) => [...prev, ...(data || [])]);
      } else {
        setAuctions(data || []);
      }

      // Check if there are more items to load
      setHasMore((data || []).length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching auctions:", error);
      toast.error("Failed to fetch auctions");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchAuctions();
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
    fetchAuctions(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">All Auctions</h1>
            <p className="text-gray-600 mt-1">
              Browse through all active auctions
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search auctions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-300 focus:border-black focus:ring-black"
              />
            </div>
            <Button
              type="submit"
              className="bg-black text-white hover:bg-gray-800"
            >
              Search
            </Button>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : auctions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No auctions found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllAuctions;
