import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import {
  Search, AlertCircle, ChevronLeft, ChevronRight, X, SlidersHorizontal, ChevronDown,
} from "lucide-react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TradeFilter from "@/components/TradeFilter";
import ProfessionalCard from "@/components/ProfessionalCard";
import Footer from "@/components/Footer";
import SkeletonCard from "@/components/SkeletonCard";
import { useProfesionales } from "@/hooks/use-profesionales";
import { Button } from "@/components/ui/button";
import { useCategorias } from "@/hooks/use-categorias-zonas";

const EMOJIS: Record<string, string> = {
  "electricista": "⚡",
  "plomero": "🔧",
  "gasista": "🔥",
  "pintor": "🎨",
  "carpintero": "🪵",
  "aire-acondicionado": "❄️",
  "albanil": "🧱",
  "jardinero": "🌿",
  "todos": "🔍"
};

const POR_PAGINA = 12;

/** Normaliza texto: quita tildes y pasa a minúsculas para búsqueda robusta */
const normalizar = (str: string) =>
  str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Estado persistido en la URL
  const categoriaSlug = searchParams.get("categoria") ?? "todos";
  const zonaSlug = searchParams.get("zona") ?? "todas";
  const busqueda = searchParams.get("q") ?? "";
  const pagina = Number(searchParams.get("pagina") ?? "1");

  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const professionalsRef = useRef<HTMLDivElement>(null);

  // Helper para actualizar params sin perder los otros
  const setParam = useCallback((key: string, value: string, resetPage = true) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value && value !== "todos" && value !== "todas" && value !== "") {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      if (resetPage) next.delete("pagina");
      return next;
    });
  }, [setSearchParams]);

  const setPagina = useCallback((fn: (p: number) => number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const current = Number(prev.get("pagina") ?? "1");
      const newPage = fn(current);
      if (newPage === 1) next.delete("pagina");
      else next.set("pagina", String(newPage));
      return next;
    });
  }, [setSearchParams]);


  // Carga todos (sin búsqueda en BD) — el filtro por servicio es instantáneo en cliente
  const { data, isLoading, isError, isFetching } = useProfesionales({
    categoriaSlug: categoriaSlug === "todos" ? undefined : categoriaSlug,
    zonaSlug: zonaSlug === "todas" ? undefined : zonaSlug,
    pagina,
    porPagina: POR_PAGINA,
  });

  const { data: categorias = [] } = useCategorias();

  const todosLosProfesionales = data?.data ?? [];
  const total = data?.total ?? 0;

  // Filtrado por servicio en el cliente — insensible a tildes y mayúsculas
  const profesionales = useMemo(() => {
    const termino = normalizar(busqueda.trim());
    if (!termino) return todosLosProfesionales;
    return todosLosProfesionales.filter((p) => {
      const servicios = Array.isArray(p.servicios)
        ? p.servicios.join(" ")
        : String(p.servicios ?? "");
      return normalizar(servicios).includes(termino);
    });
  }, [todosLosProfesionales, busqueda]);

  const hayBusqueda = busqueda.trim().length > 0;
  const hayFiltros = categoriaSlug !== "todos" || zonaSlug !== "todas";
  const totalPaginas = hayBusqueda ? 1 : Math.ceil(total / POR_PAGINA);

  const location = useLocation();

  const scrollToProfessionals = () =>
    professionalsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  // Scroll automático a la sección de profesionales al volver desde un perfil
  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo === "profesionales") {
      const timer = setTimeout(() => {
        professionalsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleCategoriaChange = useCallback((slug: string) => {
    setParam("categoria", slug);
  }, [setParam]);

  const handleZonaChange = useCallback((slug: string) => {
    setParam("zona", slug);
  }, [setParam]);

  const handleBusqueda = useCallback((val: string) => {
    setParam("q", val);
  }, [setParam]);

  const limpiarFiltros = () => {
    setSearchParams({});
  };

  const ctaLabel = hayBusqueda
    ? `${profesionales.length} resultado${profesionales.length !== 1 ? "s" : ""} para "${busqueda}"`
    : `${total} profesional${total !== 1 ? "es" : ""} disponible${total !== 1 ? "s" : ""}`;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">

        {/* ── HERO con búsqueda + categorías rápidas ── */}
        <Hero
          onScrollToProfessionals={scrollToProfessionals}
          onCategoriaRapida={handleCategoriaChange}
          onBusqueda={handleBusqueda}
        />

        {/* ── SECCIÓN PROFESIONALES ── */}
        <section ref={professionalsRef} id="profesionales" className="bg-secondary/30 py-8 md:py-14">
          <div className="container max-w-5xl mx-auto">

            {/* ── CHIPS DE CATEGORÍA (Scrolleables horizontalmente) ── */}
            <div className="mb-6 flex gap-3 overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 custom-scrollbar overscroll-x-contain active:cursor-grabbing">
              <button
                onClick={() => handleCategoriaChange("todos")}
                className={`shrink-0 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold border transition-all shadow-sm ${categoriaSlug === "todos"
                  ? "bg-sde-rojo text-white border-sde-rojo dark:bg-red-600 dark:border-red-600"
                  : "bg-card text-foreground border-border/80 hover:bg-muted"
                  }`}
              >
                <span className="text-lg leading-none">🔍</span> Todos
              </button>
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoriaChange(cat.slug)}
                  className={`shrink-0 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold border transition-all shadow-sm ${categoriaSlug === cat.slug
                    ? "bg-sde-rojo text-white border-sde-rojo dark:bg-red-600 dark:border-red-600"
                    : "bg-card text-foreground border-border/80 hover:bg-muted"
                    }`}
                >
                  <span className="text-lg leading-none">{EMOJIS[cat.slug] || "🛠️"}</span> {cat.nombre}
                </button>
              ))}
            </div>

            {/* ── Buscador y Filtro de Zona ── */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  id="buscador-servicios"
                  placeholder="Buscar oficio o nombre..."
                  value={busqueda}
                  onChange={(e) => handleBusqueda(e.target.value)}
                  autoComplete="off"
                  className="h-12 w-full rounded-[14px] border border-border bg-card pl-11 pr-10 text-[15px] font-medium text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                />
                {busqueda && (
                  <button
                    onClick={() => handleBusqueda("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-sde-rojo dark:hover:text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
                className={`flex h-12 items-center justify-center gap-2 rounded-[14px] border px-6 text-[15px] font-bold shadow-sm transition-all ${zonaSlug !== "todas"
                  ? "border-sde-rojo bg-sde-rojo/10 text-sde-rojo dark:border-red-500/50 dark:bg-red-500/10 dark:text-red-500"
                  : "border-border bg-card text-foreground hover:bg-muted"
                  }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Zona
              </button>
            </div>

            {/* Filtros avanzados (Desplegable) */}
            {filtrosAbiertos && (
              <div className="mb-6 animate-fade-in rounded-[16px] border border-border bg-card p-5 shadow-md">
                <TradeFilter
                  selectedCategoriaSlug={categoriaSlug}
                  selectedZonaSlug={zonaSlug}
                  onCategoriaChange={handleCategoriaChange}
                  onZonaChange={handleZonaChange}
                />
              </div>
            )}

            {/* Encabezado de sección (Título) */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-xl md:text-[22px] font-black uppercase tracking-tight text-foreground">
                {categoriaSlug === "todos"
                  ? "PROFESIONALES CERCA TUYO"
                  : `${categorias.find(c => c.slug === categoriaSlug)?.nombre || "PROFESIONALES"} CERCA TUYO`}
              </h2>

              <button
                onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
                className="flex items-center gap-2 rounded-[12px] border border-border bg-card px-4 py-2 text-sm font-bold shadow-sm hover:bg-muted"
              >
                <SlidersHorizontal className="h-4 w-4" /> Fijar Filtros
              </button>
            </div>

            {/* ── Estado: error ── */}
            {isError && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 dark:border-red-900 bg-red-500/5 py-12 text-center">
                <AlertCircle className="mb-3 h-8 w-8 text-sde-rojo dark:text-red-500" />
                <p className="font-medium text-sde-rojo dark:text-red-500">No se pudo cargar los profesionales</p>
                <p className="mt-1 text-sm text-muted-foreground">Verificá tu conexión e intentá de nuevo.</p>
              </div>
            )}

            {/* ── Skeleton loading (reemplaza al spinner) ── */}
            {isLoading && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {/* ── Grilla de profesionales ── */}
            {!isLoading && !isError && (
              <>
                {profesionales.length > 0 ? (
                  <div
                    className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-200 ${isFetching ? "opacity-60" : "opacity-100"
                      }`}
                  >
                    {profesionales.map((profesional, index) => (
                      <div
                        key={profesional.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                      >
                        <ProfessionalCard profesional={profesional} />
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Sin resultados */
                  <div className="flex flex-col items-center justify-center rounded-[24px] border border-border bg-card px-6 py-20 text-center shadow-sm">
                    <div className="mb-4 rounded-full bg-muted p-4">
                      <Search className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <p className="font-display text-2xl font-bold text-foreground">
                      {hayBusqueda ? `Sin resultados para "${busqueda}"` : "No encontramos profesionales"}
                    </p>
                    <p className="mt-2 max-w-sm text-base text-muted-foreground">
                      No hay profesionales disponibles con los filtros seleccionados o en esta zona.
                    </p>
                    <button
                      onClick={limpiarFiltros}
                      className="mt-8 rounded-xl bg-sde-rojo dark:bg-red-600 px-6 py-3 font-semibold text-white transition-all hover:bg-[#B50D0D] dark:hover:bg-red-700 active:scale-95 shadow-sm"
                    >
                      Limpiar todos los filtros
                    </button>
                  </div>
                )}

                {/* ── Paginación ── */}
                {!hayBusqueda && totalPaginas > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPagina((p) => Math.max(1, p - 1));
                        scrollToProfessionals();
                      }}
                      disabled={pagina === 1 || isFetching}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Anterior
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {pagina} / {totalPaginas}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPagina((p) => Math.min(totalPaginas, p + 1));
                        scrollToProfessionals();
                      }}
                      disabled={pagina === totalPaginas || isFetching}
                    >
                      Siguiente
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ── CTA para profesionales ── */}
        <section className="bg-primary py-12 md:py-16">
          <div className="container text-center">
            <h2 className="mb-3 font-display text-2xl font-bold text-white md:text-3xl">
              ¿Sos profesional de un oficio?
            </h2>
            <p className="mx-auto mb-6 max-w-md text-sm text-white/80 md:text-base">
              Publicá tu perfil y recibí contactos reales de personas que necesitan tus servicios.
            </p>
            <a
              href="/registrarse"
              className="inline-flex items-center gap-2 rounded-xl bg-sde-rojo dark:bg-red-600 px-7 py-3.5 font-display text-sm font-bold text-white shadow-lg transition-all hover:bg-[#B50D0D] dark:hover:bg-red-700 hover:shadow-xl active:scale-95"
            >
              Publicar mi oficio gratis
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
