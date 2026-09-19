import SiteImagesManager from "./SiteImagesManager";

export const metadata = { title: "Fotos — Panel Destiny Barber" };

export default function FotosPage() {
  return (
    <div>
      <h1 className="font-display text-3xl mb-2">Fotos de la página principal</h1>
      <p className="text-cream-dim mb-8 max-w-[60ch]">
        Sube las fotos reales para reemplazar los placeholders. Los cambios se ven en la web en cuanto guardas — no
        hace falta volver a desplegar.
      </p>
      <SiteImagesManager />
    </div>
  );
}
