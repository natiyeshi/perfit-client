"use client";
import { Input } from "@/components/ui/input";
import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useTransactionTable } from "../hook/useTransactionTable";
import FilterCard from "./Filter";
import { IoMdRefresh } from "react-icons/io";
// import DeleteImport from "@/components/custom/import/DeleteImport";
// import UpdateImport from "@/components/custom/import/UpdateImport";
import CustomeTable, { Header } from "@/components/custom/table/CustomeTable";
import { IDBClientTransaction } from "@/types/ITransaction";

const TransactionTable: React.FC = () => {
  const { filters, imports, setFilters, filter, reload, query } =
    useTransactionTable();
  const headers: Header<IDBClientTransaction>[] = [
    {
      name: "Product Name",
      key: "productName",
      showDetail: "product",
    },
    {
      name: "Customer Name",
      key: "customerName",
      showDetail: "customer",
    },
    { name: "Quantity", key: "quantity" },
    { name: "unitPrice", key: "unitPrice" },
    { name: "sales", key: "salesPersonName" },
    { name: "Sell Type", key: "withCreditName" },
    { name: "Progress", key: "isFinalizedName" },
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
          <FilterCard setFilters={setFilters} filter={filters} />
        </div>
      </div>
      <div className="py-2 px-2 flex flex-wrap gap-3">
        {filters.isFinalized != null && (
          <div className="flex bg-green-600 text-white items-center w-fit gap-1 py-1 px-2 rounded-lg">
            <div className="capitalizes">
              {filters.isFinalized ? "Finalized" : "On Progress"}
            </div>
            <IoCloseSharp
              onClick={() => filter("isFinalized", null)}
              className="text-lg hover:bg-gray-200/20 rounded-full cursor-pointer"
            />
          </div>
        )}
        {filters.withCredit != null && (
          <div className="flex bg-green-600 text-white items-center w-fit gap-1 py-1 px-2 rounded-lg">
            <div className="capitalizes">
              {filters.withCredit ? "With Credit" : "Without Credit"}
            </div>
            <IoCloseSharp
              onClick={() => filter("withCredit", null)}
              className="text-lg hover:bg-gray-200/20 rounded-full cursor-pointer"
            />
          </div>
        )}
        {filters.name.length > 0 && (
          <div className="flex bg-green-600 text-white items-center w-fit gap-1 py-1 px-2 rounded-lg">
            <div className="capitalizes">{filters.name}</div>
            <IoCloseSharp
              onClick={() => filter("name", "")}
              className="text-lg hover:bg-gray-200/20 rounded-full cursor-pointer"
            />
          </div>
        )}
      </div>
      <div className="overflow-scroll flex-1">
        <CustomeTable query={query} headers={headers} result={imports} />
      </div>
    </>
  );
};

export default TransactionTable;
