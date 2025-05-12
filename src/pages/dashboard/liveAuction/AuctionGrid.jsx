import React from "react";
import LiveAuctionCard from "./LiveAuctionCard";

const AuctionGrid = ({ auctions, featuredAuction }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {auctions
      .filter((a) => a !== featuredAuction)
      .map((auction) => (
        <LiveAuctionCard key={auction.id} auction={auction} />
      ))}
  </div>
);

export default AuctionGrid;
