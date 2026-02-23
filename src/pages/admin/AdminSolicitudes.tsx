import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    CheckCircle2,
    XCircle,
    Clock,
    Phone,
    User,
    MessageCircle,
    ChevronDown,
    ChevronUp,
    Loader2,
    Images,
    Eye,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase, db } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type EstadoFiltro = "pendiente" | "aprobada" | "rechazada" | "todas";

const badgeEstado = {
    pendiente: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    aprobada: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    rechazada: "bg-red-500/10 text-red-400 border-red-500/30",
};

const AdminSolicitudes = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [filtro, setFiltro] = useState<EstadoFiltro>("pendiente");
    const [expandido, setExpandido] = useState<string | null>(null);
    const [notasAdmin, setNotasAdmin] = useState<Record<string, string>>({});

    // Cargar solicitudes
    const { data: solicitudes = [], isLoading } = useQuery({
        queryKey: ["admin-solicitudes", filtro],
        queryFn: async () => {
            let query = (supabase as any)
                .from("solicitudes_registro")
                .select(`
                    id, nombre, telefono, servicios_texto, horarios,
                    descripcion, estado, notas_admin, foto_url, created_at,
                    facebook_url, instagram_url, tiktok_url, galeria_urls,
                    categorias:categoria_id(id, nombre),
                    zonas:zona_id(id, nombre)
                `)
                .order("created_at", { ascending: false });

            if (filtro !== "todas") {
                query = query.eq("estado", filtro);
            }

            const { data, error } = await query;
            if (error) throw new Error(error.message);

            // Log de depuración para ver qué fotos llegan de la DB
            if (data && data.length > 0) {
                console.log("Solicitudes cargadas con galería:", data.filter(s => s.galeria_urls?.length > 0).length);
            }

            return data ?? [];
        },
    });

    // Aprobar solicitud → crea el profesional
    const aprobar = useMutation({
        mutationFn: async (solicitud: any) => {
            // 1. Crear el profesional
            const { data: prof, error: errProf } = await (supabase as any)
                .from("profesionales")
                .insert({
                    nombre: solicitud.nombre,
                    telefono: solicitud.telefono,
                    descripcion: solicitud.descripcion || null,
                    horarios: solicitud.horarios || null,
                    foto_url: solicitud.foto_url || null,
                    categoria_id: solicitud.categorias?.id,
                    zona_id: solicitud.zonas?.id,
                    disponible: true,
                    verificado: false,
                    destacado: false,
                    activo: true,
                    facebook_url: solicitud.facebook_url || null,
                    instagram_url: solicitud.instagram_url || null,
                    tiktok_url: solicitud.tiktok_url || null,
                })
                .select()
                .single();

            if (errProf) throw new Error(errProf.message);

            // 2. Agregar servicios si hay texto
            if (solicitud.servicios_texto && prof) {
                const servicios = solicitud.servicios_texto
                    .split(",")
                    .map((s: string) => s.trim())
                    .filter((s: string) => s.length > 0)
                    .map((desc: string) => ({
                        profesional_id: prof.id,
                        descripcion: desc,
                    }));

                if (servicios.length > 0) {
                    await (supabase as any).from("servicios").insert(servicios);
                }
            }

            // 3. Agregar fotos de la galería
            if (prof) {
                let urls: string[] = [];
                const raw = solicitud.galeria_urls;

                if (Array.isArray(raw)) {
                    urls = raw;
                } else if (typeof raw === 'string') {
                    if (raw.startsWith('[') && raw.endsWith(']')) {
                        try { urls = JSON.parse(raw); } catch (e) { urls = []; }
                    } else {
                        urls = raw.replace(/[{}]/g, '').split(',').map(u => u.trim()).filter(Boolean);
                    }
                }

                if (urls.length > 0) {
                    console.log(`Insertando ${urls.length} fotos en galería para profesional ${prof.id}`);
                    const fotosGaleria = urls.map((url: string, index: number) => ({
                        profesional_id: prof.id,
                        url,
                        orden: index,
                    }));
                    const { error: errGal } = await (supabase as any).from("galeria_trabajos").insert(fotosGaleria);
                    if (errGal) {
                        console.error("Error al insertar en galeria_trabajos:", errGal);
                        toast({ title: "Aviso", description: "El profesional fue creado pero hubo un error con sus fotos.", variant: "destructive" });
                    }
                } else {
                    console.log("No hay URLs de galería para transferir.");
                }
            }

            // 4. Actualizar el estado de la solicitud
            const { error: errSol } = await (supabase as any)
                .from("solicitudes_registro")
                .update({
                    estado: "aprobada",
                    notas_admin: notasAdmin[solicitud.id] || null,
                })
                .eq("id", solicitud.id);

            if (errSol) throw new Error(errSol.message);
        },
        onSuccess: () => {
            toast({ title: "✅ Solicitud aprobada", description: "El profesional ya está activo en el directorio." });
            queryClient.invalidateQueries({ queryKey: ["admin-solicitudes"] });
            queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
            queryClient.invalidateQueries({ queryKey: ["profesionales"] });
        },
        onError: (err: Error) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        },
    });

    // Rechazar solicitud
    const rechazar = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await (supabase as any)
                .from("solicitudes_registro")
                .update({
                    estado: "rechazada",
                    notas_admin: notasAdmin[id] || null,
                })
                .eq("id", id);
            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            toast({ title: "Solicitud rechazada", description: "El estado fue actualizado." });
            queryClient.invalidateQueries({ queryKey: ["admin-solicitudes"] });
            queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
        },
        onError: (err: Error) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        },
    });

    const formatFecha = (iso: string) =>
        new Date(iso).toLocaleDateString("es-AR", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });

    const filtros: { key: EstadoFiltro; label: string }[] = [
        { key: "pendiente", label: "Pendientes" },
        { key: "aprobada", label: "Aprobadas" },
        { key: "rechazada", label: "Rechazadas" },
        { key: "todas", label: "Todas" },
    ];

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="font-display text-2xl font-bold text-white">Solicitudes de registro</h1>
                <p className="mt-1 text-sm text-slate-400">
                    Revisá y aprobá los nuevos profesionales que quieran aparecer en el directorio.
                </p>
            </div>

            {/* Filtros */}
            <div className="mb-6 flex flex-wrap gap-2">
                {filtros.map((f) => (
                    <button
                        key={f.key}
                        onClick={() => setFiltro(f.key)}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${filtro === f.key
                            ? "bg-primary text-white"
                            : "bg-slate-800 text-slate-400 hover:text-white"
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Lista */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            ) : solicitudes.length === 0 ? (
                <div className="rounded-xl border border-slate-800 bg-slate-900 py-16 text-center">
                    <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-slate-600" />
                    <p className="text-sm font-medium text-slate-400">No hay solicitudes en este estado.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {solicitudes.map((s: any) => {
                        const isOpen = expandido === s.id;
                        const isProcessing =
                            (aprobar.isPending && (aprobar.variables as any)?.id === s.id) ||
                            (rechazar.isPending && rechazar.variables === s.id);

                        return (
                            <div
                                key={s.id}
                                className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
                            >
                                {/* Header de la tarjeta */}
                                <div
                                    className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 hover:bg-slate-800/50"
                                    onClick={() => setExpandido(isOpen ? null : s.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700 font-display text-sm font-bold text-white">
                                            {s.nombre[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{s.nombre}</p>
                                            <p className="text-xs text-slate-400">
                                                {(s.categorias as any)?.nombre ?? "Sin oficio"} ·{" "}
                                                {(s.zonas as any)?.nombre ?? "Sin zona"} · {formatFecha(s.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`hidden rounded-full border px-2.5 py-0.5 text-xs font-medium sm:inline-block ${badgeEstado[s.estado as keyof typeof badgeEstado]
                                                }`}
                                        >
                                            {s.estado}
                                        </span>
                                        {isOpen ? (
                                            <ChevronUp className="h-4 w-4 text-slate-400" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 text-slate-400" />
                                        )}
                                    </div>
                                </div>

                                {/* Detalle expandido */}
                                {isOpen && (
                                    <div className="border-t border-slate-800 px-5 py-5">
                                        <div className="grid gap-6 sm:grid-cols-2">
                                            <div className="space-y-4">
                                                {/* Foto de perfil */}
                                                {s.foto_url && (
                                                    <div>
                                                        <p className="mb-1.5 text-xs font-medium text-slate-500">Foto de perfil:</p>
                                                        <a href={s.foto_url} target="_blank" rel="noopener noreferrer">
                                                            <img
                                                                src={s.foto_url}
                                                                alt={s.nombre}
                                                                className="h-24 w-24 rounded-xl object-cover ring-1 ring-slate-700 hover:ring-primary transition-all"
                                                            />
                                                        </a>
                                                    </div>
                                                )}

                                                {/* Galería de trabajos - Movida arriba para mejor visibilidad */}
                                                {(() => {
                                                    let urls: string[] = [];
                                                    const raw = s.galeria_urls;

                                                    if (Array.isArray(raw)) {
                                                        urls = raw;
                                                    } else if (typeof raw === 'string') {
                                                        if (raw.startsWith('[') && raw.endsWith(']')) {
                                                            try { urls = JSON.parse(raw); } catch (e) { urls = []; }
                                                        } else {
                                                            urls = raw.replace(/[{}]/g, '').split(',').map(u => u.trim()).filter(Boolean);
                                                        }
                                                    }

                                                    if (urls.length === 0) return null;

                                                    return (
                                                        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
                                                            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                                                                <Images className="h-3.5 w-3.5 text-primary" />
                                                                Galería de Trabajos ({urls.length})
                                                            </p>
                                                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                                                {urls.map((url: string, idx: number) => (
                                                                    <a
                                                                        key={idx}
                                                                        href={url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="group relative aspect-video overflow-hidden rounded-lg bg-slate-900 ring-1 ring-slate-700 transition-all hover:ring-primary"
                                                                    >
                                                                        <img
                                                                            src={url}
                                                                            alt={`Trabajo ${idx + 1}`}
                                                                            className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                                                        />
                                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                                                            <Eye className="h-5 w-5 text-white" />
                                                                        </div>
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })()}

                                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                                    <Phone className="h-3.5 w-3.5 text-slate-500" />
                                                    <span>{s.telefono}</span>
                                                    <a
                                                        href={`https://wa.me/${s.telefono}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ml-1 text-emerald-400 hover:text-emerald-300"
                                                    >
                                                        <MessageCircle className="h-3.5 w-3.5" />
                                                    </a>
                                                </div>
                                                {s.horarios && (
                                                    <div className="flex items-start gap-2 text-sm text-slate-300">
                                                        <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
                                                        <span>{s.horarios}</span>
                                                    </div>
                                                )}
                                                {s.servicios_texto && (
                                                    <div>
                                                        <p className="mb-1 text-xs font-medium text-slate-500">Servicios:</p>
                                                        <p className="text-sm text-slate-300">{s.servicios_texto}</p>
                                                    </div>
                                                )}

                                                {/* Redes sociales */}
                                                {(s.facebook_url || s.instagram_url || s.tiktok_url) && (
                                                    <div>
                                                        <p className="mb-2 text-xs font-medium text-slate-500">Redes sociales:</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {s.facebook_url && (
                                                                <a href={s.facebook_url} target="_blank" rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#1877F2]/10 px-3 py-1.5 text-xs font-medium text-[#1877F2] hover:bg-[#1877F2]/20 transition-colors">
                                                                    <span className="font-bold">f</span> Facebook
                                                                </a>
                                                            )}
                                                            {s.instagram_url && (
                                                                <a href={s.instagram_url} target="_blank" rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-pink-500/10 px-3 py-1.5 text-xs font-medium text-pink-400 hover:bg-pink-500/20 transition-colors">
                                                                    <span>📸</span> Instagram
                                                                </a>
                                                            )}
                                                            {s.tiktok_url && (
                                                                <a href={s.tiktok_url} target="_blank" rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition-colors">
                                                                    <span className="font-black text-[10px]">Tk</span> TikTok
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Notas del admin y acciones */}
                                            <div className="space-y-4">
                                                {s.descripcion && (
                                                    <div className="rounded-lg bg-slate-800/40 p-3 ring-1 ring-slate-700/50">
                                                        <p className="mb-1 text-xs font-medium text-slate-500">Descripción del profesional:</p>
                                                        <p className="text-sm italic text-slate-300 leading-relaxed">"{s.descripcion}"</p>
                                                    </div>
                                                )}

                                                {s.estado === "pendiente" && (
                                                    <div className="space-y-3">
                                                        <div>
                                                            <label className="mb-1.5 block text-xs font-medium text-slate-400">
                                                                Notas internas (opcional)
                                                            </label>
                                                            <textarea
                                                                rows={3}
                                                                value={notasAdmin[s.id] ?? ""}
                                                                onChange={(e) =>
                                                                    setNotasAdmin((prev) => ({ ...prev, [s.id]: e.target.value }))
                                                                }
                                                                placeholder="Notas solo visibles para el admin..."
                                                                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none"
                                                            />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => aprobar.mutate(s)}
                                                                disabled={isProcessing}
                                                                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                                                            >
                                                                {isProcessing ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <CheckCircle2 className="h-4 w-4" />
                                                                )}
                                                                Aprobar
                                                            </button>
                                                            <button
                                                                onClick={() => rechazar.mutate(s.id)}
                                                                disabled={isProcessing}
                                                                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                                                            >
                                                                <XCircle className="h-4 w-4" />
                                                                Rechazar
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Notas si ya fue procesada */}
                                                {s.estado !== "pendiente" && s.notas_admin && (
                                                    <div className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3">
                                                        <p className="text-xs font-medium text-slate-400">Notas del admin:</p>
                                                        <p className="mt-1 text-sm text-slate-300">{s.notas_admin}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminSolicitudes;
