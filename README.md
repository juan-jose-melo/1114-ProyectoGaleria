# Galería de Dibujos — comunidad

## Requisitos
- Node.js 18 o superior
- npm

## Iniciar en Windows
1. Descomprime el proyecto.
2. Abre una terminal en `servidor-galeria`.
3. Ejecuta `npm install` (reconstruye el módulo nativo SQLite para tu sistema).
4. Ejecuta `npm start`.
5. Abre `http://localhost:3000/galeria%20proyecto/galeria%20.html`.

No abras el HTML haciendo doble clic: la API y SQLite requieren que el servidor esté activo.

## Funciones añadidas
- Publicaciones globales ordenadas de más recientes a más antiguas.
- Subida de una imagen mediante archivo o URL, con título y descripción.
- Me gusta por usuario guardado en SQLite (un me gusta por usuario y publicación; al pulsar de nuevo se quita).
- Comentarios guardados en SQLite, vinculados al dibujo y a la cuenta que comenta.
- Edición del título y la descripción de las publicaciones propias.
- Tablas `likes` y `comentarios` creadas automáticamente al iniciar; se conserva la base de datos existente.

## Notas
Las imágenes seleccionadas como archivo se almacenan como Data URL en SQLite. Para producción con muchas imágenes se recomienda guardar archivos en un servicio de almacenamiento y almacenar en SQLite solo la URL. La autenticación del proyecto sigue el mecanismo existente de sesión en el navegador; antes de publicarlo en Internet conviene implementar sesiones seguras del lado del servidor.
