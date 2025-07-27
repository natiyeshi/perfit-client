"use client";

import React, { useEffect, useState } from "react";
import { subMonths, isAfter } from "date-fns";
import Filter from "./Filter";
import { IDBPopulatedImport } from "@/types/IImport";

// Time filter types and choices
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

const timeChoices: Record<TimeChoice, number> = {
  all: 10,
  "last month": 1,
  "last 3 months": 3,
  "last 6 months": 6,
  "this 12 months": 12,
};

const TopImportedProductsList = ({
  importsData,
  query,
}: {
  importsData: IDBPopulatedImport[];
  query: any;
}) => {
  const [filter, setFilter] = useState<TopImportProductsFilterState>({
    time: "all",
  });
  const [tableData, setTableData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const monthAgo = subMonths(new Date(), timeChoices[filter.time]);
    const datas: Record<string, number> = {};

    importsData.forEach((d) => {
      const createdAt = new Date(d.date);
      d.products.forEach((p) => {
        if (!datas[p.product.genericName]) {
          datas[p.product.genericName] = 0;
        }
        if (filter.time === "all" || isAfter(createdAt, monthAgo)) {
          datas[p.product.genericName] += p.quantity;
        }
      });
    });
     
    const sortedData = Object.entries(datas)
      .sort(([, a], [, b]) => b - a)
      .map(([key, value]) => ({ name: key, value }));

    const topFour = sortedData.slice(0, 4);
    setTableData(topFour);
  }, [filter, importsData]);

  return (
    <div className="w-full max-w-xl mx-auto mt-6">
      <div className="flex justify-end mb-2">
        <Filter filter={filter} setFilter={setFilter} />
      </div>
      <h3 className="text-xl text-center mb-2">Top Imported Products (Table)</h3>
      <table className="min-w-full border border-gray-200 rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Product</th>
            <th className="py-2 px-4 border-b">Total Imported</th>
          </tr>
        </thead>
        <tbody>
          {tableData.length === 0 ? (
            <tr>
              <td colSpan={2} className="text-center py-4">No data available</td>
            </tr>
          ) : (
            tableData.map((row) => (
              <tr key={row.name}>
                <td className="py-2 px-4 border-b">{row.name}</td>
                <td className="py-2 px-4 border-b">{row.value}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TopImportedProductsList;
