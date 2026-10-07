# Verificación local — 7 de octubre de 2026

La réplica reproduce la web HTML original en Astro, Tailwind CSS 4 y TypeScript. El recorrido de contacto es: formulario local → validación → borrador para WhatsApp → revisión y envío manual por el visitante. No utiliza API, base de datos ni variables secretas.

## Resultado

| Revisión             | Evidencia                                                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Tipos y componentes  | `npm run check`: 26 archivos revisados, 0 errores, 0 advertencias y 0 sugerencias.                                           |
| Compilación          | `npm run build`: una página estática generada correctamente en `dist/`.                                                      |
| Vista previa         | Respuesta HTTP 200 en `http://127.0.0.1:4327/`.                                                                              |
| Diseño adaptable     | Anchos de 360, 390, 768, 1024 y 1440 px sin desbordamiento horizontal.                                                       |
| Texto ampliado       | Anchos de 390 y 1440 px con texto al 200%, sin desbordamiento horizontal.                                                    |
| Recursos             | Todas las imágenes y las fuentes Manrope y Source Sans 3 cargadas correctamente.                                             |
| Navegación           | Encabezado fijo; menú móvil abre, cierra con Escape y se cierra al elegir una sección. Las anclas dejan libre el encabezado. |
| Comparadores         | El teclado modifica la imagen y su descripción accesible.                                                                    |
| Testimonios          | Los controles anterior y siguiente cambian el contenido y su contador.                                                       |
| Preguntas frecuentes | Se expande una sola pregunta a la vez.                                                                                       |
| Formulario           | Rechaza datos incompletos, teléfono inválido y correo inválido; prepara el mensaje con datos válidos.                        |
| Contacto móvil       | El botón inferior permanece fijo y se oculta durante la edición de los campos.                                               |
| Sin JavaScript       | La navegación continúa visible y el formulario permanece desactivado.                                                        |
| Consola y red        | Sin errores de JavaScript ni solicitudes a servicios externos desde la página.                                               |

Las aperturas de WhatsApp fueron interceptadas en el navegador durante las pruebas. Se verificaron el número de destino y el texto del borrador, sin acceder al servicio real, enviar mensajes ni confirmar citas.

## Comparación con el HTML original

Se sirvieron ambas versiones localmente y se capturaron completas con Chrome, después de cargar todas las imágenes y fuentes. El título, el contenido visible, los archivos de imagen, sus textos alternativos y el orden de las secciones coinciden.

| Ancho   | Altura original | Altura Astro | Píxeles con diferencia de color mayor a 16/255 |
| ------- | --------------- | ------------ | ---------------------------------------------- |
| 390 px  | 17,053 px       | 17,053 px    | 0%                                             |
| 1440 px | 10,888 px       | 10,888 px    | 0.0001%                                        |

La comparación visual usa una tolerancia para pequeñas variaciones de rasterización; no afirma identidad binaria de todos los píxeles. Las capturas y el cálculo completo están en `verificacion/comparacion-original.json`, `verificacion/original-390.png`, `verificacion/replica-390.png`, `verificacion/original-1440.png` y `verificacion/replica-1440.png`.

## Archivos de evidencia

- `verificacion/resultados.json`: métricas y comprobaciones funcionales.
- `verificacion/portada-1440.png` y `verificacion/portada-390.png`: portada de escritorio y móvil.
- `verificacion/formulario-validado.png`: resultado de la solicitud preparada.
- `verificacion/revisar.cjs`: revisión funcional reutilizable.
- `verificacion/comparar-original.cjs`: comparación de ambas versiones.

Para repetir las pruebas se requiere Playwright con Chrome instalado; la comparación necesita también Sharp. Los scripts aceptan `PLAYWRIGHT_MODULE` y `SHARP_MODULE` como rutas de esos módulos, y `PREVIEW_URL` y `ORIGINAL_URL` como direcciones de las webs locales. Esas herramientas son opcionales para la revisión; no son necesarias para ejecutar ni compilar la web.

## Alcance

Se verificó exclusivamente la versión local compilada. Estos resultados no acreditan un despliegue en Vercel ni recepción real en WhatsApp. La guía de publicación se encuentra en `docs/guia-vercel.md`. El número sigue siendo el ejemplo del original; la configuración se encuentra en `src/data/site.ts`.
