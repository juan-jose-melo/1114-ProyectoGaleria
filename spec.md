# Especificaciones del Proyecto: Galería de Dibujos

## 1. Visión General
Plataforma web monolítica cliente-servidor orientada a artistas y aficionados al dibujo. El sistema permite el almacenamiento, renderizado y gestión de interacciones (publicar, explorar, dar "Me gusta" y compartir) para obras artísticas digitales en un entorno dinámico, ligero y protegido.

## 2. Objetivos
* **Objetivos:**
  * Permitir el registro, autenticación y gestión de perfiles de usuarios.
  * Facilitar la subida, almacenamiento, visualización, edición y eliminación de dibujos digitales con metadatos (título y descripción).
  * Ofrecer un sistema de interacción social mediante likes, conteo de me gusta 
* **Fuera del alcance (Out of Scope):**
  * Motor de búsqueda avanzado y filtrado por categorías o etiquetas (planificado para Fase 3).
  * Sistema de comentarios en las publicaciones (planificado para Fase 3).
  * Procesamiento distribuido de imágenes o almacenamiento en la nube (AWS S3/Cloudinary) durante esta fase inicial.

## 3. Requisitos Funcionales
* **RF-01 (Autenticación e Identidad):** El sistema debe permitir el registro de usuarios, inicio y cierre de sesión seguro mediante hashing de contraseñas (`werkzeug.security`/`bcrypt`) y cookies de sesión firmadas.
* **RF-02 (CRUD de Dibujos):** El sistema debe permitir a los usuarios subir imágenes (`.png`, `.jpg`, `.jpeg`, `.webp`), asignarles título y descripción, explorarlas en la galería general o perfil, y editar o eliminar sus propias publicaciones.
* **RF-03 (Interacción Social):** El sistema debe permitir dar y quitar "Me gusta" a las publicaciones, calcular el total acumulado de likes.

## 4. Requisitos No Funcionales
* **RFN-01 (Seguridad - SQLi y Sanitización):** Todas las consultas a la base de datos SQLite deben realizarse mediante consultas parametrizadas para evitar inyección SQL.
* **RFN-02 (Seguridad - Control de Acceso y Archivos):** El sistema debe validar el formato MIME y un límite máximo de tamaño por archivo (5-10 MB), además de garantizar en el backend que solo el autor pueda editar o eliminar su recurso.
* **RFN-03 (Rendimiento):** La aplicación debe responder de forma ágil sirviendo archivos estáticos e imágenes desde la carpeta local `static/uploads/`, utilizando índices relacionales en SQLite para optimizar tiempos de respuesta.

## 5. Diseño Técnico y APIs
### Stack Tecnológico
* **Backend:** Python 3.x con Flask (o FastAPI / WSGI)
* **Base de Datos:** SQLite 3 (`galeria.db`)
* **Frontend:** HTML5 semántico, CSS3 modular (Flexbox/Grid), JavaScript vainilla y Jinja2

### Endpoints / Rutas Principales
* `GET /` - Renderizado de la galería principal con todas las publicaciones.
* `POST /register` - Registro de nuevos usuarios.
* `POST /login` - Autenticación de usuario e inicio de sesión.
* `GET /logout` - Cierre de la sesión activa.
* `GET /perfil/<int:usuario_id>` - Obtener y visualizar el perfil y obras de un usuario.
* `POST /dibujos/subir` - Subida de archivos de imagen y registro en la base de datos.
* `POST /dibujos/<int:dibujo_id>/editar` - Actualización de título y descripción por el autor.
* `POST /dibujos/<int:dibujo_id>/eliminar` - Eliminación física del archivo y registro en BD.
* `POST /dibujos/<int:dibujo_id>/like` - Toggle (dar/quitar) de "Me gusta" en la publicación.

## 6. Criterios de Aceptación
- [ ] El usuario puede crear una cuenta con email/usuario único y las contraseñas se almacenan encriptadas (`password_hash`).
- [ ] Los usuarios no autenticados solo pueden explorar la galería, mientras que subir, dar "Me gusta" o editar requiere iniciar sesión.
- [ ] La subida de imágenes restringe formatos no permitidos o archivos que superen el límite de tamaño configurado.
- [ ] Al eliminar un dibujo, se remueve tanto el registro en la base de datos SQLite como el archivo de imagen en `static/uploads/`.
- [ ] Un usuario solo puede dar un "Me gusta" por dibujo (garantizado por índice compuesto único en la tabla `likes`).
