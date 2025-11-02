"use client";

interface FAQSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function FAQSearchBar({ searchQuery, onSearchChange }: FAQSearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      {/* Glassmorphism Effect */}
      <div className="flex items-center backdrop-blur-md bg-white/10 rounded-lg px-4 py-3 border border-white/20 shadow-lg">
        <svg
          className="w-5 h-5 text-white mr-3 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 bg-transparent text-white placeholder-gray-300 outline-none"
        />
      </div>
    </div>
  );
}

