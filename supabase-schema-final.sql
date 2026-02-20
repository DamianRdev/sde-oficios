-- ============================================================
-- PASO FINAL — Políticas RLS y datos iniciales
-- Pegá esto en un New Query y ejecutalo
-- ============================================================

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
ALTER TABLE public.categorias           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zonas                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profesionales        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicios            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resenas              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitudes_registro ENABLE ROW LEVEL SECURITY;

-- Borramos políticas previas por si existen (para no dar error de duplicado)
DROP POLICY IF EXISTS "Lectura publica de categorias activas"    ON public.categorias;
DROP POLICY IF EXISTS "Lectura publica de zonas activas"         ON public.zonas;
DROP POLICY IF EXISTS "Lectura publica de profesionales activos" ON public.profesionales;
DROP POLICY IF EXISTS "Lectura publica de servicios"             ON public.servicios;
DROP POLICY IF EXISTS "Lectura publica de resenas aprobadas"     ON public.resenas;
DROP POLICY IF EXISTS "Insercion publica de resenas"             ON public.resenas;
DROP POLICY IF EXISTS "Insercion publica de solicitudes"         ON public.solicitudes_registro;

-- Creamos las políticas
CREATE POLICY "Lectura publica de categorias activas"
  ON public.categorias FOR SELECT USING (activo = true);

CREATE POLICY "Lectura publica de zonas activas"
  ON public.zonas FOR SELECT USING (activo = true);

CREATE POLICY "Lectura publica de profesionales activos"
  ON public.profesionales FOR SELECT USING (activo = true);

CREATE POLICY "Lectura publica de servicios"
  ON public.servicios FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profesionales p
      WHERE p.id = profesional_id AND p.activo = true
    )
  );

CREATE POLICY "Lectura publica de resenas aprobadas"
  ON public.resenas FOR SELECT USING (aprobada = true);

CREATE POLICY "Insercion publica de resenas"
  ON public.resenas FOR INSERT WITH CHECK (aprobada = false);

CREATE POLICY "Insercion publica de solicitudes"
  ON public.solicitudes_registro FOR INSERT WITH CHECK (true);

-- ─── DATOS INICIALES: Categorías ─────────────────────────────────────────────
INSERT INTO public.categorias (nombre, slug, icono, orden, activo) VALUES
  ('Electricista',                'electricista',              'Zap',        1,  true),
  ('Plomero',                     'plomero',                   'Droplets',   2,  true),
  ('Gasista',                     'gasista',                   'Flame',      3,  true),
  ('Técnico de Electrodomésticos','tecnico-electrodomesticos', 'Wrench',     4,  true),
  ('Pintor',                      'pintor',                    'Paintbrush', 5,  true),
  ('Albañil',                     'albanil',                   'HardHat',    6,  true),
  ('Carpintero',                  'carpintero',                'Hammer',     7,  true),
  ('Cerrajero',                   'cerrajero',                 'KeyRound',   8,  true),
  ('Herrero',                     'herrero',                   'Anvil',      9,  true),
  ('Jardinero',                   'jardinero',                 'Leaf',       10, true),
  ('Aire Acondicionado',          'aire-acondicionado',        'Wind',       11, true),
  ('Techista',                    'techista',                  'Home',       12, true),
  ('Soldador',                    'soldador',                  'Flame',      13, false),
  ('Sanitario',                   'sanitario',                 'Droplets',   14, false)
ON CONFLICT (slug) DO NOTHING;

-- ─── DATOS INICIALES: Zonas ──────────────────────────────────────────────────
INSERT INTO public.zonas (nombre, slug, provincia, pais) VALUES
  ('Santiago del Estero', 'santiago-del-estero', 'Santiago del Estero', 'Argentina'),
  ('La Banda',            'la-banda',            'Santiago del Estero', 'Argentina'),
  ('Termas de Río Hondo', 'termas-de-rio-hondo', 'Santiago del Estero', 'Argentina'),
  ('Frías',               'frias',               'Santiago del Estero', 'Argentina'),
  ('Añatuya',             'anatuya',             'Santiago del Estero', 'Argentina'),
  ('Loreto',              'loreto',              'Santiago del Estero', 'Argentina')
ON CONFLICT (slug) DO NOTHING;
