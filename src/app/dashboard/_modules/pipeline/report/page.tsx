"use client";
import TopImported from "./_components/TopImportedProducts/TopImported";
import LeastImportedProduct from "./_components/LeastImportedProduct";
import React from "react";
import TopSuppliers from "./_components/TopSuppliers";
import TopCompetitor from "./_components/TopCompetitor";

// Each chart fetches its own pre-aggregated data (see usePipelineReport)
// instead of this page downloading every competitor import.
const Page = () => {
  return (
    <div className="px-2 flex-1 pt-6 overflow-auto grid grid-cols-2 gap-5 gap-y-[10rem]">
      <LeastImportedProduct />
      <TopImported />
      <TopSuppliers />
      <TopCompetitor />
    </div>
  );
};

export default Page;
