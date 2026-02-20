/**
 * Tipos generados para la base de datos Supabase de OficiosSDE.
 * Refleja exactamente el esquema SQL que debés correr en tu proyecto.
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            /**
             * Tabla de categorías/oficios (escalable — podés agregar infinitos)
             * Ej: Electricista, Plomero, Pintor, Albañil, etc.
             */
            categorias: {
                Row: {
                    id: string;
                    nombre: string;
                    slug: string;
                    descripcion: string | null;
                    icono: string; // Nombre del ícono de lucide-react
                    color: string | null; // Color hexadecimal personalizado por categoría
                    activo: boolean;
                    orden: number; // Para controlar el orden de aparición en filtros
                    created_at: string;
                };
                Insert: Omit<Database["public"]["Tables"]["categorias"]["Row"], "id" | "created_at">;
                Update: Partial<Database["public"]["Tables"]["categorias"]["Insert"]>;
            };

            /**
             * Tabla de zonas/localidades (escalable — podés agregar provincias, países)
             * Ej: Santiago del Estero, La Banda, Termas de Río Hondo, etc.
             */
            zonas: {
                Row: {
                    id: string;
                    nombre: string;
                    slug: string;
                    provincia: string;
                    pais: string;
                    activo: boolean;
                    created_at: string;
                };
                Insert: Omit<Database["public"]["Tables"]["zonas"]["Row"], "id" | "created_at">;
                Update: Partial<Database["public"]["Tables"]["zonas"]["Insert"]>;
            };

            /**
             * Tabla principal de profesionales
             */
            profesionales: {
                Row: {
                    id: string;
                    nombre: string;
                    telefono: string;
                    foto_url: string | null;
                    descripcion: string | null;
                    horarios: string | null;
                    disponible: boolean;
                    verificado: boolean;
                    destacado: boolean;
                    activo: boolean; // Aprobado por el admin
                    categoria_id: string;
                    zona_id: string;
                    // Búsqueda full-text: Supabase crea esto automáticamente con tsvector
                    search_vector: string | null;
                    // Estadísticas
                    contactos_count: number; // Cuantas veces fue contactado
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<
                    Database["public"]["Tables"]["profesionales"]["Row"],
                    "id" | "created_at" | "updated_at" | "search_vector" | "contactos_count"
                >;
                Update: Partial<Database["public"]["Tables"]["profesionales"]["Insert"]>;
            };

            /**
             * Servicios que ofrece cada profesional (relación 1:N)
             * Permite búsqueda por servicio específico
             */
            servicios: {
                Row: {
                    id: string;
                    profesional_id: string;
                    descripcion: string;
                    created_at: string;
                };
                Insert: Omit<Database["public"]["Tables"]["servicios"]["Row"], "id" | "created_at">;
                Update: Partial<Database["public"]["Tables"]["servicios"]["Insert"]>;
            };

            /**
             * Reseñas de los profesionales (para el futuro sistema de calificaciones)
             */
            resenas: {
                Row: {
                    id: string;
                    profesional_id: string;
                    autor_nombre: string;
                    calificacion: number; // 1-5
                    comentario: string | null;
                    aprobada: boolean;
                    created_at: string;
                };
                Insert: Omit<Database["public"]["Tables"]["resenas"]["Row"], "id" | "created_at">;
                Update: Partial<Database["public"]["Tables"]["resenas"]["Insert"]>;
            };

            /**
             * Solicitudes de registro (pendientes de aprobación)
             * El admin las revisa y aprueba, creando el profesional
             */
            solicitudes_registro: {
                Row: {
                    id: string;
                    nombre: string;
                    telefono: string;
                    categoria_id: string | null;
                    zona_id: string | null;
                    servicios_texto: string | null;
                    horarios: string | null;
                    descripcion: string | null;
                    estado: "pendiente" | "aprobada" | "rechazada";
                    notas_admin: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<
                    Database["public"]["Tables"]["solicitudes_registro"]["Row"],
                    "id" | "created_at" | "updated_at" | "estado" | "notas_admin"
                >;
                Update: Partial<Database["public"]["Tables"]["solicitudes_registro"]["Insert"]>;
            };
        };
        Views: {
            /**
             * Vista que une profesionales con sus categorías y zonas
             * Usada para listar y filtrar en el frontend
             */
            profesionales_completos: {
                Row: {
                    id: string;
                    nombre: string;
                    telefono: string;
                    foto_url: string | null;
                    descripcion: string | null;
                    horarios: string | null;
                    disponible: boolean;
                    verificado: boolean;
                    destacado: boolean;
                    contactos_count: number;
                    created_at: string;
                    // Datos de la categoría
                    categoria_id: string;
                    categoria_nombre: string;
                    categoria_slug: string;
                    categoria_icono: string;
                    categoria_color: string | null;
                    // Datos de la zona
                    zona_id: string;
                    zona_nombre: string;
                    zona_slug: string;
                    zona_provincia: string;
                    // Servicios agregados como array
                    servicios: string[];
                    // Calificación promedio
                    calificacion_promedio: number | null;
                    total_resenas: number;
                    // Redes sociales (opcionales)
                    facebook_url: string | null;
                    instagram_url: string | null;
                    tiktok_url: string | null;
                };
            };
        };
        Functions: {
            buscar_profesionales: {
                Args: {
                    termino_busqueda: string;
                    categoria_slug?: string;
                    zona_slug?: string;
                    solo_disponibles?: boolean;
                    limite?: number;
                    offset_val?: number;
                };
                Returns: Database["public"]["Views"]["profesionales_completos"]["Row"][];
            };
            incrementar_contacto: {
                Args: { profesional_id: string };
                Returns: void;
            };
        };
        Enums: {
            estado_solicitud: "pendiente" | "aprobada" | "rechazada";
        };
    };
}

// ─── Tipos de conveniencia para usar en el frontend ───────────────────────────

export type Categoria = Database["public"]["Tables"]["categorias"]["Row"];
export type Zona = Database["public"]["Tables"]["zonas"]["Row"];
export type Profesional = Database["public"]["Tables"]["profesionales"]["Row"];
export type ProfesionalCompleto = Database["public"]["Views"]["profesionales_completos"]["Row"];
export type Servicio = Database["public"]["Tables"]["servicios"]["Row"];
export type Resena = Database["public"]["Tables"]["resenas"]["Row"];
export type SolicitudRegistro = Database["public"]["Tables"]["solicitudes_registro"]["Row"];

export type InsertSolicitud = Database["public"]["Tables"]["solicitudes_registro"]["Insert"];
export type InsertResena = Database["public"]["Tables"]["resenas"]["Insert"];

// Filtros para la búsqueda de profesionales
export interface FiltrosProfesionales {
    busqueda?: string;
    categoriaSlug?: string;
    zonaSlug?: string;
    soloDisponibles?: boolean;
    soloVerificados?: boolean;
    soloDestacados?: boolean;
    pagina?: number;
    porPagina?: number;
}
