import { useState, useRef, useCallback, useMemo } from "react";
import {
  Search, AlertCircle, ChevronLeft, ChevronRight, X, SlidersHorizontal, ChevronDown,
} from "lucide-react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TradeFilter from "@/components/TradeFilter";
import ProfessionalCard from "@/components/ProfessionalCard";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import SkeletonCard from "@/components/SkeletonCard";
import { useProfesionales } from "@/hooks/use-profesionales";
import { Button } from "@/components/ui/button";

const POR_PAGINA = 12;

/** Normaliza texto: quita tildes y pasa a minúsculas para búsqueda robusta */
const normalizar = (str: string) =>
  str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const Index = () => {
  const [categoriaSlug, setCategoriaSlug] = useState<string>("todos");
  const [zonaSlug, setZonaSlug] = useState<string>("todas");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const professionalsRef = useRef<HTMLDivElement>(null);

  // Carga todos (sin búsqueda en BD) — el filtro por servicio es instantáneo en cliente
  const { data, isLoading, isError, isFetching } = useProfesionales({
    categoriaSlug: categoriaSlug === "todos" ? undefined : categoriaSlug,
    zonaSlug: zonaSlug === "todas" ? undefined : zonaSlug,
    pagina,
    porPagina: POR_PAGINA,
  });

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

  const scrollToProfessionals = () =>
    professionalsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleCategoriaChange = useCallback((slug: string) => {
    setCategoriaSlug(slug);
    setPagina(1);
  }, []);

  const handleZonaChange = useCallback((slug: string) => {
    setZonaSlug(slug);
    setPagina(1);
  }, []);

  const handleBusqueda = useCallback((val: string) => {
    setBusqueda(val);
    setPagina(1);
  }, []);

  const limpiarFiltros = () => {
    setCategoriaSlug("todos");
    setZonaSlug("todas");
    setBusqueda("");
    setPagina(1);
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

        <HowItWorks />

        {/* ── SECCIÓN PROFESIONALES ── */}
        <section ref={professionalsRef} id="profesionales" className="bg-sde-gris py-8 md:py-14">
          <div className="container">

            {/* Encabezado de sección */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-sde-texto md:text-2xl">
                  Profesionales disponibles
                </h2>
                <p className="text-xs text-gray-500">{ctaLabel}</p>
              </div>
              {(hayBusqueda || hayFiltros) && (
                <button
                  onClick={limpiarFiltros}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-sde-rojo hover:text-sde-rojo transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  Limpiar filtros
                </button>
              )}
            </div>

            {/* ── Buscador rápido (debajo del hero en sección) ── */}
            <div className="mb-4 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="buscador-servicios"
                  placeholder="Buscar servicio… ej: pintura, cañería"
                  value={busqueda}
                  onChange={(e) => handleBusqueda(e.target.value)}
                  autoComplete="off"
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-9 text-sm text-sde-texto placeholder:text-gray-400 focus:border-sde-celeste focus:outline-none focus:ring-2 focus:ring-sde-celeste/20 transition-all shadow-sm"
                />
                {busqueda && (
                  <button
                    onClick={() => handleBusqueda("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sde-rojo transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {/* Toggle filtros avanzados */}
              <button
                onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
                className={`flex h-11 items-center gap-1.5 rounded-xl border px-3.5 text-sm font-medium shadow-sm transition-all ${hayFiltros
                    ? "border-sde-celeste bg-sde-celeste-claro text-sde-celeste"
                    : "border-gray-200 bg-white text-gray-600 hover:border-sde-celeste hover:text-sde-celeste"
                  }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filtros</span>
                {hayFiltros && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-sde-celeste text-[10px] font-bold text-white">
                    {(categoriaSlug !== "todos" ? 1 : 0) + (zonaSlug !== "todas" ? 1 : 0)}
                  </span>
                )}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${filtrosAbiertos ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {/* ── Filtros avanzados — desplegables ── */}
            {filtrosAbiertos && (
              <div className="mb-5 animate-fade-in rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <TradeFilter
                  selectedCategoriaSlug={categoriaSlug}
                  selectedZonaSlug={zonaSlug}
                  onCategoriaChange={handleCategoriaChange}
                  onZonaChange={handleZonaChange}
                />
              </div>
            )}

            {/* ── Estado: error ── */}
            {isError && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 py-12 text-center">
                <AlertCircle className="mb-3 h-8 w-8 text-sde-rojo" />
                <p className="font-medium text-sde-rojo">No se pudo cargar los profesionales</p>
                <p className="mt-1 text-sm text-gray-500">Verificá tu conexión e intentá de nuevo.</p>
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
                  <div className="rounded-xl border border-gray-200 bg-white px-6 py-14 text-center">
                    <Search className="mx-auto mb-3 h-10 w-10 text-gray-200" />
                    <p className="font-display text-lg font-semibold text-gray-500">
                      Sin resultados
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      {hayBusqueda
                        ? `No hay profesionales con servicios de "${busqueda}".`
                        : "Probá otro oficio o zona."}
                    </p>
                    <button
                      onClick={limpiarFiltros}
                      className="btn-outline mt-5 px-5 py-2 text-sm"
                    >
                      Ver todos
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
                    <span className="text-sm text-gray-500">
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
        <section className="bg-sde-celeste py-12 md:py-16">
          <div className="container text-center">
            <h2 className="mb-3 font-display text-2xl font-bold text-white md:text-3xl">
              ¿Sos profesional de un oficio?
            </h2>
            <p className="mx-auto mb-6 max-w-md text-sm text-white/80 md:text-base">
              Publicá tu perfil y recibí contactos reales de personas que necesitan tus servicios.
            </p>
            <a
              href="/registrarse"
              className="inline-flex items-center gap-2 rounded-xl bg-sde-rojo px-7 py-3.5 font-display text-sm font-bold text-white shadow-lg transition-all hover:bg-[#B50D0D] hover:shadow-xl active:scale-95"
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
