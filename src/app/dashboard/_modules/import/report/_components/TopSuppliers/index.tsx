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
import { useTopAnalytics } from "../../hook/useTopAnalytics";

type TimeChoice =
  | "all"
  | "last month"
  | "last 3 months"
  | "last 6 months"
  | "this 12 months";

export type TopSuppliersFilterState = {
  time: TimeChoice;
};

const TopSuppliers = (_props?: { importsData?: unknown; query?: unknown }) => {
  const [filter, setFilter] = useState<TopSuppliersFilterState>({
    time: "all",
  });
  const { data: chartData = [] } = useTopAnalytics(
    "supplier_total_value",
    filter.time,
    "desc"
  );

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
          <XAxis
            dataKey="name"
            tickFormatter={(name) =>
              name.length > 7 ? name.slice(0, 7) + "..." : name
            }
          />
          <YAxis
            tickFormatter={(value) => {
              if (value >= 1_000_000)
                return (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
              if (value >= 1_000)
                return (value / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
              return value;
            }}
          />
          <Tooltip formatter={(value) => value.toLocaleString()} />
          <Bar dataKey="value" fill="#2E7D8A" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopSuppliers;
