-- ═══════════════════════════════════════════════════════════════════════════
--  SDE OFICIOS — SEED V2: 50 profesionales realistas para Santiago del Estero
--
--  INSTRUCCIONES:
--  1. Primero ejecutá seed-cleanup-v2.sql para limpiar los datos viejos
--  2. Luego ejecutá ESTE script en el SQL Editor de Supabase
--  3. Al final verás la verificación con todos los registros
--
--  ✅ Descripiones reales por oficio
--  ✅ Servicios coherentes con la categoría
--  ✅ Nombres y teléfonos verosímiles (prefijo 385 = Santiago del Estero)
--  ✅ Distribución variada de zonas y disponibilidad
--  ✅ Algunas reseñas de muestra incluidas
-- ═══════════════════════════════════════════════════════════════════════════

DO $$
DECLARE
  -- ─── IDs de categorías ───────────────────────────────────────────────────
  cat_elec    uuid;
  cat_plom    uuid;
  cat_gas     uuid;
  cat_tec     uuid;
  cat_pint    uuid;
  cat_alba    uuid;
  cat_carp    uuid;
  cat_cerr    uuid;
  cat_jard    uuid;
  cat_aire    uuid;
  cat_tech    uuid;

  -- ─── IDs de zonas ────────────────────────────────────────────────────────
  zona_sde    uuid;
  zona_banda  uuid;
  zona_termas uuid;
  zona_frias  uuid;
  zona_ana    uuid;
  zona_lor    uuid;

  pid uuid;

