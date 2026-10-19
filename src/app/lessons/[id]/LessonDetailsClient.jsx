"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Bookmark,
  Flag,
  Calendar,
  Clock,
  ArrowLeft,
  Crown,
  Lock,
  MessageSquare,
  Send,
  Eye,
} from "lucide-react";

export default function LessonDetailsClient({ lessonId }) {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Interaction states
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Comments state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Report modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("Inappropriate Content");
  const [reportSuccess, setReportSuccess] = useState(false);

  // Sample user state
  const [currentUser] = useState({
    name: "Mahmudul Hasan",
    email: "mahmudul@example.com",
    photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    isPremium: false,
  });

  useEffect(() => {
    async function fetchLesson() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/lessons/${lessonId}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setLesson(data);
          setLikesCount(data.likesCount || (data.likes ? data.likes.length : 0));
          setFavoritesCount(data.savesCount || 0);
          setComments([
            {
              id: "c1",
              userName: "Fatima Noor",
              userPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
              text: "This resonates deeply with what I experienced in my own journey. Thank you for sharing this wisdom!",
              createdAt: "2 days ago",
            },
          ]);
        } else {
          setError("Lesson not found");
        }
      } catch (err) {
        console.error("Error loading lesson details:", err);
        setError("Failed to load lesson");
      } finally {
        setLoading(false);
      }
    }
    fetchLesson();
  }, [lessonId]);

  const handleToggleLike = () => {
    if (liked) {
      setLiked(false);
      setLikesCount((prev) => Math.max(0, prev - 1));
    } else {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  const handleToggleFavorite = () => {
    if (favorited) {
      setFavorited(false);
      setFavoritesCount((prev) => Math.max(0, prev - 1));
    } else {
      setFavorited(true);
      setFavoritesCount((prev) => prev + 1);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const commentObj = {
      id: Date.now().toString(),
      userName: currentUser.name,
      userPhoto: currentUser.photoURL,
      text: newComment.trim(),
      createdAt: "Just now",
    };
    setComments([commentObj, ...comments]);
    setNewComment("");
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setReportModalOpen(false);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50/30 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
            Loading lesson wisdom...
          </p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-amber-50/30 dark:bg-zinc-950">
        <div className="text-center max-w-md bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-amber-900/10 shadow-xl">
          <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Lesson Not Found
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
            The life lesson you are looking for may have been removed or is currently unavailable.
          </p>
          <Link
            href="/lessons"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-700 text-white font-semibold text-sm hover:bg-amber-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public Lessons</span>
          </Link>
        </div>
      </div>
    );
  }

  const isLocked = lesson.accessLevel === "Premium" && !currentUser.isPremium;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Back */}
        <Link
          href="/lessons"
          className="inline-flex items-center gap-2 text-sm font-medium text-amber-900 dark:text-amber-300 hover:text-amber-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Lessons</span>
        </Link>

        {/* Header Block: Badges & Title */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
              {lesson.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200 border border-orange-200">
              Tone: {lesson.emotionalTone}
            </span>
            {lesson.accessLevel === "Premium" ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-sm">
                <Crown className="w-3.5 h-3.5" />
                Premium
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-600 text-white">
                Free
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight">
            {lesson.title}
          </h1>

          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 pt-2 border-b border-amber-900/10 dark:border-zinc-800 pb-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 opacity-70" />
              Published: {new Date(lesson.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 opacity-70" />
              Estimated Read: 3 mins
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 opacity-70" />
              Views: {lesson.viewsCount || 1240}
            </span>
          </div>
        </div>

        {/* Featured Image */}
        {lesson.image && (
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-amber-900/10 shadow-xl">
            <Image
              src={lesson.image}
              alt={lesson.title}
              fill
              priority
              className={`object-cover ${isLocked ? "blur-md" : ""}`}
            />
          </div>
        )}

        {/* Main Lesson Content or Locked Banner */}
        <div className="relative bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-10 border border-amber-900/10 dark:border-zinc-800 shadow-xl">
          {isLocked ? (
            <div className="text-center py-12 px-4 space-y-5">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center ring-1 ring-amber-500/30 shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                Premium Wisdom Story
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                This in-depth lesson is reserved for Premium members. Upgrade with a one-time payment of ৳1500 for lifetime access to all wisdom stories.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm shadow-xl shadow-amber-900/20 transition-all hover:scale-105"
              >
                <Crown className="w-4 h-4" />
                <span>Upgrade to Premium (৳1500)</span>
              </Link>
            </div>
          ) : (
            <div className="prose prose-amber dark:prose-invert max-w-none text-base sm:text-lg text-zinc-800 dark:text-zinc-200 leading-relaxed font-serif space-y-6">
              <p>{lesson.description}</p>
            </div>
          )}

          {/* Engagement & Action Buttons Bar */}
          <div className="mt-10 pt-6 border-t border-amber-900/10 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Like Button */}
              <button
                onClick={handleToggleLike}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  liked
                    ? "bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800"
                    : "bg-amber-100/50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-amber-100"
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? "fill-rose-500 text-rose-500" : ""}`} />
                <span>{likesCount} Likes</span>
              </button>

              {/* Favorite Button */}
              <button
                onClick={handleToggleFavorite}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  favorited
                    ? "bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/40"
                    : "bg-amber-100/50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-amber-100"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${favorited ? "fill-amber-600 text-amber-600" : ""}`} />
                <span>{favorited ? "Saved" : "Save to Favorites"}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Report Button */}
              <button
                onClick={() => setReportModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report Lesson</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dedicated Author Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-amber-900/10 dark:border-zinc-800 shadow-lg flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-amber-600/30 flex-shrink-0">
              {lesson.creatorPhoto ? (
                <Image
                  src={lesson.creatorPhoto}
                  alt={lesson.creatorName || "Author"}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-amber-700 text-white flex items-center justify-center font-bold text-lg">
                  {lesson.creatorName?.[0] || "U"}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {lesson.creatorName || "Anonymous Creator"}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Life Lessons Contributor
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/profile"
            className="px-4 py-2 rounded-xl border border-amber-900/15 dark:border-zinc-700 text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-100/60 transition-colors"
          >
            View Author Profile
          </Link>
        </div>

        {/* Comment Section */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-amber-900/10 dark:border-zinc-800 shadow-lg space-y-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Reflections & Comments ({comments.length})
            </h3>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="flex gap-3">
            <input
              type="text"
              placeholder="Leave a thoughtful reflection on this lesson..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 px-4 py-3 rounded-2xl border border-amber-900/15 dark:border-zinc-700 bg-amber-50/20 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Post</span>
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4 pt-4 border-t border-amber-900/10 dark:border-zinc-800">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3.5 p-4 rounded-2xl bg-amber-50/30 dark:bg-zinc-800/40">
                <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-amber-900/10">
                  <Image src={c.userPhoto} alt={c.userName} fill className="object-cover" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {c.userName}
                    </span>
                    <span className="text-[11px] text-zinc-400">{c.createdAt}</span>
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {c.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Modal */}
        {reportModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-amber-900/10 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
              <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Report This Lesson
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Help us keep our community respectful and safe. Let us know what is wrong with this post.
              </p>

              {reportSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-sm font-semibold text-center">
                  Thank you! Your report has been submitted to moderators.
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Reason for report:
                    </label>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
                    >
                      <option value="Inappropriate Content">Inappropriate Content</option>
                      <option value="Misleading Information">Misleading Information</option>
                      <option value="Hate Speech or Harassment">Hate Speech or Harassment</option>
                      <option value="Spam or Advertising">Spam or Advertising</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setReportModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
                    >
                      Submit Report
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
