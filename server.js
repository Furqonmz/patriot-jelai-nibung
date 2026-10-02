// Memanggil modul yang dibutuhkan
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config(); // Membaca file .env

// Membuat aplikasi server
const app = express();
const port = process.env.PORT || 3000;

// Mengaktifkan CORS dan izin membaca format JSON
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// test di vercel
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/test', (req, res) => {
    res.json({
        status: 'success',
        pesan: 'Express API berhasil berjalan di Vercel!'
    });
});

// PENGATURAN UPLOAD GAMBAR DENGAN MULTER
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Simpan ke folder public/uploads/
    },
    filename: function (req, file, cb){
        // Beri nama unik: timestamp + ekstensi asli (contoh: 16900000_gambar.jpg)
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage: storage});

// ==========================================
// 1. KONEKSI KE MONGODB ATLAS
// ==========================================
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Berhasil terhubung ke Database MongoDB Atlas!'))
    .catch((err) => {
        console.error('Koneksi database gagal:', err.message);
        console.error(err);
    });

// ==========================================
// 2. SKEMA & MODEL 
// ==========================================
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

const umkmSchema = new mongoose.Schema({
    nama: { type: String, required: true },
    pemilik: {type: String, required: true},
    desa: { type: String, required: true },
    produk: { type: String, required: true },
    harga: { type: String, required: true },
    lokasi: { type: String, required: true },
    gambar: { type: String, required: true },
    kontak: { type: String, required: true },
    deskripsi: { type: String, required: true },
});
const UMKM = mongoose.model('UMKM', umkmSchema);

// CERITA KAWASAN
const ceritaSchema = new mongoose.Schema({
    judul: {type: String, required: true},
    deskripsi: {type: String, required: true},
    gambar: {type: String, required: true},
    penulis: {type: String, required: true},
    tanggal: {type: Date, default: Date.now}
});
const Cerita = mongoose.model('Cerita', ceritaSchema);

// ==========================================
// 3. MENYAJIKAN FILE STATIS (Frontend)
// ==========================================
app.use(express.static('public'));

// ==========================================
// 4. MEMBUAT ENDPOINT (API) 
// ==========================================
// Endpoint untuk Login Admin
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Cek apakah username ada di database
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ pesan: "Username tidak ditemukan!" });
        }

        // Cek kecocokan password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ pesan: "Password salah!" });
        }

        res.json({ pesan: "Login berhasil!" });
    } catch (error) {
        res.status(500).json({ pesan: "Terjadi kesalahan pada server", error });
    }
});

// Endpoint Darurat untuk Membuat Akun Admin Pertama Kali
// (Bisa diakses lewat Postman atau Thunder Client dengan metode POST)
app.post('/api/register-admin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ pesan: "Akun admin berhasil dibuat!" });
    } catch (error) {
        res.status(400).json({ pesan: "Gagal membuat akun admin (mungkin username sudah terdaftar)", error });
    }
});

// UMKM
// Endpoint untuk mengambil daftar UMKM dari Database
app.get('/api/umkm', async (req, res) => {
    try {
        const daftarUMKM = await UMKM.find();
        res.json(daftarUMKM);
    } catch (error) {
        console.error('ERROR GET /api/umkm:', error);
        res.status(500).json({
            pesan: "Gagal mengambil data dari database",
            error: error.message
        });
    }
});

// [GET] Ambil satu detail UMKM Berdasarkan ID
app.get('/api/umkm/:id', async(req, res) => {
    try {
        const umkmDetail = await UMKM.findById(req.params.id);
        if(!umkmDetail) {
            return res.status(404).json({pesan: "Data UMKM tidak ditemukan"});
        }
        res.json(umkmDetail);
    } catch (error) {
        res.status(500).json({pesan:"Gagal mengambil detail UMKM", error});
    }
});

// Endpoint untuk MENAMBAH data UMKM baru ke Database
app.post('/api/umkm', upload.single('gambar'),async (req, res) => {
    try {
        // Jika ada file yang diunggah, simpan jalurnya (/uploads/namafile.jpg)
        const imagePath = req.file ? '/uploads/' + req.file.filename: '';

        const umkmBaru = new UMKM({
            nama: req.body.nama,
            pemilik: req.body.pemilik,
            desa: req.body.desa,
            produk: req.body.produk,
            harga: req.body.harga,
            lokasi: req.body.lokasi,
            kontak: req.body.kontak,
            deskripsi: req.body.deskripsi,
            gambar: imagePath
        });

        const savedUMKM = await umkmBaru.save();
        res.status(201).json({ pesan: "Data UMKM berhasil ditambahkan!", data: savedUMKM });
    } catch (error) {
        res.status(400).json({ pesan: "Gagal menyimpan data", error });
    }
});

