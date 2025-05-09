"use client";
import { FaPlus } from "react-icons/fa";
import { FC, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { Input } from "@/components/ui/input"; // ShadCN Input component
import { Button } from "@/components/ui/button"; // ShadCN Button component
import { Label } from "@/components/ui/label"; // ShadCN Label component
import { createCompetitorImportSchema } from "@/validators/competitor-import.validator";
import { IDBImport, IImport } from "@/types/IImport";
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
import { ITransaction } from "@/types/ITransaction";
import { IDBCustomer } from "@/types/ICustomer";
import { createTransactionSchema } from "@/validators/transaction.validator";

interface InventoryProduct {
  product: IDBProduct;
  quantity: number;
}

const Page = () => {
  const { isLoading, mutate } = useMutation(
    (data: any) =>
      axios.post("/transactions", {
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
  const handleSubmit = (data: ITransaction) => {
    mutate({ ...data });
  };

  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [imports, setImports] = useState<IDBImport[]>([]);
  const [customers, setCustomers] = useState<IDBCustomer[]>([]);

  const initialValues = {
    productId: "",
    customerId: "",
    quantity: 0,
    unitPrice: 0,
    withCredit: false,
  };
  const productQuery = useQuery("products-inv", () => axios.get("/inventories/available"), {
    onSuccess(data) {
      setProducts(data.data.result || []);
    },
    onError(err) {
      toast.error("Error while loading products!");
    },
  });

  const customerQuery = useQuery("customers", () => axios.get("/customers"), {
    onSuccess(data) {
      setCustomers(data.data.result || []);
    },
    onError(err) {
      toast.error("Error while loading customers!");
    },
  });

  const importQuery = useQuery("imports", () => axios.get("/suppliers"), {
    onSuccess(data) {
      setImports(data.data.result || []);
    },
    onError(err) {
      toast.error("Error while loading imports!");
    },
  });

  return (
    <div className="px-12 overflow-y-auto pb-20">
      <div className="big-topic py-8">Sell Product</div>
      <Formik
        initialValues={initialValues}
        validationSchema={createTransactionSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-2 gap-4 w-full">
              {/* customer Name */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="customerId">Customer Name</Label>
                <Select
                  disabled={customerQuery.isLoading}
                  onValueChange={(value: string) =>
                    setFieldValue("customerId", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={` ${
                        customerQuery.isLoading ? "Loading..." : "Select"
                      }`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((pr, key) => {
                      return (
                        <SelectItem key={key} value={pr.id}>
                          {pr.organizationName}
                        </SelectItem>
                      );
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
                      placeholder={` ${
                        productQuery.isLoading ? "Loading..." : "Select"
                      }`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((pr, ind) => {
                      return (
                        <SelectItem className="capitalize flex gap-2" key={ind} value={pr.product.id}>
                          <span className="">{pr.product.name}</span>
                          <span className="text-xs text-gray-500">({pr.quantity})</span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <ErrorMessage
                  name="productId"
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

              {/* With Credit */}
              <div className="flex flex-col space-y-2 w-full ">
                <div className="flex h-fit w-32 gap-5 ">
                  <Label htmlFor="withCredit" className=" min-w-20 my-auto capitalize">
                    With Credit
                  </Label>
                  <Field name="withCredit my-auto  ">
                    {({ field }: any) => (
                      <Input
                        {...field}
                        id="withCredit"
                        type="checkbox"
                        checked={values.withCredit}
                        className=" w-6 h-6 rounded-full"
                        onClick={() => {
                          setFieldValue("withCredit", !values.withCredit);
                        }}
                      />
                    )}
                  </Field>
                </div>
                <ErrorMessage
                  name="withCredit"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>
            </div>

            <Button
              onClick={() => {
                console.log(values);
                mutate(values);
              }}
              disabled={isLoading}
              className="mx-auto mr-auto"
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Page;
