"use client";

import { cn } from "@/lib/utils/cn";
import { formatWholePrice } from "@/features/products/utils/product.utils";

export type VolumeChoice = {
  id: string;
  label: string;
  price: number;
};

export type VolumeGroup = {
  id: string;
  label: string;
  choices: VolumeChoice[];
};

type ProductOptionsProps = {
  groups: VolumeGroup[];
  selected: Record<string, string>;
  onChange: (groupId: string, choiceId: string) => void;
};

/** US-04: selectable product options. */
export function ProductOptions({
  groups,
  selected,
  onChange,
}: ProductOptionsProps) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-8">
      {groups.map((group) => (
        <div key={group.id} className="flex w-full flex-col items-start gap-3">
          <p className="text-[12px] leading-[normal] font-bold text-[#1a1a1a] uppercase">
            {group.label}
          </p>
          <div className="flex w-full items-start gap-3">
            {group.choices.map((choice) => {
              const isSelected = selected[group.id] === choice.id;

              return (
                <button
                  key={choice.id}
                  type="button"
                  aria-pressed={isSelected}
                  className={cn(
                    "flex min-w-0 flex-1 flex-col items-center gap-1 rounded p-3",
                    isSelected
                      ? "border-2 border-[#1a1a1a] bg-white"
                      : "border border-[#ebe6de]",
                  )}
                  onClick={() => onChange(group.id, choice.id)}
                >
                  <span
                    className={cn(
                      "text-[14px] leading-[normal] text-[#1a1a1a]",
                      isSelected ? "font-bold" : "font-medium",
                    )}
                  >
                    {choice.label}
                  </span>
                  <span className="text-[11px] leading-[normal] font-normal text-[#605a54]">
                    {formatWholePrice(choice.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
