"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth, isAdminRole } from "@/context/AuthContext";
import {
  Activity,
  ShieldCheck,
  Users,
  Clock,
  ChevronDown,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  LayoutDashboard,
  Menu,
  X,
  ChevronRight,
  Smartphone,
  Laptop,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";

// --- Mock Data ---
const FEATURES = [
  {
    icon: <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
    title: "Staff & Employee Profiles",
    description:
      "Manage clinical staff directories, roles, and shift assignments smoothly from a single centralized admin panel.",
  },
  {
    icon: <Clock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
    title: "Real-Time Tracking",
    description:
      "Monitor hospital desk operations, active sessions, and attendance metrics as they happen across departments.",
  },
  {
    icon: (
      <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
    ),
    title: "Secure Access Controls",
    description:
      "Enforce enterprise-grade security protocols with role-based permissions customized for healthcare compliance.",
  },
  {
    icon: (
      <Activity className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
    ),
    title: "Performance Analytics",
    description:
      "Review resource allocation data and operational efficiency reports with easy-to-digest visual metrics.",
  },
];

const FAQS = [
  {
    question: "How do I create accounts for regular hospital staff?",
    answer:
      "Initial setup requires an Admin account. Once signed in, system administrators can add, edit, or remove employee profiles directly from the dedicated management panel.",
  },
  {
    question: "Can MediTrack integrate with existing on-premise hardware?",
    answer:
      "Yes. MediTrack features an extensible web API built to securely interface with modern network infrastructure and standard hospital entry tracking frameworks.",
  },
  {
    question: "Is patient data tracked or managed inside this platform?",
    answer:
      "No. MediTrack focuses exclusively on internal workforce logistics, administrative operations, and staff metrics, keeping clinical data isolated for security.",
  },
  {
    question: "What security measures protect our administrative records?",
    answer:
      "All connections run through modern transport layers with strict authentication boundaries. Every user role strictly controls data visibility.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "MediTrack completely cleared up our shift coordination issues. The transparency across departments is exactly what we needed.",
    author: "Dr. Evelyn Manning",
    role: "Chief Medical Officer",
  },
  {
    quote:
      "Managing a network of 120+ clinical staff became effortless. Setting up roles takes seconds, and the real-time layout is bulletproof.",
    author: "Marcus Vance",
    role: "Director of Hospital Operations",
  },
];

export default function RootPage() {
  const { user, loading } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const dashboardLink = user
    ? isAdminRole(user.role)
      ? "/admin/dashboard"
      : "/dashboard"
    : "/login";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white selection:bg-emerald-500/30 transition-colors duration-300 relative overflow-y-auto">
      {/* Ambient Background Glow Components */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[60%] rounded-full bg-emerald-500/10 blur-[140px]" />
        <div className="absolute top-[10%] right-[10%] w-[50%] h-[50%] rounded-full bg-emerald-600/5 blur-[160px]" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Global Sticky Navigation Header - Fixed with shrink animation */}
        <header
          className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ease-in-out ${
            isScrolled
              ? "bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur-xl border-neutral-200/80 dark:border-white/10 shadow-lg"
              : "bg-neutral-50/70 dark:bg-neutral-950/70 backdrop-blur-xl border-neutral-200/60 dark:border-white/5"
          }`}
        >
          <div
            className={`mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ease-in-out ${
              isScrolled ? "h-14" : "h-16"
            }`}
          >
            <Link
              href="/"
              className="flex items-center gap-2 select-none active:scale-98 transition-transform"
            >
              <div
                className={`flex items-center justify-center rounded-xl bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20 transition-all duration-300 ease-in-out ${
                  isScrolled ? "h-7 w-7" : "h-8 w-8"
                }`}
              >
                <Activity
                  size={isScrolled ? 15 : 18}
                  strokeWidth={2.5}
                  className="transition-all duration-300"
                />
              </div>
              <span
                className={`font-black tracking-tighter uppercase transition-all duration-300 ease-in-out ${
                  isScrolled ? "text-base" : "text-xl"
                }`}
              >
                <span className="text-emerald-600 dark:text-emerald-400">
                  Medi
                </span>
                <span className="text-neutral-900 dark:text-white">Track</span>
              </span>
            </Link>

            {/* Desktop Navigation - Hide on scroll for cleaner look */}
            <nav
              className={`hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-zinc-400 transition-all duration-300 ${
                isScrolled
                  ? "opacity-0 pointer-events-none w-0 overflow-hidden"
                  : "opacity-100"
              }`}
            >
              <a
                href="#features"
                className="hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#preview"
                className="hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Platform
              </a>
              <a
                href="#testimonials"
                className="hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Reviews
              </a>
              <a
                href="#faq"
                className="hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                FAQ
              </a>
            </nav>

            <div className="flex items-center gap-4">
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              ) : user ? (
                <Link
                  href={dashboardLink}
                  className={`flex items-center gap-1.5 px-4 rounded-xl bg-neutral-200/50 dark:bg-white/5 border border-neutral-300 dark:border-white/10 text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-white hover:bg-neutral-200 dark:hover:bg-white/10 transition-all duration-300 ${
                    isScrolled ? "h-8 text-[10px]" : "h-9"
                  }`}
                >
                  <LayoutDashboard size={isScrolled ? 12 : 14} />
                  {!isScrolled && "Go to Dashboard"}
                  {isScrolled && "Dashboard"}
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white transition-all duration-300 ${
                      isScrolled ? "text-[10px]" : ""
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className={`flex items-center rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                      isScrolled ? "h-8 px-3 text-[10px]" : "h-9 px-4"
                    }`}
                  >
                    {isScrolled ? "Setup" : "Setup System"}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white transition-colors ml-2"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Dropdown Panel */}
          {mobileMenuOpen && (
            <div className="md:hidden border-b border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-neutral-950 px-4 py-6 space-y-4 text-sm font-bold uppercase tracking-wide">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white"
              >
                Features
              </a>
              <a
                href="#preview"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white"
              >
                Platform
              </a>
              <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white"
              >
                Reviews
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white"
              >
                FAQ
              </a>
              <hr className="border-neutral-200 dark:border-white/5" />
              <div className="pt-2 flex flex-col gap-3">
                {user ? (
                  <Link
                    href={dashboardLink}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-emerald-600 dark:text-emerald-400"
                  >
                    Dashboard →
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-neutral-500 dark:text-zinc-400"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-emerald-600 dark:text-emerald-400"
                    >
                      Setup System
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </header>

        {/* Add padding top to account for fixed header */}
        <div className="pt-16">
          {/* Hero Section */}
          <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-200/60 dark:bg-white/5 border border-neutral-300 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-6 backdrop-blur-md">
              <Sparkles size={12} />
              Enterprise Workforce Management
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-[1.1]">
              Dynamic Coordination for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-500">
                Modern Healthcare Staff
              </span>
            </h1>

            <p className="mt-6 text-sm sm:text-base text-neutral-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Streamline administrative workflow tracking, structure user roles
              securely, and optimize workforce allocation through a unified,
              high-performance monitoring interface.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href={dashboardLink}
                className="h-12 px-6 flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-900/20 transition-all group"
              >
                Access Platform
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
              {!user && (
                <Link
                  href="/register"
                  className="h-12 px-6 flex items-center rounded-xl bg-neutral-200/60 dark:bg-white/5 border border-neutral-300 dark:border-white/10 hover:bg-neutral-300 dark:hover:bg-white/10 font-bold text-xs uppercase tracking-wider text-neutral-800 dark:text-white transition-colors"
                >
                  Configure Administration
                </Link>
              )}
            </div>
          </section>

          {/* App Dashboard Mock Preview Section */}
          <section
            id="preview"
            className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 scroll-mt-12"
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3">
                Responsive Infrastructure
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Seamless Cross-Device Attendance
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
              {/* Laptop Interface Mockup */}
              <div className="lg:col-span-8 p-3 rounded-3xl bg-neutral-200/60 dark:bg-white/5 border border-neutral-300 dark:border-white/10 shadow-2xl backdrop-blur-xl group">
                <div className="flex items-center gap-2 px-4 pb-2 text-neutral-400 text-xs font-mono">
                  <Laptop size={14} />
                  <span>Desktop Station Instance</span>
                </div>
                <div className="relative rounded-2xl border border-neutral-300 dark:border-neutral-800 overflow-hidden shadow-inner aspect-[16/10]">
                  <img
                    src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80"
                    alt="MediTrack Central Dashboard System Interface"
                    className="object-cover w-full h-full transform group-hover:scale-[1.01] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-neutral-950/20 dark:bg-neutral-950/40 pointer-events-none" />
                  <div className="absolute top-3 right-3 bg-neutral-900/90 text-white font-mono text-[9px] px-2 py-0.5 rounded border border-white/10">
                    Live Console Sync
                  </div>
                </div>
              </div>

              {/* Mobile Phone Interface Mockup */}
              <div className="lg:col-span-4 p-3 rounded-[38px] bg-neutral-200/60 dark:bg-white/5 border border-neutral-300 dark:border-white/10 shadow-2xl backdrop-blur-xl max-w-sm mx-auto w-full group">
                <div className="flex items-center justify-center gap-2 pb-2 text-neutral-400 text-xs font-mono">
                  <Smartphone size={14} />
                  <span>On-Duty Clock-In Form</span>
                </div>
                <div className="relative rounded-[32px] border border-neutral-300 dark:border-neutral-800 overflow-hidden aspect-[9/16] bg-neutral-900">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
                    alt="Mobile Attendance Interface Layout"
                    className="object-cover w-full h-full transform group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-neutral-950/10 dark:bg-neutral-950/30 pointer-events-none" />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/60 rounded-full" />
                </div>
              </div>
            </div>
          </section>

          {/* Core Features Section */}
          <section
            id="features"
            className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 scroll-mt-12"
          >
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Engineered for Reliability
              </h2>
              <p className="mt-3 text-sm text-neutral-500 dark:text-zinc-400 max-w-xl mx-auto">
                Everything management teams need to supervise on-duty medical
                and support personnel successfully.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((feat, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-neutral-200/40 dark:bg-neutral-900/40 border border-neutral-300 dark:border-white/5 hover:border-neutral-400 dark:hover:border-white/10 transition-colors backdrop-blur-md"
                >
                  <div className="mb-4 p-2.5 w-fit rounded-xl bg-neutral-300 dark:bg-neutral-950 border border-neutral-400 dark:border-white/5">
                    {feat.icon}
                  </div>
                  <h3 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-white mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-zinc-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials Slider Section */}
          <section
            id="testimonials"
            className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center scroll-mt-12"
          >
            <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-neutral-200/60 to-neutral-100/20 dark:from-neutral-900/60 dark:to-neutral-900/20 border border-neutral-300 dark:border-white/5 backdrop-blur-md overflow-hidden">
              <div className="relative min-h-[140px] flex flex-col justify-center transition-all duration-500">
                <p className="text-base sm:text-lg font-medium italic text-neutral-700 dark:text-zinc-200 leading-relaxed">
                  "{TESTIMONIALS[currentSlide].quote}"
                </p>
                <div className="mt-6">
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {TESTIMONIALS[currentSlide].author}
                  </h4>
                  <p className="text-[10px] text-neutral-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
                    {TESTIMONIALS[currentSlide].role}
                  </p>
                </div>
              </div>

              {/* Slider Pagination Controls */}
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  onClick={() =>
                    setCurrentSlide(
                      (prev) =>
                        (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length,
                    )
                  }
                  className="p-1.5 rounded-lg bg-neutral-300 dark:bg-neutral-950 border border-neutral-400 dark:border-white/5 text-neutral-600 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft size={14} />
                </button>
                <div className="flex gap-1.5">
                  {TESTIMONIALS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentSlide
                          ? "w-6 bg-emerald-500"
                          : "w-1.5 bg-neutral-400 dark:bg-zinc-700"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() =>
                    setCurrentSlide((prev) => (prev + 1) % TESTIMONIALS.length)
                  }
                  className="p-1.5 rounded-lg bg-neutral-300 dark:bg-neutral-950 border border-neutral-400 dark:border-white/5 text-neutral-600 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section
            id="faq"
            className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 scroll-mt-12"
          >
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-neutral-300 dark:border-white/5 bg-neutral-200/30 dark:bg-neutral-900/30 overflow-hidden backdrop-blur-md"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-xs sm:text-sm text-neutral-800 dark:text-zinc-200 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        size={16}
                        className={`text-neutral-400 dark:text-zinc-500 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden text-xs text-neutral-500 dark:text-zinc-400 leading-relaxed ${
                        isOpen
                          ? "max-h-40 border-t border-neutral-300 dark:border-white/5 px-5 py-4"
                          : "max-h-0"
                      }`}
                    >
                      {faq.answer}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Modern Global Site Footer */}
          <footer className="relative border-t border-neutral-200 dark:border-white/5 bg-neutral-100 dark:bg-neutral-950/60 backdrop-blur-md pt-16 pb-12 transition-colors">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-200 dark:border-white/5">
                {/* Branding Column */}
                <div className="md:col-span-5 space-y-4">
                  <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-neutral-950 shadow-sm">
                      <Activity size={16} strokeWidth={2.5} />
                    </div>
                    <span className="text-lg font-black tracking-tighter uppercase">
                      <span className="text-emerald-600 dark:text-emerald-400">
                        Medi
                      </span>
                      <span className="text-neutral-900 dark:text-white">
                        Track
                      </span>
                    </span>
                  </Link>
                  <p className="text-xs text-neutral-500 dark:text-zinc-400 max-w-sm leading-relaxed">
                    Empowering healthcare facilities with modern administrative
                    automation, secure resource planning frameworks, and
                    optimized staffing tools.
                  </p>
                  <div className="flex items-center gap-3 text-neutral-400 dark:text-zinc-500">
                    <a
                      href="#"
                      className="hover:text-emerald-500 transition-colors"
                      aria-label="Twitter Account"
                    >
                      <Twitter size={16} />
                    </a>
                    <a
                      href="#"
                      className="hover:text-emerald-500 transition-colors"
                      aria-label="LinkedIn Profile"
                    >
                      <Linkedin size={16} />
                    </a>
                    <a
                      href="#"
                      className="hover:text-emerald-500 transition-colors"
                      aria-label="GitHub Repository"
                    >
                      <Github size={16} />
                    </a>
                  </div>
                </div>

                {/* Platform Quick Links Column */}
                <div className="md:col-span-3 space-y-3">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-neutral-400 dark:text-zinc-500">
                    Platform Navigation
                  </h4>
                  <ul className="space-y-2 text-xs font-bold text-neutral-500 dark:text-zinc-400">
                    <li>
                      <a
                        href="#features"
                        className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        Features Directory
                      </a>
                    </li>
                    <li>
                      <a
                        href="#preview"
                        className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        Console Preview
                      </a>
                    </li>
                    <li>
                      <a
                        href="#faq"
                        className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        Documentation FAQ
                      </a>
                    </li>
                    <li>
                      <Link
                        href="/login"
                        className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        Administrative Portal
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Notification / Updates Sub-form */}
                <div className="md:col-span-4 space-y-3">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-neutral-400 dark:text-zinc-500">
                    System Briefings
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-zinc-400 leading-relaxed">
                    Stay updated with platform architecture optimizations and
                    core regulatory tracking releases.
                  </p>
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex gap-2 max-w-sm"
                  >
                    <input
                      type="email"
                      placeholder="Enter administrator email"
                      required
                      className="flex-1 px-3 h-9 rounded-lg bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-white/10 text-xs placeholder-neutral-400 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <button
                      type="submit"
                      className="h-9 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      Join
                    </button>
                  </form>
                </div>
              </div>

              {/* Sub-footer Area */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-[11px] font-medium text-neutral-400 dark:text-zinc-500">
                <div>
                  &copy; {new Date().getFullYear()} MediTrack Core Engine.
                  Architecture configured securely.
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-[10px]">
                      All Operational Engines Online
                    </span>
                  </div>
                  <span>|</span>
                  <a
                    href="#"
                    className="hover:text-neutral-700 dark:hover:text-zinc-300 transition-colors"
                  >
                    Privacy Framework
                  </a>
                  <a
                    href="#"
                    className="hover:text-neutral-700 dark:hover:text-zinc-300 transition-colors"
                  >
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
