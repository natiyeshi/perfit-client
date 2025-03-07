import React from "react";
import { WeeklySales } from "./Data";

interface ReportData {
  targetSales: number;
  plannedContacts: number;
  plannedVisits: number;
  plannedNewCustomers: number;
  plannedTransactions: number;
  actualContacts: number | null;
  actualVisits: number | null;
  actualNewCustomers: number | null;
  actualTransactions: number | null;
  startDate: string;
  endDate: string;
}

interface LastReportTableProps {
  data: WeeklySales[];
}

const LastReportTable: React.FC<LastReportTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full text-center table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 whitespace-nowrap ">Num</th>
            <th className="px-4 py-2 whitespace-nowrap ">Start Date</th>
            <th className="px-4 py-2 whitespace-nowrap ">End Date</th>
            <th className="px-4 py-2 whitespace-nowrap ">Planned Contacts</th>
            <th className="px-4 py-2 whitespace-nowrap ">Actual Contacts</th>
            <th className="px-4 py-2 whitespace-nowrap ">Planned Visits</th>
            <th className="px-4 py-2 whitespace-nowrap ">Actual Visits</th>
            <th className="px-4 py-2 whitespace-nowrap ">
              Planned New Customers
            </th>
            <th className="px-4 py-2 whitespace-nowrap ">
              Actual New Customers
            </th>
            <th className="px-4 py-2 whitespace-nowrap ">
              Planned Transactions
            </th>
            <th className="px-4 py-2 whitespace-nowrap ">
              Actual Transactions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2 whitespace-nowrap ">{index + 1}</td>
              <td className="px-4 py-2 whitespace-nowrap ">
                {new Date(item.startDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 whitespace-nowrap ">
                {new Date(item.endDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 whitespace-nowrap ">
                {item.plannedContacts}
              </td>
              <td className="px-4 py-2 whitespace-nowrap ">
                {item.actualContacts ?? "N/A"}
              </td>
              <td className="px-4 py-2 whitespace-nowrap ">
                {item.plannedVisits}
              </td>
              <td className="px-4 py-2 whitespace-nowrap ">
                {item.actualVisits ?? "N/A"}
              </td>
              <td className="px-4 py-2 whitespace-nowrap ">
                {item.plannedNewCustomers}
              </td>
              <td className="px-4 py-2 whitespace-nowrap ">
                {item.actualNewCustomers ?? "N/A"}
              </td>
              <td className="px-4 py-2 whitespace-nowrap ">
                {item.plannedTransactions}
              </td>
              <td className="px-4 py-2 whitespace-nowrap ">
                {item.actualTransactions ?? "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LastReportTable;
