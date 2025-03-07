"use client";
import React from "react";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import Link from "next/link";

// Define types for data
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export interface SalesPerson {
  userId: string;
  user: User;
}

export interface WeeklySales {
  id: string;
  targetSales: number;
  plannedContacts: number;
  plannedVisits: number;
  plannedNewCustomers: number;
  plannedTransactions: number;
  actualContacts: number;
  actualVisits: number;
  actualNewCustomers: number;
  actualTransactions: number;
  startDate: string;
  endDate: string;
  updatedAt: string;
  createdAt: string;
  salesPersonId: string;
  salesPerson: SalesPerson;
}

// Fetch function
const fetchWeeklySales = async (): Promise<WeeklySales[]> => {
  const response = await axios.get("/weekly-sales/all"); // Change to your actual endpoint
  return response.data.result;
};

// UserCard component to display individual user sales data
const UserCard: React.FC<{ sales: WeeklySales }> = ({ sales }) => {
  const { salesPerson } = sales;

  return (
    <div className="border p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-bold">{salesPerson.user.fullName}</h2>
      <p className="text-gray-500">{salesPerson.user.email}</p>
      <Link
        className="text-primary hover:text-primary/80 hover:underline duration-300 text-xs"
        href={"/dashboard/admin/weeklysales/" + salesPerson.userId}
      >
        See Detail
      </Link>
      <div className="flex flex-wrap gap-8 mt-5">
        <OneCard
          name="Sales"
          actual={sales.actualTransactions}
          planned={sales.plannedTransactions}
        />

        <OneCard
          name="Contacts"
          actual={sales.actualContacts}
          planned={sales.plannedContacts}
        />
        <OneCard
          name="New Customer Contact"
          actual={sales.actualNewCustomers}
          planned={sales.plannedNewCustomers}
        />
        <OneCard
          name="Visits"
          actual={sales.actualVisits}
          planned={sales.plannedVisits}
        />
      </div>
    </div>
  );
};

const OneCard = ({
  name,
  actual,
  planned,
}: {
  name: string;
  actual: number;
  planned: number;
}) => {
  const percentage = parseFloat((((actual ?? 0) / planned) * 100).toFixed(1));
  const color =
    percentage < 30
      ? "bg-orange-200"
      : percentage < 70
      ? "bg-yellow-200"
      : "bg-green-200";
  return (
    <div className={`flex flex-col gap-2 p-2 border rounded-lg px-4 ${color} `}>
      <div className="font-semibold capitalize">
        {name} ({percentage}%)
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between w-32 ">
          <div>Planned</div>
          <div>{planned}</div>
        </div>
        <div className="flex gap-4 justify-between w-32">
          <div>Actual</div>
          <div>{actual ?? 0}</div>
        </div>
      </div>
    </div>
  );
};

// Main component to list all weekly sales
const AdminWeeklySales: React.FC = () => {
  const { data, isError, error, isLoading } = useQuery<WeeklySales[]>({
    queryKey: ["weeklySales"],
    queryFn: fetchWeeklySales,
    onError: (err: any) => {
      console.error("Failed to fetch weekly sales", err);
      toast.error("Failed to load weekly sales data");
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Weekly Sales Overview</h1>
      {isLoading ? (
        <>Loading...</>
      ) : isError ? (
        <div className="text-red-500">Failed to load weekly sales data.</div>
      ) : data?.length ? (
        data.map((sales) => <UserCard key={sales.id} sales={sales} />)
      ) : (
        <p>No weekly sales data available.</p>
      )}
    </div>
  );
};

export default AdminWeeklySales;
