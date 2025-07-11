"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { subMonths, isAfter } from "date-fns";
import Filter from "./Filter";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import { IDBPopulatedImport } from "@/types/IImport";
import toast from "react-hot-toast";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

type TimeChoice =
  | "all"
  | "last month"
  | "last 3 months"
  | "last 6 months"
  | "this 12 months";

export type TopImportProductsFilterState = {
  time: TimeChoice;
};

interface ChartData {
  name: string;
  value: number;
}

const timeChoices: Record<TimeChoice, number> = {
  all: 10,
  "last month": 1,
  "last 3 months": 3,
  "last 6 months": 6,
  "this 12 months": 12,
};

const LeastImportedProducts = ({
  importsData,
  query,
}: {
  importsData: IDBPopulatedImport[];
  query: any;
}) => {
  const [filter, setFilter] = useState<TopImportProductsFilterState>({
    time: "all",
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const getChartData = () => {
    const monthAgo = subMonths(new Date(), timeChoices[filter.time]);
    const datas: Record<string, number> = {};
    importsData.forEach((d) => {
      const createdAt = new Date(d.date);
      d.products.forEach((p) => {
        if (!datas[p.product.brandName]) {
          datas[p.product.brandName] = 0;
        }
        if (filter.time === "all" || isAfter(createdAt, monthAgo)) {
          datas[p.product.brandName] += p.quantity;
        }
      });
    });

    const sortedData = Object.entries(datas)
      .sort(([, a], [, b]) => a - b)
      .map(([key, value]) => ({ name: key, value }));

    const leastFour = sortedData.slice(0, 4);

    setChartData(leastFour);
  };

  useEffect(() => {
    getChartData();
  }, [filter, query.isSuccess, importsData]);

  return (
    <div className="w-full h-[70vh] ">
      <h3 className="text-xl text-center mb-1">Least Imported Products</h3>
      <h3 className="text-sm text-center mb-2">products list</h3>
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
              name.length > 10 ? name.slice(0, 10) + "..." : name
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
          <Tooltip />
          <Bar dataKey="value" width={10} fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeastImportedProducts;
