"use client";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import { filterInf } from "../_components/Filter";
import {
  IDBClientCostBuildUp,
  IDBPopulatedCostBuildUp,
} from "@/types/ICostbuildup";
import toast, { Toaster } from "react-hot-toast";

export const useCostTable = () => {
  const [filters, setFilters] = useState<filterInf>({
    name: "",
  });
  const [imports, setImports] = useState<IDBClientCostBuildUp[]>([]);
  const [importsData, setImportsData] = useState<IDBClientCostBuildUp[]>([]);

  const filter = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const nameFilter = (data: IDBClientCostBuildUp) => {
    return (
      filters.name.length === 0
      // (data.productName &&
      //   data.productName.toLowerCase().includes(filters.name)) ||
      // (data.supplierName &&
      //   data.supplierName.toLowerCase().includes(filters.name))
    );
  };

  const statusFilter = (data: IDBClientCostBuildUp) => {
    return filters.status == null;
  };

  const query = useQuery("CostBuildUp", () => axios.get("/cost-buildup?populate=true"), {
    onSuccess(data) {
      let k: IDBPopulatedCostBuildUp[] = data.data.result || [];
      const res: IDBClientCostBuildUp[] = [];
      k.map((d) => {
        let r: IDBClientCostBuildUp = {
          ...d,
          numberOfProducts : 2,
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
  });

  const reload = async () => {
    query.refetch();
  };

  // useEffect(() => {
  //   setImports(() => {
  //     return importsData.filter(
  //       (data) => nameFilter(data) && statusFilter(data)
  //     );
  //   });
  // }, [filters, importsData]);

  useEffect(() => {
    setImports(() => {
      return importsData.filter(
        (data) => nameFilter(data) && statusFilter(data)
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
