import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface ResenaFormProps {
    profesionalId: string;
    profesionalNombre: string;
}

const ResenaForm = ({ profesionalId, profesionalNombre }: ResenaFormProps) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [enviada, setEnviada] = useState(false);
    const [calificacion, setCalificacion] = useState(0);
    const [hover, setHover] = useState(0);
    const [autorNombre, setAutorNombre] = useState("");
    const [comentario, setComentario] = useState("");

    const enviar = useMutation({
        mutationFn: async () => {
            if (calificacion === 0) throw new Error("Seleccioná una calificación");
            if (!autorNombre.trim()) throw new Error("Ingresá tu nombre");

            const { error } = await supabase.from("resenas").insert({
                profesional_id: profesionalId,
                autor_nombre: autorNombre.trim(),
                calificacion: calificacion as 1 | 2 | 3 | 4 | 5,
                comentario: comentario.trim() || null,
                aprobada: false, // Requiere aprobación del admin
            });
            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            setEnviada(true);
            queryClient.invalidateQueries({ queryKey: ["resenas", profesionalId] });
        },
        onError: (err: Error) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        },
    });

    if (enviada) {
        return (
            <div className="flex items-center gap-3 rounded-xl border border-available/20 bg-available/5 p-5">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-available" />
                <div>
                    <p className="text-sm font-semibold text-card-foreground">¡Gracias por tu reseña!</p>
                    <p className="text-xs text-muted-foreground">
                        Será publicada luego de ser revisada por el equipo.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-display text-base font-semibold text-card-foreground">
                Dejá tu reseña sobre {profesionalNombre}
            </h3>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    enviar.mutate();
                }}
                className="space-y-4"
            >
                {/* Estrellas */}
                <div>
                    <label className="mb-2 block text-xs font-medium text-muted-foreground">
                        Calificación *
                    </label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setCalificacion(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star
                                    className={`h-7 w-7 transition-colors ${star <= (hover || calificacion)
                                            ? "fill-accent text-accent"
                                            : "text-muted-foreground/30"
                                        }`}
                                />
                            </button>
                        ))}
                        {calificacion > 0 && (
                            <span className="ml-2 self-center text-xs text-muted-foreground">
                                {["", "Muy malo", "Malo", "Regular", "Bueno", "Excelente"][calificacion]}
                            </span>
                        )}
                    </div>
                </div>

                {/* Nombre */}
                <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        Tu nombre *
                    </label>
                    <input
                        type="text"
                        value={autorNombre}
                        onChange={(e) => setAutorNombre(e.target.value)}
                        placeholder="Ej: María García"
                        maxLength={80}
                        required
                        disabled={enviar.isPending}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>

                {/* Comentario */}
                <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        Comentario (opcional)
                    </label>
                    <textarea
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        placeholder="Contá tu experiencia con este profesional..."
                        rows={3}
                        maxLength={500}
                        disabled={enviar.isPending}
                        className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>

                <button
                    type="submit"
                    disabled={enviar.isPending || calificacion === 0}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
                >
                    {enviar.isPending ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Enviando...
                        </>
                    ) : (
                        "Enviar reseña"
                    )}
                </button>
                <p className="text-center text-[11px] text-muted-foreground">
                    Las reseñas son revisadas antes de publicarse.
                </p>
            </form>
        </div>
    );
};

export default ResenaForm;
