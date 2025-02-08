import * as z from "zod";

import * as authValidator from "./auth.validator";

import * as productValidator from "./product.validator";

import * as userValidator from "./user.validator";
import * as supplierValidator from "./supplier.validator";
import * as competitorValidator from "./competitor.validator";
import * as competitorImportValidator from "./competitor-import.validator";
import * as inventoryValidator from "./inventory.validator";
import * as customerValidator from "./customer.validator";
import * as transactionValidator from "./transaction.validator";
import * as productCategoryValidator from "./product-category.validator";
const queryParamIDValidator = (
  message = "Query param ID not provided or invalid."
) => {
  return z.object({
    id: z
      .string({
        message,
      })
      .min(1, { message }),
  });
};

export {
  queryParamIDValidator,
  authValidator,
  productValidator,
  userValidator,
  supplierValidator,
  competitorValidator,
  competitorImportValidator,
  inventoryValidator,
  customerValidator,
  transactionValidator,
  productCategoryValidator,
};
