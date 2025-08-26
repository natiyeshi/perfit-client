"use client";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import { filterInf } from "../_components/Filter";
import { IDBClientImport, IDBPopulatedImport } from "@/types/IImport";
import toast, { Toaster } from "react-hot-toast";

export const useImportTable = () => {
  const [filters, setFilters] = useState<filterInf>({
    name: "",
    date: null,
  });
  const [imports, setImports] = useState<IDBClientImport[]>([]);
  const [importsData, setImportsData] = useState<IDBClientImport[]>([]);

  const filter = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const nameFilter = (data: IDBClientImport) => {
    return (
      filters.name.length === 0 ||
      // (data.productName &&
      //   data.productName.toLowerCase().includes(filters.name)) ||
      (data.competitorName &&
        data.competitorName.toLowerCase().includes(filters.name)) ||
      (data.supplierName &&
        data.supplierName.toLowerCase().includes(filters.name))
    );
  };

  const dateFilter = (data: IDBClientImport) => {
    return (
      filters.date == null || 
      filters.date == "all" || 
      (filters.date == "last month" &&
        new Date(data.createdAt) >= new Date(new Date().setMonth(new Date().getMonth() - 1))) ||
      (filters.date == "last 3 months" &&
        new Date(data.createdAt) >= new Date(new Date().setMonth(new Date().getMonth() - 3))) ||
      (filters.date == "last 6 months" &&
        new Date(data.createdAt) >= new Date(new Date().setMonth(new Date().getMonth() - 6))) ||
      (filters.date == "this 12 months" &&
        new Date(data.createdAt) >= new Date(new Date().setMonth(new Date().getMonth() - 12)))
    );
  };

  const query = useQuery(
    "competitor-imports",
    () => axios.get("/competitor-imports?populate=true"),
    {
      onSuccess(data) {
        let k: IDBPopulatedImport[] = data.data.result || [];
        const res: IDBClientImport[] = [];
        k.map((d) => {
          const newDate = new Date(d.date!);
          const da = `${newDate.toLocaleString('en-US', { month: 'short' }).toLowerCase()}-${newDate.getDate()}, ${newDate.getFullYear()}`
          const a = d.products.map((p)=>p.product.brandName)
          let r: IDBClientImport = {
            ...d,
            productName: `${d.products.length} Products`,
            supplierName: d.supplier.manufacturerName && d.supplier.manufacturerName.length > 15 ? d.supplier.manufacturerName.slice(0, 15) + "..." : d.supplier.manufacturerName,
            competitorName: d.competitor.name && d.competitor.name.length > 15 ? d.competitor.name.slice(0, 15) + "..." : d.competitor.name,
            totalPrice: d.amount,
            date : da,
            showProducts : a
          };
          res.push(r);
        });
        setImports(res);
        setImportsData(res);
      },
      onError(err) {
        console.log(err, "EEEEEEEEEEEEEEEEEE ");
        toast.error("Something goes wrong!!");
      },
    }
  );

  const reload = async () => {
    query.refetch();
  };

  useEffect(() => {
    setImports(() => {
      return importsData.filter(
        (data) => nameFilter(data) && dateFilter(data)
      );
    });
  }, [filters, importsData]);

  return {
    filters,
    imports,
    setFilters,
    filter,
    reload,
    query,
  };
};
