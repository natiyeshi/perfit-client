"use client";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import { IDBPopulatedCostBuildUp } from "@/types/ICostbuildup";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const params = useParams();
  const { id } = params as { id: string };
  const [tab, setTab] = useState<"details" | "profit" | "memo">("details");
  const { data, isLoading, error } = useQuery(
    ["cost-buildup", id],
    () => axios.get(`/cost-buildup/${id}`).then((res) => res.data.result as IDBPopulatedCostBuildUp),
    { enabled: !!id }
  );

  // Calculate cof
  const cof = data && data.fobPriceUSD ? data.totalCost / data.fobPriceUSD : 0;
  const multipliers = [1.25, 1.35, 1.4, 1.5, 1.65, 1.75, 2.0];

  // For Memo Tab calculations
  let totalProfit = 0;
  if (data && data.CostBuildUpProducts) {
    totalProfit = data.CostBuildUpProducts.reduce((acc, product) => {
      const prCost = product.unitPrice * cof;
      const diff = (product.sellingPrice ?? 0) - prCost;
      const profit = diff * product.quantity;
      return acc + profit;
    }, 0);
  }
  const grossProfit = data && data.totalCost ? ((totalProfit / data.totalCost) * 100) : 0;

  if (!id) return <div className="p-8 text-red-500">No ID provided in query.</div>;
  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error loading data.</div>;
  if (!data) return <div className="p-8 text-gray-500">No data found.</div>;

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-3xl font-bold mb-8 text-center tracking-tight">Cost Build Up Details</h1>
      {/* Tabs */}
      <div className="flex gap-2 mb-8 justify-center">
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition-colors ${tab === "details" ? "border-blue-600 text-blue-700 bg-blue-50" : "border-transparent text-gray-500 bg-gray-100 hover:bg-blue-50"}`}
          onClick={() => setTab("details")}
        >
          Details
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition-colors ${tab === "profit" ? "border-blue-600 text-blue-700 bg-blue-50" : "border-transparent text-gray-500 bg-gray-100 hover:bg-blue-50"}`}
          onClick={() => setTab("profit")}
        >
          Item Profit
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition-colors ${tab === "memo" ? "border-blue-600 text-blue-700 bg-blue-50" : "border-transparent text-gray-500 bg-gray-100 hover:bg-blue-50"}`}
          onClick={() => setTab("memo")}
        >
          Memo
        </button>
      </div>
      {tab === "details" && (
        <>
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <Detail label="FOB Price (USD)" value={data.fobPriceUSD} />
            <Detail label="Exchange Rate" value={data.exchangeRate} />
            <Detail label="Total FOB Cost (Birr)" value={data.totalFobCostBirr} />
            <Detail label="FC Purchase" value={data.fcPurchase} />
            <Detail label="Bank Service Charges" value={data.bankServiceCharges} />
            <Detail label="Insurance Charge" value={data.insuranceCharge} />
            <Detail label="Freight Charge" value={data.freightCharge} />
            <Detail label="Customs Duty" value={data.customsDuty} />
            <Detail label="Storage Charges" value={data.storageCharges} />
            <Detail label="Inland Transport" value={data.inlandTransport} />
            <Detail label="Transit Agent Charge" value={data.transitAgentCharge} />
            <Detail label="Loading/Unloading Expenses" value={data.loadingUnloadingExpenses} />
            <Detail label="Total Cost" value={data.totalCost} />
            <Detail label="USD Purchase Price" value={data.usdPurchasePrice} />
            <Detail label="Miscellaneous Cost" value={data.mislaneousCost ?? '-'} />
          </div>
          <h2 className="text-2xl font-semibold mb-4 ">Products</h2>
          <div className="space-y-4">
            {data.CostBuildUpProducts && data.CostBuildUpProducts.length > 0 ? (
              data.CostBuildUpProducts.map((product, idx) => (
                <div key={idx} className="border rounded-xl p-4 bg-blue-50/60 flex flex-col md:flex-row md:items-center md:gap-8">
                  <div className="flex-1">
                    <div className="font-semibold text-lg mb-1 text-blue-800">
                      {product.product?.brandName} <span className="text-gray-500">({product.product?.genericName})</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{product.product?.description}</div>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-2 mt-4 md:mt-0">
                    <Detail label="Unit Price" value={product.unitPrice} />
                    <Detail label="Quantity" value={product.quantity} />
                    <Detail label="Competitor Selling Price" value={product.competitorSellingPrice} />
                    <Detail label="Selling Price" value={product.sellingPrice ?? '-'} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No products found for this cost build up.</div>
            )}
          </div>
        </>
      )}
      {tab === "profit" && (
        <div className="overflow-x-auto  rounded-xl p-2">
          <table className="w-full min-w-[900px] bg-white rounded-xl shadow-md">
            <thead>
              <tr className="bg-blue-100 text-blue-800">
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2">Unit Price</th>
                <th className="px-4 py-2">COF</th>
                <th className="px-4 py-2">prCost</th>
                {multipliers.map((m) => (
                  <th key={m} className="px-4 py-2">C+{Math.round((m-1)*100)}%</th>
                ))}
                <th className="px-4 py-2">Competitor Price</th>
                <th className="px-4 py-2">Selling Price</th>
              </tr>
            </thead>
            <tbody>
              {data.CostBuildUpProducts && data.CostBuildUpProducts.length > 0 ? (
                data.CostBuildUpProducts.map((product, idx) => {
                  const prCost = product.unitPrice * cof;
                  return (
                    <tr key={idx} className="border-b hover:bg-blue-50 transition">
                      <td className="px-4 py-2 font-medium">
                        {product.product?.brandName} <span className="text-xs text-gray-500">({product.product?.genericName})</span>
                      </td>
                      <td className="px-4 py-2 text-center">{product.unitPrice}</td>
                      <td className="px-4 py-2 text-center">{cof.toFixed(2)}</td>
                      <td className="px-4 py-2 text-center">{prCost.toFixed(2)}</td>
                      {multipliers.map((m) => (
                        <td key={m} className="px-4 py-2 text-center">{(prCost * m).toFixed(2)}</td>
                      ))}
                      <td className="px-4 py-2 text-center">{product.competitorSellingPrice}</td>
                      <td className="px-4 py-2 text-center">{product.sellingPrice ?? '-'}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={multipliers.length + 6} className="text-center text-gray-500 py-8">No products found for this cost build up.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {tab === "memo" && (
        <div className="overflow-x-auto rounded-xl p-2">
          <table className="w-full min-w-[700px] bg-white rounded-xl shadow-md">
            <thead>
              <tr className="bg-blue-100 text-blue-800">
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2">COF</th>
                <th className="px-4 py-2">Selling Price</th>
                <th className="px-4 py-2">Difference</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Total Profit</th>
              </tr>
            </thead>
            <tbody>
              {data.CostBuildUpProducts && data.CostBuildUpProducts.length > 0 ? (
                data.CostBuildUpProducts.map((product, idx) => {
                  const prCost = product.unitPrice * cof;
                  const sellingPrice = product.sellingPrice ?? 0;
                  const diff = sellingPrice - prCost;
                  const profit = diff * product.quantity;
                  return (
                    <tr key={idx} className="border-b hover:bg-blue-50 transition">
                      <td className="px-4 py-2 font-medium">
                        {product.product?.brandName} <span className="text-xs text-gray-500">({product.product?.genericName})</span>
                      </td>
                      <td className="px-4 py-2 text-center">{cof.toFixed(2)}</td>
                      <td className="px-4 py-2 text-center">{sellingPrice}</td>
                      <td className="px-4 py-2 text-center">{diff.toFixed(2)}</td>
                      <td className="px-4 py-2 text-center">{product.quantity}</td>
                      <td className="px-4 py-2 text-center">{profit.toFixed(2)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 py-8">No products found for this cost build up.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="mt-8 flex flex-col md:flex-row gap-6 justify-center items-center">
            <div className="bg-blue-50 rounded-lg px-6 py-4 text-lg font-semibold text-blue-800 shadow">
              Total Profit: <span className="font-bold">{totalProfit.toFixed(2)}</span>
            </div>
            <div className="bg-green-50 rounded-lg px-6 py-4 text-lg font-semibold text-green-800 shadow">
              Gross Profit: <span className="font-bold">{grossProfit.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex flex-col mb-1">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="font-medium text-gray-800 text-base">{value}</span>
    </div>
  );
}