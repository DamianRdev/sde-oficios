-- ═══════════════════════════════════════════════════════════════════════════
--  SDE OFICIOS — Script de carga de 50 profesionales de prueba (sin foto)
--  Versión corregida — usa DO $$ para evitar restricciones de CTEs
--
--  INSTRUCCIONES:
--  1. Supabase → SQL Editor → pegá todo este script → Run
--  2. Al final verás la tabla con los 50 insertados
--  3. Para eliminarlos usá: seed-cleanup.sql
-- ═══════════════════════════════════════════════════════════════════════════

DO $$
DECLARE
  -- Arrays de datos de prueba
  v_nombres    text[] := ARRAY[
    'Carlos Herrera','Miguel Rodríguez','Juan Pérez','Roberto Gómez','Diego Fernández',
    'Gustavo Molina','Pablo Torres','Ernesto Díaz','Ricardo Sosa','Luis Córdoba',
    'Marcos Villalba','Sebastián Ruiz','Federico Aguirre','Nicolás Suárez','Andrés Luna',
    'Hernán Medina','Oscar Romero','Matías Castro','Claudio Vargas','Gabriel Silva',
    'Ana González','María López','Laura Martínez','Silvia Rojas','Patricia Benítez',
    'Carolina Ibáñez','Valeria Moreno','Natalia Gutiérrez','Alejandra Ramos','Florencia Acuña',
    'Walter Santillán','Mario Pereyra','Jorge Delgado','Raúl Alvarado','Eduardo Ríos',
    'Francisco Bravo','Julio Espinoza','Rodrigo Mena','Sergio Flores','Tomás Noriega',
    'Ignacio Paz','Benjamín Leiva','Cristian Jiménez','Leandro Quiroga','Álvaro Vega',
    'Daniela Padilla','Lucía Herrera','Rocío Báez','Paola Cáceres','Vanesa Domínguez'
  ];

  v_telefonos  text[] := ARRAY[
    '3854100001','3854100002','3854100003','3854100004','3854100005',
    '3854100006','3854100007','3854100008','3854100009','3854100010',
    '3854100011','3854100012','3854100013','3854100014','3854100015',
    '3854100016','3854100017','3854100018','3854100019','3854100020',
    '3854100021','3854100022','3854100023','3854100024','3854100025',
    '3854100026','3854100027','3854100028','3854100029','3854100030',
    '3854100031','3854100032','3854100033','3854100034','3854100035',
    '3854100036','3854100037','3854100038','3854100039','3854100040',
    '3854100041','3854100042','3854100043','3854100044','3854100045',
    '3854100046','3854100047','3854100048','3854100049','3854100050'
  ];

  -- Servicios agrupados por tipo de oficio (10 grupos, 3 servicios c/u)
  v_servicios  text[][] := ARRAY[
    ARRAY['Instalación eléctrica domiciliaria','Tableros y disyuntores','Luminarias y tomacorrientes'],
    ARRAY['Destapes de cañerías','Instalación de grifería','Reparación de pérdidas de agua'],
    ARRAY['Mampostería y revoques','Pisos y revestimientos','Construcción de muros'],
    ARRAY['Instalación de termotanques','Conexión de gas natural','Gasoductos domiciliarios'],
    ARRAY['Pintura interior y exterior','Revestimientos de paredes','Pintura de frentes'],
    ARRAY['Muebles a medida','Puertas y ventanas','Reparación de muebles'],
    ARRAY['Fumigación de cucarachas','Tratamiento de termitas','Control de plagas'],
    ARRAY['Reparación de celulares','Computadoras y laptops','Smart TVs y consolas'],
    ARRAY['Corte de jardines','Podas de árboles','Diseño de jardines'],
    ARRAY['Colocación de porcelanato','Cerámicos y mosaicos','Pulido de pisos']
  ];

  v_horarios   text[] := ARRAY[
    'Lunes a Sábado de 8:00 a 18:00',
    'Lunes a Viernes de 7:00 a 17:00',
    'Todos los días de 9:00 a 20:00'
  ];

  -- Variables de trabajo
  v_cat_ids    uuid[];
  v_zona_ids   uuid[];
  v_cat_count  int;
  v_zona_count int;
  v_prof_id    uuid;
  v_cat_idx    int;
  v_zona_idx   int;
  v_srv_idx    int;
  i            int;
  j            int;
BEGIN
  -- Cargar IDs de categorías y zonas activas
  SELECT array_agg(id ORDER BY orden) INTO v_cat_ids
  FROM categorias WHERE activo = true;

  SELECT array_agg(id ORDER BY nombre) INTO v_zona_ids
  FROM zonas WHERE activo = true;

  v_cat_count  := coalesce(array_length(v_cat_ids, 1), 0);
  v_zona_count := coalesce(array_length(v_zona_ids, 1), 0);

  IF v_cat_count = 0 THEN
    RAISE EXCEPTION 'No hay categorías activas. Cargá las categorías primero.';
  END IF;
  IF v_zona_count = 0 THEN
    RAISE EXCEPTION 'No hay zonas activas. Cargá las zonas primero.';
  END IF;

  RAISE NOTICE 'Usando % categorías y % zonas', v_cat_count, v_zona_count;

  -- Insertar los 50 profesionales
  FOR i IN 1..50 LOOP

    -- Índices rotativos (1-based arrays en PostgreSQL)
    v_cat_idx  := ((i - 1) % v_cat_count)  + 1;
    v_zona_idx := ((i - 1) % v_zona_count) + 1;
    v_srv_idx  := ((i - 1) % 10)           + 1;

    -- Insertar profesional
    INSERT INTO profesionales (
      nombre,
      telefono,
      foto_url,
      descripcion,
      horarios,
      disponible,
      verificado,
      destacado,
      activo,
      categoria_id,
      zona_id
    )
    VALUES (
      v_nombres[i],
      v_telefonos[i],
      NULL,                          -- ← SIN FOTO (mostrará iniciales)
      '[SEED] Profesional de prueba. No contactar.',
      v_horarios[((i - 1) % 3) + 1],
      (i % 5 != 0),                  -- ~80% disponibles
      (i % 3 = 0),                   -- ~33% verificados
      (i % 10 = 0),                  -- 10% destacados
      true,
      v_cat_ids[v_cat_idx],
      v_zona_ids[v_zona_idx]
    )
    RETURNING id INTO v_prof_id;

    -- Insertar 3 servicios por profesional
    FOR j IN 1..3 LOOP
      INSERT INTO servicios (profesional_id, descripcion)
      VALUES (v_prof_id, v_servicios[v_srv_idx][j]);
    END LOOP;

    RAISE NOTICE 'Insertado [%/%]: %', i, 50, v_nombres[i];
  END LOOP;

  RAISE NOTICE '✅ 50 profesionales de prueba insertados correctamente.';
END;
$$;

-- ─── Verificación — mostrá los insertados ────────────────────────────────────
SELECT
  p.nombre,
  c.nombre   AS categoria,
  z.nombre   AS zona,
  p.disponible,
  p.verificado,
  p.destacado,
  COUNT(s.id) AS servicios
FROM profesionales p
JOIN categorias c ON c.id = p.categoria_id
JOIN zonas z      ON z.id = p.zona_id
LEFT JOIN servicios s ON s.profesional_id = p.id
WHERE p.descripcion LIKE '%[SEED]%'
GROUP BY p.nombre, c.nombre, z.nombre, p.disponible, p.verificado, p.destacado
ORDER BY p.nombre;
