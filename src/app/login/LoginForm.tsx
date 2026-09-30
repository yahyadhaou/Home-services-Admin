"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, CalendarCheck, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, Users } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";

const HIGHLIGHTS = [
  { icon: Building2, label: "Companies & independents" },
  { icon: Users, label: "Clients & their bookings" },
  { icon: CalendarCheck, label: "Every job, tracked" },
];

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json?.error?.message ?? "Login failed");
        return;
      }
      router.push("/overview");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-sidebar px-12 py-12 lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-indigo-500/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-indigo-400/10 blur-3xl"
        />

        <div className="relative flex items-center gap-3">
          <LogoMark size={40} />
          <div>
            <p className="text-base font-semibold text-white">HomeService</p>
            <p className="text-xs text-slate-400">Admin Portal</p>
          </div>
        </div>

        <div className="relative">
          <h1 className="max-w-sm text-3xl font-semibold leading-tight text-white">Everything on the platform, in one place.</h1>
          <p className="mt-3 max-w-sm text-sm text-slate-400">
            Review onboarding applications, manage accounts, and keep an eye on every booking across the marketplace.
          </p>
          <ul className="mt-8 flex flex-col gap-3">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-sm text-slate-300">
                <span className="flex size-7 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="size-3.5" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="size-3.5" />
          Platform staff access only
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <LogoMark size={40} />
          </div>

          <h2 className="text-xl font-semibold text-foreground">Sign in</h2>
          <p className="mt-1 text-sm text-muted">Use your platform staff account to continue.</p>

          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4" suppressHydrationWarning>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border py-2.5 pl-9 pr-3 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="admin@homeservices-business.de"
                  suppressHydrationWarning
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-border py-2.5 pl-9 pr-9 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="••••••••"
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg bg-accent px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
