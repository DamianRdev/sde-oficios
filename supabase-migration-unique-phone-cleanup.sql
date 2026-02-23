-- ============================================================
-- LIMPIEZA Y MIGRACIÓN: Restricción de Único por Teléfono
-- Este script limpia duplicados antes de aplicar la restricción.
-- ============================================================

-- 1. Eliminar duplicados en la tabla de profesionales
-- Mantenemos solo el registro más reciente (por created_at) de cada número
DELETE FROM public.profesionales
WHERE id IN (
    SELECT id
    FROM (
        SELECT id,
               ROW_NUMBER() OVER (PARTITION BY telefono ORDER BY created_at DESC) as row_num
        FROM public.profesionales
    ) t
    WHERE t.row_num > 1
);

-- 2. Ahora que no hay duplicados, aplicamos la restricción UNIQUE
ALTER TABLE public.profesionales ADD CONSTRAINT profesionales_telefono_unique UNIQUE (telefono);

-- 3. Índice para acelerar la búsqueda de solicitudes pendientes por teléfono
CREATE INDEX IF NOT EXISTS idx_solicitudes_telefono_pendiente 
ON public.solicitudes_registro(telefono) 
WHERE estado = 'pendiente';
