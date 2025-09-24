"use client";

import React from "react";
import axios from "axios";
import { useQuery } from "react-query";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DETAIL_URL = "http://webapp.et:5201/4447673/run/RunDashBoardItemDetailQuery";
const DASHBOARD_ID = "INV_DASHBOARD";
const INVENTORY_BALANCE_SEQ_ID = "fbc55221-1258-468c-9171-08e48c654255";

type DetailResponse = {
  Data: Array<{
    Items: {
      Items: Array<Record<string, any>>;
      Columns: string[];
      RightAlignCols: string[];
    };
    Name: string | null;
  }>;
  AssociateDatas: unknown[];
  EntityCount: number;
  CurrentPage: unknown | null;
  IsSuccess: boolean;
  ErrorMessage: string | null;
};

async function fetchInventoryBalanceDetail(): Promise<{ rows: Array<Record<string, any>>; columns: string[] }> {
  const res = await axios.post<DetailResponse>(DETAIL_URL, {
    DashboardId: DASHBOARD_ID,
    DashboardItemSeqId: INVENTORY_BALANCE_SEQ_ID,
  });
  if (!res.data?.IsSuccess) {
    throw new Error(res.data?.ErrorMessage || "Failed to load detail");
  }
  const first = res.data.Data?.[0]?.Items;
  const rawRows = (first?.Items ?? []).slice();
  // Sort by ATP desc (treat missing/non-numeric as 0)
  rawRows.sort((a: any, b: any) => (Number(b?.ATP ?? 0) || 0) - (Number(a?.ATP ?? 0) || 0));

  // Filter out the "Facility name" column (case-insensitive, normalize spaces)
  const shouldRemove = (name: string) =>
    name?.toString().replace(/\s+/g, " ").trim().toLowerCase() === "facility name";
  const filteredColumns = (first?.Columns ?? []).filter((c) => !shouldRemove(c));

  return {
    rows: rawRows,
    columns: filteredColumns,
  };
}

export default function InventoryBalanceDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { data, isLoading, isError, error, refetch } = useQuery(
    ["inventory-balance-detail"],
    fetchInventoryBalanceDetail,
    {
      enabled: open,
    }
  );

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-5xl">
        {/* Top-right close */}
        <div className="absolute right-3 top-3">
          <AlertDialogCancel className="h-8 w-8 rounded-full p-0 text-muted-foreground hover:text-foreground">✕</AlertDialogCancel>
        </div>

        <AlertDialogHeader>
          <AlertDialogTitle className="text-base">Inventory Balance</AlertDialogTitle>
          <AlertDialogDescription className="text-xs">
            Detailed inventory balance by product and facility
          </AlertDialogDescription>
        </AlertDialogHeader>

        {isLoading ? (
          <div className="h-24 animate-pulse rounded bg-muted" />
        ) : isError ? (
          <div className="text-sm">
            <div className="text-red-600 mb-3">{(error as Error)?.message || "Failed to load"}</div>
            <button onClick={() => refetch()} className="rounded border px-3 py-1 text-xs">Retry</button>
          </div>
        ) : (
          <div className="max-h-[70vh] overflow-auto text-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  {(data?.columns ?? []).map((col) => (
                    <TableHead key={col} className="py-2 px-3 text-xs">{col}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.rows ?? []).map((row, idx) => (
                  <TableRow key={idx}>
                    {(data?.columns ?? []).map((col) => (
                      <TableCell key={col} className="py-2 px-3 text-xs">{String(row[col] ?? "")}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
