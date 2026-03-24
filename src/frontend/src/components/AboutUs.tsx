import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function AboutUs() {
  return (
    <section
      id="about"
      className="bg-section-dark py-20 sm:py-28 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-display text-xs tracking-[0.4em] text-brand-orange mb-4">
              OUR STORY
            </p>
            <h2 className="font-display text-3xl sm:text-5xl tracking-wide text-foreground uppercase leading-tight mb-6">
              WE DIDN&apos;T START
              <br />
              <span className="text-brand-orange">RAW POWER</span>
              <br />
              TO JOIN THE CROWD.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We started it because we were tired of neon-colored water and
              &ldquo;proprietary blends&rdquo; that hid the truth. We believe
              performance shouldn&apos;t come with a chemical aftertaste.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We source the highest grade raw materials to ensure that when you
              hit the rack, you aren&apos;t just fueled&mdash;you&apos;re
              unstoppable. Every formula is third-party tested, every ingredient
              is disclosed, every batch is traceable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("raw-truth")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-brand-orange text-[oklch(0.11_0_0)] font-display text-sm tracking-[0.15em] px-6 py-4 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 uppercase"
                data-ocid="about.primary_button"
              >
                SEE THE RAW TRUTH <ArrowRight size={16} />
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mt-10 pt-10 border-t border-subtle">
              {[
                { num: "100%", label: "Transparent" },
                { num: "3rd", label: "Party Tested" },
                { num: "0", label: "Hidden Blends" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl text-brand-orange">
                    {stat.num}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative overflow-hidden">
              <img
                src="/assets/generated/hero-athlete.dim_1600x900.jpg"
                alt="RAW POWER athlete training"
                className="w-full h-[500px] object-cover grayscale"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0_0/0.6)] to-transparent" />
              {/* Orange accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange" />
            </div>
            {/* Quote overlay */}
            <div className="absolute bottom-8 left-4 right-4">
              <p className="font-display text-lg text-foreground tracking-wide">
                &ldquo;WHEN YOU HIT THE RACK,
                <br />
                <span className="text-brand-orange">
                  YOU AREN&apos;T JUST FUELED&mdash;
                </span>
                <br />
                YOU&apos;RE UNSTOPPABLE.&rdquo;
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
