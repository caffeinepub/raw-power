import { XCircle } from "lucide-react";
import { motion } from "motion/react";

export default function PaymentFailure() {
  return (
    <div className="min-h-screen bg-[oklch(0.10_0_0)] flex items-center justify-center px-4">
      <motion.div
        className="flex flex-col items-center text-center max-w-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            damping: 14,
            stiffness: 200,
            delay: 0.2,
          }}
        >
          <XCircle size={72} className="text-red-500 mb-6" />
        </motion.div>

        <h1 className="font-display text-3xl tracking-widest text-foreground mb-3">
          PAYMENT FAILED
        </h1>
        <p className="text-sm text-[oklch(0.55_0_0)] mb-8 leading-relaxed">
          Your payment could not be processed. Please try again or choose a
          different payment method.
        </p>

        <a
          href="/"
          className="bg-brand-orange text-[oklch(0.11_0_0)] font-display text-sm tracking-[0.15em] px-10 py-4 hover:opacity-90 active:scale-95 transition-all inline-block"
          data-ocid="payment_failure.primary_button"
        >
          BACK TO STORE
        </a>
      </motion.div>
    </div>
  );
}
