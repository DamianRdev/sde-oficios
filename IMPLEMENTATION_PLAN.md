# Plan de Implementación: Simplificación del Footer para Móviles

## Objetivo
Reducir la cantidad de información visible en el pie de página (Footer) para mejorar la Experiencia de Usuario (UX) en dispositivos móviles, manteniendo un diseño limpio y yendo directo al grano.

## Tareas a realizar en `Footer.tsx`

1. **Reducir espaciados verticales (Padding):**
   - Cambiar `py-12` a `py-8 md:py-12` para que el footer no ocupe tanta pantalla en celulares.

2. **Ocultar la sección "Navegación" en móviles:**
   - La navegación ya está en el menú superior (Header). En móviles, esta lista sólo alarga la pantalla innecesariamente.
   - Acción: Agregar la clase `hidden md:block` al contenedor de la "Columna 2: Navegación".

3. **Simplificar la sección "Contacto" en móviles:**
   - El texto largo *"¿Tenés dudas, sugerencias o querés mejorar tu publicación? Escribinos directamente."* ocupa mucho espacio.
   - Acción: Ocultar este párrafo en celulares (`hidden md:block`) y dejar únicamente el botón de WhatsApp visible y centrado o alineado al resto del contenido para un contacto rápido.

4. **Ajustes de alineación y espaciado de "Marca":**
   - Reducir el margen entre el logo y el texto descriptivo.
   - Mantener la ubicación ("Santiago del Estero, Argentina") de forma discreta.

## Resultado esperado
En computadoras de escritorio (desktop) el Footer se seguirá viendo completo con sus 3 columnas. En celulares, el usuario verá rápidamente el Logo, una breve descripción de qué es SDE Oficios, la ubicación, el botón de soporte de WhatsApp y el copyright, reduciendo el tamaño total del footer a la mitad.
