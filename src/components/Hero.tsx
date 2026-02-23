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
    <section className="relative overflow-hidden bg-background">
      {/* Fondo con gradiente sutil para premium feel en dark mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-sde-rojo/5 pointer-events-none" />

      {/* Franja celeste superior */}
      <div className="h-1.5 w-full bg-sde-celeste/80" />

      <div className="container relative py-8 md:py-20 px-4">
        {/* Chip de ubicación */}
        <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
          <MapPin className="h-3 w-3" />
          Santiago del Estero
        </div>

        {/* Título — premium typography */}
        <h1 className="mb-4 font-display text-4xl font-black leading-[1.1] text-foreground sm:text-5xl md:text-7xl tracking-tight">
          Encontrá tu{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-primary">oficio</span>
            <span className="absolute -bottom-1 left-0 h-[6px] w-full rounded-full bg-sde-dorado/40 -rotate-1" />
          </span>{" "}
          ahora
        </h1>
        <p className="mb-8 max-w-lg text-sm font-medium text-muted-foreground md:text-lg leading-relaxed">
          La red más grande de <span className="text-foreground font-bold">profesionales santiagueños</span>.
          Contactá directo sin intermediarios.
        </p>

        {/* ── Buscador principal ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              ref={inputRef}
              type="text"
              placeholder="¿Qué servicio necesitás hoy?"
              value={termino}
              onChange={(e) => setTermino(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-14 w-full rounded-2xl border-2 border-border bg-card/80 backdrop-blur-sm pl-12 pr-10 text-base font-medium text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-lg shadow-black/5"
            />
            {termino && (
              <button
                onClick={() => { setTermino(""); inputRef.current?.focus(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-sde-rojo transition-colors p-1"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={handleBuscar}
            className="h-14 rounded-2xl bg-sde-rojo px-8 font-display text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-sde-rojo/20 transition-all hover:bg-[#B50D0D] hover:shadow-sde-rojo/30 active:scale-[0.97] active:shadow-inner"
          >
            Buscar
          </button>
        </div>

        {/* ── Categorías rápidas — scroll horizontal ─────────────────── */}
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-border/50" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
              Tendencias
            </p>
            <div className="h-px flex-1 bg-border/50" />
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-4 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIAS_RAPIDAS.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoria(cat.slug)}
                className="flex shrink-0 items-center gap-2 rounded-2xl border border-border bg-card/50 backdrop-blur-sm px-5 py-3 text-sm font-bold text-foreground shadow-sm transition-all hover:border-primary hover:bg-primary/5 hover:text-primary hover:shadow-md hover:-translate-y-0.5 active:scale-95"
              >
                <span role="img" aria-label={cat.label} className="text-lg leading-none filter drop-shadow-sm">
                  {cat.emoji}
                </span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Stats rápidos ───────────────────────────────────────────── */}
        <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-muted-foreground/80 bg-muted/30 w-fit px-4 py-2 rounded-full border border-border/50">
          <div className="flex h-2 w-2 rounded-full bg-sde-dorado animate-pulse" />
          <span className="uppercase tracking-wider">Conexión directa: <strong className="text-foreground">Sin comisiones</strong></span>
        </div>
      </div>

      {/* Decoración (mejorada para dark mode) */}
      <div className="pointer-events-none absolute right-[-5%] top-[-10%] hidden h-[120%] w-1/2 lg:block opacity-50 dark:opacity-20">
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <div className="h-96 w-96 rounded-full border-[20px] border-primary/5" />
          <div className="absolute left-20 top-20 h-64 w-64 rounded-full border-[10px] border-sde-dorado/5 animate-slow-spin" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
