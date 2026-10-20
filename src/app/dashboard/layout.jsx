"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  User,
  PlusCircle,
  BookOpen,
  Bookmark,
  Users,
  ShieldAlert,
  Crown,
  LogOut,
  Menu,
  X,
  Compass,
  LayoutDashboard,
  Layers,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: session } = useSession();
  const user = session?.user ?? null;
  const isAdmin = user?.role === "admin";
  const isPremium = user?.isPremium === true;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  const userNavLinks = [
    {
      name: "My Profile",
      href: "/dashboard/profile",
      icon: User,
      description: "Manage your personal info",
    },
    {
      name: "Add Lesson",
      href: "/dashboard/add-lesson",
      icon: PlusCircle,
      description: "Write and share a story",
    },
    {
      name: "My Lessons",
      href: "/dashboard/my-lessons",
      icon: Layers,
      description: "Manage created lessons",
    },
    {
      name: "Saved Lessons",
      href: "/dashboard/saved-lessons",
      icon: Bookmark,
      description: "Bookmarked life insights",
    },
  ];

  const adminNavLinks = [
    {
      name: "Admin Overview",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
      description: "Platform analytics",
    },
    {
      name: "Manage Users",
      href: "/dashboard/admin/users",
      icon: Users,
      description: "Roles & permissions",
    },
    {
      name: "Manage Lessons",
      href: "/dashboard/admin/lessons",
      icon: BookOpen,
      description: "Review & feature lessons",
    },
    {
      name: "Reported Lessons",
      href: "/dashboard/admin/reports",
      icon: ShieldAlert,
      description: "Review flagged content",
    },
  ];

  const userPhoto = user?.image || user?.photoURL;

  return (
    <div className="min-h-screen bg-stone-50/60 dark:bg-zinc-950 flex flex-col md:flex-row w-full max-w-full overflow-x-hidden">
      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-amber-900/10 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo_central.jpg"
            alt="Brand Logo"
            width={32}
            height={32}
            className="w-8 h-8 object-cover rounded-lg"
          />
          <span className="font-serif font-bold text-base text-amber-950 dark:text-amber-100">
            Digital Life
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-amber-100/60 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Toggle dashboard menu"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-white dark:bg-zinc-900 border-r border-amber-950/10 dark:border-zinc-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-5 flex-1 overflow-y-auto">
          {/* Brand header */}
          <div className="pb-5 mb-5 border-b border-zinc-100 dark:border-zinc-800">
            <Link
              href="/"
              className="flex items-center gap-3 group"
              onClick={() => setSidebarOpen(false)}
            >

              <div>
          
                <span className="text-[24px] font-medium text-amber-800/70 dark:text-amber-400/70 flex items-center gap-1">
                  <LayoutDashboard className="w-3 h-3  text-amber-200" /> Dashboard
                </span>
              </div>
            </Link>
          </div>

          {/* User Nav Section */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-semibold tracking-wider uppercase text-zinc-400 dark:text-zinc-500 mb-2">
              User Space
            </p>
            {userNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href === "/dashboard/profile" && pathname === "/dashboard");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-amber-600 text-white shadow-sm shadow-amber-600/20 font-semibold"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-amber-50 dark:hover:bg-zinc-800/60 hover:text-amber-800 dark:hover:text-amber-300"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1">{link.name}</span>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-75" />}
                </Link>
              );
            })}
          </div>

          {/* Admin Space (Only if user has role: admin) */}
          {isAdmin && (
            <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800 space-y-1">
              <div className="px-3 flex items-center justify-between mb-2">
                <p className="text-[11px] font-semibold tracking-wider uppercase text-amber-800 dark:text-amber-400">
                  Admin Panel
                </p>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  ADMIN
                </span>
              </div>
              {adminNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-amber-700 text-white shadow-sm shadow-amber-700/20 font-semibold"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-amber-50 dark:hover:bg-zinc-800/60 hover:text-amber-800 dark:hover:text-amber-300"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                    <span className="flex-1">{link.name}</span>
                    {isActive && <ChevronRight className="w-4 h-4 opacity-75" />}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Public shortcut */}
          <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800">
            <Link
              href="/lessons"
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-amber-800 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <Compass className="w-4 h-4 text-zinc-400" />
              <span>Browse Public Lessons</span>
            </Link>
          </div>
        </div>

        {/* User Mini Profile Card at Bottom */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-amber-50/40 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-amber-500/30 flex-shrink-0 bg-amber-700 text-white flex items-center justify-center font-bold text-sm">
              {userPhoto ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={userPhoto}
                  alt={user?.name || "User Avatar"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{user?.name?.charAt(0) || "U"}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {user?.name || "Learner"}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Badges & Actions */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              {isPremium ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-xs">
                  <Crown className="w-3 h-3" /> Premium
                </span>
              ) : (
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-zinc-800 text-amber-800 dark:text-amber-300 hover:bg-amber-200 transition-colors"
                >
                  <Sparkles className="w-3 h-3" /> Upgrade
                </Link>
              )}
              {isAdmin && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  Admin
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 w-full max-w-full overflow-x-auto">
        <div className="max-w-7xl mx-auto w-full min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}
