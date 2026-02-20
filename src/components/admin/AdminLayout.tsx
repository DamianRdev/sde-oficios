import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    ClipboardList,
    Users,
    LogOut,
    Wrench,
    Menu,
    X,
    Star,
} from "lucide-react";
import { useState } from "react";
import { useAdminAuth } from "@/hooks/use-admin-auth";

const navItems = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/admin/solicitudes", icon: ClipboardList, label: "Solicitudes" },
    { to: "/admin/profesionales", icon: Users, label: "Profesionales" },
    { to: "/admin/resenas", icon: Star, label: "Reseñas" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, signOut } = useAdminAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        navigate("/admin/login");
    };

    const Sidebar = () => (
        <aside className="flex h-full w-64 flex-col bg-slate-900 border-r border-slate-800">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                    <Wrench className="h-5 w-5 text-white" />
                </div>
                <div>
                    <p className="font-display text-sm font-bold text-white">OficiosSDE</p>
                    <p className="text-[10px] text-slate-400">Panel de Administración</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                                ? "bg-primary text-white"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`
                        }
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Footer del sidebar */}
            <div className="border-t border-slate-800 px-3 py-4">
                <div className="mb-3 flex items-center gap-3 px-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-white">
                        {user?.email?.[0]?.toUpperCase() ?? "A"}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-white">{user?.email}</p>
                        <p className="text-[10px] text-slate-400">Administrador</p>
                    </div>
                </div>
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );

    return (
        <div className="flex h-screen overflow-hidden bg-slate-950 text-white">
            {/* Sidebar desktop */}
            <div className="hidden md:flex">
                <Sidebar />
            </div>

            {/* Sidebar mobile (overlay) */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="relative h-full">
                        <Sidebar />
                    </div>
                </div>
            )}

            {/* Contenido principal */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Topbar mobile */}
                <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3 md:hidden">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                            <Wrench className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-display text-sm font-bold text-white">Admin</span>
                    </div>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                        {sidebarOpen ? (
                            <X className="h-5 w-5 text-slate-400" />
                        ) : (
                            <Menu className="h-5 w-5 text-slate-400" />
                        )}
                    </button>
                </div>

                {/* Contenido scrolleable */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
