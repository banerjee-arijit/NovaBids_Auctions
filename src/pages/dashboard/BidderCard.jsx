const BidderCard = ({ bidder }) => {
  return (
    <div className="border rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition">
      <img
        src={bidder.avatar}
        alt={bidder.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <h3 className="font-semibold text-lg">{bidder.name}</h3>
        <p className="text-sm text-gray-500">Bids: {bidder.totalBids}</p>
        <p className="text-sm text-gray-500">Top Bid: {bidder.highestBid}</p>
      </div>
    </div>
  );
};
export default BidderCard;
