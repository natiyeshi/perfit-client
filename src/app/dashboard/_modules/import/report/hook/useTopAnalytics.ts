"use client";
import { useQuery } from "react-query";
import axios from "@/lib/axios";

export type AnalyticsPoint = { name: string; value: number };

export type AnalyticsMetric =
  | "competitor_total_price"
  | "supplier_total_value"
  | "product_quantity";

const timeToDays: Record<string, number | undefined> = {
  all: undefined,
  "last month": 30,
  "last 3 months": 90,
  "last 6 months": 180,
  "this 12 months": 365,
};

/**
 * Fetches a small, server-aggregated top/bottom list for a report chart.
 * Replaces the old pattern of downloading every import and aggregating in JS.
 */
export const useTopAnalytics = (
  metric: AnalyticsMetric,
  time: string,
  order: "asc" | "desc" = "desc",
  limit = 10
) => {
  const days = timeToDays[time];
  return useQuery(
    ["import-analytics", metric, days, order, limit],
    async () => {
      const params = new URLSearchParams();
      params.set("metric", metric);
      params.set("order", order);
      params.set("limit", String(limit));
      if (days) params.set("days", String(days));
      const res = await axios.get(
        `/competitor-imports/analytics/top?${params.toString()}`
      );
      return (res.data.result as AnalyticsPoint[]) || [];
    },
    { keepPreviousData: true }
  );
};
