"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import {
  BookOpen,
  Sparkles,
  Crown,
  Search,
  Filter,
  Eye,
  Trash2,
  ExternalLink,
  ShieldAlert,
  Shield,
  Star,
  StarOff,
  Heart,
  Bookmark,
  MessageSquare,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Globe,
  Lock,
} from "lucide-react";

export default function ManageLessonsPage() {
  const { data: session } = useSession();
  const currentUser = session?.user ?? null;

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [accessFilter, setAccessFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");

  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }
  const [confirmDeleteLesson, setConfirmDeleteLesson] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch all lessons from admin endpoint
  const fetchLessons = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (accessFilter !== "all") params.append("access", accessFilter);
      if (featuredFilter !== "all") params.append("featured", featuredFilter);
      if (visibilityFilter !== "all") params.append("visibility", visibilityFilter);

      const res = await fetch(`${apiUrl}/admin/lessons?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load lessons");
      const data = await res.json();
      setLessons(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: "Failed to load lessons list." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "admin") {
      fetchLessons();
    }
  }, [
    currentUser?.role,
    categoryFilter,
    accessFilter,
    featuredFilter,
    visibilityFilter,
  ]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLessons();
  };

  // Toggle Featured status
  const handleFeaturedToggle = async (lesson) => {
    const lessonId = lesson._id || lesson.id;
    const isCurrentlyFeatured = Boolean(lesson.isFeatured);
    const newFeatured = !isCurrentlyFeatured;

    try {
      setActionLoadingId(lessonId);
      setFeedback(null);
      const res = await fetch(`${apiUrl}/admin/lessons/${lessonId}/featured`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: newFeatured }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update featured status");

      setLessons((prev) =>
        prev.map((l) =>
          (l._id || l.id) === lessonId ? { ...l, isFeatured: newFeatured } : l
        )
      );
      setFeedback({
        type: "success",
        message: `Lesson "${lesson.title}" is now ${
          newFeatured ? "featured on the homepage" : "unfeatured"
        }.`,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message || "Error updating featured status.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete lesson
  const handleDeleteLesson = async (lesson) => {
    const lessonId = lesson._id || lesson.id;

    try {
      setActionLoadingId(lessonId);
      setFeedback(null);
      const res = await fetch(`${apiUrl}/admin/lessons/${lessonId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete lesson");

      setLessons((prev) => prev.filter((l) => (l._id || l.id) !== lessonId));
      setFeedback({
        type: "success",
        message: `Lesson "${lesson.title}" was deleted permanently.`,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message || "Error deleting lesson.",
      });
    } finally {
      setActionLoadingId(null);
      setConfirmDeleteLesson(null);
    }
  };

  // Compute metrics
  const metrics = useMemo(() => {
    const total = lessons.length;
    const featured = lessons.filter((l) => Boolean(l.isFeatured)).length;
    const premium = lessons.filter((l) => l.access === "Premium").length;
    const free = total - premium;
    return { total, featured, premium, free };
  }, [lessons]);

  // Extract unique categories for filter
  const categories = useMemo(() => {
    const set = new Set();
    lessons.forEach((l) => {
      if (l.category) set.add(l.category);
    });
    return Array.from(set);
  }, [lessons]);

  // Non-admin guard
  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="max-w-sm w-full text-center bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-rose-200 dark:border-rose-900/30 shadow-xl space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Admin Access Only
          </h2>
          <p className="text-xs text-zinc-500">
            This section is restricted to platform administrators.
          </p>
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-700 text-white text-xs font-semibold hover:bg-amber-800 transition-colors"
          >
            <ArrowRight className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Content Management</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
            Manage Lessons
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm mt-0.5">
            Review community contributions, feature lessons on the homepage, and manage visibility.
          </p>
        </div>

        <button
          onClick={fetchLessons}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* ── Metrics Cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Lessons</p>
          <p className="text-xl sm:text-2xl font-serif font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
            {metrics.total}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Featured</p>
          <p className="text-xl sm:text-2xl font-serif font-extrabold text-amber-700 dark:text-amber-300 mt-1">
            {metrics.featured}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Premium Lessons</p>
          <p className="text-xl sm:text-2xl font-serif font-extrabold text-purple-700 dark:text-purple-300 mt-1">
            {metrics.premium}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Free Lessons</p>
          <p className="text-xl sm:text-2xl font-serif font-extrabold text-zinc-600 dark:text-zinc-400 mt-1">
            {metrics.free}
          </p>
        </div>
      </div>

      {/* ── Feedback Banner ──────────────────────────────────────────────── */}
      {feedback && (
        <div
          className={`flex items-center justify-between p-4 rounded-xl border text-xs font-medium animate-fadeIn ${
            feedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
              : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-zinc-400 hover:text-zinc-600 ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Search & Filter Controls ─────────────────────────────────────── */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by lesson title or creator..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-300 font-medium focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Featured Filter */}
          <select
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-300 font-medium focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Featured States</option>
            <option value="featured">Featured Only</option>
            <option value="standard">Standard Only</option>
          </select>

          {/* Access Filter */}
          <select
            value={accessFilter}
            onChange={(e) => setAccessFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-300 font-medium focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Access</option>
            <option value="Free">Free Only</option>
            <option value="Premium">Premium Only</option>
          </select>

          {/* Visibility Filter */}
          <select
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-300 font-medium focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Visibility</option>
            <option value="Public">Public Only</option>
            <option value="Private">Private Only</option>
          </select>
        </div>
      </div>

      {/* ── Lessons Table ───────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-zinc-500">Loading lessons...</p>
          </div>
        ) : lessons.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <BookOpen className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto" />
            <p className="font-semibold text-zinc-700 dark:text-zinc-300 text-sm">
              No lessons found
            </p>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              {search || categoryFilter !== "all" || accessFilter !== "all" || featuredFilter !== "all"
                ? "Try adjusting your search query or filter settings."
                : "No lessons published on the platform yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/75 dark:bg-zinc-800/40 text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 sm:px-6">Lesson</th>
                  <th className="py-3.5 px-4">Creator</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Engagement</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {lessons.map((l) => {
                  const lessonId = l._id || l.id;
                  const isActionLoading = actionLoadingId === lessonId;
                  const isFeatured = Boolean(l.isFeatured);
                  const isPremium = l.access === "Premium";
                  const isPrivate = l.visibility === "Private";

                  return (
                    <tr
                      key={lessonId}
                      className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      {/* Lesson Title & Link */}
                      <td className="py-3.5 px-4 sm:px-6 max-w-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            {isFeatured && (
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />
                            )}
                            <Link
                              href={`/lessons/${lessonId}`}
                              target="_blank"
                              className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-amber-700 transition-colors line-clamp-1 group inline-flex items-center gap-1"
                            >
                              <span>{l.title}</span>
                              <ExternalLink className="w-3 h-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                            </Link>
                          </div>
                          <p className="text-[11px] text-zinc-400 line-clamp-1">
                            {l.summary || l.description || "No description provided."}
                          </p>
                        </div>
                      </td>

                      {/* Creator */}
                      <td className="py-3.5 px-4">
                        <div className="min-w-0">
                          <p className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                            {l.creatorName || "Anonymous"}
                          </p>
                          <p className="text-[11px] text-zinc-400 truncate">{l.creatorEmail}</p>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          {l.category || "General"}
                        </span>
                      </td>

                      {/* Status Badges */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {/* Access */}
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isPremium
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                            }`}
                          >
                            {isPremium ? <Crown className="w-2.5 h-2.5" /> : null}
                            <span>{isPremium ? "Premium" : "Free"}</span>
                          </span>

                          {/* Visibility */}
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              isPrivate
                                ? "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                                : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            }`}
                          >
                            {isPrivate ? (
                              <Lock className="w-2.5 h-2.5" />
                            ) : (
                              <Globe className="w-2.5 h-2.5" />
                            )}
                            <span>{l.visibility || "Public"}</span>
                          </span>
                        </div>
                      </td>

                      {/* Engagement */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3 text-zinc-500 text-[11px]">
                          <span className="flex items-center gap-1" title="Likes">
                            <Heart className="w-3 h-3 text-rose-500" />
                            {l.likesCount ?? 0}
                          </span>
                          <span className="flex items-center gap-1" title="Saves">
                            <Bookmark className="w-3 h-3 text-amber-500" />
                            {l.savesCount ?? 0}
                          </span>
                          <span className="flex items-center gap-1" title="Comments">
                            <MessageSquare className="w-3 h-3 text-blue-500" />
                            {l.commentsCount ?? 0}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Toggle Featured */}
                          <button
                            onClick={() => handleFeaturedToggle(l)}
                            disabled={isActionLoading}
                            title={
                              isFeatured
                                ? "Remove from Featured lessons on homepage"
                                : "Feature this lesson on the homepage"
                            }
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all disabled:opacity-40 ${
                              isFeatured
                                ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-200 border border-amber-300 dark:border-amber-800"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200"
                            }`}
                          >
                            {isFeatured ? (
                              <>
                                <StarOff className="w-3 h-3 text-amber-700" />
                                <span>Unfeature</span>
                              </>
                            ) : (
                              <>
                                <Star className="w-3 h-3 text-zinc-500" />
                                <span>Feature</span>
                              </>
                            )}
                          </button>

                          {/* Preview Link */}
                          <Link
                            href={`/lessons/${lessonId}`}
                            target="_blank"
                            title="Preview lesson details"
                            className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-800 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          {/* Delete Button */}
                          <button
                            onClick={() => setConfirmDeleteLesson(l)}
                            disabled={isActionLoading}
                            title="Delete lesson"
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Confirmation Modal for Deleting Lesson ───────────────────────── */}
      {confirmDeleteLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Confirm Lesson Deletion
              </h3>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Are you sure you want to permanently delete the lesson{" "}
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  &ldquo;{confirmDeleteLesson.title}&rdquo;
                </span>
                ? Any associated reports and comments will also be affected. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteLesson(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteLesson(confirmDeleteLesson)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
