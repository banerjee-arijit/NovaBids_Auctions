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
import { format } from "date-fns";

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
  const [userProfile, setUserProfile] = useState(null);

  // Fetch current user's profile
  const fetchUserProfile = async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, email")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to load user profile");
    }
  };

  // Fetch complete bid data with profile information
  const fetchBidsWithProfiles = async () => {
    try {
      const { data: bidsData, error: bidsError } = await supabase
        .from("bids")
        .select(
          `
          id,
          amount,
          created_at,
          updated_at,
          bidder_id,
          auction_id,
          profiles!bids_bidder_id_fkey (
            id,
            first_name,
            last_name,
            email
          )
        `
        )
        .eq("auction_id", id)
        .order("created_at", { ascending: false });

      if (bidsError) throw bidsError;
      return bidsData || [];
    } catch (error) {
      console.error("Error in fetchBidsWithProfiles:", error);
      toast.error("Failed to load bids");
      return [];
    }
  };

  // Fetch auction details
  const fetchAuctionDetails = async () => {
    try {
      setLoading(true);
      console.log("Fetching auction with ID:", id);

      // Fetch auction details
      const { data: auctionData, error: auctionError } = await supabase
        .from("auctions")
        .select("*")
        .eq("id", id)
        .single();

      if (auctionError) {
        console.error("Supabase error:", auctionError);
        if (auctionError.code === "PGRST116") {
          toast.error("Auction not found");
          navigate("/dashboard");
          return;
        }
        throw auctionError;
      }

      if (!auctionData) {
        console.log("No auction data found");
        toast.error("Auction not found");
        navigate("/dashboard");
        return;
      }

      setAuction(auctionData);

      // Fetch bids
      const bidsData = await fetchBidsWithProfiles();
      setBids(bidsData);

      console.log("Auction data received:", auctionData);
      updateTimeLeft(auctionData.end_time);
    } catch (error) {
      console.error("Error in fetchAuctionDetails:", error);
      toast.error("Failed to fetch auction details");
    } finally {
      setLoading(false);
    }
  };

  const updateTimeLeft = (endTime) => {
    if (!endTime) {
      setTimeLeft("Invalid end time");
      setIsEnded(true);
      return;
    }

    const end = new Date(endTime);
    const now = new Date();
    const timeLeftMs = end - now;

    if (timeLeftMs <= 0) {
      setIsEnded(true);
      setTimeLeft("Auction ended");
      if (auction?.status !== "ended") {
        supabase
          .from("auctions")
          .update({ status: "ended" })
          .eq("id", id)
          .then(({ error }) => {
            if (error) {
              console.error("Error ending auction:", error);
              toast.error("Failed to update auction status");
            } else {
              toast.success("Auction has ended");
            }
          });
      }
    } else {
      setIsEnded(false);
      const hours = Math.floor(timeLeftMs / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeftMs % (1000 * 60)) / 1000);
      const formattedHours = hours.toString().padStart(2, "0");
      const formattedMinutes = minutes.toString().padStart(2, "0");
      const formattedSeconds = seconds.toString().padStart(2, "0");
      setTimeLeft(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
    }
  };

  // Initial fetch and real-time subscription
  useEffect(() => {
    if (!id) {
      console.log("No auction ID provided");
      toast.error("Invalid auction ID");
      navigate("/dashboard");
      return;
    }

    console.log("Setting up auction details for ID:", id);

    // Fetch user profile and auction data
    fetchUserProfile();
    fetchAuctionDetails();

    // Create channels
    const auctionChannel = supabase.channel(`auction-updates:${id}`);
    const bidChannel = supabase.channel(`bid-updates:${id}`);
    const profileChannel = user?.id
      ? supabase.channel(`profile-updates:${user.id}`)
      : null;

    // Set up auction subscription
    auctionChannel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "auctions",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          console.log("Auction change received:", payload);
          if (payload.eventType === "DELETE") {
            toast.success("Auction has been deleted");
            navigate("/dashboard");
          } else if (payload.eventType === "UPDATE" && payload.new) {
            setAuction(payload.new);
            updateTimeLeft(payload.new.end_time);
            if (payload.new.status === "ended") {
              setIsEnded(true);
              setTimeLeft("Auction ended");
              toast.success("Auction has ended");
            }
          }
        }
      )
      .subscribe((status) => {
        console.log("Auction subscription status:", status);
        if (status === "SUBSCRIBED") {
          console.log("Successfully subscribed to auction updates");
        } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          toast.error("Lost real-time connection for auction updates");
        }
      });

    // Set up bid subscription
    bidChannel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bids",
          filter: `auction_id=eq.${id}`,
        },
        async (payload) => {
          console.log("Bid change received:", payload);

          // Fetch the complete bid data with profile information
          const { data: bidData, error: bidError } = await supabase
            .from("bids")
            .select(
              `
              id,
              amount,
              created_at,
              updated_at,
              bidder_id,
              auction_id,
              profiles!bids_bidder_id_fkey (
                id,
                first_name,
                last_name,
                email
              )
            `
            )
            .eq("id", payload.new.id)
            .single();

          if (bidError) {
            console.error("Error fetching bid data:", bidError);
            return;
          }

          if (payload.eventType === "INSERT") {
            // Update bids list
            setBids((currentBids) => {
              const existingBidIndex = currentBids.findIndex(
                (bid) => bid.id === bidData.id
              );
              if (existingBidIndex === -1) {
                return [bidData, ...currentBids].sort(
                  (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );
              }
              const updatedBids = [...currentBids];
              updatedBids[existingBidIndex] = bidData;
              return updatedBids.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
              );
            });

            // Update auction current bid
            setAuction((currentAuction) => ({
              ...currentAuction,
              current_bid: bidData.amount,
            }));

            // Show notification for new bid
            if (bidData.bidder_id !== user?.id) {
              toast.success(
                `New bid: $${bidData.amount.toLocaleString()} by ${`${
                  bidData.bidder?.first_name || ""
                } ${bidData.bidder?.last_name || ""}`}`
              );
            }
          } else if (payload.eventType === "UPDATE") {
            // Update bids list
            setBids((currentBids) =>
              currentBids
                .map((bid) => (bid.id === bidData.id ? bidData : bid))
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            );

            // Update auction current bid
            setAuction((currentAuction) => ({
              ...currentAuction,
              current_bid: bidData.amount,
            }));

            // Show notification for updated bid
            if (bidData.bidder_id !== user?.id) {
              toast.info(
                `Bid updated: $${bidData.amount.toLocaleString()} by ${`${
                  bidData.bidder?.first_name || ""
                } ${bidData.bidder?.last_name || ""}`}`
              );
            }
          } else if (payload.eventType === "DELETE") {
            // Remove deleted bid
            setBids((currentBids) =>
              currentBids.filter((bid) => bid.id !== payload.old.id)
            );

            // If the deleted bid was the highest bid, update the current bid
            if (payload.old.amount === auction.current_bid) {
              // Find the new highest bid
              const newHighestBid = Math.max(
                ...bids
                  .filter((bid) => bid.id !== payload.old.id)
                  .map((bid) => bid.amount)
              );

              setAuction((currentAuction) => ({
                ...currentAuction,
                current_bid: newHighestBid || currentAuction.initial_bid,
              }));
            }
          }
        }
      )
      .subscribe((status) => {
        console.log("Bid subscription status:", status);
        if (status === "SUBSCRIBED") {
          console.log("Successfully subscribed to bid updates");
        } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          toast.error("Lost real-time connection for bid updates");
        }
      });

    // Set up profile subscription if user exists
    if (profileChannel) {
      profileChannel
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "profiles",
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            console.log("Profile change received:", payload);
            setUserProfile(payload.new);
            setBids((currentBids) =>
              currentBids.map((bid) =>
                bid.bidder_id === user.id
                  ? { ...bid, bidder: payload.new }
                  : bid
              )
            );
          }
        )
        .subscribe();
    }

    // Set up countdown timer
    const countdownInterval = setInterval(() => {
      if (auction?.end_time) {
        updateTimeLeft(auction.end_time);
      }
    }, 1000);

    // Cleanup function
    return () => {
      console.log("Cleaning up subscriptions for auction:", id);
      auctionChannel.unsubscribe();
      bidChannel.unsubscribe();
      if (profileChannel) profileChannel.unsubscribe();
      clearInterval(countdownInterval);
    };
  }, [id, user?.id]); // Remove userProfile from dependencies

  // Place bid
  const handleBid = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to place a bid");
      return;
    }

    if (!bidAmount || isNaN(bidAmount) || parseFloat(bidAmount) <= 0) {
      toast.error("Please enter a valid bid amount");
      return;
    }

    const bidAmountNum = parseFloat(bidAmount);
    const currentBid = auction.current_bid || auction.initial_bid;
    if (bidAmountNum <= currentBid) {
      toast.error(
        `Your bid must be higher than $${currentBid.toLocaleString()}`
      );
      return;
    }

    setBidding(true);
    try {
      // Check for existing bid
      const { data: existingBid } = await supabase
        .from("bids")
        .select("id, amount")
        .eq("auction_id", id)
        .eq("bidder_id", user.id)
        .single();

      let result;
      if (existingBid) {
        // Update existing bid
        result = await supabase
          .from("bids")
          .update({
            amount: bidAmountNum,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingBid.id)
          .select()
          .single();
      } else {
        // Create new bid
        result = await supabase
          .from("bids")
          .insert([
            {
              auction_id: id,
              bidder_id: user.id,
              amount: bidAmountNum,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      // Update auction current_bid
      const { error: updateError } = await supabase
        .from("auctions")
        .update({
          current_bid: bidAmountNum,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (updateError) throw updateError;

      setBidAmount("");
      toast.success("Bid placed successfully!");
    } catch (error) {
      console.error("Error placing bid:", error);
      toast.error("Failed to place bid: " + error.message);
    } finally {
      setBidding(false);
    }
  };

  // Delete auction
  const deleteAuction = async () => {
    try {
      if (auction?.image_url) {
        const imagePath = auction.image_url.split("/").pop();
        const { error: storageError } = await supabase.storage
          .from("auction-images")
          .remove([imagePath]);
        if (storageError) throw storageError;
      }

      const { error: bidsError } = await supabase
        .from("bids")
        .delete()
        .eq("auction_id", id);
      if (bidsError) throw bidsError;

      const { error: auctionError } = await supabase
        .from("auctions")
        .delete()
        .eq("id", id);
      if (auctionError) throw auctionError;

      toast.success("Auction has been deleted");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting auction:", error);
      toast.error("Failed to delete auction: " + error.message);
    }
  };

  // Cleanup ended auctions
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

  // Calculate highest bid and bidder
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
              {user?.id === auction.seller_id && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={deleteAuction}
                  className="gap-2"
                >
                  Delete Auction
                </Button>
              )}
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

                    <form onSubmit={handleBid} className="space-y-3">
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

                    <form onSubmit={handleBid} className="space-y-3">
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
                      <div className="flex items-center gap-2">
                        <p className="font-semibold truncate">
                          {highestBidder.bidder_id === user?.id
                            ? "You"
                            : highestBidder.bidder?.username || "Anonymous"}
                        </p>
                        {highestBidder.bidder_id === user?.id && (
                          <Badge
                            variant="outline"
                            className="text-xs px-1.5 py-0.5 text-blue-600 border-blue-200"
                          >
                            You
                          </Badge>
                        )}
                      </div>
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
                      {bids.map((bid, index) => (
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
                                {bid.bidder_id === user?.id &&
                                userProfile?.avatar_url ? (
                                  <img
                                    src={userProfile.avatar_url}
                                    alt={userProfile.username}
                                    className="w-full h-full object-cover"
                                  />
                                ) : bid.bidder?.avatar_url ? (
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
                                  {bid.bidder_id === user?.id
                                    ? `${userProfile?.first_name || ""} ${
                                        userProfile?.last_name || ""
                                      }`
                                    : `${bid.bidder?.first_name || ""} ${
                                        bid.bidder?.last_name || ""
                                      }`}
                                </p>
                                {index === 0 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs px-1.5 py-0.5"
                                  >
                                    Leading
                                  </Badge>
                                )}
                                {bid.bidder_id === user?.id && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs px-1.5 py-0.5 text-blue-600 border-blue-200"
                                  >
                                    You
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
