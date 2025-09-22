import React, { useState } from "react";
import { Search, TrendingUp, X } from "lucide-react";
import { Box } from "@mui/material";

const SearchFilter = ({ search, setSearch, sortBy, setSortBy, status, setStatus }) => {
  const [focusedField, setFocusedField] = useState(null);

  const clearFilters = () => {
    setSearch("");
    setSortBy("");
    setStatus("");
  };

  const FilterPill = ({ children }) => (
    <span className="inline-flex justify-center items-center px-4 py-1 rounded-full text-xs font-medium border min-w-[100px] text-center bg-black/10 border-black/30">
      {children}
    </span>
  );

  return (
    <Box
      sx={{
        p: 2,
        mt: 2,
        mb: 5,
        borderRadius: 3,
        backgroundColor: "rgba(224, 223, 223, 0.46)",
        boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.2)",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search */}
        <div className="relative group">
          <label className="block text-sm font-medium text-black/90 mb-2">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-black/70" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setFocusedField("search")}
              onBlur={() => setFocusedField(null)}
              placeholder="Search by name..."
              className="w-full pl-12 pr-4 py-3 border rounded-xl shadow-sm bg-white/90"
            />
          </div>
        </div>

        {/* Status */}
        <div className="relative group">
          <label className="block text-sm font-medium text-black/90 mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full pl-4 pr-10 py-3 border rounded-xl shadow-sm bg-white/90"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="relative group">
          <label className="block text-sm font-medium text-black/90 mb-2">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full pl-4 pr-10 py-3 border rounded-xl shadow-sm bg-white/90"
          >
            <option value="">Choose sorting...</option>
            <option value="rateAsc">Rate: Low → High</option>
            <option value="rateDesc">Rate: High → Low</option>
            <option value="ratingDesc">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {(search || sortBy || status) && (
        <div className="mt-6 pt-4 border-t border-black/30 flex flex-wrap items-center gap-2 justify-between">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-black/80 font-medium">Active filters:</span>
            {search && <FilterPill>Search: {search}</FilterPill>}
            {sortBy && <FilterPill>Sort: {sortBy}</FilterPill>}
            {status && <FilterPill>Status: {status}</FilterPill>}
          </div>
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition"
          >
            <X className="w-4 h-4" /> Clear
          </button>
        </div>
      )}
    </Box>
  );
};

export default SearchFilter;
