import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { FiltrosProfesionales, ProfesionalCompleto } from "@/types/database";

const POR_PAGINA_DEFAULT = 12;

/**
 * Hook principal para obtener profesionales con filtros, búsqueda y paginación.
 * Usa la vista `profesionales_completos` de Supabase para una sola consulta eficiente.
 */
export function useProfesionales(filtros: FiltrosProfesionales = {}) {
    const {
        busqueda = "",
        categoriaSlug,
        zonaSlug,
        soloDisponibles = false,
        soloVerificados = false,
        soloDestacados = false,
        pagina = 1,
        porPagina = POR_PAGINA_DEFAULT,
    } = filtros;

    return useQuery<{ data: ProfesionalCompleto[]; total: number }>({
        queryKey: [
            "profesionales",
            busqueda,
            categoriaSlug,
            zonaSlug,
            soloDisponibles,
            soloVerificados,
            soloDestacados,
            pagina,
            porPagina,
        ],
        queryFn: async () => {
            const desde = (pagina - 1) * porPagina;
            const hasta = desde + porPagina - 1;

            let query = supabase
                .from("profesionales_completos")
                .select("*", { count: "exact" })
                .order("destacado", { ascending: false })
                .order("verificado", { ascending: false })
                .order("contactos_count", { ascending: false })
                .range(desde, hasta);

            // Búsqueda por servicios (campo servicios_texto en la vista)
            // Se filtra en el cliente para buscar dentro del array de servicios
            // El filtrado real por término se aplica después en el hook de filtro

            // Filtros de categoría y zona por slug
            if (categoriaSlug && categoriaSlug !== "todos") {
                query = query.eq("categoria_slug", categoriaSlug);
            }
            if (zonaSlug && zonaSlug !== "todas") {
                query = query.eq("zona_slug", zonaSlug);
            }

            // Filtros booleanos opcionales
            if (soloDisponibles) query = query.eq("disponible", true);
            if (soloVerificados) query = query.eq("verificado", true);
            if (soloDestacados) query = query.eq("destacado", true);

            const { data, error, count } = await query;

            if (error) {
                console.error("Error al obtener profesionales:", error);
                throw new Error(error.message);
            }

            return {
                data: data ?? [],
                total: count ?? 0,
            };
        },
        staleTime: 1000 * 60 * 5, // 5 minutos de caché
        placeholderData: (prev) => prev, // Mantiene datos anteriores mientras carga (evita parpadeo)
    });
}

/**
 * Hook para obtener un profesional por su ID (para la página de perfil)
 */
export function useProfesional(id: string | undefined) {
    return useQuery<ProfesionalCompleto | null>({
        queryKey: ["profesional", id],
        queryFn: async () => {
            if (!id) return null;

            const { data, error } = await supabase
                .from("profesionales_completos")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                if (error.code === "PGRST116") return null; // Not found
                throw new Error(error.message);
            }

            return data;
        },
        enabled: Boolean(id),
        staleTime: 1000 * 60 * 5,
    });
}

/**
 * Función para registrar un click en WhatsApp (sin necesitar auth)
 */
export async function registrarContactoWhatsApp(profesionalId: string) {
    try {
        // Usamos fetch directo para evitar el problema de tipado del RPC
        const { db } = await import("@/lib/supabase");
        await (db as any).rpc("incrementar_contacto", {
            profesional_id: profesionalId,
        });
    } catch {
        // No es crítico — estadística opcional
    }
}
