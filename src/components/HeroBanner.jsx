"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Heart,
  Compass,
  Star,
} from "lucide-react";

const slides = [
  {
    id: 1,
    badge: "Mindful Reflection & Growth",
    badgeIcon: Sparkles,
    badgeColor: "from-amber-600 to-amber-700 text-amber-50",
    title: "Preserve the Wisdom You Gather Through Life",
    highlight: "Before Time Fades It Away.",
    description:
      "We often learn profound, life-altering truths in our hardest moments—only to forget them later. Digital Life Lessons is your reflective sanctuary to record, organize, and revisit personal wisdom.",
    primaryBtn: {
      text: "Explore Public Lessons",
      href: "/lessons",
      icon: BookOpen,
    },
    secondaryBtn: {
      text: "Share Your Story",
      href: "/dashboard/add-lesson",
      icon: ArrowRight,
    },
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { label: "Wisdom Shared", value: "2,400+" },
      { label: "Community Saves", value: "18.5K" },
      { label: "Reflections", value: "99%" },
    ],
    accentGradient: "from-amber-500/20 via-orange-500/10 to-transparent",
  },
  {
    id: 2,
    badge: "Shared Human Experience",
    badgeIcon: Heart,
    badgeColor: "from-rose-600 to-amber-600 text-rose-50",
    title: "Learn From the Real Mistakes & Triumphs",
    highlight: "Of Thinkers Around the World.",
    description:
      "Skip years of trial and error by reading candid stories in career, relationships, and mindset. Filter by authentic emotional tones like Gratitude, Realization, and Resilience.",
    primaryBtn: {
      text: "Browse Categories",
      href: "/lessons",
      icon: Compass,
    },
    secondaryBtn: {
      text: "View Saved Lessons",
      href: "/dashboard/my-favorites",
      icon: Star,
    },
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { label: "Active Writers", value: "1,200+" },
      { label: "Categories", value: "5 Deep Pillars" },
      { label: "Safe Space", value: "100% Moderated" },
    ],
    accentGradient: "from-rose-500/20 via-amber-500/10 to-transparent",
  },
  {
    id: 3,
    badge: "Exclusive Lifetime Growth",
    badgeIcon: ShieldCheck,
    badgeColor: "from-amber-700 to-yellow-600 text-amber-50",
    title: "Unlock Deep Life Blueprints & Mentorship",
    highlight: "With a Lifetime Premium Pass.",
    description:
      "Elevate your growth journey. Get unlimited access to locked premium wisdom, ad-free thoughtful reading, priority feed curation, and an honored member badge.",
    primaryBtn: {
      text: "Upgrade to Premium — ৳1500",
      href: "/pricing",
      icon: Star,
    },
    secondaryBtn: {
      text: "Explore Free Wisdom",
      href: "/lessons",
      icon: ArrowRight,
    },
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { label: "One-Time Cost", value: "৳1,500" },
      { label: "Access Level", value: "Lifetime" },
      { label: "Exclusive Content", value: "Unrestricted" },
    ],
    accentGradient: "from-yellow-500/20 via-amber-600/10 to-transparent",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const slide = slides[current];
  const BadgeIcon = slide.badgeIcon;

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-amber-100/40 via-amber-50/20 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 py-12 md:py-20 lg:py-24 border-b border-amber-900/10 dark:border-zinc-800"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background ambient decorative glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-amber-300/30 via-orange-200/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-amber-400/10 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
          >
            {/* Left Column: Text & Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r shadow-sm transition-all duration-300 uppercase tracking-wider backdrop-blur-sm shadow-amber-900/10 bg-white/80 dark:bg-zinc-800/80 border border-amber-600/20 text-amber-900 dark:text-amber-200">
                <BadgeIcon className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                <span>{slide.badge}</span>
              </div>

              {/* Heading */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-zinc-900 dark:text-zinc-50 leading-[1.15] tracking-tight">
                {slide.title}{" "}
                <span className="block mt-1 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 dark:from-amber-400 dark:to-yellow-300 bg-clip-text text-transparent">
                  {slide.highlight}
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {slide.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href={slide.primaryBtn.href}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white font-semibold text-sm sm:text-base shadow-lg shadow-amber-900/20 hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                >
                  <slide.primaryBtn.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{slide.primaryBtn.text}</span>
                </Link>

                <Link
                  href={slide.secondaryBtn.href}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/90 dark:bg-zinc-900/90 hover:bg-amber-100/60 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-sm sm:text-base border border-amber-900/15 dark:border-zinc-700 shadow-sm transition-all duration-200"
                >
                  <span>{slide.secondaryBtn.text}</span>
                  <slide.secondaryBtn.icon className="w-4 h-4 opacity-70" />
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="pt-6 border-t border-amber-900/10 dark:border-zinc-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
                {slide.stats.map((stat, idx) => (
                  <div key={idx} className="text-center lg:text-left">
                    <p className="font-serif text-xl sm:text-2xl font-bold text-amber-900 dark:text-amber-200">
                      {stat.value}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Visual Card with Image & Glass Reflection */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glow under the card */}
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/30 to-orange-500/20 rounded-3xl blur-xl opacity-75" />

                {/* Main Card */}
                <div className="relative rounded-3xl overflow-hidden border border-amber-900/15 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 shadow-2xl backdrop-blur-md">
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 45vw"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />

                    {/* Floating quote pill inside card */}
                    <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-white/20 dark:border-zinc-700/50 shadow-lg">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                          Featured Insight
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm italic font-serif text-zinc-800 dark:text-zinc-200 line-clamp-2">
                        “The greatest wisdom lies in not regretting mistakes, but honoring the teacher they were.”
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls: Arrows & Slide Indicators */}
        <div className="mt-10 sm:mt-12 flex items-center justify-between pt-6 border-t border-amber-900/10 dark:border-zinc-800">
          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-2.5">
            {slides.map((s, index) => (
              <button
                key={s.id}
                onClick={() => setCurrent(index)}
                className={`transition-all duration-300 rounded-full focus:outline-none ${
                  current === index
                    ? "w-8 h-2.5 bg-amber-700 dark:bg-amber-500"
                    : "w-2.5 h-2.5 bg-amber-900/25 dark:bg-zinc-700 hover:bg-amber-900/40"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
            <span className="ml-3 text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400">
              0{current + 1} / 0{slides.length}
            </span>
          </div>

          {/* Prev / Next Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="p-2.5 rounded-full border border-amber-900/15 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900 hover:bg-amber-100/70 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 transition-colors shadow-sm focus:outline-none"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2.5 rounded-full border border-amber-900/15 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900 hover:bg-amber-100/70 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 transition-colors shadow-sm focus:outline-none"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
