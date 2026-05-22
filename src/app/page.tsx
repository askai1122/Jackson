"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import {
  Sparkles, ShieldCheck, HeartPulse, Smile, Stethoscope, Gem,
  Star, ArrowRight, Check, MapPin, Phone, Mail, Clock, Quote, Zap, Award, User2,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { createAppointment } from "@/lib/api";
import heroSmile from "@/assets/photos/hero1.jpeg";
import office from "@/assets/photos/office.jpg";
import logo from "@/assets/photos/hero3.jpg";

const services = [
  { icon: Smile,        title: "Cosmetic Dentistry",   desc: "Veneers, whitening, and smile design crafted with artistry and precision." },
  { icon: Gem,          title: "Porcelain Veneers",    desc: "Hand-layered, ultra-thin porcelain for a luminous, natural smile." },
  { icon: ShieldCheck,  title: "Dental Implants",      desc: "Permanent, titanium-anchored restorations engineered to last decades." },
  { icon: Sparkles,     title: "Teeth Whitening",      desc: "In-office and take-home systems that brighten safely, comfortably." },
  { icon: HeartPulse,   title: "Family Dentistry",     desc: "Gentle preventive care for every member of your family." },
  { icon: Stethoscope,  title: "Restorative Care",     desc: "Crowns, bridges, and full-mouth rehabilitation with quiet luxury." },
  { icon: Zap,          title: "Emergency Dental",     desc: "Same-day emergency care for pain, broken teeth, and urgent needs." },
  { icon: Award,        title: "Orthodontics",         desc: "Clear aligners and discreet solutions for a perfectly aligned smile." },
];

const stats = [
  { value: "23+", label: "Years in Tampa" },
  { value: "12k", label: "Smiles Restored" },
  { value: "4.9", label: "Average Rating" },
  { value: "100%", label: "Concierge Care" },
];

const reviews = [
  { name: "Amanda R.",   text: "From the moment I walked in, it felt more like a luxury spa than a dental office. The veneers are flawless.", rating: 5 },
  { name: "Marcus T.",   text: "Dr. Jackson rebuilt my confidence. The implant work is genuinely indistinguishable from natural teeth.", rating: 5 },
  { name: "Sophia L.",   text: "Warm, attentive, and impossibly precise. Best dental experience I've ever had — full stop.", rating: 5 },
  { name: "David P.",    text: "The team is calm, the office is gorgeous, and the results speak for themselves. Highly recommended.", rating: 5 },
];

const faqs = [
  { q: "Do you accept insurance?", a: "Yes — we work with most major PPO providers and offer flexible financing for treatments not fully covered." },
  { q: "How quickly can I be seen?", a: "New patient visits are typically available within the same week. Emergency appointments are reserved daily." },
  { q: "Is sedation available?", a: "Absolutely. We offer multiple comfort options including nitrous and oral sedation for a calm, relaxed visit." },
  { q: "Where are you located?", a: "We're located in Tampa, FL on N Habana Ave — minutes from Westshore, South Tampa, and downtown." },
];

