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
        throw new Error("attached deposite should be greater than the product's price");
    }
    /*
        `ContractPromiseBatch` is used here to create a transaction to transfer the money to the seller
        The amount of money to be used in the transaction is taken from `context.attachedDeposit` 
        which is defined by `--depositYocto=${AMOUNT}` parameter during the invocation 
    */
    ContractPromiseBatch.create(product.owner).transfer(context.attachedDeposit);
    // adding a product to the list of purchases
    product.incrementSoldAmount();
    productsStorage.set(product.id, product);
}

/**
 * 
 * @param product - a product to be added to the blockchain
 */
export function writeProduct(product: Product): void {
    writeProductInternally(product);
}

/**
 * 
 * A helper function that adds a product to the blockchain where it can be bought
 * 
 * @param product - an identifier of a product that should be stored in the blockchain
 */
function writeProductInternally(product: Product): void {
    // check if the sender is an owner so the product can be updated
    let storedProduct = productsStorage.get(product.id);
    if (storedProduct !== null && product.owner !== null && product.owner !== context.sender) {
        throw new Error("only a product owner can update the product");
    }
    if (storedProduct === null) {
        storedProduct = new Product(product);
    } else {
        storedProduct.updateProduct(product);
    }
    productsStorage.set(product.id, storedProduct);
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
