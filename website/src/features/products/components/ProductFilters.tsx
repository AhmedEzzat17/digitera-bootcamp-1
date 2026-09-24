"use client";

import { useEffect, useRef, useState } from "react";
import { useProductFilters } from "@/features/products/hooks/useProductFilters";
import type { ProductListQuery } from "@/features/products/types/product.types";
import {
  PRICE_FILTER_MAX,
  PRICE_FILTER_MIN,
  formatWholePrice,
} from "@/features/products/utils/product.utils";
import { cn } from "@/lib/utils/cn";

type FilterOption = {
  id: string;
  label: string;
};

type CheckboxTone = "gold" | "ink";

const CATEGORIES: FilterOption[] = [
  { id: "pure-extractions", label: "Pure Extractions" },
  { id: "private-reserve", label: "Private Reserve" },
  { id: "atelier-oils", label: "Atelier Oils" },
  { id: "discovery-vault", label: "Discovery Vault" },
];

const SCENT_FAMILIES: FilterOption[] = [
  { id: "floral", label: "Floral" },
  { id: "woody", label: "Woody" },
  { id: "oriental", label: "Oriental" },
  { id: "fresh", label: "Fresh" },
];

const OCCASIONS: FilterOption[] = [
  { id: "personal-use", label: "Personal Use" },
  { id: "wedding", label: "Wedding" },
  { id: "gift-sets", label: "Gift Sets" },
  { id: "birthday", label: "Birthday" },
];

function FilterCheckbox({
  option,
  checked,
  tone,
  onChange,
}: {
  option: FilterOption;
  checked: boolean;
  tone: CheckboxTone;
  onChange: () => void;
}) {
  return (
    <label className="flex w-full cursor-pointer items-center gap-2.5">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <span
        className={cn(
          "size-4 shrink-0 rounded-[2px] border border-solid border-[#ebe6de]",
          checked && tone === "gold" && "bg-[#c5a880]",
          checked && tone === "ink" && "bg-[#1a1a1a]",
          !checked && "bg-white",
        )}
      />
      <span className="text-[13px] font-normal whitespace-nowrap text-[#1a1a1a]">
        {option.label}
      </span>
    </label>
  );
}

function FilterBlock({
  title,
  options,
  selected,
  tone,
  onToggle,
}: {
  title: string;
  options: FilterOption[];
  selected: string[];
  tone: CheckboxTone;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-4">
      <p className="text-[12px] font-bold uppercase whitespace-nowrap text-[#1a1a1a]">
        {title}
      </p>
      <div className="flex w-full flex-col items-start gap-3">
        {options.map((option) => (
          <FilterCheckbox
            key={option.id}
            option={option}
            tone={tone}
            checked={selected.includes(option.id)}
            onChange={() => onToggle(option.id)}
          />
        ))}
      </div>
    </div>
  );
}

