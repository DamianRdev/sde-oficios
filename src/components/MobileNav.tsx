import { Link, useLocation } from "react-router-dom";
import { Home, Search, PlusCircle, User } from "lucide-react";
export const MobileNav = () => {
  const location = useLocation();

  const navItems = [
    {
      to: "/",
      label: "Inicio",
      icon: Home,
      active: location.pathname === "/" && !location.state?.scrollTo,
    },
    {
      to: "/",
      state: { scrollTo: "profesionales" },
      label: "Buscar",
      icon: Search,
      active: location.pathname === "/" && location.state?.scrollTo === "profesionales",
    },
    {
      to: "/registrarse",
      label: "Publicar",
      icon: PlusCircle,
      active: location.pathname === "/registrarse",
    },
    {
      to: "/admin/login",
      label: "Mi Perfil",
      icon: User,
      active: location.pathname.startsWith("/admin"),
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-[60px] px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.active;

          return (
            <Link
              key={item.label}
              to={item.to}
              state={item.state}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? "text-[#FF5B00]" : "text-[#6B7280] hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <Icon className={`h-[22px] w-[22px] ${isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"}`} />
              <span className={`text-[11px] leading-none tracking-tight ${isActive ? "font-semibold" : "font-normal"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
