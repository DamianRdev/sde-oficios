-- ══════════════════════════════════════════════════════════════════
-- MIGRACIÓN: Soporte de galería en solicitudes de registro
-- ══════════════════════════════════════════════════════════════════

-- 1. Agregar columna de URLs de galería a la tabla de solicitudes
ALTER TABLE public.solicitudes_registro 
ADD COLUMN IF NOT EXISTS galeria_urls TEXT[] DEFAULT '{}';

-- 2. Asegurar que los profesionales también tengan los campos de redes si no existen
-- (Aunque ya deberían estar de una migración anterior, por seguridad:)
ALTER TABLE public.profesionales ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE public.profesionales ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE public.profesionales ADD COLUMN IF NOT EXISTS tiktok_url TEXT;

ALTER TABLE public.solicitudes_registro ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE public.solicitudes_registro ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE public.solicitudes_registro ADD COLUMN IF NOT EXISTS tiktok_url TEXT;
