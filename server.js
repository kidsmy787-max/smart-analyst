/**
 * Smart Analyst — backend
 * Products + image upload API with a simple admin login.
 * Data is stored in data/products.json ; images in uploads/.
 */
const express = require("express");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// ----- config (change these!) -----
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "smart2026";
const SESSION_SECRET = process.env.SESSION_SECRET || "change-this-secret-key";

// ----- paths -----
// On Render, set DATA_ROOT to your persistent disk mount path (e.g. /var/data)
// so uploaded images + products survive restarts. Locally it defaults to ./
const DATA_ROOT = process.env.DATA_ROOT || __dirname;
const DATA_DIR = path.join(DATA_ROOT, "data");
const UPLOAD_DIR = path.join(DATA_ROOT, "uploads");
const DB_FILE = path.join(DATA_DIR, "products.json");
[DATA_DIR, UPLOAD_DIR].forEach(d => fs.mkdirSync(d, { recursive: true }));

// Seed sample products the first time only (empty or missing DB)
if (!fs.existsSync(DB_FILE)) {
  const seedPath = path.join(__dirname, "data", "products.json");
  const seed = fs.existsSync(seedPath) ? fs.readFileSync(seedPath, "utf8") : "[]";
  fs.writeFileSync(DB_FILE, seed);
}

// ----- tiny JSON datastore -----
const db = {
  all()  { try { return JSON.parse(fs.readFileSync(DB_FILE, "utf8")); } catch { return []; } },
  save(list) { fs.writeFileSync(DB_FILE, JSON.stringify(list, null, 2)); },
};

// ----- middleware -----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 8 } // 8h
}));

// static — serve from ./public if it exists, otherwise from the repo root
// (this makes it work whether index.html/admin.html are inside public/ or not)
app.use("/uploads", express.static(UPLOAD_DIR));
const PUBLIC_DIR = fs.existsSync(path.join(__dirname, "public", "index.html"))
  ? path.join(__dirname, "public")
  : __dirname;
app.use(express.static(PUBLIC_DIR));

// ----- image upload -----
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, "p_" + Date.now() + "_" + Math.round(Math.random()*1e6) + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_, file, cb) => {
    const ok = /jpeg|jpg|png|webp|gif/.test(file.mimetype);
    cb(ok ? null : new Error("Only image files are allowed"), ok);
  }
});

// ----- auth helpers -----
function requireAdmin(req, res, next) {
  if (req.session && req.session.admin) return next();
  return res.status(401).json({ error: "Not authenticated" });
}

// ================= AUTH API =================
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    req.session.admin = true;
    return res.json({ ok: true });
  }
  res.status(401).json({ error: "Invalid username or password" });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/me", (req, res) => {
  res.json({ admin: !!(req.session && req.session.admin) });
});

// ================= PRODUCTS API =================
// public: list products
app.get("/api/products", (_, res) => {
  res.json(db.all());
});

// admin: create product (with optional image)
app.post("/api/products", requireAdmin, upload.single("image"), (req, res) => {
  const { name, price, oldPrice, category, description, condition } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({ error: "name, price and category are required" });
  }
  const list = db.all();
  const product = {
    id: "p" + Date.now(),
    name: name.trim(),
    price: Number(price),
    oldPrice: oldPrice ? Number(oldPrice) : null,
    category,                                   // new | used | computers | accessories
    condition: condition || (category === "used" ? "used" : "new"),
    description: (description || "").trim(),
    image: req.file ? "/uploads/" + req.file.filename : null,
    createdAt: Date.now()
  };
  list.unshift(product);
  db.save(list);
  res.json(product);
});

// admin: update product (optional new image)
app.put("/api/products/:id", requireAdmin, upload.single("image"), (req, res) => {
  const list = db.all();
  const i = list.findIndex(p => p.id === req.params.id);
  if (i === -1) return res.status(404).json({ error: "Not found" });
  const p = list[i];
  const { name, price, oldPrice, category, description, condition } = req.body;
  if (name !== undefined) p.name = name.trim();
  if (price !== undefined) p.price = Number(price);
  if (oldPrice !== undefined) p.oldPrice = oldPrice ? Number(oldPrice) : null;
  if (category !== undefined) p.category = category;
  if (condition !== undefined) p.condition = condition;
  if (description !== undefined) p.description = description.trim();
  if (req.file) {
    // remove old image file
    if (p.image) { const old = path.join(__dirname, p.image); fs.existsSync(old) && fs.unlinkSync(old); }
    p.image = "/uploads/" + req.file.filename;
  }
  list[i] = p;
  db.save(list);
  res.json(p);
});

// admin: delete product
app.delete("/api/products/:id", requireAdmin, (req, res) => {
  let list = db.all();
  const p = list.find(x => x.id === req.params.id);
  if (p && p.image) { const f = path.join(__dirname, p.image); fs.existsSync(f) && fs.unlinkSync(f); }
  list = list.filter(x => x.id !== req.params.id);
  db.save(list);
  res.json({ ok: true });
});

// upload-size / type errors
app.use((err, _, res, next) => {
  if (err) return res.status(400).json({ error: err.message });
  next();
});

app.listen(PORT, () => console.log(`Smart Analyst running on http://localhost:${PORT}`));
