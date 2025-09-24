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
const EXPIRED_6M_SEQ_ID = "4746eb87-2426-472a-bcb6-980a57a7983c";

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

function deriveColumns(items: Array<Record<string, any>>, columnsFromApi?: string[]) {
  const cols = (columnsFromApi || []).filter((c) => c && c.trim().length > 0);
  if (cols.length > 0) return cols;
  const first = items?.[0] || {};
  const keys = Object.keys(first);
  const preferred = ["Product Number", "Product Name"]; // prefer number then name
  const ordered = preferred.filter((p) => keys.includes(p));
  const rest = keys.filter((k) => !ordered.includes(k));
  return [...ordered, ...rest];
}

async function fetchExpired6MDetail(): Promise<{ rows: Array<Record<string, any>>; columns: string[] }> {
  const res = await axios.post<DetailResponse>(DETAIL_URL, {
    DashboardId: DASHBOARD_ID,
    DashboardItemSeqId: EXPIRED_6M_SEQ_ID,
  });
  if (!res.data?.IsSuccess) {
    throw new Error(res.data?.ErrorMessage || "Failed to load detail");
  }
  const first = res.data.Data?.[0]?.Items;
  const rows = first?.Items ?? [];
  const columns = deriveColumns(rows, first?.Columns);
  return { rows, columns };
}

export default function ExpiredIn6MonthsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { data, isLoading, isError, error, refetch } = useQuery(
    ["inventory-expired-6m-detail"],
    fetchExpired6MDetail,
    {
      enabled: open,
    }
  );

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-3xl">
        {/* Top-right close */}
        <div className="absolute right-3 top-3">
          <AlertDialogCancel className="h-8 w-8 rounded-full p-0 text-muted-foreground hover:text-foreground">✕</AlertDialogCancel>
        </div>

        <AlertDialogHeader>
          <AlertDialogTitle className="text-base">Expired in 6 Months</AlertDialogTitle>
          <AlertDialogDescription className="text-xs">
            Products expiring within 6 months
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
