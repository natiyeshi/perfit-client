import { IDBProduct } from "./IProduct";

export interface IPipeline {
    quantity: number;
    invoice: number;
    openingDate: string;
    shippingMethod: "AIR" | "SEA";
    portExpectedArrivalDate: string;
    warehouseExpectedArrivalDate: string;
    portArrivalDate?: string | null;
    warehouseArrivalDate?: string | null;
    productId: string;
  }
  
  export interface IDBPipeline extends IPipeline {
    id: string;
    createdAt: string;
  }
  
  export interface IDBPopulatedPipeline extends IDBPipeline {
    product: IDBProduct;
  }
  
  export interface IDBClientPipeline extends IDBPopulatedPipeline {
    productName?: string;
  }
  