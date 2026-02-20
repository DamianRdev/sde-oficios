import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2, Loader2, AlertCircle, Camera, X,
  Eye, EyeOff, Plus, BadgeCheck, MapPin, Clock, Star, MessageCircle,
  Facebook, Instagram, ChevronDown, Sparkles,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCategorias, useZonas } from "@/hooks/use-categorias-zonas";
import { supabase, db } from "@/lib/supabase";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "";
const EMAILJS_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_SOLICITUD ?? "";
const EMAILJS_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "";
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? "";
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? "";
const MAX_FOTO_MB = 3;

/**
 * Llama a Gemini 2.0 Flash para corregir ortografía y mejorar el texto.
 * Retorna { texto } en éxito o { error } con mensaje legible según el código HTTP.
 */
async function mejorarTextoConIA(
  texto: string
): Promise<{ texto: string } | { error: string }> {
  if (!GEMINI_KEY) return { error: "Sin API key configurada." };
  if (!texto.trim()) return { error: "El campo está vacío." };

  const prompt = `Sos un asistente que ayuda a profesionales del hogar en Argentina a presentarse mejor.
Corregí la ortografía, mejorá el texto y hacélo más profesional y atractivo para clientes.
Mantené el estilo coloquial argentino (vos, etc.). Devolvé SOLO el texto mejorado,
sin explicaciones ni comillas, en máximo 300 caracteres.

Texto original: "${texto}"`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 200 },
        }),
      }
    );

    if (res.status === 429)
      return { error: "Demasiadas solicitudes. Esperá unos segundos e intentá de nuevo." };
    if (res.status === 403 || res.status === 400)
      return { error: "API key inválida o sin permisos. Revisá tu configuración." };
    if (!res.ok)
      return { error: `Error de la API (${res.status}). Intentá de nuevo.` };

    const json = await res.json();
    const mejorado = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!mejorado) return { error: "La IA no devolvió respuesta. Intentá de nuevo." };

    return { texto: mejorado };
  } catch {
    return { error: "Sin conexión a internet. Revisá tu red." };
  }
}

// Tags de oficios adicionales predefinidos (para el selector rápido)
const OFICIOS_ADICIONALES = [
  "Pintura", "Plomería", "Electricidad", "Albañilería", "Gasista", "Carpintería",
  "Herrería", "Techista", "Jardinería", "Fumigación", "Limpieza", "Mudanzas",
  "Aire acondicionado", "Cerrajería", "Computadoras", "Refrigeración",
];

// ── Mini preview de card ─────────────────────────────────────────────────────
const CardPreview = ({
  nombre, categoria, zona, descripcion, servicios, fotoPreview,
}: {
  nombre: string; categoria: string; zona: string;
  descripcion: string; servicios: string[]; fotoPreview: string | null;
}) => {
  const initials = nombre
    ? nombre.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "TU";

  return (
    <div className="rounded-xl border-2 border-sde-celeste/30 bg-white shadow-md overflow-hidden">
      {/* Header de preview */}
      <div className="flex items-center gap-2 bg-sde-celeste-claro px-4 py-2 text-xs font-semibold text-sde-celeste">
        <Eye className="h-3.5 w-3.5" />
        Vista previa de tu perfil
      </div>

      {/* Banner destacado */}
      <div className="flex items-center gap-1.5 bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-700">
        <Star className="h-3 w-3 fill-sde-dorado text-sde-dorado" />
        Destacado
      </div>

      <div className="flex gap-3 p-4">
        {/* Avatar */}
        {fotoPreview ? (
          <img src={fotoPreview} alt="Tu foto" className="h-16 w-16 shrink-0 rounded-xl object-cover ring-2 ring-gray-100" />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-sde-celeste-claro font-display text-2xl font-bold text-sde-celeste">
            {initials}
          </div>
        )}

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[15px] font-bold text-sde-texto">
            {nombre || "Tu nombre"}
          </p>
          <div className="mt-0.5 flex flex-wrap gap-1.5">
            <span className="badge-celeste text-[11px]">{categoria || "Tu oficio"}</span>
            <span className="inline-flex items-center gap-0.5 rounded-full border border-sde-celeste/20 bg-sde-celeste/10 px-1.5 py-0.5 text-[10px] font-semibold text-sde-celeste">
              <BadgeCheck className="h-2.5 w-2.5" /> Verificado
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span className="inline-flex items-center gap-0.5">
              <MapPin className="h-3 w-3 text-sde-celeste" />{zona || "Tu zona"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 font-medium text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />Disponible
            </span>
          </div>
        </div>
      </div>

      {/* Descripción */}
      {descripcion && (
        <p className="px-4 pb-3 text-xs leading-relaxed text-gray-500 line-clamp-2">{descripcion}</p>
      )}

      {/* Servicios */}
      {servicios.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {servicios.slice(0, 4).map((s) => (
            <span key={s} className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">{s}</span>
          ))}
          {servicios.length > 4 && (
            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">+{servicios.length - 4} más</span>
          )}
        </div>
      )}

      {/* Botón WhatsApp */}
      <div className="flex gap-2 px-4 pb-4">
        <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-bold text-white" style={{ minHeight: 48 }}>
          <MessageCircle className="h-4 w-4" />
          Contactar por WhatsApp
        </div>
        <div className="flex items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600" style={{ minHeight: 48 }}>
          Ver
        </div>
      </div>
    </div>
  );
};

