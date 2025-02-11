import * as yup from "yup";

export const createPipelineSchema = yup.object({
  quantity: yup
    .number()
    .typeError("Quantity must be a number.")
    .integer("Quantity must be an integer.")
    .positive("Quantity must be greater than zero.")
    .required("Quantity is required."),
  lcNumber: yup
    .string()
    .typeError("Lc Number must be a string.")
    .min(1, "Lc Number is required.")
    .required("Lc Number is required."),
  proformaInvoiceNumber: yup
    .string()
    .typeError("Proforma Invoice Number must be a string.")
    .min(1, "Proforma Invoice Number is required.")
    .required("Proforma Invoice Number is required."),
  invoice: yup
    .number()
    .typeError("Invoice must be a number.")
    .positive("Invoice must be a positive number.")
    .required("Invoice is required."),

  lcOpeningDate: yup
    .date()
    .typeError("Opening date must be a valid date.")
    .required("Opening date is required."),

  shippingMethod: yup
    .string()
    .oneOf(["AIR", "SEA"], "Shipping method must be either 'AIR' or 'SEA'.")
    .required("Shipping method is required."),

  portExpectedArrivalDate: yup
    .date()
    .typeError("Expected arrival at port must be a valid date.")
    .required("Expected arrival at port is required."),

  warehouseExpectedArrivalDate: yup
    .date()
    .typeError("Expected arrival at warehouse must be a valid date.")
    .required("Expected arrival at warehouse is required."),

  portArrivalDate: yup.date().typeError("Arrival date at port must be a valid date.").nullable(),

  warehouseArrivalDate: yup.date().typeError("Arrival date at warehouse must be a valid date.").nullable(),

  productId: yup
    .string()
    .typeError("Product ID must be a string.")
    .min(1, "Product ID is required.")
    .required("Product ID is required."),
});

export const updatePipelineSchema = createPipelineSchema.noUnknown().optional();

