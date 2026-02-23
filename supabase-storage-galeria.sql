-- ══════════════════════════════════════════════════════════════════
-- MIGRACIÓN: Políticas de Storage para Galería de Trabajos
-- Permite que los nuevos profesionales suban fotos durante el registro
-- ══════════════════════════════════════════════════════════════════

-- 1. Asegurar que el bucket existe y es público
INSERT INTO storage.buckets (id, name, public)
VALUES ('galeria-trabajos', 'galeria-trabajos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Limpiar políticas previas por si acaso
DROP POLICY IF EXISTS "galeria_upload_publico" ON storage.objects;
DROP POLICY IF EXISTS "galeria_select_publico" ON storage.objects;
DROP POLICY IF EXISTS "galeria_delete_admin" ON storage.objects;

-- 3. Crear política para que CUALQUIERA pueda subir fotos (necesario para el Registro)
CREATE POLICY "galeria_upload_publico"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'galeria-trabajos');

-- 4. Crear política para que CUALQUIERA pueda ver las fotos
CREATE POLICY "galeria_select_publico"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'galeria-trabajos');

-- 5. Crear política para que solo el ADMIN pueda borrar fotos
CREATE POLICY "galeria_delete_admin"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'galeria-trabajos');
