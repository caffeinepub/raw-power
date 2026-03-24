import { Check, X } from "lucide-react";
import { motion } from "motion/react";

const rows = [
  {
    feature: "Ingredient Clarity",
    rawPower: "100% Transparent",
    others: 'Hidden "Blends"',
    rawGood: true,
  },
  {
    feature: "Artificial Sweeteners",
    rawPower: "Zero",
    others: "Heavily Loaded",
    rawGood: true,
  },
  {
    feature: "Sourcing",
    rawPower: "Grass-Fed / Clinical Grade",
    others: "Low-Tier Bulk",
    rawGood: true,
  },
  {
    feature: "Third-Party Testing",
    rawPower: "Every Batch",
    others: "Rarely",
    rawGood: true,
  },
  {
    feature: "Proprietary Blends",
    rawPower: "Never",
    others: "Industry Standard",
    rawGood: true,
  },
];

export default function ComparisonTable() {
  return (
    <section id="raw-truth" className="bg-section-mid py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="font-display text-xs tracking-[0.4em] text-brand-orange mb-2">
            THE RAW TRUTH
          </p>
          <h2 className="font-display text-4xl sm:text-6xl tracking-wide text-foreground uppercase">
            WHY RAW
            <br />
            POWER WINS
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-x-auto"
          data-ocid="comparison.table"
        >
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-subtle">
                <th className="text-left font-display text-sm tracking-widest text-muted-foreground py-4 pr-6 uppercase w-1/3">
                  FEATURE
                </th>
                <th className="font-display text-sm tracking-widest py-4 px-6 uppercase text-center w-1/3">
                  <span className="text-brand-orange bg-[oklch(0.68_0.18_47/0.1)] px-4 py-2 border border-brand-orange">
                    RAW POWER
                  </span>
                </th>
                <th className="font-display text-sm tracking-widest text-muted-foreground py-4 pl-6 uppercase text-center w-1/3">
                  OTHER BRANDS
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.feature}
                  className="border-b border-subtle hover:bg-[oklch(0.16_0.003_250/0.5)] transition-colors"
                  data-ocid="comparison.row"
                >
                  <td className="py-5 pr-6 text-sm text-muted-foreground font-medium">
                    {row.feature}
                  </td>
                  <td className="py-5 px-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Check size={16} className="text-brand-orange" />
                      <span className="text-sm text-foreground font-medium">
                        {row.rawPower}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 pl-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <X size={16} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {row.others}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
