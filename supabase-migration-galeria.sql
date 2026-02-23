-- ══════════════════════════════════════════════════════════════════
-- MIGRACIÓN: Galería de trabajos por profesional
-- Ejecutar en Supabase SQL Editor
-- ══════════════════════════════════════════════════════════════════

-- 1. Tabla de fotos
CREATE TABLE IF NOT EXISTS galeria_trabajos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profesional_id  UUID NOT NULL REFERENCES profesionales(id) ON DELETE CASCADE,
  url             TEXT NOT NULL,
  descripcion     TEXT,
  orden           SMALLINT DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Índice para queries por profesional
CREATE INDEX IF NOT EXISTS idx_galeria_profesional
  ON galeria_trabajos(profesional_id, orden);

-- 3. RLS: lectura pública, escritura solo autenticados (admin)
ALTER TABLE galeria_trabajos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "galeria_select_public"
  ON galeria_trabajos FOR SELECT
  TO public
  USING (true);

CREATE POLICY "galeria_insert_admin"
  ON galeria_trabajos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "galeria_delete_admin"
  ON galeria_trabajos FOR DELETE
  TO authenticated
  USING (true);

-- 4. Bucket de storage (ejecutar por separado en Storage si no existe)
-- En Supabase Dashboard > Storage > New bucket
-- Nombre: "galeria-trabajos"
-- Public: true
-- Allowed MIME types: image/jpeg, image/png, image/webp
-- Max file size: 5MB

-- 5. Storage policy para el bucket (si se crea vía SQL)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('galeria-trabajos', 'galeria-trabajos', true);

-- CREATE POLICY "galeria_upload_admin"
--   ON storage.objects FOR INSERT TO authenticated
--   WITH CHECK (bucket_id = 'galeria-trabajos');

-- CREATE POLICY "galeria_delete_admin"
--   ON storage.objects FOR DELETE TO authenticated
--   USING (bucket_id = 'galeria-trabajos');

-- CREATE POLICY "galeria_public_read"
--   ON storage.objects FOR SELECT TO public
--   USING (bucket_id = 'galeria-trabajos');
