"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import {
  Users,
  BookOpen,
  Crown,
  Heart,
  Bookmark,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  BarChart3,
  Clock,
} from "lucide-react";

function StatCard({ icon: Icon, label, value, sub, color }) {
  const colors = {
    blue:   { bg: "bg-blue-50 dark:bg-blue-950/40",   icon: "text-blue-600 dark:text-blue-400",   ring: "ring-blue-200 dark:ring-blue-800" },
    amber:  { bg: "bg-amber-50 dark:bg-amber-950/40", icon: "text-amber-700 dark:text-amber-400", ring: "ring-amber-200 dark:ring-amber-800" },
    emerald:{ bg: "bg-emerald-50 dark:bg-emerald-950/40", icon: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-200 dark:ring-emerald-800" },
    rose:   { bg: "bg-rose-50 dark:bg-rose-950/40",   icon: "text-rose-600 dark:text-rose-400",   ring: "ring-rose-200 dark:ring-rose-800" },
    purple: { bg: "bg-purple-50 dark:bg-purple-950/40",icon: "text-purple-600 dark:text-purple-400",ring: "ring-purple-200 dark:ring-purple-800" },
  };
  const c = colors[color] || colors.amber;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ring-1 flex-shrink-0 ${c.bg} ${c.ring}`}>
        <Icon className={`w-6 h-6 ${c.icon}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">{label}</p>
        <p className="text-2xl font-extrabold font-serif text-zinc-900 dark:text-zinc-100 leading-tight">{value}</p>
        {sub && <p className="text-[11px] text-zinc-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Quick Action Card ───────────────────────────────────────────────────────
function QuickCard({ href, icon: Icon, label, desc, iconColor }) {
  return (
    <Link
      href={href}
      className="group bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:border-amber-500 hover:shadow-md transition-all flex flex-col gap-3"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColor}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-amber-700 transition-colors">{label}</p>
          <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
        </div>
        <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </Link>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AdminOverviewPage() {
  const { data: session } = useSession();
  const user = session?.user ?? null;
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    fetch(`${apiUrl}/admin/stats`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, apiUrl]);

  // ── Loading ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-amber-900 dark:text-amber-200 font-medium">Loading platform metrics…</p>
      </div>
    );
  }

  // ── Non-admin guard ──────────────────────────────────────────────────────
  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="max-w-sm w-full text-center bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-rose-200 dark:border-rose-900/30 shadow-xl space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-100">Admin Access Only</h2>
          <p className="text-xs text-zinc-500">This page is restricted to platform administrators only.</p>
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

  const total = stats?.totalLessons || 1;

  return (
    <div className="space-y-7 max-w-6xl mx-auto">

      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-stone-900 to-amber-950 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-3">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Platform Administration</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold">Admin Overview</h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-lg">
            Platform-wide statistics, user management, and content moderation all in one place.
          </p>
        </div>
        <div className="absolute -bottom-8 -right-8 w-52 h-52 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ── Core Stat Cards (2×2 grid) ────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}        label="Total Users"     value={stats?.totalUsers ?? 0}    sub={`${stats?.premiumUsers ?? 0} Premium members`}    color="blue" />
        <StatCard icon={BookOpen}     label="Total Lessons"   value={stats?.totalLessons ?? 0}  sub={`${stats?.featuredLessons ?? 0} Featured`}          color="emerald" />
        <StatCard icon={Crown}        label="Premium Revenue" value={`৳${(stats?.premiumUsers ?? 0) * 1500}`} sub="৳1500 / Lifetime" color="amber" />
        <StatCard icon={AlertTriangle}label="Pending Reports" value={stats?.pendingReports ?? 0} sub={`${stats?.totalReports ?? 0} total reports`}       color="rose" />
      </div>

      {/* ── Engagement Row ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Heart}        label="Total Likes"    value={stats?.totalLikes ?? 0}    color="rose" />
        <StatCard icon={Bookmark}     label="Total Saves"    value={stats?.totalSaves ?? 0}    color="amber" />
        <StatCard icon={MessageSquare}label="Total Comments" value={stats?.totalComments ?? 0} color="blue" />
      </div>

      {/* ── Bottom Section: Category Breakdown + Recent Users ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-600" />
            <h3 className="font-serif text-base font-bold text-zinc-900 dark:text-zinc-100">Lessons by Category</h3>
          </div>
          <div className="space-y-3">
            {stats?.categoryStats?.length > 0 ? (
              stats.categoryStats.map((item) => {
                const pct = Math.round((item.count / total) * 100);
                return (
                  <div key={item._id} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-zinc-700 dark:text-zinc-300 truncate pr-2">{item._id}</span>
                      <span className="text-amber-700 shrink-0">{item.count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-amber-50 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-zinc-400 text-center py-4">No data available yet.</p>
            )}
          </div>
        </div>

        {/* Recent Members */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <h3 className="font-serif text-base font-bold text-zinc-900 dark:text-zinc-100">Recently Joined Members</h3>
            </div>
            <Link href="/dashboard/admin/users" className="text-xs font-semibold text-amber-700 hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.recentUsers?.length > 0 ? (
              stats.recentUsers.map((u) => (
                <div key={u._id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-amber-100 ring-1 ring-amber-200 flex-shrink-0">
                      {u.image || u.photoURL ? (
                        <Image src={u.image || u.photoURL} alt={u.name || "User"} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-amber-700 text-white flex items-center justify-center text-[10px] font-bold">
                          {u.name?.[0] || "U"}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{u.name || "Unnamed"}</p>
                      <p className="text-[11px] text-zinc-400 truncate">{u.email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    u.role === "admin"
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                      : u.isPremium
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                  }`}>
                    {u.role === "admin" ? "Admin" : u.isPremium ? "Premium" : "Free"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-400 text-center py-4">No data available yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Quick Action Links ─────────────────────────────────────── */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <QuickCard
            href="/dashboard/admin/users"
            icon={Users}
            label="Manage Users"
            desc="Change user roles and manage platform accounts"
            iconColor="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
          />
          <QuickCard
            href="/dashboard/admin/lessons"
            icon={Sparkles}
            label="Manage Lessons"
            desc="Feature lessons on the homepage and review content"
            iconColor="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
          />
          <QuickCard
            href="/dashboard/admin/reports"
            icon={ShieldAlert}
            label="Reported Content"
            desc={`${stats?.pendingReports ?? 0} report${(stats?.pendingReports ?? 0) !== 1 ? 's' : ''} awaiting review`}
            iconColor="bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300"
          />
        </div>
      </div>

    </div>
  );
}
