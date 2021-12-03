import { PersistentUnorderedMap, u128 } from "near-sdk-as";

@nearBindgen
export class Product {
    id: string;
    title: string;
    description: string;
    image: string;
    location: string;
    price: u128;
    status: string;
}

export const productsStorage = new PersistentUnorderedMap<string, Map<string, Product>>("PRODUCTS_STORAGE1");
