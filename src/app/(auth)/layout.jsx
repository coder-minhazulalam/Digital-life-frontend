import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Digital Life Lessons — Auth",
  icons: {
    icon: [
      { url: "/logo_central.jpg" },
      { url: "/logo_central.jpg", type: "image/jpeg" },
    ],
    shortcut: "/logo_central.jpg",
    apple: "/logo_central.jpg",
  },
};

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50/40 to-amber-100/60">
      {/* Subtle header with just brand logo */}
      <div className="flex justify-center pt-8 pb-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/logo_central.jpg"
              alt="Digital Life Lessons"
              width={40}
              height={40}
              className="object-cover rounded-xl"
            />
          </div>
          <span className="font-serif text-xl font-bold text-amber-950 group-hover:text-amber-700 transition-colors">
            Digital Life Lessons
          </span>
        </Link>
      </div>

      {/* Main auth content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>

      {/* Footer note */}
      <div className="text-center py-6 text-xs text-zinc-500">
        © {new Date().getFullYear()} Digital Life Lessons. All rights reserved.
      </div>
    </div>
  );
}
