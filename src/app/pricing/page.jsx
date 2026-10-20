"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  Check,
  Crown,
  Sparkles,
  Zap,
  BookOpen,
  Shield,
  Star,
  Users,
  Bookmark,
  Heart,
  ArrowRight,
  Loader2,
  BadgeCheck,
  Lock,
  Globe,
  Infinity,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const FREE_FEATURES = [
  { icon: BookOpen, text: "Read all Free-tier life lessons" },
  { icon: Globe, text: "Browse all public lesson categories" },
  { icon: Heart, text: "Like and appreciate lessons" },
  { icon: Bookmark, text: "Save up to 10 lessons to your list" },
  { icon: Sparkles, text: "Share up to 5 life lessons publicly" },
  { icon: Users, text: "Join the community of wisdom-sharers" },
];

const PREMIUM_FEATURES = [
  { icon: Crown, text: "Unlimited access to all Premium lessons", highlight: true },
  { icon: Infinity, text: "Save unlimited lessons to your library", highlight: true },
  { icon: Sparkles, text: "Share unlimited life lessons publicly", highlight: true },
  { icon: Star, text: "Get a ⭐ Premium badge on your profile", highlight: true },
  { icon: BookOpen, text: "Everything in Free plan" },
  { icon: Globe, text: "Browse all public lesson categories" },
  { icon: Heart, text: "Like and appreciate lessons" },
  { icon: Shield, text: "Priority support and early features" },
];

