"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
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
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SalesPersonDataResponse } from "../salespersons/page";

// Props for the component
interface SalesGraphProps {
  data: SalesPersonDataResponse;
}

// Chart config for colors
const chartConfig = {
  transactionCount: {
    label: "Transactions",
    color: "#3b82f6",
  },
} satisfies ChartConfig;

function SalesGraph({ data }: SalesGraphProps) {
  // Transform data into the shape Recharts expects
  const chartData = data.salsePersonData.map((salesPerson) => ({
    name: salesPerson.user.fullName,
    transactionCount: salesPerson.transactionCount,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Transactions Chart</CardTitle>
        <CardDescription>
          Total Transactions: {data.totalTransactions}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.split(" ")[0]} // Show only first name
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="transactionCount" fill="#2b838d" radius={8} />
            </BarChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Showing transactions by salesperson <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Total: {data.totalTransactions} transactions
        </div>
      </CardFooter>
    </Card>
  );
}

export default SalesGraph;
