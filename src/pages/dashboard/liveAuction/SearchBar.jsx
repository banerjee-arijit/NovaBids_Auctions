import React from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <div className="relative w-full md:w-64">
    <Search
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      size={18}
    />
    <Input
      placeholder="Search live auctions..."
      className="pl-10 rounded-full"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    {searchQuery && (
      <button
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        onClick={() => setSearchQuery("")}
      >
        <X size={16} />
      </button>
    )}
  </div>
);

export default SearchBar;
