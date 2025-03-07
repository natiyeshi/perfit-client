"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Sector, Label } from "recharts";

import type { ChartConfig } from "@/components/ui/chart";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
// Import the config here
const chartConfig: ChartConfig = {};

const generateColors = (count: number) => {
  const colors = [
    "hsl(210, 70%, 50%)",
    "hsl(120, 70%, 50%)",
    "hsl(0, 70%, 50%)",
    "hsl(60, 70%, 50%)",
    "hsl(280, 70%, 50%)",
    "hsl(30, 70%, 50%)",
  ];
  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};

export default function TransactionPieChart() {
  const { data, isLoading } = useQuery(
    "sales-persons",
    () => axios.get("/sales-persons"),
    {
      onError(err) {
        console.log(err, "EEEEEEEEEEEEEEEEEE ");
        toast.error("Something goes wrong!!");
      },
    }
  );

  const chartData = useMemo(() => {
    if (!data) return [];

    const colors = generateColors(data?.data?.result?.salsePersonData.length);

    return data?.data?.result?.salsePersonData.map((person, index) => ({
      name: person.user.fullName,
      value: person.transactionCount,
      fill: colors[index],
    }));
  }, [data]);

  const [activeIndex, setActiveIndex] = useState(0);

  if (isLoading)
    return (
      <div>
        <Skeleton className="min-w-[300px] min-h-[150px] flex py-10">
          <Skeleton className="w-[150px] h-[150px] mx-auto rounded-full"></Skeleton>
        </Skeleton>
      </div>
    );

  const activePerson = chartData[activeIndex];

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Sales Contribution Chart</CardTitle>
          <CardDescription>
            Total Transactions: {data?.data?.result?.totalTransactions}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          className="mx-auto aspect-square w-full max-w-[300px]"
          config={chartConfig} // Pass the chartConfig here
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              activeShape={({ outerRadius = 0, ...props }) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan className="fill-foreground text-3xl font-bold">
                          {activePerson?.value ?? 0}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Transactions
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
