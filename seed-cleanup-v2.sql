-- ═══════════════════════════════════════════════════════════════════════════
--  SDE OFICIOS — CLEANUP V2: Eliminar todos los profesionales de prueba
--
--  INSTRUCCIONES:
--  1. Ejecutá este script PRIMERO en el SQL Editor de Supabase
--  2. Luego ejecutá seed-profesionales-v2.sql para cargar los nuevos datos
--
--  ⚠️  Identifica los profesionales de prueba por el prefijo de teléfono
--     '385421xxxx' (los del seed viejo) y '385410xxxx' (seed anterior v1).
--     NO afecta a profesionales con teléfonos reales.
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

-- ─── 1. Identificar IDs de todos los profesionales SEED ─────────────────────
CREATE TEMP TABLE ids_seed AS
SELECT id FROM profesionales
WHERE
  telefono LIKE '385421%'   -- seed v2
  OR telefono LIKE '38541000%' -- seed v1
  OR descripcion LIKE '%[SEED]%'; -- seed v1 por descripción

-- ─── 2. Preview de cuántos se van a eliminar ─────────────────────────────────
SELECT 'Profesionales a eliminar: ' || COUNT(*) AS resumen FROM ids_seed;

-- ─── 3. Eliminar servicios asociados ─────────────────────────────────────────
DELETE FROM servicios
WHERE profesional_id IN (SELECT id FROM ids_seed);

-- ─── 4. Eliminar reseñas asociadas ───────────────────────────────────────────
DELETE FROM resenas
WHERE profesional_id IN (SELECT id FROM ids_seed);

-- ─── 5. Eliminar galería de trabajos (si existe) ─────────────────────────────
DELETE FROM galeria_trabajos
WHERE profesional_id IN (SELECT id FROM ids_seed);

-- ─── 6. Eliminar los profesionales ───────────────────────────────────────────
DELETE FROM profesionales
WHERE id IN (SELECT id FROM ids_seed);

-- ─── 7. Resultado ────────────────────────────────────────────────────────────
SELECT 'Eliminados correctamente: ' || COUNT(*) AS resultado FROM ids_seed;

DROP TABLE ids_seed;

COMMIT;

-- ─── Verificación: cantidad total de profesionales restantes ─────────────────
SELECT
  COUNT(*) AS profesionales_restantes,
  'Listos para cargar el nuevo seed' AS siguiente_paso
FROM profesionales;
