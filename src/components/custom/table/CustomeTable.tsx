"use client";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { JSXElementConstructor } from "react";
import Loading from "../loading";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CgOptions } from "react-icons/cg";
import NothingFound from "@/components/custom/NothingFound";
import ShowSchema from "./ShowSchema";
import Link from "next/link";

// Format date helper function
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options).replace(",", "");
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

export interface Header<T> {
  name: string;
  key: keyof T;
  showDetail?: keyof T;
  isLink?: boolean;
  link?: string;
}

/**
 * When `serverPagination` is provided, the table stops slicing/sorting the data
 * itself and instead reflects a page that the server already prepared. `result`
 * is treated as the current page, and paging/sorting are delegated upward.
 * When omitted, the table behaves exactly as before (client-side pagination).
 */
export interface ServerPagination<T> {
  page: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: number) => void;
  sortColumn?: keyof T | null;
  sortOrder?: "asc" | "desc";
  onSortChange?: (key: keyof T) => void;
}

interface CustomeTableProps<T extends { id: string }> {
  query: {
    data: any;
    isLoading: boolean;
    isRefetching: boolean;
    isSuccess: boolean;
  };
  headers: Header<T>[];
  result: T[];
  DeleteItem?: JSXElementConstructor<{ id?: string }> | any;
  UpdateItem?: JSXElementConstructor<{ initialValues?: T }> | any;
  link?: string;
  serverPagination?: ServerPagination<T>;
}

const CustomeTable = <T extends { id: string }>({
  query,
  headers,
  result,
  DeleteItem,
  UpdateItem,
  link,
  serverPagination,
}: CustomeTableProps<T>) => {
  const isServer = !!serverPagination;
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Function to handle sorting logic
  const handleSort = (key: keyof T) => {
    if (isServer) {
      serverPagination!.onSortChange?.(key);
      return;
    }
    if (sortColumn === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(key);
      setSortOrder("asc");
    }
  };

  // Sort the result based on selected column and order (client mode only)
  const sortedResult = useMemo(() => {
    if (isServer) return result;
    return [...result].sort((a, b) => {
      if (!sortColumn) return 0;

      const valueA = a[sortColumn];
      const valueB = b[sortColumn];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      }

      return 0;
    });
  }, [result, sortColumn, sortOrder, isServer]);

  // Effective pagination values — sourced from the server in server mode.
  const effItemsPerPage = isServer ? serverPagination!.itemsPerPage : itemsPerPage;
  const effCurrentPage = isServer ? serverPagination!.page : currentPage;
  const totalItems = isServer ? serverPagination!.totalItems : sortedResult.length;
  const totalPages = isServer
    ? serverPagination!.totalPages
    : Math.ceil(totalItems / itemsPerPage);
  const startIndex = (effCurrentPage - 1) * effItemsPerPage;
  const endIndex = startIndex + effItemsPerPage;
  const paginatedData = isServer
    ? result
    : sortedResult.slice(startIndex, endIndex);
  const activeSortColumn = isServer ? serverPagination!.sortColumn ?? null : sortColumn;
  const activeSortOrder = isServer ? serverPagination!.sortOrder ?? "asc" : sortOrder;

  const handlePageChange = (page: number) => {
    const clamped = Math.max(1, Math.min(page, totalPages || 1));
    if (isServer) {
      serverPagination!.onPageChange(clamped);
    } else {
      setCurrentPage(clamped);
    }
  };

  const handleItemsPerPageChange = (value: number) => {
    if (isServer) {
      serverPagination!.onItemsPerPageChange(value);
    } else {
      setItemsPerPage(value);
      setCurrentPage(1);
    }
  };

  // Render loading state (first load only; server mode keeps prior page visible)
  if (query.isLoading) {
    return <Loading className={"m-auto mt-12"} />;
  }

  // Render empty state
  if ((!isServer && !query.data) || paginatedData.length === 0) {
    return (
      <div className="flex flex-col gap-5 items-center justify-center m-auto mt-12 px-6">
        <NothingFound />
        <div className="text-sm">Nothing Found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-auto pb-16">
        <table className="min-w-full border-b">
          <thead>
            <tr className="text-left border-t text-black bg-white shadow sticky top-0 z-20">
              <th className="px-4 py-2 whitespace-nowrap border-b sticky left-0 text-black">
                -
              </th>
              <th className="px-4 py-2 whitespace-nowrap border-b sticky left-0 text-black">
                No
              </th>
              {link && (
                <th className="px-4 py-2 whitespace-nowrap border-b capitalize">
                  Detail
                </th>
              )}
              {headers.map((value) => (
                <th
                  key={String(value.key)}
                  className="px-4 py-2 whitespace-nowrap border-b cursor-pointer capitalize"
                  onClick={() => handleSort(value.key)}
                >
                  {value.name}{" "}
                  {activeSortColumn === value.key
                    ? activeSortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item: T, index: number) => (
              <tr
                key={index}
                className="group hover:bg-gray-200/20 duration-200"
              >
                <td className="border-b group-hover:bg-gray-200/20 whitespace-nowrap duration-200 sticky left-0 bg-background">
                  <Popover>
                    <PopoverTrigger className="px-4 py-2 hover:bg-gray-200">
                      <CgOptions className="text-lg" />
                    </PopoverTrigger>
                    <PopoverContent className="shadow">
                      <div>Options</div>
                      <div className="flex flex-col gap-1">
                        {DeleteItem && (
                          <DeleteItem id={String(item.id) ?? "-"} />
                        )}
                        {UpdateItem && <UpdateItem initialValues={item} />}
                      </div>
                    </PopoverContent>
                  </Popover>
                </td>
                <td className="border-b whitespace-nowrap px-4 py-2">
                  {startIndex + index + 1}
                </td>
                {link && (
                  <td className="border-b whitespace-nowrap px-4 py-2">
                    <Link
                      href={`${link}/${item.id}`}
                      className="text-blue-500"
                    >
                      🔗
                    </Link>
                  </td>
                )}
                {headers.map((header) => (
                  <td
                    className="border-b whitespace-nowrap duration-200 px-4 py-2 capitalize"
                    key={String(header.key)}
                  >
                    {header.showDetail ? (
                      <ShowSchema
                        type={header.showDetail}
                        data={item[header.showDetail]}
                        text={item[header.key]}
                      />
                    ) : header.isLink ? (
                      <Link
                        href={`${
                          header.link
                            ? header.link
                            : `/dashboard/admin/iodm/${item.id}`
                        }`}
                        className="text-blue-500 hover:underline"
                      >
                        {String(item[header.key])}
                      </Link>
                    ) : (() => {
                      try {
                        const value = item[header.key] as unknown as string;
                        if (value === null || value === undefined) return "-";
                        return typeof value === "string" && 
                          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)
                          ? formatDate(value)
                          : String(value);
                      } catch (error) {
                        console.error("Error rendering cell:", error);
                        return "-";
                      }
                    })()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Items per page:</span>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={effItemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              >
                {[5, 10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span>
                {totalItems === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} items
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={effCurrentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(effCurrentPage - 1)}
                disabled={effCurrentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (effCurrentPage <= 3) {
                  pageNum = i + 1;
                } else if (effCurrentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = effCurrentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={effCurrentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    className={`h-8 w-8 p-0 ${effCurrentPage === pageNum ? 'font-bold' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(effCurrentPage + 1)}
                disabled={effCurrentPage === totalPages || totalPages === 0}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={effCurrentPage === totalPages || totalPages === 0}
                className="h-8 w-8 p-0"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomeTable;