"use client";
import { FaPlus } from "react-icons/fa";
import { FC, useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { Input } from "@/components/ui/input"; // ShadCN Input component
import { Button } from "@/components/ui/button"; // ShadCN Button component
import { Label } from "@/components/ui/label"; // ShadCN Label component
import { createCompetitorImportSchema } from "@/validators/competitor-import.validator";
import { IImport } from "@/types/IImport";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "react-query";
import axios from "@/lib/axios";
import { IDBProduct } from "@/types/IProduct";
import { IDBSupplier } from "@/types/ISupplier";
import { IDBCompetitor } from "@/types/ICompetitor";
import { parseISO } from "date-fns";

const Page = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { isLoading: isSubmitting, mutate } = useMutation(
    (data: any) =>
      axios.post("/competitor-imports", {
        ...data,
      }),
    {
      onSuccess() {
        toast.success("Data Successfully Registered!");
      },
      onError(err) {
        toast.error(
          (err as any).response.data.message ?? "Something goes wrong!"
        );
      },
    }
  );

  const handleSubmit = (data: IImport) => {
    mutate({ ...data });
  };

  const [products, setProducts] = useState<IDBProduct[]>([]);
  const [suppliers, setSuppliers] = useState<IDBSupplier[]>([]);
  const [competitors, setCompetitors] = useState<IDBCompetitor[]>([]);

  const initialValues: IImport = {
    productId: "",
    supplierId: "",
    competitorId: "",
    quantity: 0,
    unitPrice: 0,
    modeOfShipment: "",
    expiryDate: "",
    manufacturerDate: "",
  };

  const productQuery = useQuery("products", () => axios.get("/products"), {
    enabled: mounted,
    onSuccess(data) {
      if (data?.data?.result) {
        const sortedProducts = [...data.data.result].sort((a: IDBProduct, b: IDBProduct) =>
          a.name.localeCompare(b.name)
        );
        setProducts(sortedProducts);
      }
    },
    onError(err) {
      toast.error("Error while loading products!");
    },
  });

  const competitorQuery = useQuery(
    "competitors",
    () => axios.get("/competitors"),
    {
      enabled: mounted,
      onSuccess(data) {
        if (data?.data?.result) {
          const sortedCompetitors = [...data.data.result].sort((a: IDBCompetitor, b: IDBCompetitor) =>
            (a.name ?? '').localeCompare(b.name ?? '')
          );
          setCompetitors(sortedCompetitors);
        }
      },
      onError(err) {
        toast.error("Error while loading competitors!");
      },
    }
  );

  const supplierQuery = useQuery("suppliers", () => axios.get("/suppliers"), {
    enabled: mounted,
    onSuccess(data) {
      if (data?.data?.result) {
        const sortedSuppliers = [...data.data.result].sort((a: IDBSupplier, b: IDBSupplier) =>
          a.manufacturerName.localeCompare(b.manufacturerName)
        );
        setSuppliers(sortedSuppliers);
      }
    },
    onError(err) {
      toast.error("Error while loading suppliers!");
    },
  });

  const isLoading = !mounted || productQuery.isLoading || competitorQuery.isLoading || supplierQuery.isLoading;

  if (!mounted) {
    return null;
  }

  return (
    <div className="px-12 overflow-y-auto pb-20">
      <div className="big-topic py-8">Register Import Data</div>
      {isLoading ? (
        <div className="flex items-center justify-center py-8">Loading...</div>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={createCompetitorImportSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-2 gap-4 w-full">
                {/* competitor Name */}
                <div className="flex flex-col space-y-2 w-full">
                  <Label htmlFor="competitorId">Competitor Name</Label>
                  <Select
                    disabled={competitorQuery.isLoading}
                    onValueChange={(value: string) =>
                      setFieldValue("competitorId", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={` ${competitorQuery.isLoading ? "Loading..." : "Select"}`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {competitors.map((pr,ind) => {
                        return <SelectItem key={ind} value={pr.id}>{pr.name}</SelectItem>;
                      })}
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="productId"
                    component="p"
                    className="text-sm text-red-500"
                  />
                </div>
                {/* Product Name */}
                <div className="flex flex-col space-y-2 w-full">
                  <Label htmlFor="productId">Product Name</Label>
                  <Select
                    disabled={productQuery.isLoading}
                    onValueChange={(value: string) =>
                      setFieldValue("productId", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={` ${productQuery.isLoading ? "Loading..." : "Select"}`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((pr,ind) => {
                        return <SelectItem key={ind} value={pr.id}>{pr.name}</SelectItem>;
                      })}
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="productId"
                    component="p"
                    className="text-sm text-red-500"
                  />
                </div>
                {/* Supplier Name */}
                <div className="flex flex-col space-y-2 w-full">
                  <Label htmlFor="supplierId">Supplier Name</Label>
                  <Select
                    disabled={supplierQuery.isLoading}
                    onValueChange={(value: string) =>
                      setFieldValue("supplierId", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={` ${supplierQuery.isLoading ? "Loading..." : "Select"}`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((pr,ind) => {
                        return (
                          <SelectItem key={ind} value={pr.id}>
                            {pr.manufacturerName}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="supplierId"
                    component="p"
                    className="text-sm text-red-500"
                  />
                </div>

                {/* Quantity */}
                <div className="flex flex-col space-y-2 w-full">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Field
                    name="quantity"
                    as={Input}
                    id="quantity"
                    type="number"
                    placeholder="Enter Quantity"
                    className="w-full"
                  />
                  <ErrorMessage
                    name="quantity"
                    component="p"
                    className="text-sm text-red-500"
                  />
                </div>

                {/* Unit Price */}
                <div className="flex flex-col space-y-2 w-full">
                  <Label htmlFor="unitPrice">Unit Price</Label>
                  <Field
                    name="unitPrice"
                    as={Input}
                    id="unitPrice"
                    type="number"
                    placeholder="Enter Unit Price"
                    className="w-full"
                  />
                  <ErrorMessage
                    name="unitPrice"
                    component="p"
                    className="text-sm text-red-500"
                  />
                </div>

                {/* Order Date */}
                <div className="flex flex-col space-y-2 w-full">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Field
                    name="expiryDate"
                    as={Input}
                    id="expiryDate"
                    type="date"
                    className="w-full"
                  />
                  <ErrorMessage
                    name="expiryDate"
                    component="p"
                    className="text-sm text-red-500"
                  />
                </div>

                {/* manufacturerDate Date */}
                <div className="flex flex-col space-y-2 w-full">
                  <Label htmlFor="manufacturerDate">Manufacturing Date</Label>
                  <Field
                    name="manufacturerDate"
                    as={Input}
                    id="manufacturerDate"
                    type="date"
                    className="w-full"
                  />
                  <ErrorMessage
                    name="manufacturerDate"
                    component="manufacturerDate"
                    className="text-sm text-red-500"
                  />
                </div>
              

                {/* Mode of Shipment */}
                <div className="flex flex-col space-y-2 w-full">
                  <Label htmlFor="modeOfShipment">Mode of Shipment</Label>
                  <Field
                    name="modeOfShipment"
                    as={Input}
                    id="modeOfShipment"
                    placeholder="Enter Mode of Shipment"
                    className="w-full"
                  />
                  <ErrorMessage
                    name="modeOfShipment"
                    component="p"
                    className="text-sm text-red-500"
                  />
                </div>
                {/* Total Price */}
              </div>
                <div className="flex gap-2 w-fit px-6 py-2 border rounded items-center justify-center">
                  <Label htmlFor="totalPrice">Total Price:</Label>
                  <div>{values.quantity * values.unitPrice} Birr</div>
                </div>

              <Button
                onClick={() => {
                  console.log(values);
                  mutate(values);
                }}
                disabled={isSubmitting}
                className="mx-auto mr-auto"
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default Page;
