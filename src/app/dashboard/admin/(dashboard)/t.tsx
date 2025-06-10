"use client";

import { useQuery } from "react-query";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

const T = () => {
  const [total, setTotal] = useState(0);
  const { data, isLoading, isSuccess } = useQuery(
    ["inventories"],
    () => axios.get("/inventories?populate=true").then((res) => res.data),
    {
      onError(err) {
        console.log(err, "EEEEEEEEEEEEEEEEEE ");
        toast.error("Something went wrong!!");
      },
    }
  );

  useEffect(() => {
    if (isSuccess && data?.result) {
      let a = 0;
      data.result.forEach((item: any) => {
        const quantity = item.quantity || 0;
        const unitPrice = item.possibleSellingPrice || 0;
        const totalValue = quantity * unitPrice;
        a = a + totalValue;
      });
      setTotal(a);
    }
  }, [isSuccess, data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data?.result) {
    return <div>No data available</div>;
  }

  return (
    <div className="">
      <div>{total}</div>
      {JSON.stringify(data.result, null, 2)}
    </div>
  );
};

export default T;
