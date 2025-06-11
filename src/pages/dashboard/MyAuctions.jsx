import React, { useState, useEffect } from "react";
import { supabase } from "@/SupabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Edit2, Trash2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import AuctionCard from "./AuctionCard";
import { useAuth } from "@/context/Authcontex";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const MyAuctions = () => {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [auctionToDelete, setAuctionToDelete] = useState(null);
  const ITEMS_PER_PAGE = 5;

  const fetchMyAuctions = async (isLoadMore = false) => {
    if (!user) return;

    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      let query = supabase
        .from("auctions")
        .select("*")
        .eq("seller_id", user.id)
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

      const { data, error } = await query;

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
      toast.error("Failed to fetch your auctions");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyAuctions();
    }
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchMyAuctions();
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
    fetchMyAuctions(true);
  };

  const handleDelete = async () => {
    if (!auctionToDelete) return;

    try {
      // First, delete the image from storage if it exists
      if (auctionToDelete.image_url) {
        // Extract the file path from the image URL
        const imagePath = auctionToDelete.image_url.split("/").pop();
        const filePath = `${user.id}/${imagePath}`;

        const { error: storageError } = await supabase.storage
          .from("auction-images")
          .remove([filePath]);

        if (storageError) {
          console.error("Error deleting image:", storageError);
          // Continue with auction deletion even if image deletion fails
        }
      }

      // Then delete the auction from the database
      const { error } = await supabase
        .from("auctions")
        .delete()
        .eq("id", auctionToDelete.id);

      if (error) throw error;

      // Remove the deleted auction from the state
      setAuctions((prev) => prev.filter((a) => a.id !== auctionToDelete.id));
      toast.success("Auction and associated image deleted successfully");
    } catch (error) {
      console.error("Error deleting auction:", error);
      toast.error("Failed to delete auction");
    } finally {
      setDeleteDialogOpen(false);
      setAuctionToDelete(null);
    }
  };

  const handleEdit = (auction) => {
    // Navigate to edit page with auction data
    window.location.href = `/dashboard/edit-auction/${auction.id}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Please Login</h2>
          <p className="text-gray-600">
            You need to be logged in to view your auctions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Auctions</h1>
            <p className="text-gray-600 mt-1">Manage and track your auctions</p>
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
                placeholder="Search your auctions..."
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

        {/* Auctions Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : auctions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No auctions found</p>
            <p className="text-gray-500 mt-2">
              Create your first auction to get started
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctions.map((auction) => (
                <div key={auction.id} className="relative group">
                  <AuctionCard auction={auction} />
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEdit(auction)}
                      className="bg-white hover:bg-gray-100"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setAuctionToDelete(auction);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
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

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                auction and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default MyAuctions;
