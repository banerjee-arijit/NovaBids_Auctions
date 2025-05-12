import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock } from "lucide-react";

const FeaturedAuction = ({ auction }) => {
  if (!auction) return null;

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4">Featured Live Auction</h2>

      <div className="bg-white rounded-2xl overflow-hidden shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center">
            <svg
              className="w-24 h-24 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          <div className="p-6 md:p-8 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-red-50 text-red-700 border-red-200 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                LIVE NOW
              </Badge>
              <div className="flex items-center text-sm text-gray-500">
                <Clock size={16} className="mr-1" />
                <span>{auction.timeLeft}</span>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-2">{auction.title}</h3>
            <p className="text-gray-600 mb-6">{auction.description}</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Current Bid</p>
                <p className="text-xl font-bold text-novablue-600">
                  ${auction.currentBid}
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Bids</p>
                <p className="text-xl font-bold">{auction.bidCount}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Category</p>
                <p className="text-xl font-bold">{auction.category}</p>
              </div>
            </div>

            <div className="mt-auto flex items-center gap-4">
              <Link to={`/live-auctions/${auction.id}`} className="flex-1">
                <Button className="w-full rounded-lg button-gradient text-white border-none">
                  Join Auction
                </Button>
              </Link>
              <Button variant="outline" className="rounded-lg">
                <MessageSquare size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedAuction;
