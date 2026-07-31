"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import Filter from "./Filter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

type TimeChoice =
  | "all"
  | "last month"
  | "last 3 months"
  | "last 6 months"
  | "this 12 months";

export type TopImportProductsFilterState = {
  time: TimeChoice;
};

// Map the human time choice to a concrete number of days for the API.
const timeToDays: Record<TimeChoice, number | undefined> = {
  all: undefined,
  "last month": 30,
  "last 3 months": 90,
  "last 6 months": 180,
  "this 12 months": 365,
};

interface AvgRow {
  name: string;
  avgUnitPrice: number;
  count: number;
}

const LIMIT = 20;

// Props are kept optional for backwards-compat with the report page, but this
// component now fetches its own paginated, server-aggregated data.
const AverageUnitPrice = (_props?: { importsData?: unknown; query?: unknown }) => {
  const [filter, setFilter] = useState<TopImportProductsFilterState>({
    time: "all",
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const days = timeToDays[filter.time];

  // Debounce the search box.
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Reset to page 1 when filters change.
  useEffect(() => {
    setPage(1);
  }, [filter.time, order]);

  const query = useQuery(
    ["average-unit-price", page, debouncedSearch, days, order],
    () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(LIMIT));
      params.set("order", order);
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (days) params.set("days", String(days));
      return axios.get(
        `/competitor-imports/analytics/average-unit-price?${params.toString()}`
      );
    },
    {
      keepPreviousData: true,
      onError() {
        toast.error("Failed to load average unit price.");
      },
    }
  );

  const rows: AvgRow[] = useMemo(
    () => query.data?.data?.result || [],
    [query.data]
  );
  const meta = query.data?.data?.meta as
    | { total: number; page: number; limit: number; totalPages: number }
    | undefined;

  const totalPages = meta?.totalPages ?? 1;
  const total = meta?.total ?? 0;
  const startIndex = (page - 1) * LIMIT;

  return (
    <div className="w-full max-md:text-sm mx-auto mt-6 col-span-2 mb-12">
      <div className="flex flex-wrap gap-3 justify-between mb-4 items-center">
        <h3 className="text-lg font-semibold">Average Unit Price Per Product</h3>
        <div className="flex items-center gap-2">
          <Filter filter={filter} setFilter={setFilter} />
          <Input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 max-md:w-40"
          />
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-muted/50 text-muted-foreground">
              <th className="py-2.5 px-4 font-medium w-16">No</th>
              <th className="py-2.5 px-4 font-medium">Product</th>
              <th className="py-2.5 px-4 font-medium">
                <button
                  type="button"
                  onClick={() =>
                    setOrder((o) => (o === "asc" ? "desc" : "asc"))
                  }
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  Average Unit Price
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </th>
              <th className="py-2.5 px-4 font-medium text-right">Samples</th>
            </tr>
          </thead>
          <tbody>
            {query.isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-t border-border">
                  <td colSpan={4} className="py-3 px-4">
                    <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  </td>
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground"
                >
                  No data available
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={row.name}
                  className="border-t border-border hover:bg-muted/40 transition-colors"
                >
                  <td className="py-2.5 px-4 text-muted-foreground">
                    {startIndex + i + 1}
                  </td>
                  <td className="py-2.5 px-4 capitalize">{row.name}</td>
                  <td className="py-2.5 px-4 font-medium tabular-nums">
                    {row.avgUnitPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2.5 px-4 text-right tabular-nums text-muted-foreground">
                    {row.count}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-4 mt-3 text-sm text-muted-foreground">
        <span>
          {total === 0 ? 0 : startIndex + 1}-
          {Math.min(startIndex + rows.length, total)} of {total} products
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            disabled={page <= 1 || query.isFetching}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </Button>
          <span className="min-w-[80px] text-center">
            Page {page} / {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            disabled={page >= totalPages || query.isFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AverageUnitPrice;
