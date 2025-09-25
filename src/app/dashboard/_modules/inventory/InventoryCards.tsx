"use client";

import React from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DashboardResponse, DashboardItem } from "./types";
import InventoryBalanceDialog from "./popups/InventoryBalanceDialog";
import OutOfStockDialog from "./popups/OutOfStockDialog";
import ExpiredIn9MonthsDialog from "./popups/ExpiredIn9MonthsDialog";
import ExpiredIn6MonthsDialog from "./popups/ExpiredIn6MonthsDialog";
import ExpiredIn3MonthsDialog from "./popups/ExpiredIn3MonthsDialog";

const INVENTORY_DASHBOARD_URL = "/api/proxy/ListRunDashBoardItemsQuery";

async function fetchInventoryDashboard(): Promise<DashboardItem[]> {
  const res = await axios.post<DashboardResponse>(INVENTORY_DASHBOARD_URL, {
    DashBoardId: "INV_DASHBOARD",
  });
  if (!res.data?.IsSuccess) {
    throw new Error(res.data?.ErrorMessage || "Failed to load inventory dashboard");
  }
  return res.data.Data?.Items ?? [];
}

function colorToClasses(color?: string | null) {
  if (!color) return "bg-muted";
  const c = color.toLowerCase().trim();
  switch (c) {
    case "maroon":
      return "bg-red-950 text-white";
    case "darkblue":
    case "blue":
      return "bg-blue-900 text-white";
    case "gray":
    case "grey":
      return "bg-gray-700 text-white";
    default:
      return "bg-muted";
  }
}

const InventoryCards: React.FC = () => {
  const [balanceOpen, setBalanceOpen] = React.useState(false);
  const [outOfStockOpen, setOutOfStockOpen] = React.useState(false);
  const [expired9Open, setExpired9Open] = React.useState(false);
  const [expired6Open, setExpired6Open] = React.useState(false);
  const [expired3Open, setExpired3Open] = React.useState(false);
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery(
    ["inventory-dashboard-items"],
    fetchInventoryDashboard,
    {
      staleTime: 60_000,
    }
  );

  if (isLoading) {
    return (
      <div className="col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Loading Inventory…</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-16 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-red-600 text-sm">
              {(error as Error)?.message || "Failed to load inventory"}
            </div>
            <button
              onClick={() => refetch()}
              className="mt-3 inline-flex items-center rounded-md border px-3 py-1 text-sm"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const items = data ?? [];

  if (!items.length) {
    return (
      <div className="col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
          </CardHeader>
          <CardContent>No data</CardContent>
        </Card>
      </div>
    );
  }

  // Categorize items: Expirations vs Others
  const expirationItems = items.filter((i) =>
    (i.Title || "").toLowerCase().includes("expired")
  );
  const otherItems = items.filter(
    (i) => !(i.Title || "").toLowerCase().includes("expired")
  );

  return (
    <div className="col-span-3">
      {/* Expirations Category */}
      {expirationItems.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-3 text-xl font-semibold">Expirations</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {expirationItems.map((item) => (
              <Card
                key={item.DashboardItemSeqId}
                className="cursor-pointer"
                onClick={() => {
                  const title = (item.Title || "").trim().toLowerCase();
                  if (title === "inventory balance") {
                    setBalanceOpen(true);
                  } else if (title === "out of stock") {
                    setOutOfStockOpen(true);
                  } else if (title === "expired in 9 months") {
                    setExpired9Open(true);
                  } else if (title === "expired in 6 months") {
                    setExpired6Open(true);
                  } else if (title === "expired in 3 months") {
                    setExpired3Open(true);
                  } else {
                    alert(title)
                  }
                }}
              >
                <CardHeader className={cn("py-4", colorToClasses(item.Color))}>
                  <CardTitle className="flex items-center justify-between">
                    <span>{item.Title}</span>
                    {item.ComponentTypeId === "CARD" && (
                      <span className="text-2xl font-bold">{item.CardValue}</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {item.ComponentTypeId === "CARD" ? (
                    <div className="text-5xl font-bold">{item.CardValue}</div>
                  ) : (
                    <pre className="whitespace-pre-wrap text-xs opacity-70">
                      {item.Description || ""}
                    </pre>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Other Category */}
      {otherItems.length > 0 && (
        <div>
          <h3 className="mb-3 text-xl font-semibold">Other</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {otherItems.map((item) => (
              <Card
                key={item.DashboardItemSeqId}
                className="cursor-pointer"
                onClick={() => {
                  const title = (item.Title || "").trim().toLowerCase();
                  if (title === "inventory balance") {
                    setBalanceOpen(true);
                  }  else if (title === "out of stock") {
                    setOutOfStockOpen(true);
                  } else if (title === "expired in 9 months") {
                    setExpired9Open(true);
                  } else if (title === "expired in 6 months") {
                    setExpired6Open(true);
                  }  else if (title === "expired in 3 months") {
                    setExpired3Open(true);
                  } else {
                    alert(title)
                  }
                }}
              >
                <CardHeader className={cn("py-4", colorToClasses(item.Color))}>
                  <CardTitle className="flex items-center justify-between">
                    <span>{item.Title}</span>
                    {item.ComponentTypeId === "CARD" && (
                      <span className="text-2xl font-bold">{item.CardValue}</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {item.ComponentTypeId === "CARD" ? (
                    <div className="text-5xl font-bold">{item.CardValue}</div>
                  ) : (
                    <pre className="whitespace-pre-wrap text-xs opacity-70">
                      {item.Description || ""}
                    </pre>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      <InventoryBalanceDialog open={balanceOpen} onOpenChange={setBalanceOpen} />
      <OutOfStockDialog open={outOfStockOpen} onOpenChange={setOutOfStockOpen} />
      <ExpiredIn9MonthsDialog open={expired9Open} onOpenChange={setExpired9Open} />
      <ExpiredIn6MonthsDialog open={expired6Open} onOpenChange={setExpired6Open} />
      <ExpiredIn3MonthsDialog open={expired3Open} onOpenChange={setExpired3Open} />
    </div>
  );
};

export default InventoryCards;
