import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import TabSwitcher from "@/components/common/TabSwitcher";
import AuctionCard from "./AuctionCard";
import { supabase } from "@/services/supabase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/Authcontex";

const IndexPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch auctions
  const fetchAuctions = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("auctions")
        .select("*")
        .order("created_at", { ascending: false });

      // Only show active auctions
      query = query.eq("status", "active");

      if (activeTab === "live") {
        query = query.eq("is_live", true);
      }

      if (searchQuery) {
        query = query.or(
          `name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;

      // Filter out ended auctions
      const currentTime = new Date();
      const activeAuctions = (data || []).filter((auction) => {
        const endTime = new Date(auction.end_time);
        return endTime > currentTime;
      });

      setAuctions(activeAuctions);
    } catch (error) {
      console.error("Error fetching auctions:", error);
      toast.error("Failed to fetch auctions");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and real-time subscription
  useEffect(() => {
    fetchAuctions();

    // Set up real-time subscription for auctions
    const auctionChannel = supabase
      .channel("auctions-all")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "auctions",
        },
        (payload) => {
          console.log("Real-time auction change:", {
            event: payload.eventType,
            new: payload.new,
            old: payload.old,
          });
          setAuctions((prevAuctions) => {
            const currentTime = new Date();
            if (payload.eventType === "INSERT") {
              // Add new auction if it matches the active tab and search query
              const endTime = new Date(payload.new.end_time);
              if (
                endTime > currentTime &&
                payload.new.status === "active" &&
                (activeTab !== "live" || payload.new.is_live) &&
                (!searchQuery ||
                  payload.new.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  payload.new.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  payload.new.category
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()))
              ) {
                return [payload.new, ...prevAuctions];
              }
            } else if (payload.eventType === "UPDATE") {
              // Update existing auction
              return prevAuctions
                .map((auction) =>
                  auction.id === payload.new.id ? payload.new : auction
                )
                .filter((auction) => {
                  const endTime = new Date(auction.end_time);
                  return endTime > currentTime && auction.status === "active";
                });
            } else if (payload.eventType === "DELETE") {
              // Remove deleted auction
              return prevAuctions.filter(
                (auction) => auction.id !== payload.old.id
              );
            }
            return prevAuctions;
          });
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
        if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          toast.error("Lost real-time connection. Reconnecting...");
        }
      });

    // Cleanup subscription
    return () => {
      console.log("Cleaning up auctions subscription");
      auctionChannel.unsubscribe();
    };
  }, [activeTab, searchQuery]);

  // Cleanup ended auctions on component mount
  useEffect(() => {
    const cleanupEndedAuctions = async () => {
      try {
        const { error } = await supabase.rpc("cleanup_ended_auctions");
        if (error) throw error;
      } catch (error) {
        console.error("Error cleaning up ended auctions:", error);
      }
    };
    cleanupEndedAuctions();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAuctions();
  };

  return (
    <div className="ml-0 md:ml-20 min-h-screen">
      <div className="p-6 md:p-8 lg:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">All Auctions</h1>
            <p className="text-gray-600">Discover and bid on amazing items</p>
          </div>

          <div className="flex items-center justify-center gap-3 w-full md:w-auto">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search auctions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-gray-300 focus:border-black focus:ring-black"
              />
              <Button
                type="submit"
                className="bg-black text-white hover:bg-gray-800"
              >
                Search
              </Button>
            </form>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
          <Button
            variant="link"
            onClick={() => navigate("all-auctions")}
            className="text-sm text-blue-600 hover:underline"
          >
            View More
          </Button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Showing: {activeTab === "live" ? "Live Auctions" : "All Auctions"}
        </p>

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
      </div>
    </div>
  );
};

export default IndexPage;
