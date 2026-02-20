import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    CheckCircle2,
    XCircle,
    Star,
    Loader2,
    MessageSquare,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { db } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const AdminResenas = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: resenas = [], isLoading } = useQuery({
        queryKey: ["admin-resenas"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("resenas")
                .select(`
          id, autor_nombre, calificacion, comentario,
          aprobada, created_at,
          profesionales:profesional_id(id, nombre)
        `)
                .order("created_at", { ascending: false });
            if (error) throw new Error(error.message);
            return data ?? [];
        },
    });

    const cambiarEstado = useMutation({
        mutationFn: async ({ id, aprobada }: { id: string; aprobada: boolean }) => {
            const { error } = await db
                .from("resenas")
                .update({ aprobada })
                .eq("id", id);
            if (error) throw new Error(error.message);
        },
        onSuccess: (_, vars) => {
            toast({
                title: vars.aprobada ? "✅ Reseña aprobada" : "Reseña rechazada",
            });
            queryClient.invalidateQueries({ queryKey: ["admin-resenas"] });
            queryClient.invalidateQueries({ queryKey: ["profesionales"] });
        },
        onError: (err: Error) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        },
    });

    const eliminar = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await db.from("resenas").delete().eq("id", id);
            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            toast({ title: "Reseña eliminada." });
            queryClient.invalidateQueries({ queryKey: ["admin-resenas"] });
        },
    });

    const pendientes = resenas.filter((r: any) => !r.aprobada).length;

    return (
        <AdminLayout>
            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <h1 className="font-display text-2xl font-bold text-white">Reseñas</h1>
                    {pendientes > 0 && (
                        <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
                            {pendientes} pendiente{pendientes !== 1 ? "s" : ""}
                        </span>
                    )}
                </div>
                <p className="mt-1 text-sm text-slate-400">
                    Aprobá o rechazá las reseñas enviadas por los usuarios.
                </p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            ) : resenas.length === 0 ? (
                <div className="rounded-xl border border-slate-800 bg-slate-900 py-16 text-center">
                    <MessageSquare className="mx-auto mb-3 h-10 w-10 text-slate-600" />
                    <p className="text-sm text-slate-400">No hay reseñas todavía.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {resenas.map((r: any) => (
                        <div
                            key={r.id}
                            className={`overflow-hidden rounded-xl border bg-slate-900 ${r.aprobada ? "border-slate-800" : "border-amber-500/30"
                                }`}
                        >
                            <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
                                <div className="flex items-start gap-3">
                                    {/* Avatar */}
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700 font-display text-sm font-bold text-white">
                                        {r.autor_nombre[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-white">
                                                {r.autor_nombre}
                                            </p>
                                            <span
                                                className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${r.aprobada
                                                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                                        : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                                                    }`}
                                            >
                                                {r.aprobada ? "Aprobada" : "Pendiente"}
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-xs text-slate-400">
                                            Sobre:{" "}
                                            <span className="text-slate-300">
                                                {(r.profesionales as any)?.nombre ?? "—"}
                                            </span>
                                        </p>
                                        {/* Estrellas */}
                                        <div className="mt-1.5 flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star
                                                    key={s}
                                                    className={`h-3.5 w-3.5 ${s <= r.calificacion
                                                            ? "fill-amber-400 text-amber-400"
                                                            : "text-slate-600"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        {r.comentario && (
                                            <p className="mt-2 max-w-lg text-sm text-slate-300">
                                                "{r.comentario}"
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Acciones */}
                                <div className="flex items-center gap-2">
                                    {!r.aprobada ? (
                                        <button
                                            onClick={() => cambiarEstado.mutate({ id: r.id, aprobada: true })}
                                            className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition"
                                        >
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            Aprobar
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => cambiarEstado.mutate({ id: r.id, aprobada: false })}
                                            className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition"
                                        >
                                            Ocultar
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            if (confirm("¿Eliminar esta reseña?")) eliminar.mutate(r.id);
                                        }}
                                        className="rounded-lg p-1.5 text-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition"
                                        title="Eliminar"
                                    >
                                        <XCircle className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminResenas;
