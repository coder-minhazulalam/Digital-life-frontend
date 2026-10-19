"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
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
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-amber-900/8 border border-amber-100 p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100 mb-4">
            <BookOpen className="w-7 h-7 text-amber-700" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-amber-950">
            Join the Community
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Start sharing your life lessons today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/60 text-zinc-900 placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
              Email Address
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
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/60 text-zinc-900 placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 transition-all"
              />
            </div>
          </div>

          {/* Profile Image URL */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="photoURL" className="block text-sm font-medium text-zinc-700">
                Profile Photo URL
              </label>
              <span className="text-xs text-zinc-400 font-normal">Optional</span>
            </div>
            <div className="relative">
              <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="photoURL"
                type="url"
                name="photoURL"
                value={form.photoURL}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/... or your avatar URL"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/60 text-zinc-900 placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 transition-all"
              />
            </div>
            {form.photoURL && (
              <div className="flex items-center gap-2.5 pt-1 text-xs text-zinc-500">
                <span className="text-[11px] font-medium text-zinc-400">Preview:</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.photoURL}
                  alt="Avatar preview"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-400"
                />
                <span className="text-[11px] text-zinc-500 truncate max-w-[200px]">
                  Avatar photo will be displayed on your profile
                </span>
              </div>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
                className="w-full pl-10 pr-11 py-3 rounded-xl border border-zinc-200 bg-zinc-50/60 text-zinc-900 placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Password strength bar */}
            {strength && (
              <div className="space-y-1 pt-0.5">
                <div className="h-1 w-full rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.w}`}
                  />
                </div>
                <p className="text-xs text-zinc-500">{strength.label}</p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
                className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                  form.confirmPassword && form.confirmPassword !== form.password
                    ? "border-red-300 bg-red-50/40 focus:ring-red-400/30 focus:border-red-400"
                    : "border-zinc-200 bg-zinc-50/60 focus:ring-amber-500/40 focus:border-amber-400"
                } text-zinc-900 placeholder:text-zinc-400`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
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
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold shadow-sm shadow-amber-700/20 hover:shadow-md hover:shadow-amber-700/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
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
            <div className="w-full border-t border-zinc-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-zinc-400">
              Already have an account?
            </span>
          </div>
        </div>

        {/* Login Link */}
        <Link
          href="/login"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-200 hover:border-amber-400 text-sm font-medium text-zinc-700 hover:text-amber-800 hover:bg-amber-50 transition-all duration-200"
        >
          Sign in instead
        </Link>
      </div>
    </div>
  );
}
