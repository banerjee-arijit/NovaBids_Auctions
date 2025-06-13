import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/services/supabase";
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
import { sendAuctionWinEmail } from "@/services/email";

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
  const [leadingBidder, setLeadingBidder] = useState(null);

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
      await updateTimeLeft(auctionData.end_time);
    } catch (error) {
      console.error("Error in fetchAuctionDetails:", error);
      toast.error("Failed to fetch auction details");
    } finally {
      setLoading(false);
    }
  };

  const updateTimeLeft = async (endTime) => {
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
        try {
          // Update auction status
          const { error: auctionError } = await supabase
            .from("auctions")
            .update({ status: "ended" })
            .eq("id", id);

          if (auctionError) throw auctionError;

          // Fetch the winning bidder from leading_bidders table
          const { data: winningBidder, error: bidderError } = await supabase
            .from("leading_bidders")
            .select("*")
            .eq("auction_id", id)
            .single();

          if (bidderError) throw bidderError;

          if (winningBidder) {
            // Log winner details
            console.log("Auction Winner Details:", {
              name: winningBidder.bidder_name,
              email: winningBidder.bidder_email,
              winningAmount: winningBidder.bid_amount,
              auctionName: auction.name,
              auctionId: auction.id,
            });

            // Send email to winner
            try {
              await sendAuctionWinEmail(
                winningBidder.bidder_email,
                auction,
                winningBidder.bid_amount
              );
              console.log("Winner notification email sent successfully");
              toast.success("Winner notification email sent successfully");
            } catch (emailError) {
              console.error("Failed to send winner email:", emailError);
              toast.error("Failed to send winner notification email");
            }
          }

          toast.success("Auction has ended");
        } catch (error) {
          console.error("Error ending auction:", error);
          toast.error("Failed to update auction status");
        }
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

  // Function to fetch leading bidder from leading_bidders table
  const fetchLeadingBidder = async () => {
    try {
      const { data: leadingData, error: leadingError } = await supabase
        .from("leading_bidders")
        .select("bidder_name, bidder_email, bid_amount, bidder_id")
        .eq("auction_id", id)
        .single();

      // Log the leading bidder data
      console.log("Leading bidder data from table:", leadingData);

      if (leadingError) {
        if (leadingError.code === "PGRST116") {
          // No leading bidder found
          console.log("No leading bidder found in the table");
          setLeadingBidder(null);
          return;
        }
        throw leadingError;
      }

      if (leadingData) {
        console.log("Setting leading bidder:", {
          name: leadingData.bidder_name,
          email: leadingData.bidder_email,
          amount: leadingData.bid_amount,
          bidder_id: leadingData.bidder_id,
        });
        setLeadingBidder({
          name: leadingData.bidder_name,
          email: leadingData.bidder_email,
          amount: leadingData.bid_amount,
          bidder_id: leadingData.bidder_id,
        });
      } else {
        setLeadingBidder(null);
      }
    } catch (error) {
      console.error("Error fetching leading bidder:", error);
      toast.error("Failed to load leading bidder");
      setLeadingBidder(null);
    }
  };

  // Function to update leading bidder
  const updateLeadingBidder = async (bidderData) => {
    try {
      const { error } = await supabase.from("leading_bidders").upsert(
        {
          auction_id: id,
          bidder_id: bidderData.bidder_id,
          bid_amount: bidderData.amount,
          bidder_name: bidderData.name,
          bidder_email: bidderData.email,
        },
        {
          onConflict: "auction_id",
        }
      );

      if (error) {
        console.error("Error updating leading bidder:", error);
        // Don't throw error, just log it
        return;
      }
    } catch (error) {
      console.error("Error in updateLeadingBidder:", error);
      // Don't throw error, just log it
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

    // Log leading bidders table data
    const logLeadingBidders = async () => {
      const { data, error } = await supabase
        .from("leading_bidders")
        .select("*")
        .eq("auction_id", id);

      if (error) {
        console.error("Error fetching leading bidders:", error);
      } else {
        console.log("Leading bidders table data:", data);
      }
    };

    logLeadingBidders();
    fetchLeadingBidder();

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
        async (payload) => {
          console.log("Auction change received:", payload);
          if (payload.eventType === "DELETE") {
            toast.success("Auction has been deleted");
            navigate("/dashboard");
          } else if (payload.eventType === "UPDATE" && payload.new) {
            setAuction(payload.new);
            await updateTimeLeft(payload.new.end_time);
            if (payload.new.status === "ended") {
              setIsEnded(true);
              setTimeLeft("Auction ended");
              toast.success("Auction has ended");

              // Log leading bidder details when auction ends
              const { data: leadingBidderData, error } = await supabase
                .from("leading_bidders")
                .select("bidder_id, bidder_name")
                .eq("auction_id", id)
                .single();

              if (error) {
                console.log("Auction ended with no leading bidder:", null);
              } else {
                console.log("Auction ended! Leading bidder details:", {
                  bidder_id: leadingBidderData?.bidder_id || null,
                  bidder_name: leadingBidderData?.bidder_name || null,
                });
              }
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
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            // Fetch updated bids
            const { data: updatedBids, error: bidError } = await supabase
              .from("bids")
              .select(
                `
                *,
                profiles!bids_bidder_id_fkey (
                  first_name,
                  last_name,
                  email
                )
              `
              )
              .eq("auction_id", id)
              .order("amount", { ascending: false });

            if (!bidError && updatedBids && updatedBids.length > 0) {
              setBids(updatedBids);
              // Update leading bidder
              const topBid = updatedBids[0];
              const bidderData = {
                name: `${topBid.profiles.first_name} ${topBid.profiles.last_name}`,
                email: topBid.profiles.email,
                amount: topBid.amount,
                bidder_id: topBid.bidder_id,
              };
              setLeadingBidder(bidderData);
              await updateLeadingBidder(bidderData);
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
                  ? { ...bid, profiles: payload.new }
                  : bid
              )
            );
          }
        )
        .subscribe();
    }

    // Set up countdown timer
    const countdownInterval = setInterval(() => {
      if (auction?.end_time && !isEnded) {
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
  }, [id, user?.id, auction?.end_time, isEnded]);

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
        `Your bid must be higher than ₹${currentBid.toLocaleString()}`
      );
      return;
    }

    setBidding(true);
    try {
      // Check for existing bid
      const { data: existingBidData } = await supabase
        .from("bids")
        .select("id, amount")
        .eq("auction_id", id)
        .eq("bidder_id", user.id)
        .single();

      let result;
      if (existingBidData) {
        // Update existing bid
        result = await supabase
          .from("bids")
          .update({
            amount: bidAmountNum,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingBidData.id)
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
        })
        .eq("id", id);
      if (updateError) throw updateError;

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
        .eq("id", result.data.id)
        .single();

      if (bidError) throw bidError;

      // Update UI immediately
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

      // Update auction state
      setAuction((currentAuction) => ({
        ...currentAuction,
        current_bid: bidAmountNum,
      }));

      // Update leading bidder
      const bidderData = {
        name: `${userProfile?.first_name || ""} ${
          userProfile?.last_name || ""
        }`,
        email: userProfile?.email || user.email,
        amount: bidAmountNum,
        bidder_id: user.id,
      };
      setLeadingBidder(bidderData);
      await updateLeadingBidder(bidderData);

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
      // Check if user is logged in
      if (!user) {
        toast.error("Please log in to delete the auction");
        return;
      }

      // Check if user is the auction creator
      if (user.id !== auction.seller_id) {
        toast.error("Only the auction creator can delete this auction");
        return;
      }

      // Delete associated bids
      const { error: bidsError } = await supabase
        .from("bids")
        .delete()
        .eq("auction_id", id);

      if (bidsError) {
        console.error("Error deleting bids:", bidsError);
        throw new Error(`Failed to delete bids: ${bidsError.message}`);
      }

      // Delete leading bidder record
      const { error: leadingBidderError } = await supabase
        .from("leading_bidders")
        .delete()
        .eq("auction_id", id);

      if (leadingBidderError) {
        console.error("Error deleting leading bidder:", leadingBidderError);
        // Log error but continue with deletion
      }

      // Delete auction image from storage if exists
      if (auction?.image_url) {
        const imagePath = auction.image_url.split("/").pop();
        const { error: storageError } = await supabase.storage
          .from("auction-images")
          .remove([imagePath]);

        if (storageError) {
          console.error("Error deleting image:", storageError);
          // Log error but continue with deletion
        }
      }

      // Delete the auction
      const { error: auctionError } = await supabase
        .from("auctions")
        .delete()
        .eq("id", id)
        .eq("seller_id", user.id);

      if (auctionError) {
        console.error("Error deleting auction:", auctionError);
        throw new Error(`Failed to delete auction: ${auctionError.message}`);
      }

      // The real-time subscription will handle navigation to dashboard
      toast.success("Auction deleted successfully");
    } catch (error) {
      console.error("Error deleting auction:", error);
      toast.error(error.message || "Failed to delete auction");
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
                            ₹{currentBid.toLocaleString()}
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
                          ₹{(currentBid + 1).toLocaleString()}
                        </span>
                      </div>
                      {bidAmount && (
                        <div className="flex justify-between items-center text-sm mt-1">
                          <span>Your bid:</span>
                          <span className="font-semibold">
                            ₹{parseFloat(bidAmount).toLocaleString()}
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
                          ₹{(currentBid + 1).toLocaleString()}
                        </span>
                      </div>
                      {bidAmount && (
                        <div className="flex justify-between items-center text-sm mt-1">
                          <span>Your bid:</span>
                          <span className="font-semibold">
                            ₹{parseFloat(bidAmount).toLocaleString()}
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
                {leadingBidder ? (
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                        <User className="w-full h-full p-2 text-muted-foreground" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Crown className="h-3 w-3 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold truncate">
                          {leadingBidder.bidder_id === user?.id
                            ? "You"
                            : leadingBidder.name}
                        </p>
                        {leadingBidder.bidder_id === user?.id && (
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
                          ₹{leadingBidder.amount.toLocaleString()}
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
                                    src={`${userProfile.avatar_url}`}
                                    alt={`${userProfile.first_name} ${userProfile.last_name}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : bid.profiles?.avatar_url ? (
                                  <img
                                    src={`${bid.profiles.avatar_url}`}
                                    alt={`${bid.profiles.first_name} ${bid.profiles.last_name}`}
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
                                    : `${bid.profiles?.first_name || ""} ${
                                        bid.profiles?.last_name || ""
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
                              ₹{bid.amount.toLocaleString()}
                            </p>
                            {index > 0 && bids[index + 1] && (
                              <p className="text-xs text-muted-foreground">
                                +₹
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

      {/* Display leading bidder details */}
      {leadingBidder && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Current Leading Bidder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {leadingBidder.name}
              </p>
              <p>
                <strong>Email:</strong> {leadingBidder.email}
              </p>
              <p>
                <strong>Current Bid:</strong> ₹{leadingBidder.amount}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AuctionDetails;
