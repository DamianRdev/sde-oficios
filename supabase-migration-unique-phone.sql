-- ============================================================
-- MIGRACIÓN: Restricción de Único por Teléfono
-- Previene que un profesional se registre más de una vez con el mismo número.
-- ============================================================

-- 1. Agregar restricción UNIQUE a la tabla de profesionales
-- Nota: Si hay duplicados actuales, esta sentencia fallará. 
-- El admin debería limpiar duplicados antes o podemos usar un script de limpieza.
ALTER TABLE public.profesionales ADD CONSTRAINT profesionales_telefono_unique UNIQUE (telefono);

-- 2. Índice para acelerar la búsqueda de solicitudes pendientes por teléfono
CREATE INDEX IF NOT EXISTS idx_solicitudes_telefono_pendiente 
ON public.solicitudes_registro(telefono) 
WHERE estado = 'pendiente';
