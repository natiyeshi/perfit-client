import { string } from "yup";

export interface ICustomer {
  organizationName: string;
  phoneNumber: string;
  city: string;
  tinNumber: string;
  catagory?: string;
  description?: string;
  manufacturerId? : string;
}
export interface IDBCustomer extends ICustomer {
  id: string; 
}
  

