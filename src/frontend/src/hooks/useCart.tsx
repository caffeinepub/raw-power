import { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  productId: string;
  quantity: number;
}

const LOCAL_PRODUCTS: Record<string, { name: string; price: number }> = {
  "mk677-anavar-turkesterone": { name: "CLEAR MUSCLE", price: 320000 },
  "raw-whey": { name: "RAW WHEY", price: 499900 },
  "pre-ignition": { name: "PRE-IGNITION", price: 449900 },
  "recovery-fuel": { name: "RECOVERY FUEL", price: 399900 },
};

interface CartContextValue {
  cartItems: CartItem[];
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: () => number;
  getProductInfo: (id: string) => { name: string; price: number } | undefined;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "rawpower_cart";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as CartItem[];
  } catch {
    // ignore
  }
  return [];
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  const addToCart = (productId: string, quantity: number) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const cartTotal = () =>
    cartItems.reduce((sum, item) => {
      const p = LOCAL_PRODUCTS[item.productId];
      return sum + (p ? p.price * item.quantity : 0);
    }, 0);

  const getProductInfo = (id: string) => LOCAL_PRODUCTS[id];

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
        getProductInfo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
