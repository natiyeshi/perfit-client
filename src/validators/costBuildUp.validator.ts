import * as yup from 'yup';

export const CreateCostBuildUpProductSchema = yup.object().shape({
  productId: yup
    .string()
    .required("Product ID is required"),
  unitPrice: yup
    .number()
    .typeError("Unit price must be a number")
    .required("Unit price is required"),
  quantity: yup
    .number()
    .typeError("Quantity must be a number")
    .required("Quantity is required"),
  competitorSellingPrice: yup
    .number()
    .typeError("Competitor selling price must be a number")
    .required("Competitor selling price is required"),
  sellingPrice: yup
    .number()
    .typeError("Selling price must be a number")
    .notRequired(),
});

export const CreateCostBuildUpSchema = yup.object().shape({
  fobPriceUSD: yup
    .number()
    .typeError("FOB price (USD) must be a number")
    .required("FOB price (USD) is required"),
  exchangeRate: yup
    .number()
    .typeError("Exchange rate must be a number")
    .required("Exchange rate is required"),
  totalFobCostBirr: yup
    .number()
    .typeError("Total FOB cost (Birr) must be a number")
    .required("Total FOB cost (Birr) is required"),
  fcPurchase: yup
    .number()
    .typeError("FC purchase must be a number")
    .required("FC purchase is required"),
  bankServiceCharges: yup
    .number()
    .typeError("Bank service charges must be a number")
    .required("Bank service charges are required"),
  insuranceCharge: yup
    .number()
    .typeError("Insurance charge must be a number")
    .required("Insurance charge is required"),
  freightCharge: yup
    .number()
    .typeError("Freight charge must be a number")
    .required("Freight charge is required"),
  customsDuty: yup
    .number()
    .typeError("Customs duty must be a number")
    .required("Customs duty is required"),
  storageCharges: yup
    .number()
    .typeError("Storage charges must be a number")
    .required("Storage charges are required"),
  inlandTransport: yup
    .number()
    .typeError("Inland transport must be a number")
    .required("Inland transport is required"),
  transitAgentCharge: yup
    .number()
    .typeError("Transit agent charge must be a number")
    .required("Transit agent charge is required"),
  loadingUnloadingExpenses: yup
    .number()
    .typeError("Loading/unloading expenses must be a number")
    .required("Loading/unloading expenses are required"),
  totalCost: yup
    .number()
    .typeError("Total cost must be a number")
    .required("Total cost is required"),
  usdPurchasePrice: yup
    .number()
    .typeError("USD purchase price must be a number")
    .required("USD purchase price is required"),
  mislaneousCost: yup
    .number()
    .typeError("Miscellaneous cost must be a number")
    .notRequired()
    .default(0),

  CostBuildUpProducts: yup
    .array()
    .of(CreateCostBuildUpProductSchema)
    .notRequired()
    .default([]),

});