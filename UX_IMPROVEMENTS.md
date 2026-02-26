# 📋 Checklist de Mejoras UI/UX: SDE Oficios

Basado en la auditoría de Experiencia de Usuario (UX) e Interfaz (UI) del proyecto, a continuación se detallan las propuestas de mejora priorizadas para ir implementando y marcando su progreso de manera progresiva.

---

## 🟡 Tareas de Alta Prioridad (Quick Wins)

Pequeñas mejoras con un gran impacto en la retención del usuario:

- [x] **Estado Vacío (Empty State) en la Búsqueda:**
  - Cuando los filtros o el buscador no arrojan resultados, mostrar un componente amigable (ej. una lupa rota o un emoji 😞) y un botón llamativo con clase de color `sde-rojo` para limpiar rápidamente todos los filtros.

- [x] **Incentivo Visual en Redes Sociales (Registro):**
  - En la página de "Registrar Oficio" (`Register.tsx`), incluir los iconos pequeños de WhatsApp, Facebook, Instagram y TikTok justo a un lado del Toggle (interruptor) de habilitar redes, motivando a completar dichos campos.

- [x] **Icono Exploratorio en Tarjetas Recortadas:**
  - Si una descripción (`line-clamp-2`) dentro de la tarjeta del profesional queda cortada porque es muy larga, agregar un diminuto "Leer más" o un pequeño icono (`ChevronDown`) para que el usuario sepa que puede entrar al perfil.

---

## 🟢 Tareas de Prioridad Media (Accesibilidad y Funciones)

Ayudan a solidificar las métricas de accesibilidad para evitar problemas de contraste y completismo local.

- [x] ~~**Alternativa para Llamadas (Perfil de Profesional):**~~
  - *Las llamadas directas fueron removidas del proyecto por completo para unificar canales a WhatsApp. Componentes simplificados para abarcar 100% de ancho.*

- [x] **Refinamiento de Tooltips en Iconos Flotantes:**
  - Revisar que el componente `WhatsAppFloat.tsx` (Botón burbuja inferior derecho) cuente con la etiqueta de texto visible `aria-label="Contacto de Soporte"` en pantalla o que su tooltip resalte sutilmente en mobile y desktop para más interactividad visual.

- [x] **Testeo Exhaustivo del Contraste Crítico `dark:text`:**
  - Auditar que cada texto y badge que contenga variables ligadas a `--sde-rojo` o `--destructive` pase la prueba del ratio de contraste en modo nocturno. (Ej: Forzar color a blanco sobre ese rojo aunque cambie el tema).

---

## 🔵 Tareas de Baja Prioridad / Feature (Largo Plazo)

Complementan orgánicamente la aplicación añadiendo valor sin estorbar el flujo base:

- [ ] **Módulo de "Guía de Precios Sugeridos":**
  - Una sección pequeña extra para informar al vecino de los valores base y orientativos de la provincia, dándoles así seguridad mental antes de contratar.
- [x] **Botón "Compartir Perfil":**
  - Dentro de la vista detallada del profesional (`ProfessionalProfile.tsx`), agregar el botón "Compartir Perfil". Esto emplearía idealmente la **Web Share API** (`navigator.share()`) permitiendo a los vecinos viralizar los oficios fácilmente por WhatsApp.
- [ ] **Galería Visual de Trabajos Realizados:**
  - Habilitar que el Profesional desde su registro pueda subir un par de imágenes extra, demostrando su trabajo a nivel empírico en el perfil.
