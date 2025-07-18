import { IDBCompetitor } from "./ICompetitor";
import { IDBProduct } from "./IProduct";
import { IDBSupplier } from "./ISupplier";
import { IProductWithPrice } from "./IProductWithPrice"
import { IDBProductWithPrice} from "./IProductWithPrice"
export interface IImport {
  importId: string;
  amount: number;
  paymentMode?: string;
  modeOfShipment?: string;
  currency?: string;
  supplierId: string;
  competitorId: string;
  date: string | Date;
  products: IDBProductWithPrice[]; 

}

export interface IDBImport extends IImport {
  id : string;
  createdAt : string;
}

export interface IDBPopulatedImport extends IDBImport {
  competitor : IDBCompetitor;
  supplier : IDBSupplier;
  products: IDBProductWithPrice[]; 
}


export interface IDBClientImport extends IDBPopulatedImport {
  productName? : string;
  competitorName? : string;
  supplierName? : string;
  unit? : string,
  totalPrice? : number,
  showProducts? : any,
}