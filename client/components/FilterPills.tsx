'use client'

import { useState, type FC } from "react";
import { ChevronDown } from "lucide-react";
import { IPriceOption, ISortOption, PriceFilter, SortBy } from "../types";

interface FilterPillsProps {
  priceFilter: PriceFilter;
  sortFilter: SortBy;
  onPriceFilterChange: (filter: PriceFilter) => void;
  onSortFilterChange: (filter: SortBy) => void;
  priceOptions: readonly IPriceOption[];
  sortOptions: readonly ISortOption[];
}

interface PillDropdownProps {
  label: string;
  options: readonly (IPriceOption | ISortOption)[];
  selectedId: string;
  onSelect: (id: string) => void;
}

/*
font-family: Proxima Nova;
font-weight: 600;
font-style: Semibold;
font-size: 7px;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;


*/

const PillDropdown: FC<PillDropdownProps> = ({ label, options, selectedId, onSelect }) => {
  const [open, setOpen] = useState<boolean>(false);

  const isDefault: boolean = selectedId === options[0]?.id;
  const display: string = isDefault
    ? label
    : options.find((o) => o.id === selectedId)?.label ?? label;

  return (
    <div className="relative mt-4">
      {/* Trigger pill */}
      <button
        type="button"
        onClick={() => setOpen((prev: boolean) => !prev)}
        className="inline-flex items-center gap-1.5 border border-gray-300 rounded-sm bg-white px-3.5 py-1.5 text-sm text-gray-700 hover:border-gray-400 transition-colors w-full sm:w-auto justify-between sm:justify-start"
      >
        <span className="font-medium text-xs sm:text-sm font-[Proxima_Nova] font-semibold text-sm tracking-normal">{display}</span>
        <ChevronDown
          size={13}
          className={`text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {/* Click-away backdrop */}
      {open && <div className="fixed inset-0 z-[9]" onClick={() => setOpen(false)} />}

      {/* Menu */}
      {open && (
        <div className="absolute top-full left-0 mt-1.5 z-[10] w-full sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {options.map((opt) => {
            const active: boolean = opt.id === selectedId;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => { onSelect(opt.id); setOpen(false); }}
                className={`w-full text-left px-4 py-2 font-[Proxima_Nova] font-semibold text-sm tracking-normal transition-colors
                  ${active ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"}`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const FilterPills: FC<FilterPillsProps> = ({
  priceFilter,
  sortFilter,
  onPriceFilterChange,
  onSortFilterChange,
  priceOptions,
  sortOptions,
}) => {
  return (
    <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2.5 mb-4 sm:mb-5">
      <PillDropdown
        label="Price"
        options={priceOptions}
        selectedId={priceFilter}
        onSelect={(id: string) => onPriceFilterChange(id as PriceFilter)}
      />
      <PillDropdown
        label="Sort by"
        options={sortOptions}
        selectedId={sortFilter}
        onSelect={(id: string) => onSortFilterChange(id as SortBy)}
      />
    </div>
  );
};

export default FilterPills;