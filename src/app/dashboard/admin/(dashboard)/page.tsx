"use client";

import { Button } from "@/components/ui/button";
import InventoryCards from "../../_modules/inventory/InventoryCards";
import TopCompetitorsByQuantity from "../../_modules/reports/TopCompetitorsByQuantity";
import TransactionsPieChart from "../../_modules/reports/TransactionGraph";
import TransactionsLineChart from "../../_modules/reports/TransactionLineChart";
import { useState } from "react";
import Incomes from "../../_modules/reports/Incomes";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import Reports from "../../_modules/reports/Reports";
import T from "./t";

const Page = () => {
  const [currentTab, setCurrentTab] = useState("All");

  const data = [
    
    {
      title: "Sales",
      divs: [
        <div className="col-span-2 w-fll mb-12" key={2}>
           <Incomes key={0} />,
        </div>,
        // <div className="col-span-2 w-fll mb-12" key={2}>
        //   <TransactionsLineChart />
        // </div>,
          <div className="col-span-2 w-fll mb-12" key={2}>
          <TransactionsPieChart key={1} />,
        </div>,
      ],
    },
    {
      title: "Inventory",
      divs: [<InventoryCards key={3} />],
    },
    {
      title: "Competitors",
      divs: [<TopCompetitorsByQuantity key={4} />],
    },
  ];

  const titles = data.map((item) => item.title).reverse();

  return (
    <div className="ps-[100px] pe-12   mt-4">
      <div className="col-span-3 mt-4 mb-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      <div className="flex gap-5 mb-5">
        <Button
          variant={`${"All" == currentTab ? "default" : "outline"}`}
          onClick={() => setCurrentTab("All")}
        >
          All
        </Button>
        {titles.map((item, index) => (
          <Button
            variant={`${item == currentTab ? "default" : "outline"}`}
            onClick={() => setCurrentTab(item)}
            key={index}
          >
            {item}
          </Button>
        ))}
        <Button
          variant={`${"Reports" == currentTab ? "default" : "outline"}`}
          onClick={() => setCurrentTab("Reports")}
        >
          Reports
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-x-6 gap-y-6">
        {currentTab == "Reports" ? (
          <Reports />
        ) : (
          data.map(
            (item, index) =>
              (currentTab == "All" || item.title == currentTab) &&
              item.divs.map((div: any, divIndex) => (
                <React.Fragment key={`${index}-${divIndex}`}>
                  {div}
                </React.Fragment>
              ))
          )
        )}
      </div>
    </div>
  );
};

export default Page;
