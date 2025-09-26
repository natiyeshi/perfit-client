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
}

const CustomeTable = <T extends { id: string }>({
  query,
  headers,
  result,
  DeleteItem,
  UpdateItem,
  link,
}: CustomeTableProps<T>) => {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Function to handle sorting logic
  const handleSort = (key: keyof T) => {
    if (sortColumn === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(key);
      setSortOrder("asc");
    }
  };

  // Sort the result based on selected column and order
  const sortedResult = useMemo(() => {
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
  }, [result, sortColumn, sortOrder]);

  // Pagination logic
  const totalItems = sortedResult.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedResult.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // Render loading state
  if (query.isLoading ) {
    return <Loading className={"m-auto mt-12"} />;
  }

  // Render empty state
  if (!query.data || paginatedData.length === 0) {
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
                  {sortColumn === value.key
                    ? sortOrder === "asc"
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
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              >
                {[5, 10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span>
                {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} items
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    className={`h-8 w-8 p-0 ${currentPage === pageNum ? 'font-bold' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
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