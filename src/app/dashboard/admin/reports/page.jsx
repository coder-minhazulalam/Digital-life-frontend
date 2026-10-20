"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  ExternalLink,
  Trash2,
  RefreshCw,
  Eye,
  Check,
  X,
  Clock,
  ArrowRight,
  Shield,
  FileWarning,
} from "lucide-react";

export default function ReportedLessonsPage() {
  const { data: session } = useSession();
  const currentUser = session?.user ?? null;

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }
  const [confirmDeleteLesson, setConfirmDeleteLesson] = useState(null);
  const [confirmDeleteReport, setConfirmDeleteReport] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (statusFilter !== "all") params.append("status", statusFilter);

      const res = await fetch(`${apiUrl}/admin/reports?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load reports");
      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: "Failed to load reports." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "admin") {
      fetchReports();
    }
  }, [currentUser?.role, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports();
  };

  // Update report status (resolved / dismissed)
  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      setActionLoadingId(reportId);
      setFeedback(null);
      const res = await fetch(`${apiUrl}/admin/reports/${reportId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");

      setReports((prev) =>
        prev.map((r) =>
          (r._id || r.id) === reportId ? { ...r, status: newStatus } : r
        )
      );
      setFeedback({
        type: "success",
        message: `Report marked as ${newStatus}.`,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message || "Error updating status.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete single report
  const handleDeleteReport = async (report) => {
    const reportId = report._id || report.id;

    try {
      setActionLoadingId(reportId);
      setFeedback(null);
      const res = await fetch(`${apiUrl}/admin/reports/${reportId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete report");

      setReports((prev) => prev.filter((r) => (r._id || r.id) !== reportId));
      setFeedback({
        type: "success",
        message: "Report record removed successfully.",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message || "Error deleting report.",
      });
    } finally {
      setActionLoadingId(null);
      setConfirmDeleteReport(null);
    }
  };

  // Delete offending lesson and resolve associated reports
  const handleDeleteOffendingLesson = async (report) => {
    try {
      setActionLoadingId(report._id || report.id);
      setFeedback(null);
      const res = await fetch(
        `${apiUrl}/admin/reports/lesson/${report.lessonId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete lesson");

      // Update local reports for this lesson
      setReports((prev) =>
        prev.map((r) =>
          r.lessonId === report.lessonId
            ? { ...r, status: "resolved", lessonExists: false }
            : r
        )
      );
      setFeedback({
        type: "success",
        message: `Offending lesson was deleted and related reports resolved.`,
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

  // Metrics summary
  const metrics = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter((r) => r.status === "pending").length;
    const resolved = reports.filter((r) => r.status === "resolved").length;
    const dismissed = reports.filter((r) => r.status === "dismissed").length;
    return { total, pending, resolved, dismissed };
  }, [reports]);

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
    <div className="space-y-6 w-full min-w-0 pb-12">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Content Moderation</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
            Reported Lessons
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm mt-0.5">
            Review user-submitted reports, resolve flagged content, and remove offending lessons.
          </p>
        </div>

        <button
          onClick={fetchReports}
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
          <p className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Pending Review
          </p>
          <p className="text-xl sm:text-2xl font-serif font-extrabold text-rose-700 dark:text-rose-300 mt-1">
            {metrics.pending}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Resolved
          </p>
          <p className="text-xl sm:text-2xl font-serif font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">
            {metrics.resolved}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Dismissed</p>
          <p className="text-xl sm:text-2xl font-serif font-extrabold text-zinc-600 dark:text-zinc-400 mt-1">
            {metrics.dismissed}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Reports</p>
          <p className="text-xl sm:text-2xl font-serif font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
            {metrics.total}
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
            placeholder="Search by lesson title, reporter, or reason..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </form>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-300 font-medium focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>
      </div>

      {/* ── Reports List ─────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden w-full min-w-0">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-zinc-500">Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <FileWarning className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto" />
            <p className="font-semibold text-zinc-700 dark:text-zinc-300 text-sm">
              No reports found
            </p>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              {search || statusFilter !== "all"
                ? "Try clearing your search query or status filter."
                : "No reported content on the platform. All clean!"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/75 dark:bg-zinc-800/40 text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 sm:px-6">Reported Lesson</th>
                  <th className="py-3.5 px-4">Reporter</th>
                  <th className="py-3.5 px-4">Reason / Complaint</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Reported On</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {reports.map((r) => {
                  const reportId = r._id || r.id;
                  const isActionLoading = actionLoadingId === reportId;
                  const isPending = r.status === "pending";
                  const isResolved = r.status === "resolved";
                  const isDismissed = r.status === "dismissed";

                  const formattedDate = r.timestamp
                    ? new Date(r.timestamp).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—";

                  return (
                    <tr
                      key={reportId}
                      className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      {/* Reported Lesson */}
                      <td className="py-3.5 px-4 sm:px-6 max-w-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            {r.lessonExists ? (
                              <Link
                                href={`/lessons/${r.lessonId}`}
                                target="_blank"
                                className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-amber-700 transition-colors line-clamp-1 group inline-flex items-center gap-1"
                              >
                                <span>{r.lessonTitle || "Untitled Lesson"}</span>
                                <ExternalLink className="w-3 h-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                              </Link>
                            ) : (
                              <div className="inline-flex items-center gap-1.5">
                                <span className="font-bold text-zinc-500 line-clamp-1 line-through">
                                  {r.lessonTitle || "Deleted Lesson"}
                                </span>
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                                  Deleted
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400">ID: {r.lessonId}</p>
                        </div>
                      </td>

                      {/* Reporter */}
                      <td className="py-3.5 px-4">
                        <p className="text-zinc-800 dark:text-zinc-200 font-medium truncate max-w-[150px]">
                          {r.reporterEmail}
                        </p>
                      </td>

                      {/* Reason */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60">
                          <p className="text-zinc-700 dark:text-zinc-300 text-xs italic leading-relaxed line-clamp-2">
                            &ldquo;{r.reason}&rdquo;
                          </p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isPending
                              ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 ring-1 ring-rose-200 dark:ring-rose-800 animate-pulse"
                              : isResolved
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 ring-1 ring-emerald-200 dark:ring-emerald-800"
                              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                          }`}
                        >
                          {isPending && <AlertTriangle className="w-3 h-3" />}
                          {isResolved && <Check className="w-3 h-3" />}
                          {isDismissed && <X className="w-3 h-3" />}
                          <span className="capitalize">{r.status || "Pending"}</span>
                        </span>
                      </td>

                      {/* Reported On */}
                      <td className="py-3.5 px-4 text-zinc-500 dark:text-zinc-400 text-[11px] whitespace-nowrap">
                        {formattedDate}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Resolve Button */}
                          {!isResolved && (
                            <button
                              onClick={() => handleUpdateStatus(reportId, "resolved")}
                              disabled={isActionLoading}
                              title="Mark report as resolved"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 transition-colors disabled:opacity-40"
                            >
                              <Check className="w-3 h-3" />
                              <span>Resolve</span>
                            </button>
                          )}

                          {/* Dismiss Button */}
                          {!isDismissed && (
                            <button
                              onClick={() => handleUpdateStatus(reportId, "dismissed")}
                              disabled={isActionLoading}
                              title="Dismiss report as invalid"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 transition-colors disabled:opacity-40"
                            >
                              <X className="w-3 h-3" />
                              <span>Dismiss</span>
                            </button>
                          )}

                          {/* Delete Lesson Button */}
                          {r.lessonExists && (
                            <button
                              onClick={() => setConfirmDeleteLesson(r)}
                              disabled={isActionLoading}
                              title="Delete offending lesson permanently"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 transition-colors disabled:opacity-40"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete Lesson</span>
                            </button>
                          )}

                          {/* Delete Report Record Button */}
                          <button
                            onClick={() => setConfirmDeleteReport(r)}
                            disabled={isActionLoading}
                            title="Remove report record"
                            className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 transition-colors"
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

      {/* ── Confirmation Modal: Delete Lesson ───────────────────────────── */}
      {confirmDeleteLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Delete Offending Lesson?
              </h3>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                This will permanently delete the lesson{" "}
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  &ldquo;{confirmDeleteLesson.lessonTitle}&rdquo;
                </span>{" "}
                from the platform and automatically mark all reports for this lesson as resolved.
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
                onClick={() => handleDeleteOffendingLesson(confirmDeleteLesson)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                Delete Offending Lesson
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirmation Modal: Delete Report Record ─────────────────────── */}
      {confirmDeleteReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Remove Report Record?
              </h3>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Are you sure you want to remove this report record from the moderation log? The lesson itself will not be deleted.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteReport(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteReport(confirmDeleteReport)}
                className="px-4 py-2 rounded-xl bg-zinc-800 dark:bg-zinc-700 hover:bg-zinc-900 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                Remove Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
