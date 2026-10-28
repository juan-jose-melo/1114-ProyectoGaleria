const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const DB_PATH = path.join(__dirname, 'galeria.db');
const WEB_ROOT = path.resolve(__dirname, '..');

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(WEB_ROOT));

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error('Error al conectar con SQLite:', err.message);
  else console.log(`Conectado a SQLite: ${DB_PATH}`);
});
db.configure('busyTimeout', 5000);

function run(sql, params = []) {
  return new Promise((resolve, reject) => db.run(sql, params, function (err) {
    if (err) reject(err); else resolve({ lastID: this.lastID, changes: this.changes });
  }));
}
function get(sql, params = []) {
  return new Promise((resolve, reject) => db.get(sql, params, (err, row) => err ? reject(err) : resolve(row)));
}
function all(sql, params = []) {
  return new Promise((resolve, reject) => db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows)));
}
async function ensureColumn(table, column, definition) {
  const columns = await all(`PRAGMA table_info(${table})`);
  if (!columns.some(c => c.name === column)) await run(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
}

async function initialize() {
  await run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    nombre TEXT DEFAULT '',
    tag TEXT DEFAULT '',
    perfilCompletado INTEGER DEFAULT 0
  )`);
  await run(`CREATE TABLE IF NOT EXISTS dibujos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    emailUsuario TEXT NOT NULL,
    nombreUsuario TEXT NOT NULL,
    titulo TEXT NOT NULL,
    imagenUrl TEXT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  await ensureColumn('usuarios', 'nombre', "TEXT DEFAULT ''");
  await ensureColumn('usuarios', 'tag', "TEXT DEFAULT ''");
  await ensureColumn('usuarios', 'perfilCompletado', 'INTEGER DEFAULT 0');
  await ensureColumn('dibujos', 'descripcion', "TEXT DEFAULT ''");
  await run(`CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    emailUsuario TEXT NOT NULL,
    dibujoId INTEGER NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(emailUsuario, dibujoId)
  )`);
  await run(`CREATE TABLE IF NOT EXISTS comentarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dibujoId INTEGER NOT NULL,
    emailUsuario TEXT NOT NULL,
    nombreUsuario TEXT NOT NULL DEFAULT 'Artista',
    contenido TEXT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
}

app.get('/api/health', (_req, res) => res.json({ success: true, database: 'SQLite' }));

app.post('/api/registro', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Ingresa un correo válido y una contraseña de al menos 6 caracteres.' });
  }
  try {
    await run('INSERT INTO usuarios (email, password, perfilCompletado) VALUES (?, ?, 0)', [email, password]);
    res.status(201).json({ success: true, message: 'Usuario registrado exitosamente.' });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT' || /UNIQUE constraint failed/i.test(err.message)) {
      return res.status(409).json({ success: false, message: 'El correo ya está registrado.' });
    }
    console.error('Registro:', err.message);
    res.status(500).json({ success: false, message: 'No se pudo registrar el usuario.' });
  }
});

app.post('/api/login', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  try {
    const usuario = await get('SELECT * FROM usuarios WHERE lower(email) = ?', [email]);
    if (!usuario || usuario.password !== password) {
      return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos.' });
    }
    res.json({ success: true, email: usuario.email, nombre: usuario.nombre || '', tag: usuario.tag || '', perfilCompletado: Number(usuario.perfilCompletado) === 1 || Boolean((usuario.nombre || '').trim() && (usuario.tag || '').trim()) });
  } catch (err) {
    console.error('Login:', err.message);
    res.status(500).json({ success: false, message: 'Error en la base de datos.' });
  }
});

app.post('/api/completar-perfil', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const nombre = String(req.body.nombre || '').trim();
  let tag = String(req.body.tag || '').trim();
  if (!email || !nombre || !tag) return res.status(400).json({ success: false, message: 'Completa el nombre y el usuario.' });
  if (!tag.startsWith('@')) tag = '@' + tag;
  try {
    const result = await run('UPDATE usuarios SET nombre = ?, tag = ?, perfilCompletado = 1 WHERE lower(email) = ?', [nombre, tag, email]);
    if (!result.changes) return res.status(404).json({ success: false, message: 'No se encontró la cuenta.' });
    res.json({ success: true, nombre, tag, perfilCompletado: true, message: 'Perfil guardado.' });
  } catch (err) {
    console.error('Perfil:', err.message);
    res.status(500).json({ success: false, message: 'Error al actualizar el perfil.' });
  }
});

app.get('/api/perfil/:email', async (req, res) => {
  try {
    const usuario = await get('SELECT email, nombre, tag, perfilCompletado FROM usuarios WHERE lower(email) = ?', [String(req.params.email).toLowerCase()]);
    if (!usuario) return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    res.json({ success: true, usuario });
  } catch (err) { res.status(500).json({ success: false, message: 'Error al cargar el perfil.' }); }
});

app.post('/api/dibujos', async (req, res) => {
  const emailUsuario = String(req.body.emailUsuario || '').trim().toLowerCase();
  const titulo = String(req.body.titulo || '').trim();
  const imagenUrl = String(req.body.imagenUrl || '').trim();
  const descripcion = String(req.body.descripcion || '').trim();
  if (!emailUsuario || !titulo || !imagenUrl) return res.status(400).json({ success: false, message: 'El correo, título y la imagen son obligatorios.' });
  try {
    const usuario = await get('SELECT nombre FROM usuarios WHERE lower(email) = ?', [emailUsuario]);
    if (!usuario) return res.status(401).json({ success: false, message: 'Inicia sesión para publicar.' });
    const nombreUsuario = String(usuario.nombre || req.body.nombreUsuario || 'Artista').trim();
    const result = await run('INSERT INTO dibujos (emailUsuario, nombreUsuario, titulo, imagenUrl, descripcion) VALUES (?, ?, ?, ?, ?)', [emailUsuario, nombreUsuario, titulo, imagenUrl, descripcion]);
    res.status(201).json({ success: true, id: result.lastID, message: 'Publicación creada.' });
  } catch (err) {
    console.error('Publicar dibujo:', err.message);
    res.status(500).json({ success: false, message: 'Error al publicar la imagen.' });
  }
});

app.get('/api/dibujos', async (_req, res) => {
  try {
    const email = String(_req.query.email || '').trim().toLowerCase();
    const dibujos = await all(`SELECT d.*, (SELECT COUNT(*) FROM likes l WHERE l.dibujoId = d.id) AS likes,
      EXISTS(SELECT 1 FROM likes mine WHERE mine.dibujoId = d.id AND lower(mine.emailUsuario) = ?) AS likedByMe,
      (SELECT COUNT(*) FROM comentarios c WHERE c.dibujoId = d.id) AS comentariosCount
      FROM dibujos d ORDER BY CASE WHEN ? = 'likes' THEN (SELECT COUNT(*) FROM likes rank_l WHERE rank_l.dibujoId = d.id) END DESC, d.fecha DESC, d.id DESC`, [email, String(_req.query.orden || '').toLowerCase()]);
    res.json({ success: true, dibujos });
  } catch (err) { console.error('Cargar dibujos:', err.message); res.status(500).json({ success: false, message: 'Error al cargar dibujos.' }); }
});

app.put('/api/dibujos/:id', async (req, res) => {
  const id = Number(req.params.id);
  const email = String(req.body.emailUsuario || '').trim().toLowerCase();
  const titulo = String(req.body.titulo || '').trim();
  const descripcion = String(req.body.descripcion || '').trim();
  if (!id || !email || !titulo) return res.status(400).json({ success: false, message: 'Datos incompletos.' });
  try {
    const result = await run('UPDATE dibujos SET titulo = ?, descripcion = ? WHERE id = ? AND lower(emailUsuario) = ?', [titulo, descripcion, id, email]);
    if (!result.changes) return res.status(404).json({ success: false, message: 'Publicación no encontrada o no pertenece a tu cuenta.' });
    res.json({ success: true, message: 'Publicación actualizada.' });
  } catch (err) { res.status(500).json({ success: false, message: 'No se pudo editar la publicación.' }); }
});

app.post('/api/dibujos/:id/like', async (req, res) => {
  const email = String(req.body.emailUsuario || '').trim().toLowerCase();
  const id = Number(req.params.id);
  if (!email || !id) return res.status(400).json({ success: false, message: 'Inicia sesión para dar me gusta.' });
  try {
    const usuario = await get('SELECT email FROM usuarios WHERE lower(email) = ?', [email]);
    if (!usuario) return res.status(401).json({ success: false, message: 'Inicia sesión para dar me gusta.' });
    const existing = await get('SELECT id FROM likes WHERE lower(emailUsuario) = ? AND dibujoId = ?', [email, id]);
    if (existing) await run('DELETE FROM likes WHERE id = ?', [existing.id]);
    else await run('INSERT INTO likes (emailUsuario, dibujoId) VALUES (?, ?)', [email, id]);
    const row = await get('SELECT COUNT(*) AS total FROM likes WHERE dibujoId = ?', [id]);
    res.json({ success: true, liked: !existing, likes: row.total });
  } catch (err) { res.status(500).json({ success: false, message: 'No se pudo actualizar el me gusta.' }); }
});

app.get('/api/dibujos/:id/comentarios', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ success: false, message: 'Publicación inválida.' });
  try {
    const comentarios = await all('SELECT id, dibujoId, emailUsuario, nombreUsuario, contenido, fecha FROM comentarios WHERE dibujoId = ? ORDER BY fecha ASC, id ASC', [id]);
    res.json({ success: true, comentarios });
  } catch (err) { res.status(500).json({ success: false, message: 'No se pudieron cargar los comentarios.' }); }
});

app.post('/api/dibujos/:id/comentarios', async (req, res) => {
  const id = Number(req.params.id);
  const email = String(req.body.emailUsuario || '').trim().toLowerCase();
  const contenido = String(req.body.contenido || '').trim().slice(0, 1000);
  if (!id || !email || !contenido) return res.status(400).json({ success: false, message: 'Escribe un comentario.' });
  try {
    const usuario = await get('SELECT nombre, tag FROM usuarios WHERE lower(email) = ?', [email]);
    if (!usuario) return res.status(401).json({ success: false, message: 'Inicia sesión para comentar.' });
    const dibujo = await get('SELECT id FROM dibujos WHERE id = ?', [id]);
    if (!dibujo) return res.status(404).json({ success: false, message: 'Publicación no encontrada.' });
    const nombre = usuario.nombre || usuario.tag || email;
    const result = await run('INSERT INTO comentarios (dibujoId, emailUsuario, nombreUsuario, contenido) VALUES (?, ?, ?, ?)', [id, email, nombre, contenido]);
    res.status(201).json({ success: true, id: result.lastID, message: 'Comentario publicado.' });
  } catch (err) { console.error('Comentario:', err.message); res.status(500).json({ success: false, message: 'No se pudo guardar el comentario.' }); }
});

app.delete('/api/dibujos/:dibujoId/comentarios/:comentarioId', async (req, res) => {
  const dibujoId = Number(req.params.dibujoId);
  const comentarioId = Number(req.params.comentarioId);
  const email = String(req.body.emailUsuario || '').trim().toLowerCase();
  if (!dibujoId || !comentarioId || !email) return res.status(400).json({ success: false, message: 'Datos incompletos.' });
  try {
    const usuario = await get('SELECT email FROM usuarios WHERE lower(email) = ?', [email]);
    if (!usuario) return res.status(401).json({ success: false, message: 'Inicia sesión para borrar comentarios.' });
    const result = await run('DELETE FROM comentarios WHERE id = ? AND dibujoId = ? AND lower(emailUsuario) = ?', [comentarioId, dibujoId, email]);
    if (!result.changes) return res.status(403).json({ success: false, message: 'Solo puedes borrar tus propios comentarios.' });
    res.json({ success: true, message: 'Comentario eliminado.' });
  } catch (err) { console.error('Eliminar comentario:', err.message); res.status(500).json({ success: false, message: 'No se pudo borrar el comentario.' }); }
});

app.get('/api/favoritos/:email', async (req, res) => {
  try {
    const dibujos = await all(`SELECT d.* FROM dibujos d JOIN likes l ON l.dibujoId = d.id WHERE lower(l.emailUsuario) = ? ORDER BY l.fecha DESC`, [String(req.params.email).toLowerCase()]);
    res.json({ success: true, dibujos });
  } catch (err) { res.status(500).json({ success: false, message: 'No se pudieron cargar los favoritos.' }); }
});

initialize().then(() => {
  app.listen(PORT, () => console.log(`Servidor activo en http://localhost:${PORT}`));
}).catch(err => {
  console.error('No se pudo inicializar SQLite:', err);
  process.exit(1);
});
