import { Loader2, MapPin, Briefcase } from "lucide-react";
import { useCategorias, useZonas } from "@/hooks/use-categorias-zonas";

interface TradeFilterProps {
  selectedCategoriaSlug: string;
  selectedZonaSlug: string;
  onCategoriaChange: (slug: string) => void;
  onZonaChange: (slug: string) => void;
}

const TradeFilter = ({
  selectedCategoriaSlug,
  selectedZonaSlug,
  onCategoriaChange,
  onZonaChange,
}: TradeFilterProps) => {
  const { data: categorias = [], isLoading: loadingCat } = useCategorias();
  const { data: zonas = [], isLoading: loadingZonas } = useZonas();

  const pillCls = (active: boolean) =>
    `filter-pill ${active ? "active" : "inactive"}`;

  return (
    <div className="flex flex-col gap-5">

      {/* Filtro por oficio */}
      <div>
        <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Briefcase className="h-3.5 w-3.5 text-primary" />
          Oficio
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoriaChange("todos")}
            className={pillCls(selectedCategoriaSlug === "todos")}
          >
            Todos
          </button>

          {loadingCat ? (
            <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              Cargando...
            </div>
          ) : (
            categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoriaChange(cat.slug)}
                className={pillCls(selectedCategoriaSlug === cat.slug)}
              >
                {cat.nombre}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Separador */}
      <div className="h-px bg-border/50" />

      {/* Filtro por zona */}
      <div>
        <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          Zona
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onZonaChange("todas")}
            className={pillCls(selectedZonaSlug === "todas")}
          >
            Todas
          </button>

          {loadingZonas ? (
            <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            </div>
          ) : (
            zonas.map((zona) => (
              <button
                key={zona.id}
                onClick={() => onZonaChange(zona.slug)}
                className={pillCls(selectedZonaSlug === zona.slug)}
              >
                {zona.nombre}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TradeFilter;
