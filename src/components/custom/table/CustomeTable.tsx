"use client";
import { useState } from "react";
import { JSXElementConstructor, Key } from "react";
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
  const sortedResult = [...result].sort((a, b) => {
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

  return (
    <>
      <table className="min-w-full border-b ">
        <thead>
          <tr className="text-left border-t text-black bg-white shadow sticky top-0 z-20">
            <th className="px-4 py-2  whitespace-nowrap border-b sticky left-0 text-black">
              -
            </th>
            <th className="px-4 py-2   whitespace-nowrap border-b sticky left-0 text-black">
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
                className="px-4 py-2 whitespace-nowrap border-b cursor-pointer  capitalize"
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
          {query.isLoading ? (
            <></>
          ) : query.data ? (
            sortedResult.map((item: T, index: number) => (
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
                          <DeleteItem id={String(item.id!) ?? "-"} />
                        )}
                        {UpdateItem && <UpdateItem initialValues={item} />}
                      </div>
                    </PopoverContent>
                  </Popover>
                </td>
                <td className="border-b whitespace-nowrap px-4 py-2">
                  {index + 1}
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
                        {item[header.key] as unknown as string}
                      </Link>
                    ) : (
                      (() => {
                        const value = item[header.key] as unknown as string;
                        return typeof value === "string" &&
                          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(
                            value
                          )
                          ? formatDate(value)
                          : String(value) ?? "-";
                      })()
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <></>
          )}
        </tbody>
      </table>
      {query.isLoading ? (
        <div className="flex flex-col gap-5 items-center justify-center  m-auto mt-12 px-6">
          <Loading className="m-auto" />
        </div>
      ) : (
        !query.isRefetching &&
        result.length === 0 && (
          <div className="flex flex-col gap-5 items-center justify-center  m-auto mt-12 px-6">
            <NothingFound />
            <div className="text-sm">Nothing Found</div>
          </div>
        )
      )}
    </>
  );
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options).replace(",", "");
};

export default CustomeTable;
