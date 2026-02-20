# SDE Oficios

Directorio de profesionales del hogar para Santiago del Estero, Argentina.  
Conectamos vecinos con electricistas, plomeros, gasistas, técnicos y más oficios de confianza.

## Stack tecnológico

- **Frontend:** React + TypeScript + Vite
- **Estilos:** Tailwind CSS + shadcn/ui
- **Base de datos:** Supabase (PostgreSQL)
- **Email:** EmailJS
- **IA:** Google Gemini 2.0 Flash (mejora de descripciones)
- **Deploy:** Vercel

## Variables de entorno requeridas

Creá un archivo `.env.local` con:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_SOLICITUD=...
VITE_EMAILJS_PUBLIC_KEY=...
VITE_ADMIN_EMAIL=...
VITE_GEMINI_API_KEY=...
```

## Desarrollo local

```bash
npm install
npm run dev
```

## Deploy

El proyecto se deploya automáticamente en Vercel al hacer push a `main`.  
Asegurate de cargar todas las variables de entorno en el dashboard de Vercel.
