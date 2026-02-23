import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Loader2,
  Plus,
  X,
  MessageCircle,
  Facebook,
  Instagram,
  ChevronDown,
  Wrench,
  ArrowLeft,
  Eye,
  EyeOff,
  Images,
  PlusCircle,
  Camera,
  Star,
  MapPin,
  Clock,
  AlertCircle,
  BadgeCheck,
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
const MAX_FOTO_MB = 3;

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
    <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden max-w-sm mx-auto">
      {/* Header de preview */}
      <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-primary">
        <Eye className="h-3 w-3" />
        Vista previa
      </div>

      {/* Banner destacado */}
      <div className="flex items-center gap-1.5 bg-sde-dorado/10 px-4 py-1.5 text-[10px] font-bold text-sde-dorado uppercase tracking-wider">
        <Star className="h-3 w-3 fill-sde-dorado" />
        Perfil Destacado
      </div>

      <div className="flex gap-4 p-5">
        {/* Avatar */}
        {fotoPreview ? (
          <img src={fotoPreview} alt="Tu foto" className="h-20 w-20 shrink-0 rounded-2xl object-cover ring-2 ring-background shadow-md" />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 font-display text-3xl font-bold text-primary">
            {initials}
          </div>
        )}

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg font-black text-foreground">
            {nombre || "Tu Nombre Aquí"}
          </p>
          <div className="mt-1 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-lg bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground uppercase tracking-tight">
              {categoria || "Tu Oficio"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">
              <BadgeCheck className="h-3 w-3" /> Verificado
            </span>
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-primary" />{zona || "Tu Localidad"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 font-bold text-green-600 dark:text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />Disponible
            </span>
          </div>
        </div>
      </div>

      {/* Descripción */}
      {descripcion ? (
        <p className="px-5 pb-4 text-xs leading-relaxed text-muted-foreground line-clamp-3 italic">"{descripcion}"</p>
      ) : (
        <p className="px-5 pb-4 text-xs font-medium text-muted-foreground/40 italic">Tu descripción aparecerá aquí...</p>
      )}

      {/* Servicios */}
      {servicios.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-5 pb-4">
          {servicios.slice(0, 4).map((s) => (
            <span key={s} className="rounded-lg bg-muted px-2.5 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-tight border border-border/50">{s}</span>
          ))}
          {servicios.length > 4 && (
            <span className="rounded-lg bg-muted px-2.5 py-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tight border border-border/50">+{servicios.length - 4}</span>
          )}
        </div>
      )}

      {/* Botón WhatsApp */}
      <div className="flex gap-2 px-5 pb-5">
        <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-sm font-black text-white shadow-lg shadow-green-500/20 active:scale-95 transition-all">
          <MessageCircle className="h-4.5 w-4.5" />
          WHATSAPP
        </div>
        <div className="flex items-center justify-center rounded-xl border border-border bg-muted/30 px-5 py-3.5 text-xs font-black text-muted-foreground uppercase tracking-widest active:scale-95 transition-all">
          PERFIL
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
    <div className="space-y-4">
      {/* Tags existentes */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-bold text-primary animate-in zoom-in-50"
            >
              {tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="group ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-primary transition-colors hover:bg-sde-rojo hover:text-white"
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
          placeholder={tags.length >= 12 ? "¡Límite alcanzado!" : "Escribí aquí: Pintura, Techos..."}
          value={input}
          className="rounded-xl h-11 bg-muted/30 focus:bg-card"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled || tags.length >= 12}
          maxLength={50}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => addTag(input)}
          disabled={disabled || !input.trim() || tags.length >= 12}
          className="shrink-0 h-11 w-11 rounded-xl border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Sugerencias rápidas */}
      <div className="pt-1">
        <p className="mb-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sugerencias rápidas:</p>
        <div className="flex flex-wrap gap-2">
          {OFICIOS_ADICIONALES.filter((o) => !tags.includes(o)).slice(0, 8).map((oficio) => (
            <button
              key={oficio}
              type="button"
              onClick={() => addTag(oficio)}
              disabled={disabled || tags.length >= 12}
              className="rounded-xl border border-border bg-card px-3 py-1.5 text-[11px] font-bold text-muted-foreground transition-all hover:border-primary hover:text-primary active:scale-95 disabled:opacity-40"
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

  // Galería de trabajos
  const [galeriaFiles, setGaleriaFiles] = useState<File[]>([]);
  const [galeriaPreviews, setGaleriaPreviews] = useState<string[]>([]);
  const MAX_GALERIA = 6;
  const MAX_GALERIA_MB = 5;

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

  const handleGaleria = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (galeriaFiles.length + files.length > MAX_GALERIA) {
      toast({ title: "Límite alcanzado", description: `Podés subir hasta ${MAX_GALERIA} fotos.`, variant: "destructive" });
      return;
    }

    const validFiles = files.filter(f => {
      if (f.size > MAX_GALERIA_MB * 1024 * 1024) {
        toast({ title: "Archivo muy pesado", description: `${f.name} excede los ${MAX_GALERIA_MB}MB.`, variant: "destructive" });
        return false;
      }
      return true;
    });

    setGaleriaFiles(prev => [...prev, ...validFiles]);
    const newPreviews = validFiles.map(f => URL.createObjectURL(f));
    setGaleriaPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeFotoGaleria = (index: number) => {
    setGaleriaFiles(prev => prev.filter((_, i) => i !== index));
    setGaleriaPreviews(prev => prev.filter((_, i) => i !== index));
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

    // ─── VALIDACIÓN DE DUPLICADOS ───
    try {
      // 1. Verificar si ya es un profesional activo
      const { data: existePro } = await db
        .from("profesionales")
        .select("id")
        .eq("telefono", telefonoLimpio)
        .maybeSingle();

      if (existePro) {
        toast({
          title: "Número ya registrado",
          description: "Este WhatsApp ya tiene un perfil activo. Si querés modificar tus datos, contactanos.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // 2. Verificar si ya tiene una solicitud pendiente
      const { data: existeSoli } = await db
        .from("solicitudes_registro")
        .select("id")
        .eq("telefono", telefonoLimpio)
        .eq("estado", "pendiente")
        .maybeSingle();

      if (existeSoli) {
        toast({
          title: "Solicitud en revisión",
          description: "Ya recibimos una solicitud para este número y está siendo procesada. Te contactaremos pronto.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Error al verificar duplicados:", err);
      // Continuamos si hay error en la verificación para no bloquear al usuario por un fallo de red menor
    }

    let foto_url: string | null = null;

    try {
      // 1. Subir foto de perfil
      if (foto) {
        const ext = foto.name.split(".").pop();
        const fileName = `solicitud-${Date.now()}.${ext}`;
        const { data: storageData, error: storageError } = await supabase.storage
          .from("fotos-profesionales")
          .upload(fileName, foto, { upsert: false, contentType: foto.type });

        if (!storageError) {
          foto_url = supabase.storage.from("fotos-profesionales").getPublicUrl(storageData.path).data.publicUrl;
        }
      }

      // 2. Subir fotos de la galería
      const galeria_urls: string[] = [];
      if (galeriaFiles.length > 0) {
        let fallos = 0;
        for (const [idx, file] of galeriaFiles.entries()) {
          try {
            const ext = file.name.split(".").pop();
            const fileName = `solicitud-galeria-${Date.now()}-${idx}.${ext}`;
            const { data: storageData, error: storageError } = await supabase.storage
              .from("galeria-trabajos")
              .upload(fileName, file, { upsert: false, contentType: file.type });

            if (storageError) {
              console.error(`Error subiendo foto ${idx}:`, storageError.message);
              fallos++;
            } else if (storageData) {
              const { data: urlData } = supabase.storage.from("galeria-trabajos").getPublicUrl(storageData.path);
              galeria_urls.push(urlData.publicUrl);
            }
          } catch (e) {
            console.error("Excepción en subida de galería:", e);
            fallos++;
          }
        }
        if (fallos > 0) {
          console.warn(`${fallos} fotos de la galería no pudieron subirse.`);
        }
      }

      // 3. Combinar categoría principal + trabajos extra en servicios_texto
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
        galeria_urls,
        facebook_url: form.facebook_url.trim() || null,
        instagram_url: form.instagram_url.trim() || null,
        tiktok_url: form.tiktok_url.trim() || null,
      });

      if (error) throw new Error(error.message);

      // EmailJS
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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-6 md:py-12">
        <div className="container max-w-2xl px-4">
          <div className="mb-6 md:mb-8">
            <h1 className="mb-2 font-display text-2xl font-bold text-foreground md:text-3xl">
              Publicá tu oficio
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">Completá el formulario y empezá a recibir contactos reales.</p>
          </div>

          <div className="mb-6 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm text-foreground/80">
              Tu perfil será revisado por nuestro equipo antes de aparecer en el directorio.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 rounded-2xl border border-border bg-card p-5 shadow-sm md:p-10">
            {/* Foto de perfil */}
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start text-center sm:text-left">
              <div
                className="relative flex h-28 w-28 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted/50 transition-all hover:border-primary hover:bg-primary/5 group"
                onClick={() => fileRef.current?.click()}
              >
                {fotoPreview ? (
                  <>
                    <img src={fotoPreview} alt="Preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFoto(null); setFotoPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                      className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-sde-rojo text-white shadow-lg active:scale-90"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Camera className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-[10px] font-bold uppercase text-muted-foreground group-hover:text-primary">Tu foto</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Label className="block text-base font-bold text-foreground">Foto de perfil</Label>
                <p className="mb-3 text-xs text-muted-foreground">JPG o PNG, máx. {MAX_FOTO_MB} MB. Una buena foto genera más confianza.</p>
                <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={loading} className="w-full sm:w-auto h-10 px-6 rounded-xl font-bold">
                  {fotoPreview ? "Cambiar foto" : "Subir mi foto"}
                </Button>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFoto} />
              </div>
            </div>

            {/* Nombre y Teléfono */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="font-bold">Nombre o nombre comercial *</Label>
                <Input id="nombre" placeholder="Ej: Carlos Herrera" value={form.nombre}
                  className="rounded-xl h-12 bg-muted/30 focus:bg-card transition-all"
                  onChange={(e) => handleChange("nombre", e.target.value)} maxLength={100} disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono" className="font-bold">Teléfono WhatsApp *</Label>
                <Input id="telefono" placeholder="Ej: 5493854123456" value={form.telefono}
                  className="rounded-xl h-12 bg-muted/30 focus:bg-card transition-all"
                  onChange={(e) => handleChange("telefono", e.target.value)} maxLength={20} disabled={loading} />
                <p className="text-[11px] text-muted-foreground">Incluí código de país (549), sin espacios ni guiones.</p>
              </div>
            </div>

            {/* Zona */}
            <div className="space-y-2">
              <Label className="font-bold">Zona de trabajo *</Label>
              <Select onValueChange={(val) => handleChange("zona_id", val)} disabled={loading || loadingZonas}>
                <SelectTrigger className="rounded-xl h-12 bg-muted/30 focus:bg-card transition-all">
                  <SelectValue placeholder={loadingZonas ? "Cargando..." : "Seleccioná tu localidad"} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border bg-card">
                  {zonas.map((zona) => (
                    <SelectItem key={zona.id} value={zona.id}>{zona.nombre} — {zona.provincia}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Categoría Principal */}
            <div className="space-y-3 rounded-2xl border-2 border-primary/20 bg-primary/5 p-4 md:p-6 shadow-inner">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-sde-dorado text-sde-dorado" />
                <Label className="text-primary font-bold text-sm uppercase tracking-wider">Tu oficio principal *</Label>
              </div>
              <p className="text-xs text-muted-foreground/80">Seleccioná la categoría donde querés aparecer primero.</p>
              <Select onValueChange={(val) => handleChange("categoria_id", val)} disabled={loading || loadingCategorias}>
                <SelectTrigger className="rounded-xl h-12 border-primary/20 bg-card shadow-sm focus:ring-primary/20">
                  <SelectValue placeholder={loadingCategorias ? "Cargando..." : "Elegí tu oficio principal"} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border bg-card">
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Trabajos adicionales */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-bold">
                <Wrench className="h-4 w-4 text-primary" />
                Otros trabajos que realizás
              </Label>
              <TagInput tags={trabajosExtra} onChange={setTrabajosExtra} disabled={loading} />
            </div>

            {/* Galería de trabajos */}
            <div className="space-y-4 rounded-2xl border border-border bg-muted/30 p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Images className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Fotos de tus servicios</h3>
                  <p className="text-xs text-muted-foreground">Subí hasta {MAX_GALERIA} fotos reales de tus trabajos.</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
                {galeriaPreviews.map((url, idx) => (
                  <div key={idx} className="group relative aspect-square">
                    <img src={url} className="h-full w-full rounded-xl object-cover ring-2 ring-background shadow-md" alt="Preview" />
                    <button
                      type="button"
                      onClick={() => removeFotoGaleria(idx)}
                      className="absolute -right-1.5 -top-1.5 rounded-full bg-sde-rojo p-1.5 text-white shadow-lg transition-all hover:scale-110 active:scale-95"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {galeriaFiles.length < MAX_GALERIA && (
                  <button
                    type="button"
                    onClick={() => document.getElementById("galeria-input")?.click()}
                    className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50 hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <PlusCircle className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="mt-1 text-[9px] font-bold text-muted-foreground uppercase group-hover:text-primary">Subir</span>
                  </button>
                )}
              </div>
              <input id="galeria-input" type="file" multiple accept="image/*" className="hidden" onChange={handleGaleria} disabled={loading} />
            </div>

            {/* Descripción + Vista previa */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label htmlFor="descripcion" className="font-bold">Contanos sobre vos</Label>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold transition-all active:scale-95 ${showPreview
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-primary-light text-primary border-primary/20 hover:bg-primary/10"
                    }`}
                >
                  {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  {showPreview ? "Ocultar vista previa" : "Ver vista previa"}
                </button>
              </div>
              <Textarea
                id="descripcion"
                placeholder="Ej: Tengo 10 años de experiencia, trabajos garantizados, presupuesto sin cargo..."
                value={form.descripcion}
                className="rounded-xl bg-muted/30 focus:bg-card transition-all placeholder:text-muted-foreground/50"
                onChange={(e) => handleChange("descripcion", e.target.value)}
                rows={4}
                maxLength={500}
                disabled={loading}
              />
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Revisá tu ortografía</p>
                <p className="text-[11px] font-mono text-muted-foreground">{form.descripcion.length}/500</p>
              </div>

              {showPreview && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300 pt-4">
                  <p className="mb-4 text-center text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Así verán tu perfil los clientes</p>
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

            {/* Redes sociales */}
            <div className="rounded-2xl border border-border bg-muted/20 overflow-hidden">
              <button
                type="button"
                onClick={() => setMostrarRedes(!mostrarRedes)}
                className="flex w-full items-center justify-between px-5 py-5 text-left hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center -space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white ring-2 ring-background"><Facebook className="h-4 w-4" /></div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white ring-2 ring-background"><Instagram className="h-4 w-4" /></div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Vincular redes sociales</p>
                    <p className="text-[11px] text-muted-foreground">Opcional para dar más confianza.</p>
                  </div>
                </div>
                <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${mostrarRedes ? "rotate-180" : ""}`} />
              </button>

              {mostrarRedes && (
                <div className="space-y-4 border-t border-border px-5 pb-6 pt-5 animate-in slide-in-from-top-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="facebook_url" className="text-xs font-bold text-muted-foreground">URL de Facebook</Label>
                    <Input id="facebook_url" type="url" placeholder="https://facebook.com/tualbanileria" className="rounded-xl h-11 bg-card" value={form.facebook_url} onChange={(e) => handleChange("facebook_url", e.target.value)} disabled={loading} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="instagram_url" className="text-xs font-bold text-muted-foreground">Usuario de Instagram</Label>
                    <Input id="instagram_url" type="url" placeholder="https://instagram.com/tucarpinteria" className="rounded-xl h-11 bg-card" value={form.instagram_url} onChange={(e) => handleChange("instagram_url", e.target.value)} disabled={loading} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="tiktok_url" className="text-xs font-bold text-muted-foreground">Usuario de TikTok</Label>
                    <Input id="tiktok_url" type="url" placeholder="https://tiktok.com/@tunombre" className="rounded-xl h-11 bg-card" value={form.tiktok_url} onChange={(e) => handleChange("tiktok_url", e.target.value)} disabled={loading} />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4">
              <Button type="submit" size="lg" className="w-full h-14 rounded-2xl bg-primary text-primary-foreground text-base font-black shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.98]" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Procesando solicitud...</> : "Publicar mi perfil gratis"}
              </Button>
              <p className="mt-4 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
                <BadgeCheck className="h-3 w-3 text-primary" />
                Verificación humana en 24hs
              </p>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
