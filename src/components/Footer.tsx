import { Link } from "react-router-dom";
import { Wrench, MapPin, MessageCircle } from "lucide-react";

const WA_NUMBER = "543854026867";
const WA_MESSAGE = encodeURIComponent("Hola! Te escribo desde SDE Oficios. Tengo una consulta 👋");

const Footer = () => {
  return (
    <footer className="bg-sde-texto text-white">

      {/* Franja tricolor superior */}
      <div className="flex h-1">
        <div className="flex-1 bg-sde-celeste" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-sde-rojo" />
      </div>

      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-3">

          {/* Columna 1: Marca */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sde-celeste">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <div className="leading-none">
                <span className="font-display text-[17px] font-bold text-white">SDE</span>
                <span className="font-display text-[17px] font-bold text-sde-celeste"> Oficios</span>
              </div>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-400">
              El directorio de profesionales del hogar para Santiago del Estero. Conectamos vecinos con oficios de confianza.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="h-3.5 w-3.5 text-sde-celeste" />
              Santiago del Estero, Argentina
            </div>
          </div>

          {/* Columna 2: Navegación */}
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-gray-400">
              Navegación
            </h4>
            <nav className="flex flex-col gap-2.5">
              {[
                { to: "/", label: "Inicio" },
                { to: "/#profesionales", label: "Buscar oficio" },
                { to: "/registrarse", label: "Publicar mi oficio" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-gray-400 hover:text-sde-celeste transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-gray-400">
              Contacto
            </h4>
            <p className="mb-4 text-sm leading-relaxed text-gray-400">
              ¿Tenés dudas, sugerencias o querés mejorar tu publicación?
              Escribinos directamente.
            </p>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2.5
                rounded-xl bg-[#25D366]/10 border border-[#25D366]/30
                px-4 py-3 text-sm font-semibold text-[#25D366]
                transition-all hover:bg-[#25D366]/20 hover:border-[#25D366]/60
              "
            >
              <MessageCircle className="h-4 w-4 shrink-0" />
              Escribinos por WhatsApp
            </a>
          </div>

        </div>

        {/* Pie */}
        <div className="mt-10 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} SDE Oficios. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
