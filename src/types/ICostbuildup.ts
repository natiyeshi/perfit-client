import { IProduct } from "./IProduct";

export interface ICostBuildUpProduct {
    productId: string;
    unitPrice: number;
    quantity: number;
    competitorSellingPrice: number;
    sellingPrice?: number;
}

export interface ICostBuildUp {
    fobPriceUSD: number;
    exchangeRate: number;
    totalFobCostBirr: number;
    fcPurchase: number;
    bankServiceCharges: number;
    insuranceCharge: number;
    freightCharge: number;
    customsDuty: number;
    storageCharges: number;
    inlandTransport: number;
    transitAgentCharge: number;
    loadingUnloadingExpenses: number;
    totalCost: number;
    usdPurchasePrice: number;
    mislaneousCost?: number;
    CostBuildUpProducts?: ICostBuildUpProduct[];
}

export interface IDBCostBuildUpProduct extends ICostBuildUpProduct {
    product: IProduct;
}

export interface IDBPopulatedCostBuildUp extends ICostBuildUp  {
    CostBuildUpProducts?: IDBCostBuildUpProduct[];
}


export interface IDBClientCostBuildUp extends IDBPopulatedCostBuildUp  {
    numberOfProducts : number;
}