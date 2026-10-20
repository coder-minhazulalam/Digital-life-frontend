"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Lock,
  Heart,
  Bookmark,
  Calendar,
  Sparkles,
  ArrowRight,
  Crown,
} from "lucide-react";

const categoryStyles = {
  "Personal Growth": "bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
  Career: "bg-blue-50 text-blue-800 border-blue-200/80 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",
  Relationships: "bg-rose-50 text-rose-800 border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800",
  Mindset: "bg-purple-50 text-purple-800 border-purple-200/80 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800",
  "Mistakes Learned": "bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
};

const toneStyles = {
  Motivational: "text-orange-700 bg-orange-100/70 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300",
  Sad: "text-indigo-700 bg-indigo-100/70 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300",
  Realization: "text-teal-700 bg-teal-100/70 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
  Gratitude: "text-pink-700 bg-pink-100/70 border-pink-200 dark:bg-pink-950/40 dark:text-pink-300",
};

export default function LessonCard({ lesson, currentUser }) {
  const isOwner = currentUser && currentUser.email === lesson.creatorEmail;
  const isAdmin = currentUser && currentUser.role === "admin";
  const isPremiumUser = currentUser && (currentUser.isPremium || isAdmin);
  const isLocked =
    (lesson.accessLevel === "Premium" || lesson.access === "Premium") &&
    !isPremiumUser &&
    !isOwner;

  const formattedDate = lesson.createdAt
    ? new Date(lesson.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  const lessonId = lesson._id || lesson.id || "1";

  return (
    <div className="group relative flex flex-col h-full rounded-3xl bg-white dark:bg-zinc-900 border border-amber-900/10 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-amber-600/30 transition-all duration-300 overflow-hidden">
      {/* Featured Image if exists */}
      {lesson.image && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-amber-100/30 dark:bg-zinc-800">
          <Image
            src={lesson.image}
            alt={lesson.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
              isLocked ? "blur-md scale-105" : ""
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent" />

          {/* Access level pill top-right */}
          <div className="absolute top-3.5 right-3.5 z-10">
            {lesson.accessLevel === "Premium" ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md">
                <Crown className="w-3.5 h-3.5" />
                Premium
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-600/90 text-white backdrop-blur-md shadow-sm">
                Free
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Content Body */}
      <div className={`p-6 flex flex-col flex-1 ${isLocked ? "relative" : ""}`}>
        {/* Badges: Category & Emotional Tone */}
        <div className="flex flex-wrap items-center gap-2 mb-3.5">
          <span
            className={`px-3 py-0.5 rounded-full text-xs font-medium border ${
              categoryStyles[lesson.category] ||
              "bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200"
            }`}
          >
            {lesson.category}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              toneStyles[lesson.emotionalTone] ||
              "bg-amber-100/60 text-amber-800 border-amber-200 dark:bg-zinc-800 dark:text-zinc-200"
            }`}
          >
            {lesson.emotionalTone}
          </span>
          {lesson.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3 h-3 text-amber-600" />
              Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors line-clamp-2 mb-2">
          {lesson.title}
        </h3>

        {/* Description preview */}
        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-6 flex-1 leading-relaxed">
          {isLocked
            ? "This wisdom is reserved for our Premium members. Upgrade to unlock this life lesson and gain full lifetime access to our community wisdom."
            : lesson.description}
        </p>

        {/* Locked Overlay for Premium Lessons */}
        {isLocked && (
          <div className="absolute inset-x-0 bottom-0 top-16 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3 ring-1 ring-amber-500/30 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              Premium Lesson
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mb-4">
              Upgrade to Premium to read this complete wisdom story and all exclusive insights.
            </p>
            <Link
              href={`/pricing?redirect=/lessons/${lessonId}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-md shadow-amber-900/10 transition-all hover:scale-105"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Upgrade to View (৳1500)</span>
            </Link>
          </div>
        )}

        {/* Creator Info & Metadata */}
        <div className="pt-4 border-t border-amber-900/10 dark:border-zinc-800/80 flex items-center justify-between mt-auto">
          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-amber-900/10 dark:ring-zinc-700 flex-shrink-0">
              {lesson.creatorPhoto ? (
                <Image
                  src={lesson.creatorPhoto}
                  alt={lesson.creatorName || "Creator"}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-amber-700 text-white flex items-center justify-center text-xs font-semibold">
                  {(lesson.creatorName || "A")[0]}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 truncate max-w-[120px]">
                {lesson.creatorName || "Anonymous"}
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 opacity-70" />
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Social Stats: Likes & Saves */}
          <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1 hover:text-rose-600 transition-colors">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
              <span>{lesson.likesCount || (lesson.likes ? lesson.likes.length : 0)}</span>
            </span>
            <span className="flex items-center gap-1 hover:text-amber-600 transition-colors">
              <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
              <span>{lesson.savesCount || 0}</span>
            </span>
          </div>
        </div>

        {/* See Details Button */}
        <div className="mt-4 pt-3 border-t border-dashed border-amber-900/10 dark:border-zinc-800">
          <Link
            href={`/lessons/${lessonId}`}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-amber-100/70 dark:bg-zinc-800 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 dark:hover:text-white text-amber-950 dark:text-amber-200 transition-all duration-200 group/btn"
          >
            <span>{isLocked ? "Unlock & Read Lesson" : "See Details"}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
