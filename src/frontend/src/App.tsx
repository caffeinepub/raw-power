import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import AboutUs from "./components/AboutUs";
import BestSellers from "./components/BestSellers";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import ComparisonTable from "./components/ComparisonTable";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import PaymentFailure from "./components/PaymentFailure";
import PaymentSuccess from "./components/PaymentSuccess";
import PowerClub from "./components/PowerClub";
import { CartProvider } from "./hooks/useCart";

function AppContent() {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sections = ["home", "lab", "raw-truth", "about", "power-club"];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const mapped =
              id === "lab"
                ? "lab"
                : id === "raw-truth"
                  ? "raw-truth"
                  : id === "power-club"
                    ? "power-club"
                    : id;
            setActiveSection(mapped);
          }
        }
      },
      { threshold: 0.3 },
    );

    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header
        onCartOpen={() => setCartOpen(true)}
        activeSection={activeSection}
      />
      <main>
        <Hero />
        <BestSellers />
        <ComparisonTable />
        <AboutUs />
        <PowerClub />
      </main>
      <Footer />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.16 0.003 250)",
            border: "1px solid oklch(0.30 0.005 250)",
            color: "oklch(0.96 0 0)",
          },
        }}
      />
    </div>
  );
}

function RouteGate({ children }: { children: React.ReactNode }) {
  const path = window.location.pathname;
  if (path === "/payment-success") return <PaymentSuccess />;
  if (path === "/payment-failure") return <PaymentFailure />;
  return <>{children}</>;
}

export default function App() {
  return (
    <CartProvider>
      <RouteGate>
        <AppContent />
      </RouteGate>
    </CartProvider>
  );
}
