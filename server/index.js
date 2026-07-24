const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure uploads folder exists on local ext4 disk
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());

// Serve static uploads
app.use('/uploads', express.static(uploadsDir));

// Storage engine config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, 'verdura-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

// Upload single image endpoint
app.post('/api/upload', upload.single('imagen'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se envió ninguna imagen' });
  }

  // Construct absolute/relative URL
  const host = req.get('host');
  const protocol = req.protocol;
  const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

  return res.json({
    success: true,
    filename: req.file.filename,
    url: imageUrl
  });
});

// Healthcheck endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'Debian T410 ThinkPad', ip: '192.168.1.149' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de imágenes corriendo en puerto ${PORT}`);
  console.log(`📁 Carpeta de almacenamiento: ${uploadsDir}`);
});
