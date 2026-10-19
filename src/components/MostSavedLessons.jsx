"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Sparkles, ArrowRight } from "lucide-react";
import LessonCard from "./LessonCard";

export default function MostSavedLessons() {
  const [mostSaved, setMostSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMostSaved() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/lessons/most-saved`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setMostSaved(data.slice(0, 4));
          }
        }
      } catch (err) {
        console.error("Error fetching most saved lessons:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMostSaved();
  }, []);

  return (
    <section className="py-20 md:py-28 bg-white dark:bg-zinc-900 border-b border-amber-900/10 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/30">
              <Bookmark className="w-3.5 h-3.5 text-amber-600" />
              <span>Community Favorites</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Most Saved Life Lessons
            </h2>
            <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-xl">
              The most bookmarked and cherished insights our members return to repeatedly for clarity, perspective, and guidance.
            </p>
          </div>

          <Link
            href="/lessons?sort=most-saved"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 group transition-colors"
          >
            <span>View All Bookmarked</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="rounded-3xl border border-amber-900/10 dark:border-zinc-800 bg-amber-50/30 dark:bg-zinc-800/50 p-5 animate-pulse space-y-4"
              >
                <div className="aspect-[16/9] w-full rounded-2xl bg-amber-200/40 dark:bg-zinc-700" />
                <div className="h-4 w-1/3 rounded-full bg-amber-200/50 dark:bg-zinc-700" />
                <div className="h-6 w-5/6 rounded-lg bg-amber-200/50 dark:bg-zinc-700" />
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-amber-200/30 dark:bg-zinc-700" />
                  <div className="h-3 w-4/5 rounded bg-amber-200/30 dark:bg-zinc-700" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Most Saved Cards Grid */}
        {!loading && mostSaved.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mostSaved.map((lesson) => (
              <LessonCard key={lesson._id} lesson={lesson} currentUser={null} />
            ))}
          </div>
        )}

        {!loading && mostSaved.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            No saved lessons yet. Start exploring and bookmarking wisdom!
          </div>
        )}
      </div>
    </section>
  );
}
