import { useState, useRef } from "react";
import { Search, X, MapPin, Zap } from "lucide-react";

// Categorías más buscadas con emoji de oficio
const CATEGORIAS_RAPIDAS = [
  { slug: "plomero", label: "Plomero", emoji: "🔧" },
  { slug: "electricista", label: "Electricista", emoji: "⚡" },
  { slug: "albanil", label: "Albañil", emoji: "🧱" },
  { slug: "gasista", label: "Gasista", emoji: "🔥" },
  { slug: "pintor", label: "Pintor", emoji: "🖌️" },
  { slug: "carpintero", label: "Carpintero", emoji: "🪵" },
  { slug: "tecnico", label: "Técnico", emoji: "📱" },
  { slug: "jardinero", label: "Jardinero", emoji: "🌿" },
];

interface HeroProps {
  onScrollToProfessionals?: () => void;
  onCategoriaRapida?: (slug: string) => void;
  onBusqueda?: (termino: string) => void;
}

const Hero = ({ onScrollToProfessionals, onCategoriaRapida, onBusqueda }: HeroProps) => {
  const [termino, setTermino] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBuscar = () => {
    if (onBusqueda) onBusqueda(termino);
    if (onScrollToProfessionals) onScrollToProfessionals();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleBuscar();
  };

  const handleCategoria = (slug: string) => {
    if (onCategoriaRapida) onCategoriaRapida(slug);
    if (onScrollToProfessionals) onScrollToProfessionals();
  };

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Franja celeste superior */}
      <div className="h-1 w-full bg-sde-celeste" />

      <div className="container py-8 md:py-14">
        {/* Chip de ubicación */}
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-sde-celeste/30 bg-sde-celeste-claro px-3 py-1 text-xs font-medium text-sde-celeste">
          <MapPin className="h-3 w-3" />
          Santiago del Estero
        </div>

        {/* Título — compacto en mobile */}
        <h1 className="mb-2 font-display text-3xl font-bold leading-tight text-sde-texto sm:text-4xl md:text-[3.2rem]">
          Encontrá tu{" "}
          <span className="relative text-sde-celeste">
            oficio
            <span className="absolute -bottom-0.5 left-0 h-[3px] w-full rounded-full bg-sde-dorado" />
          </span>{" "}
          ahora
        </h1>
        <p className="mb-6 text-sm text-gray-500 md:text-base">
          Plomeros, electricistas, albañiles y más — contacto directo por WhatsApp.
        </p>

        {/* ── Buscador principal ─────────────────────────────────────── */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="¿Qué servicio necesitás?"
              value={termino}
              onChange={(e) => setTermino(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              className="h-12 w-full rounded-xl border-2 border-gray-200 bg-white pl-10 pr-9 text-sm text-sde-texto placeholder:text-gray-400 focus:border-sde-celeste focus:outline-none focus:ring-0 transition-colors"
            />
            {termino && (
              <button
                onClick={() => { setTermino(""); inputRef.current?.focus(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sde-rojo transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {/* Botón buscar — rojo punzó */}
          <button
            onClick={handleBuscar}
            className="h-12 rounded-xl bg-sde-rojo px-5 font-display text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#B50D0D] active:scale-95"
          >
            Buscar
          </button>
        </div>

        {/* ── Categorías rápidas — scroll horizontal ─────────────────── */}
        <div className="mt-5">
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Más buscados
          </p>
          {/* Scroll horizontal sin scrollbar visible */}
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIAS_RAPIDAS.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoria(cat.slug)}
                className="flex shrink-0 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-sde-celeste hover:bg-sde-celeste-claro hover:text-sde-celeste active:scale-95"
              >
                <span role="img" aria-label={cat.label} className="text-base leading-none">
                  {cat.emoji}
                </span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Stats rápidos ───────────────────────────────────────────── */}
        <div className="mt-6 flex items-center gap-1.5 text-xs text-gray-400">
          <Zap className="h-3.5 w-3.5 text-sde-dorado" />
          <span>Respuesta promedio en <strong className="text-sde-texto">menos de 1 hora</strong></span>
        </div>
      </div>

      {/* Franja tricolor inferior */}
      <div className="flex h-1">
        <div className="flex-1 bg-sde-celeste" />
        <div className="flex-1 bg-gray-100" />
        <div className="flex-1 bg-sde-rojo" />
      </div>

      {/* Decoración (solo desktop) */}
      <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-1/3 lg:block">
        <div className="absolute inset-0 bg-gradient-to-l from-sde-gris to-transparent" />
        <div className="absolute right-12 top-1/2 -translate-y-1/2">
          <div className="h-56 w-56 rounded-full border-[6px] border-sde-celeste/15" />
          <div className="absolute left-8 top-8 h-40 w-40 rounded-full border-[4px] border-sde-dorado/20" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
