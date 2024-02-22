"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { formUrlQuery } from "@/lib/utils";

type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};

const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onClick = (btnType: string) => {
    const pageValue = btnType === "next" ? Number(page) + 1 : Number(page) - 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || "page",
      value: pageValue.toString(),
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div>
      <button onClick={() => onClick("prev")} disabled={Number(page) <= 1}>
        Previous
      </button>
      <button
        onClick={() => onClick("next")}
        disabled={Number(page) >= totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
