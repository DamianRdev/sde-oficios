# 📋 SDE Oficios — Documento de Control del Proyecto

> **Última actualización:** 22 de febrero de 2026  
> **Repositorio:** https://github.com/DamianRdev/sde-oficios  
> **URL en producción:** *(cargar URL de Vercel cuando esté disponible)*  
> **Contacto dev:** WhatsApp +54 385 402 6867

---

## 🗂️ Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + TypeScript + Vite 5 |
| Estilos | Tailwind CSS + shadcn/ui |
| Base de datos | Supabase (PostgreSQL) |
| Auth admin | Supabase Auth |
| Storage fotos | Supabase Storage |
| Email | EmailJS |
| IA (descripciones) | Google Gemini 2.0 Flash |
| Deploy | Vercel |
| Control de versiones | GitHub |

---

## 🔑 Variables de entorno requeridas

> ⚠️ **Nunca commitear el `.env.local`** — ya está en `.gitignore`

```env
VITE_SUPABASE_URL=https://huhwirnxpjyhrhhgcxzr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_EMAILJS_SERVICE_ID=service_kqbq6yq
VITE_EMAILJS_TEMPLATE_SOLICITUD=template_hgcr4ey
VITE_EMAILJS_PUBLIC_KEY=Ua7xIHOTD2rB9GT-4
VITE_ADMIN_EMAIL=damian.exequiel.r@gmail.com
VITE_GEMINI_API_KEY=AIzaSy...
```

🔗 **En Vercel:** Settings → Environment Variables → agregar todas.

---

## ✅ Funcionalidades implementadas

### 🏗️ Estructura base
- [x] Proyecto Vite + React + TypeScript inicializado
- [x] Tailwind CSS configurado con paleta de colores SDE (celeste, rojo, dorado)
- [x] shadcn/ui integrado (Button, Card, Toast, etc.)
- [x] React Router configurado con rutas públicas y de admin
- [x] React Query para manejo de datos
- [x] Supabase client configurado
- [x] Tipografías: Inter (cuerpo) + Poppins (títulos) desde Google Fonts

### 🏠 Página principal (`/`)
- [x] Header con logo y navegación
- [x] Sección hero con buscador
- [x] Filtros por categoría y zona
- [x] Grilla de cards de profesionales
- [x] Skeleton loaders mientras carga
- [x] Footer con columnas: Marca / Navegación / Contacto

### 🧑‍🔧 Directorio de profesionales
- [x] Vista `profesionales_completos` en Supabase (JOIN de tablas)
- [x] Filtros por categoría, zona, búsqueda libre, disponibilidad
- [x] Paginación / carga de más resultados
- [x] Indicadores: ✅ Verificado, ⭐ Destacado, 🟢 Disponible
- [x] Card con foto, nombre, categoría, zona, calificación promedio

### 👤 Perfil de profesional (`/profesional/:id`)
- [x] Datos completos del profesional
- [x] Botón WhatsApp con mensaje personalizado
- [x] Botones de redes sociales (Facebook, Instagram, TikTok)
- [x] Sistema de reseñas: ver, agregar, calificación con estrellas
- [x] Registro de contactos por WhatsApp (analytics básico)
- [x] Servicios, horarios, descripción

### 📝 Formulario de registro (`/registrarse`)
- [x] Campos: nombre, teléfono, categoría, zona, horarios
- [x] Textarea de descripción con contador de caracteres (máx 500)
- [x] **✨ Botón "Mejorar con IA"** usando Gemini 2.0 Flash
  - Corrige ortografía
  - Mejora profesionalismo
  - Mantiene tono coloquial argentino (vos, etc.)
  - Manejo de errores: 429 (rate limit), 403 (key inválida), sin red
- [x] Subida de foto de perfil (Supabase Storage, máx 3MB)
- [x] Preview de la card en tiempo real antes de enviar
- [x] Sección opcional de **redes sociales** (toggle expandible)
  - Facebook URL
  - Instagram URL
  - TikTok URL
  - Validación de formato de URL
