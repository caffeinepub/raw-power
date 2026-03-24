import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ShippingInfo {
    zip: string;
    country: string;
    city: string;
    fullName: string;
    email: string;
    state: string;
    address: string;
}
export interface CartItem {
    productId: string;
    quantity: bigint;
}
export interface Order {
    id: string;
    status: OrderStatus;
    createdAt: bigint;
    totalCents: bigint;
    shipping: ShippingInfo;
    items: Array<CartItem>;
}
export interface Product {
    id: string;
    tagline: string;
    name: string;
    description: string;
    category: Category;
    price: bigint;
}
export enum Category {
    cut = "cut",
    focus = "focus",
    mass = "mass",
    recovery = "recovery"
}
export enum OrderStatus {
    shipped = "shipped",
    pending = "pending",
    delivered = "delivered",
    processing = "processing"
}
export interface backendInterface {
    addProduct(product: Product): Promise<void>;
    addToCart(productId: string, quantity: bigint): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getAllProductsByPrice(): Promise<Array<Product>>;
    getCart(): Promise<Array<CartItem>>;
    getOrders(): Promise<Array<Order>>;
    getProduct(productId: string): Promise<Product | null>;
    getProductsByCategory(category: Category): Promise<Array<Product>>;
    isLoyaltyMember(email: string): Promise<boolean>;
    placeOrder(shipping: ShippingInfo): Promise<string>;
    removeFromCart(productId: string): Promise<void>;
    signupLoyalty(email: string): Promise<void>;
}
