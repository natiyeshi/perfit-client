"use client";
import { Input } from "@/components/ui/input";
import React from "react";
import { IoCloseSharp } from "react-icons/io5";
// import Addimport from "@/components/custom/import/AddImport";
import { Button } from "@/components/ui/button";
import { usePipelineTable } from "../hook/usePipelineTable";
import FilterCard from "./Filter";
import { IoMdRefresh } from "react-icons/io";
import DeleteImport from "@/components/custom/import/DeleteImport";
import UpdateImport from "@/components/custom/import/UpdateImport";
import { IDBClientPipeline } from "@/types/IPipeline";
import CustomeTable from "@/components/custom/table/CustomeTable";
import DeletePipeline from "@/components/custom/pipeline/DeletePipeline";
import UpdatePipeline from "@/components/custom/pipeline/updatePipeline";

const PipelineTable: React.FC = () => {
  const { filters, pipeline, setFilters, filter, reload, query } =
    usePipelineTable();
  const headers: {
    name: string;
    key: keyof IDBClientPipeline;
    showDetail?: keyof IDBClientPipeline;
  }[] = [
    {
      name: "Product Name",
      key: "productName",
      showDetail: "product",
    },
    { name: "Lc Number", key: "lcNumber" },
    { name: "Proforma Invoice Number", key: "proformaInvoiceNumber" },
    { name: "Is Arrived", key: "isArrivedString" },
    { name: "Lc Opening Date", key: "lcOpeningDate" },
    { name: "Quantity", key: "quantity" },
    { name: "Invoice", key: "invoice" },
    { name: "Port Arrival Date", key: "portArrivalDate" },
    { name: "Port Expected Arrival Date", key: "portExpectedArrivalDate" },
    { name: "quantity", key: "quantity" },
    { name: "shipping Method", key: "shippingMethod" },
    { name: "warehouse Arrival Date", key: "warehouseArrivalDate" },
    {
      name: "warehouse Expected Arrival Date",
      key: "warehouseExpectedArrivalDate",
    },
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
        <CustomeTable
          query={query}
          headers={headers}
          result={pipeline}
          DeleteItem={DeletePipeline}
          UpdateItem={UpdatePipeline}
        />
      </div>
    </>
  );
};

export default PipelineTable;
