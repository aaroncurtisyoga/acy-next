"use client";

import { FC } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/app/_lib/utils";
import { track } from "@vercel/analytics";

interface PaginationProps {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
}

const Pagination: FC<PaginationProps> = ({
  page,
  totalPages,
  urlParamName,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onClick = (btnType: string) => {
    const pageValue = btnType === "next" ? Number(page) + 1 : Number(page) - 1;

    track("pagination", {
      action: btnType === "next" ? "next_page" : "previous_page",
      from_page: Number(page),
      to_page: pageValue,
      total_pages: totalPages,
    });

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || "page",
      value: pageValue.toString(),
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-6 mb-4">
      <button
        onClick={() => onClick("prev")}
        disabled={Number(page) <= 1}
        className="flex items-center px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-default-100 hover:bg-default-200 dark:bg-default-50 dark:hover:bg-default-100 text-foreground transition-colors"
        aria-label="Previous page"
      >
        Previous
      </button>
      <span className="text-sm text-foreground">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onClick("next")}
        disabled={Number(page) >= totalPages}
        className="flex items-center px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-default-100 hover:bg-default-200 dark:bg-default-50 dark:hover:bg-default-100 text-foreground transition-colors"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
