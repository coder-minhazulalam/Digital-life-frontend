"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  BookOpen,
  PenLine,
  Tag,
  Heart,
  Eye,
  Lock,
  Globe,
  Crown,
  Loader2,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  Info,
} from "lucide-react";

const CATEGORIES = [
  "Relationships",
  "Career & Work",
  "Personal Growth",
  "Health & Wellness",
  "Parenting & Family",
  "Finance & Money",
  "Education & Learning",
  "Loss & Grief",
  "Resilience & Failure",
  "Travel & Adventure",
  "Spirituality & Faith",
  "Creativity & Art",
  "Leadership",
  "Friendship",
  "Other",
];

const EMOTIONAL_TONES = [
  { value: "Hopeful", emoji: "🌱" },
  { value: "Reflective", emoji: "🌙" },
  { value: "Joyful", emoji: "✨" },
  { value: "Sad", emoji: "💧" },
  { value: "Grateful", emoji: "🙏" },
  { value: "Anxious", emoji: "🌀" },
  { value: "Empowered", emoji: "🔥" },
  { value: "Nostalgic", emoji: "🍂" },
  { value: "Peaceful", emoji: "🕊️" },
  { value: "Motivational", emoji: "⚡" },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AddLessonPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user ?? null;

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    emotionalTone: "",
    visibility: "Public",
    accessLevel: "Free",
  });

  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const MIN_CHARS = 100;
  const MAX_CHARS = 5000;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "description") setCharCount(value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to add a lesson");
      return;
    }
    if (!form.title.trim()) {
      toast.error("Please enter a lesson title");
      return;
    }
    if (form.description.trim().length < MIN_CHARS) {
      toast.error(`Story must be at least ${MIN_CHARS} characters`);
      return;
    }
    if (!form.category) {
      toast.error("Please select a category");
      return;
    }
    if (!form.emotionalTone) {
      toast.error("Please select an emotional tone");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category,
          emotionalTone: form.emotionalTone,
          visibility: form.visibility,
          accessLevel: form.accessLevel,
          creatorName: user.name || "Anonymous",
          creatorEmail: user.email,
          creatorPhoto: user.image || user.photoURL || "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create lesson");
      }

      toast.success("Lesson published successfully! 🎉");
      router.push(`/dashboard/my-lessons`);
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isStoryValid = charCount >= MIN_CHARS;
  const storyProgress = Math.min((charCount / MIN_CHARS) * 100, 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="p-2 rounded-xl text-zinc-500 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-zinc-900 dark:text-zinc-100">
            Share a Life Lesson
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Turn your lived experience into wisdom others can learn from
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-zinc-800/60 border border-amber-200/60 dark:border-zinc-700/60 text-sm text-amber-900 dark:text-amber-300">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600" />
        <p>
          Your lesson will be attributed to your profile name{" "}
          <strong>{user?.name || "you"}</strong>. Write authentically — real stories resonate the most.
          Minimum <strong>{MIN_CHARS} characters</strong> required for the story.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Main story inputs */}
          <div className="lg:col-span-2 space-y-5">
            {/* Title */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-2">
              <label
                htmlFor="title"
                className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300"
              >
                <BookOpen className="w-4 h-4 text-amber-600" />
                Lesson Title
                <span className="text-rose-500 ml-0.5">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. What losing my job taught me about purpose…"
                required
                maxLength={150}
                className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 transition-all"
              />
              <p className="text-xs text-zinc-400 text-right">
                {form.title.length}/150
              </p>
            </div>

            {/* Story / Description */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-2">
              <label
                htmlFor="description"
                className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300"
              >
                <PenLine className="w-4 h-4 text-amber-600" />
                Your Story
                <span className="text-rose-500 ml-0.5">*</span>
              </label>
              <p className="text-xs text-zinc-400 -mt-1">
                Share your experience in detail. Be authentic and specific.
              </p>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="It was the summer of 2019 when I realized that everything I thought I knew about success was wrong…"
                required
                rows={10}
                maxLength={MAX_CHARS}
                className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 transition-all resize-y min-h-[200px]"
              />

              {/* Char progress */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`font-medium ${
                      isStoryValid ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {isStoryValid ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Minimum length
                        reached
                      </span>
                    ) : (
                      `${MIN_CHARS - charCount} more characters needed`
                    )}
                  </span>
                  <span className="text-zinc-400">
                    {charCount}/{MAX_CHARS}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isStoryValid ? "bg-emerald-500" : "bg-amber-400"
                    }`}
                    style={{ width: `${storyProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Meta options */}
          <div className="space-y-5">
            {/* Category */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-3">
              <label
                htmlFor="category"
                className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300"
              >
                <Tag className="w-4 h-4 text-amber-600" />
                Category
                <span className="text-rose-500 ml-0.5">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 transition-all cursor-pointer"
              >
                <option value="">— Select a category —</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Emotional Tone */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                <Heart className="w-4 h-4 text-amber-600" />
                Emotional Tone
                <span className="text-rose-500 ml-0.5">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {EMOTIONAL_TONES.map(({ value, emoji }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, emotionalTone: value }))
                    }
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                      form.emotionalTone === value
                        ? "bg-amber-600 border-amber-600 text-white shadow-sm shadow-amber-600/20"
                        : "border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span className="text-base leading-none">{emoji}</span>
                    <span>{value}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Visibility */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                <Eye className="w-4 h-4 text-amber-600" />
                Visibility
              </label>
              <div className="space-y-2">
                {[
                  {
                    value: "Public",
                    icon: Globe,
                    label: "Public",
                    desc: "Visible in the lessons catalog",
                    color: "text-emerald-600",
                  },
                  {
                    value: "Private",
                    icon: Lock,
                    label: "Private",
                    desc: "Only visible to you",
                    color: "text-zinc-500",
                  },
                ].map(({ value, icon: Icon, label, desc, color }) => (
                  <label
                    key={value}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      form.visibility === value
                        ? "border-amber-400 bg-amber-50 dark:bg-zinc-800"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-amber-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value={value}
                      checked={form.visibility === value}
                      onChange={handleChange}
                      className="accent-amber-600"
                    />
                    <Icon className={`w-4 h-4 ${color}`} />
                    <div>
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        {label}
                      </p>
                      <p className="text-xs text-zinc-500">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Access Level */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                <Crown className="w-4 h-4 text-amber-600" />
                Access Level
              </label>
              <div className="space-y-2">
                {[
                  {
                    value: "Free",
                    icon: Sparkles,
                    label: "Free",
                    desc: "Everyone can read this lesson",
                    color: "text-sky-600",
                  },
                  {
                    value: "Premium",
                    icon: Crown,
                    label: "Premium Only",
                    desc: "Only premium members can read",
                    color: "text-amber-600",
                  },
                ].map(({ value, icon: Icon, label, desc, color }) => (
                  <label
                    key={value}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      form.accessLevel === value
                        ? "border-amber-400 bg-amber-50 dark:bg-zinc-800"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-amber-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="accessLevel"
                      value={value}
                      checked={form.accessLevel === value}
                      onChange={handleChange}
                      className="accent-amber-600"
                    />
                    <Icon className={`w-4 h-4 ${color}`} />
                    <div>
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        {label}
                      </p>
                      <p className="text-xs text-zinc-500">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !isStoryValid || !form.category || !form.emotionalTone}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm shadow-lg shadow-amber-700/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing Lesson…
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  Publish Life Lesson
                </>
              )}
            </button>

            {/* Requirements hint */}
            <div className="text-xs text-zinc-400 dark:text-zinc-500 space-y-1 px-1">
              <p className="font-medium text-zinc-500 dark:text-zinc-400">Required before publishing:</p>
              <ul className="space-y-1">
                {[
                  { label: "Lesson title", done: form.title.trim().length > 0 },
                  { label: `Story (${MIN_CHARS}+ chars)`, done: isStoryValid },
                  { label: "Category", done: !!form.category },
                  { label: "Emotional tone", done: !!form.emotionalTone },
                ].map(({ label, done }) => (
                  <li key={label} className={`flex items-center gap-2 ${done ? "text-emerald-600" : "text-zinc-400"}`}>
                    <CheckCircle className={`w-3.5 h-3.5 ${done ? "text-emerald-500" : "text-zinc-300"}`} />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
