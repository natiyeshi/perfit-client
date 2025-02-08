"use client";
import { FaPlus } from "react-icons/fa";
import { FC, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createPipelineSchema } from "@/validators/pipeline.validator";
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
import { IPipeline } from "@/types/IPipeline";

const fetchData = (
  endpoint: string,
  setState: (data: any) => void,
  errorMessage: string
) => {
  return useQuery(endpoint, () => axios.get(`/${endpoint}`), {
    onSuccess(data) {
      setState(data.data.result || []);
    },
    onError() {
      toast.error(errorMessage);
    },
  });
};

const Page = () => {
  const { isLoading, mutate } = useMutation(
    (data: any) => axios.post("/pipelines", { ...data }),
    {
      onSuccess: () => {
        toast.success("Data Successfully Registered!");
      },
      onError: (err) => {
        toast.error(
          (err as any).response?.data?.message ?? "Something went wrong!"
        );
      },
    }
  );

  const [products, setProducts] = useState<IDBProduct[]>([]);

  fetchData("products", setProducts, "Error while loading products!");

  const handleSubmit = (data: IPipeline) => mutate(data);
  const initialValues: IPipeline = {
    productId: "",
    quantity: 0,
    invoice: 0,
    openingDate: "",
    shippingMethod: "AIR",
    portExpectedArrivalDate: "",
    warehouseExpectedArrivalDate: "",
    portArrivalDate: "",
    warehouseArrivalDate: "",
  };
  return (
    <div className="px-12 overflow-y-auto pb-20">
      <div className="big-topic py-8">Register Import Data</div>
      <Formik
        initialValues={initialValues}
        validationSchema={createPipelineSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="flex flex-col space-y-2 w-full">
                <Label>Products</Label>
                <Select
                  onValueChange={(value: string) =>
                    setFieldValue("productId", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorMessage
                  name={"product"}
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

              {/* invoice */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="invoice">Invoice</Label>
                <Field
                  name="invoice"
                  as={Input}
                  id="invoice"
                  type="number"
                  placeholder="Enter Quantity"
                  className="w-full"
                />
                <ErrorMessage
                  name="invoice"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* openingDate */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="openingDate">Opening Date</Label>
                <Field
                  name="openingDate"
                  as={Input}
                  id="openingDate"
                  type="date"
                  placeholder="Enter Quantity"
                  className="w-full"
                />
                <ErrorMessage
                  name="openingDate"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* portExpectedArrivalDate */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="portExpectedArrivalDate">
                  Port ExpectedArrival Date Date
                </Label>
                <Field
                  name="portExpectedArrivalDate"
                  as={Input}
                  id="portExpectedArrivalDate"
                  type="date"
                  placeholder="Enter Quantity"
                  className="w-full"
                />
                <ErrorMessage
                  name="portExpectedArrivalDate"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* portArrivalDate */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="portArrivalDate">Port Arrival Date</Label>
                <Field
                  name="portArrivalDate"
                  as={Input}
                  id="portArrivalDate"
                  type="date"
                  placeholder="Enter Quantity"
                  className="w-full"
                />
                <ErrorMessage
                  name="portArrivalDate"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* warehouseArrivalDate */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="warehouseArrivalDate">
                  Ware House Arrival Date
                </Label>
                <Field
                  name="warehouseArrivalDate"
                  as={Input}
                  id="warehouseArrivalDate"
                  type="date"
                  placeholder="Enter Quantity"
                  className="w-full"
                />
                <ErrorMessage
                  name="warehouseArrivalDate"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* warehouseExpectedArrivalDate */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="warehouseExpectedArrivalDate">
                  Ware house Expected Arrival Date
                </Label>
                <Field
                  name="warehouseExpectedArrivalDate"
                  as={Input}
                  id="warehouseExpectedArrivalDate"
                  type="date"
                  placeholder="Enter Quantity"
                  className="w-full"
                />
                <ErrorMessage
                  name="warehouseExpectedArrivalDate"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              <div className="flex flex-col space-y-2 w-full">
                <Label>shippingMethod</Label>
                <Select
                  onValueChange={(value: string) =>
                    setFieldValue("shippingMethod", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {["AIR", "SEA"].map((item, ind) => (
                      <SelectItem key={ind} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorMessage
                  name={"shippingMethod"}
                  component="shippingMethod"
                  className="text-sm text-red-500"
                />
              </div>

              {/* <div className="flex gap-2 w-fit px-6 py-2 border rounded items-center justify-center">
              <Label>Total Price:</Label>
              <div>{values.quantity * values.unitPrice} Birr</div>
            </div> */}
            </div>

            <Button
              onClick={() => mutate(values)}
              disabled={isLoading}
              className="mx-auto"
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
