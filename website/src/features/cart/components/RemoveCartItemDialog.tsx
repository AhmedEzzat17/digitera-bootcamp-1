"use client";

import { useEffect, useRef } from "react";
import type { CartLine } from "@/features/cart/types/cart.types";

type RemoveCartItemDialogProps = {
  line: CartLine;
  onCancel: () => void;
  onConfirm: () => void;
};

export function RemoveCartItemDialog({
  line,
  onCancel,
  onConfirm,
}: RemoveCartItemDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) {
      return;
    }

    dialog.showModal();
  }, []);

  const closeThen = (action: () => void) => {
    const dialog = dialogRef.current;
    if (dialog?.open) {
      dialog.close();
    }
    action();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="remove-cart-item-title"
      className="m-auto w-[min(calc(100%-2rem),28rem)] rounded-lg border border-[#ebe6de] bg-[#faf8f5] p-6 text-[#1a1a1a] shadow-[0px_8px_24px_0px_rgba(26,26,26,0.08)] backdrop:bg-[#1a1a1a]/40"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          closeThen(onCancel);
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        closeThen(onCancel);
      }}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2
            id="remove-cart-item-title"
            className="font-[family-name:var(--font-instrument-serif)] text-[32px] leading-[normal]"
          >
            Remove this fragrance?
          </h2>
          <p className="text-[14px] leading-[1.5] font-normal text-[#605a54]">
            {line.name} will be removed from your cart.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="flex-1 cursor-pointer rounded border border-[#ebe6de] bg-white py-3 text-[12px] leading-[normal] font-semibold tracking-wide text-[#1a1a1a] uppercase"
            onClick={() => closeThen(onCancel)}
          >
            Keep
          </button>
          <button
            type="button"
            className="flex-1 cursor-pointer rounded bg-[#1a1a1a] py-3 text-[12px] leading-[normal] font-semibold tracking-wide text-white uppercase"
            onClick={() => closeThen(onConfirm)}
          >
            Remove
          </button>
        </div>
      </div>
    </dialog>
  );
}
