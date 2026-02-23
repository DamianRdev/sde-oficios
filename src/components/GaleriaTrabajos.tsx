import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Images, X, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Foto {
    id: string;
    url: string;
    descripcion: string | null;
    orden: number;
}

interface Props {
    profesionalId: string;
    profesionalNombre: string;
}

const GaleriaTrabajos = ({ profesionalId, profesionalNombre }: Props) => {
    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

    const { data: fotos = [] } = useQuery<Foto[]>({
        queryKey: ["galeria", profesionalId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("galeria_trabajos")
                .select("id, url, descripcion, orden")
                .eq("profesional_id", profesionalId)
                .order("orden", { ascending: true })
                .order("created_at", { ascending: true });
            if (error) throw error;
            return (data ?? []) as Foto[];
        },
        staleTime: 1000 * 60 * 5,
    });

    if (fotos.length === 0) return null;

    const prev = () =>
        setLightboxIdx((i) => (i !== null ? (i - 1 + fotos.length) % fotos.length : null));
    const next = () =>
        setLightboxIdx((i) => (i !== null ? (i + 1) % fotos.length : null));

    return (
        <>
            {/* Sección galería */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                    <Images className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-lg font-semibold text-card-foreground">
                        Trabajos realizados
                    </h2>
                    <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {fotos.length} foto{fotos.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* Grid de miniaturas */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {fotos.map((foto, idx) => (
                        <button
                            key={foto.id}
                            onClick={() => setLightboxIdx(idx)}
                            className="group relative aspect-square overflow-hidden rounded-lg bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                            title={foto.descripcion ?? "Ver foto"}
                        >
                            <img
                                src={foto.url}
                                alt={foto.descripcion ?? `Trabajo ${idx + 1} de ${profesionalNombre}`}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                            />
                            {foto.descripcion && (
                                <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/70 px-2 py-1 text-[11px] text-white transition-transform duration-200 group-hover:translate-y-0">
                                    {foto.descripcion}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {lightboxIdx !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                    onClick={() => setLightboxIdx(null)}
                >
                    {/* Cerrar */}
                    <button
                        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                        onClick={() => setLightboxIdx(null)}
                    >
                        <X className="h-5 w-5" />
                    </button>

                    {/* Contador */}
                    <p className="absolute top-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
                        {lightboxIdx + 1} / {fotos.length}
                    </p>

                    {/* Prev */}
                    {fotos.length > 1 && (
                        <button
                            className="absolute left-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                            onClick={(e) => { e.stopPropagation(); prev(); }}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                    )}

                    {/* Imagen */}
                    <div
                        className="max-h-[85vh] max-w-4xl w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={fotos[lightboxIdx].url}
                            alt={fotos[lightboxIdx].descripcion ?? `Trabajo ${lightboxIdx + 1}`}
                            className="mx-auto max-h-[80vh] max-w-full rounded-lg object-contain shadow-2xl"
                        />
                        {fotos[lightboxIdx].descripcion && (
                            <p className="mt-3 text-center text-sm text-white/80">
                                {fotos[lightboxIdx].descripcion}
                            </p>
                        )}
                    </div>

                    {/* Next */}
                    {fotos.length > 1 && (
                        <button
                            className="absolute right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                            onClick={(e) => { e.stopPropagation(); next(); }}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    )}
                </div>
            )}
        </>
    );
};

export default GaleriaTrabajos;
