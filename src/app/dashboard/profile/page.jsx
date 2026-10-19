"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Crown,
  ShieldCheck,
  Calendar,
  Sparkles,
  Camera,
  Loader2,
  BookOpen,
  Heart,
  Bookmark,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

// Pre-curated aesthetic avatar presets for quick selection
const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
];

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProfilePage() {
  const { data: session, isPending: sessionPending } = useSession();
  const sessionUser = session?.user ?? null;

  const [loading, setLoading] = useState(false);
  const [fetchingStats, setFetchingStats] = useState(true);
  const [profileData, setProfileData] = useState(null);

  const [form, setForm] = useState({
    name: "",
    photoURL: "",
  });

  // Load user profile details and stats from backend
  const loadProfile = async (email) => {
    if (!email) return;
    setFetchingStats(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/profile/${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
        setForm({
          name: data.name || sessionUser?.name || "",
          photoURL: data.image || data.photoURL || sessionUser?.image || "",
        });
      } else {
        // Fallback to session info
        setForm({
          name: sessionUser?.name || "",
          photoURL: sessionUser?.image || sessionUser?.photoURL || "",
        });
      }
    } catch {
      // Offline fallback
      setForm({
        name: sessionUser?.name || "",
        photoURL: sessionUser?.image || sessionUser?.photoURL || "",
      });
    } finally {
      setFetchingStats(false);
    }
  };

  useEffect(() => {
    if (sessionUser?.email) {
      loadProfile(sessionUser.email);
    }
  }, [sessionUser?.email]);

  const user = profileData || sessionUser;
  const isPremium = user?.isPremium === true;
  const isAdmin = user?.role === "admin";
  const userPhoto = form.photoURL || user?.image || user?.photoURL;

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: sessionUser?.email,
          name: form.name.trim(),
          image: form.photoURL.trim(),
          photoURL: form.photoURL.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile updated successfully! ✨");
      // Reload updated data
      if (sessionUser?.email) {
        await loadProfile(sessionUser.email);
      }
    } catch {
      toast.error("Could not update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sessionPending && !sessionUser) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
        <p className="text-sm text-zinc-500 font-medium">Loading your profile…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 text-white p-6 sm:p-8 shadow-xl shadow-amber-900/10">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-amber-100">
                User Profile
              </span>
              {isAdmin && (
                <span className="text-xs uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full bg-yellow-400 text-amber-950">
                  Admin
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Welcome, {user?.name || "Life Learner"} 👋
            </h1>
            <p className="text-amber-100/80 text-sm mt-1 max-w-xl">
              Manage your personal wisdom profile, track your shared life lessons, and customize your public presence.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isPremium && (
              <Link
                href="/pricing"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 text-amber-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <Crown className="w-4 h-4" /> Upgrade to Premium
              </Link>
            )}
            <button
              type="button"
              onClick={() => sessionUser?.email && loadProfile(sessionUser.email)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Refresh profile"
            >
              <RefreshCw className={`w-4 h-4 ${fetchingStats ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Decorative corner glow */}
        <div className="absolute -right-10 -bottom-10 w-52 h-52 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Lessons Created</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-zinc-800 flex items-center justify-center text-amber-700">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-zinc-900 dark:text-zinc-100">
            {profileData?.totalLessons ?? 0}
          </p>
          <Link
            href="/dashboard/my-lessons"
            className="text-xs text-amber-700 hover:text-amber-800 font-medium mt-2 inline-flex items-center gap-1"
          >
            Manage lessons <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Likes Received</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-zinc-800 flex items-center justify-center text-rose-600">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-zinc-900 dark:text-zinc-100">
            {profileData?.totalLikes ?? 0}
          </p>
          <span className="text-xs text-zinc-400 mt-2 block">Appreciation from readers</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Times Bookmarked</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-zinc-800 flex items-center justify-center text-blue-600">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-zinc-900 dark:text-zinc-100">
            {profileData?.totalSaves ?? 0}
          </p>
          <span className="text-xs text-zinc-400 mt-2 block">Saved by the community</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Membership Plan</span>
            <div className="w-8 h-8 rounded-lg bg-yellow-50 dark:bg-zinc-800 flex items-center justify-center text-yellow-600">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            {isPremium ? (
              <span className="text-amber-600">Premium ⭐</span>
            ) : (
              <span className="text-zinc-600">Free Tier</span>
            )}
          </p>
          {!isPremium ? (
            <Link
              href="/pricing"
              className="text-xs text-amber-700 hover:underline font-semibold mt-2 inline-flex items-center gap-1"
            >
              Unlock Premium <ArrowRight className="w-3 h-3" />
            </Link>
          ) : (
            <span className="text-xs text-emerald-600 font-medium mt-2 block">All content unlocked</span>
          )}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="text-center">
              <div className="relative inline-block mx-auto mb-4">
                <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-amber-500/30 shadow-md bg-amber-700 text-white flex items-center justify-center text-3xl font-bold">
                  {userPhoto ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={userPhoto}
                      alt={form.name || "Profile Photo"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span>{form.name?.charAt(0) || "U"}</span>
                  )}
                </div>
                <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900 flex items-center justify-center" title="Active">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              <h2 className="text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100">
                {form.name || user?.name || "Community Member"}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                {user?.email}
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${
                  isPremium
                    ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-xs"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                }`}>
                  <Crown className="w-3 h-3" />
                  {isPremium ? "Premium Member" : "Free Plan"}
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-amber-50 dark:bg-zinc-800 text-amber-800 dark:text-amber-300">
                  <ShieldCheck className="w-3 h-3 text-amber-600" />
                  Role: {user?.role || "user"}
                </span>
              </div>
            </div>

            <div className="pt-5 border-t border-zinc-100 dark:border-zinc-800 space-y-3 text-xs text-zinc-500">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                  <Mail className="w-4 h-4 text-zinc-400" /> Account Email
                </span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate max-w-[150px]">
                  {user?.email}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                  <Calendar className="w-4 h-4 text-zinc-400" /> Member Since
                </span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Active Learner"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Contribution Level
                </span>
                <span className="font-medium text-amber-700 dark:text-amber-400">
                  {(profileData?.totalLessons ?? 0) > 3 ? "Senior Contributor" : "Wisdom Sharer"}
                </span>
              </div>
            </div>

            {/* Quick Action */}
            <div className="pt-2">
              <Link
                href="/dashboard/add-lesson"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold tracking-wider uppercase shadow-sm transition-all hover:scale-[1.01]"
              >
                <BookOpen className="w-4 h-4" /> Share a New Lesson
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-5 mb-6">
              <h2 className="text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100">
                Edit Profile Information
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Update your display name and avatar photo. These changes will reflect across all your shared lessons.
              </p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Full Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 transition-all"
                  />
                </div>
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="email" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Email Address
                  </label>
                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Cannot be changed
                  </span>
                </div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Photo URL */}
              <div className="space-y-2">
                <label htmlFor="photoURL" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Profile Photo URL
                </label>
                <div className="relative">
                  <Camera className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    id="photoURL"
                    type="url"
                    value={form.photoURL}
                    onChange={(e) => setForm((prev) => ({ ...prev, photoURL: e.target.value }))}
                    placeholder="https://example.com/your-photo.jpg"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 transition-all"
                  />
                </div>
              </div>

              {/* Preset Avatars Picker */}
              <div className="space-y-2 pt-1">
                <span className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Or pick a curated avatar preset:
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, photoURL: preset }))}
                      className={`relative w-11 h-11 rounded-full overflow-hidden ring-2 transition-all hover:scale-105 ${
                        form.photoURL === preset
                          ? "ring-amber-600 scale-105 shadow-md"
                          : "ring-zinc-200 dark:ring-zinc-700 opacity-80 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preset}
                        alt={`Preset ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                  {form.photoURL && (
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, photoURL: "" }))}
                      className="text-xs text-rose-600 hover:text-rose-700 underline font-medium ml-2"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Role & Plan Status Notice */}
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-zinc-800/60 border border-amber-900/10 dark:border-zinc-700/60 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">
                    Account Status: {isAdmin ? "Platform Administrator" : "Active Member"}
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Plan: {isPremium ? "Premium (Unlocked full access)" : "Free (Access standard lessons)"}
                  </span>
                </div>
                {!isPremium && (
                  <Link
                    href="/pricing"
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors flex items-center gap-1"
                  >
                    <Crown className="w-3 h-3" /> Upgrade
                  </Link>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold shadow-md shadow-amber-700/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Changes…</span>
                    </>
                  ) : (
                    <span>Save Profile Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