export default function Home() {
  const [consultationForm, setConsultationForm] = useState({
    patientName: "",
    phone: "",
    email: "",
    service: "",
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
  });
  const [isSubmittingConsultation, setIsSubmittingConsultation] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());

  const updateConsultationField = (field: keyof typeof consultationForm, value: string) => {
    setConsultationForm((current) => ({ ...current, [field]: value }));
  };

  const submitConsultation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmittingConsultation(true);

    try {
      await createAppointment(consultationForm);
      setConsultationForm({
        patientName: "",
        phone: "",
        email: "",
        service: "",
        appointmentDate: "",
        appointmentTime: "",
        notes: "",
      });
      setShowThankYou(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Your request could not be submitted. Please try again.");
    } finally {
      setIsSubmittingConsultation(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-hero">
      {/* Floating ambient orbs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-aurora opacity-30 blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-gold/40 to-primary/30 blur-3xl animate-float-delay" />
        <div className="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-accent/30 blur-3xl animate-float" />
        <div className="absolute inset-0 grain opacity-40" />
      </div>

      <Header />

      {/* HERO */}
      <section className="relative pt-36 md:pt-44 pb-24">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs tracking-wider uppercase text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                Luxury Dental Care · Tampa, Florida
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-6 font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.02] tracking-tight">
                The art of a <span className="text-gradient italic">flawless</span> smile.
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-7 max-w-xl text-lg text-muted-foreground leading-relaxed">
                Jackson Dental is Tampa's destination for concierge cosmetic,
                restorative, and family dentistry — where modern science meets
                quiet luxury and every visit is exceptional.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#contact"
                  className="group relative inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-primary-foreground font-medium shadow-glow hover:shadow-gold transition-all duration-500"
                >
                  Book your consultation
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="#services"
                  className="inline-flex items-center gap-2 rounded-full glass px-7 py-4 text-foreground font-medium hover:shadow-soft transition"
                >
                  Explore services
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.45}>
              <div className="mt-12 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-9 w-9 rounded-full border-2 border-background bg-gradient-to-br from-primary/40 to-gold/50" />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-gold">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p>4.9 · trusted by 12,000+ Tampa smiles</p>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.2} y={40}>
              <div className="relative">
                <div className="absolute -inset-6 rounded-[3rem] bg-aurora opacity-40 blur-3xl animate-spin-slow" />
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                  className="relative overflow-hidden rounded-[2.5rem] border border-white/40 shadow-glow"
                >
                  <img
                    src={heroSmile.src}
                    alt="Radiant smile from Jackson Dental patient"
                    width={1536}
                    height={1536}
                    className="w-full h-[520px] md:h-[620px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
                </motion.div>

                {/* floating glass cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="absolute -left-6 top-12 glass rounded-2xl p-4 shadow-soft animate-float"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gold/20 grid place-items-center text-gold">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Whitening shade</p>
                      <p className="font-display text-lg">+8 levels brighter</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.05, duration: 0.8 }}
                  className="absolute -right-4 bottom-10 glass rounded-2xl p-4 shadow-soft animate-float-delay"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/15 grid place-items-center text-primary">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Lifetime guarantee</p>
                      <p className="font-display text-lg">Veneers & implants</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative py-12">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="glass rounded-3xl px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 shadow-soft">
              {stats.map((s, i) => (
                <div key={s.label} className={`text-center ${i !== 0 ? "md:border-l md:border-border/60" : ""}`}>
                  <div className="font-display text-4xl md:text-5xl text-gradient">{s.value}</div>
                  <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="relative py-28">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.3em] text-primary">Our Practice</span>
              <h2 className="mt-4 font-display text-4xl md:text-6xl tracking-tight">
                Dentistry, <span className="text-gradient italic">elevated</span>.
              </h2>
              <p className="mt-5 text-muted-foreground text-lg">
                Every treatment at Jackson Dental is delivered with surgical precision,
                artistic eye, and an obsession with how it feels — not just how it looks.
              </p>
            </div>
          </Reveal>

          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  className="group relative h-full rounded-3xl glass p-8 overflow-hidden hover:shadow-glow transition-shadow"
                >
                  <div className="absolute -top-24 -right-20 h-56 w-56 rounded-full bg-aurora opacity-0 blur-3xl group-hover:opacity-40 transition-opacity duration-700" />
                  <div className="relative">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <s.icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-6 font-display text-2xl">{s.title}</h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">{s.desc}</p>
                    <div className="mt-6 inline-flex items-center gap-2 text-sm text-primary font-medium">
                      Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative py-28">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="relative">
              <div className="absolute -inset-6 bg-aurora opacity-30 blur-3xl rounded-full" />
              <div className="relative rounded-[2rem] shadow-glow overflow-hidden bg-gradient-to-br from-primary/15 via-background to-gold/15 aspect-[4/5] grid place-items-center p-12 ring-1 ring-border">
                <img
                  src={logo.src}
                  alt="Jackson Dental brand mark"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 grain opacity-30 pointer-events-none" />
              </div>
              <div className="absolute -bottom-6 -right-4 glass rounded-2xl p-5 shadow-soft animate-float">
                <p className="text-xs text-muted-foreground">Founded</p>
                <p className="font-display text-3xl text-gradient">2002</p>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <span className="text-xs uppercase tracking-[0.3em] text-primary">About</span>
              <h2 className="mt-4 font-display text-4xl md:text-5xl">
                Two decades of <span className="text-gradient italic">refined</span> care in Tampa.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
                Jackson Dental was founded on a simple belief: dentistry should
                feel as considered and refined as the smile it creates. Today,
                our boutique Tampa practice blends advanced clinical training
                with genuine, attentive hospitality.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <ul className="mt-8 space-y-4">
                {[
                  "Board-certified clinicians, decades of combined experience",
                  "Digital smile design with real-time previews",
                  "Sedation & comfort menu for an effortless visit",
                  "Transparent, all-inclusive treatment plans",
                ].map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-foreground/90">{p}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* EXPERIENCE / OFFICE */}
      <section id="experience" className="relative py-28">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-glow">
              <img
                src={office.src}
                alt="Jackson Dental modern luxury office"
                width={1536}
                height={1024}
                loading="lazy"
                className="h-[420px] md:h-[560px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/70 via-primary/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-10 md:p-16">
                <span className="text-xs uppercase tracking-[0.3em] text-white/70">The Experience</span>
                <h2 className="mt-3 font-display text-4xl md:text-6xl text-white max-w-2xl">
                  A space designed to feel like nowhere else.
                </h2>
                <p className="mt-4 max-w-xl text-white/80 text-lg">
                  Marble, brass, and natural light. Heated chairs, noise-canceling
                  headphones, and a curated comfort menu — every detail considered.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="relative py-28">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.3em] text-primary">Words from our patients</span>
              <h2 className="mt-4 font-display text-4xl md:text-6xl">
                Loved by <span className="text-gradient italic">Tampa</span>.
              </h2>
            </div>
          </Reveal>

          <div className="mt-14 grid md:grid-cols-2 gap-6">
            {reviews.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.08}>
                <div className="relative h-full rounded-3xl glass p-8 shadow-soft">
                  <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/20" />
                  <div className="flex items-center gap-1 text-gold">
                    {Array.from({ length: r.rating }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="mt-5 text-lg leading-relaxed text-foreground/90">"{r.text}"</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-gold" />
                    <div>
                      <p className="font-display text-lg">{r.name}</p>
                      <p className="text-xs text-muted-foreground">Verified Patient</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DOCTOR SECTION */}
      <section id="team" className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 -z-10 mesh-bg opacity-60" />
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-[0.3em] text-primary">Meet the Team</span>
              <h2 className="mt-4 font-display text-4xl md:text-6xl">
                The hands behind your <span className="text-gradient italic">smile</span>.
              </h2>
              <p className="mt-5 text-muted-foreground text-lg max-w-2xl mx-auto">
                Board-certified, Tampa-raised, and deeply committed to crafting smiles that last a lifetime.
              </p>
            </div>
          </Reveal>
          <div className="flex justify-center">
            <Reveal>
              <div className="group relative glass rounded-3xl p-10 hover:shadow-glow transition-shadow duration-500 flex flex-col gap-6 w-full max-w-md mx-auto text-center">
                <div className="relative mx-auto">
                  <div className="h-36 w-36 rounded-full overflow-hidden shadow-glow mx-auto ring-4 ring-primary/30">
                    <img
                      src="https://lh3.googleusercontent.com/p/AF1QipNkv7mz_W9LbXoE-5CZS3KqUKEJqHIHbhJSPM5r=s680-w680-h510"
                      alt="Dr. Geoffrey Jackson DDS"
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        const el = e.currentTarget;
                        el.src = "https://ui-avatars.com/api/?name=Geoffrey+Jackson&background=6366f1&color=fff&size=200&bold=true&font-size=0.4";
                      }}
                    />
                  </div>
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground whitespace-nowrap shadow-glow">
                    ✦ Founder & Lead Dentist
                  </span>
                </div>
                <div className="pt-4">
                  <h3 className="font-display text-2xl">Dr. Geoffrey Jackson, DDS</h3>
                  <p className="text-sm text-primary font-medium mt-1">Jackson Dental PA · Tampa, FL</p>
                  <p className="mt-5 text-muted-foreground leading-relaxed">
                    A cornerstone of Tampa dentistry, Dr. Jackson blends the latest technology with gentle, individualized care. Graduated from the University of Maryland School of Dentistry. Expert in cosmetic veneers, same-day crowns, Invisalign, and full-mouth rehabilitation — with 15+ years transforming smiles.
                  </p>
                </div>
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground -mt-2">4.7 stars · 377 verified reviews on Healthgrades</p>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {[
                    { label: "Experience", value: "15+ yrs" },
                    { label: "Patients", value: "12,000+" },
                    { label: "Rating", value: "4.7 ★" },
                  ].map(s => (
                    <div key={s.label} className="glass rounded-xl py-3 px-2">
                      <p className="font-display text-lg text-gradient">{s.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative py-28">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="text-center">
              <span className="text-xs uppercase tracking-[0.3em] text-primary">FAQ</span>
              <h2 className="mt-4 font-display text-4xl md:text-5xl">Everything you wanted to know.</h2>
            </div>
          </Reveal>
          <div className="mt-12 space-y-4">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.06}>
                <details className="group glass rounded-2xl p-6 cursor-pointer transition hover:shadow-soft">
                  <summary className="flex items-center justify-between font-display text-lg list-none">
                    {f.q}
                    <span className="ml-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 text-muted-foreground leading-relaxed">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative py-28">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 items-stretch">
          <Reveal>
            <div className="h-full rounded-[2rem] glass p-10 shadow-soft">
              <span className="text-xs uppercase tracking-[0.3em] text-primary">Begin your smile</span>
              <h2 className="mt-4 font-display text-4xl md:text-5xl">
                Reserve your <span className="text-gradient italic">consultation</span>.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Tell us a little about you — we'll respond within one business hour.
              </p>

              <form className="mt-8 grid gap-5" onSubmit={submitConsultation}>
                <div className="grid sm:grid-cols-2 gap-5">
                  <input required value={consultationForm.patientName} onChange={(event) => updateConsultationField("patientName", event.target.value)} className="cursor-text rounded-xl bg-white dark:bg-slate-800 text-foreground dark:text-white border border-border px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40 transition" placeholder="Full name" />
                  <input required value={consultationForm.phone} onChange={(event) => updateConsultationField("phone", event.target.value)} className="cursor-text rounded-xl bg-white dark:bg-slate-800 text-foreground dark:text-white border border-border px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40 transition" placeholder="Phone" />
                </div>
                <input required type="email" value={consultationForm.email} onChange={(event) => updateConsultationField("email", event.target.value)} className="cursor-text rounded-xl bg-white dark:bg-slate-800 text-foreground dark:text-white border border-border px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40 transition" placeholder="Email" />
                <select required value={consultationForm.service} onChange={(event) => updateConsultationField("service", event.target.value)} className="cursor-pointer rounded-xl bg-white dark:bg-slate-800 text-foreground dark:text-white border border-border px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40 transition">
                  <option value="" disabled>I'm interested in...</option>
                  {services.map((s) => <option key={s.title} value={s.title}>{s.title}</option>)}
                </select>
                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Custom Date Picker */}
                  <div className="relative">
                    <button type="button" onClick={() => { setShowDatePicker(v => !v); setShowTimePicker(false); }}
                      className="cursor-pointer w-full rounded-xl bg-white dark:bg-slate-800 text-foreground dark:text-white border border-border px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40 transition text-left flex items-center gap-2">
                      <svg className="h-4 w-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                      <span className={consultationForm.appointmentDate ? "text-foreground dark:text-white" : "text-muted-foreground"}>
                        {consultationForm.appointmentDate || "Select date"}
                      </span>
                    </button>
                    {showDatePicker && (
                      <div className="absolute top-full left-0 z-50 mt-2 rounded-2xl shadow-glow p-4 w-72 bg-white border border-slate-200 text-slate-900">
                        <div className="flex items-center justify-between mb-3">
                          <button type="button" onClick={() => setCalendarDate(d => new Date(d.getFullYear(), d.getMonth()-1,1))} className="cursor-pointer h-8 w-8 rounded-lg hover:bg-primary/10 grid place-items-center transition">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
                          </button>
                          <span className="font-display text-sm font-semibold">{calendarDate.toLocaleDateString("en",{month:"long",year:"numeric"})}</span>
                          <button type="button" onClick={() => setCalendarDate(d => new Date(d.getFullYear(), d.getMonth()+1,1))} className="cursor-pointer h-8 w-8 rounded-lg hover:bg-primary/10 grid place-items-center transition">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
                          </button>
                        </div>
                        <div className="grid grid-cols-7 gap-0.5 mb-1">
                          {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><div key={d} className="text-center text-xs text-slate-400 py-1 font-medium">{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-0.5">
                          {(() => {
                            const first = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay();
                            const days = new Date(calendarDate.getFullYear(), calendarDate.getMonth()+1, 0).getDate();
                            const today = new Date(); today.setHours(0,0,0,0);
                            const cells = [];
                            for(let i=0;i<first;i++) cells.push(<div key={`e${i}`}/>);
                            for(let d=1;d<=days;d++){
                              const thisDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), d);
                              const isPast = thisDate < today;
                              const iso = thisDate.toISOString().split("T")[0];
                              const isSelected = consultationForm.appointmentDate === iso;
                              cells.push(
                                <button type="button" key={d} disabled={isPast}
                                  onClick={() => { updateConsultationField("appointmentDate", iso); setShowDatePicker(false); }}
                                  className={`cursor-pointer h-8 w-8 rounded-lg text-xs font-medium transition mx-auto grid place-items-center ${isPast ? "text-muted-foreground/40 cursor-not-allowed" : isSelected ? "bg-primary text-primary-foreground shadow-glow" : "hover:bg-primary/10 text-slate-900"}`}>
                                  {d}
                                </button>
                              );
                            }
                            return cells;
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Custom Time Picker */}
                  <div className="relative">
                    <button type="button" onClick={() => { setShowTimePicker(v => !v); setShowDatePicker(false); }}
                      className="cursor-pointer w-full rounded-xl bg-white dark:bg-slate-800 text-foreground dark:text-white border border-border px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40 transition text-left flex items-center gap-2">
                      <svg className="h-4 w-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                      <span className={consultationForm.appointmentTime ? "text-foreground dark:text-white" : "text-muted-foreground"}>
                        {consultationForm.appointmentTime || "Select time"}
                      </span>
                    </button>
                    {showTimePicker && (
                      <div className="absolute top-full left-0 z-50 mt-2 rounded-2xl shadow-glow p-4 w-56 bg-white border border-slate-200 text-slate-900">
                        <p className="text-xs uppercase tracking-widest text-slate-400 mb-3 font-medium">Available times</p>
                        <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto pr-1">
                          {(() => {
                            // Business hours: Mon–Thu 08:00–17:00, Fri 08:00–14:00, Sat–Sun closed
                            const dayOfWeek = consultationForm.appointmentDate
                              ? new Date(consultationForm.appointmentDate + "T12:00:00").getDay()
                              : -1;
                            const isFriday = dayOfWeek === 5;
                            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                            const endHour = isFriday ? 14 : 17;
                            if (isWeekend) return (
                              <p className="col-span-2 text-center text-xs text-slate-400 py-4">Closed on weekends.<br/>Please pick Mon–Fri.</p>
                            );
                            const slots: string[] = [];
                            for (let h = 8; h < endHour; h++) {
                              slots.push(`${String(h).padStart(2,"0")}:00`);
                              if (h * 60 + 30 < endHour * 60) slots.push(`${String(h).padStart(2,"0")}:30`);
                            }
                            return slots.map(t => {
                              const [h,m] = t.split(":").map(Number);
                              const ampm = h >= 12 ? "PM" : "AM";
                              const h12 = h % 12 || 12;
                              const label = `${h12}:${m.toString().padStart(2,"0")} ${ampm}`;
                              const isSelected = consultationForm.appointmentTime === t;
                              return (
                                <button type="button" key={t}
                                  onClick={() => { updateConsultationField("appointmentTime", t); setShowTimePicker(false); }}
                                  className={`cursor-pointer rounded-xl px-3 py-2 text-xs font-medium transition ${isSelected ? "bg-primary text-primary-foreground shadow-glow" : "hover:bg-primary/10 text-slate-900"}`}>
                                  {label}
                                </button>
                              );
                            });
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <textarea required rows={4} value={consultationForm.notes} onChange={(event) => updateConsultationField("notes", event.target.value)} className="cursor-text rounded-xl bg-white dark:bg-slate-800 text-foreground dark:text-white border border-border px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40 transition" placeholder="Tell us about your goals" />
                <input type="hidden" required value={consultationForm.appointmentDate} />
                <input type="hidden" required value={consultationForm.appointmentTime} />
                <button disabled={isSubmittingConsultation} className="cursor-pointer group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-primary-foreground font-medium shadow-glow hover:shadow-gold transition-all duration-500 disabled:cursor-not-allowed disabled:opacity-70">
                  {isSubmittingConsultation ? "Submitting..." : "Request my consultation"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="h-full flex flex-col gap-6">
              <div className="rounded-[2rem] overflow-hidden shadow-soft border border-border">
                <iframe
                  title="Jackson Dental — Tampa, FL"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3522.3!2d-82.4616746!3d27.9468615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c2c489558a1a0d%3A0x80821f43aaad6f16!2sJackson%20Dental!5e0!3m2!1sen!2sus!4v1"
                  className="w-full h-[320px]"
                  loading="lazy"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="glass rounded-2xl p-6">
                  <MapPin className="h-5 w-5 text-primary" />
                  <p className="mt-3 font-display text-lg">Visit</p>
                  <p className="text-sm text-muted-foreground mt-1">4710 N Habana Ave<br />Tampa, FL 33614</p>
                </div>
                <div className="glass rounded-2xl p-6">
                  <Phone className="h-5 w-5 text-primary" />
                  <p className="mt-3 font-display text-lg">Call</p>
                  <p className="text-sm text-muted-foreground mt-1">(813) 999-9999</p>
                </div>
                <div className="glass rounded-2xl p-6">
                  <Mail className="h-5 w-5 text-primary" />
                  <p className="mt-3 font-display text-lg">Email</p>
                  <p className="text-sm text-muted-foreground mt-1">hello@jacksondental.com</p>
                </div>
                <div className="glass rounded-2xl p-6">
                  <Clock className="h-5 w-5 text-primary" />
                  <p className="mt-3 font-display text-lg">Hours</p>
                  <p className="text-sm text-muted-foreground mt-1">Mon–Thu 8–5 · Fri 8–2</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />

      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              className="bg-white text-slate-900 w-full max-w-md rounded-[2rem] p-8 text-center shadow-glow"
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-destructive/10 text-destructive">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3 className="mt-5 font-display text-3xl">Something went wrong.</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{errorMessage}</p>
              <button
                onClick={() => setErrorMessage("")}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow transition hover:shadow-gold"
              >
                Try Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showThankYou && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              className="bg-white text-slate-900 w-full max-w-md rounded-[2rem] p-8 text-center shadow-glow"
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
                <Check className="h-7 w-7" />
              </div>
              <h3 className="mt-5 font-display text-3xl">Thank you.</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Your consultation request has been submitted successfully. Our team will contact you shortly to confirm the appointment.
              </p>
              <button
                onClick={() => setShowThankYou(false)}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow transition hover:shadow-gold"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
