import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

const eventTypes = [
  { value: "", label: "All Types" },
  { value: "hackathon", label: "Hackathon" },
  { value: "workshop", label: "Workshop" },
  { value: "seminar", label: "Seminar" },
  { value: "fest", label: "Fest" },
  { value: "other", label: "Other" },
];

export default function SearchFilters({ filters, onFiltersChange }) {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters =
    filters.city ||
    filters.college ||
    filters.department ||
    filters.event_type;

  const clearFilters = () => {
    onFiltersChange({
      keyword: "",
      city: "",
      college: "",
      department: "",
      event_type: "",
    });
  };

  return (
    <div className="space-y-4">

      {/* 🔍 Search Bar */}
      <div className="flex gap-3">

        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

          <input
            type="text"
            placeholder="Search events..."
            value={filters.keyword}
            onChange={(e) => updateFilter("keyword", e.target.value)}
            className="w-full h-12 pl-10 pr-3 bg-gray-800 text-white border border-gray-700 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`h-12 px-4 rounded-xl border flex items-center gap-2 text-sm ${
            showFilters || hasActiveFilters
              ? "bg-purple-500/20 border-purple-500 text-purple-400"
              : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>

        {/* Clear Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="h-12 px-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* 🔽 Filters Panel */}
      {showFilters && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-gray-900 border border-gray-700 rounded-xl">

          {/* City */}
          <input
            placeholder="City"
            value={filters.city}
            onChange={(e) => updateFilter("city", e.target.value)}
            className="p-2 bg-gray-800 text-white border border-gray-700 rounded-lg"
          />

          {/* College */}
          <input
            placeholder="College"
            value={filters.college}
            onChange={(e) => updateFilter("college", e.target.value)}
            className="p-2 bg-gray-800 text-white border border-gray-700 rounded-lg"
          />

          {/* Department */}
          <input
            placeholder="Department"
            value={filters.department}
            onChange={(e) => updateFilter("department", e.target.value)}
            className="p-2 bg-gray-800 text-white border border-gray-700 rounded-lg"
          />

          {/* Event Type */}
          <select
            value={filters.event_type}
            onChange={(e) => updateFilter("event_type", e.target.value)}
            className="p-2 bg-gray-800 text-white border border-gray-700 rounded-lg"
          >
            {eventTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

        </div>
      )}
    </div>
  );
}