import { Instagram, Loader2, Twitter, Youtube } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSignupLoyalty } from "../hooks/useQueries";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const signup = useSignupLoyalty();
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await signup.mutateAsync(email.trim());
      setJoined(true);
      setEmail("");
      toast.success("You're in the Power Club!");
    } catch {
      toast.error("Signup failed. Try again.");
    }
  };

  const navLinks = [
    { id: "home", label: "HOME" },
    { id: "lab", label: "THE LAB" },
    { id: "raw-truth", label: "THE RAW TRUTH" },
    { id: "power-club", label: "POWER CLUB" },
    { id: "about", label: "ABOUT" },
  ];

  const socialLinks = [
    { label: "Instagram", icon: Instagram, href: "https://instagram.com" },
    { label: "Twitter", icon: Twitter, href: "https://twitter.com" },
    { label: "YouTube", icon: Youtube, href: "https://youtube.com" },
  ];

  return (
    <footer className="bg-[oklch(0.08_0_0)] border-t border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Logo + desc */}
          <div>
            <p className="font-display text-2xl text-brand-orange tracking-widest mb-3">
              RAW POWER
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              No blends. No BS. Just the cleanest, most transparent performance
              supplements available.
            </p>
            <div className="flex gap-4 mt-5">
              {socialLinks.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-brand-orange transition-colors"
                  data-ocid="footer.link"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div>
            <p className="font-display text-xs tracking-[0.3em] text-brand-orange mb-4">
              NAVIGATE
            </p>
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.id}
                  onClick={() =>
                    document
                      .getElementById(link.id)
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-left text-sm text-muted-foreground hover:text-brand-orange transition-colors font-display tracking-wider uppercase"
                  data-ocid="footer.link"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <p className="font-display text-xs tracking-[0.3em] text-brand-orange mb-2">
              JOIN THE GRIND
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Get exclusive drops, deals, and raw performance tips.
            </p>
            {joined ? (
              <p
                className="text-sm text-brand-orange font-display tracking-wider"
                data-ocid="footer.success_state"
              >
                ✓ YOU&apos;RE IN THE CLUB.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 bg-card-dark border border-subtle border-r-0 px-3 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-orange transition-colors min-w-0"
                  data-ocid="footer.input"
                />
                <button
                  type="submit"
                  disabled={signup.isPending}
                  className="bg-brand-orange text-[oklch(0.11_0_0)] font-display text-xs tracking-widest px-4 py-3 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap"
                  data-ocid="footer.submit_button"
                >
                  {signup.isPending ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    "JOIN"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-subtle pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground">
            © {year} RAW POWER. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-orange transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
