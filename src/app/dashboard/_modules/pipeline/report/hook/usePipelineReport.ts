"use client";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import axios from "@/lib/axios";

export type PipelineChart =
  | "top_products"
  | "least_products"
  | "top_suppliers"
  | "top_competitors";

export type PipelineTimeChoice =
  | "all"
  | "last month"
  | "last 3 months"
  | "last 6 months"
  | "this 12 months";

// Same month windows the charts used client-side ("all" = no filter).
const timeToMonths: Record<PipelineTimeChoice, number | undefined> = {
  all: undefined,
  "last month": 1,
  "last 3 months": 3,
  "last 6 months": 6,
  "this 12 months": 12,
};

/**
 * Chart data for the pipeline report, aggregated server-side. Replaces
 * downloading every competitor import and summing it in the browser.
 */
export const usePipelineReport = (
  chart: PipelineChart,
  time: PipelineTimeChoice
) => {
  const months = timeToMonths[time];
  return useQuery(
    ["pipeline-report", chart, months],
    async () => {
      const params = new URLSearchParams({ chart });
      if (months) params.set("months", String(months));
      const res = await axios.get(
        `/competitor-imports/analytics/pipeline-report?${params.toString()}`
      );
      return (res.data.result as { name: string; value: number }[]) || [];
    },
    {
      keepPreviousData: true,
      onError(err) {
        console.log(err, "pipeline report fetch error");
        toast.error("Something goes wrong!!");
      },
    }
  );
};
