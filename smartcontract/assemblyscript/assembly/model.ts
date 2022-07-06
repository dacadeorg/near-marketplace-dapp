import { PersistentUnorderedMap, context, PersistentMap, u128 } from "near-sdk-as";

/**
 * This class represents a product that can be listed on a marketplace.
 * It contains basic properties that are needed to define a product.
 * The price of the product is of type u128 that allows storing it in yocto-NEAR, where `1 yocto = 1^-24`.
 * {@link nearBindgen} - it's a decorator that makes this class serializable so it can be persisted on the blockchain level. 
 */
@nearBindgen
export class Product {
    id: string;
    name: string;
    description: string;
    image: string;
    location: string;
    price: u128;
    owner: string;
    sold: u32;
    public static fromPayload(payload: Product): Product {
        const product = new Product();
        product.id = payload.id;
        product.name = payload.name;
        product.description = payload.description;
        product.image = payload.image;
        product.location = payload.location;
        product.price = payload.price;
        product.owner = context.sender;
        return product;
    }
    public incrementSoldAmount(): void {
        this.sold = this.sold + 1;
    }
}

/**
 * `productsStorage` - it's a key-value datastructure that is used to store products by sellers.
 * The backbone of this datastructure is {@link PersistentUnorderedMap} - a facade in front of the NEAR's {@link Storage}.
 * For the sake of this contract we've chosen {@link PersistentUnorderedMap} as a storage for the next reasons:
 * - `set`, `get` and `delete` operations have a constant time complexity - O(1)
 * - keys are stored in the blockchain (which is opposite to {@link PersistentMap})
 * - provides an interface to return a range of values
 * 
 * Brakedown of the `PersistentUnorderedMap<string, Product>` datastructure:
 * - the key of `PersistentUnorderedMap` is a `productId`
 * - the value in this `PersistentUnorderedMap` is a product itself `Product` that is related to a given key (`productId`)
 */
export const productsStorage = new PersistentUnorderedMap<string, Product>("LISTED_PRODUCTS");
