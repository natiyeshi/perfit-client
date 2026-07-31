"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Filter from "./Filter";
import React, { useState } from "react";
import { useTopAnalytics } from "../../hook/useTopAnalytics";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#2E7D8A"];

type TimeChoice =
  | "all"
  | "last month"
  | "last 3 months"
  | "last 6 months"
  | "this 12 months";

export type TopImportProductsFilterState = {
  time: TimeChoice;
};

const TopImportedProducts = (_props?: {
  importsData?: unknown;
  query?: unknown;
}) => {
  const [filter, setFilter] = useState<TopImportProductsFilterState>({
    time: "all",
  });
  const { data: chartData = [] } = useTopAnalytics(
    "product_quantity",
    filter.time,
    "desc"
  );

  return (
    <div className="w-full h-[70vh]">
      <h3 className="text-xl text-center mb-1 ">Top Imported Products</h3>
      <h3 className="text-sm text-center mb-2 ">products list</h3>
      <div className="flex justify-end w-full">
        {typeof window !== "undefined" && (
          <Filter filter={filter} setFilter={setFilter} />
        )}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#2E7D8A"
            label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => value.toLocaleString()} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopImportedProducts;
