import { IDBProduct } from "./IProduct";
import { IDBSupplier } from "./ISupplier";

export interface IIodmProduct {
  productId: string; // Must be a non-empty string
  purchasePriceUsd: number; // Must be a positive number
  currentSellingPrice: number; // Must be a positive number
  productMovement: "IN" | "OUT"; // Assuming enum in schema is "MOVEMENT"
  expiryDate: string; // ISO Date
  manufactureDate: string; // ISO Date
  quantity: number; // Must be a positive integer
  product: IDBProduct;
}

export interface IIodm {
  bsc: number; // Must be a non-negative number
  dutyTax: number; // Must be a non-negative number
  supplierId: string; // Must be a non-empty string
  loadingUnloading: number; // Must be a non-negative number
  exchangeRate: number; // Must be a positive number
  insuranceCharge: number; // Must be a non-negative number
  IODMProducts: IIodmProduct[]; // At least one product required
  IODMProductsId : string;
  miscellaneousTax : number;
  freightCost : number;
}

export interface IDBIodmProduct extends IIodmProduct {
  id: string;
  createdAt: string;
  updatedAt: string;
  IODMId: string;
}

export interface IDBIodm extends Omit<IIodm, "IODMProducts"> {
  id: string;
  createdAt: string;
  updatedAt: string;
  IODMProducts: IDBIodmProduct[];

}

export interface IDBPopulatedIODM extends IDBIodm {
  supplier: IDBSupplier;
  IODMProducts: (IDBIodmProduct & { product: IDBProduct })[];
  supplierName : string;
  productsName : string;
}


export interface IDBClientIIodm extends IDBPopulatedIODM {
  
}