import * as yup from "yup";

export const createIODMSchema = yup.object().shape({
  freightCost: yup
    .number()
    .typeError("Freight cost must be a number.")
    .min(0, "Freight cost cannot be negative.")
    .required("Freight cost is required."),
  dutyTax: yup
    .number()
    .typeError("Duty tax must be a number.")
    .min(0, "Duty tax cannot be negative.")
    .required("Duty tax is required."),
  bsc: yup
    .number()
    .typeError("Bunker surcharge (BSC) must be a number.")
    .min(0, "BSC cannot be negative.")
    .required("BSC is required."),
  insuranceCharge: yup
    .number()
    .typeError("Insurance charge must be a number.")
    .min(0, "Insurance charge cannot be negative.")
    .required("Insurance charge is required."),
  miscellaneousTax: yup
    .number()
    .typeError("Miscellaneous Tax must be a number.")
    .min(0, "Miscellaneous Tax cannot be negative.")
    .required("Miscellaneous Tax is required."),
  loadingUnloading: yup
    .number()
    .typeError("Loading/unloading cost must be a number.")
    .min(0, "Loading/unloading cost cannot be negative.")
    .required("Loading/unloading cost is required."),
  exchangeRate: yup
    .number()
    .typeError("Exchange rate must be a number.")
    .positive("Exchange rate must be greater than zero.")
    .required("Exchange rate is required."),
  supplier: yup
    .object()
    .required("Supplier is required."),
 });

export const updateIODMSchema = createIODMSchema.noUnknown(true).shape({
  expiryDate: yup.date().notRequired(),
  manufactureDate: yup.date().notRequired(),
});

export const getIODMsQuerySchema = yup.object().shape({
  populate: yup
    .string()
    .oneOf(["true", "false"], "Populate must be a boolean.")
    .notRequired(),
  // Extend additional fields from `paginationsQueryValidator` and `lastDaysQueryValidator` here
});


export const currValidationSchema = yup.object().shape({
    product: yup.object().required("Product is required"),
    
    expiryDate: yup.string()
      .required("Expiry date is required"),
    currentSellingPrice: yup
      .number()
      .typeError("Current Selling Price must be a number.")
      .min(0, "Current Selling Price must be Posetive.")
      .required("Current Selling Price is required."),
   
    manufactureDate: yup.string()
      .required("Manufacture date is required"),
    
    purchasePriceUsd: yup.number()
      .typeError("Purchase price must be a number")
      .min(0, "Purchase price must be Posetive")
      .required("Purchase price is required"),
    quantity: yup.number()
      .typeError("Quantity must be a number")
      .min(1, "Quantity must be at least 1")
      .required("Quantity is required"),
    
    productMovement: yup.string().required("Product Movement is required!"), // Assuming it's a string, adjust as needed
});