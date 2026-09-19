"use client";

import { useEffect, useState } from "react";
import ImageUploader from "../ImageUploader";

type Settings = {
  heroImageUrl: string | null;
  compareBeforeUrl: string | null;
  compareAfterUrl: string | null;
};
type Barber = { id: string; name: string; photoUrl: string | null };

async function patchSettings(patch: Partial<Settings>) {
  await fetch("/api/admin/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
}

export default function SiteImagesManager() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [barbers, setBarbers] = useState<Barber[] | null>(null);

  async function load() {
    const [sRes, bRes] = await Promise.all([fetch("/api/admin/settings"), fetch("/api/admin/barbers")]);
    const sData = await sRes.json();
    const bData = await bRes.json();
    setSettings(sData.settings);
    setBarbers(bData.barbers ?? []);
  }
  useEffect(() => {
    load();
  }, []);

  async function saveBarberPhoto(id: string, url: string) {
    await fetch(`/api/admin/barbers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoUrl: url }),
    });
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-mono text-[0.7rem] uppercase tracking-wide text-gold-dim mb-4">Portada (hero)</h2>
        <div className="max-w-sm">
          <ImageUploader
            label="Foto principal — retrato de sillón"
            folder="hero"
            aspect="aspect-[4/5]"
            currentUrl={settings?.heroImageUrl}
            onUploaded={(url) => patchSettings({ heroImageUrl: url })}
          />
        </div>
      </section>

      <section>
        <h2 className="font-mono text-[0.7rem] uppercase tracking-wide text-gold-dim mb-4">Comparador antes / después</h2>
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
          <ImageUploader
            label="Antes"
            folder="compare"
            currentUrl={settings?.compareBeforeUrl}
            onUploaded={(url) => patchSettings({ compareBeforeUrl: url })}
          />
          <ImageUploader
            label="Después"
            folder="compare"
            currentUrl={settings?.compareAfterUrl}
            onUploaded={(url) => patchSettings({ compareAfterUrl: url })}
          />
        </div>
      </section>

      <section>
        <h2 className="font-mono text-[0.7rem] uppercase tracking-wide text-gold-dim mb-4">Barberos</h2>
        {!barbers ? (
          <p className="text-cream-dim text-sm">Cargando…</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {barbers.map((b) => (
              <ImageUploader
                key={b.id}
                label={b.name}
                folder="barbers"
                aspect="aspect-[3/4]"
                currentUrl={b.photoUrl}
                onUploaded={(url) => saveBarberPhoto(b.id, url)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
