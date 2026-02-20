-- ═══════════════════════════════════════════════════════════════════════════
--  SDE OFICIOS — Script para ELIMINAR los profesionales de prueba
--
--  Este script elimina ÚNICAMENTE los profesionales insertados con el
--  script `seed-profesionales.sql`, identificados por la marca [SEED]
--  en su descripción.
--
--  INSTRUCCIONES:
--  1. Abrí el SQL Editor de Supabase
--  2. Pegá y ejecutá este script
--  3. Revisá el resultado — verás cuántos registros se eliminaron
--
--  ⚠️  NO afecta a profesionales reales (sin la marca [SEED]).
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

-- ─── 1. Guardar IDs de los profesionales SEED ────────────────────────────────
CREATE TEMP TABLE ids_seed AS
SELECT id FROM profesionales
WHERE descripcion LIKE '%[SEED]%';

-- ─── 2. Ver cuántos se van a eliminar (preview) ──────────────────────────────
SELECT
  'Profesionales a eliminar: ' || COUNT(*) AS resumen
FROM ids_seed;

-- ─── 3. Eliminar servicios asociados ─────────────────────────────────────────
DELETE FROM servicios
WHERE profesional_id IN (SELECT id FROM ids_seed);

-- ─── 4. Eliminar reseñas asociadas (si hubiera) ──────────────────────────────
DELETE FROM resenas
WHERE profesional_id IN (SELECT id FROM ids_seed);

-- ─── 5. Eliminar los profesionales SEED ──────────────────────────────────────
DELETE FROM profesionales
WHERE id IN (SELECT id FROM ids_seed);

-- ─── 6. Resultado final ───────────────────────────────────────────────────────
SELECT
  'Profesionales eliminados: ' || COUNT(*) AS resultado
FROM ids_seed;

DROP TABLE ids_seed;

COMMIT;

-- ─── Verificación: confirmar que no quedó ninguno ────────────────────────────
SELECT COUNT(*) AS seed_restantes
FROM profesionales
WHERE descripcion LIKE '%[SEED]%';
-- Debe devolver: 0