// ── Componente de tag de servicio ────────────────────────────────────────────
const TagInput = ({
  tags, onChange, disabled,
}: { tags: string[]; onChange: (tags: string[]) => void; disabled: boolean }) => {
  const [input, setInput] = useState("");

  const addTag = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed || tags.includes(trimmed) || tags.length >= 12) return;
    onChange([...tags, trimmed]);
    setInput("");
  };

  const removeTag = (tag: string) => onChange(tags.filter((t) => t !== tag));

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Tags existentes */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-sde-celeste-claro px-3 py-1 text-sm font-medium text-sde-celeste"
            >
              {tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-0.5 rounded-full text-sde-celeste/60 hover:text-sde-rojo transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Input para escribir */}
      <div className="flex gap-2">
        <Input
          placeholder={tags.length >= 12 ? "Máx. 12 trabajos" : "Escribí un trabajo y presioná Enter…"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled || tags.length >= 12}
          maxLength={50}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addTag(input)}
          disabled={disabled || !input.trim() || tags.length >= 12}
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Sugerencias rápidas */}
      <div>
        <p className="mb-2 text-xs text-gray-400">Sugerencias rápidas:</p>
        <div className="flex flex-wrap gap-1.5">
          {OFICIOS_ADICIONALES.filter((o) => !tags.includes(o)).slice(0, 8).map((oficio) => (
            <button
              key={oficio}
              type="button"
              onClick={() => addTag(oficio)}
              disabled={disabled || tags.length >= 12}
              className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-600 transition-all hover:border-sde-celeste hover:bg-sde-celeste-claro hover:text-sde-celeste disabled:opacity-40"
            >
              + {oficio}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Página principal ─────────────────────────────────────────────────────────
const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [iaLoading, setIaLoading] = useState(false);
  const [iaMejoro, setIaMejoro] = useState(false);

  const { data: categorias = [], isLoading: loadingCategorias } = useCategorias();
  const { data: zonas = [], isLoading: loadingZonas } = useZonas();

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    categoria_id: "",
    zona_id: "",
    horarios: "",
    descripcion: "",
    facebook_url: "",
    instagram_url: "",
    tiktok_url: "",
  });
  const [mostrarRedes, setMostrarRedes] = useState(false);
  const [trabajosExtra, setTrabajosExtra] = useState<string[]>([]); // Tags adicionales
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  const handleChange = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FOTO_MB * 1024 * 1024) {
      toast({ title: "Foto muy grande", description: `Máx. ${MAX_FOTO_MB} MB.`, variant: "destructive" });
      return;
    }
    setFoto(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nombre || !form.telefono || !form.categoria_id || !form.zona_id) {
      toast({ title: "Campos obligatorios", description: "Completá nombre, teléfono, oficio y zona.", variant: "destructive" });
      return;
    }
    const telefonoLimpio = form.telefono.replace(/\D/g, "");
    if (telefonoLimpio.length < 10) {
      toast({ title: "Teléfono inválido", description: "Ingresá el número con código de país (ej: 5493854123456).", variant: "destructive" });
      return;
    }

    setLoading(true);
    let foto_url: string | null = null;

    try {
      if (foto) {
        const ext = foto.name.split(".").pop();
        const fileName = `solicitud-${Date.now()}.${ext}`;
        const { data: storageData, error: storageError } = await supabase.storage
          .from("fotos-profesionales")
          .upload(fileName, foto, { upsert: false, contentType: foto.type });

        if (storageError) {
          console.warn("No se pudo subir la foto:", storageError.message);
        } else {
          foto_url = supabase.storage.from("fotos-profesionales").getPublicUrl(storageData.path).data.publicUrl;
        }
      }

      // Combinar categoría principal + trabajos extra en servicios_texto
      const categoriaNombre = categorias.find((c) => c.id === form.categoria_id)?.nombre ?? "";
      const todosLosServicios = [categoriaNombre, ...trabajosExtra].filter(Boolean);
      const servicios_texto = todosLosServicios.join(", ");

      const { error } = await db.from("solicitudes_registro").insert({
        nombre: form.nombre.trim(),
        telefono: telefonoLimpio,
        categoria_id: form.categoria_id || null,
        zona_id: form.zona_id || null,
        servicios_texto: servicios_texto || null,
        horarios: form.horarios.trim() || null,
        descripcion: form.descripcion.trim() || null,
        foto_url,
        facebook_url: form.facebook_url.trim() || null,
        instagram_url: form.instagram_url.trim() || null,
        tiktok_url: form.tiktok_url.trim() || null,
      });

      if (error) throw new Error(error.message);

      if (EMAILJS_SERVICE && EMAILJS_TEMPLATE && EMAILJS_KEY && ADMIN_EMAIL) {
        const zonaNombre = zonas.find((z) => z.id === form.zona_id)?.nombre ?? "—";
        emailjs.send(
          EMAILJS_SERVICE, EMAILJS_TEMPLATE,
          {
            admin_email: ADMIN_EMAIL,
            nombre: form.nombre.trim(),
            telefono: telefonoLimpio,
            oficio: categoriaNombre,
            zona: zonaNombre,
            servicios: servicios_texto || "—",
            horarios: form.horarios || "—",
            descripcion: form.descripcion || "—",
            panel_url: `${window.location.origin}/admin/solicitudes`,
          },
          EMAILJS_KEY
        ).catch((err) => console.warn("EmailJS:", err));
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Error al enviar solicitud:", err);
      toast({ title: "Error al enviar", description: "Hubo un problema. Intentá de nuevo.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ─── Pantalla de éxito ──────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center py-16">
          <div className="container max-w-md text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="mb-2 font-display text-2xl font-bold text-sde-texto">¡Solicitud enviada!</h1>
            <p className="mb-2 text-gray-600">
              Recibimos tus datos correctamente. Te contactaremos por WhatsApp para verificar tu perfil.
            </p>
            <p className="mb-6 text-sm text-gray-500">
              El proceso suele tardar hasta <strong>24 horas hábiles</strong>.
            </p>
            <Button onClick={() => navigate("/")} className="bg-sde-celeste text-white hover:bg-sde-celeste-hover">
              Volver al inicio
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── Datos para preview ─────────────────────────────────────────────────
  const categoriaNombrePreview = categorias.find((c) => c.id === form.categoria_id)?.nombre ?? "";
  const zonaNombrePreview = zonas.find((z) => z.id === form.zona_id)?.nombre ?? "";

  // ─── Formulario ─────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container max-w-2xl">

          <div className="mb-8">
            <h1 className="mb-2 font-display text-2xl font-bold text-sde-texto md:text-3xl">
              Publicá tu oficio
            </h1>
            <p className="text-gray-500">Completá el formulario y empezá a recibir contactos reales.</p>
          </div>

          <div className="mb-6 flex items-start gap-3 rounded-lg border border-sde-dorado/30 bg-sde-dorado/10 p-4">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-sm text-gray-700">
              Tu perfil será revisado por nuestro equipo antes de aparecer en el directorio.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">

            {/* ── Foto de perfil ── */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <div
                className="relative flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 transition-colors hover:border-sde-celeste"
                onClick={() => fileRef.current?.click()}
              >
                {fotoPreview ? (
                  <>
                    <img src={fotoPreview} alt="Preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFoto(null); setFotoPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-sde-rojo text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <Camera className="h-7 w-7 text-gray-400" />
                )}
              </div>
              <div>
                <Label className="block">Foto de perfil</Label>
                <p className="mb-2 text-xs text-gray-400">JPG o PNG, máx. {MAX_FOTO_MB} MB. Opcional pero recomendada.</p>
                <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={loading}>
                  {fotoPreview ? "Cambiar foto" : "Subir foto"}
                </Button>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFoto} />
              </div>
            </div>

            {/* ── Nombre y Teléfono ── */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre o nombre comercial *</Label>
                <Input id="nombre" placeholder="Ej: Carlos Herrera" value={form.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)} maxLength={100} disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono WhatsApp *</Label>
                <Input id="telefono" placeholder="Ej: 5493854123456" value={form.telefono}
                  onChange={(e) => handleChange("telefono", e.target.value)} maxLength={20} disabled={loading} />
                <p className="text-xs text-gray-400">Con código de país, sin espacios</p>
              </div>
            </div>

            {/* ── Zona ── */}
            <div className="space-y-2">
              <Label>Zona *</Label>
              <Select onValueChange={(val) => handleChange("zona_id", val)} disabled={loading || loadingZonas}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingZonas ? "Cargando..." : "Seleccioná tu zona"} />
                </SelectTrigger>
                <SelectContent>
                  {zonas.map((zona) => (
                    <SelectItem key={zona.id} value={zona.id}>{zona.nombre} — {zona.provincia}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ── Categoría PRINCIPAL ── */}
            <div className="space-y-2 rounded-xl border-2 border-sde-celeste/30 bg-sde-celeste-claro p-5">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-sde-dorado text-sde-dorado" />
                <Label className="text-sde-celeste font-semibold text-sm">Categoría principal *</Label>
              </div>
              <p className="text-xs text-gray-500">Este es el oficio con el que te destacás. Aparecerá como badge principal en tu card.</p>
              <Select onValueChange={(val) => handleChange("categoria_id", val)} disabled={loading || loadingCategorias}>
                <SelectTrigger className="border-sde-celeste/40 bg-white">
                  <SelectValue placeholder={loadingCategorias ? "Cargando..." : "Seleccioná tu oficio principal"} />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {categoriaNombrePreview && (
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="badge-celeste">{categoriaNombrePreview}</span>
                  <span className="text-xs text-gray-400">← así aparece en tu card</span>
                </div>
              )}
            </div>

            {/* ── Trabajos adicionales (tags) ── */}
            <div className="space-y-3">
              <div>
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  También realizás
                </Label>
                <p className="mt-0.5 text-xs text-gray-400">
                  Agregá otros trabajos que sabés hacer — aparecerán como etiquetas en tu perfil y mejoran tu visibilidad en búsquedas.
                </p>
              </div>
              <TagInput tags={trabajosExtra} onChange={setTrabajosExtra} disabled={loading} />
            </div>

            {/* ── Horarios ── */}
            <div className="space-y-2">
              <Label htmlFor="horarios">
                <Clock className="mr-1.5 inline h-4 w-4 text-gray-400" />
                Horarios de atención
              </Label>
              <Input id="horarios" placeholder="Ej: Lunes a Viernes 8:00 - 18:00"
                value={form.horarios} onChange={(e) => handleChange("horarios", e.target.value)}
                maxLength={200} disabled={loading} />
            </div>

            {/* ── Descripción + Vista previa ── */}
            <div className="space-y-3">
              {/* Fila de acciones */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label htmlFor="descripcion">Contanos sobre vos</Label>
                <div className="flex items-center gap-2">

                  {/* Botón Mejorar con IA */}
                  {GEMINI_KEY && (
                    <button
                      type="button"
                      disabled={iaLoading || loading || !form.descripcion.trim()}
                      onClick={async () => {
                        setIaLoading(true);
                        setIaMejoro(false);
                        const resultado = await mejorarTextoConIA(form.descripcion);
                        setIaLoading(false);
                        if ("texto" in resultado) {
                          handleChange("descripcion", resultado.texto);
                          setIaMejoro(true);
                          setTimeout(() => setIaMejoro(false), 4000);
                        } else {
                          toast({
                            title: "No se pudo mejorar",
                            description: resultado.error,
                            variant: "destructive",
                          });
                        }
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-violet-300 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition-all hover:bg-violet-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {iaLoading
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <Sparkles className="h-3.5 w-3.5" />}
                      {iaLoading ? "Mejorando…" : "✨ Mejorar con IA"}
                    </button>
                  )}

                  {/* Botón preview */}
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-sde-celeste/30 bg-sde-celeste-claro px-3 py-1.5 text-xs font-semibold text-sde-celeste transition-all hover:bg-sde-celeste hover:text-white"
                  >
                    {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    {showPreview ? "Ocultar" : "Ver preview"}
                  </button>
                </div>
              </div>
              <Textarea
                id="descripcion"
                placeholder="Tu experiencia, años en el rubro, certificaciones, especialidades…"
                value={form.descripcion}
                onChange={(e) => handleChange("descripcion", e.target.value)}
                rows={4}
                maxLength={500}
                disabled={loading || iaLoading}
                className={iaLoading ? "opacity-60" : ""}
              />

              {/* Feedback de IA */}
              {iaMejoro && (
                <div className="flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-medium text-violet-700 animate-fade-in">
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  ¡Texto mejorado por IA! Revisalo y editalo si querés.
                </div>
              )}

              <p className="text-xs text-gray-400">{form.descripcion.length}/500 caracteres</p>

              {/* Preview de card en tiempo real */}
              {showPreview && (
                <div className="animate-fade-in">
                  <p className="mb-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    📱 Así verán tu card en el directorio:
                  </p>
                  <CardPreview
                    nombre={form.nombre}
                    categoria={categoriaNombrePreview}
                    zona={zonaNombrePreview}
                    descripcion={form.descripcion}
                    servicios={[categoriaNombrePreview, ...trabajosExtra].filter(Boolean)}
                    fotoPreview={fotoPreview}
                  />
                </div>
              )}
            </div>

            {/* ── Redes sociales (opcional) ── */}
            <div className="rounded-xl border border-gray-200 bg-gray-50">
              {/* Toggle */}
              <button
                type="button"
                onClick={() => setMostrarRedes(!mostrarRedes)}
                className="flex w-full items-center justify-between rounded-xl px-5 py-4 text-left transition-colors hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  {/* Íconos de las 3 redes */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1877F2] text-white">
                      <Facebook className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white">
                      <Instagram className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-white text-[10px] font-black leading-none">
                      Tk
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-sde-texto">Redes sociales</p>
                    <p className="text-xs text-gray-400">Opcional — para que los clientes conozcan más tu trabajo</p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${mostrarRedes ? "rotate-180" : ""}`}
                />
              </button>

              {/* Campos de redes (solo si está expandido) */}
              {mostrarRedes && (
                <div className="space-y-4 border-t border-gray-200 px-5 pb-5 pt-4 animate-fade-in">

                  {/* Facebook */}
                  <div className="space-y-1.5">
                    <Label htmlFor="facebook_url" className="flex items-center gap-2 text-sm">
                      <div className="flex h-5 w-5 items-center justify-center rounded bg-[#1877F2] text-white">
                        <Facebook className="h-3 w-3" />
                      </div>
                      Facebook
                    </Label>
                    <Input
                      id="facebook_url"
                      type="url"
                      placeholder="https://facebook.com/tu-pagina"
                      value={form.facebook_url}
                      onChange={(e) => handleChange("facebook_url", e.target.value)}
                      disabled={loading}
                      className="bg-white"
                    />
                  </div>

                  {/* Instagram */}
                  <div className="space-y-1.5">
                    <Label htmlFor="instagram_url" className="flex items-center gap-2 text-sm">
                      <div className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white">
                        <Instagram className="h-3 w-3" />
                      </div>
                      Instagram
                    </Label>
                    <Input
                      id="instagram_url"
                      type="url"
                      placeholder="https://instagram.com/tu-usuario"
                      value={form.instagram_url}
                      onChange={(e) => handleChange("instagram_url", e.target.value)}
                      disabled={loading}
                      className="bg-white"
                    />
                  </div>

                  {/* TikTok */}
                  <div className="space-y-1.5">
                    <Label htmlFor="tiktok_url" className="flex items-center gap-2 text-sm">
                      <div className="flex h-5 w-5 items-center justify-center rounded bg-black text-white text-[9px] font-black leading-none">
                        Tk
                      </div>
                      TikTok
                    </Label>
                    <Input
                      id="tiktok_url"
                      type="url"
                      placeholder="https://tiktok.com/@tu-usuario"
                      value={form.tiktok_url}
                      onChange={(e) => handleChange("tiktok_url", e.target.value)}
                      disabled={loading}
                      className="bg-white"
                    />
                  </div>

                  <p className="text-xs text-gray-400">
                    📌 Pegá la URL completa del perfil (ej: https://instagram.com/carlos_electricista)
                  </p>
                </div>
              )}
            </div>

            {/* ── Submit ── */}
            <Button
              type="submit"
              size="lg"
              className="w-full bg-sde-celeste text-white hover:bg-sde-celeste-hover"
              disabled={loading}
            >

              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enviando...</>
              ) : (
                "Enviar solicitud"
              )}
            </Button>

            <p className="text-center text-xs text-gray-400">
              Al enviar, aceptás que revisemos tus datos para verificar tu perfil.
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
