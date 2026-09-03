 Galería de Dibujos

Una plataforma web donde los usuarios pueden subir, compartir y descubrir dibujos e ilustraciones. Los usuarios podrán crear una cuenta, publicar sus propios dibujos, explorar las publicaciones de otros usuarios y dar "Me gusta" a sus obras favoritas.

 Descripción del proyecto

Este proyecto consiste en desarrollar una galería digital orientada a artistas y personas interesadas en el dibujo.

La plataforma permitirá a los usuarios:

 Crear una cuenta e iniciar sesión.
 Subir dibujos e imágenes.
 Añadir títulos y descripciones a sus publicaciones.
 Explorar dibujos publicados por otros usuarios.
 Dar "Me gusta" a los dibujos.
 Compartir publicaciones.
 Eliminar sus propios dibujos.
 Consultar el perfil de otros usuarios y sus publicaciones.

El objetivo es crear una plataforma sencilla y organizada para compartir arte digital y crear una comunidad de artistas.

 Tecnologías

El proyecto utilizará las siguientes tecnologías:

Backend
C#
ASP.NET Core
Entity Framework Core
Base de datos
SQL Server
SQL
Frontend
HTML5
CSS3
JavaScript
Herramientas
Visual Studio
Git
GitHub
 Base de datos

La aplicación utilizará una base de datos relacional para almacenar la información de los usuarios, publicaciones y "Me gusta".

Una estructura inicial podría ser:

Usuarios
Campo	Tipo	Descripción
Id	int	Identificador del usuario
NombreUsuario	varchar	Nombre del usuario
Email	varchar	Correo electrónico
PasswordHash	varchar	Contraseña almacenada de forma segura
FechaRegistro	datetime	Fecha de registro
Dibujos
Campo	Tipo	Descripción
Id	int	Identificador del dibujo
UsuarioId	int	Usuario que publicó el dibujo
Titulo	varchar	Título del dibujo
Descripcion	varchar	Descripción de la obra
RutaImagen	varchar	Ubicación de la imagen
FechaPublicacion	datetime	Fecha de publicación
Likes
Campo	Tipo	Descripción
Id	int	Identificador del like
UsuarioId	int	Usuario que dio el like
DibujoId	int	Dibujo al que se dio like
Fecha	datetime	Fecha del like

La relación principal será:

Usuario
   │
   ├──────────< Dibujos
   │
   └──────────< Likes >────────── Dibujo

 Estructura inicial del proyecto

La estructura podrá organizarse de la siguiente manera:

GaleriaDibujos/
│
├── Controllers/
│   ├── AccountController.cs
│   ├── DibujosController.cs
│   └── HomeController.cs
│
├── Models/
│   ├── Usuario.cs
│   ├── Dibujo.cs
│   └── Like.cs
│
├── Data/
│   └── ApplicationDbContext.cs
│
├── Views/
│   ├── Home/
│   ├── Account/
│   └── Dibujos/
│
├── wwwroot/
│   ├── css/
│   ├── js/
│   └── images/
│
├── appsettings.json
├── Program.cs
└── README.md

 Funcionalidades previstas
Usuarios
Registro.
Inicio de sesión.
Cierre de sesión.
Perfil de usuario.
Visualización de dibujos publicados.
Publicaciones
Subir dibujos.
Añadir título.
Añadir descripción.
Visualizar dibujos.
Editar publicaciones propias.
Eliminar publicaciones propias.
Interacción
Dar "Me gusta".
Quitar "Me gusta".
Contabilizar likes.
Compartir dibujos.
Explorar publicaciones de otros usuarios.
 Seguridad

El proyecto tendrá en cuenta diferentes aspectos de seguridad:

Las contraseñas no se almacenarán directamente, sino mediante hashing.
Los usuarios solo podrán modificar o eliminar sus propias publicaciones.
Se validará el tipo y tamaño de las imágenes subidas.
Se realizarán validaciones de los datos enviados por los usuarios.
Se utilizarán mecanismos de autenticación y autorización.
 Instalación
Requisitos

Antes de ejecutar el proyecto se necesitará:

Visual Studio.
.NET SDK compatible con la versión utilizada.
SQL Server o SQL Server Express.
Git.
Clonar el repositorio



Entrar en la carpeta:

cd GaleriaDibujos

Configurar la base de datos

Modificar la cadena de conexión en appsettings.json:

{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=GaleriaDibujos;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}


Después ejecutar las migraciones de Entity Framework Core:

dotnet ef database update

Ejecutar el proyecto

Desde Visual Studio se puede ejecutar utilizando:

dotnet run


o mediante el botón Iniciar de Visual Studio.

 Estado del proyecto

 En desarrollo

Actualmente el proyecto se encuentra en su etapa inicial. Las funcionalidades se irán implementando progresivamente.

Próximas funcionalidades
 Crear sistema de registro.
 Crear sistema de inicio de sesión.
 Crear perfiles de usuario.
 Crear sistema para subir dibujos.
 Mostrar galería de publicaciones.
 Implementar sistema de likes.
 Implementar compartir publicaciones.
 Añadir edición y eliminación de dibujos.
 Mejorar diseño de la interfaz.
 Añadir búsqueda de dibujos.
 Añadir categorías o etiquetas.
 Implementar sistema de comentarios.
 Objetivo

El objetivo final es desarrollar una plataforma donde cualquier persona pueda compartir sus dibujos, descubrir el trabajo de otros artistas y formar parte de una comunidad creativa.

Proyecto en desarrollo 🚧 | Galería de Dibujos 🎨
