import { Product, productsStorage } from './model';
import { context, ContractPromiseBatch } from "near-sdk-as";

export function buyProduct(productId: string, sellerId: string): void {
    if (!hasProduct(sellerId, productId)) {
        throw new Error("product not found");
    }
    const product = getProduct(sellerId, productId);
    if (product.price.toString() != context.attachedDeposit.toString()) {
        throw new Error("attached deposite should be greater than the product's price");
    }
    ContractPromiseBatch.create(sellerId).transfer(context.attachedDeposit);
    transferProductOwnership(sellerId, context.sender, product);
}

function transferProductOwnership(sellerId: string, buyerId: string, product: Product): void {
    deleteInternally(sellerId, product.id);
    writeProductInternally(buyerId, product);
}

export function writeProduct(product: Product): void {
    writeProductInternally(context.sender, product);
}

function writeProductInternally(owner: string, product: Product): void {
    let products = productsStorage.get(owner);
    if (products == null) {
        products = new Map<string, Product>();
    }
    products.set(product.id, product);
    productsStorage.set(owner, products);
}

export function getProductsByOwner(owner: string): Product[] {
    return getProductsMapByOwner(owner).values();
}

export function getProduct(owner: string, id: string): Product {
    const productsMap = getProductsMapByOwner(owner);
    return productsMap.get(id);
}

export function hasProduct(owner: string, id: string): bool {
    return getProductsMapByOwner(owner).has(id);
}

export function getProducts(): Product[] {
    return productsStorage.values().map<Product[]>(productsByOwners => productsByOwners.values()).flat();
}

export function deleteProduct(id: string): void {
    deleteInternally(context.sender, id);
}

function deleteInternally(owner: string, productId: string): void {
    const products = getProductsMapByOwner(owner);
    if (products.delete(productId)) {
        productsStorage.set(owner, products);
    }
}

function getProductsMapByOwner(owner: string): Map<string, Product> {
    const productsMap = productsStorage.get(owner);
    return productsMap == null ? new Map<string, Product>() : productsMap;
}
