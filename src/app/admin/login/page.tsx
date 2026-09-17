"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "No se pudo iniciar sesión.");
      return;
    }
    router.push(params.get("next") ?? "/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm border border-white/10 p-8">
        <p className="font-mono text-xs tracking-[0.3em] text-gold uppercase mb-2">Destiny Barber</p>
        <h1 className="font-display text-2xl mb-6">Panel del dueño</h1>

        <label className="flex flex-col gap-2 mb-4">
          <span className="font-mono text-[0.7rem] uppercase tracking-wide text-cream-dim">Correo</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
            className="focus-gold bg-transparent border border-white/15 px-4 py-3 text-cream"
          />
        </label>
        <label className="flex flex-col gap-2 mb-6">
          <span className="font-mono text-[0.7rem] uppercase tracking-wide text-cream-dim">Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="focus-gold bg-transparent border border-white/15 px-4 py-3 text-cream"
          />
        </label>

        {error && <p className="text-danger text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="focus-gold w-full py-3 bg-gold text-ink font-semibold text-sm uppercase tracking-wide hover:bg-gold-bright transition-colors disabled:opacity-50"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
