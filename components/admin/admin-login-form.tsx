"use client";

import { Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";

export function AdminLoginForm(): ReactNode {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };

      if (!res.ok || !json.ok) {
        setError(json.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }

      const from = searchParams.get("from");
      router.push(from && from.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="border-foreground/10 w-full max-w-sm rounded-4xl border p-8">
      <div className="bg-foreground text-background mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full">
        <Lock className="h-4.5 w-4.5" aria-hidden="true" />
      </div>
      <h1 className="font-serif text-[1.75rem] font-medium tracking-tight text-foreground">
        Admin
      </h1>
      <p className="text-foreground/60 mt-1 mb-6 text-[14px] tracking-tight">
        Sign in to manage the site.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-foreground/70 text-[13px] font-medium tracking-tight">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            className="border-foreground/10 bg-foreground/2 dark:bg-foreground/5 focus-ring rounded-xl border px-3.5 py-2.5 text-[15px] tracking-tight text-foreground outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-foreground/70 text-[13px] font-medium tracking-tight">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-foreground/10 bg-foreground/2 dark:bg-foreground/5 focus-ring rounded-xl border px-3.5 py-2.5 text-[15px] tracking-tight text-foreground outline-none"
          />
        </label>

        {error ? (
          <p className="text-[13px] tracking-tight text-red-500">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="focus-ring bg-foreground text-background mt-1 cursor-pointer rounded-xl px-5 py-2.5 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
