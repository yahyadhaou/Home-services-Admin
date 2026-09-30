"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { Locale } from "@/i18n/locale";

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const setLocale = async (next: Locale) => {
    if (next === locale || pending) return;
    setPending(true);
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: next }),
    });
    router.refresh();
    setPending(false);
  };

  return (
    <div className="flex items-center rounded-lg bg-slate-100 p-0.5 text-xs font-medium">
      {(["en", "de"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          disabled={pending}
          className={cn(
            "rounded-md px-2 py-1 uppercase transition-colors disabled:opacity-60",
            locale === l ? "bg-white text-foreground shadow-sm" : "text-muted hover:text-foreground",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
