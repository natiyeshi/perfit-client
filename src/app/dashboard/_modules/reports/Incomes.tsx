import React from "react";
import { useQuery } from "react-query";
import axios from "@/lib/axios";

const fetchTransactions = async () => {
  const response = await axios.get("transactions", {
    params: { populate: true },
  });
  return response.data;
};

const calculateTransactions = (transactions: any[]) => {
  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  const calculateSum = (filteredTransactions: any[]) =>
    filteredTransactions.reduce(
      (sum, transaction) => sum + transaction.quantity * transaction.unitPrice,
      0
    );

  const todaySum = calculateSum(
    transactions.filter(
      (transaction) => new Date(transaction.createdAt) >= startOfToday
    )
  );

  const thisMonthSum = calculateSum(
    transactions.filter(
      (transaction) => new Date(transaction.createdAt) >= startOfMonth
    )
  );

  const thisYearSum = calculateSum(
    transactions.filter(
      (transaction) => new Date(transaction.createdAt) >= startOfYear
    )
  );

  return {
    today: todaySum,
    thisMonth: thisMonthSum,
    thisYear: thisYearSum,
  };
};

const Incomes: React.FC = () => {
  const { data, error, isLoading } = useQuery(
    "transactions",
    fetchTransactions
  );

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;
  const transactions = Array.isArray(data.result)
    ? calculateTransactions(data.result)
    : { today: 0, thisMonth: 0, thisYear: 0 };

  return (
    <>
      <div className="text-white bg-primary p-4 rounded shadow">
        <h3 className="text-lg font-semibold">Today</h3>
        <p className="text-xl">
          {transactions.today} <span className="text-sm">ETB</span>
        </p>
      </div>
      <div className="text-white bg-primary p-4 rounded shadow">
        <h3 className="text-lg font-semibold">This Month</h3>
        <p className="text-xl">
          {transactions.thisMonth} <span className="text-sm">ETB</span>
        </p>
      </div>
      <div className="text-white bg-primary p-4 rounded shadow">
        <h3 className="text-lg font-semibold">This Year</h3>
        <p className="text-xl">
          {transactions.thisYear} <span className="text-sm">ETB</span>
        </p>
      </div>
    </>
  );
};

export default Incomes;
