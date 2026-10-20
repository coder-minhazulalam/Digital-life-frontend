"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import {
  Search,
  SlidersHorizontal,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import LessonCard from "@/components/LessonCard";

const categories = [
  "All",
  "Personal Growth",
  "Career",
  "Relationships",
  "Mindset",
  "Mistakes Learned",
];

const emotionalTones = [
  "All",
  "Motivational",
  "Sad",
  "Realization",
  "Gratitude",
];

const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Most Saved", value: "most-saved" },
  { label: "Most Liked", value: "most-liked" },
  { label: "Oldest First", value: "oldest" },
];

function PublicLessonsContent() {
  const { data: session } = useSession();
  const currentUser = session?.user ?? null;

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTone, setSelectedTone] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch lessons from backend API
  useEffect(() => {
    async function loadLessons() {
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: "8",
          category: selectedCategory,
          emotionalTone: selectedTone,
          sort: sortBy,
        });

        if (search.trim()) {
          queryParams.append("search", search.trim());
        }

        const res = await fetch(`${apiUrl}/lessons?${queryParams.toString()}`, {
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.lessons)) {
            setLessons(data.lessons);
            setTotalPages(data.totalPages || 1);
            setTotalCount(data.totalCount || data.lessons.length);
          } else if (Array.isArray(data)) {
            setLessons(data);
            setTotalPages(1);
            setTotalCount(data.length);
          }
          
        }
      } catch (err) {
        console.error("Error loading lessons:", err);
      } finally {
        setLoading(false);
      }
    }

    loadLessons();
  }, [search, selectedCategory, selectedTone, sortBy, currentPage]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedTone("All");
    setSortBy("newest");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/30">
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>Community Wisdom Repository</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Explore Public Life Lessons
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            Real life reflections, hard-learned lessons, and timeless advice shared openly by mindful creators worldwide.
          </p>
        </div>

        {/* Search, Filter & Sort Controls Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-amber-900/10 dark:border-zinc-800 shadow-xl shadow-amber-900/5 space-y-6">
          {/* Top row: Search input & Sort dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="w-5 h-5 text-amber-700/60 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search lessons by title, keyword, or insight..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-amber-900/15 dark:border-zinc-700 bg-amber-50/30 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-4 relative">
              <SlidersHorizontal className="w-4 h-4 text-amber-700/60 absolute left-4 top-1/2 -translate-y-1/2" />
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-8 py-3.5 rounded-2xl border border-amber-900/15 dark:border-zinc-700 bg-amber-50/30 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-600 transition-all cursor-pointer appearance-none"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Sort: {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Tabs Pill Row */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-900/70 dark:text-amber-400/70">
              Filter by Category:
            </span>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-amber-700 text-white shadow-sm shadow-amber-900/20"
                      : "bg-amber-100/50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-amber-200/60 dark:hover:bg-zinc-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Emotional Tone Filter Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-amber-900/10 dark:border-zinc-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-900/70 dark:text-amber-400/70 mr-1">
                Emotional Tone:
              </span>
              {emotionalTones.map((tone) => (
                <button
                  key={tone}
                  onClick={() => {
                    setSelectedTone(tone);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedTone === tone
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-semibold"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>

            {/* Clear/Reset button */}
            {(selectedCategory !== "All" ||
              selectedTone !== "All" ||
              search.trim() !== "" ||
              sortBy !== "newest") && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Results Meta */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 px-2">
          <span>
            Showing <strong className="text-zinc-900 dark:text-zinc-100">{lessons.length}</strong> of{" "}
            <strong className="text-zinc-900 dark:text-zinc-100">{totalCount}</strong> lessons
          </span>
          <span>Page {currentPage} of {totalPages}</span>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
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

        {/* Lessons Cards Grid */}
        {!loading && lessons.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson._id}
                lesson={lesson}
                currentUser={currentUser}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && lessons.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-amber-900/10 dark:border-zinc-800 p-8">
            <BookOpen className="w-12 h-12 text-amber-700/50 mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              No life lessons found
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-6">
              We couldn't find any lessons matching your criteria. Try adjusting your search keyword or clearing the filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded-xl bg-amber-700 text-white text-sm font-semibold hover:bg-amber-800 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl border border-amber-900/15 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-100/60 dark:hover:bg-zinc-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  currentPage === page
                    ? "bg-amber-700 text-white shadow-sm"
                    : "bg-white dark:bg-zinc-900 border border-amber-900/15 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-amber-100/60"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl border border-amber-900/15 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-100/60 dark:hover:bg-zinc-800 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PublicLessonsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-amber-50/30">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PublicLessonsContent />
    </Suspense>
  );
}
