import { IDBProduct } from "./IProduct";

export interface IProductWithPrice {
    productId: string;
    unitPrice: number;
    quantity: number;
}

export interface IDBProductWithPrice extends IProductWithPrice {
    id: string;
    product : IDBProduct
}