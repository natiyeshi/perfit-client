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

function UpdateWeeklyReport({ initial }: { initial: any }) {
  const queryClient = useQueryClient();
  const [err, setErr] = useState<any>(null);
  const [open, setOpen] = useState(false); // State for dialog open/close
  console.log(initial, "POP");
  const { isLoading, isError, error, mutate, isSuccess } = useMutation(
    (data) => axios.patch(`/weekly-sales/${initial.id}`, data),
    {
      onSuccess: (res) => {
        toast.success("Sucessfully Added!");
        queryClient.invalidateQueries("weekly-sales");
        setOpen(false);
      },
      onError: (err) => {
        toast.error(
          (err as any)?.response?.data?.message ??
            (err as any)?.message ??
            "something goes wrong!"
        );
      },
    }
  );
  const handleSubmit = async (values: any, { resetForm }: any) => {
    setErr(null);
    console.log("Submitted values:", values);
    mutate(values);
  };

  const initialValues = {
    ...initial,
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size={"sm"} className="flex gap-1 border-0">
          Update Weekly Report
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className=" max-w-[40%] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex w-full justify-between">
            <AlertDialogTitle>Add Weekly Plan</AlertDialogTitle>
            <AlertDialogCancel>
              <IoCloseSharp />
            </AlertDialogCancel>
          </div>
          <AlertDialogDescription>
            {/* {err && (
              <CustomeErrorMessage message={err.message} topic={"Error"} />
            )} */}

            <Formik
              initialValues={initialValues}
              validationSchema={createWeeklySalesSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 w-full">
                    {/* actualContacts */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="actualContacts">Actual Contacts</Label>
                      <Field
                        name="actualContacts"
                        as={Input}
                        id="actualContacts"
                        placeholder="Enter actual Contacts"
                        className="w-full"
                        type="number"
                      />
                      <ErrorMessage
                        name="actualContacts"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>
                    {/* actualVisits */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="actualVisits">Actual Visits</Label>
                      <Field
                        name="actualVisits"
                        as={Input}
                        id="actualVisits"
                        placeholder="Enter Actual Visits"
                        className="w-full"
                        type="number"
                      />
                      <ErrorMessage
                        name="actualVisits"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>
                    {/* actualNewCustomers */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="actualNewCustomers">
                        Actual New Customers
                      </Label>
                      <Field
                        name="actualNewCustomers"
                        as={Input}
                        id="actualNewCustomers"
                        placeholder="Enter Actual New Customers"
                        className="w-full"
                        type="number"
                      />
                      <ErrorMessage
                        name="actualNewCustomers"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>
                    {/* actualTransactions */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="actualTransactions">
                        Actual Transactions
                      </Label>
                      <Field
                        name="actualTransactions"
                        as={Input}
                        id="actualTransactions"
                        placeholder="Enter Actual Transactions"
                        className="w-full"
                        type="number"
                      />
                      <ErrorMessage
                        name="actualTransactions"
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
            {/* {isError && (
              <div className="mt-2 text-sm text-red-500">
                {(error as any).response.data.message}
              </div>
            )} */}
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default UpdateWeeklyReport;
