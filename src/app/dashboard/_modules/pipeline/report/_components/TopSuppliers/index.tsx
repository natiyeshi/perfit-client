"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Filter from "./Filter";
import { usePipelineReport } from "../../hook/usePipelineReport";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#2E7D8A"];

type TimeChoice =
  | "all"
  | "last month"
  | "last 3 months"
  | "last 6 months"
  | "this 12 months";

export type TopSuppliersFilterState = {
  time: TimeChoice;
};

const TopSuppliers = () => {
  const [filter, setFilter] = useState<TopSuppliersFilterState>({
    time: "all",
  });
  // Aggregated server-side with the same rules this chart used to apply to
  // the full import list (createdAt within the last N months).
  const { data: chartData = [] } = usePipelineReport("top_suppliers", filter.time);

  return (
    <div className="w-full h-[70vh]">
      <h3 className="text-xl text-center mb-1">Top Suppliers</h3>
      <h3 className="text-sm text-center mb-2">suppliers list</h3>
      <div className="flex justify-end w-full">
        {typeof window !== "undefined" && (
          <Filter filter={filter} setFilter={setFilter} />
        )}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#2E7D8A" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopSuppliers;
