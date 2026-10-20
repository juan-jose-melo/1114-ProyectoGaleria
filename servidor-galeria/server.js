const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();

// AUMENTAR EL LÍMITE DE TAMAÑO PARA PERMITIR IMÁGENES LOCALES (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Conexión a SQLite
const db = new sqlite3.Database('./galeria.db', (err) => {
    if (err) {
        console.error('Error al conectar con SQLite:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

// Crear tabla de usuarios si no existe
db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        nombre TEXT DEFAULT '',
        tag TEXT DEFAULT '',
        perfilCompletado INTEGER DEFAULT 0
    )
`);

// Crear tabla de dibujos si no existe
db.run(`
    CREATE TABLE IF NOT EXISTS dibujos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        emailUsuario TEXT NOT NULL,
        nombreUsuario TEXT NOT NULL,
        titulo TEXT NOT NULL,
        imagenUrl TEXT NOT NULL,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// 1. Registro
app.post('/api/registro', (req, res) => {
    const { email, password } = req.body;
    const query = `INSERT INTO usuarios (email, password, perfilCompletado) VALUES (?, ?, 0)`;
    db.run(query, [email, password], function (err) {
        if (err) {
            return res.json({ success: false, message: 'El correo ya está registrado.' });
        }
        res.json({ success: true, message: 'Usuario registrado exitosamente.' });
    });
});

// 2. Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const query = `SELECT * FROM usuarios WHERE email = ? AND password = ?`;
    db.get(query, [email, password], (err, usuario) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error en la base de datos.' });
        }

        if (usuario) {
            res.json({
                success: true,
                email: usuario.email,
                nombre: usuario.nombre,
                tag: usuario.tag,
                perfilCompletado: usuario.perfilCompletado === 1
            });
        } else {
            res.json({ success: false, message: 'Correo o contraseña incorrectos.' });
        }
    });
});

// 3. Completar Perfil
app.post('/api/completar-perfil', (req, res) => {
    const { email, nombre, tag } = req.body;
    const query = `UPDATE usuarios SET nombre = ?, tag = ?, perfilCompletado = 1 WHERE email = ?`;
    db.run(query, [nombre, tag, email], function (err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al actualizar el perfil.' });
        }
        res.json({ success: true, message: 'Perfil actualizado con éxito.' });
    });
});

// 4. Guardar un nuevo dibujo
app.post('/api/dibujos', (req, res) => {
    const { emailUsuario, nombreUsuario, titulo, imagenUrl } = req.body;
    const query = `INSERT INTO dibujos (emailUsuario, nombreUsuario, titulo, imagenUrl) VALUES (?, ?, ?, ?)`;
    
    db.run(query, [emailUsuario, nombreUsuario, titulo, imagenUrl], function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al publicar el dibujo.' });
        }
        res.json({ success: true, message: 'Dibujo publicado con éxito.' });
    });
});

// 5. Obtener todos los dibujos
app.get('/api/dibujos', (req, res) => {
    const query = `SELECT * FROM dibujos ORDER BY fecha DESC`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al cargar dibujos.' });
        }
        res.json({ success: true, dibujos: rows });
    });
});

app.listen(3000, () => {
    console.log('Servidor activo en http://localhost:3000');
});