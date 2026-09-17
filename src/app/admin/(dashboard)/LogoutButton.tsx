"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="focus-gold font-mono text-xs uppercase tracking-wide px-3 py-2 border border-white/15 text-cream-dim hover:border-gold hover:text-gold-bright transition-colors"
    >
      Cerrar sesión
    </button>
  );
}
