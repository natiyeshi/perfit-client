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
import toast from "react-hot-toast";

interface ProductSalesData {
  id: string;
  name: string;
  soldQuantity: number;
  soldAmount: number;
  unit: string;
}

interface CustomerSalesData {
  name: string;
  sales: number;
  transactions: number;
  averageSale: number;
  percentage?: string;
}

interface CustomerSalesProps {
  customerData: Array<{
    name: string;
    sales: number;
    percentage: string;
  }>;
}

interface TransactionByProductProps {
  products: ProductSalesData[];
}

const fetchDashboard = async () => {
  const response = await axios.get("maraki/dashboard");
  return response.data;
};

interface CustomerSalesData {
  name: string;
  sales: number;
  transactions: number;
  averageSale: number;
}

interface TransactionByProductProps {
  products: ProductSalesData[];
}

const TransactionByProduct = ({ products }: TransactionByProductProps) => {
  if (products.length === 0) {
    return <div className="text-center text-muted-foreground py-4">No product sales data available</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50%]">Product Name</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Unit</TableHead>
            <TableHead className="text-right">Total (ETB)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="text-right">{product.soldQuantity.toLocaleString()}</TableCell>
              <TableCell className="text-right">{product.unit}</TableCell>
              <TableCell className="text-right font-medium">
                {product.soldAmount.toLocaleString('en-ET', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const CustomerSales = ({ customerData }: CustomerSalesProps) => {
  if (customerData.length === 0) {
    return <div className="text-center text-muted-foreground py-4">No customer sales data available</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50%]">Customer</TableHead>
            <TableHead className="text-right">Total Sales</TableHead>
            <TableHead className="text-right">% of Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customerData.map((customer, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell className="text-right font-medium">
                {customer.sales.toLocaleString('en-ET', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {customer.percentage}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const Reports = () => {
  const tabs = ["Customer Sales", "Product Sales"];
  const [currentTab, setCurrentTab] = useState(tabs[0]);

  // Customer/product totals are aggregated in Postgres; previously every
  // import (~7 MB) was downloaded and summed here.
  const query = useQuery(
    "dashboard-report",
    () => axios.get("/competitor-imports/analytics/dashboard-report"),
    {
      onError(err) {
        console.error("Error fetching dashboard data:", err);
        toast.error("Failed to load report data");
      },
    }
  );

  const customerSales: CustomerSalesData[] = query.data?.data.result?.customerSales || [];
  const productSales: ProductSalesData[] = query.data?.data.result?.productSales || [];

  if (query.isLoading) return <div className="mt-6 text-center">Loading...</div>;
  if (query.isError) return <div className="mt-6 text-center text-red-500">Failed to load report data</div>;
  
  const totalSales = customerSales.reduce((sum, customer) => sum + customer.sales, 0);

  return (
    <div className="mt-6 col-span-3">
      <div className="flex gap-5 mb-4">
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant={currentTab === tab ? "default" : "outline"}
            className="tab-button"
            size="sm"
            onClick={() => setCurrentTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>
      
      {currentTab === "Customer Sales" && (
        <CustomerSales 
          customerData={customerSales.map((customer) => ({
            ...customer,
            percentage: ((customer.sales / totalSales) * 100).toFixed(2)
          }))} 
        />
      )}
      
      {currentTab === "Product Sales" && (
        <TransactionByProduct products={productSales} />
      )}
    </div>
  );
};

export default Reports;
