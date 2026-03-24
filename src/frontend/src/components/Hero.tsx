import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";

export default function Hero() {
  const scrollToLab = () => {
    document.getElementById("lab")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        backgroundImage:
          "url('/assets/generated/hero-athlete.dim_1600x900.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.08_0_0/0.92)] via-[oklch(0.08_0_0/0.75)] to-[oklch(0.08_0_0/0.30)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-16">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="font-display text-sm tracking-[0.4em] text-brand-orange mb-4 uppercase">
              PURE PERFORMANCE
            </p>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl leading-none tracking-wide mb-6">
              <span className="text-brand-orange block">UNLEASH</span>
              <span className="text-foreground block">THE</span>
              <span className="text-brand-orange block">UNFILTERED</span>
              <span className="text-foreground block">YOU.</span>
            </h1>
          </motion.div>

          <motion.p
            className="text-lg text-muted-foreground mb-8 max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            No proprietary blends. No chemical junk. Just Raw Power.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              type="button"
              onClick={scrollToLab}
              className="bg-brand-orange text-[oklch(0.11_0_0)] font-display text-base tracking-[0.15em] px-8 py-4 hover:opacity-90 active:scale-95 transition-all uppercase"
              data-ocid="hero.primary_button"
            >
              SHOP THE CORE RANGE
            </button>
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("raw-truth")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="border border-border text-foreground font-display text-base tracking-[0.15em] px-8 py-4 hover:border-brand-orange hover:text-brand-orange transition-all uppercase"
              data-ocid="hero.secondary_button"
            >
              THE RAW TRUTH
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-muted-foreground"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
      >
        <span className="font-display text-xs tracking-widest mb-2">
          SCROLL
        </span>
        <ChevronDown size={16} />
      </motion.div>
    </section>
  );
}
