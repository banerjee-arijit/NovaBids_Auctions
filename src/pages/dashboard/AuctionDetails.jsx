import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/SupabaseClient";
import { useAuth } from "@/context/Authcontex";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  DollarSign,
  User,
  Gavel,
  Users,
  Calendar,
  Tag,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

const AuctionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [bids, setBids] = useState([]);
  const [timeLeft, setTimeLeft] = useState("");
  const [isEnded, setIsEnded] = useState(false);

  // Fetch auction details
  const fetchAuctionDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("auctions")
        .select(
          `
          *,
          bids (
            id,
            amount,
            created_at,
            bidder_id,
            bidder:profiles (
              username,
              avatar_url
            )
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;

      setAuction(data);
      setBids(data.bids || []);
      updateTimeLeft(data.end_time);
    } catch (error) {
      console.error("Error fetching auction:", error);
      toast.error("Failed to fetch auction details");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Update time left
  const updateTimeLeft = (endTime) => {
    const end = new Date(endTime);
    const now = new Date();
    const timeLeft = formatDistanceToNow(end, { addSuffix: true });
    setIsEnded(now > end);
    setTimeLeft(timeLeft);
  };

  // Place bid
  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to place a bid");
      navigate("/auth");
      return;
    }

    if (!auction) return;

    const bid = parseFloat(bidAmount);
    if (isNaN(bid) || bid <= 0) {
      toast.error("Please enter a valid bid amount");
      return;
    }

    if (bid <= (auction.current_bid || auction.initial_bid)) {
      toast.error("Your bid must be higher than the current bid");
      return;
    }

    try {
      const { error } = await supabase.from("bids").insert([
        {
          auction_id: id,
          bidder_id: user.id,
          amount: bid,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      // Update auction's current bid
      const { error: updateError } = await supabase
        .from("auctions")
        .update({ current_bid: bid })
        .eq("id", id);

      if (updateError) throw updateError;

      toast.success("Bid placed successfully!");
      setBidAmount("");
      fetchAuctionDetails(); // Refresh auction details
    } catch (error) {
      console.error("Error placing bid:", error);
      toast.error("Failed to place bid");
    }
  };

  useEffect(() => {
    fetchAuctionDetails();
    // Update time left every minute
    const interval = setInterval(() => {
      if (auction) {
        updateTimeLeft(auction.end_time);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Auction Not Found</h2>
          <p className="text-gray-600 mb-4">
            The auction you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const currentBid = auction.current_bid || auction.initial_bid;
  const highestBid =
    bids.length > 0 ? Math.max(...bids.map((bid) => bid.amount)) : currentBid;
  const highestBidder =
    bids.length > 0 ? bids.find((bid) => bid.amount === highestBid) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Auction Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image and Basic Info */}
            <Card>
              <div className="relative aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                {auction.image_url ? (
                  <img
                    src={auction.image_url}
                    alt={auction.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <Tag className="h-16 w-16" />
                  </div>
                )}
                {auction.is_live && !isEnded && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-semibold px-3 py-1.5 rounded-full flex items-center shadow-lg">
                    <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                    LIVE
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{auction.name}</h1>
                    <Badge variant="outline" className="mb-4">
                      {auction.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Current Bid</p>
                    <p className="text-2xl font-bold text-primary">
                      ${currentBid.toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">{auction.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">
                      {isEnded ? "Auction Ended" : timeLeft}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">
                      {bids.length} {bids.length === 1 ? "bid" : "bids"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">
                      Ends{" "}
                      {format(
                        new Date(auction.end_time),
                        "MMM d, yyyy 'at' h:mm a"
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">
                      Seller: {auction.username}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bidding Section */}
            <Card>
              <CardHeader>
                <CardTitle>Place Your Bid</CardTitle>
                <CardDescription>
                  Enter your bid amount to participate in this auction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePlaceBid} className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="Enter bid amount"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        min={currentBid + 1}
                        step="0.01"
                        disabled={isEnded}
                        className="text-lg"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isEnded}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Gavel className="h-4 w-4 mr-2" />
                      Place Bid
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Minimum bid: ${(currentBid + 1).toLocaleString()}
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Bids History */}
          <div className="space-y-6">
            {/* Highest Bidder */}
            <Card>
              <CardHeader>
                <CardTitle>Highest Bidder</CardTitle>
              </CardHeader>
              <CardContent>
                {highestBidder ? (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                      {highestBidder.bidder?.avatar_url ? (
                        <img
                          src={highestBidder.bidder.avatar_url}
                          alt={highestBidder.bidder.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-full h-full p-2 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {highestBidder.bidder?.username || "Anonymous"}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${highestBidder.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No bids yet</p>
                )}
              </CardContent>
            </Card>

            {/* Bids History */}
            <Card>
              <CardHeader>
                <CardTitle>Bid History</CardTitle>
                <CardDescription>Recent bids on this auction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bids.length > 0 ? (
                    bids
                      .sort(
                        (a, b) =>
                          new Date(b.created_at) - new Date(a.created_at)
                      )
                      .map((bid) => (
                        <div
                          key={bid.id}
                          className="flex items-center justify-between py-2 border-b last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                              {bid.bidder?.avatar_url ? (
                                <img
                                  src={bid.bidder.avatar_url}
                                  alt={bid.bidder.username}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="w-full h-full p-1.5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">
                                {bid.bidder?.username || "Anonymous"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {format(
                                  new Date(bid.created_at),
                                  "MMM d, h:mm a"
                                )}
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold text-primary">
                            ${bid.amount.toLocaleString()}
                          </p>
                        </div>
                      ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No bids yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;
