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
import { createWeeklySalesSchema } from "@/validators/weeklysales.validator";

interface IF {}

function AddWeeklyPlan() {
  const queryClient = useQueryClient();
  const [err, setErr] = useState<any>(null);
  const [open, setOpen] = useState(false); // State for dialog open/close
  const { isLoading, isError, error, mutate, isSuccess } = useMutation(
    (data) => axios.post("/weekly-sales", data),
    {
      onSuccess: (res) => {
        toast.success("Sucessfully Added!");
        queryClient.invalidateQueries("weekly-sales");
        setOpen(false);
      },
    }
  );
  const handleSubmit = async (values: any, { resetForm }: any) => {
    setErr(null);
    console.log("Submitted values:", values);
    mutate(values);
  };

  const initialValues = {
    targetSales: 0,
    plannedContacts: 0,
    plannedVisits: 0,
    plannedNewCustomers: 0,
    plannedTransactions: 0,
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex gap-1">
          <div>Add Weekly Plan</div>
          <FaPlus />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className=" max-w-[40%] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex w-full justify-between">
            <AlertDialogTitle>Add Weekly Report</AlertDialogTitle>
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
              validationSchema={createWeeklySalesSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 w-full">
                    {/* targetSales */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="targetSales">Target Sales</Label>
                      <Field
                        name="targetSales"
                        as={Input}
                        id="targetSales"
                        placeholder="Enter Planned Contacts"
                        className="w-full"
                        type="number"
                      />
                      <ErrorMessage
                        name="targetSales"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>
                      {/* plannedContacts */}
                      <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="plannedContacts">Planned Contacts</Label>
                      <Field
                        name="plannedContacts"
                        as={Input}
                        id="plannedContacts"
                        placeholder="Enter Planned Contacts"
                        className="w-full"
                        type="number"
                      />
                      <ErrorMessage
                        name="plannedContacts"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>
                    {/* plannedVisits */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="plannedVisits">Planned Visits</Label>
                      <Field
                        name="plannedVisits"
                        as={Input}
                        id="plannedVisits"
                        placeholder="Enter Planned Visits"
                        className="w-full"
                        type="number"
                      />
                      <ErrorMessage
                        name="plannedVisits"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>
                    {/* plannedNewCustomers */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="plannedNewCustomers">
                        Planned New Customers
                      </Label>
                      <Field
                        name="plannedNewCustomers"
                        as={Input}
                        id="plannedNewCustomers"
                        placeholder="Enter Planned New Customers"
                        className="w-full"
                        type="number"
                      />
                      <ErrorMessage
                        name="plannedNewCustomers"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>
                    {/* plannedTransactions */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="plannedTransactions">
                        Planned Transactions
                      </Label>
                      <Field
                        name="plannedTransactions"
                        as={Input}
                        id="plannedTransactions"
                        placeholder="Enter Planned Transactions"
                        className="w-full"
                        type="number"
                      />
                      <ErrorMessage
                        name="plannedTransactions"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>
                  </div>

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

export default AddWeeklyPlan;
