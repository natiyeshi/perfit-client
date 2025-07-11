"use client";

import React, { useEffect, useState } from "react";
import { IDBPopulatedImport } from "@/types/IImport";
import toast from "react-hot-toast";
import Filter from "./Filter";
import { subMonths, isAfter } from "date-fns";
import { Input } from "@/components/ui/input";

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

const AverageUnitPrice = ({
  importsData,
  query,
}: {
  importsData: IDBPopulatedImport[];
  query: any;
}) => {
  const [filter, setFilter] = useState<TopImportProductsFilterState>({
    time: "all",
  });
  const [tableData, setTableData] = useState<
    { name: string; avgUnitPrice: number }[]
  >([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Filter importsData by selected time period
    const monthAgo = subMonths(new Date(), timeChoices[filter.time]);
    const productMap: Record<string, { total: number; count: number }> = {};
    importsData.forEach((d) => {
      const createdAt = new Date(d.createdAt);

      importsData.forEach((d) => {
        const createdAt = new Date(d.date);
        d.products.forEach((p) => {
          if (filter.time === "all" || isAfter(createdAt, monthAgo)) {
            const name = p.product.genericName;
            if (!productMap[name]) {
              productMap[name] = { total: 0, count: 0 };
            }
            productMap[name].total += p.unitPrice;
            productMap[name].count += 1;
          }
        });
      });
    });
    const data = Object.entries(productMap)
      .map(([name, { total, count }]) => ({
        name,
        avgUnitPrice: count > 0 ? total / count : 0,
      }))
      .sort((a, b) => b.avgUnitPrice - a.avgUnitPrice);
    setTableData(data);
  }, [importsData, filter]);

  return (
    <div className="w-full  mx-auto mt-6 col-span-2 mb-12">
      <div className="flex justify-between mb-2 items-center">
        <Filter filter={filter} setFilter={setFilter} />
        <Input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
      </div>
      <h3 className="text-xl text-center mb-2">
        Average Unit Price Per Product
      </h3>
      <table className="min-w-full border border-gray-200 rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Product</th>
            <th className="py-2 px-4 border-b">Average Unit Price</th>
          </tr>
        </thead>
        <tbody>
          {tableData.filter((row) =>
            row.name.toLowerCase().includes(search.toLowerCase())
          ).length === 0 ? (
            <tr>
              <td colSpan={2} className="text-center py-4">
                No data available
              </td>
            </tr>
          ) : (
            tableData
              .filter((row) =>
                row.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((row) => (
                <tr key={row.name}>
                  <td className="py-2 px-4 border-b">{row.name}</td>
                  <td className="py-2 px-4 border-b">
                    {row.avgUnitPrice.toFixed(2)}
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AverageUnitPrice;
