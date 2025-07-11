"use client";
import { useMutation, useQuery } from "react-query";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { IDBIodmProduct, IDBIodm } from "@/types/IIodm";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { formatDate } from "@/components/custom/table/CustomeTable";

const fetchIodmData = async (id: string) => {
  const response = await axios.get(`/iodms/${id}?populate=true`);
  return response.data.result;
};

const IodmPage = ({ params }) => {
  const { id } = params;

  const { data, isLoading, isError, error } = useQuery<IDBIodm, Error>(
    ["iodmData", id],
    () => fetchIodmData(id as string),
    {
      enabled: !!id, // Only fetch when `id` is available
      retry: false, // Disable retry to try only once if there's an error
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-blue-500">Loading data, please wait...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500">
        <p className="font-semibold text-lg">Oops! Something went wrong.</p>
        <p className="text-sm mt-2">{error?.message}</p>
        <Button
          className="mt-4 bg-red-600 hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">IODM Details</h1>
      {data && <ShowCalc values={data} id={id} />}
      {/* {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>No data found</p>} */}
    </div>
  );
};

export default IodmPage;

const ShowCalc = ({ values, id }: { values: IDBIodm; id: string }) => {
  let totalLandingPrice = values.IODMProducts.reduce(
    (acc, num) =>
      acc + num.purchasePriceUsd * num.quantity * values.exchangeRate,
    0
  );
  totalLandingPrice += totalLandingPrice * (values.freightCost / 100);
  totalLandingPrice += totalLandingPrice * (values.dutyTax / 100);
  totalLandingPrice += totalLandingPrice * (values.bsc / 100);
  totalLandingPrice += totalLandingPrice * (values.insuranceCharge / 100);
  totalLandingPrice += totalLandingPrice * (values.miscellaneousTax / 100);
  totalLandingPrice += values.loadingUnloading;

  const expectedSellingPrice = values.IODMProducts.reduce(
    (acc, num) => acc + num.currentSellingPrice * num.quantity,
    0
  );
  const totalNetProfit = expectedSellingPrice - totalLandingPrice;
  const totalProfitMargin =
    ((expectedSellingPrice - totalLandingPrice) / totalLandingPrice) * 100;
  const router = useRouter();
  const { isLoading, mutate } = useMutation(
    () => axios.delete("/IODMs/" + id),
    {
      onSuccess() {
        toast.success("Data Successfully Deleted!");
        router.replace("/dashboard/admin/iodm/");
      },
      onError(err) {
        toast.error(
          (err as any).response.data.message ?? "Something went wrong!"
        );
      },
    }
  );

  return (
    <div className="flex flex-col gap-6">
      {values.IODMProducts.length > 0 && <ShowTable values={values} />}
      <div className="grid grid-cols-2 gap-4">
        <InfoCard
          label="Total Landing Price"
          value={`${parseFloat(
            totalLandingPrice.toFixed(2)
          ).toLocaleString()} Birr`}
        />
        <InfoCard
          label="Expected Selling Price"
          value={`${parseFloat(
            expectedSellingPrice.toFixed(2)
          ).toLocaleString()} Birr`}
        />
        <InfoCard
          label="Total Net Profit"
          value={`${parseFloat(
            totalNetProfit.toFixed(2)
          ).toLocaleString()} Birr`}
        />
        <InfoCard
          label="Total Profit Margin"
          value={`${parseFloat(
            totalProfitMargin.toFixed(2)
          ).toLocaleString()}%`}
        />
      </div>
      <Button
        disabled={isLoading}
        onClick={() => mutate()}
        className={`w-fit mt-8 bg-red-600 ${isLoading && "bg-red-600/80"}`}
      >
        {isLoading ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
};

const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col border rounded-lg p-4 bg-gray-50 shadow-sm">
    <div className="text-sm font-medium text-gray-600">{label}</div>
    <div className="text-lg font-semibold text-gray-800">{value}</div>
  </div>
);

const ShowTable = ({ values }: { values: IDBIodm }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200">
        <thead className="bg-secondary text-white">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Product Name</th>
            <th className="border border-gray-300 px-4 py-2">Quantity</th>
            <th className="border border-gray-300 px-4 py-2">Expiry Date</th>
            <th className="border border-gray-300 px-4 py-2">
              Manufacture Date
            </th>
            <th className="border border-gray-300 px-4 py-2">Purchase Price</th>
            <th className="border border-gray-300 px-4 py-2">Selling Price</th>
            <th className="border border-gray-300 px-4 py-2">
              Total Price (USD)
            </th>
          </tr>
        </thead>
        <tbody>
          {values.IODMProducts.map((value, ind) => (
            <tr key={ind} className="even:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">
                {value.product?.genericName}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {value.quantity}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {formatDate(value.expiryDate)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {formatDate(value.manufactureDate)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {value.purchasePriceUsd}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {value.currentSellingPrice}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {value.purchasePriceUsd * value.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
