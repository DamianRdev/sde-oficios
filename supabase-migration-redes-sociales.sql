-- ═══════════════════════════════════════════════════════════════════════════
--  SDE OFICIOS — Migración: Agregar redes sociales
--  Ejecutar en: Supabase → SQL Editor
--
--  Agrega columnas opcionales de redes sociales a:
--  1. solicitudes_registro (para que el profesional las ingrese al registrarse)
--  2. profesionales (para mostrarlas en el perfil aprobado)
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Tabla: solicitudes_registro ──────────────────────────────────────────────
ALTER TABLE solicitudes_registro
  ADD COLUMN IF NOT EXISTS facebook_url  TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS instagram_url TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS tiktok_url    TEXT DEFAULT NULL;

-- ── Tabla: profesionales ─────────────────────────────────────────────────────
ALTER TABLE profesionales
  ADD COLUMN IF NOT EXISTS facebook_url  TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS instagram_url TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS tiktok_url    TEXT DEFAULT NULL;

-- ── Verificación ─────────────────────────────────────────────────────────────
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name IN ('solicitudes_registro', 'profesionales')
  AND column_name IN ('facebook_url', 'instagram_url', 'tiktok_url')
ORDER BY table_name, column_name;
-- Debería devolver 6 filas (3 columnas × 2 tablas)
