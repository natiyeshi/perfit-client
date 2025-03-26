import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import axios from "@/lib/axios";
import { FaFilter } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { IDBClientPipeline, IDBPopulatedPipeline } from "@/types/IPipeline";
import toast, { Toaster } from "react-hot-toast";
import { IoNotificationsOutline } from "react-icons/io5";
interface PipelineNotification extends IDBPopulatedPipeline {
  remainingDate: number;
}

const Notifications = () => {
  const [pipelineData, setPipelineData] = useState<PipelineNotification[]>([]);
  const query = useQuery(
    "pipelines",
    () => axios.get("/pipelines?populate=true"),
    {
      onSuccess(data) {
        const k: PipelineNotification[] = data.data.result || [];
        // k.filter(d => d.lcOpeningDate)
        const filteredData = k.filter((d) => {
          const lcOpeningDate = new Date(d.lcOpeningDate);
          const threeMonthsLater = new Date(
            lcOpeningDate.setMonth(lcOpeningDate.getMonth() + 3)
          );
          const today = new Date();
          const remainingDate = Math.ceil(
            (threeMonthsLater.getTime() - today.getTime()) /
              (1000 * 60 * 60 * 24)
          );
          if (remainingDate > 45) return false;
          d["remainingDate"] = remainingDate;
          return true;
        });
        setPipelineData(filteredData);
      },
      onError(err) {
        console.log(err, "EEEEEEEEEEEEEEEEEE ");
        toast.error("Something goes wrong!!");
      },
    }
  );
  return (
    <Sheet>
      <SheetTrigger>
        <div className=" me-4   rounded-full  font-black  flex ">
          <IoNotificationsOutline className="m-auto text-xl" />
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription className="mt-4 flex flex-col gap-2">
            {query.isLoading ? (
              "Loading..."
            ) : query.isSuccess ? (
              <div className="flex flex-col gap-5">
                {pipelineData.map((data, ind) => (
                  <PipelineNoti key={ind} data={data} />
                ))}
              </div>
            ) : (
              ""
            )}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

const Noti = () => {
  return (
    <div className="w-full flex flex-col text-sm rounded border gap-1 p-2 text-gray-800">
      <div className="font-semibold">Welcome</div>
      <div className="text-xs">Welcome To out Platform</div>
    </div>
  );
};

const PipelineNoti = ({ data }: { data: PipelineNotification }) => {
  return (
    <div
      className={`w-full flex flex-col text-sm rounded border gap-1 p-2 text-gray-800 ${
        data.remainingDate > 45
          ? "bg-green-200"
          : data.remainingDate > 30
          ? "bg-yellow-200"
          : "bg-red-200"
      }`}
    >
      <div className="font-semibold flex gap-2 flexcol flex-wrap">
        <div className="text-gray-600 text-sm">LC Number:</div>
        <div className="">{data.lcNumber}</div>
      </div>
      <div className="font-semibold flex gap-2 flexcol flex-wrap">
        <div className="text-gray-600 text-sm">Proforma Invoice Number:</div>
        <div className="">{data.proformaInvoiceNumber}</div>
      </div>
      <div className="font-semibold flex gap-2 flexcol flex-wrap">
        <div className="text-gray-600 text-sm">Remaining Days:</div>
        <div className="">{data.remainingDate}</div>
      </div>
      <div className="w-fit px-2 mt-3 rounded-lg bg-white py-[1px] text-sm">
        pipeline
      </div>
    </div>
  );
};

export default Notifications;
