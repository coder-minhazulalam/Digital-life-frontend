"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  BookOpen,
  PlusCircle,
  Search,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  ExternalLink,
  Sparkles,
  Heart,
  Bookmark,
  Calendar,
  Layers,
  Crown,
  AlertCircle,
  CheckCircle2,
  Loader2,
  LayoutGrid,
  Table as TableIcon,
  RefreshCw,
  X,
  Lock,
  Globe,
  Tag,
  Smile,
  Shield,
  HelpCircle,
} from "lucide-react";

const CATEGORIES = [
  "All",
  "Career & Ambition",
  "Relationships",
  "Personal Growth",
  "Failures & Mistakes",
  "Health & Well-being",
  "Mindset & Philosophy",
  "Financial Wisdom",
];

const EMOTIONAL_TONES = [
  { id: "Inspiring", label: "Inspiring", icon: "✨", color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60" },
  { id: "Reflective", label: "Reflective", icon: "🌱", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60" },
  { id: "Cautionary", label: "Cautionary", icon: "⚠️", color: "text-orange-600 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900/60" },
  { id: "Grateful", label: "Grateful", icon: "🙏", color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60" },
  { id: "Motivating", label: "Motivating", icon: "🔥", color: "text-red-600 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/60" },
  { id: "Humorous", label: "Humorous", icon: "😄", color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/40 border-yellow-200 dark:border-yellow-900/60" },
];

export default function MyLessonsPage() {
  const router = useRouter();
  const { data: session, isPending: isAuthPending } = useSession();
  const user = session?.user ?? null;

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedVisibility, setSelectedVisibility] = useState("All"); // All | Public | Private
  const [sortBy, setSortBy] = useState("newest"); // newest | oldest | likes | saves
  const [viewMode, setViewMode] = useState("table"); // "table" | "grid"

  // Modals state
  const [editingLesson, setEditingLesson] = useState(null);
  const [deletingLesson, setDeletingLesson] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    emotionalTone: "",
    visibility: "Public",
    accessLevel: "Free",
    image: "",
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch user lessons from server
  const fetchMyLessons = async () => {
    if (!user?.email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/lessons/my?email=${encodeURIComponent(user.email)}`);
      if (!res.ok) {
        throw new Error(`Failed to load lessons (Status: ${res.status})`);
      }
      const data = await res.json();
      setLessons(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching user lessons:", err);
      setError(err.message || "Failed to load lessons");
      toast.error("Failed to load your lessons from the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthPending && user?.email) {
      fetchMyLessons();
    } else if (!isAuthPending && !user) {
      setLoading(false);
    }
  }, [isAuthPending, user?.email]);

  // Open Edit Modal
  const handleOpenEdit = (lesson) => {
    setEditingLesson(lesson);
    setEditForm({
      title: lesson.title || "",
      description: lesson.description || "",
      category: lesson.category || CATEGORIES[1],
      emotionalTone: lesson.emotionalTone || EMOTIONAL_TONES[0].id,
      visibility: lesson.visibility || "Public",
      accessLevel: lesson.accessLevel || "Free",
      image: lesson.image || "",
    });
  };

  // Submit Edit Form
  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    if (!editingLesson) return;

    if (!editForm.title.trim() || !editForm.description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch(`${apiUrl}/lessons/${editingLesson._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update lesson");
      }

      toast.success("Lesson updated successfully! ✨");
      // Optimistic state update
      setLessons((prev) =>
        prev.map((item) =>
          item._id === editingLesson._id
            ? { ...item, ...editForm, updatedAt: new Date().toISOString() }
            : item
        )
      );
      setEditingLesson(null);
    } catch (err) {
      console.error("Error updating lesson:", err);
      toast.error(err.message || "Failed to update lesson");
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete Lesson
  const handleDeleteLesson = async () => {
    if (!deletingLesson) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${apiUrl}/lessons/${deletingLesson._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete lesson");
      }

      toast.success("Lesson deleted successfully");
      setLessons((prev) => prev.filter((item) => item._id !== deletingLesson._id));
      setDeletingLesson(null);
    } catch (err) {
      console.error("Error deleting lesson:", err);
      toast.error(err.message || "Failed to delete lesson");
    } finally {
      setIsDeleting(false);
    }
  };

  // Quick Toggle Visibility (Public <-> Private)
  const handleToggleVisibility = async (lesson) => {
    const nextVisibility = lesson.visibility === "Public" ? "Private" : "Public";
    setTogglingId(lesson._id);

    try {
      const res = await fetch(`${apiUrl}/lessons/${lesson._id}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility: nextVisibility }),
      });

      if (!res.ok) {
        throw new Error("Failed to change visibility");
      }

      setLessons((prev) =>
        prev.map((item) =>
          item._id === lesson._id ? { ...item, visibility: nextVisibility } : item
        )
      );
      toast.success(
        nextVisibility === "Public"
          ? "Lesson is now Public to everyone! 🌐"
          : "Lesson is now Private 🔒"
      );
    } catch (err) {
      console.error("Error toggling visibility:", err);
      toast.error("Could not update visibility");
    } finally {
      setTogglingId(null);
    }
  };

  // Filtered & Sorted Lessons
  const filteredLessons = useMemo(() => {
    let result = [...lessons];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (l) =>
          l.title?.toLowerCase().includes(q) ||
          l.description?.toLowerCase().includes(q) ||
          l.category?.toLowerCase().includes(q)
      );
    }

    // Visibility filter
    if (selectedVisibility !== "All") {
      result = result.filter((l) => l.visibility === selectedVisibility);
    }

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter((l) => l.category === selectedCategory);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      if (sortBy === "likes") {
        return (b.likesCount || 0) - (a.likesCount || 0);
      }
      if (sortBy === "saves") {
        return (b.savesCount || 0) - (a.savesCount || 0);
      }
      return 0;
    });

    return result;
  }, [lessons, searchQuery, selectedVisibility, selectedCategory, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const total = lessons.length;
    const publicCount = lessons.filter((l) => l.visibility === "Public").length;
    const privateCount = lessons.filter((l) => l.visibility === "Private").length;
    const totalLikes = lessons.reduce((acc, curr) => acc + (curr.likesCount || 0), 0);
    const totalSaves = lessons.reduce((acc, curr) => acc + (curr.savesCount || 0), 0);
    return { total, publicCount, privateCount, totalLikes, totalSaves };
  }, [lessons]);

  // Unauthenticated Wall
  if (!isAuthPending && !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-amber-900/10 dark:border-zinc-800 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Sign In Required
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Please sign in to view and manage all life lessons you have created and shared with the community.
            </p>
          </div>
          <Link
            href="/login?callbackUrl=/dashboard/my-lessons"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-amber-700 hover:bg-amber-800 transition-all shadow-md shadow-amber-700/20"
          >
            Sign In to Your Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-amber-900/10 dark:border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 mb-2 border border-amber-200 dark:border-amber-900/50">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personal Archive</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            My Life Lessons
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Manage, edit, and track the impact of the wisdom and experiences you have shared with the community.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchMyLessons}
            disabled={loading}
            title="Refresh Lessons"
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-amber-50 dark:hover:bg-zinc-800 hover:text-amber-700 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/dashboard/add-lesson"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 shadow-md shadow-amber-700/20 transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Write New Lesson</span>
          </Link>
        </div>
      </div>

      {/* Metric / Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Lessons */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-amber-900/10 dark:border-zinc-800/80 shadow-sm relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
              Total Lessons
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
              {stats.total}
            </span>
            <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              stories penned
            </span>
          </div>
        </div>

        {/* Public Lessons */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-amber-900/10 dark:border-zinc-800/80 shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
              Public Wisdom
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-serif font-bold text-emerald-700 dark:text-emerald-400">
              {stats.publicCount}
            </span>
            <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              visible to all
            </span>
          </div>
        </div>

        {/* Private Lessons */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-amber-900/10 dark:border-zinc-800/80 shadow-sm relative overflow-hidden group hover:border-stone-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
              Private Notes
            </span>
            <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-stone-300 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
              {stats.privateCount}
            </span>
            <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              only for you
            </span>
          </div>
        </div>

        {/* Total Appreciation */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-amber-900/10 dark:border-zinc-800/80 shadow-sm relative overflow-hidden group hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
              Appreciation
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-rose-600 dark:text-rose-400">
              {stats.totalLikes}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              likes • {stats.totalSaves} saves
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-amber-900/10 dark:border-zinc-800/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, insight, or keywords..."
              className="w-full pl-10 pr-9 py-2 rounded-xl text-sm bg-stone-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Visibility Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 self-start md:self-auto">
            {["All", "Public", "Private"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedVisibility(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedVisibility === tab
                    ? "bg-white dark:bg-zinc-900 text-amber-800 dark:text-amber-300 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                {tab === "Public" && "🌐 "}
                {tab === "Private" && "🔒 "}
                {tab}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2 px-3 rounded-xl text-xs sm:text-sm bg-stone-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "All" ? "All Categories" : cat}
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="py-2 px-3 rounded-xl text-xs sm:text-sm bg-stone-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="likes">Sort: Most Liked</option>
            <option value="saves">Sort: Most Saved</option>
          </select>

          {/* View Toggle */}
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-stone-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60">
            <button
              onClick={() => setViewMode("table")}
              title="Table view"
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "table"
                  ? "bg-white dark:bg-zinc-900 text-amber-700 dark:text-amber-400 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              title="Grid view"
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-white dark:bg-zinc-900 text-amber-700 dark:text-amber-400 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Filters readout */}
        {(searchQuery || selectedCategory !== "All" || selectedVisibility !== "All") && (
          <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-xs text-zinc-500">
            <span>Showing {filteredLessons.length} of {lessons.length} lessons</span>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedVisibility("All");
              }}
              className="text-amber-700 dark:text-amber-400 hover:underline font-medium ml-2"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {loading ? (
        /* Loading Skeleton */
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-amber-900/10 dark:border-zinc-800 animate-pulse space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="h-5 bg-stone-200 dark:bg-zinc-800 rounded w-1/3"></div>
                <div className="h-6 bg-stone-200 dark:bg-zinc-800 rounded-full w-20"></div>
              </div>
              <div className="h-4 bg-stone-100 dark:bg-zinc-800/60 rounded w-3/4"></div>
              <div className="flex items-center gap-3 pt-2">
                <div className="h-6 bg-stone-200 dark:bg-zinc-800 rounded-full w-24"></div>
                <div className="h-6 bg-stone-200 dark:bg-zinc-800 rounded-full w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error State */
        <div className="p-8 rounded-3xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-600 dark:text-rose-400 mx-auto" />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Failed to Load Your Lessons
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
            {error}. Ensure your backend server is running and connected to MongoDB.
          </p>
          <button
            onClick={fetchMyLessons}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-amber-700 hover:bg-amber-800 transition-all shadow-md"
          >
            Try Again
          </button>
        </div>
      ) : lessons.length === 0 ? (
        /* Empty State (User has no lessons at all) */
        <div className="p-10 md:p-16 rounded-3xl bg-white dark:bg-zinc-900 border border-amber-900/10 dark:border-zinc-800 shadow-sm text-center space-y-5">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 mx-auto flex items-center justify-center shadow-inner">
            <BookOpen className="w-10 h-10" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              You Haven&apos;t Shared Any Lessons Yet
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Every turning point, failure, and breakthrough holds wisdom. Chronicle your first life lesson to preserve your journey and inspire others.
            </p>
          </div>
          <div>
            <Link
              href="/dashboard/add-lesson"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 shadow-md shadow-amber-700/25 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Your First Lesson</span>
            </Link>
          </div>
        </div>
      ) : filteredLessons.length === 0 ? (
        /* No Search / Filter match */
        <div className="p-10 rounded-2xl bg-white dark:bg-zinc-900 border border-amber-900/10 dark:border-zinc-800 text-center space-y-3">
          <HelpCircle className="w-8 h-8 text-zinc-400 mx-auto" />
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
            No lessons match your search criteria
          </h4>
          <p className="text-sm text-zinc-500">
            Try adjusting your search terms or clearing your active filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setSelectedVisibility("All");
            }}
            className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-amber-900/10 dark:border-zinc-800/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 dark:bg-zinc-800/60 text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider border-b border-zinc-100 dark:border-zinc-800">
                <tr>
                  <th className="py-3.5 px-5">Lesson / Story</th>
                  <th className="py-3.5 px-4">Tone & Category</th>
                  <th className="py-3.5 px-4">Visibility</th>
                  <th className="py-3.5 px-4">Access</th>
                  <th className="py-3.5 px-4">Engagement</th>
                  <th className="py-3.5 px-4">Created</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredLessons.map((lesson) => {
                  const toneMeta =
                    EMOTIONAL_TONES.find((t) => t.id === lesson.emotionalTone) ||
                    EMOTIONAL_TONES[0];
                  const isPublic = lesson.visibility === "Public";
                  const isToggling = togglingId === lesson._id;

                  return (
                    <tr
                      key={lesson._id}
                      className="hover:bg-amber-50/40 dark:hover:bg-zinc-800/40 transition-colors group"
                    >
                      {/* Title & Preview */}
                      <td className="py-4 px-5 max-w-sm">
                        <div className="flex items-center gap-3">
                          {lesson.image ? (
                            <img
                              src={lesson.image}
                              alt={lesson.title}
                              className="w-11 h-11 rounded-xl object-cover flex-shrink-0 border border-zinc-200 dark:border-zinc-700 shadow-xs"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 text-amber-700 dark:text-amber-400 border border-amber-200/40 dark:border-zinc-700">
                              <BookOpen className="w-5 h-5" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/lessons/${lesson._id}`}
                              className="font-serif font-bold text-zinc-900 dark:text-zinc-100 hover:text-amber-700 dark:hover:text-amber-400 line-clamp-1 transition-colors block"
                            >
                              {lesson.title}
                            </Link>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                              {lesson.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category & Tone */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-stone-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                            <Tag className="w-2.5 h-2.5 opacity-60" />
                            {lesson.category}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${toneMeta.color}`}
                          >
                            <span>{toneMeta.icon}</span>
                            <span>{lesson.emotionalTone}</span>
                          </span>
                        </div>
                      </td>

                      {/* Visibility with quick toggle */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(lesson)}
                          disabled={isToggling}
                          title={`Click to change visibility to ${isPublic ? "Private" : "Public"}`}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                            isPublic
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                              : "bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-zinc-700 hover:bg-stone-200"
                          }`}
                        >
                          {isToggling ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : isPublic ? (
                            <Globe className="w-3 h-3" />
                          ) : (
                            <Lock className="w-3 h-3" />
                          )}
                          <span>{lesson.visibility || "Public"}</span>
                        </button>
                      </td>

                      {/* Access Level */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
                            lesson.accessLevel === "Premium"
                              ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                              : "text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800"
                          }`}
                        >
                          {lesson.accessLevel === "Premium" && <Crown className="w-3 h-3 text-amber-600" />}
                          {lesson.accessLevel || "Free"}
                        </span>
                      </td>

                      {/* Engagement */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
                          <span className="flex items-center gap-1" title="Likes">
                            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current opacity-80" />
                            <span>{lesson.likesCount || 0}</span>
                          </span>
                          <span className="flex items-center gap-1" title="Saves">
                            <Bookmark className="w-3.5 h-3.5 text-amber-600 fill-current opacity-80" />
                            <span>{lesson.savesCount || 0}</span>
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs text-zinc-500 dark:text-zinc-400">
                        {lesson.createdAt
                          ? new Date(lesson.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Recently"}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/lessons/${lesson._id}`}
                            title="View public page"
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(lesson)}
                            title="Edit Lesson"
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingLesson(lesson)}
                            title="Delete Lesson"
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLessons.map((lesson) => {
            const toneMeta =
              EMOTIONAL_TONES.find((t) => t.id === lesson.emotionalTone) ||
              EMOTIONAL_TONES[0];
            const isPublic = lesson.visibility === "Public";
            const isToggling = togglingId === lesson._id;

            return (
              <div
                key={lesson._id}
                className="rounded-2xl bg-white dark:bg-zinc-900 border border-amber-900/10 dark:border-zinc-800/80 shadow-sm hover:shadow-md hover:border-amber-500/40 transition-all flex flex-col justify-between overflow-hidden group"
              >
                {lesson.image && (
                  <div className="relative w-full h-36 overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-800">
                    <img
                      src={lesson.image}
                      alt={lesson.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5 space-y-3.5">
                  {/* Card Header: Category & Tone Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                      {lesson.category}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${toneMeta.color}`}
                    >
                      <span>{toneMeta.icon}</span>
                      <span>{lesson.emotionalTone}</span>
                    </span>
                  </div>

                  {/* Title & Preview */}
                  <div>
                    <Link
                      href={`/lessons/${lesson._id}`}
                      className="font-serif font-bold text-lg text-zinc-900 dark:text-zinc-100 hover:text-amber-700 dark:hover:text-amber-400 line-clamp-2 transition-colors"
                    >
                      {lesson.title}
                    </Link>
                    <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                      {lesson.description}
                    </p>
                  </div>

                  {/* Badges bar */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(lesson)}
                      disabled={isToggling}
                      title="Click to toggle visibility"
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border cursor-pointer transition-all ${
                        isPublic
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200"
                          : "bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-stone-300 border-stone-200"
                      }`}
                    >
                      {isToggling ? (
                        <Loader2 className="w-2.5 h-2.5 animate-spin" />
                      ) : isPublic ? (
                        <Globe className="w-2.5 h-2.5" />
                      ) : (
                        <Lock className="w-2.5 h-2.5" />
                      )}
                      <span>{lesson.visibility}</span>
                    </button>

                    {lesson.accessLevel === "Premium" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                        <Crown className="w-3 h-3 text-amber-600" />
                        <span>Premium</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3 bg-stone-50/70 dark:bg-zinc-800/40 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-500 fill-current" />
                      <span>{lesson.likesCount || 0}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Bookmark className="w-3 h-3 text-amber-600 fill-current" />
                      <span>{lesson.savesCount || 0}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Link
                      href={`/lessons/${lesson._id}`}
                      title="View"
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-white dark:hover:bg-zinc-800 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(lesson)}
                      title="Edit"
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-zinc-800 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingLesson(lesson)}
                      title="Delete"
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-zinc-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT LESSON MODAL */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Edit Life Lesson
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Update the content and sharing preferences of your lesson
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingLesson(null)}
                className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateLesson} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Lesson Title
                </label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Cover Image URL */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Featured Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={editForm.image || ""}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {editForm.image && editForm.image.trim() && (
                  <div className="mt-2 relative w-full h-32 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                    <img
                      src={editForm.image.trim()}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                  The Story & Insight
                </label>
                <textarea
                  required
                  rows={5}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                />
              </div>

              {/* Category & Tone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Emotional Tone
                  </label>
                  <select
                    value={editForm.emotionalTone}
                    onChange={(e) => setEditForm({ ...editForm, emotionalTone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {EMOTIONAL_TONES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.icon} {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Visibility & Access Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                    Visibility
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Public", "Private"].map((vis) => (
                      <button
                        type="button"
                        key={vis}
                        onClick={() => setEditForm({ ...editForm, visibility: vis })}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                          editForm.visibility === vis
                            ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                            : "bg-stone-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-stone-100"
                        }`}
                      >
                        {vis === "Public" ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        <span>{vis}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                    Access Tier
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Free", "Premium"].map((tier) => (
                      <button
                        type="button"
                        key={tier}
                        onClick={() => setEditForm({ ...editForm, accessLevel: tier })}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                          editForm.accessLevel === tier
                            ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                            : "bg-stone-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-stone-100"
                        }`}
                      >
                        {tier === "Premium" && <Crown className="w-3.5 h-3.5" />}
                        <span>{tier}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingLesson(null)}
                  disabled={isUpdating}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-amber-700 hover:bg-amber-800 shadow-md shadow-amber-700/20 disabled:opacity-50 transition-all"
                >
                  {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isUpdating ? "Saving Changes..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Delete Life Lesson?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-zinc-900 dark:text-zinc-100">&quot;{deletingLesson.title}&quot;</span>? This will permanently remove it and cannot be undone.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingLesson(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteLesson}
                disabled={isDeleting}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 disabled:opacity-50 transition-all"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{isDeleting ? "Deleting..." : "Delete Lesson"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
