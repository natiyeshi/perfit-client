"use client";

import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Sample transaction data (you can replace it with your real data)
const transactionData = [
  {
    id: "cm7c13nsr0001sbas7awpqs0g",
    quantity: 4,
    withCredit: true,
    isFinalized: false,
    finalizedDate: null,
    unitPrice: 3,
    createdAt: "2025-01-10T14:48:50.752Z",
  },
  {
    id: "cm7c20xog0003sbasfzey86zz",
    quantity: 21,
    withCredit: false,
    isFinalized: true,
    finalizedDate: "2025-02-19T15:14:43.417Z",
    unitPrice: 19,
    createdAt: "2025-02-19T15:14:43.457Z",
  },
  {
    id: "cm7xmbrwz0001sb24l3kvw534",
    quantity: 5,
    withCredit: true,
    isFinalized: false,
    finalizedDate: null,
    unitPrice: 4,
    createdAt: "2025-03-06T17:26:11.113Z",
  },
  {
    id: "cm8abc1234",
    quantity: 15,
    withCredit: false,
    isFinalized: true,
    finalizedDate: "2025-04-10T10:00:00.000Z",
    unitPrice: 10,
    createdAt: "2025-04-10T10:00:00.000Z",
  },
  {
    id: "cm8def5678",
    quantity: 30,
    withCredit: true,
    isFinalized: false,
    finalizedDate: null,
    unitPrice: 12,
    createdAt: "2025-05-15T09:30:00.000Z",
  },
];

// Helper to group transactions by month and calculate total sales
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Process data to aggregate total sales per month
const currentYear = 2025;
const monthlyData = months.map((month, index) => {
  const monthTransactions = transactionData.filter((t) => {
    const date = new Date(t.createdAt);
    return date.getFullYear() === currentYear && date.getMonth() === index;
  });

  const totalSales = monthTransactions.reduce(
    (sum, t) => sum + t.quantity * t.unitPrice,
    0
  );

  return {
    month,
    sales: totalSales,
  };
});

export default function TransactionLineChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Transactions Overview</CardTitle>
        <CardDescription>January - December {currentYear}</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer
          config={{
            sales: {
              label: "Sales",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-full w-full"
        >
          <ResponsiveContainer
            className="w-full"
            width="100%"
            height="100%"
          >
            <LineChart
              data={monthlyData}
              margin={{ top: 20, left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                dataKey="sales"
                type="natural"
                stroke="#2B8890"
                strokeWidth={2}
                dot={{ fill: "#2B8890" }}
                activeDot={{ r: 6 }}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up this year <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total sales for the year {currentYear}
        </div>
      </CardFooter>
    </Card>
  );
}
