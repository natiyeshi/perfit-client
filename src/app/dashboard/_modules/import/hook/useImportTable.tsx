"use client";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import { filterInf } from "../_components/Filter";
import { IDBClientImport, IDBPopulatedImport } from "@/types/IImport";
import toast from "react-hot-toast";

// Map the human date filter to a concrete number of days for the API.
const dateFilterToDays = (value: string | null): number | undefined => {
  switch (value) {
    case "last month":
      return 30;
    case "last 3 months":
      return 90;
    case "last 6 months":
      return 180;
    case "this 12 months":
      return 365;
    default:
      return undefined; // "all" / null -> no date constraint
  }
};

// Only these table columns can be sorted by the database.
const SORTABLE: Record<string, "date" | "amount"> = {
  date: "date",
  amount: "amount",
  totalPrice: "amount",
};

export const useImportTable = () => {
  const [filters, setFilters] = useState<filterInf>({
    name: "",
    date: null,
  });

  // Server-driven table state.
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [debouncedName, setDebouncedName] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const filter = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Debounce the search box so we don't hit the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedName(filters.name.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [filters.name]);

  // Reset to the first page whenever the date filter changes.
  const days = dateFilterToDays(filters.date);
  useEffect(() => {
    setPage(1);
  }, [filters.date]);

  const query = useQuery(
    ["competitor-imports", page, limit, debouncedName, days, sortBy, order],
    () => {
      const params = new URLSearchParams();
      params.set("populate", "true");
      params.set("page", String(page));
      params.set("limit", String(limit));
      params.set("sortBy", sortBy);
      params.set("order", order);
      if (debouncedName) params.set("search", debouncedName);
      if (days) params.set("days", String(days));
      return axios.get(`/competitor-imports?${params.toString()}`);
    },
    {
      keepPreviousData: true,
      onError(err) {
        console.log(err, "import table fetch error");
        toast.error("Something goes wrong!!");
      },
    }
  );

  // Transform only the current page of rows for display.
  const imports: IDBClientImport[] = useMemo(() => {
    const rows: IDBPopulatedImport[] = query.data?.data?.result || [];
    return rows.map((d) => {
      const newDate = new Date(d.date!);
      const da = `${newDate
        .toLocaleString("en-US", { month: "short" })
        .toLowerCase()}-${newDate.getDate()}, ${newDate.getFullYear()}`;
      const a = d.products.map((p) => p.product.brandName);
      return {
        ...d,
        productName: `${d.products.length} Products`,
        supplierName:
          d.supplier.manufacturerName && d.supplier.manufacturerName.length > 15
            ? d.supplier.manufacturerName.slice(0, 15) + "..."
            : d.supplier.manufacturerName,
        competitorName:
          d.competitor.name && d.competitor.name.length > 15
            ? d.competitor.name.slice(0, 15) + "..."
            : d.competitor.name,
        totalPrice: d.amount,
        date: da,
        showProducts: a,
      } as IDBClientImport;
    });
  }, [query.data]);

  const meta = query.data?.data?.meta as
    | { total: number; page: number; limit: number; totalPages: number; sumAmount: number }
    | undefined;

  const handleSortChange = (key: keyof IDBClientImport) => {
    const mapped = SORTABLE[String(key)];
    if (!mapped) return; // non-sortable column, ignore
    if (mapped === sortBy) {
      setOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(mapped);
      setOrder("desc");
    }
    setPage(1);
  };

  const reload = async () => {
    query.refetch();
  };

  return {
    filters,
    imports,
    setFilters,
    filter,
    reload,
    query,
    // pagination
    page,
    setPage,
    limit,
    setLimit,
    meta,
    sortBy,
    order,
    handleSortChange,
  };
};
