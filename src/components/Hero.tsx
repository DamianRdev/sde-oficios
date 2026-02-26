import { useState, useRef } from "react";
import { Search, X } from "lucide-react";

interface HeroProps {
  onScrollToProfessionals?: () => void;
  onCategoriaRapida?: (slug: string) => void;
  onBusqueda?: (termino: string) => void;
}

const Hero = ({ onScrollToProfessionals, onBusqueda }: HeroProps) => {
  const [termino, setTermino] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBuscar = () => {
    if (onBusqueda) onBusqueda(termino);
    if (onScrollToProfessionals) onScrollToProfessionals();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleBuscar();
  };

  return (
    <section className="relative overflow-hidden bg-background text-foreground transition-colors">
      {/* Decorative gradient for dark premium feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-sde-rojo/5 via-transparent to-transparent pointer-events-none" />

      <div className="container relative py-14 md:py-24 px-4 max-w-5xl mx-auto">
        {/* Top Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-sde-rojo/40 dark:border-red-500/40 bg-sde-rojo/10 dark:bg-red-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-sde-rojo dark:text-red-500">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-[pulse_2s_ease-in-out_infinite]" />
          120+ PROFESIONALES ACTIVOS
        </div>

        {/* Main Title */}
        <h1 className="mb-6 font-display text-[65px] md:text-[95px] lg:text-[115px] font-black leading-[0.85] tracking-tight uppercase" style={{ wordSpacing: '-0.1em' }}>
          <span className="block text-foreground">TU OFICIO,</span>
          <span className="block text-sde-rojo dark:text-red-500">A UN TOQUE.</span>
        </h1>

        {/* Subtitle */}
        <p className="mb-10 max-w-xl text-[17px] md:text-[20px] font-medium text-muted-foreground leading-relaxed">
          Electricistas, plomeros, gasistas y más en Santiago <span className="hidden sm:inline"><br /></span>
          del Estero. Verificados, con reseñas reales.
        </p>

        {/* ── Buscador principal ── */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mb-12">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 h-[22px] w-[22px] -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              ref={inputRef}
              type="text"
              placeholder="¿Qué oficio necesitás?"
              value={termino}
              onChange={(e) => setTermino(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-[64px] w-full rounded-[18px] border border-border bg-card pl-14 pr-10 text-[18px] font-medium text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
            />
            {termino && (
              <button
                onClick={() => { setTermino(""); inputRef.current?.focus(); }}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-sde-rojo dark:hover:text-red-500 transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <button
            onClick={handleBuscar}
            className="h-[64px] rounded-[18px] bg-sde-rojo px-10 font-bold text-[18px] text-white transition-all hover:bg-[#B50D0D] active:scale-[0.98] shrink-0 shadow-sm"
          >
            Buscar
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-4 md:gap-14 border-t border-border pt-8">
          <div>
            <div className="font-display font-black text-4xl md:text-[45px] leading-none text-foreground mb-2 tracking-tight">
              120+
            </div>
            <div className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              PROFESIONALES
            </div>
          </div>
          <div>
            <div className="font-display font-black text-4xl md:text-[45px] leading-none text-foreground mb-2 tracking-tight">
              8
            </div>
            <div className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              CATEGORÍAS
            </div>
          </div>
          <div>
            <div className="font-display font-black text-4xl md:text-[45px] leading-none text-foreground mb-2 flex items-baseline gap-1 tracking-tight">
              4.8<span className="text-3xl md:text-[34px] text-sde-dorado">★</span>
            </div>
            <div className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              VALORACIÓN MEDIA
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
