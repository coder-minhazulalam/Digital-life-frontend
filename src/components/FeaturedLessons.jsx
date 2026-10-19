"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, BookOpen } from "lucide-react";
import LessonCard from "./LessonCard";

export default function FeaturedLessons() {
  const [featuredLessons, setFeaturedLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/lessons/featured`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setFeaturedLessons(data.slice(0, 4));
          }
        }
      } catch (err) {
        console.error("Error fetching featured lessons:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <section className="py-20 md:py-28 bg-amber-50/40 dark:bg-zinc-950 border-b border-amber-900/10 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Admin Curated Wisdom</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Featured Life Lessons
            </h2>
            <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-xl">
              Hand-picked stories and insights curated by our editorial team for their depth, honesty, and transformative lessons.
            </p>
          </div>

          <Link
            href="/lessons"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 group transition-colors"
          >
            <span>View All Public Lessons</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="rounded-3xl border border-amber-900/10 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 p-5 animate-pulse space-y-4"
              >
                <div className="aspect-[16/9] w-full rounded-2xl bg-amber-200/40 dark:bg-zinc-800" />
                <div className="h-4 w-1/3 rounded-full bg-amber-200/50 dark:bg-zinc-800" />
                <div className="h-6 w-5/6 rounded-lg bg-amber-200/50 dark:bg-zinc-800" />
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-amber-200/30 dark:bg-zinc-800" />
                  <div className="h-3 w-4/5 rounded bg-amber-200/30 dark:bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lessons Cards Grid: Exactly 4 cards on home page */}
        {!loading && featuredLessons.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLessons.map((lesson) => (
              <LessonCard key={lesson._id} lesson={lesson} currentUser={null} />
            ))}
          </div>
        )}

        {!loading && featuredLessons.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            No featured lessons found. Check back soon!
          </div>
        )}

        {/* Bottom Banner Prompt */}
        <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif text-xl sm:text-2xl font-bold">
              Have a meaningful experience to share?
            </h3>
            <p className="text-sm text-amber-200/80 max-w-md">
              Your setbacks and triumphs could guide someone navigating the exact same path.
            </p>
          </div>
          <Link
            href="/dashboard/add-lesson"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-all shadow-md hover:scale-105"
          >
            <BookOpen className="w-4 h-4" />
            <span>Write a Lesson</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
