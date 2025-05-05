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
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ITransaction } from "@/types/ITransaction";

const Reports = () => {
  const tabs = ["Customer Sales", "Transaction By Product"];
  const [currentTab, setCurrentTab] = useState("Customer Sales");

  const { data, isLoading, error } = useQuery("transactions", async () => {
    const response = await axios.get("transactions?populate=true");
    return response.data.result;
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  const customerSales = Array.isArray(data)
    ? data.reduce((acc: any, transaction: any) => {
        const customerName = transaction.customer.organizationName;
        const sales = transaction.quantity * transaction.unitPrice;

        if (!acc[customerName]) {
          acc[customerName] = { sales: 0 };
        }
        acc[customerName].sales += sales;

        return acc;
      }, {})
    : {};

  const totalSales = Object.values(customerSales).reduce(
    (sum: number, customer: any) => sum + customer.sales,
    0
  );

  const customerData = Object.entries(customerSales).map(
    ([name, info]: any) => ({
      name,
      sales: info.sales,
      percentage: ((info.sales / totalSales) * 100).toFixed(2),
    })
  );

  
  return (
    <div className="mt-6 col-span-3">
      <div className="flex gap-5  mb-4">
        {tabs.map((tab, index) => (
          <Button
            key={index}
            variant={currentTab === tab ? "default" : "outline"}
            className="tab-button"
            size={"sm"}
            onClick={() => setCurrentTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>
      {currentTab == "Customer Sales" && (
        <CustomerSales customerData={customerData} />
      )}
      {currentTab == "Transaction By Product" && (
        <TransactionByProduct transactions={data} />
      )}
    </div>
  );
};

const CustomerSales = ({ customerData }: { customerData: any }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer Name</TableHead>
          <TableHead>Sales (Birr)</TableHead>
          <TableHead>Percentage of Total Sales</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customerData.map((customer, index) => (
          <TableRow key={index}>
            <TableCell>{customer.name}</TableCell>
            <TableCell>{customer.sales}</TableCell>
            <TableCell>{customer.percentage}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const TransactionByProduct = ({ transactions }: { transactions: any[] }) => {
  const productSales = transactions.reduce((acc: any, transaction: any) => {
    const productName = transaction.product.name;
    const soldQuantity = transaction.quantity;
    const soldAmount = transaction.quantity * transaction.unitPrice;

    if (!acc[productName]) {
      acc[productName] = { soldQuantity: 0, soldAmount: 0 };
    }
    acc[productName].soldQuantity += soldQuantity;
    acc[productName].soldAmount += soldAmount;

    return acc;
  }, {});

  const productData = Object.entries(productSales).map(([name, info]: any) => ({
    name,
    soldQuantity: info.soldQuantity,
    soldAmount: info.soldAmount,
  }));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product Name</TableHead>
          <TableHead>Sold Quantity</TableHead>
          <TableHead>Sold Amount (Birr)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {productData.map((product, index) => (
          <TableRow key={index}>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.soldQuantity}</TableCell>
            <TableCell>{product.soldAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};



export default Reports;
