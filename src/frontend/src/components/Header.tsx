import { Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../hooks/useCart";

interface HeaderProps {
  onCartOpen: () => void;
  activeSection: string;
}

const navLinks = [
  { id: "home", label: "HOME" },
  { id: "lab", label: "THE LAB" },
  { id: "raw-truth", label: "THE RAW TRUTH" },
  { id: "power-club", label: "POWER CLUB" },
];

export default function Header({ onCartOpen, activeSection }: HeaderProps) {
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-section-dark border-b border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => scrollTo("home")}
          className="font-display text-2xl text-brand-orange tracking-widest hover:opacity-80 transition-opacity"
          data-ocid="nav.link"
        >
          RAW POWER
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`font-display text-sm tracking-widest transition-colors ${
                activeSection === link.id
                  ? "text-brand-orange"
                  : "text-foreground hover:text-brand-orange"
              }`}
              data-ocid="nav.link"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onCartOpen}
            className="relative p-2 text-foreground hover:text-brand-orange transition-colors"
            aria-label="Open cart"
            data-ocid="cart.open_modal_button"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-orange text-xs font-bold text-[oklch(0.11_0_0)] rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu */}
          <button
            type="button"
            className="md:hidden p-2 text-foreground hover:text-brand-orange transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            data-ocid="nav.toggle"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-section-dark border-t border-subtle px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`font-display text-left text-base tracking-widest transition-colors ${
                activeSection === link.id
                  ? "text-brand-orange"
                  : "text-foreground"
              }`}
              data-ocid="nav.link"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
