"use client";
import TopImported from "./_components/TopImportedProducts/TopImported";
import LeastImportedProduct from "./_components/LeastImportedProduct";
import React from "react";
import TopSuppliers from "./_components/TopSuppliers";
import TopCompetitorByTotalPrice from "./_components/TopCompetitorsByTotalPrice";
import AverageUnitPrice from "./_components/AverageUnitprice";

// Each widget now fetches its own small, server-aggregated result, so this page
// no longer downloads the full import dataset.
const Page = () => {
  return (
    <div className="px-2 flex-1 pt-6 overflow-y-auto max-w-full overflow-x-hidden flex flex-col gap-5 gap-y-[10rem]">
      <div className="col-span-full">
        <div className="grid grid-cols-1">
          <TopCompetitorByTotalPrice />
        </div>
      </div>
      <LeastImportedProduct />
      <TopSuppliers />
      <TopImported />
      <AverageUnitPrice />
    </div>
  );
};

export default Page;
