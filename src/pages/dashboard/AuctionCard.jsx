import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const AuctionCard = ({ auction }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const navigate = useNavigate();

  const updateTimeLeft = () => {
    const end = new Date(auction.end_time);
    const now = new Date();
    const diff = end - now;

    if (diff <= 0) {
      setTimeLeft("Ended");
    } else {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }
  };

  useEffect(() => {
    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [auction.end_time]);

  const handleNavigate = () => {
    navigate(`/dashboard/auction/${auction.id}`);
  };

  const isEndingSoon = () => {
    const end = new Date(auction.end_time);
    const now = new Date();
    return end - now < 86400000; // less than 24 hrs
  };

  const currentBid = auction.current_bid || auction.initial_bid || 0;

  return (
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer bg-gradient-to-br from-white via-gray-50/50 to-white backdrop-blur-sm relative">
      {/* Animated gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg blur-xl"></div>

      <div
        onClick={handleNavigate}
        className="relative bg-white rounded-lg overflow-hidden"
      >
        <div className="relative overflow-hidden">
          <img
            src={auction.image_url || "https://via.placeholder.com/300x200"}
            alt={auction.name || "Auction image"}
            className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          {/* Live badge with enhanced styling */}
          {auction.is_live && timeLeft !== "Ended" && (
            <Badge className="absolute top-4 left-4 gap-2 bg-red-500/90 hover:bg-red-500 text-white border-0 backdrop-blur-sm px-3 py-1.5 shadow-lg">
              <div className="relative">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-2 h-2 bg-white rounded-full animate-ping"></div>
              </div>
              LIVE
            </Badge>
          )}

          {/* Ending soon badge with enhanced styling */}
          {timeLeft !== "Ended" && isEndingSoon() && (
            <Badge className="absolute top-4 right-4 gap-2 bg-orange-500/90 hover:bg-orange-500 text-white border-0 backdrop-blur-sm px-3 py-1.5 shadow-lg">
              <Clock className="h-3 w-3 animate-pulse" />
              ENDING SOON
            </Badge>
          )}

          {/* Auction ended overlay */}
          {timeLeft === "Ended" && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
              <Badge className="bg-gray-800/90 text-white px-6 py-2 text-base font-semibold border-0">
                AUCTION ENDED
              </Badge>
            </div>
          )}
        </div>

        <CardHeader className="pb-3 pt-6 px-6">
          <CardTitle className="text-xl font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-300">
            {auction.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6 pb-6 space-y-4">
          {/* Current bid with enhanced styling */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Current Bid</p>
                <p className="text-xl font-bold text-green-700">
                  ₹{currentBid.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Time left with enhanced styling */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Time Left</p>
                <p
                  className={`text-xl font-bold ${
                    timeLeft === "Ended"
                      ? "text-gray-500"
                      : isEndingSoon()
                      ? "text-orange-600"
                      : "text-blue-700"
                  }`}
                >
                  {timeLeft}
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced button */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate();
            }}
            className={`w-full py-3 text-base font-semibold transition-all duration-300 rounded-xl ${
              timeLeft === "Ended"
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-zinc-900 to-neutral-800 text-white hover:from-zinc-800 hover:to-neutral-700 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            }`}
            disabled={timeLeft === "Ended"}
          >
            {timeLeft === "Ended" ? "Auction Ended" : "View Auction Details"}
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};

export default AuctionCard;
