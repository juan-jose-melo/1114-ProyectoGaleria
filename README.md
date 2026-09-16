INTEGRANTES DEL PROYECTO

- Juan Jose Melo Gallego
- Johan Nikolas Velandia Zambrano
- Andres Steven Rivera Rivera


# Galería de Dibujos 🎨

Una plataforma web donde los usuarios pueden subir, compartir y descubrir dibujos e ilustraciones. Los usuarios podrán crear una cuenta, publicar sus propios dibujos, explorar las publicaciones de otros usuarios y dar "Me gusta" a sus obras favoritas.

---

## 📄 Descripción del Proyecto

Este proyecto consiste en desarrollar una galería digital orientada a artistas y personas interesadas en el dibujo.

La plataforma permitirá a los usuarios:
* Crear una cuenta e iniciar sesión de forma segura.
* Subir dibujos e imágenes.
* Añadir títulos y descripciones a sus publicaciones.
* Explorar dibujos publicados por otros usuarios.
* Dar y quitar "Me gusta" a los dibujos.
* Compartir publicaciones.
* Editar y eliminar sus propios dibujos.
* Consultar el perfil de otros usuarios y sus publicaciones.

El objetivo es crear una plataforma sencilla y organizada para compartir arte digital y crear una comunidad de artistas.

---

## 🛠️ Tecnologías

El proyecto utilizará las siguientes tecnologías:

* **Backend:** Python (Flask o FastAPI)
* **Base de Datos:** SQLite 3
* **Frontend:** HTML5, CSS3 y JavaScript (Vainilla)
* **Herramientas:** VS Code, Git, GitHub

---

## 🗄️ Base de Datos

La aplicación utilizará **SQLite** como base de datos relacional para almacenar la información de los usuarios, publicaciones y "Me gusta".

### Estructura de las Tablas

#### Tabla: `usuarios`
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | INTEGER PRIMARY KEY | Identificador único del usuario |
| `nombre_usuario` | TEXT UNIQUE NOT NULL | Nombre de usuario |
| `email` | TEXT UNIQUE NOT NULL | Correo electrónico |
| `password_hash` | TEXT NOT NULL | Contraseña almacenada de forma segura |
| `fecha_registro` | DATETIME DEFAULT CURRENT_TIMESTAMP | Fecha de registro |

#### Tabla: `dibujos`
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | INTEGER PRIMARY KEY | Identificador único del dibujo |
| `usuario_id` | INTEGER NOT NULL | ID del usuario que publicó el dibujo (FK) |
| `titulo` | TEXT NOT NULL | Título del dibujo |
| `descripcion` | TEXT | Descripción de la obra |
| `ruta_imagen` | TEXT NOT NULL | Ubicación/nombre del archivo de la imagen |
| `fecha_publicacion` | DATETIME DEFAULT CURRENT_TIMESTAMP | Fecha de publicación |

#### Tabla: `likes`
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | INTEGER PRIMARY KEY | Identificador único del like |
| `usuario_id` | INTEGER NOT NULL | ID del usuario que dio el like (FK) |
| `dibujo_id` | INTEGER NOT NULL | ID del dibujo que recibió el like (FK) |
| `fecha` | DATETIME DEFAULT CURRENT_TIMESTAMP | Fecha en que se dio el like |

### Relaciones entre Entidades

```text
Usuario ──< Dibujos
Usuario ──< Likes >── Dibujo

ESTRUCTURA
GaleriaDibujos/
│
├── static/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── uploads/          # Carpeta para guardar las imágenes subidas
│
├── templates/            # Vistas en HTML
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── perfil.html
│   └── subir.html
│
├── database/
│   ├── schema.sql        # Script para crear las tablas
│   └── galeria.db        # Archivo de base de datos SQLite
│
├── app.py                # Servidor principal en Python
├── requirements.txt      # Dependencias del proyecto
└── README.md
