import { CheckCircle2, ChevronLeft, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { ShippingInfo } from "../backend.d";
import { useCart } from "../hooks/useCart";
import { useGetAllProducts, usePlaceOrder } from "../hooks/useQueries";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

const EMPTY_SHIPPING: ShippingInfo = {
  fullName: "",
  email: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "US",
};

const LOCAL_PRICES: Record<string, number> = {
  "raw-whey": 4999,
  "pre-ignition": 4499,
  "recovery-fuel": 3999,
};

const LOCAL_NAMES: Record<string, string> = {
  "raw-whey": "RAW WHEY",
  "pre-ignition": "PRE-IGNITION",
  "recovery-fuel": "RECOVERY FUEL",
};

type Step = 1 | 2 | 3;

export default function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [shipping, setShipping] = useState<ShippingInfo>(EMPTY_SHIPPING);
  const [orderId, setOrderId] = useState("");

  const { cartItems, clearCart } = useCart();
  const { data: products = [] } = useGetAllProducts();
  const placeOrder = usePlaceOrder();

  const getProductName = (id: string) => {
    const p = products.find((p) => p.id === id);
    return p?.name ?? LOCAL_NAMES[id] ?? id;
  };

  const getProductPrice = (id: string) => {
    const p = products.find((p) => p.id === id);
    return p ? Number(p.price) : (LOCAL_PRICES[id] ?? 0);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + getProductPrice(item.productId) * item.quantity,
    0,
  );

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    try {
      const id = await placeOrder.mutateAsync(shipping);
      clearCart();
      setOrderId(id);
      setStep(3);
    } catch {
      // error handled via mutation state
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setShipping(EMPTY_SHIPPING);
      setOrderId("");
    }, 300);
  };

  const inputClass =
    "w-full bg-[oklch(0.15_0_0)] border border-[oklch(0.25_0_0)] text-foreground font-sans text-sm px-4 py-3 outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors placeholder:text-[oklch(0.40_0_0)]";

  const labelClass =
    "block font-display text-[10px] tracking-widest text-[oklch(0.55_0_0)] mb-1.5";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          data-ocid="checkout.modal"
        >
          {/* Backdrop */}
          <div
            role="button"
            tabIndex={-1}
            aria-label="Close checkout"
            className="fixed inset-0 bg-[oklch(0.03_0_0/0.85)]"
            onClick={handleClose}
            onKeyDown={(e) => e.key === "Escape" && handleClose()}
          />

          {/* Modal panel */}
          <motion.div
            className="relative w-full max-w-lg bg-[oklch(0.10_0_0)] border border-[oklch(0.20_0_0)] my-8 mx-4 flex flex-col"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 280,
              delay: 0.05,
            }}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[oklch(0.20_0_0)]">
              <div className="flex items-center gap-3">
                {([1, 2, 3] as Step[]).map((s) => (
                  <div
                    key={s}
                    className={`w-6 h-0.5 transition-colors ${
                      step >= s ? "bg-brand-orange" : "bg-[oklch(0.25_0_0)]"
                    }`}
                  />
                ))}
                <span className="font-display text-[10px] tracking-widest text-[oklch(0.45_0_0)] ml-1">
                  STEP {step} / 3
                </span>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-[oklch(0.45_0_0)] hover:text-foreground transition-colors p-1"
                aria-label="Close checkout"
                data-ocid="checkout.close_button"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-8">
              {/* STEP 1: SHIPPING */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="font-display text-xl tracking-widest text-foreground mb-1">
                    SHIPPING INFO
                  </h2>
                  <p className="text-sm text-[oklch(0.50_0_0)] mb-6">
                    Where should we send your order?
                  </p>

                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label htmlFor="ship-name" className={labelClass}>
                          FULL NAME
                        </label>
                        <input
                          id="ship-name"
                          className={inputClass}
                          type="text"
                          required
                          placeholder="John Smith"
                          value={shipping.fullName}
                          onChange={(e) =>
                            setShipping((s) => ({
                              ...s,
                              fullName: e.target.value,
                            }))
                          }
                          data-ocid="checkout.input"
                        />
                      </div>
                      <div className="col-span-2">
                        <label htmlFor="ship-email" className={labelClass}>
                          EMAIL
                        </label>
                        <input
                          id="ship-email"
                          className={inputClass}
                          type="email"
                          required
                          placeholder="john@example.com"
                          value={shipping.email}
                          onChange={(e) =>
                            setShipping((s) => ({
                              ...s,
                              email: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-span-2">
                        <label htmlFor="ship-address" className={labelClass}>
                          ADDRESS
                        </label>
                        <input
                          id="ship-address"
                          className={inputClass}
                          type="text"
                          required
                          placeholder="123 Main St"
                          value={shipping.address}
                          onChange={(e) =>
                            setShipping((s) => ({
                              ...s,
                              address: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor="ship-city" className={labelClass}>
                          CITY
                        </label>
                        <input
                          id="ship-city"
                          className={inputClass}
                          type="text"
                          required
                          placeholder="New York"
                          value={shipping.city}
                          onChange={(e) =>
                            setShipping((s) => ({ ...s, city: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor="ship-state" className={labelClass}>
                          STATE
                        </label>
                        <input
                          id="ship-state"
                          className={inputClass}
                          type="text"
                          required
                          placeholder="NY"
                          value={shipping.state}
                          onChange={(e) =>
                            setShipping((s) => ({
                              ...s,
                              state: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor="ship-zip" className={labelClass}>
                          ZIP CODE
                        </label>
                        <input
                          id="ship-zip"
                          className={inputClass}
                          type="text"
                          required
                          placeholder="10001"
                          value={shipping.zip}
                          onChange={(e) =>
                            setShipping((s) => ({ ...s, zip: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor="ship-country" className={labelClass}>
                          COUNTRY
                        </label>
                        <input
                          id="ship-country"
                          className={inputClass}
                          type="text"
                          required
                          placeholder="US"
                          value={shipping.country}
                          onChange={(e) =>
                            setShipping((s) => ({
                              ...s,
                              country: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 bg-brand-orange text-[oklch(0.11_0_0)] font-display text-sm tracking-[0.15em] py-4 hover:opacity-90 active:scale-95 transition-all"
                      data-ocid="checkout.primary_button"
                    >
                      CONTINUE TO REVIEW
                    </button>
                  </form>
                </motion.div>
              )}

              {/* STEP 2: REVIEW */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="font-display text-xl tracking-widest text-foreground mb-1">
                    ORDER REVIEW
                  </h2>
                  <p className="text-sm text-[oklch(0.50_0_0)] mb-6">
                    Confirm your order before we fire it up.
                  </p>

                  <div className="border border-[oklch(0.20_0_0)] mb-5">
                    <div className="px-4 py-2 border-b border-[oklch(0.20_0_0)]">
                      <span className="font-display text-[10px] tracking-widest text-[oklch(0.45_0_0)]">
                        ITEMS
                      </span>
                    </div>
                    <ul className="divide-y divide-[oklch(0.18_0_0)]">
                      {cartItems.map((item, i) => {
                        const name = getProductName(item.productId);
                        const price = getProductPrice(item.productId);
                        const linePrice = (price * item.quantity) / 100;
                        return (
                          <li
                            key={item.productId}
                            className="flex justify-between items-center px-4 py-3"
                            data-ocid={`checkout.item.${i + 1}`}
                          >
                            <div>
                              <p className="font-display text-xs tracking-widest text-foreground">
                                {name}
                              </p>
                              <p className="text-xs text-[oklch(0.45_0_0)] mt-0.5">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <span className="font-display text-sm text-brand-orange">
                              ${linePrice.toFixed(2)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="border border-[oklch(0.20_0_0)] mb-5">
                    <div className="px-4 py-2 border-b border-[oklch(0.20_0_0)]">
                      <span className="font-display text-[10px] tracking-widest text-[oklch(0.45_0_0)]">
                        SHIP TO
                      </span>
                    </div>
                    <div className="px-4 py-3 text-sm text-[oklch(0.65_0_0)] leading-relaxed">
                      <p>{shipping.fullName}</p>
                      <p>{shipping.address}</p>
                      <p>
                        {shipping.city}, {shipping.state} {shipping.zip}
                      </p>
                      <p>{shipping.country}</p>
                      <p className="text-[oklch(0.50_0_0)] text-xs mt-1">
                        {shipping.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-4 border-t border-[oklch(0.20_0_0)] mb-6">
                    <span className="font-display text-sm tracking-widest text-[oklch(0.55_0_0)]">
                      ORDER TOTAL
                    </span>
                    <span className="font-display text-2xl text-brand-orange">
                      ${(total / 100).toFixed(2)}
                    </span>
                  </div>

                  {placeOrder.isError && (
                    <p
                      className="text-xs text-red-400 mb-4 font-display tracking-wide"
                      data-ocid="checkout.error_state"
                    >
                      FAILED TO PLACE ORDER. PLEASE TRY AGAIN.
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={placeOrder.isPending}
                    className="w-full bg-brand-orange text-[oklch(0.11_0_0)] font-display text-sm tracking-[0.15em] py-4 hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    data-ocid="checkout.submit_button"
                  >
                    {placeOrder.isPending && (
                      <Loader2 size={16} className="animate-spin" />
                    )}
                    {placeOrder.isPending ? "PLACING ORDER..." : "PLACE ORDER"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1 mt-4 text-xs font-display tracking-widest text-[oklch(0.45_0_0)] hover:text-foreground transition-colors"
                    data-ocid="checkout.secondary_button"
                  >
                    <ChevronLeft size={14} /> BACK
                  </button>
                </motion.div>
              )}

              {/* STEP 3: CONFIRMATION */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center text-center py-4"
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      damping: 14,
                      stiffness: 200,
                      delay: 0.15,
                    }}
                  >
                    <CheckCircle2
                      size={64}
                      className="text-brand-orange mb-6"
                    />
                  </motion.div>

                  <h2 className="font-display text-2xl tracking-widest text-foreground mb-2">
                    ORDER CONFIRMED
                  </h2>

                  {orderId && (
                    <p
                      className="font-display text-sm tracking-widest text-brand-orange mb-4"
                      data-ocid="checkout.success_state"
                    >
                      Order #{orderId}
                    </p>
                  )}

                  <p className="text-sm text-[oklch(0.55_0_0)] mb-8 max-w-xs leading-relaxed">
                    Thank you for your order. We'll get it packed and shipped
                    fast.
                  </p>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="bg-brand-orange text-[oklch(0.11_0_0)] font-display text-sm tracking-[0.15em] px-10 py-4 hover:opacity-90 active:scale-95 transition-all"
                    data-ocid="checkout.primary_button"
                  >
                    CONTINUE SHOPPING
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
