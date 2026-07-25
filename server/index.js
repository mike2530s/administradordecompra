const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3001;

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error conectando a SQLite:', err.message);
  } else {
    console.log('SQLite conectada en:', dbPath);
    initDatabaseSchema();
  }
});

function initDatabaseSchema() {
  db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS productos (id TEXT PRIMARY KEY, nombre TEXT NOT NULL, precioVenta REAL DEFAULT 0, costoPromedio REAL DEFAULT 0, unidad TEXT DEFAULT "kg", stockKg REAL DEFAULT 10, imagenUrl TEXT, destacadoHoy INTEGER DEFAULT 0, mermaAcumuladaKg REAL DEFAULT 0)');
    db.run('CREATE TABLE IF NOT EXISTS compras (id TEXT PRIMARY KEY, fecha TEXT NOT NULL, productoNombre TEXT NOT NULL, cantidad REAL DEFAULT 0, unidad TEXT DEFAULT "kg", costoCompra REAL DEFAULT 0, precioVenta REAL DEFAULT 0, totalImporte REAL DEFAULT 0, proveedor TEXT DEFAULT "Proveedor Local")');
    db.run('CREATE TABLE IF NOT EXISTS pedidos (id TEXT PRIMARY KEY, clienteNombre TEXT NOT NULL, clienteTelefono TEXT NOT NULL, horaRecojo TEXT, metodoPago TEXT, total REAL DEFAULT 0, itemsJson TEXT, estado TEXT DEFAULT "pendiente", fechaCreacion TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS usuarios (id TEXT PRIMARY KEY, nombre TEXT NOT NULL, password TEXT NOT NULL)');
    db.run("INSERT OR IGNORE INTO usuarios (id, nombre, password) VALUES ('admin', 'El Mike', 'Miguel1nmiguel0n')");
  });
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadsDir); },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, 'verdura-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

app.post('/api/upload', upload.single('imagen'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se envió ninguna imagen' });
  const host = req.get('host');
  const protocol = req.protocol;
  const imageUrl = protocol + '://' + host + '/uploads/' + req.file.filename;
  res.json({ success: true, filename: req.file.filename, url: imageUrl });
});

app.get('/api/productos', (req, res) => {
  db.all('SELECT * FROM productos ORDER BY nombre ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => ({ ...r, destacadoHoy: Boolean(r.destacadoHoy) })));
  });
});

app.post('/api/productos', (req, res) => {
  const { id, nombre, precioVenta, costoPromedio, unidad, stockKg, imagenUrl, destacadoHoy, mermaAcumuladaKg } = req.body;
  const prodId = id || 'p-' + Date.now();
  db.run('INSERT INTO productos (id, nombre, precioVenta, costoPromedio, unidad, stockKg, imagenUrl, destacadoHoy, mermaAcumuladaKg) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET nombre=excluded.nombre, precioVenta=excluded.precioVenta, costoPromedio=excluded.costoPromedio, unidad=excluded.unidad, stockKg=excluded.stockKg, imagenUrl=excluded.imagenUrl, destacadoHoy=excluded.destacadoHoy, mermaAcumuladaKg=excluded.mermaAcumuladaKg',
    [prodId, nombre, precioVenta || 0, costoPromedio || 0, unidad || 'kg', stockKg || 0, imagenUrl || '', destacadoHoy ? 1 : 0, mermaAcumuladaKg || 0], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: prodId });
    });
});

app.put('/api/productos/:id', (req, res) => {
  const fields = req.body;
  const keys = Object.keys(fields).filter(k => k !== 'id');
  if (keys.length === 0) return res.json({ success: true });
  const setClause = keys.map(k => k + ' = ?').join(', ');
  const values = keys.map(k => k === 'destacadoHoy' ? (fields[k] ? 1 : 0) : fields[k]);
  values.push(req.params.id);
  db.run('UPDATE productos SET ' + setClause + ' WHERE id = ?', values, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, changes: this.changes });
  });
});

app.delete('/api/productos/:id', (req, res) => {
  db.run('DELETE FROM productos WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete('/api/reset', (req, res) => {
  db.serialize(() => {
    db.run('DELETE FROM productos');
    db.run('DELETE FROM compras');
    db.run('DELETE FROM pedidos');
  });
  res.json({ success: true, message: 'Base de Datos SQLite reiniciada' });
});

app.get('/api/compras', (req, res) => {
  db.all('SELECT * FROM compras ORDER BY fecha DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/compras', (req, res) => {
  const { id, fecha, productoNombre, cantidad, unidad, costoCompra, precioVenta, totalImporte, proveedor } = req.body;
  const compraId = id || 'c-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
  db.run('INSERT INTO compras (id, fecha, productoNombre, cantidad, unidad, costoCompra, precioVenta, totalImporte, proveedor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [compraId, fecha || new Date().toISOString(), productoNombre, cantidad || 0, unidad || 'kg', costoCompra || 0, precioVenta || 0, totalImporte || 0, proveedor || 'Escáner IA'],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: compraId });
    });
});

app.post('/api/compras/batch', (req, res) => {
  const items = req.body.items || [];
  if (items.length === 0) return res.json({ success: true, count: 0 });
  const stmt = db.prepare('INSERT INTO compras (id, fecha, productoNombre, cantidad, unidad, costoCompra, precioVenta, totalImporte, proveedor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  db.serialize(() => {
    items.forEach(function (it) {
      const cId = it.id || 'c-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
      stmt.run([cId, it.fecha || '10/07/2026', it.productoNombre || it.producto, it.cantidad || 0, it.unidad || 'kg', it.costoCompra || it.precio || 0, it.precioVenta || 0, it.totalImporte || (it.cantidad * it.costoCompra), it.proveedor || 'Escáner Nota en Papel']);
    });
    stmt.finalize(function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, count: items.length });
    });
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'Debian T410 ThinkPad', ip: '192.168.1.149', db: 'SQLite' });
});

app.post('/api/login', (req, res) => {
  const { usuario, password } = req.body;
  db.get('SELECT * FROM usuarios WHERE nombre = ? AND password = ?', [usuario, password], function (err, row) {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(401).json({ error: 'Credenciales inválidas' });
    res.json({ success: true, displayName: row.nombre });
  });
});

app.post('/api/register', (req, res) => {
  const { nombre, password } = req.body;
  const id = 'u-' + Date.now();
  db.run('INSERT INTO usuarios (id, nombre, password) VALUES (?, ?, ?)', [id, nombre, password], function (err) {
    if (err) {
      if (err.message && err.message.includes('UNIQUE')) return res.status(409).json({ error: 'Usuario ya existe' });
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, displayName: nombre });
  });
});

app.listen(PORT, function () {
  console.log('Servidor Express & SQLite corriendo en puerto ' + PORT);
  console.log('Almacenamiento imagenes: ' + uploadsDir);
  console.log('Base de datos SQLite: ' + dbPath);
});
"@