import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AuctionCard = ({ auction }) => {
  const {
    title,
    imageUrl,
    isLive,
    category,
    id,
    description,
    currentBid,
    timeLeft,
    bidCount,
  } = auction;
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200">
      <div className="relative w-full aspect-[16/10] bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* LIVE tag */}
        {isLive && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
            LIVE
          </div>
        )}

        {/* Category tag */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/90 text-xs px-3 py-1 rounded-full shadow-sm">
            {category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col gap-3">
        <Link to={`/auctions/${id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition">
            {title}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <div>
            <p className="text-xs">Current Bid</p>
            <p className="text-lg font-bold text-blue-600">${currentBid}</p>
          </div>
          <div className="text-right">
            <p className="text-xs">Time Left</p>
            <p className="font-medium">{timeLeft}</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">{bidCount} bids</span>
          <Link to={`/auctions/${id}`}>
            <Button
              variant="outline"
              className="rounded-full text-sm px-4 py-1 border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              Place Bid
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
