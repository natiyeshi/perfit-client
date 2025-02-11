"use client";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import { filterInf } from "../_components/Filter";
import { IDBClientPipeline, IDBPopulatedPipeline } from "@/types/IPipeline";
import toast, { Toaster } from "react-hot-toast";

export const usePipelineTable = () => {
  const [filters, setFilters] = useState<filterInf>({
    name: "",
  });
  const [pipeline, setPipelines] = useState<IDBClientPipeline[]>([]);
  const [pipelineData, setPipelineData] = useState<IDBClientPipeline[]>([]);

  const filter = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const nameFilter = (data: IDBClientPipeline) => {
    return (
      filters.name.length === 0 ||
      (data.productName &&
        data.productName.toLowerCase().includes(filters.name))
    );
  };

  const statusFilter = (data: IDBClientPipeline) => {
    return (
      filters.status == null ||
      data.productName?.toLowerCase() === filters.status.toLowerCase() ||
      data.lcNumber.toLowerCase() == filters.status.toLowerCase() ||
      data.proformaInvoiceNumber.toLowerCase() == filters.status.toLowerCase()
    );
  };

  const query = useQuery(
    "pipelines",
    () => axios.get("/pipelines?populate=true"),
    {
      onSuccess(data) {
        const k: IDBPopulatedPipeline[] = data.data.result || [];
        const res: IDBClientPipeline[] = [];
        k.map((d) => {
          const r: IDBClientPipeline = {
            ...d,
            productName: d.product.name,
          };
          res.push(r);
        });
        setPipelines(res);
        setPipelineData(res);
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
    setPipelines(() => {
      return pipelineData.filter(
        (data) => nameFilter(data) && statusFilter(data)
      );
    });
  }, [filters, pipelineData]);

  return {
    filters,
    pipeline,
    setFilters,
    filter,
    reload,
    query,
  };
};
