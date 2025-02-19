import { IDBCompetitor } from "./ICompetitor";
import { IDBCustomer } from "./ICustomer";
import { IDBProduct } from "./IProduct";
import { IDBSupplier } from "./ISupplier";

export interface ITransaction {
  unitPrice: number;
  quantity: number;
  productId: string;
  customerId: string;
  withCredit: boolean;
}

export interface IDBTransaction extends ITransaction {
  id : string;
  salesPersonId : string;
  isFinalized : boolean;

}

export interface IDBPopulatedTransaction extends IDBTransaction {
  product : IDBProduct;
  customer : IDBCustomer;
  import : IDBSupplier;
  salesPerson : {
    userId : string, 
    user : {
      fullName : string,
      email : string,
      role : string,
    }
  };
}


export interface IDBClientTransaction extends IDBPopulatedTransaction {
  productName? : string;
  customerName? : string;
  totalPrice? : number,
  salesPersonName : string;
  withCreditName : string;
  isFinalizedName : string; 
}