// [PUT] Endpoint Edit/Update DATA UMKM
app.put('/api/umkm/:id',upload.single('gambar'), async(req,res) => {
    try {
        const dataUpdate = {
            nama: req.body.nama,
            pemilik: req.body.pemilik,
            desa: req.body.desa,
            produk: req.body.produk,
            harga: req.body.harga,
            lokasi: req.body.lokasi,
            kontak: req.body.kontak,
            deskripsi: req.body.deskripsi
        };
        // Jika admin mengunggah gambar baru saat edit, update path gambarnya
        if(req.file){
            dataUpdate.gambar = '/uploads/'+req.file.filename;
        }
        await UMKM.findByIdAndUpdate(req.params.id, dataUpdate);
        res.json({pesan: "UMKM diperbarui!"});
    } catch (error) {
        res.status(400).json({pesan: "Gagal memperbarui UMKM", error});
    }
});

// [DELETE] Endpoint menghapus Data UMKM
app.delete('/api/umkm/:id', async(req, res) => {
    try {
        await UMKM.findByIdAndDelete(req.params.id);
        res.json({pesan:"Data UMKM berhasil dihapus!"});
    } catch (error) {
        res.status(500).json({pesan: "Gagal menghapus data", error});
    }
});

// CERITA KAWASAN
// [GET] Ambil Semua Cerita (Digunakan di halaman cerita-kawasan.html)
app.get('/api/cerita', async (req, res) => {
    try {
        const daftarCerita = await Cerita.find().sort({ tanggal: -1 });
        res.json(daftarCerita);
    } catch (error) {
        console.error('ERROR GET /api/cerita:', error);
        res.status(500).json({
            pesan: "Gagal mengambil cerita",
            error: error.message
        });
    }
});

// [GET] Ambil Satu Detail Cerita Berdasarkan ID (Digunakan di halaman detail-cerita.html)
app.get('/api/cerita/:id', async (req, res) => {
    try {
        // Gunakan .findById() dan pastikan ada :id di rutenya
        const ceritaDetail = await Cerita.findById(req.params.id);
        if (!ceritaDetail) {
            return res.status(404).json({pesan:"Cerita tidak ditemukan"});
        }
        res.json(ceritaDetail);
    } catch (error) {
        res.status(500).json({ pesan: "Gagal mengambil detail cerita", error });
    }
});

// [POST] Tambah Cerita Baru
app.post('/api/cerita', upload.single('gambar'), async (req, res) => {
    try {
        const imagePath = req.file ? '/uploads/' + req.file.filename: '';
        const ceritaBaru = new Cerita({
            judul: req.body.judul,
            deskripsi: req.body.deskripsi,
            penulis: req.body.penulis,
            gambar: imagePath
        });
        await ceritaBaru.save();
        res.status(201).json({ pesan: "Cerita berhasil ditambahkan!" });
    } catch (error) {
        res.status(400).json({ pesan: "Gagal menyimpan cerita", error });
    }
});

// [PUT] Edit Cerita
app.put('/api/cerita/:id',upload.single('gambar'), async (req, res) => {
    try {
        const dataUpdate = {judul: req.body.judul, deskripsi: req.body.deskripsi, penulis: req.body.penulis};
        if (req.file) {
            dataUpdate.gambar = '/uploads/' + req.file.filename;
        }
        await Cerita.findByIdAndUpdate(req.params.id, dataUpdate);
        res.json({ pesan: "Cerita berhasil diperbarui!" });
    } catch (error) {
        res.status(400).json({ pesan: "Gagal mengedit cerita", error });
    }
});

// [DELETE] Hapus Cerita
app.delete('/api/cerita/:id', async (req, res) => {
    try {
        await Cerita.findByIdAndDelete(req.params.id);
        res.json({ pesan: "Cerita berhasil dihapus!" });
    } catch (error) {
        res.status(500).json({ pesan: "Gagal menghapus cerita", error });
    }
});

// ==========================================
// 5. MENYALAKAN SERVER
// ==========================================
module.exports = app;

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Backend server menyala! Coba buka http://localhost:${port} di browser Anda.`);
    });
}