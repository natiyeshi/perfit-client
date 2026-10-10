import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import { filterInf } from "../_components/Filter";
import { IDBProduct } from "@/types/IProduct";
import toast from "react-hot-toast";

// Columns the API can sort by (all columns the products table shows).
type ProductSortKey =
  | "brandName"
  | "genericName"
  | "unit"
  | "description"
  | "intendedUse";
const SORTABLE: ProductSortKey[] = [
  "brandName",
  "genericName",
  "unit",
  "description",
  "intendedUse",
];

/**
 * Products table with server-side pagination, search and sort. Previously the
 * whole product list was downloaded and paged/filtered in the browser.
 */
export const useProductTable = () => {
  const [filters, setFilters] = useState<filterInf>({
    name: "",
  });

  // Server-driven table state.
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [debouncedName, setDebouncedName] = useState("");
  // null = the API's default order (brand name A-Z), like before any click.
  const [sortBy, setSortBy] = useState<ProductSortKey | null>(null);
  const [order, setOrder] = useState<"asc" | "desc">("asc");

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

  // Key starts with "products" so the add/update/delete forms'
  // invalidateQueries("products") still refresh this table.
  const query = useQuery(
    ["products", "table", page, limit, debouncedName, sortBy, order],
    () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (sortBy) {
        params.set("sortBy", sortBy);
        params.set("order", order);
      }
      if (debouncedName) params.set("search", debouncedName);
      return axios.get(`/products?${params.toString()}`);
    },
    {
      keepPreviousData: true,
      onError(err) {
        console.log(err, "EEEEEEEEEEEEEEEEEE ");
        toast.error("Something goes wrong!!");
      },
    }
  );

  const products: IDBProduct[] = query.data?.data?.result || [];
  const meta = query.data?.data?.meta as
    | { total: number; page: number; limit: number; totalPages: number }
    | undefined;

  // Same behaviour as the table's client-side sort: a new column sorts A-Z,
  // clicking the same column again flips the order.
  const handleSortChange = (key: keyof IDBProduct) => {
    if (!SORTABLE.includes(key as ProductSortKey)) return;
    if (key === sortBy) {
      setOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key as ProductSortKey);
      setOrder("asc");
    }
    setPage(1);
  };

  const reload = async () => {
    query.refetch();
  };

  return {
    filters,
    products,
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