- [x] Envío a tabla `solicitudes_registro` (estado: pendiente)
- [x] Email de notificación al admin vía EmailJS

### 🛡️ Panel de administración (`/admin`)
- [x] Login seguro con Supabase Auth
- [x] Ruta protegida con `ProtectedAdminRoute`
- [x] Dashboard con métricas básicas
- [x] **Gestión de solicitudes**
  - Ver listado con estado (pendiente / aprobado / rechazado)
  - Expandir detalle: datos, foto, redes sociales
  - Aprobar → crea profesional en tabla `profesionales`
  - Rechazar con nota
  - Pasar redes sociales al profesional al aprobar
- [x] **Gestión de profesionales**
  - Activar/desactivar
  - Marcar como verificado / destacado
  - Disponibilidad
- [x] **Gestión de reseñas**
  - Ver todas, aprobar o rechazar

### 📱 PWA (Progressive Web App)
- [x] `vite-plugin-pwa` instalado y configurado
- [x] Manifest con: nombre, descripción, tema celeste `#75AADB`
- [x] `registerType: "autoUpdate"` — se actualiza sola
- [x] Caché offline de assets estáticos (JS, CSS, HTML, imágenes)
- [x] Caché de Google Fonts (365 días)
- [x] Meta tags iOS: `apple-mobile-web-app-capable`, `theme-color`
- [x] Instalable en Android (Chrome) y iOS (Safari → Agregar a inicio)
- [ ] ⚠️ **Pendiente:** reemplazar iconos placeholder por PNGs reales
  - Generar en [realfavicongenerator.net](https://realfavicongenerator.net)
  - Guardar como `public/pwa-192x192.png` y `public/pwa-512x512.png`
  - Actualizar `vite.config.ts` para apuntar a archivos locales

### 💬 Botón flotante de WhatsApp
- [x] Componente `WhatsAppFloat.tsx` en esquina inferior derecha
- [x] Animación de pulso (ping)
- [x] Tooltip al hacer hover
- [x] Mensaje predefinido: "Hola! Te escribo desde SDE Oficios 👋"
- [x] Número: **+54 385 402 6867**
- [x] Oculto en el panel de administración

### 🌐 Despliegue y DevOps
- [x] Eliminado todo rastro de Lovable (tagger, package.json, README, meta tags)
- [x] Repositorio GitHub creado: `DamianRdev/sde-oficios`
- [x] Primer commit y push exitoso (`main`)
- [x] `vite.config.ts` con code splitting optimizado
- [x] `vercel.json` configurado para SPA routing
- [ ] ⚠️ **Pendiente:** cargar variables de entorno en el dashboard de Vercel
- [ ] ⚠️ **Pendiente:** confirmar URL de producción y actualizar en `index.html` (og:url)

---

## 🔄 Pendientes y mejoras futuras

### 🔴 Críticos (antes de lanzar públicamente)
- [ ] Subir íconos PNG reales a `public/` (pwa-192x192.png, pwa-512x512.png)
- [ ] Cargar todas las variables de entorno en Vercel
- [ ] Configurar dominio personalizado en Vercel (si corresponde)
- [ ] Ejecutar migraciones SQL de redes sociales en Supabase producción:
  - `supabase-migration-redes-sociales.sql`
- [ ] Probar flujo completo de registro → aprobación → perfil público

### 🟡 Importantes (primera semana de uso)
- [ ] Imagen OG real (`public/og-image.png`) para compartir en redes
- [ ] Confirmar que EmailJS envía correctamente en producción
- [ ] Testear PWA instalable en un dispositivo Android real
- [ ] Testear PWA instalable en iPhone (Safari → botón compartir → Agregar a inicio)
- [ ] Agregar Google Analytics o similar para métricas de visitas

### 🟢 Mejoras a futuro
- [ ] Notificaciones push cuando llega una nueva solicitud de registro
- [ ] Panel de analytics para el admin (contactos por WhatsApp por profesional)
- [ ] Filtro de rango de precios o presupuesto en el profesional
- [ ] Sistema de "disponibilidad horaria" más detallado (agenda)
- [ ] Galería de trabajos realizados (múltiples fotos)
- [ ] Verificación por WhatsApp del número de teléfono al registrarse
- [ ] Exportar listado de profesionales a CSV desde admin
- [ ] Modo oscuro

---

## 🗄️ Estructura de la base de datos (Supabase)

### Tablas principales
| Tabla | Descripción |
|-------|-------------|
| `categorias` | Tipos de oficio (Electricista, Plomero, etc.) |
| `zonas` | Zonas geográficas (capital, banda, etc.) |
| `profesionales` | Profesionales aprobados y activos |
| `solicitudes_registro` | Solicitudes pendientes de aprobación |
| `resenas` | Reseñas de usuarios sobre profesionales |
| `contactos_whatsapp` | Log de contactos (analytics) |

### Vista principal
| Vista | Descripción |
|-------|-------------|
| `profesionales_completos` | JOIN de profesionales + categorías + zonas + stats |

### Columnas de redes sociales (agregar con migration)
```sql
-- Aplicar en: supabase-migration-redes-sociales.sql
ALTER TABLE solicitudes_registro
  ADD COLUMN facebook_url  TEXT,
  ADD COLUMN instagram_url TEXT,
  ADD COLUMN tiktok_url    TEXT;

ALTER TABLE profesionales
  ADD COLUMN facebook_url  TEXT,
  ADD COLUMN instagram_url TEXT,
  ADD COLUMN tiktok_url    TEXT;
```

---

## 📁 Archivos SQL importantes

| Archivo | ¿Qué hace? | ¿Aplicado? |
|---------|-----------|-----------|
| `supabase-schema.sql` | Esquema base completo | ✅ |
| `supabase-schema-final.sql` | Esquema actualizado | ✅ |
| `supabase-migration-redes-sociales.sql` | Agrega columnas de RRSS | ⚠️ Verificar |
| `supabase-storage-resenas.sql` | Bucket de fotos | ✅ |
| `supabase-admin-policies.sql` | Políticas RLS de admin | ✅ |
| `seed-profesionales.sql` | Datos de prueba | Solo dev |

---

## 🚀 Comandos del proyecto

```bash
# Desarrollo local
npm run dev

# Verificar tipos TypeScript
npx tsc --noEmit

# Build producción
npm run build

# Preview del build
npm run preview

# Commit y push a GitHub
git add .
git commit -m "descripción"
git push origin main
```

---

## 🗺️ Rutas de la aplicación

| Ruta | Componente | Acceso |
|------|-----------|--------|
| `/` | `Index.tsx` | Público |
| `/profesional/:id` | `ProfessionalProfile.tsx` | Público |
| `/registrarse` | `Register.tsx` | Público |
| `/admin/login` | `AdminLogin.tsx` | Público |
| `/admin` | `AdminDashboard.tsx` | 🔐 Admin |
| `/admin/solicitudes` | `AdminSolicitudes.tsx` | 🔐 Admin |
| `/admin/profesionales` | `AdminProfesionales.tsx` | 🔐 Admin |
| `/admin/resenas` | `AdminResenas.tsx` | 🔐 Admin |

---

## 💡 Notas técnicas importantes

### Gemini API (IA)
- Modelo: `gemini-2.0-flash` (gratuito, ~15 req/min)
- Si da error **429**: esperar ~30 segundos y reintentar (es límite de tasa, no error de config)
- Si da error **403**: revisar que la API key en `.env.local` sea válida
- La key **no se sube a GitHub** (cubierta por `*.local` en `.gitignore`)

### Supabase Storage
- Bucket: `fotos-profesionales`
- Tamaño máximo de foto: **3 MB**
- Formatos aceptados: JPEG, PNG, WebP

### PWA en iOS
- iOS requiere que el usuario lo instale manualmente:
  Safari → Botón de compartir (cuadrado con flecha) → "Agregar a pantalla de inicio"
- El ícono del homescreen viene de `apple-touch-icon`

### Vercel SPA routing
- `vercel.json` tiene `rewrites` para que `/registro`, `/profesional/:id` etc. no den 404
