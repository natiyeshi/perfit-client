"use client";

import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from "recharts";
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
      datas[competitorName] += d.amount;
    });

    const sortedData = Object.entries(datas)
      .sort(([, a], [, b]) => b - a)
      .map(([key, value]) => ({ name: key, value }));

    setChartData(sortedData.slice(0, 4)); // Top 4 competitors
  };

  return (
    <Card className="w-full p-2">
      <CardHeader>
        <CardTitle className="text-center">Top Competitors</CardTitle>
        <CardDescription className="text-center">By Quantity</CardDescription>
        <div className="flex justify-end"></div>
      </CardHeader>

      <CardContent className="">
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
                tickFormatter={(name) => name.length > 10 ? `${name.substring(0, 10)}...` : name}
              />
              <YAxis
                tickFormatter={(value) => {
                  if (value >= 1_000_000) {
                    return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
                  }
                  if (value >= 1_000) {
                    return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
                  }
                  return value.toString();
                }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background p-2 border rounded">
                        <p className="font-medium">{label}</p>
                        <p>{Number(payload[0].value).toLocaleString()}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" fill="#2B8890" radius={8}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                  formatter={(value) => {
                    if (value >= 1_000_000) {
                      return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
                    }
                    if (value >= 1_000) {
                      return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
                    }
                    return value;
                  }}
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
