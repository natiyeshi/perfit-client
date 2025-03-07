"use client";

import InventoryLevelChart from "../../_modules/reports/InventoryLevelChart";
import TopCompetitorsByQuantity from "../../_modules/reports/TopCompetitorsByQuantity";
import TransactionsPieChart from "../../_modules/reports/TransactionGraph";
import TransactionsLineChart from "../../_modules/reports/TransactionLineChart";

const Page = () => {
  return (
    <div className="ps-[100px] pe-12 gap-10 grid grid-cols-3 mt-4">
      <TransactionsPieChart />
      <InventoryLevelChart />
      <TopCompetitorsByQuantity />
      <div className="col-span-3 w-fll mb-12">
        <TransactionsLineChart />
      </div>
    </div>
  );
};

export default Page;
