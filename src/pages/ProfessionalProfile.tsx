import { useParams, Link } from "react-router-dom";
import {
  BadgeCheck, MapPin, Clock, MessageCircle,
  ArrowLeft, CheckCircle2, Star, Loader2,
  AlertCircle, Facebook, Instagram,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResenaForm from "@/components/ResenaForm";
import ResenasList from "@/components/ResenasList";
import { useProfesional, registrarContactoWhatsApp } from "@/hooks/use-profesionales";
import GaleriaTrabajos from "@/components/GaleriaTrabajos";

const ProfessionalProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { data: profesional, isLoading, isError } = useProfesional(id);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !profesional) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="container max-w-md text-center">
            <AlertCircle className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <h1 className="mb-2 font-display text-2xl font-bold text-foreground">
              Profesional no encontrado
            </h1>
            <p className="mb-4 text-muted-foreground">
              Este perfil no existe o fue removido.
            </p>
            <Link to="/" className="text-primary hover:underline">
              Volver al directorio
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const {
    nombre, categoria_nombre, zona_nombre, zona_provincia,
    disponible, verificado, destacado, telefono,
    servicios, horarios, descripcion, foto_url,
    calificacion_promedio, total_resenas, contactos_count,
    facebook_url, instagram_url, tiktok_url,
  } = profesional;

  const initials = nombre.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  const whatsappUrl = `https://wa.me/${telefono}?text=${encodeURIComponent(
    `Hola ${nombre}, te contacto desde OficiosSDE. Necesito un ${categoria_nombre.toLowerCase()}.`
  )}`;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container max-w-3xl">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al directorio
          </Link>

          {/* Header del perfil */}
          <div className="mb-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            {destacado && (
              <div className="flex items-center gap-1 bg-accent/10 px-6 py-2 text-xs font-semibold text-accent">
                <Star className="h-3 w-3 fill-current" />
                Profesional destacado
              </div>
            )}
            <div className="p-6 md:p-8">
              <div className="flex flex-col items-start gap-5 sm:flex-row">
                {/* Foto */}
                <div className="shrink-0">
                  {foto_url ? (
                    <img
                      src={foto_url}
                      alt={nombre}
                      className="h-24 w-24 rounded-2xl object-cover ring-2 ring-border"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 font-display text-3xl font-bold text-primary">
                      {initials}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display text-2xl font-bold text-card-foreground">
                      {nombre}
                    </h1>
                    {verificado && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-verified/10 px-2.5 py-1 text-xs font-semibold text-verified">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Verificado
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{categoria_nombre}</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {zona_nombre}, {zona_provincia}
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${disponible ? "bg-available/10 text-available" : "bg-unavailable/10 text-unavailable"
                      }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${disponible ? "bg-available" : "bg-unavailable"}`} />
                      {disponible ? "Disponible" : "No disponible"}
                    </span>
                  </div>

                  {/* Rating */}
                  {calificacion_promedio !== null && total_resenas > 0 && (
                    <div className="mt-2 flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`h-4 w-4 ${star <= Math.round(calificacion_promedio!)
                          ? "fill-accent text-accent"
                          : "text-muted-foreground/30"
                          }`} />
                      ))}
                      <span className="text-sm font-semibold text-foreground">{calificacion_promedio}</span>
                      <span className="text-xs text-muted-foreground">
                        ({total_resenas} reseña{total_resenas !== 1 ? "s" : ""})
                      </span>
                    </div>
                  )}

                  {descripcion && (
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{descripcion}</p>
                  )}


                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => registrarContactoWhatsApp(profesional.id)}
                  className="inline-flex items-center gap-2 rounded-lg bg-whatsapp px-6 py-3 font-display text-sm font-semibold text-whatsapp-foreground shadow-md transition-all hover:bg-whatsapp/90 hover:shadow-lg"
                >
                  <MessageCircle className="h-5 w-5" />
                  Contactar por WhatsApp
                </a>

                {/* Redes sociales */}
                {facebook_url && (
                  <a
                    href={facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Ver en Facebook"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#1877F2] text-white shadow transition-all hover:scale-105 hover:shadow-md"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {instagram_url && (
                  <a
                    href={instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Ver en Instagram"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow transition-all hover:scale-105 hover:shadow-md"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {tiktok_url && (
                  <a
                    href={tiktok_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Ver en TikTok"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-black text-white shadow transition-all hover:scale-105 hover:shadow-md text-[11px] font-black"
                  >
                    Tk
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Servicios y Horarios */}
          <div className="mb-6 grid gap-6 md:grid-cols-2">
            {servicios && servicios.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h2 className="mb-4 font-display text-lg font-semibold text-card-foreground">Servicios</h2>
                <ul className="space-y-2.5">
                  {servicios.map((servicio: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {servicio}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              {horarios && (
                <>
                  <h2 className="mb-4 font-display text-lg font-semibold text-card-foreground">Horarios</h2>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{horarios}</span>
                  </div>
                </>
              )}
              <h2 className="mb-3 mt-6 font-display text-lg font-semibold text-card-foreground">Zona de cobertura</h2>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{zona_nombre}, {zona_provincia}</span>
              </div>
            </div>
          </div>

          {/* Galería de trabajos */}
          {profesional.id && (
            <div className="mb-6">
              <GaleriaTrabajos
                profesionalId={profesional.id}
                profesionalNombre={nombre}
              />
            </div>
          )}

          {/* Reseñas aprobadas */}
          <div className="mb-6">
            <ResenasList profesionalId={profesional.id} />
          </div>

          {/* Formulario de reseña */}
          <ResenaForm
            profesionalId={profesional.id}
            profesionalNombre={nombre}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfessionalProfile;
