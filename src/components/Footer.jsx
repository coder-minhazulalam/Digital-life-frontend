"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Heart,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import {
  FaGithub,
  FaLinkedinIn,
  FaFacebookF,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // New X logo as explicitly required

export default function Footer() {
  return (
    <footer className="border-t border-amber-900/10 bg-amber-950 text-amber-100/90 dark:bg-black dark:border-zinc-800 transition-colors">
      {/* Top Pre-Footer Newsletter & Inspiration Bar */}
      <div className="border-b border-amber-900/40 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Weekly Wisdom Dispatch</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Get transformative life reflections delivered weekly.
              </h3>
              <p className="text-sm text-amber-200/70 max-w-xl">
                Join over 10,000+ mindful readers receiving curated insights on emotional resilience, career mindset, and personal growth.
              </p>
            </div>

            <div className="lg:col-span-5">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  className="flex-1 px-4 py-3.5 rounded-2xl bg-amber-900/40 border border-amber-800/60 text-white placeholder:text-amber-300/40 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                  required
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-all shadow-md hover:scale-105 flex-shrink-0 cursor-pointer"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand Info & Mission */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative w-12 h-12 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo_central.jpg"
                  alt="Digital Life Lessons"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover rounded-xl drop-shadow-md"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  Digital Life Lessons
                </span>
                <span className="text-[11px] font-sans tracking-widest uppercase text-amber-400/80 font-medium">
                  Preserve & Share Wisdom
                </span>
              </div>
            </Link>

            <p className="text-sm text-amber-200/70 leading-relaxed">
              A sacred platform for thoughtful people to write, organize, and cherish personal growth insights, life realizations, and community wisdom before time fades them away.
            </p>

            {/* Social Media Links (Using new X logo) */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-amber-900/40 hover:bg-amber-500 hover:text-zinc-950 text-amber-200 flex items-center justify-center transition-all duration-200 shadow-sm"
                aria-label="X (formerly Twitter)"
              >
                <FaXTwitter className="w-4 h-4" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-amber-900/40 hover:bg-amber-500 hover:text-zinc-950 text-amber-200 flex items-center justify-center transition-all duration-200 shadow-sm"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-amber-900/40 hover:bg-amber-500 hover:text-zinc-950 text-amber-200 flex items-center justify-center transition-all duration-200 shadow-sm"
                aria-label="GitHub"
              >
                <FaGithub className="w-4 h-4" />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-amber-900/40 hover:bg-amber-500 hover:text-zinc-950 text-amber-200 flex items-center justify-center transition-all duration-200 shadow-sm"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif text-base font-bold text-white tracking-wide">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-amber-200/70">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link href="/lessons" className="hover:text-amber-400 transition-colors">
                  Public Wisdom
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-amber-400 transition-colors">
                  Pricing & Upgrade
                </Link>
              </li>
              <li>
                <Link href="/dashboard/add-lesson" className="hover:text-amber-400 transition-colors">
                  Share a Lesson
                </Link>
              </li>
              <li>
                <Link href="/dashboard/my-favorites" className="hover:text-amber-400 transition-colors">
                  Saved Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Wisdom Categories */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-base font-bold text-white tracking-wide">
              Wisdom Pillars
            </h4>
            <ul className="space-y-2.5 text-sm text-amber-200/70">
              <li>
                <Link href="/lessons?category=Personal+Growth" className="hover:text-amber-400 transition-colors">
                  Personal Growth
                </Link>
              </li>
              <li>
                <Link href="/lessons?category=Career" className="hover:text-amber-400 transition-colors">
                  Career & Calling
                </Link>
              </li>
              <li>
                <Link href="/lessons?category=Relationships" className="hover:text-amber-400 transition-colors">
                  Relationships & Heart
                </Link>
              </li>
              <li>
                <Link href="/lessons?category=Mindset" className="hover:text-amber-400 transition-colors">
                  Mindset & Mental Peace
                </Link>
              </li>
              <li>
                <Link href="/lessons?category=Mistakes+Learned" className="hover:text-amber-400 transition-colors">
                  Mistakes Learned
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-base font-bold text-white tracking-wide">
              Contact & Support
            </h4>
            <div className="space-y-3 text-sm text-amber-200/70">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>Chittagong , Bangladesh</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <a
                  href="mailto:minhazulalam409@gmail.com"
                  className="hover:text-amber-400 transition-colors"
                >
                  minhazulalam409@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>+880 1800-000000</span>
              </div>
              <div className="pt-2 flex items-center gap-2 text-xs text-amber-400/90 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>SSL Encrypted & Safe Platform</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal, Terms & Copyright Row */}
        <div className="mt-16 pt-8 border-t border-amber-900/40 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-amber-300/60">
          <p>© {new Date().getFullYear()} Digital Life Lessons. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-amber-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:text-amber-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/guidelines" className="hover:text-amber-300 transition-colors">
              Community Guidelines
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
