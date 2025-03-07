"use client";

import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";

interface SalesData {
  id: string;
  quantity: number;
  withCredit: boolean;
  isFinalized: boolean;
  finalizedDate: string | null;
  unitPrice: number;
  customerId: string;
  productId: string;
  salesPersonId: string;
  createdAt: string;
  salesPerson: {
    userId: string;
  };
}

// Sample sales data
const salesData: SalesData[] = [
  // (your sales data here)
];

const chartConfig = {
  transactions: {
    label: "Transactions",
    color: "#2b838d",
  },
  totalSales: {
    label: "Total Sales",
    color: "#2b838d",
  },
} satisfies ChartConfig;

export default function TransactionGraph({
  transactionData,
}: {
  transactionData: SalesData[];
}) {
  function aggregateData(salesData: SalesData[]) {
    const aggregatedData: {
      [key: string]: { transactions: number; totalSales: number };
    } = {};

    salesData.forEach((sale) => {
      const date = new Date(sale.createdAt).toLocaleDateString();

      if (!aggregatedData[date]) {
        aggregatedData[date] = { transactions: 0, totalSales: 0 };
      }

      aggregatedData[date].transactions += 1;
      aggregatedData[date].totalSales += sale.quantity * sale.unitPrice;
    });

    return Object.keys(aggregatedData).map((date) => ({
      date,
      transactions: aggregatedData[date].transactions,
      totalSales: aggregatedData[date].totalSales,
    }));
  }

  const chartData = aggregateData(transactionData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart - Transactions & Total Sales</CardTitle>
        <CardDescription>February - March 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={chartData}
              margin={{
                left: 12,
                right: 12,
                top: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(5)}
              />
              <Tooltip content={<ChartTooltip />} />
              <Line
                dataKey="transactions"
                type="monotone"
                stroke="var(--primary)"
                fill="#2b838d"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="totalSales"
                type="monotone"
                stroke="var(--primary)"
                fill="#2b838d"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total transactions and sales for the last month
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