function FilterSearch({
  value,
  onSearch,
}: {
  value: string;
  onSearch: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  const onSearchRef = useRef(onSearch);
  const committedRef = useRef(value);
  onSearchRef.current = onSearch;

  useEffect(() => {
    if (value === committedRef.current) {
      return;
    }

    committedRef.current = value;
    setDraft(value);
  }, [value]);

  useEffect(() => {
    const next = draft.trim();

    if (next === value) {
      return;
    }

    const handle = window.setTimeout(() => {
      committedRef.current = next;
      onSearchRef.current(next);
    }, 300);

    return () => window.clearTimeout(handle);
  }, [draft, value]);

  return (
    <form
      className="flex w-full items-center gap-2 rounded-full border border-[#ebe6de] bg-white px-3 py-2"
      onSubmit={(event) => {
        event.preventDefault();
        const next = draft.trim();
        committedRef.current = next;
        onSearch(next);
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/search.svg" alt="" width={14} height={14} />
      <input
        name="search"
        value={draft}
        placeholder="Search fragrances..."
        aria-label="Search fragrances"
        className="w-full bg-transparent text-[12px] leading-[normal] text-[#1a1a1a] outline-none placeholder:text-[#605a54]"
        onChange={(event) => setDraft(event.target.value)}
      />
    </form>
  );
}

const PRICE_STEP = 10;

const rangeInputClassName =
  "pointer-events-none absolute inset-x-0 translate-y-1/2 top-[2px] h-4 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#c5a880] [&::-moz-range-thumb]:bg-white [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#c5a880] [&::-webkit-slider-thumb]:bg-white";


function PriceRangeFilter({
  minPrice,
  maxPrice,
  onChange,
}: {
  minPrice: number;
  maxPrice: number;
  onChange: (minPrice: number, maxPrice: number) => void;
}) {
  const [min, setMin] = useState(minPrice);
  const [max, setMax] = useState(maxPrice);
  const [dragging, setDragging] = useState(false);
  const minRef = useRef(minPrice);
  const maxRef = useRef(maxPrice);
  const span = PRICE_FILTER_MAX - PRICE_FILTER_MIN;
  const start = ((min - PRICE_FILTER_MIN) / span) * 100;
  const end = ((max - PRICE_FILTER_MIN) / span) * 100;

  useEffect(() => {
    if (dragging) {
      return;
    }

    minRef.current = minPrice;
    maxRef.current = maxPrice;
    setMin(minPrice);
    setMax(maxPrice);
  }, [dragging, maxPrice, minPrice]);

  const commit = () => {
    setDragging(false);
    onChange(minRef.current, maxRef.current);
  };

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <p className="text-[12px] font-bold uppercase whitespace-nowrap text-[#1a1a1a]">
        Price Range
      </p>
      <div className="flex w-full max-w-[260px] flex-col items-start gap-3 lg:max-w-none">
        <div className="relative flex h-4 w-full items-center">
          <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-[#ebe6de]" />
          <div
            className="absolute top-1/2 h-1 -translate-y-1/2 bg-[#c5a880]"
            style={{ left: `${start}%`, width: `${Math.max(end - start, 0)}%` }}
          />
          <input
            type="range"
            min={PRICE_FILTER_MIN}
            max={PRICE_FILTER_MAX}
            step={PRICE_STEP}
            value={min}
            aria-label="Minimum price"
            className={cn(rangeInputClassName, "price-range-input z-20")}
            style={{ transform: "translateY(calc(-50% - 8px))" }}
            onPointerDown={() => setDragging(true)}
            onChange={(event) => {
              const next = Math.min(Number(event.target.value), maxRef.current - PRICE_STEP);
              minRef.current = next;
              setMin(next);
            }}
            onPointerUp={commit}
            onKeyUp={commit}
          />
          <input
            type="range"
            min={PRICE_FILTER_MIN}
            max={PRICE_FILTER_MAX}
            step={PRICE_STEP}
            value={max}
            aria-label="Maximum price"
            className={cn(rangeInputClassName, "price-range-input z-30")}
            style={{ transform: "translateY(calc(-50% - 8px))" }}
            onPointerDown={() => setDragging(true)}
            onChange={(event) => {
              const next = Math.max(Number(event.target.value), minRef.current + PRICE_STEP);
              maxRef.current = next;
              setMax(next);
            }}
            onPointerUp={commit}
            onKeyUp={commit}
          />
        </div>
        <div className="flex w-full items-start justify-between text-[12px] font-normal whitespace-nowrap text-[#1a1a1a]">
          <p>{formatWholePrice(min)}</p>
          <p>{formatWholePrice(max)}</p>
        </div>
      </div>
    </div>
  );
}

export function ProductFilters({ query }: { query: ProductListQuery }) {
  const [open, setOpen] = useState(false);
  const {
    search,
    categories,
    scentFamilies,
    occasions,
    minPrice,
    maxPrice,
    setSearch,
    setPriceRange,
    toggleCategory,
    toggleScentFamily,
    toggleOccasion,
  } = useProductFilters(query);
  const priceActive = minPrice > PRICE_FILTER_MIN || maxPrice < PRICE_FILTER_MAX;
  const selectedCount =
    categories.length +
    scentFamilies.length +
    occasions.length +
    (priceActive ? 1 : 0) +
    (search ? 1 : 0);

  return (
    <aside className="w-full shrink-0 lg:w-[260px]">
      <button
        type="button"
        className="flex w-full items-center justify-between rounded border border-solid border-[#ebe6de] bg-white px-4 py-3 text-[12px] font-semibold uppercase text-[#1a1a1a] lg:hidden"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>
          Filters{selectedCount > 0 ? ` (${selectedCount})` : ""}
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/chevron-down.svg"
          alt=""
          width={14}
          height={14}
          className={cn("transition-transform", open && "rotate-180")}
        />
      </button>
      <div
        className={cn(
          "flex-col items-start gap-8",
          open ? "mt-6 flex" : "hidden",
          "lg:mt-0 lg:flex",
        )}
      >
        <FilterSearch value={search} onSearch={setSearch} />
        <div className="h-px w-full bg-[#ebe6de]" />
        <FilterBlock
          title="Category"
          options={CATEGORIES}
          selected={categories}
          tone="gold"
          onToggle={toggleCategory}
        />
        <div className="h-px w-full bg-[#ebe6de]" />
        <FilterBlock
          title="Scent Family"
          options={SCENT_FAMILIES}
          selected={scentFamilies}
          tone="ink"
          onToggle={toggleScentFamily}
        />
        <div className="h-px w-full bg-[#ebe6de]" />
        <FilterBlock
          title="Occasion"
          options={OCCASIONS}
          selected={occasions}
          tone="ink"
          onToggle={toggleOccasion}
        />
        <div className="h-px w-full bg-[#ebe6de]" />
        <PriceRangeFilter
          minPrice={minPrice}
          maxPrice={maxPrice}
          onChange={setPriceRange}
        />
      </div>
    </aside>
  );
}
