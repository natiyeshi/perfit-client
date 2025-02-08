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
import { IDBClientInventory } from "@/types/IInventory";

interface Product {
  id: string;
  name: string;
  unit: string;
  brand: string;
  supplierId: string | null;
}

type TimeChoice =
  | "all"
  | "last month"
  | "last 3 months"
  | "last 6 months"
  | "this 12 months";

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
  inventoryData: any[];
  query: any;
}

const ExpiryAnalsis: React.FC<Props> = ({ inventoryData, query }) => {
  const [filter, setFilter] = useState<{ time: TimeChoice }>({ time: "all" });
  const [chartData, setChartData] = useState<ChartData[]>([]);

  console.log(chartData);
  useEffect(() => {
    const monthAgo = subMonths(new Date(), timeChoices[filter.time]);
    const dataMap: Record<string, number> = {};
    inventoryData.forEach((item) => {
      const remainingDays = getDayDifference(
        new Date(),
        new Date(item.expiryDate)
      );
      dataMap[item.product.name] = dataMap[item.product.name]
        ? Math.min(dataMap[item.product.name], remainingDays)
        : remainingDays;
    });

    const sortedData = Object.entries(dataMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4) // Limit to top 4
      .map(([name, value]) => ({ name, value }));

    setChartData(sortedData);
  }, [filter, query.isSuccess, inventoryData]);

  return (
    <div className="w-full h-[70vh]">
      <h3 className="text-xl text-center mb-1">Expiry Analysis</h3>
      <h3 className="text-sm text-center mb-2">By Quantity</h3>
      {/* {JSON.stringify(inventoryData)} */}
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
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const getDayDifference = (date1: Date, date2: Date) => {
  const timeDifference = date1.getTime() - date2.getTime();
  return timeDifference / (1000 * 3600 * 24);
};

export default ExpiryAnalsis;
