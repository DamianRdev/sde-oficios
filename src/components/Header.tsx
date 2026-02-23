import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Wrench } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Inicio" },
    { to: "/#profesionales", label: "Buscar oficio" },
    { to: "/registrarse", label: "Publicar oficio" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-sm">
      <div className="container flex h-16 items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setMenuOpen(false)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sde-celeste shadow-sm transition-transform group-hover:scale-105">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <div className="leading-none">
            <span className="font-display text-[17px] font-bold text-foreground">SDE</span>
            <span className="font-display text-[17px] font-bold text-sde-celeste"> Oficios</span>
          </div>
        </Link>

        {/* Nav desktop */}
        <div className="hidden md:flex items-center gap-4">
          <nav className="flex items-center gap-1">
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
                    ? "text-sde-celeste bg-sde-celeste-claro dark:bg-primary-light"
                    : "text-muted-foreground hover:text-sde-celeste hover:bg-sde-celeste-claro dark:hover:bg-primary-light"
                    }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
          <div className="h-6 w-px bg-border" />
          <ThemeToggle />
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            {menuOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
          </button>
        </div>
      </div>

      {/* Nav mobile */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) =>
              link.label === "Publicar oficio" ? (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 btn-cta text-center text-[10px] font-black uppercase tracking-[0.1em] py-3 shadow-lg shadow-sde-rojo/20 active:scale-95"
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-bold transition-all active:bg-accent ${location.pathname === link.to
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    }`}
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
