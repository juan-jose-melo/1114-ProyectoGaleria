# Documento de Requisitos del Producto (PRD)

**Nombre del Proyecto:** Galería de Dibujos  
**Cliente / Stakeholder:** Administrador del Producto (Product Owner)  
**Fecha:** Septiembre de 2026  
**Estado:** Borrador Inicial para Desarrollo  

---

## 1. Visión del Producto
Queremos construir una plataforma web limpia y visualmente atractiva donde artistas digitales y aficionados al dibujo puedan compartir su talento, inspirarse con el trabajo de otros y recibir reconocimiento a través de una comunidad interactiva. La plataforma debe ser accesible, fácil de usar y rápida tanto en computadoras de escritorio como en dispositivos móviles.

---

## 2. Público Objetivo
* **Ilustradores y Artistas Digitales:** Buscan un portafolio personal sencillo y un espacio para mostrar sus ilustraciones.
* **Aficionados al Dibujo:** Quieren explorar contenido visual, descubrir nuevos talentos y apoyar a sus creadores favoritos.

---

## 3. Historias de Usuario (Funcionalidades Principales)

### Módulo A: Gestión de Usuarios
* **HU-01 (Registro):** Como nuevo usuario, quiero registrarme ingresando un nombre de usuario, correo electrónico y contraseña para tener mi propia cuenta.
* **HU-02 (Inicio de Sesión):** Como usuario registrado, quiero iniciar sesión con mis credenciales para poder publicar contenido e interactuar con otros.
* **HU-03 (Perfil de Usuario):** Como usuario, quiero ver una página de perfil donde se muestren mis datos básicos y una cuadrícula con todos los dibujos que he subido.

### Módulo B: Gestión de Dibujos (Publicaciones)
* **HU-04 (Subir Dibujo):** Como usuario autenticado, quiero subir una imagen (formatos `.png`, `.jpg`, `.webp`) adjuntando un título y una descripción opcional.
* **HU-05 (Explorar Galería):** Como visitante o usuario, quiero ver un muro principal (*feed*) con todos los dibujos publicados ordenados.
* **HU-06 (Modificar Publicación):** Como autor de un dibujo, quiero poder editar el título y la descripción de mi obra si cometí un error.
* **HU-07 (Eliminar Publicación):** Como autor de un dibujo, quiero borrar mi publicación cuando lo desee, asegurándome de que desaparezca de la plataforma.

### Módulo C: Interacción y Comunidad
* **HU-08 (Dar "Me Gusta"):** Como usuario autenticado, quiero dar clic en un botón de "Me gusta" (corazón) en cualquier dibujo para mostrar mi apoyo al creador.
* **HU-09 (Quitar "Me Gusta"):** Si cambio de opinión o me equivoqué, quiero poder presionar de nuevo el botón para retirar mi "Me gusta".


---

## 4. Requisitos de Diseño y Experiencia de Usuario (UI/UX)
* **Diseño Responsive:** La web debe adaptarse correctamente a pantallas de teléfono móvil, tabletas y monitores.
* **Enfoque Visual:** El diseño debe ser minimalista para que el arte sea el verdadero protagonista (fondos neutros, tipografía clara).
* **Feedback Visual:** Al subir una imagen o dar "Me gusta", la página debe mostrar una confirmación o cambio visual claro de inmediato.

---

## 5. Criterios de Aceptación del Cliente (Definición de Hecho)
* Un usuario no registrado puede ver la galería principal y consultar perfiles, pero **no** puede subir dibujos ni dar "Me gusta".
* El sistema no debe permitir la subida de archivos que no sean imágenes ni archivos extremadamente pesados (límite de 5 MB a 10 MB).
* Un usuario **nunca** debe poder editar o eliminar las publicaciones de otro creador.

---

## 6. Fases de Entrega
