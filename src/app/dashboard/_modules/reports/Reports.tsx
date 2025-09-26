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
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { IDBPopulatedImport } from "@/types/IImport";
import { IDBProductWithPrice } from "@/types/IProductWithPrice";

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

const extractReportData = (imports: IDBPopulatedImport[]) => {
  if (!imports || imports.length === 0) return { customerSales: [], productSales: [] };

  const customerSalesMap = new Map<string, { sales: number; transactions: number }>();
  const productSalesMap = new Map<string, ProductSalesData>();

  imports.forEach((importItem) => {
    // Process customer sales
    const customerName = importItem.competitor?.name || 'Unknown';
    const saleAmount = importItem.amount || 0;
    
    // Update customer sales
    if (customerSalesMap.has(customerName)) {
      const existing = customerSalesMap.get(customerName)!;
      customerSalesMap.set(customerName, {
        sales: existing.sales + saleAmount,
        transactions: existing.transactions + 1
      });
    } else {
      customerSalesMap.set(customerName, {
        sales: saleAmount,
        transactions: 1
      });
    }

    // Process product sales
    if (importItem.products && importItem.products.length > 0) {
      importItem.products.forEach((productItem: IDBProductWithPrice) => {
        const productId = productItem.product?.id || 'unknown';
        const productName = productItem.product?.genericName || 'Unknown Product';
        const unit = productItem.product?.unit || 'pcs';
        const quantity = productItem.quantity || 0;
        const amount = (productItem.unitPrice || 0) * quantity;

        if (productSalesMap.has(productId)) {
          const existing = productSalesMap.get(productId)!;
          productSalesMap.set(productId, {
            ...existing,
            soldQuantity: existing.soldQuantity + quantity,
            soldAmount: existing.soldAmount + amount
          });
        } else {
          productSalesMap.set(productId, {
            id: productId,
            name: productName,
            unit,
            soldQuantity: quantity,
            soldAmount: amount
          });
        }
      });
    }
  });

  // Convert maps to sorted arrays
  const customerSales: CustomerSalesData[] = Array.from(customerSalesMap.entries())
    .map(([name, info]) => ({
      name,
      sales: info.sales,
      transactions: info.transactions,
      averageSale: info.sales / info.transactions
    }))
    .sort((a, b) => b.sales - a.sales);

  const productSales = Array.from(productSalesMap.values())
    .sort((a, b) => b.soldAmount - a.soldAmount);

  return { customerSales, productSales };
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

  const [reportData, setReportData] = useState<IDBPopulatedImport[]>([]);
  const query = useQuery(
    "competitor-imports",
    () => axios.get("/competitor-imports?populate=true"),
    {
      onSuccess(data) {
        const result: IDBPopulatedImport[] = data.data.result || [];
        setReportData(result);
      },
      onError(err) {
        console.error("Error fetching dashboard data:", err);
        toast.error("Failed to load report data");
      },
    }
  );

  const { customerSales, productSales } = useMemo(() => {
    return extractReportData(reportData);
  }, [reportData]);

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
