import { useQuery } from "@tanstack/react-query";
import { Users, ClipboardList, CheckCircle2, Clock, TrendingUp, Zap } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";

function StatCard({
    icon: Icon,
    label,
    value,
    sub,
    color,
}: {
    icon: React.ElementType;
    label: string;
    value: number | string;
    sub?: string;
    color: string;
}) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-400">{label}</p>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
                    <Icon className="h-4 w-4 text-white" />
                </div>
            </div>
            <p className="font-display text-3xl font-bold text-white">{value}</p>
            {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
        </div>
    );
}

const AdminDashboard = () => {
    // Stats
    const { data: stats } = useQuery({
        queryKey: ["admin-stats"],
        queryFn: async () => {
            const [
                { count: totalProfesionales },
                { count: totalActivos },
                { count: pendientes },
                { count: aprobadas },
            ] = await Promise.all([
                supabase.from("profesionales").select("*", { count: "exact", head: true }),
                supabase.from("profesionales").select("*", { count: "exact", head: true }).eq("activo", true),
                supabase.from("solicitudes_registro").select("*", { count: "exact", head: true }).eq("estado", "pendiente"),
                supabase.from("solicitudes_registro").select("*", { count: "exact", head: true }).eq("estado", "aprobada"),
            ]);
            return {
                totalProfesionales: totalProfesionales ?? 0,
                totalActivos: totalActivos ?? 0,
                pendientes: pendientes ?? 0,
                aprobadas: aprobadas ?? 0,
            };
        },
        refetchInterval: 30000,
    });

    // Últimas solicitudes pendientes
    const { data: ultimasSolicitudes = [] } = useQuery({
        queryKey: ["admin-ultimas-solicitudes"],
        queryFn: async () => {
            const { data } = await supabase
                .from("solicitudes_registro")
                .select(`
          id, nombre, telefono, created_at, estado,
          categorias:categoria_id(nombre),
          zonas:zona_id(nombre)
        `)
                .eq("estado", "pendiente")
                .order("created_at", { ascending: false })
                .limit(5);
            return data ?? [];
        },
    });

    const formatFecha = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString("es-AR", {
            day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
        });
    };

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
                <p className="mt-1 text-sm text-slate-400">
                    Resumen general de OficiosSDE
                </p>
            </div>

            {/* Stats */}
            <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard
                    icon={Users}
                    label="Profesionales activos"
                    value={stats?.totalActivos ?? "—"}
                    sub={`${stats?.totalProfesionales ?? 0} en total`}
                    color="bg-primary"
                />
                <StatCard
                    icon={Clock}
                    label="Solicitudes pendientes"
                    value={stats?.pendientes ?? "—"}
                    sub="Requieren revisión"
                    color="bg-amber-500"
                />
                <StatCard
                    icon={CheckCircle2}
                    label="Solicitudes aprobadas"
                    value={stats?.aprobadas ?? "—"}
                    sub="Desde el inicio"
                    color="bg-emerald-500"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Tasa de aprobación"
                    value={
                        stats && (stats.aprobadas + stats.pendientes) > 0
                            ? `${Math.round((stats.aprobadas / (stats.aprobadas + stats.pendientes)) * 100)}%`
                            : "—"
                    }
                    sub="Del total de solicitudes"
                    color="bg-violet-500"
                />
            </div>

            {/* Últimas solicitudes pendientes */}
            <div className="rounded-xl border border-slate-800 bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-amber-400" />
                        <h2 className="font-display text-sm font-semibold text-white">
                            Solicitudes pendientes recientes
                        </h2>
                    </div>
                    <Link
                        to="/admin/solicitudes"
                        className="text-xs font-medium text-primary hover:text-primary/80"
                    >
                        Ver todas →
                    </Link>
                </div>

                {ultimasSolicitudes.length === 0 ? (
                    <div className="px-6 py-10 text-center">
                        <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-500" />
                        <p className="text-sm font-medium text-white">¡Sin pendientes!</p>
                        <p className="mt-1 text-xs text-slate-400">Todas las solicitudes están procesadas.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-800">
                        {ultimasSolicitudes.map((s: any) => (
                            <div key={s.id} className="flex items-center justify-between px-6 py-4">
                                <div>
                                    <p className="text-sm font-medium text-white">{s.nombre}</p>
                                    <p className="text-xs text-slate-400">
                                        {(s.categorias as any)?.nombre ?? "Sin oficio"} ·{" "}
                                        {(s.zonas as any)?.nombre ?? "Sin zona"} · {formatFecha(s.created_at)}
                                    </p>
                                </div>
                                <Link
                                    to="/admin/solicitudes"
                                    className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-500/20"
                                >
                                    Revisar
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
