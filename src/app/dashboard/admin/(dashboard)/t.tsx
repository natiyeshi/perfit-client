"use client";

import { useQuery } from "react-query";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import { useState } from "react";

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

  if (isSuccess && data && data.length > 0) {
    let a = 0;
    data.result.map((item: any) => {
      const quantity = item.quantity;
      const unitPrice = item.possibleSellingPrice;
      const totalValue = quantity * unitPrice;
      a = a + totalValue;
    });
    setTotal(a);
  }

  return (
    <div className="">
      <div>{total}</div>
      {JSON.stringify(data.result, null, 2)}
    </div>
  );
};

export default T;