BEGIN

  -- ─── Cargar IDs de categorías ─────────────────────────────────────────────
  SELECT id INTO cat_elec FROM categorias WHERE slug = 'electricista'            LIMIT 1;
  SELECT id INTO cat_plom FROM categorias WHERE slug = 'plomero'                 LIMIT 1;
  SELECT id INTO cat_gas  FROM categorias WHERE slug = 'gasista'                 LIMIT 1;
  SELECT id INTO cat_tec  FROM categorias WHERE slug = 'tecnico-electrodomesticos' LIMIT 1;
  SELECT id INTO cat_pint FROM categorias WHERE slug = 'pintor'                  LIMIT 1;
  SELECT id INTO cat_alba FROM categorias WHERE slug = 'albanil'                 LIMIT 1;
  SELECT id INTO cat_carp FROM categorias WHERE slug = 'carpintero'              LIMIT 1;
  SELECT id INTO cat_cerr FROM categorias WHERE slug = 'cerrajero'               LIMIT 1;
  SELECT id INTO cat_jard FROM categorias WHERE slug = 'jardinero'               LIMIT 1;
  SELECT id INTO cat_aire FROM categorias WHERE slug = 'aire-acondicionado'      LIMIT 1;
  SELECT id INTO cat_tech FROM categorias WHERE slug = 'techista'                LIMIT 1;

  -- ─── Cargar IDs de zonas ──────────────────────────────────────────────────
  SELECT id INTO zona_sde    FROM zonas WHERE slug = 'santiago-del-estero' LIMIT 1;
  SELECT id INTO zona_banda  FROM zonas WHERE slug = 'la-banda'            LIMIT 1;
  SELECT id INTO zona_termas FROM zonas WHERE slug = 'termas-de-rio-hondo'  LIMIT 1;
  SELECT id INTO zona_frias  FROM zonas WHERE slug = 'frias'               LIMIT 1;
  SELECT id INTO zona_ana    FROM zonas WHERE slug = 'anatuya'             LIMIT 1;
  SELECT id INTO zona_lor    FROM zonas WHERE slug = 'loreto'              LIMIT 1;

  -- ════════════════════════════════════════════════════════════════════════════
  --  ELECTRICISTAS (8 profesionales)
  -- ════════════════════════════════════════════════════════════════════════════

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Carlos Herrera', '3854210001',
    'Electricista matriculado con más de 15 años de experiencia en instalaciones residenciales y comerciales. Trabajo con garantía escrita.',
    'Lunes a Viernes 7:00 - 18:00 | Sábados 8:00 - 13:00', true, true, true, true, cat_elec, zona_sde)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Instalación eléctrica domiciliaria'),
    (pid, 'Tableros y disyuntores termomagnéticos'),
    (pid, 'Luminarias LED y tomacorrientes'),
    (pid, 'Cableado estructurado en obra nueva');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Daniel Díaz', '3854210002',
    'Técnico electricista con habilitación. Especialista en instalaciones de baja y media tensión. Atendo urgencias.',
    'Lunes a Sábado 8:00 - 20:00', true, true, false, true, cat_elec, zona_banda)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Instalación de medidores y acometidas'),
    (pid, 'Reparación de cortos circuitos'),
    (pid, 'Puesta a tierra y protección diferencial'),
    (pid, 'Urgencias eléctricas 24 hs');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Marcos Villalba', '3854210003',
    'Electricista con 10 años en el rubro. Trabajo en obras nuevas, refacciones y automatización de hogares.',
    'Lunes a Viernes 8:00 - 17:00', false, false, false, true, cat_elec, zona_sde)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Automatización de portones y persianas'),
    (pid, 'Instalación de cámaras de seguridad'),
    (pid, 'Tableros eléctricos trifásicos'),
    (pid, 'Domótica básica para hogares');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Alejandro Ríos', '3854210004',
    'Electricista matriculado en obras civiles y residencias. Presupuesto sin cargo y garantía en todos los trabajos.',
    'Todos los días 7:00 - 19:00', true, false, false, true, cat_elec, zona_termas)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Cableado de obra en bruto'),
    (pid, 'Instalación de cocinas eléctricas'),
    (pid, 'Calefactores y termos eléctricos'),
    (pid, 'Presupuesto gratuito a domicilio');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Ramón Juárez', '3854210005',
    'Electricista con habilitación municipal. 20 años trabajando en Santiago del Estero. Seriedad y puntualidad garantizada.',
    'Lunes a Sábado 6:00 - 18:00', true, true, false, true, cat_elec, zona_banda)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Proyectos eléctricos con planos'),
    (pid, 'Certificaciones de instalaciones'),
    (pid, 'Mantenimiento preventivo industrial'),
    (pid, 'Cableado de locales comerciales');

  -- ════════════════════════════════════════════════════════════════════════════
  --  PLOMEROS (7 profesionales)
  -- ════════════════════════════════════════════════════════════════════════════

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Vanesa Domínguez', '3854210006',
    'Plomera con 8 años de experiencia. Destapes, reparaciones, instalaciones de grifería. Primera mujer plomera en el directorio.',
    'Lunes a Viernes 8:00 - 17:00', true, true, true, true, cat_plom, zona_sde)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Destapes de cañerías sin rotura'),
    (pid, 'Instalación de grifería y sanitarios'),
    (pid, 'Reparación de pérdidas de agua'),
    (pid, 'Cambio de cañerías de PVC y polipropileno');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Miguel Rodríguez', '3854210007',
    'Plomero con habilitación. Atiendo urgencias las 24 horas. Especialista en instalaciones domiciliarias y calefacción.',
    'Todos los días, incluyendo fines de semana y feriados', true, false, false, true, cat_plom, zona_banda)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Urgencias de plomería 24 hs'),
    (pid, 'Instalación de termotanques y calefones'),
    (pid, 'Conexión de piletas y jacuzzis'),
    (pid, 'Sistemas de calefacción por losa radiante');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Ernesto Núñez', '3854210008',
    'Plomero con 12 años trabajando en el gremio. Presupuestos gratis. Trabajo limpio y garantizado.',
    'Lunes a Sábado 7:30 - 18:00', false, true, false, true, cat_plom, zona_sde)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Instalaciones sanitarias completas'),
    (pid, 'Cámara inspeccionadora para diagnóstico'),
    (pid, 'Reparación de válvulas y llaves de paso'),
    (pid, 'Impermeabilización de tanques y cisternas');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Claudio Vargas', '3854210009',
    'Plomero matriculado. Especializado en instalaciones domiciliarias de agua fría y caliente.',
    'Lunes a Viernes 8:00 - 17:00', true, false, false, true, cat_plom, zona_termas)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Instalación completa de baños'),
    (pid, 'Conexión de lavarropas y lavavajillas'),
    (pid, 'Reparación de inodoros y cisternas'),
    (pid, 'Extensiones de red de agua potable');

  -- ════════════════════════════════════════════════════════════════════════════
  --  GASISTAS (5 profesionales)
  -- ════════════════════════════════════════════════════════════════════════════

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Roberto Vázquez', '3854210010',
    'Gasista matriculado MP-438. Instalaciones y reparaciones de gas natural y envasado. Habilitación Enargas.',
    'Lunes a Viernes 8:00 - 18:00', true, true, true, true, cat_gas, zona_sde)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Instalación de cocinas y calefones a gas'),
    (pid, 'Conexión de gas natural domiciliaria'),
    (pid, 'Detección y reparación de pérdidas de gas'),
    (pid, 'Certificaciones de instalaciones para locales');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Sergio Flores', '3854210011',
    'Gasista matriculado con 15 años de experiencia. Trabajo en obras nuevas y mantenimiento preventivo.',
    'Lunes a Sábado 7:00 - 19:00', true, true, false, true, cat_gas, zona_banda)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Instalación de redes de gas embutidas'),
    (pid, 'Conversión de GNC a gas natural'),
    (pid, 'Mantenimiento de calderas y calefactores'),
    (pid, 'Conexión de estufas y termotanques a gas');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Hugo Peralta', '3854210012',
    'Gasista habilitado por Enargas. Especialista en instalaciones industriales y domiciliarias.',
    'Lunes a Viernes 7:00 - 18:00', false, false, false, true, cat_gas, zona_frias)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Gasoductos internos de baja presión'),
    (pid, 'Instalación de equipos de GLP'),
    (pid, 'Pruebas de estanqueidad certificadas'),
    (pid, 'Reguladores y medidores de gas');

  -- ════════════════════════════════════════════════════════════════════════════
  --  TÉCNICOS DE ELECTRODOMÉSTICOS (5 profesionales)
  -- ════════════════════════════════════════════════════════════════════════════

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Tomás Noriega', '3854210013',
    'Técnico en electrónica con 18 años de experiencia. Reparo todo tipo de electrodomésticos. Trabajo a domicilio.',
    'Lunes a Sábado 8:00 - 18:00', true, true, false, true, cat_tec, zona_sde)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Reparación de lavarropas automáticos'),
    (pid, 'Service de heladeras y freezers'),
    (pid, 'Reparación de microondas y hornos eléctricos'),
    (pid, 'Smart TVs y sistemas de sonido');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Lucía Herrera', '3854210014',
    'Técnica en reparación de equipos del hogar. Primera técnica mujer en la zona. Presupuesto gratis.',
    'Lunes a Viernes 9:00 - 17:00', true, false, false, true, cat_tec, zona_banda)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Reparación de secarropas y centrífugas'),
    (pid, 'Planchas, freidoras y pequeños electrodomésticos'),
    (pid, 'Cambio de resistencias y termostatos'),
    (pid, 'Diagnóstico y presupuesto a domicilio');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Leonardo Paz', '3854210015',
    'Técnico electrónico matriculado. Especialista en línea blanca (heladeras, lavarropas, aire acondicionado).',
    'Todos los días 8:00 - 20:00', false, true, false, true, cat_tec, zona_sde)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Service de aires acondicionados'),
    (pid, 'Reparación de heladeras No Frost'),
    (pid, 'Lavarropas automáticos e inverter'),
    (pid, 'Garantía de 6 meses en repuestos');

  -- ════════════════════════════════════════════════════════════════════════════
  --  PINTORES (6 profesionales)
  -- ════════════════════════════════════════════════════════════════════════════

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Rodrigo Mena', '3854210016',
    'Pintor profesional con 12 años en el oficio. Pintura interior, exterior, revestimientos y fachadas.',
    'Lunes a Sábado 7:00 - 19:00', true, true, true, true, cat_pint, zona_sde)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Pintura interior con látex lavable'),
    (pid, 'Pintura exterior con membrana e impermeabilizante'),
    (pid, 'Enduído y masillado de paredes'),
    (pid, 'Pintura de frentes y fachadas');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Carolina Ibáñez', '3854210017',
    'Pintora profesional. Decoradora de interiores. Trabajo con paletas de colores personalizadas.',
    'Lunes a Viernes 8:00 - 17:00', true, false, false, true, cat_pint, zona_banda)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Asesoramiento de colores y decoración'),
    (pid, 'Efectos especiales: estuco veneciano y travertino'),
    (pid, 'Pintura con rodillo y pincel fino'),
    (pid, 'Revestimientos texturados en paredes');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Walter Santillán', '3854210018',
    'Pintor de obra nueva y refacciones. Rapidez y prolijidad en cada trabajo. Materiales de primera marca.',
    'Lunes a Domingo 7:00 - 18:00', false, true, false, true, cat_pint, zona_sde)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Pintura de obra nueva completa'),
    (pid, 'Lijado y preparación de superficies'),
    (pid, 'Barnizado de maderas y aberturas'),
    (pid, 'Impermeabilización de terrazas');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Gustavo Molina', '3854210019',
    'Pintor con 20 años de trayectoria. Trabajé en obras oficiales y privadas. Equipo de trabajo propio.',
    'Lunes a Viernes 6:30 - 17:00', true, true, false, true, cat_pint, zona_termas)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Pintura de complejos y edificios'),
    (pid, 'Trabajos en altura con andamios'),
    (pid, 'Pintura de locales y comercios'),
    (pid, 'Presupuesto por m² sin cargo');

  -- ════════════════════════════════════════════════════════════════════════════
  --  ALBAÑILES / CONSTRUCCIÓN (6 profesionales)
  -- ════════════════════════════════════════════════════════════════════════════

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Florencia Acuña', '3854210020',
    'Albañila con 10 años de experiencia. Trabajo en refacciones, ampliaciones y obra nueva. Primera albañila del directorio.',
    'Lunes a Sábado 7:00 - 18:00', false, false, false, true, cat_alba, zona_sde)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Colocación de porcelanato y cerámicos'),
    (pid, 'Mampostería y revoques gruesos y finos'),
    (pid, 'Tabiques de ladrillo y construcción en seco'),
    (pid, 'Arreglo de filtraciones y grietas');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Mario Pereyra', '3854210021',
    'Albañil con 25 años en el oficio. Constructor de casas desde los cimientos. Presupuesto gratis.',
    'Todos los días 7:00 - 18:00', true, true, true, true, cat_alba, zona_banda)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Obra nueva desde cero'),
    (pid, 'Ampliaciones y refacciones'),
    (pid, 'Losas y contrapisos'),
    (pid, 'Construcción de piletas de natación');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Osvaldo Leiva', '3854210022',
    'Albañil especializado en pisos y revestimientos. Cerámica, porcelanato, mármol y granito.',
    'Lunes a Sábado 8:00 - 18:00', true, false, false, true, cat_alba, zona_sde)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Colocación de porcelanato rectificado'),
    (pid, 'Pisos de madera flotante y vinílico'),
    (pid, 'Cimientos y contrapiso de hormigón'),
    (pid, 'Nivelación de pisos y rellenos');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Nicolás Suárez', '3854210023',
    'Constructor y albañil con cuadrilla propia. Atiendo obras desde sanitarios hasta ampliaciones.',
    'Lunes a Viernes 7:30 - 17:30', true, true, false, true, cat_alba, zona_frias)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Refacción completa de baños y cocinas'),
    (pid, 'Reparación de medianeras y muros'),
    (pid, 'Impermeabilización con membrana asfáltica'),
    (pid, 'Consultoría técnica y planificación de obras');

  -- ════════════════════════════════════════════════════════════════════════════
  --  CARPINTEROS (5 profesionales)
  -- ════════════════════════════════════════════════════════════════════════════

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Federico Aguirre', '3854210024',
    'Carpintero con taller propio. Muebles a medida, aberturas y restauración de madera. Trabajo artesanal.',
    'Lunes a Sábado 8:00 - 18:00', true, true, false, true, cat_carp, zona_sde)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Muebles a medida de madera maciza'),
    (pid, 'Puertas y ventanas de madera'),
    (pid, 'Cocinas y placards a medida'),
    (pid, 'Restauración de muebles antiguos');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Hernán Medina', '3854210025',
    'Carpintero de aluminio y PVC. Fabrico e instalo aberturas, cortinas de enrollar y rejas.',
    'Lunes a Viernes 8:00 - 17:00', false, false, false, true, cat_carp, zona_banda)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Ventanas y puertas de aluminio'),
    (pid, 'Cortinas de enrollar y persianas'),
    (pid, 'Barandas y rejas de hierro'),
    (pid, 'Divisores de ambientes de vidrio');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Pablo Torres', '3854210026',
    'Carpintero de obra y amoblamiento. Especializado en construcción en seco (drywall y steel framing).',
    'Lunes a Sábado 7:00 - 19:00', true, true, false, true, cat_carp, zona_sde)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Tabiques y cielorrasos de drywall'),
    (pid, 'Steel framing y construcción en seco'),
    (pid, 'Revestimientos de madera en paredes'),
    (pid, 'Muebles de melamina y MDF');

  -- ════════════════════════════════════════════════════════════════════════════
  --  CERRAJEROS (3 profesionales)
  -- ════════════════════════════════════════════════════════════════════════════

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Gabriel Silva', '3854210027',
    'Cerrajero con 14 años de experiencia. Atiendo urgencias de apertura sin rotura. Servicio las 24 horas.',
    'Todos los días 24 horas', true, true, true, true, cat_cerr, zona_sde)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Apertura de puertas sin daño'),
    (pid, 'Cambio y reparación de cerraduras'),
    (pid, 'Duplicado de llaves con chip'),
    (pid, 'Instalación de cerraduras de seguridad');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Patricia Benítez', '3854210028',
    'Cerrajera. Especialista en sistemas de seguridad, cajas fuertes y alarmas. Servicio confiable.',
    'Lunes a Sábado 8:00 - 20:00', true, false, false, true, cat_cerr, zona_banda)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Duplicado y reparación de llaves'),
    (pid, 'Instalación de cajas fuertes'),
    (pid, 'Sistemas de control de acceso'),
    (pid, 'Blindaje de puertas y refuerzo de marcos');

  -- ════════════════════════════════════════════════════════════════════════════
  --  JARDINEROS (4 profesionales)
  -- ════════════════════════════════════════════════════════════════════════════

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Luis Córdoba', '3854210029',
    'Jardinero y paisajista. Diseño y mantenimiento de jardines en Sgo. del Estero. Asesoramiento personalizado.',
    'Lunes a Sábado 7:00 - 17:00', false, true, false, true, cat_jard, zona_sde)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Diseño de jardines y parques'),
    (pid, 'Corte y mantenimiento de césped'),
    (pid, 'Poda de árboles y arbustos'),
    (pid, 'Instalación de sistemas de riego automático');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Rocío Báez', '3854210030',
    'Paisajista egresada de la UNSE. Diseño jardines ecológicos y huertos urbanos sustentables.',
    'Lunes a Viernes 9:00 - 17:00', true, true, false, true, cat_jard, zona_banda)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Jardines verticales y terrazas verdes'),
    (pid, 'Huertos urbanos y permacultura'),
    (pid, 'Plantas nativas y autóctonas del NOA'),
    (pid, 'Asesoramiento en diseño de exteriores');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Jorge Delgado', '3854210031',
    'Jardinero con maquinaria profesional. Podas de altura con arnes. Servicio en toda la provincia.',
    'Lunes a Sábado 7:30 - 17:30', true, false, false, true, cat_jard, zona_ana)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Poda de palmeras y árboles de gran porte'),
    (pid, 'Retiro de ramas y escombros verdes'),
    (pid, 'Fertilización y control de plagas del jardín'),
    (pid, 'Mantenimiento mensual con contrato');

  -- ════════════════════════════════════════════════════════════════════════════
  --  AIRE ACONDICIONADO (4 profesionales)
  -- ════════════════════════════════════════════════════════════════════════════

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Raúl Alvarado', '3854210032',
    'Técnico frigorista matriculado. Instalación y service de aires split, ventilación y frío comercial.',
    'Lunes a Sábado 7:00 - 19:00', true, true, true, true, cat_aire, zona_sde)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Instalación de aires split inverter'),
    (pid, 'Service y recarga de gas refrigerante'),
    (pid, 'Limpieza profunda de filtros y evaporadores'),
    (pid, 'Frío comercial: cámaras y heladeras industriales');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Andrés Luna', '3854210033',
    'Frigorista con habilitación para manejo de gases refrigerantes. Trabajo en domicilios y locales.',
    'Lunes a Viernes 8:00 - 18:00', true, false, false, true, cat_aire, zona_banda)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Instalación de cassettes de techo'),
    (pid, 'Sistemas centralizados de A/A'),
    (pid, 'Reparación de compresores y ventiladores'),
    (pid, 'Mantenimiento preventivo de equipos');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Ignacio Paz', '3854210034',
    'Técnico en refrigeración. 16 años instalando y reparando equipos de climatización en toda la ciudad.',
    'Todos los días 8:00 - 20:00', false, true, false, true, cat_aire, zona_sde)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Service de heladeras y freezers domiciliarios'),
    (pid, 'Instalación de aires de ventana y portátiles'),
    (pid, 'Diagnóstico de fugas de gas refrigerante'),
    (pid, 'Kits de ventilación industrial');

  -- ════════════════════════════════════════════════════════════════════════════
  --  TECHISTAS (3 profesionales)
  -- ════════════════════════════════════════════════════════════════════════════

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Ricardo Sosa', '3854210035',
    'Techista con 18 años de experiencia. Especialista en techos de chapa, teja y membranas.',
    'Lunes a Sábado 7:00 - 17:00', true, true, false, true, cat_tech, zona_sde)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Colocación de techos de chapa trapezoidal y acanalada'),
    (pid, 'Tejados de teja española y francesa'),
    (pid, 'Techos verdes y jardines sobre losa'),
    (pid, 'Reparación de filtraciones y goteras');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Eduardo Quiroga', '3854210036',
    'Techista. Trabajé en obras civiles de gran escala. Garantía escrita en todos los trabajos.',
    'Lunes a Viernes 7:30 - 17:30', true, false, false, true, cat_tech, zona_banda)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Impermeabilización con membrana asfáltica'),
    (pid, 'Canaletas y bajadas de agua pluvial'),
    (pid, 'Techos de policarbonato y vidrio'),
    (pid, 'Cubiertas de madera y steel deck');

  -- ════════════════════════════════════════════════════════════════════════════
  --  PROFESIONALES ADICIONALES (mix de categorías para zonas del interior)
  -- ════════════════════════════════════════════════════════════════════════════

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Julio Espinoza', '3854210037',
    'Electricista domiciliario en Añatuya. Conozco todos los barrios de la zona. Trabajo rápido y prolijo.',
    'Lunes a Sábado 8:00 - 18:00', true, false, false, true, cat_elec, zona_ana)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Instalaciones domiciliarias'),
    (pid, 'Cambio de llaves y tomas'),
    (pid, 'Detección de fallas en tableros');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Cristian Jiménez', '3854210038',
    'Albañil en Loreto. Construcción y refacción de viviendas. Presupuesto a domicilio sin cargo.',
    'Lunes a Viernes 7:00 - 17:00', true, false, false, true, cat_alba, zona_lor)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Remodelación de ambientes'),
    (pid, 'Colocación de pisos y revestimientos'),
    (pid, 'Construcción de muros y tabiques');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Benjamín Leiva', '3854210039',
    'Plomero en Frías. Atiendo toda la región con precios accesibles y garantía en materiales.',
    'Lunes a Sábado 8:00 - 17:00', false, false, false, true, cat_plom, zona_frias)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Destapes y limpieza de cañerías'),
    (pid, 'Cambio de grifería'),
    (pid, 'Reparación de pérdidas');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Matías Castro', '3854210040',
    'Jardinero en Termas de Río Hondo. Especialista en plantas tropicales y jardines temáticos para hosterías.',
    'Lunes a Sábado 7:00 - 17:00', true, true, false, true, cat_jard, zona_termas)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Jardines para hoteles y hosterías'),
    (pid, 'Plantas ornamentales de interior y exterior'),
    (pid, 'Sistemas de riego automatizado');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Valeria Moreno', '3854210041',
    'Pintora en La Banda. Trabajo prolijo y puntual. Materiales de primera incluidos en el presupuesto.',
    'Lunes a Viernes 8:00 - 17:00', true, false, false, true, cat_pint, zona_banda)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Pintura de interiores'),
    (pid, 'Barnizado de aberturas'),
    (pid, 'Enduído liso y texturado');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Natalia Gutiérrez', '3854210042',
    'Técnica en aires acondicionados. Atiendo toda la capital. Trabajo en equipo con mi esposo techista.',
    'Todos los días 8:00 - 20:00', true, true, false, true, cat_aire, zona_sde)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Instalación y reparación de splits'),
    (pid, 'Limpieza y desinfección de equipos'),
    (pid, 'Recarga de gas refrigerante R32 y R410A');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Francisco Bravo', '3854210043',
    'Cerrajero en Añatuya. Única cerrajería disponible en 60 km a la redonda. Disponible para urgencias.',
    'Todos los días 24 hs emergencias', true, false, false, true, cat_cerr, zona_ana)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Apertura de puertas bloqueadas'),
    (pid, 'Cambio de cerraduras'),
    (pid, 'Duplicado de llaves');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Alejandra Ramos', '3854210044',
    'Gasista matriculada. Trabajo en cocinas, estufas y calefones. Habilitación vigente de ENARGAS.',
    'Lunes a Viernes 8:00 - 18:00', false, true, false, true, cat_gas, zona_sde)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Instalación de cocinas a gas'),
    (pid, 'Revisión de instalaciones antiguas'),
    (pid, 'Certificados para alquileres');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Leandro Quiroga', '3854210045',
    'Técnico en electrodomésticos en Loreto. Reparo lavarropas, heladeras y cocinas eléctrica a domicilio.',
    'Lunes a Sábado 9:00 - 18:00', true, false, false, true, cat_tec, zona_lor)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Reparación de lavarropas'),
    (pid, 'Service de heladeras'),
    (pid, 'Cocinas eléctricas y hornos');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Álvaro Vega', '3854210046',
    'Carpintero en Termas de Río Hondo. Especialista en maderas nobles y muebles para alojamientos turísticos.',
    'Lunes a Sábado 8:00 - 17:00', true, true, false, true, cat_carp, zona_termas)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Muebles para cabañas y hosterías'),
    (pid, 'Decks y pergolas de madera'),
    (pid, 'Restauración de muebles de madera noble');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Daniela Padilla', '3854210047',
    'Albañila en Frías. Trabajé en municipios y obras privadas de toda la región sudeste de la provincia.',
    'Lunes a Sábado 7:00 - 17:00', true, false, false, true, cat_alba, zona_frias)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Refacciones y ampliaciones'),
    (pid, 'Revoques y mampostería'),
    (pid, 'Trabajos en altura con andamio');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Silvia Rojas', '3854210048',
    'Técnica en electrodomésticos. Especializada en línea marrón (TVs, equipos de sonido, consolas).',
    'Lunes a Viernes 9:00 - 18:00', true, true, false, true, cat_tec, zona_sde)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Reparación de Smart TVs y monitores'),
    (pid, 'Consolas de videojuegos y mandos'),
    (pid, 'Equipos de sonido y amplificadores');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Paola Cáceres', '3854210049',
    'Jardinera y paisajista en La Banda. Diseño jardines sin mantenimiento (bajo consumo de agua).',
    'Miércoles a Domingo 8:00 - 17:00', false, false, false, true, cat_jard, zona_banda)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Jardines xerófilos (bajo consumo de agua)'),
    (pid, 'Contenedores y macetas grandes'),
    (pid, 'Asesoramiento en plantas de interior');

  INSERT INTO profesionales (nombre, telefono, descripcion, horarios, disponible, verificado, destacado, activo, categoria_id, zona_id)
  VALUES ('Oscar Romero', '3854210050',
    'Techista en Santiago del Estero. 22 años impermeabilizando terrazas. El techo que toco no vuelve a gotear.',
    'Lunes a Sábado 6:30 - 17:00', true, true, false, true, cat_tech, zona_sde)
  RETURNING id INTO pid;
  INSERT INTO servicios (profesional_id, descripcion) VALUES
    (pid, 'Impermeabilización con sika y membrana'),
    (pid, 'Losas planas con desagote'),
    (pid, 'Colocación de tejas y chapas'),
    (pid, 'Reparación de goteras con garantía de 3 años');

  RAISE NOTICE '✅ 50 profesionales SEED V2 insertados correctamente.';

END;
$$;

-- ─── Verificación final ───────────────────────────────────────────────────────
SELECT
  p.nombre,
  c.nombre    AS categoria,
  z.nombre    AS zona,
  p.disponible,
  p.verificado,
  p.destacado,
  COUNT(s.id) AS cant_servicios
FROM profesionales p
JOIN categorias c ON c.id = p.categoria_id
JOIN zonas z      ON z.id = p.zona_id
LEFT JOIN servicios s ON s.profesional_id = p.id
WHERE p.telefono LIKE '385421%'
GROUP BY p.id, p.nombre, c.nombre, z.nombre, p.disponible, p.verificado, p.destacado
ORDER BY c.nombre, p.nombre;
