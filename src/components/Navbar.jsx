"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  PlusCircle,
  BookOpen,
  Sparkles,
  Crown,
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
  Compass,
  Loader2,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Real session from Better Auth
  const { data: session, isPending } = useSession();
  const user = session?.user ?? null;
  // role comes from session metadata; Better Auth stores it in user.role
  // isPremium stored as user.isPremium in the DB
  const isAdmin = user?.role === "admin";
  const isPremium = user?.isPremium === true;

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    await signOut();
    router.push("/");
    router.refresh();
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/", icon: Compass },
    { name: "Public Lessons", href: "/lessons", icon: BookOpen },
    ...(user
      ? [
          { name: "My Lessons", href: "/dashboard/my-lessons", icon: Sparkles },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-900/10 bg-amber-50/90 dark:bg-zinc-950/85 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-12 h-12 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/assets/digital_life_lessons_brand_emblem.png"
                alt="Digital Life Lessons Emblem"
                width={48}
                height={48}
                priority
                className="w-full h-full object-contain drop-shadow-sm"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-amber-950 dark:text-amber-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                Digital Life Lessons
              </span>
              <span className="text-[11px] font-sans tracking-widest uppercase text-amber-800/70 dark:text-amber-400/70 font-medium">
                Preserve & Share Wisdom
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-amber-600 text-white shadow-sm shadow-amber-600/30"
                      : "text-zinc-700 dark:text-zinc-300 hover:text-amber-800 dark:hover:text-amber-300 hover:bg-amber-100/60 dark:hover:bg-zinc-900"
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-80" />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {/* Pricing / Upgrade Link or Premium Badge */}
            {user && (
              <>
                {!isPremium ? (
                  <Link
                    href="/pricing"
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      pathname === "/pricing"
                        ? "bg-amber-600 text-white shadow-sm"
                        : "text-amber-800 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20"
                    }`}
                  >
                    <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Pricing / Upgrade</span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-sm shadow-amber-500/20">
                    <Crown className="w-3.5 h-3.5" />
                    <span>Premium ⭐</span>
                  </div>
                )}
              </>
            )}
          </nav>

          {/* Right Section: Auth buttons / User Avatar */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
            ) : !user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-full hover:ring-2 hover:ring-amber-500/40 transition-all duration-200 focus:outline-none"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-amber-600/30">
                    {(user.image || user.photoURL) ? (
                      <Image
                        src={user.image || user.photoURL}
                        alt={user.name || "User avatar"}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-amber-700 flex items-center justify-center text-white text-sm font-semibold">
                        {user.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-zinc-600 dark:text-zinc-400 transition-transform duration-200 ${userDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200/80 dark:border-zinc-800 py-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                    <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/80">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                        {user.email}
                      </p>
                      <div className="mt-1.5">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${isPremium ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"}`}>
                          {isPremium ? "⭐ Premium Plan" : "Free Plan"}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-amber-50 dark:hover:bg-zinc-800/60 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                      >
                        <User className="w-4 h-4 opacity-70" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        href="/dashboard/my-lessons"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-amber-50 dark:hover:bg-zinc-800/60 hover:text-amber-700 dark:hover:text-amber-300 transition-colors font-medium"
                      >
                        <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>My Lessons</span>
                      </Link>
                      <Link
                        href="/dashboard/add-lesson"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-amber-50 dark:hover:bg-zinc-800/60 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                      >
                        <PlusCircle className="w-4 h-4 opacity-70" />
                        <span>Add Lesson</span>
                      </Link>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-amber-50 dark:hover:bg-zinc-800/60 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 opacity-70" />
                        <span>Dashboard</span>
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          href="/dashboard/admin"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-zinc-800/60 transition-colors font-medium"
                        >
                          <Crown className="w-4 h-4 opacity-70" />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-1">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      >
                        <LogOut className="w-4 h-4 opacity-70" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-amber-100/60 dark:hover:bg-zinc-900 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-amber-900/10 bg-amber-50/98 dark:bg-zinc-950/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? "bg-amber-600 text-white"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-amber-100/70 dark:hover:bg-zinc-900"
                }`}
              >
                <Icon className="w-5 h-5 opacity-80" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          {user && !isPremium && (
            <Link
              href="/pricing"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-medium text-amber-800 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20"
            >
              <Crown className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>Pricing / Upgrade</span>
            </Link>
          )}

          {user && isPremium && (
            <div className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-amber-800 dark:text-amber-300">
              <Crown className="w-4 h-4 text-amber-500" />
              <span>Active Plan: Premium ⭐</span>
            </div>
          )}

          <div className="pt-3 border-t border-amber-900/10 dark:border-zinc-800 space-y-2">
            {!user ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  className="w-full text-center py-2.5 rounded-xl text-sm font-medium border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="w-full text-center py-2.5 rounded-xl text-sm font-semibold bg-amber-700 text-white"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-amber-100/60 dark:hover:bg-zinc-900"
                >
                  <User className="w-4 h-4 opacity-70" />
                  <span>My Profile</span>
                </Link>
                <Link
                  href="/dashboard/my-lessons"
                  className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-amber-100/60 dark:hover:bg-zinc-900"
                >
                  <Sparkles className="w-4 h-4 opacity-70" />
                  <span>My Lessons</span>
                </Link>
                <Link
                  href="/dashboard/add-lesson"
                  className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-amber-100/60 dark:hover:bg-zinc-900"
                >
                  <PlusCircle className="w-4 h-4 opacity-70" />
                  <span>Add Lesson</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-amber-100/60 dark:hover:bg-zinc-900"
                >
                  <LayoutDashboard className="w-4 h-4 opacity-70" />
                  <span>Dashboard</span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  <LogOut className="w-4 h-4 opacity-70" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
