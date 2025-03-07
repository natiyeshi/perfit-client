"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import AddWeeklyPlan from "./AddWeeklyPlan";
import UpdateWeeklyReport from "./UpdateReport";
import LastReportTable from "./LastReportTable"; // Import the new LastReportTable component

const Weekly = () => {
  const targets = [
    // { name: "Target Sales", k: "targetSales", endpoint: "/api/targetSales" },
    {
      name: "Contacts",
      k: "plannedContacts",
      ak: "actualContacts",
    },
    {
      name: "Visits",
      k: "plannedVisits",
      ak: "actualVisits",
    },
    {
      name: "New Customers ",
      k: "plannedNewCustomers",
      ak: "actualNewCustomers",
    },
    {
      name: "Transactions",
      k: "plannedTransactions",
      ak: "actualTransactions",
    },
  ];

  const [tab, setTab] = useState<1 | 2>(1);

  const query = useQuery(
    "weekly-sales",
    () => axios.get("/weekly-sales/thisweek"),
    {
      onSuccess(data) {
        console.log(data.data, "Weekly Report Loaded");
      },
      onError(err) {
        toast.error("Unable to load this week report!");
      },
    }
  );

  const lastReportQuery = useQuery(
    "last-weekly-sales",
    () => axios.get("/weekly-sales"),
    {
      onSuccess(data) {
        console.log(data.data, "Last Report Loaded");
      },
      onError(err) {
        toast.error("Unable to load last week report!");
      },
    }
  );

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full flex gap-10 px-4 py-5">
        <Button
          onClick={() => setTab(1)}
          variant={`outline`}
          className={`border-0 px-1 ${
            tab == 1 &&
            "border-0 rounded-none border-b-2 border-primary text-primary text-semibold duration-150"
          }`}
        >
          This Weekly Report
        </Button>
        <Button
          onClick={() => setTab(2)}
          variant={`outline`}
          className={`border-0 px-1 ${
            tab == 2 &&
            "border-0 rounded-none border-b-2 border-primary text-primary text-semibold duration-150"
          }`}
        >
          Last Reports
        </Button>
        {query.data?.data?.result && (
          <div className="ml-auto">
            <UpdateWeeklyReport initial={query.data?.data.result} />
          </div>
        )}
      </div>
      {tab === 1 ? (
        query.isLoading ? (
          "Loading..."
        ) : query.data?.data.result ? (
          <div className="w-full flex flex-wrap pt-8 gap-5 px-6">
            {targets.map((data, ind) => (
              <ShowTarget
                key={ind}
                name={data.name}
                value={query.data?.data.result[data.k]}
                actualValue={query.data?.data.result[data.ak] ?? 0}
              />
            ))}
          </div>
        ) : query.isSuccess ? (
          <div className="w-fit mx-auto flex justify-center items-center flex-col gap-5">
            <div>Hey, You didn&apos;t set weekly plan.</div>
            <AddWeeklyPlan />
          </div>
        ) : (
          "Something went wrong!"
        )
      ) : // Last Report Tab
      lastReportQuery.isLoading ? (
        "Loading Last Report..."
      ) : lastReportQuery.data?.data?.result ? (
        <LastReportTable data={lastReportQuery.data.data.result} />
      ) : (
        "No Last Report Data Available"
      )}
    </div>
  );
};

const ShowTarget = ({
  name,
  value,
  actualValue,
}: {
  name: string;
  value: string;
  actualValue: string;
}) => {
  const percentage = parseFloat(
    ((parseInt(actualValue ?? 0) / parseInt(value ?? 1)) * 100).toFixed(1)
  );
  const color =
    percentage < 30
      ? "bg-orange-200"
      : percentage < 70
      ? "bg-yellow-200"
      : "bg-green-200";
  return (
    <div className={`flex flex-col gap-2 p-2 border rounded-lg px-4 pe-6 duration-200 ${color} `}>
      <div className="font-semibold capitalize text-lg">
        {name} ({percentage}%)
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between w-32 ">
          <div>Planned</div>
          <div>{value}</div>
        </div>
        <div className="flex gap-4 justify-between w-32">
          <div>Actual</div>
          <div>{actualValue ?? 0}</div>
        </div>
      </div>
    </div>
  );
};

export default Weekly;
