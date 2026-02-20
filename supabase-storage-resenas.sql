-- ============================================================
-- STORAGE + FOTO EN SOLICITUDES — versión corregida
-- Borra políticas existentes antes de crearlas
-- ============================================================

-- 1. Agregar columna foto_url a solicitudes_registro (si no existe)
ALTER TABLE public.solicitudes_registro
  ADD COLUMN IF NOT EXISTS foto_url TEXT;

-- 2. Crear bucket (si no existe)
INSERT INTO storage.buckets (id, name, public)
VALUES ('fotos-profesionales', 'fotos-profesionales', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Eliminar políticas previas si existen
DROP POLICY IF EXISTS "Upload publico de fotos" ON storage.objects;
DROP POLICY IF EXISTS "Lectura publica de fotos" ON storage.objects;
DROP POLICY IF EXISTS "Admin eliminacion de fotos" ON storage.objects;

-- 4. Recrear políticas limpias
CREATE POLICY "Upload publico de fotos"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'fotos-profesionales');

CREATE POLICY "Lectura publica de fotos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'fotos-profesionales');

CREATE POLICY "Admin eliminacion de fotos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'fotos-profesionales');
