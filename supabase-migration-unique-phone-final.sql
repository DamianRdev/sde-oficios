-- ============================================================
-- MIGRACIÓN FINAL: Unicidad de Teléfono (Idempotente)
-- Este script limpia duplicados y asegura que la restricción exista.
-- ============================================================

-- 1. Eliminar duplicados (siempre es seguro correrlo)
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

-- 2. Asegurar la restricción UNIQUE
-- Primero la borramos si ya existe para evitar errores de "already exists"
-- y luego la creamos de nuevo para asegurar que está activa con los datos limpios.
ALTER TABLE public.profesionales DROP CONSTRAINT IF EXISTS profesionales_telefono_unique;
ALTER TABLE public.profesionales ADD CONSTRAINT profesionales_telefono_unique UNIQUE (telefono);

-- 3. Índice para solicitudes pendientes (con IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_solicitudes_telefono_pendiente 
ON public.solicitudes_registro(telefono) 
WHERE estado = 'pendiente';
