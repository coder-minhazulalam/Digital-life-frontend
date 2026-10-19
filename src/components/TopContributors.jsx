"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trophy,
  Award,
  BookOpen,
  Heart,
  Bookmark,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const initialContributors = [
  {
    _id: "c1",
    creatorName: "Tanvir Rahman",
    creatorEmail: "tanvir@example.com",
    creatorPhoto:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    totalLessons: 4,
    totalLikes: 480,
    totalSaves: 235,
  },
  {
    _id: "c2",
    creatorName: "Mahmudul Hasan",
    creatorEmail: "admin@digitallife.com",
    creatorPhoto:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    totalLessons: 3,
    totalLikes: 535,
    totalSaves: 374,
  },
  {
    _id: "c3",
    creatorName: "Fatima Noor",
    creatorEmail: "fatima@example.com",
    creatorPhoto:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    totalLessons: 2,
    totalLikes: 287,
    totalSaves: 157,
  },
  {
    _id: "c4",
    creatorName: "Rahim Ahmed",
    creatorEmail: "rahim@example.com",
    creatorPhoto:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    totalLessons: 1,
    totalLikes: 142,
    totalSaves: 89,
  },
];

const rankBadges = [
  {
    rank: 1,
    label: "Top Thinker",
    badgeBg: "bg-amber-500 text-white shadow-amber-500/30",
    ringColor: "ring-amber-500",
  },
  {
    rank: 2,
    label: "Rising Sage",
    badgeBg: "bg-slate-400 text-white shadow-slate-400/30",
    ringColor: "ring-slate-400",
  },
  {
    rank: 3,
    label: "Wisdom Guide",
    badgeBg: "bg-amber-700 text-white shadow-amber-700/30",
    ringColor: "ring-amber-700",
  },
  {
    rank: 4,
    label: "Contributor",
    badgeBg: "bg-zinc-600 text-white shadow-zinc-600/30",
    ringColor: "ring-zinc-600",
  },
];

export default function TopContributors() {
  const [contributors, setContributors] = useState(initialContributors);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContributors() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/lessons/top-contributors`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setContributors(data);
          }
        }
      } catch (err) {
        console.error("Error fetching top contributors:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchContributors();
  }, []);

  return (
    <section className="py-20 md:py-28 bg-amber-50/30 dark:bg-zinc-950 border-b border-amber-900/10 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/30">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>Community Leaders</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Top Contributors of the Week
            </h2>
            <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-xl">
              Honoring mindful creators who generously share their lived experiences and reflections to guide our community.
            </p>
          </div>

          <Link
            href="/dashboard/add-lesson"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 group transition-colors"
          >
            <span>Become a Contributor</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4 Contributors Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contributors.slice(0, 4).map((user, index) => {
            const badge = rankBadges[index] || rankBadges[3];
            return (
              <motion.div
                key={user._id || index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative flex flex-col h-full rounded-3xl bg-white dark:bg-zinc-900 p-6 border border-amber-900/10 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-amber-600/30 transition-all duration-300 text-center"
              >
                {/* Rank Badge pill */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm ${badge.badgeBg}`}
                  >
                    #{badge.rank}
                  </span>
                </div>

                {/* Avatar with Glow & Ring */}
                <div className="relative mx-auto mt-2 mb-4">
                  <div
                    className={`w-20 h-20 rounded-full overflow-hidden ring-4 ${badge.ringColor} shadow-lg relative mx-auto`}
                  >
                    {user.creatorPhoto ? (
                      <Image
                        src={user.creatorPhoto}
                        alt={user.creatorName || "Contributor"}
                        fill
                        sizes="80px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-amber-700 text-white flex items-center justify-center font-bold text-2xl">
                        {(user.creatorName || "U")[0]}
                      </div>
                    )}
                  </div>
                  {/* Small Trophy icon indicator */}
                  <div className="absolute -bottom-1 right-1/2 translate-x-5 w-6 h-6 rounded-full bg-white dark:bg-zinc-800 shadow-md border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-amber-500">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Name & Title */}
                <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors truncate">
                  {user.creatorName || "Wise Contributor"}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 truncate">
                  {user.creatorEmail}
                </p>

                {/* Contribution Stats */}
                <div className="mt-auto pt-4 border-t border-amber-900/10 dark:border-zinc-800 grid grid-cols-3 gap-2 text-center bg-amber-50/40 dark:bg-zinc-800/40 rounded-2xl p-3">
                  <div>
                    <span className="block font-serif text-base font-bold text-amber-900 dark:text-amber-200">
                      {user.totalLessons}
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-medium flex items-center justify-center gap-0.5">
                      <BookOpen className="w-3 h-3 opacity-70" />
                      Lessons
                    </span>
                  </div>

                  <div>
                    <span className="block font-serif text-base font-bold text-rose-600 dark:text-rose-400">
                      {user.totalLikes || 0}
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-medium flex items-center justify-center gap-0.5">
                      <Heart className="w-3 h-3 opacity-70" />
                      Likes
                    </span>
                  </div>

                  <div>
                    <span className="block font-serif text-base font-bold text-amber-700 dark:text-amber-400">
                      {user.totalSaves || 0}
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-medium flex items-center justify-center gap-0.5">
                      <Bookmark className="w-3 h-3 opacity-70" />
                      Saves
                    </span>
                  </div>
                </div>

                {/* Link to author profile */}
                <div className="mt-4">
                  <Link
                    href={`/lessons?search=${encodeURIComponent(user.creatorName || "")}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-amber-900 dark:text-amber-300 bg-amber-100/60 dark:bg-zinc-800 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 transition-colors"
                  >
                    <span>Read Wisdom</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
