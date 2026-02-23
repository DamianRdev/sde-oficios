import { useQuery } from "@tanstack/react-query";
import { MessageCircle, TrendingUp, Phone, Award, Users } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";

const AdminAnalytics = () => {
    // Top profesionales por contactos
    const { data: topProfesionales = [], isLoading } = useQuery({
        queryKey: ["analytics-top-profesionales"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("profesionales")
                .select(`
                    id, nombre, telefono, contactos_count, activo, verificado,
                    categorias:categoria_id(nombre),
                    zonas:zona_id(nombre)
                `)
                .eq("activo", true)
                .order("contactos_count", { ascending: false })
                .limit(20);
            if (error) throw new Error(error.message);
            return data ?? [];
        },
        refetchInterval: 60000,
    });

    // Stats globales
    const { data: globalStats } = useQuery({
        queryKey: ["analytics-global"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("profesionales")
                .select("contactos_count, activo");
            if (error) throw new Error(error.message);
            const todos = (data ?? []) as any[];
            const totalContactos = todos.reduce((acc, p) => acc + (p.contactos_count ?? 0), 0);
            const conContactos = todos.filter((p) => (p.contactos_count ?? 0) > 0).length;
            const sinContactos = todos.filter((p) => (p.contactos_count ?? 0) === 0).length;
            const promedio = todos.length > 0 ? (totalContactos / todos.length).toFixed(1) : "0";
            return { totalContactos, conContactos, sinContactos, promedio, total: todos.length };
        },
    });

    const maxContactos = topProfesionales.length > 0
        ? Math.max(...topProfesionales.map((p: any) => p.contactos_count ?? 0))
        : 1;

    return (
        <AdminLayout>
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-display text-2xl font-bold text-white">Analytics</h1>
                <p className="mt-1 text-sm text-slate-400">
                    Contactos por WhatsApp · rendimiento del directorio
                </p>
            </div>

            {/* Stats globales */}
            <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs font-medium text-slate-400">Total contactos WA</p>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20">
                            <MessageCircle className="h-4 w-4 text-green-400" />
                        </div>
                    </div>
                    <p className="font-display text-3xl font-bold text-white">{globalStats?.totalContactos ?? "—"}</p>
                    <p className="mt-1 text-xs text-slate-500">acumulado histórico</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs font-medium text-slate-400">Promedio por prof.</p>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
                            <TrendingUp className="h-4 w-4 text-blue-400" />
                        </div>
                    </div>
                    <p className="font-display text-3xl font-bold text-white">{globalStats?.promedio ?? "—"}</p>
                    <p className="mt-1 text-xs text-slate-500">contactos promedio</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs font-medium text-slate-400">Con contactos</p>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
                            <Phone className="h-4 w-4 text-emerald-400" />
                        </div>
                    </div>
                    <p className="font-display text-3xl font-bold text-white">{globalStats?.conContactos ?? "—"}</p>
                    <p className="mt-1 text-xs text-slate-500">de {globalStats?.total ?? 0} profesionales</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs font-medium text-slate-400">Sin contactos</p>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20">
                            <Users className="h-4 w-4 text-amber-400" />
                        </div>
                    </div>
                    <p className="font-display text-3xl font-bold text-white">{globalStats?.sinContactos ?? "—"}</p>
                    <p className="mt-1 text-xs text-slate-500">requieren más visibilidad</p>
                </div>
            </div>

            {/* Ranking */}
            <div className="rounded-xl border border-slate-800 bg-slate-900">
                <div className="flex items-center gap-2 border-b border-slate-800 px-6 py-4">
                    <Award className="h-4 w-4 text-amber-400" />
                    <h2 className="font-display text-sm font-semibold text-white">
                        Top 20 — Más contactados por WhatsApp
                    </h2>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                ) : topProfesionales.length === 0 ? (
                    <div className="py-16 text-center">
                        <MessageCircle className="mx-auto mb-2 h-8 w-8 text-slate-600" />
                        <p className="text-sm text-slate-500">Aún no hay contactos registrados.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-800/50">
                        {topProfesionales.map((p: any, index: number) => {
                            const pct = maxContactos > 0
                                ? Math.round(((p.contactos_count ?? 0) / maxContactos) * 100)
                                : 0;
                            const medalColor =
                                index === 0 ? "text-amber-400"
                                    : index === 1 ? "text-slate-300"
                                        : index === 2 ? "text-amber-700"
                                            : "text-slate-600";

                            return (
                                <div key={p.id} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-800/30">
                                    {/* Posición */}
                                    <span className={`w-6 shrink-0 text-center text-sm font-bold ${medalColor}`}>
                                        {index < 3 ? ["🥇", "🥈", "🥉"][index] : index + 1}
                                    </span>

                                    {/* Avatar */}
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm font-bold text-white">
                                        {p.nombre[0].toUpperCase()}
                                    </div>

                                    {/* Info */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/profesional/${p.id}`}
                                                target="_blank"
                                                className="truncate text-sm font-medium text-white hover:text-primary"
                                            >
                                                {p.nombre}
                                            </Link>
                                            {p.verificado && (
                                                <span className="shrink-0 rounded-full bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">
                                                    ✓
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-0.5 truncate text-xs text-slate-500">
                                            {(p.categorias as any)?.nombre ?? "—"} · {(p.zonas as any)?.nombre ?? "—"}
                                        </p>

                                        {/* Barra de progreso */}
                                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                                            <div
                                                className="h-full rounded-full bg-green-500 transition-all duration-700"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Contador */}
                                    <div className="shrink-0 text-right">
                                        <p className="text-lg font-bold text-white">{p.contactos_count ?? 0}</p>
                                        <p className="text-[10px] text-slate-500 flex items-center gap-0.5 justify-end">
                                            <MessageCircle className="h-2.5 w-2.5" /> contactos
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminAnalytics;
