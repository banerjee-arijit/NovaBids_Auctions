import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, Users, Gavel } from "lucide-react";

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
    <div className="group bg-card rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-border hover:border-primary/20 transform hover:-translate-y-1 max-w-sm mx-auto">
      {/* Image Section */}
      <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground bg-gradient-to-br from-muted to-muted/50">
            <svg
              className="w-16 h-16 opacity-40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* LIVE indicator */}
        {isLive && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center shadow-lg backdrop-blur-sm">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            LIVE
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-background/95 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1.5 rounded-full shadow-sm border border-border/50">
            {category}
          </span>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <Link to={`/auctions/${id}`} className="block group">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-tight">
            {title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
          {description}
        </p>

        {/* Bid Information */}
        <div className="bg-muted/30 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Current Bid
              </p>
              <p className="text-2xl font-bold text-primary flex items-center">
                <Gavel className="w-5 h-5 mr-1" />${currentBid.toLocaleString()}
              </p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Time Left
              </p>
              <p className="font-semibold text-foreground flex items-center justify-end">
                <Clock className="w-4 h-4 mr-1" />
                {timeLeft}
              </p>
            </div>
          </div>

          {/* Bid count and action */}
          <div className="flex justify-between items-center pt-3 border-t border-border/50">
            <span className="text-xs text-muted-foreground font-medium flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {bidCount} {bidCount === 1 ? "bid" : "bids"}
            </span>
            <Link to={`/auctions/${id}`}>
              <Button
                size="sm"
                className="rounded-full font-semibold px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200"
              >
                Place Bid
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
