# Desplegar Brisa Dental en Vercel

Esta guía publica la versión de Astro del repositorio [joluviso/brisa-dental-consultorio](https://github.com/joluviso/brisa-dental-consultorio). Al terminar tendrás una dirección HTTPS asignada por Vercel y podrás actualizar la web subiendo cambios al mismo repositorio.

La web usa Astro, Tailwind CSS 4 y TypeScript. Es un sitio estático: Vercel instala las dependencias, compila el proyecto y publica los archivos de `dist/`. El formulario prepara una solicitud para WhatsApp y no necesita un servidor ni variables de entorno. [Vercel admite sitios estáticos de Astro directamente](https://vercel.com/docs/frameworks/frontend/astro).

## 1 Revisar el repositorio

Abre [el repositorio en GitHub](https://github.com/joluviso/brisa-dental-consultorio) y selecciona la rama **main**.

En la primera pantalla deben aparecer `package.json`, `package-lock.json`, `astro.config.mjs`, `vercel.json`, `src/`, `public/` y `docs/`. Los archivos de la web están directamente en la raíz del repositorio, aunque en tu computadora se encuentran dentro de `brisa-dental/web-astro`.

Las capturas de revisión permanecen en la carpeta local `verificacion/`. El repositorio conserva los resultados y los scripts de comprobación; las imágenes que utiliza la web están en `public/assets/`.

## 2 Iniciar sesión en Vercel

1. Entra a [vercel.com](https://vercel.com/).
2. Pulsa **Log In**, o **Sign Up** si todavía no tienes cuenta.
3. Elige **Continue with GitHub** e inicia sesión con la cuenta **joluviso**. Si ya utilizas Vercel con otro método de acceso, entra a tu cuenta habitual y conecta GitHub al importar el repositorio.
4. Autoriza la conexión que aparezca en GitHub. El proceso se realiza en las páginas de Vercel y GitHub; no requiere copiar un token manualmente.
5. Cuando aparezca el panel de Vercel, selecciona el espacio personal o equipo donde quieres guardar este proyecto.

## 3 Importar el proyecto

1. En el panel, pulsa **Add New… → Project**. También puedes abrir [la pantalla de nuevo proyecto](https://vercel.com/new).
2. En **Import Git Repository**, selecciona la cuenta **joluviso**.
3. Busca **brisa-dental-consultorio**.
4. Pulsa **Import** junto al repositorio correcto.

Si el repositorio no aparece, pulsa **Adjust GitHub App Permissions**, **Configure GitHub App** o el enlace para configurar la conexión que muestre Vercel. En GitHub, selecciona **joluviso**, elige **Only select repositories**, agrega **brisa-dental-consultorio** y guarda con **Save** o **Install**. Regresa a Vercel y vuelve a buscarlo. Vercel requiere que seas el propietario para importar un repositorio de una cuenta personal. [Permisos de la conexión con GitHub](https://vercel.com/docs/git/vercel-for-github#missing-git-repository).

## 4 Configurar la primera publicación

En la pantalla de configuración, usa estos valores:

| Campo                 | Valor para Brisa Dental       |
| --------------------- | ----------------------------- |
| Project Name          | `brisa-dental-consultorio`    |
| Framework Preset      | `Astro`                       |
| Root Directory        | `./`, la raíz del repositorio |
| Install Command       | `npm ci`                      |
| Build Command         | `npm run build`               |
| Output Directory      | `dist`                        |
| Environment Variables | Dejar vacío                   |
| Node.js Version       | `24.x`                        |
| Production Branch     | `main`                        |

El archivo `vercel.json` ya define el framework y los comandos. Si Vercel muestra los valores correctos, puedes conservarlos. Si un campo difiere, abre **Build and Output Settings** o **Build and Deployment** y activa **Override** para introducir el valor de la tabla. [Configuración de la compilación](https://vercel.com/docs/builds/configure-a-build).

En **Root Directory**, conserva la raíz. No escribas la ruta de tu computadora ni selecciones `brisa-dental/web-astro`: esa estructura local no existe dentro de este repositorio. Tampoco elijas `src/`, `public/` ni `dist/` como raíz; el punto de partida es la carpeta que contiene `package.json`.

`package.json` ya solicita Node.js `24.x`. Si la pantalla de importación no muestra la versión, podrás comprobarla en **Settings → Build and Deployment → Node.js Version**. La versión declarada en `package.json` también determina la versión utilizada por Vercel. [Versiones de Node.js](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

En algunos paneles **Production Branch** aparece después de crear el proyecto. Comprueba entonces **Settings → Environments → Production → Branch Tracking**; si tu panel todavía agrupa este ajuste en **Settings → Git**, búscalo allí. La rama de producción debe ser `main`.

## 5 Desplegar y abrir la web

1. Revisa los valores de la tabla y pulsa **Deploy**.
2. Espera a que termine la instalación y la compilación. Puedes abrir **Build Logs** para ver el avance.
3. Cuando el despliegue muestre **Ready**, pulsa **Visit** o abre la dirección indicada en **Domains**.
4. Guarda esa dirección: será el enlace para compartir la web.

Vercel asignará la dirección disponible para el proyecto. Usa la URL que muestre el panel; el nombre del repositorio no garantiza una dirección concreta.

El primer despliegue en Vercel es la comprobación de la compilación en su infraestructura. La revisión local ya realizada no sustituye este paso.

## 6 Comprobar la web publicada

Abre la URL de Vercel en tu computadora y en el celular. Comprueba que:

- La portada, los colores, las fuentes y las imágenes se muestran correctamente.
- El menú lleva a las secciones y se abre y cierra en celular.
- Los comparadores de antes y después responden al arrastrarlos.
- Los controles de testimonios y las preguntas frecuentes funcionan.
- El formulario señala los campos obligatorios cuando están vacíos y prepara un borrador cuando los datos son válidos.
- Los botones de contacto abren WhatsApp con el tratamiento o mensaje esperado.

El destino de WhatsApp sigue siendo el ejemplo del HTML original: `5200000000`. Para recibir consultas reales, abre `src/data/site.ts` y reemplaza `whatsappNumber` por el número completo, con clave de país y sin `+` ni espacios. Para México utiliza `52` seguido de los diez dígitos del número. El visitante debe revisar y enviar el mensaje; la web no envía mensajes ni confirma citas automáticamente.

Los textos, perfiles y casos conservan las etiquetas de demostración del original. Sustituye los datos de ejemplo cuando quieras utilizar la web para una clínica real.

## 7 Actualizar la web después del despliegue

Vercel puede crear un nuevo despliegue al recibir cambios en la rama de producción del repositorio conectado. [Integración de Vercel con GitHub](https://vercel.com/docs/git/vercel-for-github).

Si usas GitHub Desktop:

1. Abre **File → Add Local Repository…**.
2. Selecciona la carpeta **brisa-dental/web-astro** de tu computadora y pulsa **Add Repository**.
3. Selecciona **brisa-dental-consultorio** o el nombre local **web-astro** en **Current Repository**. Comprueba que **Repository → Repository Settings… → Remote** apunta a `https://github.com/joluviso/brisa-dental-consultorio.git`.
4. Pulsa **Fetch origin**. Si aparece **Pull origin**, úsalo antes de editar para obtener los cambios remotos.
5. Edita los archivos de la web. Para cambiar tratamientos, equipo, historias o artículos, utiliza `src/data/content.ts`; para WhatsApp, `src/data/site.ts`.
6. Regresa a GitHub Desktop. Revisa los archivos de **Changes**, escribe una descripción en **Summary** y pulsa **Commit to main**.
7. Pulsa **Push origin** para subir el cambio. El commit local por sí solo no lo envía a GitHub.
8. En Vercel abre **Deployments**, espera a que el nuevo despliegue muestre **Ready** y revisa de nuevo la web.

Para revisar cambios antes de subirlos, detén la vista previa anterior con `npm run preview:stop`, inicia `npm run dev` y abre la dirección local que aparezca. La guía de ejecución está en el `README.md` del repositorio.

## 8 Resolver problemas frecuentes

| Problema                                       | Qué revisar                                                                                                                                      |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| El repositorio no aparece                      | GitHub conectado como `joluviso` y permiso de la aplicación de Vercel para este repositorio.                                                     |
| No encuentra `package.json`                    | **Root Directory** debe ser `./`.                                                                                                                |
| Vercel detecta otro framework                  | Selecciona **Astro** y conserva `vercel.json`.                                                                                                   |
| No encuentra la carpeta de salida              | **Build Command**: `npm run build`; **Output Directory**: `dist`.                                                                                |
| Falla por la versión de Node.js                | Comprueba `24.x` en los ajustes y en `package.json`.                                                                                             |
| Falla `npm ci`                                 | Comprueba que se subieron juntos `package.json` y `package-lock.json`. Si cambiaste dependencias, actualiza el lockfile localmente y sube ambos. |
| Faltan estilos o imágenes                      | Comprueba que existe `public/assets/` y revisa **Build Logs**; no publiques solamente `src/` ni el HTML original.                                |
| El cambio no aparece                           | Confirma **Push origin**, la rama `main` y el estado **Ready** del nuevo despliegue.                                                             |
| WhatsApp no encuentra el destino               | Reemplaza el número de ejemplo por un número real y completo en `src/data/site.ts`.                                                              |
| El navegador no abre la pestaña del formulario | Utiliza el enlace **Abrir WhatsApp** que aparece debajo del formulario.                                                                          |

## Configuración incluida

`vercel.json` contiene:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "astro",
  "installCommand": "npm ci",
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

Node.js se define en `package.json` con `"engines": { "node": "24.x" }`. No es necesario instalar el adaptador de Vercel para este sitio estático ni agregar integraciones de base de datos. [Configuración de Vercel](https://vercel.com/docs/project-configuration/vercel-json).
