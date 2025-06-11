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
    <Card
      onClick={handleNavigate}
      className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
    >
      <div className="relative">
        <img
          src={auction.image_url || "https://via.placeholder.com/300x200"}
          alt={auction.name || "Auction image"}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {auction.is_live && timeLeft !== "Ended" && (
          <Badge variant="destructive" className="absolute top-2 left-2 gap-1">
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></div>
            LIVE
          </Badge>
        )}
        {timeLeft !== "Ended" && isEndingSoon() && (
          <Badge
            variant="outline"
            className="absolute top-2 right-2 gap-1 text-orange-600 border-orange-200"
          >
            <Clock className="h-3 w-3" />
            ENDING SOON
          </Badge>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg truncate">{auction.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span>Current Bid: ${currentBid.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>Time Left: {timeLeft}</span>
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation(); // So button doesn't trigger full card click again
            handleNavigate();
          }}
          className="w-full mt-2"
          disabled={timeLeft === "Ended"}
        >
          {timeLeft === "Ended" ? "Auction Ended" : "View Auction"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuctionCard;
