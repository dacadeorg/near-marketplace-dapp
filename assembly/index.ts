import { Product, productsStorage } from './model';
import { context, ContractPromiseBatch, MapEntry } from "near-sdk-as";

/**
 * 
 * This function changes the state of data in the blockchain. 
 * It is used to issue buy transactions when a product is purchased from a given seller (if the product is available)
 * 
 * @param productId - an identifier of a product that is the subject of purchase
 * @param sellerId - an indentifier of an account who sells the product
 */
export function buyProduct(productId: string, sellerId: string): void {

    // validates that the seller and the buyer are two different accounts to prevent sell transactions for the same account
    if (sellerId === context.sender) {
        throw new Error("seller and buyer cannot be the same account");
    }
    const product = getProduct(sellerId, productId);
    if (product == null) {
        throw new Error("product not found");
    }
    if (product.price.toString() != context.attachedDeposit.toString()) {
        throw new Error("attached deposite should be greater than the product's price");
    }
    /*
        `ContractPromiseBatch` is used here to create a transaction to transfer the money to the seller
        The amount of money to be used in the transaction is taken from `context.attachedDeposit` 
        which is defined by `--depositYocto=${AMOUNT}` parameter during the invocation 
    */
    ContractPromiseBatch.create(sellerId).transfer(context.attachedDeposit);
    writeProductInternally(context.sender, product);
}

/**
 * 
 * @param product - a product to be added to the blockchain
 */
export function writeProduct(product: Product): void {
    writeProductInternally(context.sender, product);
}

/**
 * 
 * A helper function that adds a product to the blockchain where it can be bought
 * 
 * @param owner - an indentifier of an account who puts the product to the blockchain
 * @param product - an identifier of a product that should be stored in the blockchain
 */
function writeProductInternally(owner: string, product: Product): void {
    let products = productsStorage.get(owner);
    if (products == null) {
        products = new Map<string, Product>();
    }
    products.set(product.id, product);
    productsStorage.set(owner, products);
}

/**
 * 
 * A function that returns a list of products for a given owner id
 *  
 * @param owner - an identifier of an account whose products to be returned
 * @returns an array of products
 */
export function getProductsByOwner(owner: string): Product[] {
    return getProductsMapByOwner(owner).values();
}

/**
 * 
 * A function that returns a single product for given owner and product id
 * 
 * @param owner - an identifier of an account whose products to be returned
 * @param id - an identifier of a product to be returned
 * @returns a product for a given @param id
 */
export function getProduct(owner: string, id: string): Product | null {
    const productsMap = getProductsMapByOwner(owner);
    return productsMap.get(id);
}

/**
 * 
 * A function that returns an array of products for all accounts
 * 
 * @returns an array of objects that represent a product
 */
export function getProducts(): MapEntry<string, Map<string, Product>>[] {
    return productsStorage.entries();
}

/**
 * 
 * A helper function to return products for a given accountId
 * 
 * @param owner - an identifier of an account whose products to be returned
 * @returns a key-value structure of products where:
 * - key is a product id
 * - value is a product
 */
function getProductsMapByOwner(owner: string): Map<string, Product> {
    const productsMap = productsStorage.get(owner);
    return productsMap == null ? new Map<string, Product>() : productsMap;
}