const FAQS = [
  {
    q: "What is a Premium Lesson?",
    a: "Premium lessons are exclusive life stories, experiences, and wisdom marked as 'Premium' by their authors. These are often deeply personal, research-backed, or highly curated insights that go beyond ordinary content.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Since this is a demonstration platform, Premium access is a one-time unlock for your account. In a real-world scenario, you would be able to cancel and manage billing at any time.",
  },
  {
    q: "Is there a free trial?",
    a: "The Free plan lets you explore the platform and access all free-tier content indefinitely. You can upgrade to Premium whenever you feel ready to access exclusive content.",
  },
  {
    q: "How does the mock payment work?",
    a: "Clicking 'Upgrade to Premium' instantly upgrades your account status to Premium without any actual payment gateway. Your profile will show a Premium badge and you can access all premium content immediately.",
  },
];

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam =
    searchParams.get("redirect") ||
    (searchParams.get("lessonId") ? `/lessons/${searchParams.get("lessonId")}` : null);

  const { data: session, isPending, refetch } = useSession();
  const user = session?.user ?? null;
  const isPremium = user?.isPremium === true;

  const [isUpgrading, setIsUpgrading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // If already premium and visiting with a lesson redirect, take them straight to it
  useEffect(() => {
    if (isPremium && redirectParam) {
      toast.success("You are a Premium member! Taking you to your lesson...");
      router.replace(redirectParam);
    }
  }, [isPremium, redirectParam, router]);

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("Please sign in to upgrade your account");
      const loginCallback = redirectParam ? `/pricing?redirect=${encodeURIComponent(redirectParam)}` : "/pricing";
      router.push(`/login?callbackUrl=${encodeURIComponent(loginCallback)}`);
      return;
    }

    if (isPremium) {
      if (redirectParam) {
        router.push(redirectParam);
      } else {
        toast("You are already a Premium member! 🌟");
      }
      return;
    }

    setIsUpgrading(true);

    // Simulate a brief loading state for realism
    await new Promise((res) => setTimeout(res, 1000));

    try {
      const response = await fetch(`${apiUrl}/users/upgrade-premium`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to upgrade account");
      }

      setShowSuccess(true);

      // Force session refresh so isPremium is up to date everywhere
      if (typeof refetch === "function") {
        await refetch();
      }

      if (redirectParam) {
        toast.success("🎉 Welcome to Premium! Taking you directly to your lesson...");
        setTimeout(() => {
          router.push(redirectParam);
        }, 1200);
      } else {
        toast.success("🎉 Welcome to Premium! Your account has been upgraded.");
      }
    } catch (err) {
      console.error("Upgrade error:", err);
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100/40 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Hero / Header Section */}
      <section className="relative overflow-hidden pt-16 pb-10 px-4 text-center">
        {/* Decorative background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-amber-400/10 dark:bg-amber-600/8 blur-3xl" />
          <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-rose-400/8 blur-2xl" />
          <div className="absolute bottom-0 left-5 w-56 h-32 rounded-full bg-amber-300/10 blur-2xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-sm font-semibold border border-amber-200 dark:border-amber-800/60">
            <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Simple, Honest Pricing</span>
          </div>

          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
            Invest in Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-500 to-yellow-500 dark:from-amber-400 dark:via-amber-300 dark:to-yellow-400">
              Growth & Wisdom
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Every life holds invaluable lessons. Start free and upgrade when you&apos;re ready to unlock the full depth of human wisdom shared on this platform.
          </p>

          {redirectParam && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-medium animate-in fade-in">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Upgrading to unlock your selected lesson. You&apos;ll be directed straight to it upon activation.</span>
            </div>
          )}

          {isPremium && (
            <div className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold shadow-lg shadow-amber-500/25">
              <BadgeCheck className="w-5 h-5" />
              <span>You&apos;re already a Premium Member 🌟</span>
            </div>
          )}
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        {/* Success Banner */}
        {showSuccess && (
          <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center shadow-xl shadow-emerald-500/20 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="font-serif text-2xl font-bold">Welcome to Premium!</h3>
            <p className="mt-1 opacity-90">
              {redirectParam
                ? "Your account has been upgraded! Taking you directly to your lesson now..."
                : "Your account has been successfully upgraded. Enjoy unlimited access to all premium life lessons."}
            </p>
            {redirectParam && (
              <div className="mt-4">
                <Link
                  href={redirectParam}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-sm shadow hover:bg-emerald-50 transition-all"
                >
                  <span>Go to Lesson Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* FREE PLAN CARD */}
          <div className="relative flex flex-col p-8 rounded-3xl bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 shadow-lg shadow-zinc-100/60 dark:shadow-zinc-950/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Free Plan
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  For curious explorers
                </p>
              </div>
            </div>

            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl font-bold font-serif text-zinc-900 dark:text-zinc-100">
                $0
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400 pb-2">/ forever</span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
              No credit card required. Get started immediately.
            </p>

            <ul className="space-y-3.5 flex-1">
              {FREE_FEATURES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <div className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              {!user ? (
                <Link
                  href="/register"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold border-2 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : !isPremium ? (
                <div className="w-full py-3.5 rounded-2xl text-sm font-semibold text-center bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 cursor-default">
                  ✓ Your current plan
                </div>
              ) : (
                <div className="w-full py-3.5 rounded-2xl text-sm font-semibold text-center bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 cursor-default">
                  Included in Premium
                </div>
              )}
            </div>
          </div>

          {/* PREMIUM PLAN CARD */}
          <div className="relative flex flex-col p-8 rounded-3xl border-2 border-amber-500 dark:border-amber-600 shadow-2xl shadow-amber-500/15 dark:shadow-amber-600/10 overflow-hidden"
            style={{
              background: "linear-gradient(145deg, #fffbf2 0%, #fef9e7 40%, #fdf5d3 100%)",
            }}>
            {/* Dark mode override */}
            <style jsx>{`
              @media (prefers-color-scheme: dark) {
                .premium-card {
                  background: linear-gradient(145deg, #18181b 0%, #1c1917 40%, #1a1108 100%);
                }
              }
            `}</style>
            <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900 dark:to-amber-950/30 pointer-events-none" />

            {/* Most Popular Badge */}
            <div className="absolute top-0 right-0 left-0 flex justify-center">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-b-2xl bg-gradient-to-r from-amber-600 to-yellow-500 text-white text-xs font-bold shadow-sm shadow-amber-500/30 tracking-wider uppercase">
                <Star className="w-3 h-3 fill-current" />
                Most Popular
              </div>
            </div>

            <div className="relative flex items-center gap-3 mb-6 mt-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-md shadow-amber-500/30">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Premium Plan
                </h2>
                <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                  For committed wisdom seekers
                </p>
              </div>
            </div>

            <div className="relative flex items-end gap-2 mb-2">
              <span className="text-5xl font-bold font-serif text-zinc-900 dark:text-zinc-100">
                $4.99
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400 pb-2">/ one-time</span>
            </div>
            <p className="relative text-sm text-amber-800 dark:text-amber-400 font-medium mb-8">
              🎯 Lifetime access — pay once, keep forever.
            </p>

            <ul className="relative space-y-3.5 flex-1">
              {PREMIUM_FEATURES.map(({ icon: Icon, text, highlight }) => (
                <li key={text} className={`flex items-center gap-3 text-sm ${highlight ? "text-amber-900 dark:text-amber-200 font-semibold" : "text-zinc-700 dark:text-zinc-300"}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${highlight ? "bg-amber-500 shadow-sm shadow-amber-500/40" : "bg-amber-100 dark:bg-amber-950/60"}`}>
                    <Check className={`w-3 h-3 ${highlight ? "text-white" : "text-amber-700 dark:text-amber-400"}`} />
                  </div>
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <div className="relative mt-8">
              {isPremium ? (
                <div className="w-full py-3.5 rounded-2xl text-sm font-bold text-center bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-500/30 cursor-default flex items-center justify-center gap-2">
                  <BadgeCheck className="w-4 h-4" />
                  <span>You are Premium ⭐</span>
                </div>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={isUpgrading || isPending}
                  className="relative w-full py-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 hover:from-amber-800 hover:via-amber-700 hover:to-yellow-700 text-white shadow-xl shadow-amber-600/30 hover:shadow-amber-600/50 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <div className="relative flex items-center justify-center gap-2">
                    {isUpgrading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Activating Premium...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>
                          {!user ? "Sign In to Upgrade" : "Upgrade to Premium — $4.99"}
                        </span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              )}

              <p className="mt-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
                {isPremium
                  ? "Enjoy your lifetime Premium access 🎉"
                  : "No actual payment is processed on this demo platform"}
              </p>
            </div>
          </div>
        </div>

        {/* Social Proof / Trust indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-center">
          {[
            { label: "Life Lessons Shared", value: "1,200+" },
            { label: "Active Community Members", value: "3,500+" },
            { label: "Premium Wisdom Pieces", value: "450+" },
            { label: "Countries Represented", value: "40+" },
          ].map(({ label, value }) => (
            <div key={label} className="min-w-[120px]">
              <div className="text-2xl font-serif font-bold text-amber-700 dark:text-amber-400">
                {value}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <h2 className="font-serif text-3xl font-bold text-center text-zinc-900 dark:text-zinc-100 mb-8">
          Feature Comparison
        </h2>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-amber-900/10 dark:border-zinc-800 shadow-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="text-left px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                  Features
                </th>
                <th className="px-6 py-4 text-center font-semibold text-zinc-500 dark:text-zinc-400">
                  Free
                </th>
                <th className="px-6 py-4 text-center font-semibold text-amber-700 dark:text-amber-400">
                  Premium ⭐
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/80">
              {[
                { feature: "Browse all public lessons", free: true, premium: true },
                { feature: "Like & react to lessons", free: true, premium: true },
                { feature: "Save lessons to library", free: "Up to 10", premium: "Unlimited" },
                { feature: "Post life lessons", free: "Up to 5", premium: "Unlimited" },
                { feature: "Access Premium-tier lessons", free: false, premium: true },
                { feature: "Premium profile badge ⭐", free: false, premium: true },
                { feature: "Priority support", free: false, premium: true },
              ].map(({ feature, free, premium }) => (
                <tr key={feature} className="hover:bg-stone-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">{feature}</td>
                  <td className="px-6 py-4 text-center">
                    {free === true ? (
                      <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                    ) : free === false ? (
                      <span className="text-zinc-300 dark:text-zinc-600 text-xl">—</span>
                    ) : (
                      <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                        {free}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {premium === true ? (
                      <Check className="w-5 h-5 text-amber-500 mx-auto" />
                    ) : (
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                        {premium}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-2xl mx-auto px-4 pb-20">
        <h2 className="font-serif text-3xl font-bold text-center text-zinc-900 dark:text-zinc-100 mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-stone-50 dark:hover:bg-zinc-800/60 transition-colors"
              >
                <span>{item.q}</span>
                {openFaq === i ? (
                  <ChevronUp className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                )}
              </button>

              {openFaq === i && (
                <div className="px-6 pb-5 pt-1 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-50 dark:border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-150">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="max-w-3xl mx-auto px-4 pb-20 text-center">
        <div className="relative p-10 rounded-3xl overflow-hidden bg-gradient-to-br from-amber-700 via-amber-600 to-yellow-600 text-white shadow-2xl shadow-amber-600/25">
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 blur-xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5 blur-xl" />

          <div className="relative z-10 space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-sm font-semibold">
              <Crown className="w-4 h-4" />
              <span>Ready to go deeper?</span>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl font-bold">
              Start Your Wisdom Journey Today
            </h2>

            <p className="text-amber-100 text-sm md:text-base max-w-md mx-auto leading-relaxed">
              Access hundreds of premium, deeply personal life lessons from people who&apos;ve navigated the full range of human experience.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {isPremium ? (
                <Link
                  href="/lessons"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-sm bg-white text-amber-800 hover:bg-amber-50 shadow-lg transition-all hover:scale-[1.02]"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Browse Premium Lessons</span>
                </Link>
              ) : (
                <>
                  <button
                    onClick={handleUpgrade}
                    disabled={isUpgrading || isPending}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-sm bg-white text-amber-800 hover:bg-amber-50 shadow-lg disabled:opacity-60 transition-all hover:scale-[1.02]"
                  >
                    {isUpgrading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                    <span>{isUpgrading ? "Activating..." : "Upgrade to Premium"}</span>
                  </button>
                  <Link
                    href="/lessons"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-sm border border-white/40 text-white hover:bg-white/10 transition-all"
                  >
                    <span>Explore Free Lessons</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-amber-50/20 dark:bg-zinc-950">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  );
}
