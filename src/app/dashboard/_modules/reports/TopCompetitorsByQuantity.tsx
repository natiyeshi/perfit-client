"use client";

import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, CartesianGrid, LabelList } from "recharts";
import { subMonths, isAfter } from "date-fns";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IDBPopulatedImport } from "@/types/IImport";

type TimeChoice =
  | "all"
  | "last month"
  | "last 3 months"
  | "last 6 months"
  | "this 12 months";

export type TopCompetitorFilterState = {
  time: TimeChoice;
};

interface ChartData {
  name: string;
  value: number;
}

const chartConfig = {
  value: {
    label: "Quantity",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const TopCompetitorsByQuantity = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const { data, isLoading, isError } = useQuery(
    ["competitor-imports"],
    () => axios.get("/competitor-imports?populate=true").then((res) => res.data),
    {
      onError(err) {
        console.log(err, "EEEEEEEEEEEEEEEEEE");
        toast.error("Something went wrong while fetching data!");
      },
    }
  );

  useEffect(() => {
    if (data?.result) {
      processChartData(data.result);
    }
  }, [data]);

  const processChartData = (importsData: IDBPopulatedImport[]) => {
    const datas: Record<string, number> = {};
    importsData.forEach((d) => {
      const competitorName = d.competitor?.name ?? "Unknown";
      if (!datas[competitorName]) {
        datas[competitorName] = 0;
      }
      datas[competitorName] += d.quantity;
    });

    const sortedData = Object.entries(datas)
      .sort(([, a], [, b]) => b - a)
      .map(([key, value]) => ({ name: key, value }));

    setChartData(sortedData.slice(0, 4)); // Top 4 competitors
  };

  return (
    <Card className="w-full h-[70vh]">
      <CardHeader>
        <CardTitle className="text-center">Top Competitors</CardTitle>
        <CardDescription className="text-center">By Quantity</CardDescription>
        <div className="flex justify-end"></div>
      </CardHeader>

      <CardContent className="h-[50vh]">
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : isError ? (
          <div className="text-center text-red-500">Failed to load data.</div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="value" fill="#2B8890" radius={8}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        Top 4 competitors based on import quantity
      </CardFooter>
    </Card>
  );
};

export default TopCompetitorsByQuantity;
