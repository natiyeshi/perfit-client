"use client";
import { Input } from "@/components/ui/input";
import React from "react";
import { IoCloseSharp } from "react-icons/io5";
// import Addimport from "@/components/custom/inventory/AddInventory";
import { Button } from "@/components/ui/button";
import { useInventoryTable } from "../hook/useInventoryTable";
import FilterCard from "./Filter";
import { IoMdRefresh } from "react-icons/io";
import DeleteInventory from "@/components/custom/inventory/DeleteInventory";
import UpdateInventory from "@/components/custom/inventory/UpdateInventory";
import { IDBClientInventory } from "@/types/IInventory";
import CustomeTable from "@/components/custom/table/CustomeTable";
const InventoryTable: React.FC = () => {
  const headers: { name: string; key: keyof IDBClientInventory,showDetail?: keyof IDBClientInventory }[] = [
    { name: "Product Name", key: "productName", showDetail: "product" },
    { name: "Quantity", key: "quantity" },
    { name: "unitPrice", key: "possibleSellingPrice" },

  ];
  const { filters, inventorys, setFilters, filter, reload, query } =
    useInventoryTable();
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
          {/* <Addinventory /> */}
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
        <CustomeTable
          query={query}
          headers={headers}
          result={inventorys}
          DeleteItem={DeleteInventory}
          // UpdateItem={UpdateInventory}
        />
      </div>
    </>
  );
};

export default InventoryTable;
