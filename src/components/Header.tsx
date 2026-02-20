import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Wrench } from "lucide-react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Inicio" },
    { to: "/#profesionales", label: "Buscar oficio" },
    { to: "/registrarse", label: "Publicar oficio" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="container flex h-16 items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setMenuOpen(false)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sde-celeste shadow-sm transition-transform group-hover:scale-105">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <div className="leading-none">
            <span className="font-display text-[17px] font-bold text-sde-texto">SDE</span>
            <span className="font-display text-[17px] font-bold text-sde-celeste"> Oficios</span>
          </div>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) =>
            link.label === "Publicar oficio" ? (
              <Link
                key={link.to}
                to={link.to}
                className="ml-2 btn-cta text-sm px-4 py-2"
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.to
                    ? "text-sde-celeste bg-sde-celeste-claro"
                    : "text-gray-600 hover:text-sde-celeste hover:bg-sde-celeste-claro"
                  }`}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Hamburguesa mobile */}
        <button
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          {menuOpen ? <X className="h-5 w-5 text-gray-600" /> : <Menu className="h-5 w-5 text-gray-600" />}
        </button>
      </div>

      {/* Nav mobile */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 animate-fade-in">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) =>
              link.label === "Publicar oficio" ? (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 btn-cta text-center text-sm py-2.5"
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-sde-celeste-claro hover:text-sde-celeste transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
