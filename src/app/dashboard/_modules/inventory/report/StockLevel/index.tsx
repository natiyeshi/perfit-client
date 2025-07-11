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
import toast from "react-hot-toast";
import { IDBClientInventoryImport } from "@/types/IInventoryImport";

interface Product {
  id: string;
  name: string;
  unit: string;
  brand: string;
  supplierId: string | null;
}


type TimeChoice = "all" | "last month" | "last 3 months" | "last 6 months" | "this 12 months";

const timeChoices: Record<TimeChoice, number> = {
  all: 100,
  "last month": 1,
  "last 3 months": 3,
  "last 6 months": 6,
  "this 12 months": 12,
};

interface ChartData {
  name: string;
  value: number;
}

interface Props {
  stockData: IDBClientInventoryImport[];
  query: any;
}

const StockChart: React.FC<Props> = ({ stockData, query }) => {
  const [filter, setFilter] = useState<{ time: TimeChoice }>({ time: "all" });
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const monthAgo = subMonths(new Date(), timeChoices[filter.time]);
    const dataMap: Record<string, number> = {};

    stockData.forEach((item) => {
      const createdAt = new Date(item.createdAt);
      if (filter.time === "all" || isAfter(createdAt, monthAgo)) {
        dataMap[item.product.brandName] = (dataMap[item.product.brandName] || 0) + item.quantity;
      }
    });

    const sortedData = Object.entries(dataMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4) // Limit to top 4
      .map(([name, value]) => ({ name, value }));

    setChartData(sortedData);
  }, [filter, query.isSuccess, stockData]);

  return (
    <div className="w-full h-[70vh]">
      <h3 className="text-xl text-center mb-1">Top Products</h3>
      <h3 className="text-sm text-center mb-2">By Quantity</h3>
      <div className="flex justify-end w-full">
        {typeof window !== "undefined" && <Filter filter={filter} setFilter={setFilter} />}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
