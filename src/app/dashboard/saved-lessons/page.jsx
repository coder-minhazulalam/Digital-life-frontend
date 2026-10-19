"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  Bookmark,
  Trash2,
  ExternalLink,
  Crown,
  Heart,
  Calendar,
  Filter,
  Search,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const CATEGORIES = [
  "All",
  "Personal Growth",
  "Career",
  "Relationships",
  "Mindset",
  "Mistakes Learned",
];

export default function SavedLessonsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user ?? null;

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch saved lessons
  const fetchFavorites = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const res = await fetch(
        `${apiUrl}/favorites/user?email=${encodeURIComponent(user.email)}`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const data = await res.json();
        setFavorites(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
      toast.error("Failed to load saved lessons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login?redirect=/dashboard/saved-lessons");
    } else if (user?.email) {
      fetchFavorites();
    }
  }, [user, isPending]);

  // Remove lesson from favorites
  const handleRemoveFavorite = async (lessonId) => {
    if (!user?.email) return;
    setRemovingId(lessonId);
    try {
      const res = await fetch(`${apiUrl}/favorites/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user.email,
          lessonId: String(lessonId),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFavorites((prev) => prev.filter((item) => String(item._id) !== String(lessonId)));
        toast.success("Removed from saved favorites");
      } else {
        toast.error(data.message || "Failed to remove");
      }
    } catch (err) {
      toast.error("Network error removing favorite");
    } finally {
      setRemovingId(null);
    }
  };

  // Filtered favorites
  const filteredFavorites = favorites.filter((lesson) => {
    const matchesCategory =
      selectedCategory === "All" || lesson.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      lesson.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.creatorName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isPending || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
          Loading your saved wisdom...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md border border-white/20">
              <Bookmark className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>Personal Knowledge Vault</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-extrabold tracking-tight">
              Saved Lessons & Insights
            </h1>
            <p className="text-amber-100/90 text-sm max-w-xl">
              Curate your favorite life lessons, return to them whenever you seek guidance, and reflect on timeless experiences.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center min-w-[110px]">
              <span className="block text-2xl font-bold font-serif">{favorites.length}</span>
              <span className="text-[11px] text-amber-200 uppercase tracking-wider font-medium">Saved Items</span>
            </div>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Controls: Search & Category Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-amber-900/10 dark:border-zinc-800 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search within saved lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-amber-50/20 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-amber-700 text-white shadow-sm"
                  : "bg-amber-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-amber-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      {filteredFavorites.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-amber-900/20 dark:border-zinc-800 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 dark:bg-zinc-800 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {searchQuery || selectedCategory !== "All"
              ? "No matching saved lessons found"
              : "No saved lessons yet"}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
            {searchQuery || selectedCategory !== "All"
              ? "Try adjusting your search query or filter to see more saved lessons."
              : "Explore the public wisdom library and click 'Save to Favorites' on lessons that resonate with you."}
          </p>
          <Link
            href="/lessons"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs sm:text-sm font-semibold shadow-md transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore Public Lessons</span>
          </Link>
        </div>
      ) : (
        /* Tabular & Card Responsive View */
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-amber-900/10 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-amber-900/10 dark:border-zinc-800 bg-amber-50/40 dark:bg-zinc-800/50 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Lesson Title & Story</th>
                  <th className="py-4 px-4">Category & Tone</th>
                  <th className="py-4 px-4">Author</th>
                  <th className="py-4 px-4">Access</th>
                  <th className="py-4 px-4">Saved On</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-900/5 dark:divide-zinc-800 text-sm">
                {filteredFavorites.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-amber-50/30 dark:hover:bg-zinc-800/30 transition-colors group"
                  >
                    {/* Lesson Title & Story Preview */}
                    <td className="py-4 px-6 max-w-sm">
                      <div className="space-y-1">
                        <Link
                          href={`/lessons/${item._id}`}
                          className="font-serif font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-700 transition-colors line-clamp-1 flex items-center gap-1.5"
                        >
                          <span>{item.title}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-amber-700" />
                        </Link>
                        <p className="text-xs text-zinc-500 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </td>

                    {/* Category & Tone */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                          {item.category}
                        </span>
                        <div className="text-[11px] text-zinc-400">
                          Tone: {item.emotionalTone}
                        </div>
                      </div>
                    </td>

                    {/* Author */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="relative w-7 h-7 rounded-full overflow-hidden bg-amber-100 ring-1 ring-amber-900/10">
                          {item.creatorPhoto ? (
                            <Image
                              src={item.creatorPhoto}
                              alt={item.creatorName || "Author"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-amber-700 text-white flex items-center justify-center font-bold text-[10px]">
                              {item.creatorName?.[0] || "A"}
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                          {item.creatorName || "Anonymous"}
                        </span>
                      </div>
                    </td>

                    {/* Access Level */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {item.accessLevel === "Premium" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          <Crown className="w-3 h-3 text-amber-600" />
                          Premium
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Free
                        </span>
                      )}
                    </td>

                    {/* Saved On */}
                    <td className="py-4 px-4 whitespace-nowrap text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 opacity-60" />
                        {item.savedAt ? new Date(item.savedAt).toLocaleDateString() : "Saved"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/lessons/${item._id}`}
                          className="px-3 py-1.5 rounded-lg border border-amber-900/15 text-xs font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-100/50 transition-colors"
                        >
                          Read Story
                        </Link>
                        <button
                          onClick={() => handleRemoveFavorite(item._id)}
                          disabled={removingId === item._id}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                          title="Remove from favorites"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
