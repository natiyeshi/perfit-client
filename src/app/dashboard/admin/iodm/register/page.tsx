"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { Input } from "@/components/ui/input"; // ShadCN Input component
import { Button } from "@/components/ui/button"; // ShadCN Button component
import { Label } from "@/components/ui/label"; // ShadCN Label component
import {
  createIODMSchema,
  currValidationSchema,
} from "@/validators/Iodm.validator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "react-query";
import axios from "@/lib/axios";
import { IIodm } from "@/types/IIodm";
import { IDBSupplier } from "@/types/ISupplier";
import { useState } from "react";
import { IDBProduct } from "@/types/IProduct";

interface Single {
  product: IDBProduct | null;
  expiryDate: string;
  manufactureDate: string;
  purchasePriceUsd: number;
  quantity: number;
  currentSellingPrice: number;
  productMovement: "MEDIUM" | "FAST" | "SLOW" | null;
}
interface Iintical {
  products: Single[];
  curr?: Single | null;
  freightCost: number;
  dutyTax: number;
  miscellaneousTax: number;
  bsc: number;
  insuranceCharge: number;
  loadingUnloading: number;
  exchangeRate: number;
  supplier: IDBSupplier | null;
}

const Page = () => {
  const { isLoading, mutate } = useMutation(
    (data: any) =>
      axios.post("/IODMs", {
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

  const [products, setProducts] = useState<IDBProduct[]>([]);
  const [suppliers, setSuppliers] = useState<IDBSupplier[]>([]);

  const productQuery = useQuery("products", () => axios.get("/products"), {
    onSuccess(data) {
      setProducts(data.data.result || []);
    },
    onError(err) {
      toast.error("Error while loading products!");
    },
  });
  const supplierQuery = useQuery("suppliers", () => axios.get("/suppliers"), {
    onSuccess(data) {
      setSuppliers(data.data.result || []);
    },
    onError(err) {
      toast.error("Error while loading suppliers!");
    },
  });

  const currInitial: Single = {
    product: null,
    expiryDate: "",
    manufactureDate: "",
    purchasePriceUsd: 0,
    productMovement: "MEDIUM",
    quantity: 0,
    currentSellingPrice: 0,
  };

  const [finalized, setFinalized] = useState(false);

  const handleSubmit = (data: any) => mutate(data);

  const initialValues: Iintical = {
    products: [],
    curr: currInitial,
    freightCost: 11,
    dutyTax: 15,
    bsc: 12,
    insuranceCharge: 0.5,
    miscellaneousTax: 2,
    loadingUnloading: 0,
    exchangeRate: 150,
    supplier: null,
  };

  const handleAddProduct = (values: Iintical, setFieldValue: Function) => {
    currValidationSchema
      .validate(values.curr, { abortEarly: false }) // `abortEarly: false` ensures all errors are returned
      .then(() => {
        toast.success("Product added!");
        setFieldValue("products", [...values.products, values.curr]);
        setFieldValue("curr", null);
      })
      .catch((err) => {
        toast.error(err.errors[0]);
      });
  };
  const handleFinalize = (values: Iintical) => {
    let a = { ...values };
    if (a.curr) {
      delete a.curr;
    }
    console.log(a, "AAAA");
    createIODMSchema
      .validate(a, { abortEarly: false }) // `abortEarly: false` ensures all errors are returned
      .then(() => {
        if (values.products.length > 0) {
          setFinalized(true);
        } else {
          toast.error("Please Add Product First!");
        }
      })
      .catch((err) => {
        toast.error(err.errors[0]);
      });
  };

  return (
    <div className="px-12 overflow-y-auto pb-20">
      <div className="big-topic py-8">Register IODM Data</div>
      <Formik
        initialValues={initialValues}
        // validationSchema={createIODMSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, handleChange }) =>
          finalized ? (
            <ShowCalc values={values} setFinalized={setFinalized} />
          ) : (
            <Form className="space-y-6">
              {values.curr == null ? (
                <Button
                  className="px-4"
                  onClick={() => setFieldValue("curr", currInitial)}
                >
                  Add Product
                </Button>
              ) : (
                <div className=" grid grid-cols-2 border p-4 shadow rounded-xl gap-4">
                  {/* Expiry Date */}
                  <div className="col-span-2 font-bold">Product Form</div>
                  <div className="flex flex-col space-y-2 w-full">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Field
                      name="curr.expiryDate"
                      as={Input}
                      type="date"
                      id="expiryDate"
                      className="w-full"
                      onChange={handleChange}
                      value={values.curr?.expiryDate}
                    />
                  </div>

                  {/* Manufacture Date */}
                  <div className="flex flex-col space-y-2 w-full">
                    <Label htmlFor="manufactureDate">Manufacture Date</Label>
                    <Field
                      name="curr.manufactureDate"
                      as={Input}
                      type="date"
                      id="manufactureDate"
                      className="w-full"
                      onChange={handleChange}
                      value={values.curr?.manufactureDate}
                    />
                  </div>

                  {/* Product */}
                  <div className="flex flex-col space-y-2 w-full">
                    <Label htmlFor="productId">Product</Label>
                    <Select
                      onValueChange={(value) =>
                        setFieldValue(
                          "curr.product",
                          products.find((s) => s.id == value)
                        )
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product: IDBProduct) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Quantity */}
                  <div className="flex flex-col space-y-2 w-full">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Field
                      name="curr.quantity"
                      as={Input}
                      type="number"
                      className="w-full"
                      onChange={handleChange}
                      value={values.curr?.quantity}
                    />
                  </div>
                  {/* Purchase Price */}
                  <div className="flex flex-col space-y-2 w-full">
                    <Label htmlFor="purchasePriceUsd">
                      Purchase Price (USD)
                    </Label>
                    <Field
                      name="curr.purchasePriceUsd"
                      as={Input}
                      type="number"
                      className="w-full"
                      onChange={handleChange}
                      value={values.curr?.purchasePriceUsd}
                    />
                  </div>
                  {/* Selling Price */}

                  <div className="flex flex-col space-y-2 w-full">
                    <Label htmlFor="currentSellingPrice">
                      Current Selling Price
                    </Label>
                    <Field
                      name="curr.currentSellingPrice"
                      as={Input}
                      type="number"
                      className="w-full"
                    />
                  </div>

                  {/* Product Movement */}
                  <div className="flex flex-col space-y-2 w-full">
                    <Label htmlFor="productMovement">Product Movement</Label>
                    <Field
                      name="curr.productMovement"
                      as="select"
                      className="w-full border rounded-md p-2"
                      onChange={handleChange}
                      value={values.curr?.productMovement}
                    >
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="LOW">Low</option>
                    </Field>
                  </div>

                  <Button
                    type="button"
                    onClick={() => {
                      handleAddProduct(values, setFieldValue);
                    }}
                    className="w-fit px-12 col-span-2"
                  >
                    Save
                  </Button>
                </div>
              )}

              {values.products.length > 0 && (
                <div className="w-full flex flex-col">
                  <div className="grid grid-cols-6 gap-2 bg-secondary text-white py-2 px-4 items-center place-content-center place-items-center">
                    <div>Num</div>
                    <div>Product Name</div>
                    <div>Expiry Date</div>
                    <div>Manufacture Date</div>
                    <div>Purchase Price</div>
                    <div>Delete</div>
                  </div>
                  {values.products.map((value, ind) => (
                    <div
                      key={ind}
                      className="grid grid-cols-6 gap-2  py-2 px-4 items-center place-content-center place-items-center"
                    >
                      <div>Num</div>
                      <div>{value.product?.name}</div>
                      <div>{value.expiryDate}</div>
                      <div>{value.manufactureDate}</div>
                      <div>{value.purchasePriceUsd}</div>
                      <div
                        onClick={() => {
                          setFieldValue(
                            "products",
                            values.products.filter((d, i) => i != ind)
                          );
                        }}
                      >
                        Delete
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mt-12 w-full">
                {/* Supplier */}
                <div className="flex flex-col space-y-2 w-full">
                  <Label htmlFor="supplierId">Supplier</Label>
                  <Select
                    onValueChange={(value) =>
                      setFieldValue(
                        "supplier",
                        suppliers.find((s) => s.id == value)
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier: IDBSupplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.manufacturerName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="supplierId"
                    component="p"
                    className="text-sm text-red-500"
                  />
                </div>

                <div className="flex flex-col space-y-2 w-full">
                  <Label htmlFor="miscellaneousTax">Miscellaneous Tax</Label>
                  <Field
                    name="miscellaneousTax"
                    as={Input}
                    type="number"
                    className="w-full"
                  />
                </div>

                <div className="flex flex-col space-y-2 w-full">
                  <Label htmlFor="dutyTax">Duty Tax</Label>
                  <Field
                    name="dutyTax"
                    as={Input}
                    type="number"
                    className="w-full"
                  />
                </div>

                <div className="flex flex-col space-y-2 w-full">
                  <Label htmlFor="loadingUnloading">Loading Unloading</Label>
                  <Field
                    name="loadingUnloading"
                    as={Input}
                    type="number"
                    className="w-full"
                  />
                </div>

                <div className="flex flex-col space-y-2 w-full">
                  <Label htmlFor="exchangeRate">Exchange Rate</Label>
                  <Field
                    name="exchangeRate"
                    as={Input}
                    type="number"
                    className="w-full"
                  />
                </div>

                <div className="flex flex-col space-y-2 w-full">
                  <Label htmlFor="bsc">BSC</Label>
                  <Field
                    name="bsc"
                    as={Input}
                    type="number"
                    className="w-full"
                  />
                </div>

                <div className="flex flex-col space-y-2 w-full">
                  <Label htmlFor="insuranceCharge">Insurance Charge</Label>
                  <Field
                    name="insuranceCharge"
                    as={Input}
                    type="number"
                    className="w-full"
                  />
                </div>
              </div>

              <Button
                type="button"
                onClick={() => handleFinalize(values)}
                className="mx-auto"
              >
                Submit
              </Button>
            </Form>
          )
        }
      </Formik>
    </div>
  );
};

const ShowCalc = ({
  values,
  setFinalized,
}: {
  values: Iintical;
  setFinalized: Function;
}) => {
  let totalLandingPrice = values.products.reduce(
    (acc, num) =>
      acc + num.purchasePriceUsd * num.quantity * values.exchangeRate,
    0
  );
  totalLandingPrice += totalLandingPrice * (values.freightCost / 100);
  totalLandingPrice += totalLandingPrice * (values.dutyTax / 100);
  totalLandingPrice += totalLandingPrice * (values.bsc / 100);
  totalLandingPrice += totalLandingPrice * (values.insuranceCharge / 100);
  totalLandingPrice += totalLandingPrice * (values.miscellaneousTax / 100);
  totalLandingPrice += values.loadingUnloading;
  const expectedSellingPrice = values.products.reduce(
    (acc, num) => acc + num.currentSellingPrice * num.quantity,
    0
  );
  const totalNetProfit = expectedSellingPrice - totalLandingPrice;
  const totalProfitMargin = (expectedSellingPrice / totalLandingPrice) * 100;
  return (
    <div className="flex flex-col">
      <Button onClick={() => setFinalized(false)}>Go Back</Button>
      {values.products.length > 0 && <ShowTable values={values} />}
      <div className="flex border w-2/3 px-12 py-1 rounded bg-gray-100 gap-3 mt-4 items-center text-lg">
        <div className=" font-semibold">Total Landing Price</div>
        <div>
          {parseFloat(totalLandingPrice.toFixed(2)).toLocaleString()} Birr
        </div>
      </div>
      <div className="flex border w-2/3 px-12 py-1 rounded bg-gray-100 gap-3 mt-4 items-center text-lg">
        <div className=" font-semibold">Expected Selling Price</div>
        <div>
          {parseFloat(expectedSellingPrice.toFixed(2)).toLocaleString()} Birr
        </div>
      </div>
      <div className="flex border w-2/3 px-12 py-1 rounded bg-gray-100 gap-3 mt-4 items-center text-lg">
        <div className=" font-semibold">Total Net Profilt</div>
        <div>{parseFloat(totalNetProfit.toFixed(2)).toLocaleString()} Birr</div>
      </div>
      <div className="flex border w-2/3 px-12 py-1 rounded bg-gray-100 gap-3 mt-4 items-center text-lg">
        <div className=" font-semibold">Total Profit Margin</div>
        <div>{parseFloat(totalProfitMargin.toFixed(2)).toLocaleString()}%</div>
      </div>
    </div>
  );
};

const ShowTable = ({ values }: { values: Iintical }) => {
  return (
    <div>
      <div className="w-full flex flex-col">
        <div className="grid grid-cols-7 border gap-2 bg-secondary text-white py-2 px-4 items-center place-content-center place-items-center">
          <div>Product Name</div>
          <div>Quantity</div>
          <div>Expiry Date</div>
          <div>Manufacture Date</div>
          <div>Purchase Price</div>
          <div>Selling Price</div>
          <div>Total Price (USD)</div>
        </div>
        {values.products.map((value, ind) => (
          <div
            key={ind}
            className="grid grid-cols-7 border gap-2  py-2 px-4 items-center place-content-center place-items-center"
          >
            <div>{value.product?.name}</div>
            <div>{value.quantity}</div>
            <div>{value.expiryDate}</div>
            <div>{value.manufactureDate}</div>
            <div>{value.purchasePriceUsd}</div>
            <div>{value.currentSellingPrice}</div>
            <div>{value.purchasePriceUsd * value.quantity}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Page;
