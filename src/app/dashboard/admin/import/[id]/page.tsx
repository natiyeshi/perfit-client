"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { IDBPopulatedImport } from "@/types/IImport";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "@/lib/axios";

const TABS = ["General", "Applicant", "Supplier", "Products"];

const ImportDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  const [data, setData] = useState<IDBPopulatedImport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<string>(TABS[0]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`/competitor-imports/${id}?populate=true`)
      .then(res => {
        setData(res.data.result);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch import details");
        setLoading(false);
      });
  }, [id]);

  const renderGeneral = () => (
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-muted-foreground text-xs mb-1">Import ID</div>
          <div className="font-medium">{data?.importId}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs mb-1">Date</div>
          <div className="font-medium">{typeof data?.date === 'string' ? data?.date : new Date(data?.date ?? '').toLocaleDateString()}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs mb-1">Total Price</div>
          <div className="font-medium">{data?.amount}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs mb-1">Payment Mode</div>
          <div className="font-medium">{data?.paymentMode || '-'}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs mb-1">Mode of Shipment</div>
          <div className="font-medium">{data?.modeOfShipment || '-'}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs mb-1">Currency</div>
          <div className="font-medium">{data?.currency || '-'}</div>
        </div>
      </div>
    </CardContent>
  );

  const renderApplicant = () => (
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-muted-foreground text-xs mb-1">Name</div>
          <div className="font-medium">{data?.competitor?.name}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs mb-1">Email</div>
          <div className="font-medium">{data?.competitor?.email || '-'}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs mb-1">Phone</div>
          <div className="font-medium">{data?.competitor?.phoneNumber || '-'}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs mb-1">TIN</div>
          <div className="font-medium">{data?.competitor?.tin || '-'}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs mb-1">License Number</div>
          <div className="font-medium">{data?.competitor?.licenseNumber || '-'}</div>
        </div>
      </div>
    </CardContent>
  );

  const renderSupplier = () => (
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-muted-foreground text-xs mb-1">Name</div>
          <div className="font-medium">{data?.supplier?.manufacturerName}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs mb-1">Email</div>
          <div className="font-medium">{data?.supplier?.email || '-'}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs mb-1">Phone</div>
          <div className="font-medium">{data?.supplier?.phoneNumber || '-'}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs mb-1">Country</div>
          <div className="font-medium">{data?.supplier?.country || '-'}</div>
        </div>
      </div>
    </CardContent>
  );

  const renderProducts = () => (
    <CardContent>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-muted">
              <th className="border px-2 py-1">Product Name</th>
              <th className="border px-2 py-1">Brand</th>
              <th className="border px-2 py-1">Generic</th>
              <th className="border px-2 py-1">Unit Price</th>
              <th className="border px-2 py-1">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {data?.products.map((p, idx) => (
              <tr key={p.id || idx} className="hover:bg-accent/30">
                <td className="border px-2 py-1">{p.product?.brandName}</td>
                <td className="border px-2 py-1">{p.product?.brandName}</td>
                <td className="border px-2 py-1">{p.product?.genericName}</td>
                <td className="border px-2 py-1">{p.unitPrice}</td>
                <td className="border px-2 py-1">{p.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  );

  const renderTabContent = () => {
    switch (tab) {
      case "General":
        return renderGeneral();
      case "Applicant":
        return renderApplicant();
      case "Supplier":
        return renderSupplier();
      case "Products":
        return renderProducts();
      default:
        return null;
    }
  };

  return (
    <div className="p-8 w-[75%]  mx-auto">
      <Link href="/dashboard/admin/import" className="text-blue-600 hover:underline mb-6 inline-block">&larr; Back to Imports</Link>
      <Card className="shadow-lg border-2 overflow-auto min-h-[60vh] border-muted  ">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Import Details</CardTitle>
        </CardHeader>
        <div className="flex gap-2 px-6 pb-5 pt-2 border-b border-muted">
          {TABS.map((t) => (
            <Button
              key={t}
              variant={tab === t ? "default" : "outline"}
              className={`rounded-sm border-b-2 ${tab === t ? "border-primary text-primary text-white" : "border-transparent"} font-semibold`}
              onClick={() => setTab(t)}
              size="sm"
            >
              {t}
            </Button>
          ))}
        </div>
        {loading ? (
          <div className="p-8">
            <div className="flex flex-col gap-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full mt-4" />
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-red-500">{error}</div>
        ) : (
          renderTabContent()
        )}
      </Card>
    </div>
  );
};

export default ImportDetailPage;
