"use client";
import axios from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { IDBClientInventoryImport } from "@/types/IInventoryImport";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "react-query";
import StockLevel from "./StockLevel";
import ExpiryProductsAnalysis from "./ExpirtyProductsAnalysis"
import { IDBClientInventory } from "@/types/IInventory";

const page = () => {
  const [stockData, setStockData] = useState<IDBClientInventoryImport[]>(
    []
  );
  const [inventoryHistoryData, setInventoryHistoryData] = useState<IDBClientInventory[]>(
    []
  );
  const query = useQuery("inventories", () => axios.get("/inventories?populate=true"), {
    onSuccess(data) {
      let k: IDBClientInventoryImport[] = data.data.result || [];
      setStockData(k);
    },
    onError(err) {
      console.log(err, "EEEEEEEEEEEEEEEEEE ");
      toast.error("Something goes wrong!!");
    },
  });
  const query2 = useQuery("imports", () => axios.get("/imports?populate=true"), {
    onSuccess(data) {
      let k: IDBClientInventoryImport[] = data.data.result || [];
      setInventoryHistoryData(k);
    },
    onError(err) {
      console.log(err, "EEEEEEEEEEEEEEEEEE ");
      toast.error("Something goes wrong!!");
    },
  });
  return (
    <>
      {query.isLoading ? (
        <div className="p-4">Loading...</div>
      ) : (
        <>
          {/* {JSON.stringify(importsData)} */}
          <div className="px-2 flex-1 pt-6 overflow-auto grid grid-cols-2 gap-5 gap-y-[10rem]">
            <StockLevel stockData={stockData} query={query}  />
            <ExpiryProductsAnalysis inventoryData={inventoryHistoryData} query={query}  />
          </div>
        </>
      )}
    </>
  );
};

export default page;
