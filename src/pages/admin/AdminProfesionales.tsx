import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    BadgeCheck,
    Star,
    Eye,
    EyeOff,
    Trash2,
    Loader2,
    Search,
    Download,
    Images,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase, db } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const AdminProfesionales = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [busqueda, setBusqueda] = useState("");

    // ── Exportar CSV ──────────────────────────────────────────────────────────
    const exportarCSV = async () => {
        const { data, error } = await supabase
            .from("profesionales")
            .select(`
                id, nombre, telefono, disponible, verificado,
                destacado, activo, contactos_count, created_at,
                categorias:categoria_id(nombre),
                zonas:zona_id(nombre)
            `)
            .order("created_at", { ascending: false });

        if (error || !data) {
            toast({ title: "Error al exportar", description: error?.message, variant: "destructive" });
            return;
        }

        const headers = ["ID", "Nombre", "Teléfono", "Categoría", "Zona", "Activo", "Verificado", "Destacado", "Disponible", "Contactos WA", "Fecha registro"];
        const rows = data.map((p: any) => [
            p.id,
            p.nombre,
            p.telefono,
            (p.categorias as any)?.nombre ?? "",
            (p.zonas as any)?.nombre ?? "",
            p.activo ? "Sí" : "No",
            p.verificado ? "Sí" : "No",
            p.destacado ? "Sí" : "No",
            p.disponible ? "Sí" : "No",
            p.contactos_count ?? 0,
            new Date(p.created_at).toLocaleDateString("es-AR"),
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((r) => r.map((v: any) => `"${String(v).replace(/"/g, '""')}"`).join(",")),
        ].join("\n");

        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `sde-profesionales-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        toast({ title: "✅ CSV exportado", description: `${data.length} profesionales exportados.` });
    };

    const { data: profesionales = [], isLoading } = useQuery({
        queryKey: ["admin-profesionales", busqueda],
        queryFn: async () => {
            let query = supabase
                .from("profesionales")
                .select(`
          id, nombre, telefono, disponible, verificado,
          destacado, activo, contactos_count, created_at,
          categorias:categoria_id(nombre),
          zonas:zona_id(nombre)
        `)
                .order("created_at", { ascending: false });

            if (busqueda.trim()) {
                query = query.ilike("nombre", `%${busqueda}%`);
            }

            const { data, error } = await query;
            if (error) throw new Error(error.message);
            return data ?? [];
        },
    });

    // Toggle genérico de campo booleano
    const toggleCampo = useMutation({
        mutationFn: async ({
            id,
            campo,
            valor,
        }: {
            id: string;
            campo: string;
            valor: boolean;
        }) => {
            const { error } = await db
                .from("profesionales")
                .update({ [campo]: valor })
                .eq("id", id);
            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-profesionales"] });
            queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
        },
        onError: (err: Error) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        },
    });

    // Eliminar profesional
    const eliminar = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await db.from("profesionales").delete().eq("id", id);
            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            toast({ title: "Profesional eliminado." });
            queryClient.invalidateQueries({ queryKey: ["admin-profesionales"] });
            queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
        },
        onError: (err: Error) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        },
    });

    const ToggleBtn = ({
        active,
        onToggle,
        title,
        icon: Icon,
        colorOn,
    }: {
        active: boolean;
        onToggle: () => void;
        title: string;
        icon: React.ElementType;
        colorOn: string;
    }) => (
        <button
            onClick={onToggle}
            title={title}
            className={`rounded-lg p-1.5 transition-colors ${active
                ? `${colorOn} text-white`
                : "bg-slate-800 text-slate-500 hover:text-slate-300"
                }`}
        >
            <Icon className="h-3.5 w-3.5" />
        </button>
    );

    return (
        <AdminLayout>
            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl font-bold text-white">
                        Profesionales
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">
                        Gestioná todos los perfiles del directorio.
                    </p>
                </div>
                <button
                    onClick={exportarCSV}
                    className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
                >
                    <Download className="h-4 w-4" />
                    Exportar CSV
                </button>
            </div>

            {/* Buscador */}
            <div className="mb-5 relative max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none"
                />
            </div>

            {/* Tabla */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-slate-800">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-900/50">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">
                                        Profesional
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">
                                        Oficio / Zona
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-400">
                                        Contactos
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-400">
                                        Activo
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-400">
                                        Verificado
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-400">
                                        Destacado
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-400">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 bg-slate-900">
                                {profesionales.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-10 text-center text-slate-500"
                                        >
                                            No se encontraron profesionales.
                                        </td>
                                    </tr>
                                ) : (
                                    profesionales.map((p: any) => (
                                        <tr
                                            key={p.id}
                                            className={`transition-colors hover:bg-slate-800/40 ${!p.activo ? "opacity-50" : ""
                                                }`}
                                        >
                                            {/* Nombre */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-white">
                                                        {p.nombre[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <Link
                                                            to={`/profesional/${p.id}`}
                                                            target="_blank"
                                                            className="font-medium text-white hover:text-primary"
                                                        >
                                                            {p.nombre}
                                                        </Link>
                                                        <p className="text-xs text-slate-500">{p.telefono}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Oficio / Zona */}
                                            <td className="px-4 py-3">
                                                <p className="text-white">
                                                    {(p.categorias as any)?.nombre ?? "—"}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {(p.zonas as any)?.nombre ?? "—"}
                                                </p>
                                            </td>

                                            {/* Contactos */}
                                            <td className="px-4 py-3 text-center">
                                                <span className="text-sm font-medium text-slate-300">
                                                    {p.contactos_count}
                                                </span>
                                            </td>

                                            {/* Toggle Activo */}
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex justify-center">
                                                    <ToggleBtn
                                                        active={p.activo}
                                                        icon={p.activo ? Eye : EyeOff}
                                                        colorOn="bg-emerald-500"
                                                        title={p.activo ? "Desactivar" : "Activar"}
                                                        onToggle={() =>
                                                            toggleCampo.mutate({
                                                                id: p.id,
                                                                campo: "activo",
                                                                valor: !p.activo,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </td>

                                            {/* Toggle Verificado */}
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex justify-center">
                                                    <ToggleBtn
                                                        active={p.verificado}
                                                        icon={BadgeCheck}
                                                        colorOn="bg-blue-500"
                                                        title={p.verificado ? "Quitar verificación" : "Verificar"}
                                                        onToggle={() =>
                                                            toggleCampo.mutate({
                                                                id: p.id,
                                                                campo: "verificado",
                                                                valor: !p.verificado,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </td>

                                            {/* Toggle Destacado */}
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex justify-center">
                                                    <ToggleBtn
                                                        active={p.destacado}
                                                        icon={Star}
                                                        colorOn="bg-amber-500"
                                                        title={p.destacado ? "Quitar destacado" : "Destacar"}
                                                        onToggle={() =>
                                                            toggleCampo.mutate({
                                                                id: p.id,
                                                                campo: "destacado",
                                                                valor: !p.destacado,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </td>

                                            {/* Acciones */}
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Link
                                                        to={`/admin/galeria/${p.id}`}
                                                        title="Gestionar galería"
                                                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                                                    >
                                                        <Images className="h-3.5 w-3.5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    `¿Eliminar a ${p.nombre}? Esta acción no se puede deshacer.`
                                                                )
                                                            ) {
                                                                eliminar.mutate(p.id);
                                                            }
                                                        }}
                                                        title="Eliminar profesional"
                                                        className="rounded-lg p-1.5 text-red-500/60 transition-colors hover:bg-red-500/10 hover:text-red-400"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminProfesionales;
