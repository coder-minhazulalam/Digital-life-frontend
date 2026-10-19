"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  RotateCcw,
  Compass,
  HeartHandshake,
  ScrollText,
  Sparkles,
} from "lucide-react";

const benefits = [
  {
    id: 1,
    icon: RotateCcw,
    badge: "Avoid Traps",
    title: "Prevents Costly Repeating Mistakes",
    description:
      "Life repeats painful tests until the lesson is truly internalized. Writing down your setbacks ensures you remember the real causes and never walk into the exact same mistake twice.",
    accent: "from-amber-500/10 to-orange-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    iconBg: "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300",
  },
  {
    id: 2,
    icon: Compass,
    badge: "Inner Clarity",
    title: "Builds Emotional Resilience & Peace",
    description:
      "Expressing raw emotional moments—burnout, heartbreak, career shifts—converts overwhelming chaos into grounded perspective, self-compassion, and deep inner calm.",
    accent: "from-emerald-500/10 to-teal-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    iconBg: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300",
  },
  {
    id: 3,
    icon: HeartHandshake,
    badge: "Shared Reality",
    title: "Guides Others Walking the Same Path",
    description:
      "Your vulnerable story and breakthroughs become an illuminating beacon for someone quietly struggling with the very same hurdle right now. Wisdom multiplies when shared.",
    accent: "from-rose-500/10 to-pink-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
    iconBg: "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300",
  },
  {
    id: 4,
    icon: ScrollText,
    badge: "Wisdom Legacy",
    title: "Preserves a Living Archive of Growth",
    description:
      "Material achievements fade, but personal wisdom endures forever. Cultivate a timeless digital heritage for your future self, family, and a mindful global community.",
    accent: "from-indigo-500/10 to-blue-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
    iconBg: "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300",
  },
];

export default function WhyLearningMatters() {
  return (
    <section className="py-20 md:py-28 bg-white dark:bg-zinc-900 border-b border-amber-900/10 dark:border-zinc-800 relative overflow-hidden">
      {/* Decorative ambient background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>The Power of Mindful Reflection</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Why Learning From Life Matters
          </h2>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Every hardship, triumph, and unexpected turning point carries a lesson. Preserving them turns fleeting experience into permanent wisdom.
          </p>
        </div>

        {/* 4 Equal-height Benefit Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group flex flex-col h-full rounded-3xl bg-amber-50/30 dark:bg-zinc-800/50 p-8 border border-amber-900/10 dark:border-zinc-700/80 shadow-sm hover:shadow-xl hover:border-amber-600/30 transition-all duration-300"
              >
                {/* Icon & Badge Row */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-transform duration-300 group-hover:scale-110 ${benefit.iconBg}`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <span
                    className={`text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border ${benefit.accent}`}
                  >
                    {benefit.badge}
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors mb-3 leading-snug">
                  {benefit.title}
                </h3>

                {/* Card Description */}
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mt-auto">
                  {benefit.description}
                </p>

                {/* Subtle bottom indicator */}
                <div className="mt-6 pt-4 border-t border-amber-900/10 dark:border-zinc-700/50 flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span>Pillar 0{benefit.id}</span>
                  <span className="w-8 h-[1px] bg-amber-600" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
