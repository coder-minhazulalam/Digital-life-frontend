"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Crown,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  MoreVertical,
  BookOpen,
  Calendar,
  Trash2,
  RefreshCw,
  AlertTriangle,
  UserCheck,
  UserX,
  ArrowRight,
  Shield,
} from "lucide-react";

export default function ManageUsersPage() {
  const { data: session } = useSession();
  const currentUser = session?.user ?? null;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (roleFilter !== "all") params.append("role", roleFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const res = await fetch(`${apiUrl}/admin/users?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: "Failed to load users list." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "admin") {
      fetchUsers();
    }
  }, [currentUser?.role, roleFilter, statusFilter]);

  // Handle Search submit / debounce
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  // Toggle user role
  const handleRoleToggle = async (targetUser) => {
    const newRole = targetUser.role === "admin" ? "user" : "admin";
    const userId = targetUser._id || targetUser.id;

    if (currentUser?.email === targetUser.email && newRole === "user") {
      setFeedback({
        type: "error",
        message: "You cannot remove your own admin privileges.",
      });
      return;
    }

    try {
      setActionLoadingId(userId);
      setFeedback(null);
      const res = await fetch(`${apiUrl}/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update role");

      setUsers((prev) =>
        prev.map((u) => ((u._id || u.id) === userId ? { ...u, role: newRole } : u))
      );
      setFeedback({
        type: "success",
        message: `Successfully changed role of ${targetUser.name || targetUser.email} to ${newRole}.`,
      });
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Error updating role." });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Toggle premium status
  const handlePremiumToggle = async (targetUser) => {
    const newPremium = !targetUser.isPremium;
    const userId = targetUser._id || targetUser.id;

    try {
      setActionLoadingId(userId);
      setFeedback(null);
      const res = await fetch(`${apiUrl}/admin/users/${userId}/premium`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPremium: newPremium }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update premium status");

      setUsers((prev) =>
        prev.map((u) => ((u._id || u.id) === userId ? { ...u, isPremium: newPremium } : u))
      );
      setFeedback({
        type: "success",
        message: `Updated ${targetUser.name || targetUser.email}'s membership to ${newPremium ? "Premium" : "Free"}.`,
      });
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Error updating membership." });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete user
  const handleDeleteUser = async (targetUser) => {
    const userId = targetUser._id || targetUser.id;

    if (currentUser?.email === targetUser.email) {
      setFeedback({
        type: "error",
        message: "You cannot delete your own admin account.",
      });
      setConfirmDeleteUser(null);
      return;
    }

    try {
      setActionLoadingId(userId);
      setFeedback(null);
      const res = await fetch(`${apiUrl}/admin/users/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete user");

      setUsers((prev) => prev.filter((u) => (u._id || u.id) !== userId));
      setFeedback({
        type: "success",
        message: `User ${targetUser.name || targetUser.email} was removed successfully.`,
      });
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Error deleting user." });
    } finally {
      setActionLoadingId(null);
      setConfirmDeleteUser(null);
    }
  };

  // Metrics summary
  const metrics = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === "admin").length;
    const premium = users.filter((u) => u.isPremium).length;
    const free = total - premium;
    return { total, admins, premium, free };
  }, [users]);

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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>User Management</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
            Manage Users
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm mt-0.5">
            View, search, assign administrative roles, and regulate platform memberships.
          </p>
        </div>

        <button
          onClick={fetchUsers}
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
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Users</p>
          <p className="text-xl sm:text-2xl font-serif font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
            {metrics.total}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Admins</p>
          <p className="text-xl sm:text-2xl font-serif font-extrabold text-purple-700 dark:text-purple-300 mt-1">
            {metrics.admins}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Premium</p>
          <p className="text-xl sm:text-2xl font-serif font-extrabold text-amber-700 dark:text-amber-300 mt-1">
            {metrics.premium}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Free Members</p>
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
            placeholder="Search by user name or email address..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-300 font-medium focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins Only</option>
            <option value="user">Regular Users</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-300 font-medium focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Memberships</option>
            <option value="premium">Premium Only</option>
            <option value="free">Free Members</option>
          </select>
        </div>
      </div>

      {/* ── Users Table & Responsive Card View ──────────────────────────── */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-zinc-500">Loading user accounts...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Users className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto" />
            <p className="font-semibold text-zinc-700 dark:text-zinc-300 text-sm">
              No users found
            </p>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              {search || roleFilter !== "all" || statusFilter !== "all"
                ? "Try clearing your search query or filter settings."
                : "No registered users in the database yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/75 dark:bg-zinc-800/40 text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 sm:px-6">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Membership</th>
                  <th className="py-3.5 px-4">Lessons</th>
                  <th className="py-3.5 px-4">Joined</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {users.map((u) => {
                  const userId = u._id || u.id;
                  const isCurrent = currentUser?.email === u.email;
                  const isActionLoading = actionLoadingId === userId;
                  const isAdmin = u.role === "admin";
                  const isPremium = Boolean(u.isPremium);

                  const joinDate = u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—";

                  return (
                    <tr
                      key={userId}
                      className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      {/* User Info */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-amber-100 dark:bg-zinc-800 ring-1 ring-zinc-200 dark:ring-zinc-700 flex-shrink-0">
                            {u.image || u.photoURL ? (
                              <Image
                                src={u.image || u.photoURL}
                                alt={u.name || "User"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-tr from-amber-700 to-amber-500 text-white flex items-center justify-center font-bold text-xs uppercase">
                                {u.name?.[0] || u.email?.[0] || "U"}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                {u.name || "Unnamed Member"}
                              </p>
                              {isCurrent && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-400 truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isAdmin
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 ring-1 ring-purple-200 dark:ring-purple-800"
                              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                          }`}
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>{isAdmin ? "Admin" : "User"}</span>
                        </span>
                      </td>

                      {/* Premium Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isPremium
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-800"
                              : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800/80 dark:text-zinc-400"
                          }`}
                        >
                          <Crown className="w-3 h-3" />
                          <span>{isPremium ? "Premium" : "Free"}</span>
                        </span>
                      </td>

                      {/* Lesson Count */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                          <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{u.lessonCount ?? 0}</span>
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-zinc-500 dark:text-zinc-400 text-[11px]">
                        {joinDate}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Role Toggle Button */}
                          <button
                            onClick={() => handleRoleToggle(u)}
                            disabled={isActionLoading || isCurrent}
                            title={
                              isCurrent
                                ? "You cannot modify your own role"
                                : isAdmin
                                ? "Demote to regular User"
                                : "Promote to Admin"
                            }
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all disabled:opacity-40 ${
                              isAdmin
                                ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 border border-purple-200 dark:border-purple-800"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200"
                            }`}
                          >
                            {isAdmin ? (
                              <>
                                <UserX className="w-3 h-3 text-purple-600" />
                                <span>Demote</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3 h-3 text-zinc-600" />
                                <span>Make Admin</span>
                              </>
                            )}
                          </button>

                          {/* Premium Toggle Button */}
                          <button
                            onClick={() => handlePremiumToggle(u)}
                            disabled={isActionLoading}
                            title={
                              isPremium
                                ? "Revoke Premium Membership"
                                : "Grant Free Lifetime Premium"
                            }
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all disabled:opacity-40 ${
                              isPremium
                                ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-800"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200"
                            }`}
                          >
                            <Crown className="w-3 h-3" />
                            <span>{isPremium ? "Revoke" : "Upgrade"}</span>
                          </button>

                          {/* Delete Action */}
                          {!isCurrent && (
                            <button
                              onClick={() => setConfirmDeleteUser(u)}
                              disabled={isActionLoading}
                              title="Delete user account"
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
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

      {/* ── Confirmation Modal for Deleting User ────────────────────────── */}
      {confirmDeleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Confirm User Deletion
              </h3>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Are you sure you want to permanently delete the user{" "}
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {confirmDeleteUser.name || confirmDeleteUser.email}
                </span>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteUser(confirmDeleteUser)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
