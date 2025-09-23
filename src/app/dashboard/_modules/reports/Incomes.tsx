import React from "react";
import { useQuery } from "react-query";
import axios from "@/lib/axios";

const fetchDashboard = async () => {
  const response = await axios.get("maraki/dashboard");
  return response.data;
};

const extractIncomes = (result: any) => {
  const items: any[] = result?.Items ?? [];
  const findCard = (title: string) => items.find((i) => i?.Title === title);

  const todayCard = findCard("Today's Income");
  const thisMonthCard = findCard("This Month Income");
  const thisYearCard = findCard("This Year Income");

  return {
    today: todayCard?.CardValue ?? "0",
    thisMonth: thisMonthCard?.CardValue ?? "0",
    thisYear: thisYearCard?.CardValue ?? "0",
  };
};

const Incomes: React.FC = () => {
  const { data, error, isLoading } = useQuery("maraki-dashboard", fetchDashboard);

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  const incomes = data?.result ? extractIncomes(data.result) : { today: "0", thisMonth: "0", thisYear: "0" };

  return (
    <div className="flex-1">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="text-white bg-primary p-6 rounded-lg shadow min-h-[120px] flex flex-col justify-center">
          <h3 className="text-xl font-semibold">Today</h3>
          <p className="text-3xl mt-1">
            {incomes.today} <span className="text-base align-top">ETB</span>
          </p>
        </div>
        <div className="text-white bg-primary p-6 rounded-lg shadow min-h-[120px] flex flex-col justify-center">
          <h3 className="text-xl font-semibold">This Month</h3>
          <p className="text-3xl mt-1">
            {incomes.thisMonth} <span className="text-base align-top">ETB</span>
          </p>
        </div>
        <div className="text-white bg-primary p-6 rounded-lg shadow min-h-[120px] flex flex-col justify-center">
          <h3 className="text-xl font-semibold">This Year</h3>
          <p className="text-3xl mt-1">
            {incomes.thisYear} <span className="text-base align-top">ETB</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Incomes;
