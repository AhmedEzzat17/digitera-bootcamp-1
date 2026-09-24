import Link from "next/link";

type ProductPaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  previousHref?: string;
  nextHref?: string;
};

export function ProductPagination({
  page,
  pageSize,
  total,
  previousHref,
  nextHref,
}: ProductPaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const controlClassName =
    "inline-flex cursor-pointer items-center justify-center rounded border border-solid border-[#ebe6de] p-3";

  return (
    <div className="flex w-full items-center justify-center gap-4 pt-8 lg:pt-10">
      {previousHref ? (
        <Link href={previousHref} className={controlClassName} aria-label="Previous page">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/arrow-left.svg" alt="" width={14} height={14} />
        </Link>
      ) : (
        <button
          type="button"
          className={`${controlClassName} cursor-default opacity-40`}
          disabled
          aria-label="Previous page"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/arrow-left.svg" alt="" width={14} height={14} />
        </button>
      )}
      <p className="text-[13px] font-normal whitespace-nowrap text-[#605a54]">
        Page {page} of {pageCount}
      </p>
      {nextHref ? (
        <Link
          href={nextHref}
          className={`${controlClassName} bg-[#1a1a1a]`}
          aria-label="Next page"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/arrow-right.svg" alt="" width={14} height={14} />
        </Link>
      ) : (
        <button
          type="button"
          className={`${controlClassName} cursor-default bg-[#1a1a1a] opacity-40`}
          disabled
          aria-label="Next page"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/arrow-right.svg" alt="" width={14} height={14} />
        </button>
      )}
    </div>
  );
}
