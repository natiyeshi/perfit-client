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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "@/lib/axios";
import { FaFilter } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { IDBClientPipeline, IDBPopulatedPipeline } from "@/types/IPipeline";
import toast, { Toaster } from "react-hot-toast";
import { IoNotificationsOutline } from "react-icons/io5";
import { format } from "date-fns";

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
          if(d.isArrived) return false;
          const lcOpeningDate = new Date(d.lcOpeningDate);
          const threeMonthsLater = new Date(
            lcOpeningDate.setMonth(lcOpeningDate.getMonth() + 3)
          );
          const today = new Date();
          const remainingDate = Math.ceil(
            (threeMonthsLater.getTime() - today.getTime()) /
              (1000 * 60 * 60 * 24)
          );
          console.log(d.product.genericName, "product name");
          console.log(remainingDate, "remaining date");
          if (remainingDate > 45) return false;
          d["remainingDate"] = remainingDate;
          return true;
        }).sort((a, b) => a.remainingDate - b.remainingDate);
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
        <div className="relative me-4 rounded-full font-black flex">
          <IoNotificationsOutline className="m-auto text-2xl" />
          {pipelineData.length > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              {pipelineData.length}
            </div>
          )}
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
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={`w-full flex flex-col text-sm rounded-lg border gap-2 p-3 text-gray-800 ${
          data.remainingDate > 45
            ? "bg-green-50 border-green-200"
            : data.remainingDate > 30
            ? "bg-yellow-50 border-yellow-200"
            : "bg-red-50 border-red-200"
        }`}
      >
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="font-medium text-base">{data.product.genericName}</div>
            <div className="text-sm text-gray-600">LC: {data.lcNumber}</div>
            <div className="text-sm text-gray-600">PI: {data.proformaInvoiceNumber}</div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-medium ${
              data.remainingDate > 45
                ? "text-green-600"
                : data.remainingDate > 30
                ? "text-yellow-600"
                : "text-red-600"
            }`}>
              {data.remainingDate} days remaining
            </div>
          </div>
        </div>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full mt-2">
              View Details
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>Pipeline Details</AlertDialogTitle>
              <AlertDialogDescription className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Product</div>
                    <div className="text-sm">{data.product.genericName}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Brand</div>
                    <div className="text-sm">{data.product.brandName}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">LC Number</div>
                    <div className="text-sm">{data.lcNumber}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Proforma Invoice</div>
                    <div className="text-sm">{data.proformaInvoiceNumber}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Quantity</div>
                    <div className="text-sm">{data.quantity} {data.product.unit}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Shipping Method</div>
                    <div className="text-sm">{data.shippingMethod}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">LC Opening Date</div>
                    <div className="text-sm">{format(new Date(data.lcOpeningDate), 'PPP')}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Port Expected Arrival</div>
                    <div className="text-sm">{format(new Date(data.portExpectedArrivalDate), 'PPP')}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Port Arrival</div>
                    <div className="text-sm">{data.portArrivalDate ? format(new Date(data.portArrivalDate), 'PPP') : 'Not arrived'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Warehouse Expected Arrival</div>
                    <div className="text-sm">{format(new Date(data.warehouseExpectedArrivalDate), 'PPP')}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Warehouse Arrival</div>
                    <div className="text-sm">{data.warehouseArrivalDate ? format(new Date(data.warehouseArrivalDate), 'PPP') : 'Not arrived'}</div>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default Notifications;
