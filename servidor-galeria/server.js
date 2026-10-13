const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a SQLite (crea galeria.db automáticamente si no existe)
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

// 1. Registro de usuarios
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

// 2. Inicio de Sesión
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

// 3. Completar/Editar Perfil
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

app.listen(3000, () => {
    console.log('Servidor activo en http://localhost:3000');
});