import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Heart } from "lucide-react";
import logo from "@/assets/photos/logo.png";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-aurora opacity-20 blur-3xl" />
      <div className="border-t border-border/60 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <img src={logo.src} alt="Jackson Dental" className="h-10 w-10 rounded-full object-cover" />
              <span className="font-display text-2xl">
                Jackson <span className="text-gradient">Dental</span>
              </span>
            </div>
            <p className="mt-4 text-muted-foreground max-w-md">
              Concierge cosmetic, restorative, and family dentistry in the heart
              of Tampa. Where modern science meets quiet luxury.
            </p>
            <div className="mt-6 flex gap-3">
              <a className="glass h-10 w-10 rounded-full grid place-items-center hover:shadow-gold transition" href="#" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a className="glass h-10 w-10 rounded-full grid place-items-center hover:shadow-gold transition" href="#" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <h4 className="font-display text-lg">Visit</h4>
            <p className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 text-primary" />
              4710 N Habana Ave, Suite 102<br />Tampa, FL 33614
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4 text-primary" /> (813) 999-9999
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 text-primary" /> hello@jacksondental.com
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <h4 className="font-display text-lg">Hours</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li className="flex justify-between"><span>Mon – Thu</span><span>8:00 – 17:00</span></li>
              <li className="flex justify-between"><span>Friday</span><span>8:00 – 14:00</span></li>
              <li className="flex justify-between"><span>Sat – Sun</span><span>Closed</span></li>
            </ul>
            <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5 pt-2">
              <Clock className="h-3 w-3" /> Emergency line 24/7
            </p>
          </div>
        </div>
        <div className="border-t border-border/60 py-6">
          <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Jackson Dental. All rights reserved.</p>
            <a
              href="https://zahriontech.com"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1.5 font-medium tracking-wide text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:text-primary"
            >
              <span>Created with</span>
              <Heart className="h-3.5 w-3.5 fill-current text-gold transition-transform duration-300 group-hover:scale-110" />
              <span>by Zahrion Tech</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
