import { Link } from "react-router-dom";
import { Wrench, MapPin, MessageCircle } from "lucide-react";

const WA_NUMBER = "543854026867";
const WA_MESSAGE = encodeURIComponent("Hola! Te escribo desde SDE Oficios. Tengo una consulta 👋");

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white">

      {/* Franja decorativa SDE */}
      <div className="sde-ribbon" />

      <div className="container py-8 md:py-12">
        <div className="grid gap-10 md:grid-cols-3">

          {/* Columna 1: Marca */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm shadow-primary/20">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <div className="leading-none">
                <span className="font-display text-[17px] font-bold text-white">SDE</span>
                <span className="font-display text-[17px] font-bold text-primary"> Oficios</span>
              </div>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              El directorio de profesionales del hogar para Santiago del Estero. Conectamos vecinos con oficios de confianza.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              Santiago del Estero, Argentina
            </div>
          </div>

          {/* Columna 2: Navegación — oculta en móviles, ya está en el Header */}
          <div className="hidden md:block">
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-slate-500">
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
                  className="text-sm text-slate-400 hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-slate-500">
              Contacto
            </h4>
            <p className="mb-4 hidden text-sm leading-relaxed text-slate-400 md:block">
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
              WhatsApp
            </a>
          </div>

        </div>

        {/* Pie */}
        <div className="mt-10 border-t border-white/5 pt-6 flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} SDE Oficios. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/terminos" className="hover:text-primary transition-colors">Términos y Condiciones</Link>
            <span className="opacity-20">|</span>
            <Link to="/privacidad" className="hover:text-primary transition-colors">Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
