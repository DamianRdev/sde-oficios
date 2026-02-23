import { Link } from "react-router-dom";
import { MessageCircle, BadgeCheck, MapPin, Star } from "lucide-react";
import type { ProfesionalCompleto } from "@/types/database";
import { registrarContactoWhatsApp } from "@/hooks/use-profesionales";

const ProfessionalCard = ({ profesional }: { profesional: ProfesionalCompleto }) => {
  const {
    id,
    nombre,
    categoria_nombre,
    zona_nombre,
    disponible,
    verificado,
    destacado,
    telefono,
    calificacion_promedio,
    total_resenas,
    foto_url,
  } = profesional;

  const whatsappUrl = `https://wa.me/${telefono}?text=${encodeURIComponent(
    `Hola ${nombre}, te contacto desde SDE Oficios. Necesito un ${categoria_nombre.toLowerCase()}.`
  )}`;

  const initials = nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`oficio-card group relative flex flex-col overflow-hidden ${destacado ? "ring-2 ring-sde-dorado/40" : ""
        }`}
    >
      {/* Banner destacado — reserva espacio siempre para altura uniforme */}
      <div
        className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold transition-colors ${destacado
          ? "bg-sde-dorado-claro text-amber-900 dark:bg-yellow-500/20 dark:text-yellow-500"
          : "invisible py-1.5 pointer-events-none"
          }`}
      >
        <Star className="h-3 w-3 fill-sde-dorado text-sde-dorado" />
        Destacado
      </div>

      {/* ── Layout HORIZONTAL — optimizado mobile ── */}
      <div className="flex gap-3 p-4">

        {/* Foto — cuadrada, 60px mobile */}
        <Link to={`/profesional/${id}`} className="shrink-0">
          {foto_url ? (
            <img
              src={foto_url}
              alt={nombre}
              loading="lazy"
              className="h-16 w-16 rounded-xl object-cover ring-2 ring-border/50"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary-light font-display text-2xl font-bold text-primary dark:bg-primary/20">
              {initials}
            </div>
          )}
        </Link>

        {/* Info */}
        <div className="min-w-0 flex-1">
          {/* Nombre */}
          <Link to={`/profesional/${id}`} className="block">
            <h3 className="truncate font-display text-[15px] font-bold text-foreground hover:text-primary transition-colors leading-snug">
              {nombre}
            </h3>
          </Link>

          {/* Categoría + Verificado */}
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
            <span className="badge-celeste text-[11px]">{categoria_nombre}</span>
            {verificado && (
              <span className="inline-flex items-center gap-0.5 rounded-full border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                <BadgeCheck className="h-2.5 w-2.5" />
                Verificado
              </span>
            )}
          </div>

          {/* Zona + disponibilidad + rating — en una sola fila */}
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-0.5">
              <MapPin className="h-3 w-3 text-primary" />
              {zona_nombre}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${disponible ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-muted text-muted-foreground"
                }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${disponible ? "bg-green-500" : "bg-muted-foreground/40"}`} />
              {disponible ? "Disponible" : "No disponible"}
            </span>
            {calificacion_promedio !== null && total_resenas > 0 && (
              <span className="inline-flex items-center gap-0.5 font-semibold text-foreground">
                <Star className="h-3 w-3 fill-sde-dorado text-sde-dorado" />
                {calificacion_promedio}
                <span className="font-normal text-muted-foreground/60">({total_resenas})</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Botón WhatsApp — ancho completo, 48px, fondo verde ── */}
      <div className="flex gap-2 px-4 pb-4">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => registrarContactoWhatsApp(id)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 font-display text-sm font-bold text-white shadow-sm transition-all hover:bg-[#1ebe5a] active:scale-[0.97]"
          style={{ minHeight: "48px" }}
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
        <Link
          to={`/profesional/${id}`}
          className="flex items-center justify-center rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary"
          style={{ minHeight: "48px" }}
          title="Ver perfil completo"
        >
          Ver
        </Link>
      </div>
    </div>
  );
};

export default ProfessionalCard;
