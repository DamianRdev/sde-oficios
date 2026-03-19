import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

interface HeroProps {
  onScrollToProfessionals?: () => void;
  onCategoriaRapida?: (slug: string) => void;
  onBusqueda?: (termino: string) => void;
}

const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1585819200844-48601831c2ad?auto=format&fit=crop&q=80", // Plomero
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80", // Electricista
  "https://images.unsplash.com/photo-1541888081198-bc1c25524b0f?auto=format&fit=crop&q=80", // Albañil / Herramientas
  "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?auto=format&fit=crop&q=80", // Carpintero
  "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80", // Técnico Mecánico
];

const Hero = ({ onScrollToProfessionals, onBusqueda }: HeroProps) => {
  const [termino, setTermino] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 5000); // Cambia cada 5 segundos
    return () => clearInterval(timer);
  }, []);

  const handleBuscar = () => {
    if (onBusqueda) onBusqueda(termino);
    if (onScrollToProfessionals) onScrollToProfessionals();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleBuscar();
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white transition-colors">
      {/* Background Slider */}
      {BACKGROUND_IMAGES.map((url, idx) => (
        <div
          key={url}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${url})` }}
        />
      ))}
      
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-slate-950/80 sm:bg-slate-950/70" />

      <div className="container relative py-14 md:py-24 px-4 max-w-5xl mx-auto z-10">
        {/* Top Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#FF5B00]">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-[pulse_2s_ease-in-out_infinite]" />
          120+ PROFESIONALES ACTIVOS
        </div>

        {/* Main Title */}
        <h1 className="mb-6 font-display text-[55px] md:text-[85px] lg:text-[100px] font-black leading-[0.85] tracking-tight uppercase" style={{ wordSpacing: '-0.1em' }}>
          <span className="block text-white drop-shadow-md">ENCONTRÁ QUIEN</span>
          <span className="block text-[#FF5B00] drop-shadow-md">LO SOLUCIONE, RÁPIDO.</span>
        </h1>

        {/* Subtitle */}
        <p className="mb-10 max-w-xl text-[17px] md:text-[20px] font-medium text-gray-300 leading-relaxed drop-shadow-sm">
          Electricistas, plomeros, gasistas y más en Santiago <span className="hidden sm:inline"><br /></span>
          del Estero. Verificados, con reseñas reales.
        </p>

        {/* ── Buscador principal ── */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mb-12">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 h-[22px] w-[22px] -translate-y-1/2 text-slate-500 group-focus-within:text-[#FF5B00] transition-colors" />
            <input
              ref={inputRef}
              type="text"
              placeholder="¿Qué oficio necesitás?"
              value={termino}
              onChange={(e) => setTermino(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-[64px] w-full rounded-[18px] border border-white/20 bg-white/95 pl-14 pr-10 text-[18px] font-medium text-slate-900 placeholder:text-slate-500 focus:border-[#FF5B00] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF5B00]/20 transition-all shadow-xl"
            />
            {termino && (
              <button
                onClick={() => { setTermino(""); inputRef.current?.focus(); }}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <button
            onClick={handleBuscar}
            className="h-[64px] rounded-[18px] bg-sde-rojo px-10 font-bold text-[18px] text-white transition-all hover:bg-[#B50D0D] active:scale-[0.98] shrink-0 shadow-lg"
          >
            Buscar
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-4 md:gap-14 border-t border-white/10 pt-8">
          <div>
            <div className="font-display font-black text-4xl md:text-[45px] leading-none text-white mb-2 tracking-tight drop-shadow-sm">
              120+
            </div>
            <div className="text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400">
              PROFESIONALES
            </div>
          </div>
          <div>
            <div className="font-display font-black text-4xl md:text-[45px] leading-none text-white mb-2 tracking-tight drop-shadow-sm">
              8
            </div>
            <div className="text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400">
              CATEGORÍAS
            </div>
          </div>
          <div>
            <div className="font-display font-black text-4xl md:text-[45px] leading-none text-white mb-2 flex items-baseline gap-1 tracking-tight drop-shadow-sm">
              4.8<span className="text-3xl md:text-[34px] text-sde-dorado drop-shadow-sm">★</span>
            </div>
            <div className="text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400">
              VALORACIÓN MEDIA
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
