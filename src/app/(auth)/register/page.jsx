"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
  User,
  BookOpen,
  Image as ImageIcon,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp.email({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        image: form.photoURL.trim() || undefined,
        photoURL: form.photoURL.trim() || undefined,
      });
      if (error) {
        toast.error(error.message || "Registration failed. Try again.");
      } else {
        toast.success("Account created! Welcome aboard 🎉");
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      console.error(err);
      toast.error("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: "Too short", color: "bg-red-400", w: "w-1/4" };
    if (p.length < 8) return { label: "Weak", color: "bg-orange-400", w: "w-2/4" };
    if (!/[A-Z]/.test(p) || !/[0-9]/.test(p))
      return { label: "Fair", color: "bg-yellow-400", w: "w-3/4" };
    return { label: "Strong", color: "bg-green-500", w: "w-full" };
  };

  const strength = passwordStrength();

  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm rounded-3xl shadow-xl shadow-amber-900/8 dark:shadow-black/40 border border-amber-100 dark:border-zinc-800 p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 mb-4">
            <BookOpen className="w-7 h-7 text-amber-700 dark:text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-amber-950 dark:text-zinc-100">
            Join the Community
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Start sharing your life lessons today
          </p>
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-sm font-semibold shadow-xs hover:shadow-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mb-5"
        >
          {googleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
          ) : (
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>Sign up with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white dark:bg-zinc-900 px-3 text-zinc-400">
              Or sign up with email
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Full Name <span className="text-amber-700">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/60 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Email Address <span className="text-amber-700">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/60 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 transition-all"
              />
            </div>
          </div>

          {/* Photo URL (Optional) */}
          <div className="space-y-1.5">
            <label
              htmlFor="photoURL"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Profile Photo URL{" "}
              <span className="text-xs text-zinc-400 font-normal">
                (optional)
              </span>
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="photoURL"
                type="url"
                name="photoURL"
                value={form.photoURL}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/60 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Password <span className="text-amber-700">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                required
                className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/60 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {strength && (
              <div className="space-y-1 pt-1">
                <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strength.color} ${strength.w} transition-all duration-300 rounded-full`}
                  />
                </div>
                <p className="text-[11px] text-zinc-400">
                  Strength:{" "}
                  <span className="font-medium text-zinc-600 dark:text-zinc-300">
                    {strength.label}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Confirm Password <span className="text-amber-700">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                required
                className={`w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                  form.confirmPassword && form.confirmPassword !== form.password
                    ? "border-red-300 bg-red-50/40 focus:ring-red-400/30 focus:border-red-400"
                    : "border-zinc-200 dark:border-zinc-700 bg-zinc-50/60 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 focus:ring-amber-500/40 focus:border-amber-400"
                } placeholder:text-zinc-400`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {form.confirmPassword && form.confirmPassword !== form.password && (
              <p className="text-xs text-red-500">Passwords do not match</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold shadow-sm shadow-amber-700/20 hover:shadow-md hover:shadow-amber-700/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating account…</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white dark:bg-zinc-900 px-3 text-zinc-400">
              Already have an account?
            </span>
          </div>
        </div>

        {/* Login Link */}
        <Link
          href="/login"
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-amber-400 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-amber-800 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-zinc-800 transition-all duration-200"
        >
          Sign in instead
        </Link>
      </div>
    </div>
  );
}
