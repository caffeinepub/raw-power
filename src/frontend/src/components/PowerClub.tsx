import { CheckCircle, Gift, Loader2, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useSignupLoyalty } from "../hooks/useQueries";

const perks = [
  { icon: Zap, label: "Early Access", desc: "Be first to new drops" },
  { icon: Shield, label: "Member Pricing", desc: "15% off every order" },
  { icon: Gift, label: "Free Samples", desc: "Monthly trial packets" },
];

export default function PowerClub() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const signup = useSignupLoyalty();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await signup.mutateAsync(email.trim());
      setJoined(true);
      setEmail("");
      toast.success("Welcome to the Power Club!");
    } catch {
      toast.error("Signup failed. Try again.");
    }
  };

  return (
    <section id="power-club" className="bg-section-mid py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-display text-xs tracking-[0.4em] text-brand-orange mb-2">
            EXCLUSIVE ACCESS
          </p>
          <h2 className="font-display text-4xl sm:text-6xl tracking-wide text-foreground uppercase mb-4">
            JOIN THE
            <br />
            <span className="text-brand-orange">POWER CLUB</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-10">
            Members get early access, exclusive pricing, and free monthly
            samples. Zero fluff. Just raw rewards.
          </p>

          {/* Perks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {perks.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="bg-card-dark border border-subtle p-6 flex flex-col items-center gap-3"
              >
                <Icon size={28} className="text-brand-orange" />
                <p className="font-display text-base tracking-widest text-foreground">
                  {label}
                </p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          {/* Signup form */}
          {joined ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3"
              data-ocid="powerclub.success_state"
            >
              <CheckCircle size={40} className="text-brand-orange" />
              <p className="font-display text-xl tracking-widest text-foreground">
                YOU&apos;RE IN THE CLUB.
              </p>
              <p className="text-muted-foreground text-sm">
                Check your inbox for your welcome pack.
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="YOUR EMAIL ADDRESS"
                required
                className="flex-1 bg-card-dark border border-subtle border-r-0 sm:border-r-0 px-4 py-4 text-sm font-display tracking-widest text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-orange transition-colors uppercase"
                data-ocid="powerclub.input"
              />
              <button
                type="submit"
                disabled={signup.isPending}
                className="bg-brand-orange text-[oklch(0.11_0_0)] font-display text-sm tracking-[0.15em] px-6 py-4 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 uppercase whitespace-nowrap"
                data-ocid="powerclub.submit_button"
              >
                {signup.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : null}
                JOIN FREE
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
