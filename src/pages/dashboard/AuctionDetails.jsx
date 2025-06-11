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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Clock,
  DollarSign,
  User,
  Gavel,
  Users,
  Calendar,
  Tag,
  AlertCircle,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  ArrowLeft,
  Crown,
  Timer,
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
  const [bidding, setBidding] = useState(false);

  // Fetch auction details
  const fetchAuctionDetails = async () => {
    try {
      console.log("Fetching auction with ID:", id);
      const { data, error } = await supabase
        .from("auctions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      console.log("Auction data:", data);
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
    const timeLeft = end - now;

    if (timeLeft <= 0) {
      setIsEnded(true);
      setTimeLeft("Auction ended");
    } else {
      setIsEnded(false);
      setTimeLeft(formatDistanceToNow(end, { addSuffix: true }));
    }
  };

  // Place bid
  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to place a bid");
      return;
    }

    const bidAmountNum = parseFloat(bidAmount);
    if (isNaN(bidAmountNum) || bidAmountNum <= 0) {
      toast.error("Please enter a valid bid amount");
      return;
    }

    setBidding(true);
    try {
      console.log("Placing bid:", {
        auctionId: id,
        bidderId: user.id,
        amount: bidAmountNum,
      });

      const { data, error } = await supabase
        .from("bids")
        .insert([
          {
            auction_id: id,
            bidder_id: user.id,
            amount: bidAmountNum,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error placing bid:", error);
        throw error;
      }

      console.log("Bid placed successfully:", data);

      // Update auction's current bid
      const { error: updateError } = await supabase
        .from("auctions")
        .update({ current_bid: bidAmountNum })
        .eq("id", id);

      if (updateError) {
        console.error("Error updating auction current bid:", updateError);
        throw updateError;
      }

      toast.success("Bid placed successfully!");
      setBidAmount("");
      fetchAuctionDetails(); // Refresh auction details
    } catch (error) {
      console.error("Error in handlePlaceBid:", error);
      toast.error("Failed to place bid");
    } finally {
      setBidding(false);
    }
  };

  useEffect(() => {
    fetchAuctionDetails();
    const interval = setInterval(() => {
      if (auction) {
        updateTimeLeft(auction.end_time);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-foreground mx-auto"></div>
          <p className="text-muted-foreground animate-pulse">
            Loading auction details...
          </p>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-6">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Auction Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The auction you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/dashboard")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
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
  const timeLeftInMs = new Date(auction.end_time) - new Date();
  const urgency = timeLeftInMs < 86400000; // Less than 24 hours

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate max-w-[300px] sm:max-w-none">
                  {auction.name}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant="secondary">{auction.category}</Badge>
                  {auction.is_live && !isEnded && (
                    <Badge variant="destructive" className="gap-1">
                      <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></div>
                      LIVE
                    </Badge>
                  )}
                  {urgency && !isEnded && (
                    <Badge
                      variant="outline"
                      className="gap-1 text-orange-600 border-orange-200"
                    >
                      <Timer className="h-3 w-3" />
                      ENDING SOON
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Save</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image and Current Bid */}
            <Card>
              <div className="relative aspect-video bg-muted overflow-hidden rounded-t-lg">
                {auction.image_url ? (
                  <img
                    src={auction.image_url}
                    alt={auction.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <Tag className="h-16 w-16" />
                  </div>
                )}

                {/* Current Bid Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <Card className="bg-background/95 backdrop-blur-sm border">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Current Bid
                          </p>
                          <p className="text-2xl sm:text-3xl font-bold">
                            ${currentBid.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground mb-1">
                            Time Left
                          </p>
                          <p
                            className={`text-lg font-semibold ${
                              urgency ? "text-destructive" : ""
                            }`}
                          >
                            {timeLeft}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </Card>

            {/* Description and Details */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  {auction.description}
                </p>

                <Separator />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg border">
                    <Clock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Time Left</p>
                    <p
                      className={`text-sm ${
                        urgency
                          ? "text-destructive font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {timeLeft}
                    </p>
                  </div>

                  <div className="text-center p-3 rounded-lg border">
                    <Users className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Total Bids</p>
                    <p className="text-sm text-muted-foreground">
                      {bids.length}
                    </p>
                  </div>

                  <div className="text-center p-3 rounded-lg border">
                    <Calendar className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Ends</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(auction.end_time), "MMM d, h:mm a")}
                    </p>
                  </div>

                  <div className="text-center p-3 rounded-lg border">
                    <User className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Seller</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {auction.username}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Bidding Section */}
            <div className="lg:hidden">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gavel className="h-5 w-5" />
                    Place Your Bid
                  </CardTitle>
                  <CardDescription>
                    Enter your bid amount to participate in this auction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <div className="flex justify-between items-center text-sm">
                        <span>Minimum bid:</span>
                        <span className="font-semibold">
                          ${(currentBid + 1).toLocaleString()}
                        </span>
                      </div>
                      {bidAmount && (
                        <div className="flex justify-between items-center text-sm mt-1">
                          <span>Your bid:</span>
                          <span className="font-semibold">
                            ${parseFloat(bidAmount).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <form onSubmit={handlePlaceBid} className="space-y-3">
                      <Input
                        type="number"
                        placeholder="Enter bid amount"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        min={currentBid + 1}
                        step="0.01"
                        disabled={isEnded || bidding}
                        className="text-lg h-12"
                      />
                      <Button
                        type="submit"
                        disabled={isEnded || bidding}
                        className="w-full h-12 text-lg gap-2"
                      >
                        {bidding ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                            Placing Bid...
                          </>
                        ) : isEnded ? (
                          "Auction Ended"
                        ) : (
                          <>
                            <Gavel className="h-5 w-5" />
                            Place Bid
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Desktop Bidding Section */}
            <div className="hidden lg:block">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gavel className="h-5 w-5" />
                    Place Your Bid
                  </CardTitle>
                  <CardDescription>
                    Enter your bid amount to participate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <div className="flex justify-between items-center text-sm">
                        <span>Minimum bid:</span>
                        <span className="font-semibold">
                          ${(currentBid + 1).toLocaleString()}
                        </span>
                      </div>
                      {bidAmount && (
                        <div className="flex justify-between items-center text-sm mt-1">
                          <span>Your bid:</span>
                          <span className="font-semibold">
                            ${parseFloat(bidAmount).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <form onSubmit={handlePlaceBid} className="space-y-3">
                      <Input
                        type="number"
                        placeholder="Enter bid amount"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        min={currentBid + 1}
                        step="0.01"
                        disabled={isEnded || bidding}
                        className="text-lg h-12"
                      />
                      <Button
                        type="submit"
                        disabled={isEnded || bidding}
                        className="w-full h-12 text-lg gap-2"
                      >
                        {bidding ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                            Placing Bid...
                          </>
                        ) : isEnded ? (
                          "Auction Ended"
                        ) : (
                          <>
                            <Gavel className="h-5 w-5" />
                            Place Bid
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Leading Bidder */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5" />
                  Leading Bidder
                </CardTitle>
              </CardHeader>
              <CardContent>
                {highestBidder ? (
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                        {highestBidder.bidder?.avatar_url ? (
                          <img
                            src={highestBidder.bidder.avatar_url}
                            alt={highestBidder.bidder.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-full h-full p-2 text-muted-foreground" />
                        )}
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Crown className="h-3 w-3 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">
                        {highestBidder.bidder?.username || "Anonymous"}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bold">
                          ${highestBidder.amount.toLocaleString()}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          Leading
                        </Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Gavel className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="font-medium">No bids yet</p>
                    <p className="text-sm">Be the first to place a bid!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bid History */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Bid History
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {bids.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-80">
                  {bids.length > 0 ? (
                    <div className="space-y-1 p-4">
                      {bids
                        .sort(
                          (a, b) =>
                            new Date(b.created_at) - new Date(a.created_at)
                        )
                        .map((bid, index) => (
                          <div
                            key={bid.id}
                            className={`flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-muted/50 ${
                              index === 0
                                ? "bg-muted/30 border-l-2 border-primary"
                                : ""
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="relative flex-shrink-0">
                                <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
                                  {bid.bidder?.avatar_url ? (
                                    <img
                                      src={bid.bidder.avatar_url}
                                      alt={bid.bidder.username}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <User className="w-full h-full p-1.5 text-muted-foreground" />
                                  )}
                                </div>
                                {index === 0 && (
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                    <TrendingUp className="h-2.5 w-2.5 text-primary-foreground" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-sm truncate">
                                    {bid.bidder?.username || "Anonymous"}
                                  </p>
                                  {index === 0 && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs px-1.5 py-0.5"
                                    >
                                      Leading
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {format(
                                    new Date(bid.created_at),
                                    "MMM d, h:mm a"
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p
                                className={`font-bold text-sm ${
                                  index === 0 ? "text-primary" : ""
                                }`}
                              >
                                ${bid.amount.toLocaleString()}
                              </p>
                              {index > 0 && bids[index + 1] && (
                                <p className="text-xs text-muted-foreground">
                                  +$
                                  {(
                                    bid.amount - bids[index + 1].amount
                                  ).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="font-medium mb-1">No bids yet</p>
                      <p className="text-sm">
                        This auction is waiting for its first bid!
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;
