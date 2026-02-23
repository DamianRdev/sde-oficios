import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import ProfessionalProfile from "./pages/ProfessionalProfile";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSolicitudes from "./pages/admin/AdminSolicitudes";
import AdminProfesionales from "./pages/admin/AdminProfesionales";
import AdminResenas from "./pages/admin/AdminResenas";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminGaleria from "./pages/admin/AdminGaleria";
import { AdminAuthProvider } from "./hooks/use-admin-auth";
import { ProtectedAdminRoute } from "./components/admin/ProtectedAdminRoute";
import WhatsAppFloat from "./components/WhatsAppFloat";
import { ThemeProvider } from "./components/ThemeProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/** Rutas + botón flotante de WA (excluido en el panel admin) */
const AppRoutes = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Index />} />
        <Route path="/profesional/:id" element={<ProfessionalProfile />} />
        <Route path="/registrarse" element={<Register />} />

        {/* Rutas del panel de administración */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/solicitudes"
          element={
            <ProtectedAdminRoute>
              <AdminSolicitudes />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/profesionales"
          element={
            <ProtectedAdminRoute>
              <AdminProfesionales />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/resenas"
          element={
            <ProtectedAdminRoute>
              <AdminResenas />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedAdminRoute>
              <AdminAnalytics />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/galeria/:id"
          element={
            <ProtectedAdminRoute>
              <AdminGaleria />
            </ProtectedAdminRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Botón flotante de WhatsApp — solo en páginas públicas */}
      {!isAdmin && <WhatsAppFloat />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="sde-oficios-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AdminAuthProvider>
            <AppRoutes />
          </AdminAuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
