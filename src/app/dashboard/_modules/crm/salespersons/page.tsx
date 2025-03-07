"use client";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import SalesGraph from "../_components/SalesGraph";
import TransactionGraph from "../_components/TransactionGraph";

interface SalesPerson {
  userId: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    password: string;
    role: string;
  };
  transactionCount: number;
}

export interface SalesPersonDataResponse {
  totalTransactions: number;
  salsePersonData: SalesPerson[];
}

const salespersons: SalesPerson[] = [
  {
    userId: "1",
    user: {
      id: "1",
      fullName: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
      role: "salesperson",
    },
    transactionCount: 120,
  },
  {
    userId: "2",
    user: {
      id: "2",
      fullName: "Jane Smith",
      email: "jane.smith@example.com",
      password: "password123",
      role: "salesperson",
    },
    transactionCount: 98,
  },
  // Add more salespersons as needed
];

const Salesperson = ({ salesperson }: { salesperson: SalesPerson }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 pe-7 min-w-[200px] mb-4">
      <p className="text-lg font-semibold capitalize">
        {salesperson.user.fullName}
      </p>
      <p className="text-gray-600 text-xs">{salesperson.user.email}</p>
      <p className="text-gray-600 mt-2">
        {salesperson.transactionCount} Transactions
      </p>
    </div>
  );
};

const Page = () => {
  const salesPersonsQuery = useQuery(
    "sales-persons",
    () => axios.get("/sales-persons"),
    {
      onError(err) {
        toast.error("Unable to load sales!");
      },
    }
  );
 
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Sales Persons</h1>
      <div className="mb-6 text-gray-500">
        Sales details are provided below.
      </div>
      <div className="flex gap-10 flex-wrap">
        {salesPersonsQuery.isLoading
          ? "Loading..."
          : salesPersonsQuery.isSuccess
          ? salesPersonsQuery.data?.data?.result.salsePersonData.map(
              (salesperson) => (
                <Salesperson
                  key={salesperson.userId}
                  salesperson={salesperson}
                />
              )
            )
          : "..."}
      </div>

      {salesPersonsQuery.data?.data?.result && (
        <div>
          <SalesGraph data={salesPersonsQuery.data?.data?.result} />
        </div>
      )}
     
    </div>
  );
};

export default Page;
