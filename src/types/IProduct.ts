export interface IProduct {
    productId?: string;
    brandName: string;
    genericName: string;
    unit?: string;
    description?: string;
    intendedUse?: string;
}

export interface IDBProduct extends IProduct {
    id: string;
}