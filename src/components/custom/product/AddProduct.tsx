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
import { FaPlus } from "react-icons/fa";
import { FC, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input"; // ShadCN Input component
import { Button } from "@/components/ui/button"; // ShadCN Button component
import { Label } from "@/components/ui/label"; // ShadCN Label component
import { IoCloseSharp } from "react-icons/io5";
import CustomeErrorMessage from "@/components/custom/ErrorMessage";
import { createProductSchema } from "@/validators/product.validator";
import { IProduct } from "@/types/IProduct";
import { useMutation, useQueryClient } from "react-query";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

function AddProduct() {
  const queryClient = useQueryClient();
  const [err, setErr] = useState<any>(null);
  const [open, setOpen] = useState(false); // State for dialog open/close
  const { isLoading, isError, error, mutate, isSuccess } = useMutation(
    (data: IProduct) => axios.post("/products", [data]),
    {
      onSuccess: (res) => {
        toast.success("Product Sucessfully Added!");
        queryClient.invalidateQueries("products");
        setOpen(false);
      },
    }
  );
  const handleSubmit = async (values: IProduct, { resetForm }: any) => {
    setErr(null);
    console.log("Submitted values:", values);
    mutate(values);
  };

  const initialValues: IProduct = {
    unit: "",
    brandName: "",
    genericName: "",
    description: "",
    intendedUse: "",
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex gap-1">
          <div>Add Product</div>
          <FaPlus />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className=" max-w-[40%] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex w-full justify-between">
            <AlertDialogTitle>Add Product</AlertDialogTitle>
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
              validationSchema={createProductSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 w-full">
                    {/* Brand Name */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="brandName">Brand Name</Label>
                      <Field
                        name="brandName"
                        as={Input}
                        id="brandName"
                        placeholder="Enter Product Brand Name"
                        className="w-full"
                      />
                      <ErrorMessage
                        name="brandName"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>

                     {/* generic Name */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="genericName">Generic Name</Label>
                      <Field
                        name="genericName"
                        as={Input}
                        id="genericName"
                        placeholder="Enter Product Generic Name"
                        className="w-full"
                      />
                      <ErrorMessage
                        name="genericName"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>

                    {/* Unit */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="unit">Unit</Label>
                      <Field
                        name="unit"
                        as={Input}
                        id="unit"
                        type="string"
                        placeholder="Enter Unit"
                        className="w-full"
                      />
                      <ErrorMessage
                        name="unit"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="Description">Description</Label>
                      <Field
                        name="description"
                        as={Input}
                        id="description"
                        placeholder="Enter Description"
                        className="w-full"
                      />
                      <ErrorMessage
                        name="description"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>
                  </div>

                  {/* Intended Use */}
                  <div className="flex flex-col space-y-2 w-full">
                    <Label htmlFor="intendedUse">Intended Use</Label>
                    <Field
                      name="intendedUse"
                      as={Input}
                      id="intendedUse"
                      placeholder="Enter Intended Use"
                      className="w-full"
                    />
                    <ErrorMessage
                      name="intendedUse"
                      component="p"
                      className="text-sm text-red-500"
                    />
                  </div>
                  {/* Submit Button */}
                  <Button
                    type="submit"
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

export default AddProduct;
