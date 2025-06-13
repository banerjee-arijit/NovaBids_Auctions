import React, { useState, useEffect } from "react";
import { Search, Shield, Wallet, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import TabSwitcher from "@/components/common/TabSwitcher";
import AuctionCard from "./AuctionCard";
import { supabase } from "@/services/supabase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/Authcontex";
import Logo from "@/components/common/Logo";

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
    <div className="ml-0 md:ml-20 min-h-screen flex flex-col">
      <div className="flex-grow">
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

          <div className="mt-20 mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Coming Soon</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <div className="flex items-center mb-4">
                  <Shield className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold">AI Fraud Detection</h3>
                </div>
                <p className="text-gray-600">
                  Advanced AI-powered system to detect and prevent fraudulent
                  activities, ensuring a secure bidding environment for all
                  users.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <div className="flex items-center mb-4">
                  <Wallet className="w-8 h-8 text-green-600 mr-3" />
                  <h3 className="text-xl font-semibold">Integrated Wallet</h3>
                </div>
                <p className="text-gray-600">
                  Secure digital wallet system for seamless transactions,
                  supporting multiple payment methods and instant deposits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-50 border-t border-gray-200 py-8 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row md:justify-between md:items-center">
            <div className="flex flex-col items-center md:items-start space-y-2">
              <Logo />
              <span className="text-gray-600 text-sm">© 2025 NovaBids</span>
            </div>

            <div className="text-gray-600 text-sm text-center md:text-left">
              <p className="flex flex-wrap justify-center md:justify-start items-center gap-x-1">
                Created by{" "}
                <a
                  href="https://www.linkedin.com/in/arijitbanerjee123"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium hover:text-blue-700 transition-colors"
                >
                  Arijit Banerjee
                </a>
                ,{" "}
                <a
                  href="https://www.linkedin.com/in/debaratisarkar456"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium hover:text-blue-700 transition-colors"
                >
                  Debarati Sarkar
                </a>
                , and{" "}
                <a
                  href="https://www.linkedin.com/in/tanmaydeb007"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium hover:text-blue-700 transition-colors"
                >
                  Tanmay Debnath
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IndexPage;
