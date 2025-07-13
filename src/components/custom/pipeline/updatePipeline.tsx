"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoCloseSharp } from "react-icons/io5";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { updateCompetitorImportSchema } from "@/validators/competitor-import.validator";
import { IDBClientPipeline, IDBPipeline } from "@/types/IPipeline";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import CustomeErrorMessage from "@/components/custom/ErrorMessage";
import { IDBProduct } from "@/types/IProduct";
import { IDBSupplier } from "@/types/ISupplier";
import { IDBCompetitor } from "@/types/ICompetitor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPipelineSchema } from "@/validators/pipeline.validator";
import { formatDate } from "@/lib/helper";

function UpdateImport({ initialValues }: { initialValues: IDBClientPipeline }) {
  const queryClient = useQueryClient();
  const [err, setErr] = useState<any>(null);
  const [open, setOpen] = useState(false); // State for dialog open/close
  const [products, setProducts] = useState<IDBProduct[]>([]);

  const { isLoading, isError, error, mutate } = useMutation(
    (data: Partial<IDBPipeline>) =>
      axios.patch(`/pipelines/${initialValues.id}`, {
        ...data,
        isArrived: (data as any).isArrived == "false" ? false : true,
      }),
    {
      onSuccess: () => {
        toast.success("Pipeline successfully updated!");
        queryClient.invalidateQueries("pipelines");
        setOpen(false);
      },
    }
  );

  const handleSubmit = async (
    values: Partial<IDBPipeline>,
    { resetForm }: any
  ) => {
    setErr(null);
    mutate(values);
  };

  const productQuery = useQuery("products", () => axios.get("/products"), {
    onSuccess(data) {
      setProducts(data.data.result || []);
    },
    onError(err) {
      toast.error("Error while loading products!");
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex gap-1">
          <div>Update Pipeline</div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[60%] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex w-full justify-between">
            <AlertDialogTitle>Update Pipeline</AlertDialogTitle>
            <AlertDialogCancel>
              <IoCloseSharp />
            </AlertDialogCancel>
          </div>
          <AlertDialogDescription>
            {err && (
              <CustomeErrorMessage message={err.message} topic={"Error"} />
            )}

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
                          <SelectValue
                            placeholder={initialValues.productName}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.genericName}
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
                        value={values["quantity"]}
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
                        value={values["invoice"]}
                      />
                      <ErrorMessage
                        name="invoice"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>

                    {/* lcOpeningDate */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="lcOpeningDate">Opening Date</Label>
                      <Field
                        name="lcOpeningDate"
                        as={Input}
                        id="lcOpeningDate"
                        type="date"
                        className="w-full"
                        value={formatDate(values["lcOpeningDate"])}
                      />
                      <ErrorMessage
                        name="lcOpeningDate"
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
                        className="w-full"
                        value={formatDate(values["portExpectedArrivalDate"])}
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
                        className="w-full"
                        value={formatDate(values["portArrivalDate"])}
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
                        className="w-full"
                        value={formatDate(values["warehouseArrivalDate"])}
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
                        className="w-full"
                        value={formatDate(
                          values["warehouseExpectedArrivalDate"]
                        )}
                      />
                      <ErrorMessage
                        name="warehouseExpectedArrivalDate"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>

                    <div className="flex flex-col space-y-2 w-full">
                      <Label>
                        shippingMethod {initialValues.shippingMethod}
                      </Label>
                      <Select
                        value={initialValues.shippingMethod}
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

                    <div className="flex flex-col space-y-2 w-full">
                      <Label>Is Arrived</Label>
                      <div
                        role="group"
                        aria-labelledby="isArrived"
                        className="flex gap-5 my-auto py-2"
                      >
                        <label className="flex items-center space-x-2">
                          <Field type="radio" name="isArrived" value="true" />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <Field type="radio" name="isArrived" value="false" />
                          <span>No</span>
                        </label>
                      </div>
                      <ErrorMessage
                        name="isArrived"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>
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
            {isError && (
              <div className="mt-2 text-sm text-red-500">
                {(error as any).response.data.message}
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default UpdateImport;
