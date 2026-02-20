-- ============================================================
-- ESQUEMA SUPABASE — OficiosSDE
-- Ejecutá este script completo en el SQL Editor de tu proyecto
-- en https://supabase.com/dashboard → SQL Editor → New query
-- ============================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";   -- Para búsqueda sin tildes

-- ─── TABLA: categorias ───────────────────────────────────────────────────────
-- Categorías/oficios: escalable, podés agregar todas las que quieras
CREATE TABLE IF NOT EXISTS public.categorias (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre      TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,   -- electricista, plomero, pintor, etc.
  descripcion TEXT,
  icono       TEXT NOT NULL DEFAULT 'Wrench', -- Nombre del ícono de lucide-react
  color       TEXT,                  -- Ej: #f59e0b para personalizar por categoría
  activo      BOOLEAN NOT NULL DEFAULT true,
  orden       INTEGER NOT NULL DEFAULT 0,   -- Para ordenar en el filtro
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── TABLA: zonas ────────────────────────────────────────────────────────────
-- Zonas/localidades: escalable a toda Argentina o más
CREATE TABLE IF NOT EXISTS public.zonas (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre     TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,   -- santiago-del-estero, la-banda, etc.
  provincia  TEXT NOT NULL DEFAULT 'Santiago del Estero',
  pais       TEXT NOT NULL DEFAULT 'Argentina',
  activo     BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── TABLA: profesionales ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profesionales (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre           TEXT NOT NULL,
  telefono         TEXT NOT NULL,
  foto_url         TEXT,
  descripcion      TEXT,
  horarios         TEXT,
  disponible       BOOLEAN NOT NULL DEFAULT true,
  verificado       BOOLEAN NOT NULL DEFAULT false,
  destacado        BOOLEAN NOT NULL DEFAULT false,
  activo           BOOLEAN NOT NULL DEFAULT false, -- Empieza en false hasta que el admin lo apruebe
  categoria_id     UUID NOT NULL REFERENCES public.categorias(id) ON DELETE RESTRICT,
  zona_id          UUID NOT NULL REFERENCES public.zonas(id) ON DELETE RESTRICT,
  contactos_count  INTEGER NOT NULL DEFAULT 0,     -- Contador de contactos por WhatsApp
  -- Columna para búsqueda full-text en español (se actualiza automáticamente via trigger)
  search_vector    TSVECTOR,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── TABLA: servicios ────────────────────────────────────────────────────────
-- Servicios específicos de cada profesional (relación 1:N)
CREATE TABLE IF NOT EXISTS public.servicios (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profesional_id  UUID NOT NULL REFERENCES public.profesionales(id) ON DELETE CASCADE,
  descripcion     TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── TABLA: resenas ──────────────────────────────────────────────────────────
-- Sistema de reseñas y calificaciones (listo para usar o activar más adelante)
CREATE TABLE IF NOT EXISTS public.resenas (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profesional_id  UUID NOT NULL REFERENCES public.profesionales(id) ON DELETE CASCADE,
  autor_nombre    TEXT NOT NULL,
  calificacion    SMALLINT NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
  comentario      TEXT,
  aprobada        BOOLEAN NOT NULL DEFAULT false, -- El admin la aprueba primero
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── TABLA: solicitudes_registro ─────────────────────────────────────────────
-- Cuando alguien llena el formulario, se guarda aquí para revisión del admin
CREATE TYPE public.estado_solicitud AS ENUM ('pendiente', 'aprobada', 'rechazada');

CREATE TABLE IF NOT EXISTS public.solicitudes_registro (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre          TEXT NOT NULL,
  telefono        TEXT NOT NULL,
  categoria_id    UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
  zona_id         UUID REFERENCES public.zonas(id) ON DELETE SET NULL,
  servicios_texto TEXT,    -- Texto libre hasta que el admin procese
  horarios        TEXT,
  descripcion     TEXT,
  estado          public.estado_solicitud NOT NULL DEFAULT 'pendiente',
  notas_admin     TEXT,    -- El admin puede dejar notas internas
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES (mejoran el rendimiento con miles de registros)
-- ============================================================

-- Índice GIN para búsqueda full-text (superrápido con muchos datos)
CREATE INDEX IF NOT EXISTS idx_profesionales_search ON public.profesionales USING GIN(search_vector);

-- Índices para filtros frecuentes
CREATE INDEX IF NOT EXISTS idx_profesionales_categoria ON public.profesionales(categoria_id) WHERE activo = true;
CREATE INDEX IF NOT EXISTS idx_profesionales_zona ON public.profesionales(zona_id) WHERE activo = true;
CREATE INDEX IF NOT EXISTS idx_profesionales_activo ON public.profesionales(activo, verificado, destacado);
CREATE INDEX IF NOT EXISTS idx_servicios_profesional ON public.servicios(profesional_id);
CREATE INDEX IF NOT EXISTS idx_resenas_profesional ON public.resenas(profesional_id) WHERE aprobada = true;
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON public.solicitudes_registro(estado, created_at DESC);

-- ============================================================
-- TRIGGER: actualizar search_vector automáticamente
-- Cuando se guarda un profesional, el search_vector se actualiza
-- con el nombre, descripción y servicios (para búsqueda full-text)
-- ============================================================

CREATE OR REPLACE FUNCTION public.actualizar_search_vector()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('spanish', COALESCE(unaccent(NEW.nombre), '')), 'A') ||
    setweight(to_tsvector('spanish', COALESCE(unaccent(NEW.descripcion), '')), 'B');
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trigger_search_vector
  BEFORE INSERT OR UPDATE OF nombre, descripcion ON public.profesionales
  FOR EACH ROW EXECUTE FUNCTION public.actualizar_search_vector();

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION public.actualizar_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_profesionales_updated_at
  BEFORE UPDATE ON public.profesionales
  FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();

CREATE TRIGGER trigger_solicitudes_updated_at
  BEFORE UPDATE ON public.solicitudes_registro
  FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();

-- ============================================================
-- VISTA: profesionales_completos
-- Junta todo para el frontend en una sola consulta eficiente
-- ============================================================

CREATE OR REPLACE VIEW public.profesionales_completos AS
SELECT
  p.id,
  p.nombre,
  p.telefono,
  p.foto_url,
  p.descripcion,
  p.horarios,
  p.disponible,
  p.verificado,
  p.destacado,
  p.contactos_count,
  p.created_at,
  -- Categoría
  c.id           AS categoria_id,
  c.nombre       AS categoria_nombre,
  c.slug         AS categoria_slug,
  c.icono        AS categoria_icono,
  c.color        AS categoria_color,
  -- Zona
  z.id           AS zona_id,
  z.nombre       AS zona_nombre,
  z.slug         AS zona_slug,
  z.provincia    AS zona_provincia,
  -- Servicios como array de texto
  COALESCE((
    SELECT ARRAY_AGG(s.descripcion ORDER BY s.created_at)
    FROM public.servicios s
    WHERE s.profesional_id = p.id
  ), ARRAY[]::TEXT[]) AS servicios,
  -- Calificación promedio (reseñas aprobadas)
  (
    SELECT ROUND(AVG(r.calificacion)::NUMERIC, 1)
    FROM public.resenas r
    WHERE r.profesional_id = p.id AND r.aprobada = true
  ) AS calificacion_promedio,
  (
    SELECT COUNT(*)
    FROM public.resenas r
    WHERE r.profesional_id = p.id AND r.aprobada = true
  )::INTEGER AS total_resenas
FROM public.profesionales p
JOIN public.categorias c ON c.id = p.categoria_id
JOIN public.zonas z ON z.id = p.zona_id
WHERE p.activo = true;

-- ============================================================
-- FUNCIÓN: incrementar_contacto
-- Se llama cuando el usuario hace click en "WhatsApp"
-- ============================================================

CREATE OR REPLACE FUNCTION public.incrementar_contacto(profesional_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.profesionales
  SET contactos_count = contactos_count + 1
  WHERE id = profesional_id;
END;
$$;

-- ============================================================
-- ROW LEVEL SECURITY (RLS) — Seguridad
-- ============================================================

ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zonas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profesionales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resenas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitudes_registro ENABLE ROW LEVEL SECURITY;

-- Lectura pública para categorías y zonas activas
CREATE POLICY "Lectura publica de categorias activas"
  ON public.categorias FOR SELECT USING (activo = true);

CREATE POLICY "Lectura publica de zonas activas"
  ON public.zonas FOR SELECT USING (activo = true);

-- Lectura pública de profesionales activos
CREATE POLICY "Lectura publica de profesionales activos"
  ON public.profesionales FOR SELECT USING (activo = true);

-- Lectura pública de servicios de profesionales activos
CREATE POLICY "Lectura publica de servicios"
  ON public.servicios FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profesionales p
      WHERE p.id = profesional_id AND p.activo = true
    )
  );

-- Lectura pública de reseñas aprobadas
CREATE POLICY "Lectura publica de resenas aprobadas"
  ON public.resenas FOR SELECT USING (aprobada = true);

-- Cualquiera puede insertar una reseña (pendiente de aprobación)
CREATE POLICY "Insercion publica de resenas"
  ON public.resenas FOR INSERT WITH CHECK (aprobada = false);

-- Cualquiera puede insertar una solicitud de registro
CREATE POLICY "Insercion publica de solicitudes"
  ON public.solicitudes_registro FOR INSERT WITH CHECK (true);

-- ============================================================
-- DATOS INICIALES — Categorías predefinidas (podés agregar más)
-- ============================================================

INSERT INTO public.categorias (nombre, slug, icono, orden, activo) VALUES
  ('Electricista',               'electricista',               'Zap',           1,  true),
  ('Plomero',                    'plomero',                    'Droplets',      2,  true),
  ('Gasista',                    'gasista',                    'Flame',         3,  true),
  ('Técnico de Electrodomésticos','tecnico-electrodomesticos', 'Wrench',        4,  true),
  ('Pintor',                     'pintor',                     'Paintbrush',    5,  true),
  ('Albañil',                    'albanil',                    'HardHat',       6,  true),
  ('Carpintero',                 'carpintero',                 'Hammer',        7,  true),
  ('Cerrajero',                  'cerrajero',                  'KeyRound',      8,  true),
  ('Herrero',                    'herrero',                    'Anvil',         9,  true),
  ('Jardinero',                  'jardinero',                  'Leaf',          10, true),
  ('Aire Acondicionado',         'aire-acondicionado',         'Wind',          11, true),
  ('Techista',                   'techista',                   'Home',          12, true),
  ('Soldador',                   'soldador',                   'Flame',         13, false),
  ('Sanitario',                  'sanitario',                  'Droplets',      14, false)
ON CONFLICT (slug) DO NOTHING;

-- ─── Zonas iniciales ─────────────────────────────────────────────────────────

INSERT INTO public.zonas (nombre, slug, provincia, pais) VALUES
  ('Santiago del Estero', 'santiago-del-estero', 'Santiago del Estero', 'Argentina'),
  ('La Banda',            'la-banda',            'Santiago del Estero', 'Argentina'),
  ('Termas de Río Hondo', 'termas-de-rio-hondo', 'Santiago del Estero', 'Argentina'),
  ('Frías',               'frias',               'Santiago del Estero', 'Argentina'),
  ('Añatuya',             'anatuya',             'Santiago del Estero', 'Argentina'),
  ('Loreto',              'loreto',              'Santiago del Estero', 'Argentina')
ON CONFLICT (slug) DO NOTHING;
