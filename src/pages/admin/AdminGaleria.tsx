import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Images, Upload, Trash2, Loader2, ArrowLeft, X } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useParams, Link } from "react-router-dom";

const MAX_MB = 5;
const BUCKET = "galeria-trabajos";

interface Foto {
    id: string;
    url: string;
    descripcion: string | null;
    orden: number;
    created_at: string;
}

const AdminGaleria = () => {
    const { id: profesionalId } = useParams<{ id: string }>();
    const { toast } = useToast();
    const qc = useQueryClient();
    const fileRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [descripcion, setDescripcion] = useState("");
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    // Datos del profesional
    const { data: profesional } = useQuery({
        queryKey: ["admin-prof-nombre", profesionalId],
        queryFn: async () => {
            const { data } = await supabase
                .from("profesionales")
                .select("nombre")
                .eq("id", profesionalId!)
                .single();
            return data;
        },
        enabled: !!profesionalId,
    });

    // Fotos de la galería
    const { data: fotos = [], isLoading } = useQuery<Foto[]>({
        queryKey: ["admin-galeria", profesionalId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("galeria_trabajos")
                .select("id, url, descripcion, orden, created_at")
                .eq("profesional_id", profesionalId!)
                .order("orden", { ascending: true })
                .order("created_at", { ascending: true });
            if (error) throw error;
            return (data ?? []) as Foto[];
        },
        enabled: !!profesionalId,
    });

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        if (f.size > MAX_MB * 1024 * 1024) {
            toast({ title: `Máximo ${MAX_MB}MB por foto`, variant: "destructive" });
            return;
        }
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const handleSubir = async () => {
        if (!file || !profesionalId) return;
        setUploading(true);
        try {
            const ext = file.name.split(".").pop();
            const path = `${profesionalId}/${Date.now()}.${ext}`;
            const { error: storageErr } = await supabase.storage
                .from(BUCKET)
                .upload(path, file, { cacheControl: "3600", upsert: false });
            if (storageErr) throw storageErr;

            const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
            // Cast as any: galeria_trabajos no está en los tipos generados de Supabase
            const { error: dbErr } = await (supabase as any).from("galeria_trabajos").insert({
                profesional_id: profesionalId,
                url: urlData.publicUrl,
                descripcion: descripcion.trim() || null,
                orden: fotos.length,
            });
            if (dbErr) throw dbErr;

            toast({ title: "✅ Foto subida correctamente" });
            setFile(null);
            setPreview(null);
            setDescripcion("");
            if (fileRef.current) fileRef.current.value = "";
            qc.invalidateQueries({ queryKey: ["admin-galeria", profesionalId] });
        } catch (err: any) {
            toast({ title: "Error al subir", description: err.message, variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    const eliminar = useMutation({
        mutationFn: async (foto: Foto) => {
            // Eliminar del storage
            const path = foto.url.split(`${BUCKET}/`)[1];
            if (path) {
                await supabase.storage.from(BUCKET).remove([path]);
            }
            // Eliminar de la BD
            const { error } = await supabase.from("galeria_trabajos").delete().eq("id", foto.id);
            if (error) throw error;
        },
        onSuccess: () => {
            toast({ title: "Foto eliminada" });
            qc.invalidateQueries({ queryKey: ["admin-galeria", profesionalId] });
        },
        onError: (err: Error) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        },
    });

    return (
        <AdminLayout>
            {/* Header */}
            <div className="mb-8">
                <Link
                    to="/admin/profesionales"
                    className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a Profesionales
                </Link>
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                        <Images className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="font-display text-2xl font-bold text-white">
                            Galería de trabajos
                        </h1>
                        <p className="text-sm text-slate-400">
                            {profesional?.nombre ?? "Cargando…"} · {fotos.length} foto{fotos.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
            </div>

            {/* Uploader */}
            <div className="mb-8 rounded-xl border border-slate-700 bg-slate-800/50 p-6">
                <h2 className="mb-4 text-sm font-semibold text-slate-300">Agregar foto</h2>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    {/* Preview / dropzone */}
                    <div
                        onClick={() => fileRef.current?.click()}
                        className="relative flex h-36 w-36 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-600 bg-slate-900 transition-colors hover:border-primary"
                    >
                        {preview ? (
                            <>
                                <img src={preview} className="h-full w-full object-cover" alt="preview" />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFile(null);
                                        setPreview(null);
                                        if (fileRef.current) fileRef.current.value = "";
                                    }}
                                    className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </>
                        ) : (
                            <div className="text-center">
                                <Upload className="mx-auto mb-1 h-6 w-6 text-slate-500" />
                                <p className="text-xs text-slate-500">Elegir foto</p>
                                <p className="text-[10px] text-slate-600">Máx {MAX_MB}MB</p>
                            </div>
                        )}
                    </div>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleFile}
                    />

                    {/* Descripción + botón */}
                    <div className="flex flex-1 flex-col gap-3">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-400">
                                Descripción (opcional)
                            </label>
                            <input
                                type="text"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                placeholder="Ej: Instalación eléctrica en local comercial"
                                maxLength={120}
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none"
                            />
                        </div>
                        <button
                            onClick={handleSubir}
                            disabled={!file || uploading}
                            className="inline-flex items-center gap-2 self-start rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {uploading
                                ? <Loader2 className="h-4 w-4 animate-spin" />
                                : <Upload className="h-4 w-4" />}
                            {uploading ? "Subiendo…" : "Subir foto"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid de fotos existentes */}
            {isLoading ? (
                <div className="flex justify-center py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            ) : fotos.length === 0 ? (
                <div className="rounded-xl border border-slate-800 bg-slate-900 py-16 text-center">
                    <Images className="mx-auto mb-3 h-10 w-10 text-slate-600" />
                    <p className="text-sm font-medium text-white">Sin fotos todavía</p>
                    <p className="mt-1 text-xs text-slate-500">Subí la primera foto del portfolio.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {fotos.map((foto) => (
                        <div key={foto.id} className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
                            <img
                                src={foto.url}
                                alt={foto.descripcion ?? "Foto de trabajo"}
                                className="aspect-square w-full object-cover"
                                loading="lazy"
                            />
                            {foto.descripcion && (
                                <p className="px-2 py-1.5 text-[11px] text-slate-400 line-clamp-2">
                                    {foto.descripcion}
                                </p>
                            )}
                            <button
                                onClick={() => {
                                    if (confirm("¿Eliminar esta foto?")) eliminar.mutate(foto);
                                }}
                                className="absolute right-2 top-2 rounded-lg bg-red-500/80 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                title="Eliminar foto"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminGaleria;
