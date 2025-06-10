export const dummyAuction = [
  {
    id: 1,
    title: "iPhone 14 Pro Max - 256GB",
    imageUrl:
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=250&fit=crop",
    isLive: true,
    category: "Electronics",
    description:
      "Brand new iPhone 14 Pro Max with 1 year warranty. Perfect condition, includes original box and accessories.",
    currentBid: 1200,
    timeLeft: "2h 30m",
    bidCount: 14,
  },
  {
    id: 2,
    title: "Vintage Leather Jacket",
    imageUrl:
      "https://images.unsplash.com/photo-1601758123927-8f0b1c5d3c4e?w=400&h=250&fit=crop",
    isLive: true,
    category: "Fashion",
    description:
      "Genuine leather jacket from the 80s, in excellent condition. Size M.",
    currentBid: 350,
    timeLeft: "1d 12h",
    bidCount: 8,
  },
  {
    id: 3,
    title: "Canon EOS R5 Camera",
    imageUrl:
      "https://images.unsplash.com/photo-1593642532973-d31b65e0d9a6?w=400&h=250&fit=crop",
    isLive: false,
    category: "Photography",
    description:
      "High-end mirrorless camera with 45MP sensor, perfect for professional photography.",
    currentBid: 2500,
    timeLeft: "Ended",
    bidCount: 22,
  },
];

export const recentlySold = [
  {
    id: 1,
    title: "Samsung Galaxy S22 Ultra",
    imageUrl:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52d1?w=400&h=250&fit=crop",
    finalPrice: "$1100",
    buyer: "Jane Smith",
  },
  {
    id: 2,
    title: "Sony PlayStation 5",
    imageUrl:
      "https://images.unsplash.com/photo-1606813902917-0a7365e30a08?w=400&h=250&fit=crop",
    finalPrice: "$650",
    buyer: "David Johnson",
  },
  {
    id: 3,
    title: "MacBook Pro 2021 - M1",
    imageUrl:
      "https://images.unsplash.com/photo-1610563166150-77a89f3aaf67?w=400&h=250&fit=crop",
    finalPrice: "$1850",
    buyer: "Alex Turner",
  },
];

export const topBidders = [
  {
    id: 1,
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=3",
    totalBids: 58,
    highestBid: "$2300",
  },
  {
    id: 2,
    name: "Emily Carter",
    avatar: "https://i.pravatar.cc/150?img=5",
    totalBids: 47,
    highestBid: "$1900",
  },
  {
    id: 3,
    name: "Michael Lee",
    avatar: "https://i.pravatar.cc/150?img=8",
    totalBids: 35,
    highestBid: "$1700",
  },
];
