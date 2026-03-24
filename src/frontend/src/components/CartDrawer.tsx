import { ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { useCart } from "../hooks/useCart";

const LOCAL_PRODUCTS: Record<
  string,
  { name: string; price: number; image: string }
> = {
  "mk677-anavar-turkesterone": {
    name: "CLEAR MUSCLE",
    price: 320000,
    image: "/assets/generated/product-clear-muscle-themed.dim_800x900.jpg",
  },
};

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  open,
  onClose,
  onCheckout,
}: CartDrawerProps) {
  const { cartItems, removeFromCart, cartTotal } = useCart();

  const handleRemove = (productId: string, name: string) => {
    removeFromCart(productId);
    toast.success(`${name} removed`);
  };

  const total = cartTotal();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-[oklch(0.05_0_0/0.7)] z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-[oklch(0.13_0_0)] border-l border-subtle z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            data-ocid="cart.dialog"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-subtle">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-brand-orange" />
                <span className="font-display text-base tracking-widest text-foreground">
                  YOUR CART
                </span>
                {cartItems.length > 0 && (
                  <span className="bg-brand-orange text-[oklch(0.11_0_0)] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label="Close cart"
                data-ocid="cart.close_button"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cartItems.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center h-full gap-4 py-20"
                  data-ocid="cart.empty_state"
                >
                  <ShoppingBag size={40} className="text-muted-foreground" />
                  <p className="font-display text-sm tracking-widest text-muted-foreground">
                    YOUR CART IS EMPTY
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-brand-orange text-[oklch(0.11_0_0)] font-display text-xs tracking-widest px-6 py-3 hover:opacity-90 transition-opacity"
                    data-ocid="cart.primary_button"
                  >
                    SHOP NOW
                  </button>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {cartItems.map((item, i) => {
                    const product = LOCAL_PRODUCTS[item.productId];
                    const name = product?.name ?? item.productId;
                    const price = product?.price ?? 0;
                    const image = product?.image ?? "";
                    return (
                      <li
                        key={item.productId}
                        className="flex gap-4 border-b border-subtle pb-4"
                        data-ocid={`cart.item.${i + 1}`}
                      >
                        <div className="w-16 h-16 bg-card-dark flex-shrink-0 overflow-hidden">
                          {image && (
                            <img
                              src={image}
                              alt={name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-sm tracking-widest text-foreground truncate">
                            {name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-brand-orange font-display text-sm mt-1">
                            ₹
                            {Math.round(
                              (price * item.quantity) / 100,
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.productId, name)}
                          className="text-muted-foreground hover:text-destructive transition-colors self-start p-1"
                          aria-label={`Remove ${name}`}
                          data-ocid={`cart.delete_button.${i + 1}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-subtle px-6 py-5">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-display text-sm tracking-widest text-muted-foreground">
                    TOTAL
                  </span>
                  <span className="font-display text-2xl text-brand-orange">
                    ₹{Math.round(total / 100).toLocaleString("en-IN")}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onCheckout}
                  className="w-full bg-brand-orange text-[oklch(0.11_0_0)] font-display text-sm tracking-[0.15em] py-4 hover:opacity-90 active:scale-95 transition-all"
                  data-ocid="cart.primary_button"
                >
                  CHECKOUT
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
