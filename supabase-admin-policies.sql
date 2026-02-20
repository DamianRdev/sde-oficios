-- ============================================================
-- POLÍTICAS DE ADMIN — Ejecutá en Supabase SQL Editor
-- Permite que los usuarios autenticados (admins) accedan a todo
-- ============================================================

-- El admin puede leer TODAS las categorías (incluso inactivas)
CREATE POLICY "Admin lectura total categorias"
  ON public.categorias FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- El admin puede leer y escribir TODAS las zonas
CREATE POLICY "Admin lectura total zonas"
  ON public.zonas FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- El admin puede leer y escribir TODOS los profesionales (incluso inactivos)
CREATE POLICY "Admin lectura total profesionales"
  ON public.profesionales FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- El admin puede gestionar servicios
CREATE POLICY "Admin lectura total servicios"
  ON public.servicios FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- El admin puede gestionar reseñas (aprobar/rechazar)
CREATE POLICY "Admin lectura total resenas"
  ON public.resenas FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- El admin puede leer y actualizar todas las solicitudes
CREATE POLICY "Admin lectura total solicitudes"
  ON public.solicitudes_registro FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─── Vista de solicitudes con JOIN a categorias y zonas ──────────────────────
-- Para que el admin vea el nombre del oficio y zona, no solo el UUID
CREATE OR REPLACE VIEW public.solicitudes_completas AS
SELECT
  s.id,
  s.nombre,
  s.telefono,
  s.servicios_texto,
  s.horarios,
  s.descripcion,
  s.estado,
  s.notas_admin,
  s.created_at,
  s.updated_at,
  c.id     AS categoria_id,
  c.nombre AS categoria_nombre,
  z.id     AS zona_id,
  z.nombre AS zona_nombre
FROM public.solicitudes_registro s
LEFT JOIN public.categorias c ON c.id = s.categoria_id
LEFT JOIN public.zonas z ON z.id = s.zona_id
ORDER BY s.created_at DESC;
