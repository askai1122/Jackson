import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import logo from "@/assets/photos/logo.png";

const nav = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5">
        <div
          className={`flex items-center justify-between rounded-full px-5 py-3 transition-all duration-500 ${
            scrolled ? "glass shadow-soft" : "bg-transparent"
          }`}
        >
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/80 ring-1 ring-border overflow-hidden shadow-soft">
              <img src={logo.src} alt="Jackson Dental" className="h-9 w-9 object-contain" />
              <span className="absolute -inset-1 rounded-full bg-aurora opacity-30 blur-md -z-10 animate-spin-slow" />
            </span>
            <span className="font-display text-xl tracking-tight">
              Jackson <span className="text-gradient">Dental</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="relative hover:text-foreground transition-colors after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:scale-x-0 after:origin-right after:bg-gradient-to-r after:from-primary after:to-gold hover:after:scale-x-100 hover:after:origin-left after:transition-transform after:duration-500"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+18139999999"
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
            >
              <Phone className="h-4 w-4" /> (813) 999-9999
            </a>
            <ThemeToggle />
            <a
              href="/admin"
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 hover:border-border transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>
              Admin
            </a>
            <a
              href="#contact"
              className="relative inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow hover:shadow-gold transition-all duration-500"
            >
              <span className="absolute inset-0 rounded-full shimmer opacity-0 hover:opacity-100 transition-opacity" />
              Book Visit
            </a>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full glass"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-3 glass rounded-3xl p-6 space-y-4"
          >
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="block text-lg font-display"
              >
                {n.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="block text-center rounded-full bg-primary px-5 py-3 text-primary-foreground"
            >
              Book Visit
            </a>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
