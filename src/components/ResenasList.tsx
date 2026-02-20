import { useQuery } from "@tanstack/react-query";
import { Star, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ResenaRow {
    id: string;
    autor_nombre: string;
    calificacion: number;
    comentario: string | null;
    created_at: string;
}

const ResenasList = ({ profesionalId }: { profesionalId: string }) => {
    const { data: resenas = [], isLoading } = useQuery<ResenaRow[]>({
        queryKey: ["resenas", profesionalId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("resenas")
                .select("id, autor_nombre, calificacion, comentario, created_at")
                .eq("profesional_id", profesionalId)
                .eq("aprobada", true)
                .order("created_at", { ascending: false });
            if (error) throw new Error(error.message);
            return data ?? [];
        },
        staleTime: 1000 * 60 * 5,
    });

    if (isLoading) return null;
    if (resenas.length === 0) return null;

    const formatFecha = (iso: string) =>
        new Date(iso).toLocaleDateString("es-AR", {
            day: "2-digit", month: "long", year: "numeric",
        });

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <h2 className="font-display text-lg font-semibold text-card-foreground">
                    Reseñas ({resenas.length})
                </h2>
            </div>

            <div className="space-y-4">
                {resenas.map((r) => (
                    <div
                        key={r.id}
                        className="rounded-lg border border-border/50 bg-background p-4"
                    >
                        <div className="mb-2 flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                                {/* Avatar */}
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
                                    {r.autor_nombre[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-card-foreground">
                                        {r.autor_nombre}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                        {formatFecha(r.created_at)}
                                    </p>
                                </div>
                            </div>
                            {/* Estrellas */}
                            <div className="flex gap-0.5 shrink-0">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        className={`h-3.5 w-3.5 ${s <= r.calificacion
                                                ? "fill-accent text-accent"
                                                : "text-muted-foreground/20"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                        {r.comentario && (
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                "{r.comentario}"
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResenasList;
