"use client";
import { Input } from "@/components/ui/input";
import React from "react";
import { IoCloseSharp } from "react-icons/io5";
// import Addimport from "@/components/custom/import/AddImport";
import { Button } from "@/components/ui/button";
import { useCostTable } from "../hook/useCostTable";
import { IoMdRefresh } from "react-icons/io";
import DeleteImport from "@/components/custom/import/DeleteImport";
import UpdateImport from "@/components/custom/import/UpdateImport";
import CustomeTable from "@/components/custom/table/CustomeTable";
import { IDBClientCostBuildUp } from "@/types/ICostbuildup";

const CostTable: React.FC = () => {
  const { filters, imports, setFilters, filter, reload, query } =
    useCostTable();
  const headers: {
    name: string;
    key: keyof IDBClientCostBuildUp;
    showDetail?: keyof IDBClientCostBuildUp;
    isLink?: boolean;
    link?: string;
  }[] = [
    { name: "Number of Products", key: "numberOfProducts" },
    { name: "FOB Price (USD)", key: "fobPriceUSD" },
    { name: "Exchange Rate", key: "exchangeRate" },
    { name: "Total FOB Cost (Birr)", key: "totalFobCostBirr" },
    { name: "FC Purchase", key: "fcPurchase" },
    { name: "Bank Service Charges", key: "bankServiceCharges" },
    { name: "Insurance Charge", key: "insuranceCharge" },
    { name: "Freight Charge", key: "freightCharge" },
    { name: "Customs Duty", key: "customsDuty" },
    { name: "Storage Charges", key: "storageCharges" },
    { name: "Inland Transport", key: "inlandTransport" },
    { name: "Transit Agent Charge", key: "transitAgentCharge" },
    { name: "Loading/Unloading Expenses", key: "loadingUnloadingExpenses" },
    { name: "Total Cost", key: "totalCost" },
    { name: "USD Purchase Price", key: "usdPurchasePrice" },
    { name: "Mislaneous Cost", key: "mislaneousCost" },
  ];

  return (
    <>
      <div className="w-full py-4 px-2 flex justify-between">
        <div className="w-[400px]">
          <Input
            placeholder="search"
            value={filters.name}
            onChange={({ target }) =>
              filter("name", target.value.toLowerCase())
            }
            className="py-0"
          />
        </div>
        <div className="flex gap-4 items-center">
          <Button
            onClick={reload}
            disabled={query.isFetching}
            variant="outline"
            className="px-2 rounded-full"
          >
            <IoMdRefresh className="text-xl" />
          </Button>
          {/* <Addimport /> */}
          {/* <FilterCard setFilters={setFilters} filter={filters} /> */}
        </div>
      </div>
      <div className="py-2 px-2 flex flex-wrap gap-3">
        {Object.entries(filters).map(
          ([key, value]) =>
            value && (
              <div
                key={key}
                className="flex bg-green-600 text-white items-center w-fit gap-1 py-1 px-2 rounded-lg"
              >
                <div>{value}</div>
                <IoCloseSharp
                  onClick={() => filter(key, key === "name" ? "" : null)}
                  className="text-lg hover:bg-gray-200/20 rounded-full cursor-pointer"
                />
              </div>
            )
        )}
      </div>
      <div className="overflow-scroll flex-1">
        <CustomeTable<IDBClientCostBuildUp & { id: string }>
          query={query}
          headers={headers}
          result={imports.map((item, idx) => ({
            ...item,
            id: (item as any).id || (item as any)._id || String(idx) // fallback to index if nothing else
          }))}
          DeleteItem={DeleteImport}
          UpdateItem={UpdateImport}
          link="/dashboard/admin/costbuildup/"
        />
      </div>
    </>
  );
};

export default CostTable;
