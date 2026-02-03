"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Card from "@/components/Card";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const signIn = async () => {
    setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      setError(authError.message);
      return;
    }

    router.replace("/admin");
  };

  return (
    <div className="min-h-screen bg-navy-gradient px-6 py-16">
      <div className="mx-auto max-w-md">
        <Card className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Admin Access</p>
            <h1 className="font-[var(--font-sora)] text-2xl">Sign in</h1>
          </div>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-3 text-sm text-ink"
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            type="password"
            className="w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-3 text-sm text-ink"
          />
          {error ? <p className="text-xs text-danger">{error}</p> : null}
          <button
            onClick={signIn}
            className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-glow"
          >
            Continue
          </button>
          <p className="text-xs text-muted">
            Assign role <span className="text-ink">admin</span> in Supabase app/user metadata.
          </p>
        </Card>
      </div>
    </div>
  );
}
