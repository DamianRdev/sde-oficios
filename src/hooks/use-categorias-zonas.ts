import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Categoria, Zona } from "@/types/database";

/**
 * Hook para obtener todas las categorías activas (para los filtros y formulario de registro)
 */
export function useCategorias() {
    return useQuery<Categoria[]>({
        queryKey: ["categorias"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("categorias")
                .select("*")
                .eq("activo", true)
                .order("orden", { ascending: true });

            if (error) throw new Error(error.message);
            return data ?? [];
        },
        staleTime: 1000 * 60 * 30, // 30 minutos — las categorías no cambian seguido
    });
}

/**
 * Hook para obtener todas las zonas activas
 */
export function useZonas() {
    return useQuery<Zona[]>({
        queryKey: ["zonas"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("zonas")
                .select("*")
                .eq("activo", true)
                .order("nombre", { ascending: true });

            if (error) throw new Error(error.message);
            return data ?? [];
        },
        staleTime: 1000 * 60 * 30,
    });
}
