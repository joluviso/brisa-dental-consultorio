# Brisa Dental — Astro, Tailwind CSS y TypeScript

Réplica local de la web HTML situada en la carpeta superior. Conserva el contenido, la identidad visual, las imágenes, las fuentes y las interacciones de la referencia. El proyecto es autónomo: sus recursos están en `public/assets` y no necesita archivos de la carpeta superior.

## Revisar en tu computadora

Requiere Node.js 24 y npm. Abre esta carpeta en tu editor y ejecuta:

```sh
npm install
npm run dev
```

Abre **http://127.0.0.1:4327/**. Si el puerto está ocupado, usa la dirección que aparezca en la terminal. Si sigue activa la vista previa entregada con este proyecto, detenla con `npm run preview:stop` antes de iniciar el modo de desarrollo. El servidor permite ver los cambios al editar los archivos. Para detenerlo, presiona `Ctrl + C` en la terminal.

## Comprobar y compilar

```sh
npm run check
npm run build
npm run preview
```

`check` revisa los componentes y los tipos de TypeScript. `build` genera la web estática en `dist/`. `preview` sirve esa versión compilada en la misma dirección local; detén primero el servidor de desarrollo si utiliza ese puerto. Para comprobar una vista previa en segundo plano, usa `npm run preview:status`; para detenerla, `npm run preview:stop`.

Puedes formatear el código con `npm run format`.

## Organización

| Carpeta o archivo              | Contenido                                                                |
| ------------------------------ | ------------------------------------------------------------------------ |
| `src/pages/index.astro`        | Página principal y orden de las secciones.                               |
| `src/layouts/BaseLayout.astro` | Documento, metadatos, fuentes, estilos y script compilado.               |
| `src/components/`              | Encabezado, secciones, pie de página e iconos reutilizables.             |
| `src/data/content.ts`          | Contenido tipado de tratamientos, equipo, historias y artículos.         |
| `src/data/site.ts`             | Título, descripción y destino de WhatsApp.                               |
| `src/styles/global.css`        | Tailwind 4, colores de marca y reglas que reproducen el diseño original. |
| `src/scripts/interactions.ts`  | Menú, comparadores, testimonios, preguntas frecuentes y formulario.      |
| `public/assets/`               | Las 23 imágenes WebP, fuentes locales, licencias e iconos.               |
| `verificacion/`                | Revisión en navegador, resultados y capturas locales.                    |

Tailwind se integra mediante su plugin oficial para Vite. Se usan su tema y sus utilidades, incluyendo `@apply` para elementos compartidos. Se conserva el reset de estilos del original en lugar de aplicar Preflight, para evitar cambios de apariencia al migrar.

## Contacto y formulario

El visitante completa el formulario, se validan los campos y se abre WhatsApp con un borrador. La página no guarda datos, no envía mensajes automáticamente y no confirma citas. Si el navegador impide abrir una pestaña, aparece un enlace para continuar. Sin JavaScript, el formulario permanece desactivado y siguen disponibles la navegación y las preguntas frecuentes.

El destino está centralizado en `src/data/site.ts`:

```ts
whatsappNumber: '5200000000';
```

Es el número de ejemplo del HTML original. Para recibir consultas reales, reemplázalo por el número completo con clave de país y sin espacios ni `+`: para México, `52` seguido de los diez dígitos del número.

## Repositorio y despliegue

Repositorio del proyecto: [joluviso/brisa-dental-consultorio](https://github.com/joluviso/brisa-dental-consultorio), rama `main`. Los archivos de esta carpeta ocupan la raíz del repositorio.

Para publicar la web, sigue la [guía de Vercel](docs/guia-vercel.md). El archivo `vercel.json` define Astro, `npm ci`, `npm run build` y `dist`. La versión de Node.js es `24.x`, definida en `package.json`. El despliegue en Vercel se realiza siguiendo la guía; preparar esta configuración no crea una web pública en Vercel.

Las capturas de revisión se conservan localmente en `verificacion/` y se excluyen del repositorio. Los resultados y scripts de verificación sí se versionan. Tampoco se suben las dependencias instaladas ni la compilación local; se reconstruyen a partir de `package-lock.json`.

El proyecto compila como sitio estático (`output: 'static'`). La publicación futura podrá usar `npm run build` y la carpeta de salida `dist/`.

Documentación de la integración: [Astro: estilos y Tailwind](https://docs.astro.build/en/guides/styling/#tailwind) y [Tailwind: plugin de Vite](https://tailwindcss.com/docs/installation/using-vite).
