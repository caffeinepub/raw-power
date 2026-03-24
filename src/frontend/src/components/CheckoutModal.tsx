import { CheckCircle2, ChevronLeft, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCart } from "../hooks/useCart";
import {
  type ShoppingItem,
  useCreateCheckoutSession,
} from "../hooks/useStripeCheckout";

interface ShippingInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

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
  country: "India",
};

const LOCAL_PRICES: Record<string, number> = {
  "mk677-anavar-turkesterone": 320000,
  "raw-whey": 499900,
  "pre-ignition": 449900,
  "recovery-fuel": 399900,
};

const LOCAL_NAMES: Record<string, string> = {
  "mk677-anavar-turkesterone": "CLEAR MUSCLE",
  "raw-whey": "RAW WHEY",
  "pre-ignition": "PRE-IGNITION",
  "recovery-fuel": "RECOVERY FUEL",
};

type Step = 1 | 2 | 3;
type PaymentTab = "card" | "upi-cod";
type UpiCodTab = "upi" | "cod";

function generateOrderId() {
  return `RP${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

export default function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [shipping, setShipping] = useState<ShippingInfo>(EMPTY_SHIPPING);
  const [orderId, setOrderId] = useState("");
  const [isPlacing, setIsPlacing] = useState(false);
  const [paymentTab, setPaymentTab] = useState<PaymentTab>("card");
  const [upiCodTab, setUpiCodTab] = useState<UpiCodTab>("upi");
  const [stripeError, setStripeError] = useState("");

  const { cartItems, clearCart } = useCart();
  const createCheckoutSession = useCreateCheckoutSession();

  const getProductName = (id: string) => LOCAL_NAMES[id] ?? id;
  const getProductPrice = (id: string) => LOCAL_PRICES[id] ?? 0;

  const total = cartItems.reduce(
    (sum, item) => sum + getProductPrice(item.productId) * item.quantity,
    0,
  );
  const totalInr = Math.round(total / 100);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setIsPlacing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const id = generateOrderId();
      clearCart();
      setOrderId(id);
      setStep(3);
    } finally {
      setIsPlacing(false);
    }
  };

  const handleStripeCheckout = async () => {
    setStripeError("");
    const items: ShoppingItem[] = cartItems.map((item) => ({
      name: getProductName(item.productId),
      description: "RAW POWER Supplement",
      amount: getProductPrice(item.productId),
      quantity: item.quantity,
      currency: "inr",
    }));
    try {
      const session = await createCheckoutSession.mutateAsync(items);
      window.location.href = session.url;
    } catch {
      setStripeError("Card payments are being set up. Please use UPI or COD.");
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setShipping(EMPTY_SHIPPING);
      setOrderId("");
      setStripeError("");
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
                          placeholder="Rahul Sharma"
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
                          placeholder="rahul@example.com"
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
                          placeholder="123 MG Road"
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
                          placeholder="Mumbai"
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
                          placeholder="Maharashtra"
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
                          PIN CODE
                        </label>
                        <input
                          id="ship-zip"
                          className={inputClass}
                          type="text"
                          required
                          placeholder="400001"
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
                          placeholder="India"
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
                      CONTINUE TO PAYMENT
                    </button>
                  </form>
                </motion.div>
              )}

              {/* STEP 2: PAYMENT */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="font-display text-xl tracking-widest text-foreground mb-1">
                    PAYMENT
                  </h2>
                  <p className="text-sm text-[oklch(0.50_0_0)] mb-5">
                    Choose how you want to pay.
                  </p>

                  {/* Order summary */}
                  <div className="bg-[oklch(0.13_0_0)] border border-[oklch(0.20_0_0)] px-4 py-3 mb-6">
                    <p className="font-display text-[10px] tracking-widest text-[oklch(0.45_0_0)] mb-2">
                      ORDER SUMMARY
                    </p>
                    {cartItems.map((item, i) => {
                      const name = getProductName(item.productId);
                      const price = getProductPrice(item.productId);
                      const lineTotal = Math.round(
                        (price * item.quantity) / 100,
                      );
                      return (
                        <div
                          key={item.productId}
                          className="flex justify-between items-center text-sm"
                          data-ocid={`checkout.item.${i + 1}`}
                        >
                          <span className="text-[oklch(0.70_0_0)]">
                            {name}{" "}
                            <span className="text-[oklch(0.45_0_0)] text-xs">
                              x{item.quantity}
                            </span>
                          </span>
                          <span className="font-display text-brand-orange">
                            ₹{lineTotal.toLocaleString("en-IN")}
                          </span>
                        </div>
                      );
                    })}
                    <div className="border-t border-[oklch(0.20_0_0)] mt-2 pt-2 flex justify-between">
                      <span className="font-display text-[10px] tracking-widest text-[oklch(0.55_0_0)]">
                        TOTAL
                      </span>
                      <span className="font-display text-base text-brand-orange">
                        ₹{totalInr.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Payment method tabs */}
                  <div className="flex gap-2 mb-5">
                    {(["card", "upi-cod"] as PaymentTab[]).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setPaymentTab(tab)}
                        className={`flex-1 py-2.5 font-display text-[11px] tracking-widest border transition-colors ${
                          paymentTab === tab
                            ? "border-brand-orange text-brand-orange bg-[oklch(0.14_0_0)]"
                            : "border-[oklch(0.22_0_0)] text-[oklch(0.45_0_0)] hover:border-[oklch(0.35_0_0)] hover:text-foreground"
                        }`}
                        data-ocid="checkout.tab"
                      >
                        {tab === "card" ? "CARD" : "UPI / COD"}
                      </button>
                    ))}
                  </div>

                  {/* CARD tab */}
                  {paymentTab === "card" && (
                    <motion.div
                      key="card-tab"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-4"
                    >
                      {stripeError ? (
                        <div
                          className="border border-[oklch(0.30_0_0)] bg-[oklch(0.13_0_0)] px-4 py-4 text-sm text-[oklch(0.65_0_0)] leading-relaxed"
                          data-ocid="checkout.error_state"
                        >
                          {stripeError}
                        </div>
                      ) : (
                        <p className="text-xs text-[oklch(0.50_0_0)] leading-relaxed">
                          You'll be redirected to a secure Stripe checkout page
                          to complete your card payment.
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={handleStripeCheckout}
                        disabled={createCheckoutSession.isPending}
                        className="w-full bg-brand-orange text-[oklch(0.11_0_0)] font-display text-sm tracking-[0.15em] py-4 hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        data-ocid="checkout.submit_button"
                      >
                        {createCheckoutSession.isPending && (
                          <Loader2 size={16} className="animate-spin" />
                        )}
                        {createCheckoutSession.isPending
                          ? "REDIRECTING..."
                          : `PAY ₹${totalInr.toLocaleString("en-IN")} WITH CARD`}
                      </button>
                    </motion.div>
                  )}

                  {/* UPI / COD tab */}
                  {paymentTab === "upi-cod" && (
                    <motion.div
                      key="upiod-tab"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      {/* Sub-toggle: UPI vs COD */}
                      <div className="flex gap-0 mb-5 border border-[oklch(0.22_0_0)]">
                        {(["upi", "cod"] as UpiCodTab[]).map((tab) => (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => setUpiCodTab(tab)}
                            className={`flex-1 py-2 font-display text-[10px] tracking-widest transition-colors ${
                              upiCodTab === tab
                                ? "bg-[oklch(0.17_0_0)] text-foreground"
                                : "text-[oklch(0.40_0_0)] hover:text-[oklch(0.60_0_0)]"
                            }`}
                            data-ocid="checkout.toggle"
                          >
                            {tab === "upi" ? "UPI" : "CASH ON DELIVERY"}
                          </button>
                        ))}
                      </div>

                      {/* UPI */}
                      {upiCodTab === "upi" && (
                        <motion.div
                          key="upi"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.15 }}
                          className="flex flex-col items-center gap-5"
                        >
                          {/* QR placeholder */}
                          <div className="w-44 h-44 border-2 border-dashed border-[oklch(0.30_0_0)] flex flex-col items-center justify-center gap-2 bg-[oklch(0.13_0_0)]">
                            <div className="grid grid-cols-3 gap-1 mb-1">
                              {(
                                [
                                  "tl",
                                  "tm",
                                  "tr",
                                  "ml",
                                  "mm",
                                  "mr",
                                  "bl",
                                  "bm",
                                  "br",
                                ] as const
                              ).map((pos) => (
                                <div
                                  key={pos}
                                  className={`w-4 h-4 ${["tl", "tr", "bl", "br", "mm"].includes(pos) ? "bg-brand-orange opacity-80" : "bg-[oklch(0.25_0_0)]"}`}
                                />
                              ))}
                            </div>
                            <span className="font-display text-[9px] tracking-widest text-[oklch(0.45_0_0)]">
                              UPI QR CODE
                            </span>
                          </div>
                          <div className="text-center">
                            <p className="font-display text-[10px] tracking-widest text-[oklch(0.45_0_0)] mb-1">
                              UPI ID
                            </p>
                            <p className="font-display text-sm text-foreground tracking-wide">
                              rawpower@upi
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handlePlaceOrder}
                            disabled={isPlacing}
                            className="w-full bg-brand-orange text-[oklch(0.11_0_0)] font-display text-sm tracking-[0.15em] py-4 hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            data-ocid="checkout.submit_button"
                          >
                            {isPlacing && (
                              <Loader2 size={16} className="animate-spin" />
                            )}
                            {isPlacing ? "PROCESSING..." : "I HAVE PAID"}
                          </button>
                        </motion.div>
                      )}

                      {/* COD */}
                      {upiCodTab === "cod" && (
                        <motion.div
                          key="cod"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.15 }}
                          className="space-y-5"
                        >
                          <div className="border border-[oklch(0.20_0_0)] bg-[oklch(0.13_0_0)] px-5 py-5 text-center">
                            <p className="font-display text-xs tracking-widest text-[oklch(0.50_0_0)] mb-2">
                              AMOUNT DUE ON DELIVERY
                            </p>
                            <p className="font-display text-3xl text-brand-orange">
                              ₹{totalInr.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <p className="text-xs text-[oklch(0.50_0_0)] leading-relaxed text-center">
                            Keep the exact amount ready. Our delivery partner
                            will collect payment at your door.
                          </p>
                          <button
                            type="button"
                            onClick={handlePlaceOrder}
                            disabled={isPlacing}
                            className="w-full bg-brand-orange text-[oklch(0.11_0_0)] font-display text-sm tracking-[0.15em] py-4 hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            data-ocid="checkout.submit_button"
                          >
                            {isPlacing && (
                              <Loader2 size={16} className="animate-spin" />
                            )}
                            {isPlacing ? "CONFIRMING..." : "CONFIRM ORDER"}
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1 mt-5 text-xs font-display tracking-widest text-[oklch(0.45_0_0)] hover:text-foreground transition-colors"
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
