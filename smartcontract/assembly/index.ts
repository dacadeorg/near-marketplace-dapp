import { Product, productsStorage } from './model';
import { context, ContractPromiseBatch } from "near-sdk-as";

/**
 * 
 * This function changes the state of data in the blockchain. 
 * It is used to issue buy transactions when a product is purchased from a given seller (if the product is available)
 * 
 * @param productId - an identifier of a product that is the subject of purchase
 */
export function buyProduct(productId: string): void {
    const product = getProduct(productId);
    if (product == null) {
        throw new Error("product not found");
    }
    if (product.price.toString() != context.attachedDeposit.toString()) {
        throw new Error("attached deposit should be greater than the product's price");
    }
    /*
        `ContractPromiseBatch` is used here to create a transaction to transfer the money to the seller
        The amount of money to be used in the transaction is taken from `context.attachedDeposit` 
        which is defined by `--depositYocto=${AMOUNT}` parameter during the invocation 
    */
    ContractPromiseBatch.create(product.owner).transfer(context.attachedDeposit);
    product.incrementSoldAmount();
    productsStorage.set(product.id, product);
}

/**
 * 
 * @param product - a product to be added to the blockchain
 */
export function setProduct(product: Product): void {
    let storedProduct = productsStorage.get(product.id);
    if (storedProduct !== null) {
        throw new Error(`a product with id=${product.id} already exists`);
    }
    productsStorage.set(product.id, Product.fromPayload(product));
}

/**
 * 
 * A function that returns a single product for given owner and product id
 * 
 * @param id - an identifier of a product to be returned
 * @returns a product for a given @param id
 */
export function getProduct(id: string): Product | null {
    return productsStorage.get(id);
}

/**
 * 
 * A function that returns an array of products for all accounts
 * 
 * @returns an array of objects that represent a product
 */
export function getProducts(): Array<Product> {
    return productsStorage.values();
}
