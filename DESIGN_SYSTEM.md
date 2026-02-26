# 🎨 Sistema de Diseño: SDE Oficios

Este documento define la identidad visual y los lineamientos de interfaz de usuario (UI) para el marketplace **SDE Oficios**, enfocado en la usabilidad, cercanía y legibilidad para todos los usuarios de Santiago del Estero.

---

## 🎨 1. Paleta de Colores (Tokens)

La paleta está directamente inspirada en la bandera de la provincia de Santiago del Estero, priorizando la claridad y el alto contraste.

### Colores de Marca
| Token de Tailwind | Hexadecimal | Uso principal |
| :--- | :--- | :--- |
| `bg-primary` / `text-primary` | **#75AADB** (Celeste Bandera) | Header, enlaces, íconos principales, focus rings y botones primarios. Trasmite tranquilidad y confianza profesional. |
| `bg-sde-rojo` / `text-sde-rojo` | **#D21010** (Rojo Punzó) | Llamadas a la acción principales (CTA), botones de búsqueda, alertas, notificaciones críticas. Usar con moderación. |
| `bg-sde-dorado` / `text-sde-dorado` | **#FCBF49** (Dorado del Sol) | Acento visual: Estrellas de reseñas, insignias de "Profesional Destacado", detalles decorativos. |

### Fondos y Superficies
| Token de Tailwind | Hexadecimal | Uso principal |
| :--- | :--- | :--- |
| `bg-background` | **#FFFFFF** (Blanco) | Fondo principal de la aplicación. Facilita la lectura extrema. |
| `bg-card` | **#FFFFFF** (Blanco) | Fondo de las tarjetas de profesionales, con borde o sombra suave. |
| `bg-muted` / `bg-secondary` | **#F7F7F7** (Gris Suave) | Fondos alternativos para separar secciones, estados deshabilitados o pastillas (badges) neutras. |

### Tipografía y Texto
| Token de Tailwind | Hexadecimal | Uso principal |
| :--- | :--- | :--- |
| `text-foreground` | **#222222** (Gris Oscuro) | Texto principal de la app, títulos y párrafos estándar. Alto contraste sobre blanco sin ser negro puro. |
| `text-muted-foreground` | **#666666** (Gris Medio) | Texto secundario, subtítulos, placeholders, descripciones de oficios. |

*Nota: Todas estas variables ya están implementadas en `tailwind.config.ts` y en `index.css` bajo las raíces CSS.*

---

## 🔤 2. Sistema Tipográfico

Hemos seleccionado una combinación de Google Fonts de alto rendimiento, gran legibilidad y estilo moderno:

### Títulos y Encabezados (Display)
- **Fuente:** `Poppins` (Google Fonts)
- **Pesos:** SemiBold (600), Bold (700), Black (900)
- **Uso:** Exclusivo para nombres de profesionales, títulos de secciones (H1, H2, H3) y texto de impacto en el Hero. Aporta cercanía y un toque geométrico moderno.
- **Clase Tailwind:** `font-display`

### Cuerpo y Lectura (Body)
- **Fuente:** `Inter` (Google Fonts) o `system-ui`
- **Pesos:** Regular (400), Medium (500), SemiBold (600)
- **Uso:** Párrafos, descripciones, botones, badges, labels de formularios. Al ser una fuente muy neutral, compensa la fuerte personalidad del *Poppins*.
- **Clase Tailwind:** `font-sans`

---

## 🧩 3. Componentes Clave (UI)

### A. Botones (Buttons)
Los botones deben ser grandes (mínimo 48px de alto en mobile) para facilitar el tap.

- **Primario (Búsqueda/Acción fuerte):** 
  - Fondo: Rojo Punzó (`#D21010`)
  - Texto: Blanco, Bold.
  - Radio: Redondeado moderno (`rounded-2xl` o `rounded-[14px]`).
- **Secundario (Filtros/Opciones):**
  - Fondo: Blanco o Gris claro (`#F7F7F7`).
  - Borde: Celeste o Gris sutil.
- **Botón WhatsApp (Contactar):**
  - Fondo: Verde WhatsApp (`#25D366`), para fuerte reconocimiento mental.
  - Ocupa el 100% del ancho en tarjetas móviles.

### B. Tarjetas de Profesional (Cards)
Estructura pensada para que el vecino identifique rápido lo que le importa:

1. **Avatar/Foto:** Cuadrada con esquinas muy redondeadas a la izquierda. Si no hay foto, fondo gris cálido con iniciales.
2. **Encabezado derecho:** Nombre del profesional en `Poppins Bold` oscuro. Abajo de esto, el Oficio en Rojo (ej: ELECTRICISTA) para lectura en Z.
3. **Calificación y Verificación:** Las 5 estrellas en color dorado (`#FCBF49`) junto a la nota numérica. A un lado, un pequeño badge celeste `#75AADB` de "✔ VERIFICADO".
4. **Badges de Información:**
   - **Disponibilidad:** Fondo rosado pálido + texto rojo si está disponible.
   - **Zona:** Badge celeste clarito + ícono de `MapPin`.
   - **Especialidades:** Badges sutiles para cosas como ("Caños", "Aires").
5. **Call to Action Inferior:** Dos recuadros grandes separados por un pipe o fila de botones: `Llamar` (Gris/Negro) y `WhatsApp` (Verde).

### C. Navegación (Header)
- **Izquierda:** Logo tipográfico o isotipo simple, usando Poppins Black en color negro/celeste.
- **Derecha:** Botón secundario para "Publicar mi Oficio" destacando en Celeste o texto simple. 
- **Fondo:** Blanco sólido con una sombra apenas perceptible (`shadow-sm`) al hacer scroll. Franja superior muy delgada (3px) con los tres colores (celeste, blanco, rojo) como sutil guiño santiagueño.

### D. Formulario / Modal de WhatsApp
Estructura al intentar contactar a un oficio:

1. **Mensaje precargado:** "Hola {Nombre}, te contacto desde SDE Oficios..."
2. **Claridad:** El usuario nunca llena datos, simplemente hace clic en "Abrir WhatsApp" y es redirigido a la API oficial (`wa.me/`).
3. **Seguridad:** Advertencia sutil en gris `texto-muted-foreground`: *"SDE Oficios no interviene en los pagos ni cobros. Acordá los detalles directamente con el profesional."*

---

## 📱 4. Reglas de Usabilidad y Accesibilidad

1. **Mobile First Total:** El 90% de los vecinos buscarán oficios desde su celular. Todo elemento clickeable debe medir al menos `44px x 44px`.
2. **Evitar Zoom Involuntario:** Todos los `<input>` tienen predefinido al menos `16px` de tamaño de fuente nativa, lo cual evita que iOS Safari haga zoom automático arruinando el layout.
3. **Contraste Rápido:** No dependemos de tonos oscuros de fondo en el área de listados, manteniendo el fondo de la grilla en `#F7F7F7` y las tarjetas en `#FFFFFF` puro para resaltar las sombras de elevación y jerarquizar a los trabajadores.
