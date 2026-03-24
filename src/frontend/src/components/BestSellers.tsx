import { ShoppingBag, Star } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useCart } from "../hooks/useCart";

const STAR_KEYS = ["star-1", "star-2", "star-3", "star-4", "star-5"];

const products = [
  {
    id: "mk677-anavar-turkesterone",
    name: "CLEAR MUSCLE",
    tagline: "MK-677 + ANAVAR + TURKESTERONE | 20mg | 30 Pills",
    price: 320000,
    image: "/assets/generated/product-clear-muscle-themed.dim_800x900.jpg",
    rating: 5,
    reviews: 87,
  },
];

function ProductCard({ product }: { product: (typeof products)[0] }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product.id, 1);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <motion.div
      className="bg-card-dark border border-subtle flex flex-col group max-w-sm mx-auto w-full"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Product image */}
      <div className="relative overflow-hidden bg-[oklch(0.13_0_0)] aspect-[6/7]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0_0/0.6)] to-transparent" />
        {/* Best Seller badge */}
        <span className="absolute top-3 left-3 bg-brand-orange text-[oklch(0.11_0_0)] font-display text-xs tracking-widest font-bold px-2 py-1 uppercase z-10">
          BEST SELLER
        </span>
      </div>

      {/* Card content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-xl tracking-widest text-foreground mb-1">
          {product.name}
        </h3>
        <p className="text-brand-muted text-sm mb-3">{product.tagline}</p>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-4">
          {STAR_KEYS.slice(0, product.rating).map((key) => (
            <Star
              key={key}
              size={14}
              className="fill-brand-orange text-brand-orange"
            />
          ))}
          <span className="text-xs text-brand-muted ml-1">
            ({product.reviews})
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="font-display text-2xl text-brand-orange">
            ₹{(product.price / 100).toFixed(0)}
          </span>
          <button
            type="button"
            onClick={handleAdd}
            className="bg-brand-orange text-[oklch(0.11_0_0)] font-display text-xs tracking-widest px-4 py-3 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
            data-ocid={`products.${product.id}.primary_button`}
          >
            <ShoppingBag size={14} />
            ADD TO CART
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function BestSellers() {
  return (
    <section id="lab" className="bg-section-dark py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12">
          <p className="font-display text-xs tracking-[0.4em] text-brand-orange mb-2">
            THE LAB
          </p>
          <h2 className="font-display text-4xl sm:text-6xl tracking-wide text-foreground uppercase">
            OUR
            <br />
            PRODUCT
          </h2>
        </div>

        <div className="flex justify-center">
          <div data-ocid="products.item.1" className="w-full max-w-sm">
            <ProductCard product={products[0]} />
          </div>
        </div>
      </div>
    </section>
  );
}
