"use client";
import { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { CreateCostBuildUpSchema } from "@/validators/costBuildUp.validator";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "@/lib/axios";
import { IDBProduct } from "@/types/IProduct";

const defaultProduct = {
  productId: "",
  unitPrice: 0,
  quantity: 0,
  competitorSellingPrice: 0,
  sellingPrice: 0,
};

type FormValues = yup.InferType<typeof CreateCostBuildUpSchema>;

const initialValues: FormValues = {
  fobPriceUSD: 0,
  exchangeRate: 0,
  totalFobCostBirr: 0,
  fcPurchase: 0,
  bankServiceCharges: 0,
  insuranceCharge: 0,
  freightCharge: 0,
  customsDuty: 0,
  storageCharges: 0,
  inlandTransport: 0,
  transitAgentCharge: 0,
  loadingUnloadingExpenses: 0,
  totalCost: 0,
  usdPurchasePrice: 0,
  mislaneousCost: 0,
  CostBuildUpProducts: [],
};

export default function CostBuildUpRegisterPage() {
  const [submitting, setSubmitting] = useState(false);
  const [products, setProducts] = useState<IDBProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    setLoadingProducts(true);
    axios
      .get("/products")
      .then((res) => {
        setProducts(res.data.result || []);
      })
      .catch(() => {
        toast.error("Error loading products!");
      })
      .finally(() => setLoadingProducts(false));
  }, []);

  const handleSubmit = async (values: FormValues, { resetForm }: any) => {
    setSubmitting(true);
    try {
      await axios.post("/cost-buildup", values);
      toast.success("Cost Build Up Registered! 🎉");
      resetForm();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to register cost build up");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-10 px-4">
      <Toaster position="top-center" />
      <div className="w-full mx-4 bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
        <div className="text-3xl font-bold text-center  mb-2 tracking-tight">
          Register Cost Build Up
        </div>
        <div className="text-center text-gray-500 mb-4">
          Fill in the details below to register a new cost build up. All fields
          are required.
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={CreateCostBuildUpSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, resetForm, setFieldValue }) => (
            <Form className="space-y-4">
              {/* Main fields */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="fobPriceUSD">FOB Price (USD)</Label>
                  <Field
                    as={Input}
                    type="number"
                    step="any"
                    name="fobPriceUSD"
                    className="bg-gray-50 border rounded-lg"
                  />
                  <ErrorMessage
                    name="fobPriceUSD"
                    component="p"
                    className="text-xs text-red-500"
                  />
                </div>
                <div>
                  <Label htmlFor="exchangeRate">Exchange Rate</Label>
                  <Field
                    as={Input}
                    type="number"
                    step="any"
                    name="exchangeRate"
                    className="bg-gray-50 border rounded-lg"
                  />
                  <ErrorMessage
                    name="exchangeRate"
                    component="p"
                    className="text-xs text-red-500"
                  />
                </div>
                <div>
                  <Label htmlFor="totalFobCostBirr">
                    Total FOB Cost (Birr)
                  </Label>
                  <Field
                    as={Input}
                    type="number"
                    step="any"
                    name="totalFobCostBirr"
                    className="bg-gray-50 border rounded-lg"
                  />
                  <ErrorMessage
                    name="totalFobCostBirr"
                    component="p"
                    className="text-xs text-red-500"
                  />
                </div>
                <div>
                  <Label htmlFor="fcPurchase">FC Purchase</Label>
                  <Field
                    as={Input}
                    type="number"
                    step="any"
                    name="fcPurchase"
                    className="bg-gray-50 border rounded-lg"
                  />
                  <ErrorMessage
                    name="fcPurchase"
                    component="p"
                    className="text-xs text-red-500"
                  />
                </div>
                <div>
                  <Label htmlFor="bankServiceCharges">
                    Bank Service Charges in %
                  </Label>
                  <Field
                    as={Input}
                    type="number"
                    step="any"
                    name="bankServiceCharges"
                    className="bg-gray-50 border rounded-lg"
                  />
                  <ErrorMessage
                    name="bankServiceCharges"
                    component="p"
                    className="text-xs text-red-500"
                  />
                </div>
                <div>
                  <Label htmlFor="insuranceCharge">Insurance Charge in %</Label>
                  <Field
                    as={Input}
                    type="number"
                    step="any"
                    name="insuranceCharge"
                    className="bg-gray-50 border rounded-lg"
                  />
                  <ErrorMessage
                    name="insuranceCharge"
                    component="p"
                    className="text-xs text-red-500"
                  />
                </div>
                <div>
                  <Label htmlFor="freightCharge">Freight Charge</Label>
                  <Field
                    as={Input}
                    type="number"
                    step="any"
                    name="freightCharge"
                    className="bg-gray-50 border rounded-lg"
                  />
                  <ErrorMessage
                    name="freightCharge"
                    component="p"
                    className="text-xs text-red-500"
                  />
                </div>
                <div>
                  <Label htmlFor="customsDuty">Customs Duty</Label>
                  <Field
                    as={Input}
                    type="number"
                    step="any"
                    name="customsDuty"
                    className="bg-gray-50 border rounded-lg"
                  />
                  <ErrorMessage
                    name="customsDuty"
                    component="p"
                    className="text-xs text-red-500"
                  />
                </div>
                <div>
                  <Label htmlFor="storageCharges">Storage Charges</Label>
                  <Field
                    as={Input}
                    type="number"
                    step="any"
                    name="storageCharges"
                    className="bg-gray-50 border rounded-lg"
                  />
                  <ErrorMessage
                    name="storageCharges"
                    component="p"
                    className="text-xs text-red-500"
                  />
                </div>
                <div>
                  <Label htmlFor="inlandTransport">Inland Transport</Label>
                  <Field
                    as={Input}
                    type="number"
                    step="any"
                    name="inlandTransport"
                    className="bg-gray-50 border rounded-lg"
                  />
                  <ErrorMessage
                    name="inlandTransport"
                    component="p"
                    className="text-xs text-red-500"
                  />
                </div>
                <div>
                  <Label htmlFor="transitAgentCharge">
                    Transit Agent Charge
                  </Label>
                  <Field
                    as={Input}
                    type="number"
                    step="any"
                    name="transitAgentCharge"
                    className="bg-gray-50 border rounded-lg"
                  />
                  <ErrorMessage
                    name="transitAgentCharge"
                    component="p"
                    className="text-xs text-red-500"
                  />
                </div>
                <div>
                  <Label htmlFor="loadingUnloadingExpenses">
                    Loading/Unloading Expenses
                  </Label>
                  <Field
                    as={Input}
                    type="number"
                    step="any"
                    name="loadingUnloadingExpenses"
                    className="bg-gray-50 border rounded-lg"
                  />
                  <ErrorMessage
                    name="loadingUnloadingExpenses"
                    component="p"
                    className="text-xs text-red-500"
                  />
                </div>
                <div>
                  <Label htmlFor="totalCost">Total Cost</Label>
                  <Field
                    as={Input}
                    type="number"
                    step="any"
                    name="totalCost"
                    className="bg-gray-50 border rounded-lg"
                  />
                  <ErrorMessage
                    name="totalCost"
                    component="p"
                    className="text-xs text-red-500"
                  />
                </div>
                <div>
                  <Label htmlFor="usdPurchasePrice">USD Purchase Price</Label>
                  <Field
                    as={Input}
                    type="number"
                    step="any"
                    name="usdPurchasePrice"
                    className="bg-gray-50 border rounded-lg"
                  />
                  <ErrorMessage
                    name="usdPurchasePrice"
                    component="p"
                    className="text-xs text-red-500"
                  />
                </div>
                <div>
                  <Label htmlFor="mislaneousCost">Miscellaneous Cost</Label>
                  <Field
                    as={Input}
                    type="number"
                    step="any"
                    name="mislaneousCost"
                    className="bg-gray-50 border rounded-lg"
                  />
                  <ErrorMessage
                    name="mislaneousCost"
                    component="p"
                    className="text-xs text-red-500"
                  />
                </div>
              </div>
              {/* CostBuildUpProducts array */}
              <div className="border p-4 rounded-xl mt-6 bg-blue-50/40">
                <h2 className="font-semibold mb-2 text-blue-700 text-lg flex items-center gap-2">
                  🛒 Products
                </h2>
                <FieldArray name="CostBuildUpProducts">
                  {({ push, remove }) => (
                    <div>
                      {values.CostBuildUpProducts &&
                        values.CostBuildUpProducts.length > 0 &&
                        values.CostBuildUpProducts.map((item, idx) => (
                          <div
                            key={idx}
                            className="mb-4 border-b pb-2 flex flex-col md:flex-row gap-4 items-end"
                          >
                            <div className="flex-1">
                              <Label>Product</Label>
                              <Select
                                disabled={loadingProducts}
                                onValueChange={(value: string) =>
                                  setFieldValue(
                                    `CostBuildUpProducts.${idx}.productId`,
                                    value
                                  )
                                }
                                value={item.productId}
                              >
                                <SelectTrigger className="w-full bg-gray-50 border rounded-lg">
                                  <SelectValue
                                    placeholder={
                                      loadingProducts
                                        ? "Loading products..."
                                        : "Select product"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {products.length === 0 &&
                                    !loadingProducts && (
                                      <div className="px-4 py-2 text-gray-400">
                                        No products found
                                      </div>
                                    )}
                                  {products.map((pr) => (
                                    <SelectItem key={pr.id} value={pr.id}>
                                      {pr.brandName}{" "}
                                      <span className="text-xs text-gray-500">
                                        ({pr.genericName})
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <ErrorMessage
                                name={`CostBuildUpProducts.${idx}.productId`}
                                component="p"
                                className="text-xs text-red-500"
                              />
                            </div>
                            <div className="flex-1">
                              <Label>Unit Price</Label>
                              <Field
                                as={Input}
                                type="number"
                                step="any"
                                name={`CostBuildUpProducts.${idx}.unitPrice`}
                                className="bg-gray-50 border rounded-lg"
                              />
                              <ErrorMessage
                                name={`CostBuildUpProducts.${idx}.unitPrice`}
                                component="p"
                                className="text-xs text-red-500"
                              />
                            </div>
                            <div className="flex-1">
                              <Label>Quantity</Label>
                              <Field
                                as={Input}
                                type="number"
                                step="any"
                                name={`CostBuildUpProducts.${idx}.quantity`}
                                className="bg-gray-50 border rounded-lg"
                              />
                              <ErrorMessage
                                name={`CostBuildUpProducts.${idx}.quantity`}
                                component="p"
                                className="text-xs text-red-500"
                              />
                            </div>
                            <div className="flex-1">
                              <Label>Competitor Selling Price</Label>
                              <Field
                                as={Input}
                                type="number"
                                step="any"
                                name={`CostBuildUpProducts.${idx}.competitorSellingPrice`}
                                className="bg-gray-50 border rounded-lg"
                              />
                              <ErrorMessage
                                name={`CostBuildUpProducts.${idx}.competitorSellingPrice`}
                                component="p"
                                className="text-xs text-red-500"
                              />
                            </div>
                            <div className="flex-1">
                              <Label>Selling Price</Label>
                              <Field
                                as={Input}
                                type="number"
                                step="any"
                                name={`CostBuildUpProducts.${idx}.sellingPrice`}
                                className="bg-gray-50 border rounded-lg"
                              />
                              <ErrorMessage
                                name={`CostBuildUpProducts.${idx}.sellingPrice`}
                                component="p"
                                className="text-xs text-red-500"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => remove(idx)}
                              className="mt-2"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      <Button
                        type="button"
                        onClick={() => push(defaultProduct)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-2"
                      >
                        Add Product
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </div>
              <div className="flex gap-4 justify-center mt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting || submitting}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg shadow-md transition"
                >
                  {isSubmitting || submitting ? "Submitting..." : "Submit"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => resetForm()}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-2 rounded-lg transition"
                >
                  Reset
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
