"use client";

interface FilterOption {
  label: string;
  value: string;
}

interface BeritaFilterSectionProps {
  filter: string;
  filterOptions: FilterOption[];
  onFilterChange: (value: string) => void;
}

export default function BeritaFilterSection({
  filter,
  filterOptions,
  onFilterChange,
}: BeritaFilterSectionProps) {
  return (
    <div className="flex justify-center gap-8 mb-10">
      {filterOptions.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onFilterChange(opt.value)}
          className={`text-lg font-semibold pb-1 border-b-2 transition-colors duration-200 ${
            filter === opt.value
              ? "border-white text-white"
              : "border-transparent text-gray-400 hover:text-yellow-500"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

