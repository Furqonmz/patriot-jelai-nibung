// ==========================================
// 1. MEMANGGIL MODUL
// ==========================================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
require("dotenv").config();


// ==========================================
// 2. KONFIGURASI APLIKASI
// ==========================================
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));


// ==========================================
// 3. FOLDER UPLOAD GAMBAR
// ==========================================
const folderUpload = path.join(__dirname, "public", "uploads");

if (!fs.existsSync(folderUpload)) {
    fs.mkdirSync(folderUpload, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, folderUpload);
    },

    filename: function (req, file, cb) {
        const ekstensi = path.extname(file.originalname);
        const namaFile = Date.now() + "-" + crypto.randomBytes(4).toString("hex") + ekstensi;

        cb(null, namaFile);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: function (req, file, cb) {
        const tipeDiizinkan = /jpeg|jpg|png|webp/;
        const ekstensi = tipeDiizinkan.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mime = tipeDiizinkan.test(file.mimetype);

        if (ekstensi && mime) {
            return cb(null, true);
        }

        cb(new Error("Format gambar harus JPG, JPEG, PNG, atau WEBP."));
    }
});


// ==========================================
// 4. KONEKSI MONGODB ATLAS
// ==========================================
if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI belum diatur di file .env");
}

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Berhasil terhubung ke Database MongoDB Atlas!");
    })
    .catch((error) => {
        console.error("Koneksi database gagal:", error.message);
    });


// ==========================================
// 5. MODEL USER / ADMIN
// ==========================================
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);


// ==========================================
// 6. MODEL UMKM
// ==========================================
const umkmSchema = new mongoose.Schema({
    nama: { type: String, required: true },
    pemilik: { type: String, required: true },
    desa: { type: String, required: true },
    produk: { type: String, required: true },
    harga: { type: String, required: true },
    lokasi: { type: String, required: true },
    gambar: { type: String, required: true },
    kontak: { type: String, required: true },
    deskripsi: { type: String, required: true }
}, {
    timestamps: true
});

const UMKM = mongoose.models.UMKM || mongoose.model("UMKM", umkmSchema);


// ==========================================
// 7. MODEL CERITA KAWASAN
// ==========================================
const ceritaSchema = new mongoose.Schema({
    judul: {
        type: String,
        required: true
    },

    deskripsi: {
        type: String,
        required: true
    },

    gambar: {
        type: String,
        required: true
    },

    penulis: {
        type: String,
        required: true
    },

    tanggal: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Cerita = mongoose.models.Cerita || mongoose.model("Cerita", ceritaSchema);


// ==========================================
// 8. MODEL INDUK DESA
// ==========================================
const desaSchema = new mongoose.Schema({
    kodeDesa: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    namaDesa: {
        type: String,
        required: true,
        trim: true
    },

    kecamatan: {
        type: String,
        default: "Jelai"
    },

    kabupaten: {
        type: String,
        default: "Sukamara"
    },

    provinsi: {
        type: String,
        default: "Kalimantan Tengah"
    }

}, {
    timestamps: true,
    collection: "desas"
});

const Desa = mongoose.models.Desa || mongoose.model("Desa", desaSchema);


// ==========================================
// 9. MODEL PROFIL DESA
// ==========================================
// Berisi:
// - Deskripsi singkat
// - Sekilas desa
// - Jumlah penduduk
// - Jumlah KK
// - Luas wilayah
// - Koordinat
// ==========================================
const desaProfileSchema = new mongoose.Schema({
    desaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Desa",
        required: true,
        unique: true
    },

    komoditasUtama: {
    type: String,
    default: ""
    },

    karakterKawasan: {
        type: String,
        default: ""
    },

    ringkasan: {
        type: String,
        default: ""
    },

    deskripsi: {
        type: String,
        default: ""
    },

    jumlahPenduduk: {
        type: Number,
        default: 0
    },

    jumlahKK: {
        type: Number,
        default: 0
    },

    luasWilayah: {
        type: String,
        default: ""
    },

    koordinat: {
        latitude: {
            type: Number,
            default: null
        },

        longitude: {
            type: Number,
            default: null
        }
    },

    akses: {
        type: String,
        default: ""
    },

    strukturOrganisasi: [
    {
            jabatan: {
                type: String,
                required: true
            },
            nama: {
                type: String,
                default: ""
            },
            bidang: {
                type: String,
                default: ""
            },
            parentId: {
                type: String,
                default: null
            },
            urutan: {
                type: Number,
                default: 0
            },
            foto: {
                type: String,
                default: ""
            }
        }
    ],

    gambarHero: {
        type: String,
        default: ""
    }

}, {
    timestamps: true,
    collection: "desa_profiles"
});

const DesaProfile = mongoose.models.DesaProfile || mongoose.model("DesaProfile", desaProfileSchema);

// ==========================================
// MODEL STRUKTUR ORGANISASI DESA
// Satu dokumen untuk setiap desa
// ==========================================

const desaOrganigramSchema = new mongoose.Schema({
    desaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Desa",
        required: true,
        unique: true
    },

    anggota: [{
        nama: {
            type: String,
            required: true,
            trim: true
        },

        jabatan: {
            type: String,
            required: true,
            trim: true
        },

        bidang: {
            type: String,
            default: ""
        },

        parentId: {
            type: String,
            default: null
        },

        orientasiAnak: {
            type: String,
            enum: ["horizontal", "vertical"],
            default: "horizontal"
        },

        foto: {
            type: String,
            default: ""
        },

        urutan: {
            type: Number,
            default: 0
        }
    }]
}, {
    timestamps: true,
    collection: "desa_organigrams"
});

const DesaOrganigram = mongoose.models.DesaOrganigram || mongoose.model("DesaOrganigram", desaOrganigramSchema);
// ==========================================
// 10. MODEL DEMOGRAFI DESA
// ==========================================
// Berisi:
// - Tahun data
// - Total penduduk
// - Laki-laki
// - Perempuan
// - Jumlah KK
// - Jumlah dusun / RT / RW
// - Kelompok usia
// - Pendidikan terakhir
// - Mata pencaharian
// - Usia produktif
// ==========================================
const desaDemografiSchema = new mongoose.Schema({
    desaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Desa",
        required: true
    },

    tahun: {
        type: Number,
        required: true
    },

    jumlahPenduduk: {
        type: Number,
        default: 0
    },

    lakiLaki: {
        type: Number,
        default: 0
    },

    perempuan: {
        type: Number,
        default: 0
    },

    jumlahKK: {
        type: Number,
        default: 0
    },

    jumlahDusunRT: {
        type: String,
        default: ""
    },

    kelompokUsia: [{
        kategori: String,
        jumlah: {
            type: Number,
            default: 0
        }
    }],

    pendidikan: [{
        kategori: String,
        jumlah: {
            type: Number,
            default: 0
        }
    }],

    pekerjaan: [{
        kategori: String,
        jumlah: {
            type: Number,
            default: 0
        }
    }],

    usiaProduktif: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true,
    collection: "desa_demographics"
});

desaDemografiSchema.index(
    { desaId: 1, tahun: 1 },
    { unique: true }
);

const DesaDemografi = mongoose.models.DesaDemografi || mongoose.model("DesaDemografi", desaDemografiSchema);


// ==========================================
// 11. MODEL GALERI DESA
// ==========================================
const desaGaleriSchema = new mongoose.Schema({
    desaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Desa",
        required: true
    },

    gambar: {
        type: String,
        required: true
    },

    keterangan: {
        type: String,
        default: ""
    },

    urutan: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true,
    collection: "desa_galleries"
});

const DesaGaleri = mongoose.models.DesaGaleri || mongoose.model("DesaGaleri", desaGaleriSchema);


// ==========================================
// 12. AUTENTIKASI ADMIN
// ==========================================
if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET belum diatur di file .env");
}


// Membuat token admin
function buatTokenAdmin(userId) {
    const payload = Buffer.from(JSON.stringify({
        userId: userId.toString(),
        exp: Date.now() + (8 * 60 * 60 * 1000)
    })).toString("base64url");

    const signature = crypto
        .createHmac("sha256", process.env.SESSION_SECRET)
        .update(payload)
        .digest("base64url");

    return `${payload}.${signature}`;
}


// Mengambil token dari cookie
function ambilTokenAdmin(req) {
    const cookies = req.headers.cookie || "";

    const tokenCookie = cookies
        .split(";")
        .map(item => item.trim())
        .find(item => item.startsWith("admin_token="));

    return tokenCookie
        ? decodeURIComponent(
            tokenCookie.substring("admin_token=".length)
        )
        : null;
}


// Memvalidasi admin
function validasiAdmin(req, res, next) {
    try {
        const token = ambilTokenAdmin(req);

        if (!token) {
            return res.status(401).json({
                pesan: "Silakan login sebagai admin terlebih dahulu."
            });
        }

        const [payload, signature] = token.split(".");

        if (!payload || !signature) {
            return res.status(401).json({
                pesan: "Sesi admin tidak valid."
            });
        }

        const signatureBenar = crypto
            .createHmac("sha256", process.env.SESSION_SECRET)
            .update(payload)
            .digest("base64url");

        const a = Buffer.from(signature);
        const b = Buffer.from(signatureBenar);

        if (
            a.length !== b.length ||
            !crypto.timingSafeEqual(a, b)
        ) {
            return res.status(401).json({
                pesan: "Sesi admin tidak valid."
            });
        }

        const data = JSON.parse(
            Buffer.from(payload, "base64url").toString("utf8")
        );

        if (!data.userId || Date.now() > data.exp) {
            return res.status(401).json({
                pesan: "Sesi admin sudah berakhir. Silakan login kembali."
            });
        }

        req.adminId = data.userId;
        next();

    } catch (error) {
        return res.status(401).json({
            pesan: "Sesi admin tidak valid."
        });
    }
}


// ==========================================
// 13. HELPER
// ==========================================

// Validasi MongoDB ObjectId
function idValid(id) {
    return mongoose.isValidObjectId(id);
}


// Mencari desa berdasarkan slug
async function cariDesa(slug) {
    return Desa.findOne({
        slug: String(slug).toLowerCase().trim()
    });
}


// Mengubah input menjadi array
function parseArray(value) {
    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value === "string") {
        try {
            const hasil = JSON.parse(value);
            return Array.isArray(hasil) ? hasil : [];
        } catch {
            return [];
        }
    }

    return [];
}


// Mengubah nilai menjadi angka atau null
function angkaAtauNull(value) {
    if (value === "" || value === undefined || value === null) {
        return null;
    }

    const angka = Number(value);

    return Number.isFinite(angka) ? angka : null;
}


// ==========================================
// 14. HALAMAN UTAMA DAN TEST API
// ==========================================
app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );
});


app.get("/api/test", (req, res) => {
    res.json({
        status: "success",
        pesan: "Express API berhasil berjalan!"
    });
});


// ==========================================
// 15. API DAFTAR DESA
// ==========================================
app.get("/api/desa", async (req, res) => {
    try {
        const daftarDesa = await Desa.find()
            .select("slug namaDesa kecamatan kabupaten provinsi")
            .sort({ namaDesa: 1 })
            .lean();

        res.json({
            pesan: "Data desa berhasil diambil.",
            data: daftarDesa
        });

    } catch (error) {
        console.error("GET DAFTAR DESA:", error);

        res.status(500).json({
            pesan: "Gagal mengambil daftar desa.",
            error: error.message
        });
    }
});


// ==========================================
// 16. API SEMUA KONTEN DETAIL DESA
// ==========================================
// Endpoint ini mengambil:
// - Identitas desa
// - Profil desa
// - Demografi
// - Galeri foto
// ==========================================
app.get("/api/desa/:slug/konten", async (req, res) => {
    try {
        const desa = await cariDesa(req.params.slug);

        if (!desa) {
            return res.status(404).json({
                pesan: "Desa tidak ditemukan."
            });
        }

        const desaId = desa._id;

        const [profil, organigram, demografi, galeri] = await Promise.all([
            DesaProfile.findOne({ desaId }).lean(),

            DesaOrganigram.findOne({ desaId }).lean(),

            DesaDemografi.findOne({ desaId })
                .sort({ tahun: -1 })
                .lean(),

            DesaGaleri.find({ desaId })
                .sort({ urutan: 1, createdAt: 1 })
                .lean()
        ]);

        res.json({
            pesan: "Konten detail desa berhasil diambil.",

            data: {
                desa,
                profil: profil || {},
                organigram: organigram || { anggota: [] },
                demografi: demografi || {},
                galeri: galeri || []
            }
        });

    } catch (error) {
        console.error("GET KONTEN DESA:", error);

        res.status(500).json({
            pesan: "Gagal mengambil konten detail desa.",
            error: error.message
        });
    }
});


// ==========================================
// 17. TAMBAH IDENTITAS DESA
// ==========================================
app.post("/api/desa", validasiAdmin, async (req, res) => {
    try {
        const {
            kodeDesa,
            slug,
            namaDesa,
            kecamatan,
            kabupaten,
            provinsi
        } = req.body;

        if (!kodeDesa || !slug || !namaDesa) {
            return res.status(400).json({
                pesan: "Kode desa, slug, dan nama desa wajib diisi."
            });
        }

        const slugBersih = slug.trim().toLowerCase();

        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slugBersih)) {
            return res.status(400).json({
                pesan: "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung."
            });
        }

        const desaBaru = new Desa({
            kodeDesa,
            slug: slugBersih,
            namaDesa,
            kecamatan,
            kabupaten,
            provinsi
        });

        await desaBaru.save();

        res.status(201).json({
            pesan: "Identitas desa berhasil ditambahkan.",
            data: desaBaru
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                pesan: "Kode desa atau slug sudah digunakan."
            });
        }

        console.error("POST DESA:", error);

        res.status(500).json({
            pesan: "Gagal menambahkan desa.",
            error: error.message
        });
    }
});


    // ==========================================
    // 18. SIMPAN / UPDATE PROFIL DESA
    // ==========================================
    app.put(
        "/api/desa/:id/profil",
        validasiAdmin,
        upload.single("gambarHero"),
        async (req, res) => {
            try {
                if (!idValid(req.params.id)) {
                    return res.status(400).json({
                        pesan: "ID desa tidak valid."
                    });
                }

                const desa = await Desa.findById(req.params.id);

                if (!desa) {
                    return res.status(404).json({
                        pesan: "Desa tidak ditemukan."
                    });
                }

                const profilLama = await DesaProfile.findOne({
                    desaId: desa._id
                });

                const latitude = angkaAtauNull(req.body.latitude);
                const longitude = angkaAtauNull(req.body.longitude);

                // Validasi koordinat
                if (
                    (req.body.latitude !== "" &&
                        req.body.latitude !== undefined &&
                        latitude === null) ||
                    (req.body.longitude !== "" &&
                        req.body.longitude !== undefined &&
                        longitude === null)
                ) {
                    return res.status(400).json({
                        pesan: "Latitude dan longitude harus berupa angka yang valid."
                    });
                }

                if (
                    (latitude !== null && (latitude < -90 || latitude > 90)) ||
                    (longitude !== null && (longitude < -180 || longitude > 180))
                ) {
                    return res.status(400).json({
                        pesan: "Rentang koordinat tidak valid."
                    });
                }

                const dataUpdate = {
                    ringkasan: req.body.ringkasan || "",
                    deskripsi: req.body.deskripsi || "",

                    komoditasUtama: req.body.komoditasUtama || "",
                    karakterKawasan: req.body.karakterKawasan || "",

                    jumlahPenduduk:
                        Number(req.body.jumlahPenduduk) || 0,

                    jumlahKK:
                        Number(req.body.jumlahKK) || 0,

                    luasWilayah: req.body.luasWilayah || "",
                    akses: req.body.akses || "",

                    koordinat: {
                        latitude,
                        longitude
                    },

                    gambarHero: req.file
                        ? "/uploads/" + req.file.filename
                        : profilLama?.gambarHero || ""
                };

                const profil = await DesaProfile.findOneAndUpdate(
                    { desaId: desa._id },
                    {
                        $set: dataUpdate,
                        $setOnInsert: {
                            desaId: desa._id
                        }
                    },
                    {
                        returnDocument: "after",
                        upsert: true,
                        runValidators: true,
                        setDefaultsOnInsert: true
                    }
                );

                res.json({
                    pesan: "Profil desa berhasil disimpan.",
                    data: profil
                });

            } catch (error) {
                console.error("SIMPAN PROFIL DESA:", error);

                res.status(500).json({
                    pesan: "Gagal menyimpan profil desa.",
                    error: error.message
                });
            }
        }
    );

// ==========================================
// GET SEMUA RIWAYAT DEMOGRAFI DESA
// ==========================================
app.get(
    "/api/desa/:id/demografi",
    async (req, res) => {
        try {
            if (!idValid(req.params.id)) {
                return res.status(400).json({
                    pesan: "ID desa tidak valid."
                });
            }

            const data = await DesaDemografi.find({
                desaId: req.params.id
            })
            .sort({ tahun: -1 })
            .lean();

            res.json({
                pesan: "Riwayat demografi berhasil diambil.",
                data
            });

        } catch (error) {
            console.error("GET RIWAYAT DEMOGRAFI:", error);

            res.status(500).json({
                pesan: "Gagal mengambil riwayat demografi."
            });
        }
    }
);
// ==========================================
// 19. SIMPAN / UPDATE DEMOGRAFI DESA
// ==========================================
app.put(
    "/api/desa/:id/demografi",
    validasiAdmin,
    async (req, res) => {
        try {
            if (!idValid(req.params.id)) {
                return res.status(400).json({
                    pesan: "ID desa tidak valid."
                });
            }

            const desa = await Desa.findById(req.params.id);

            if (!desa) {
                return res.status(404).json({
                    pesan: "Desa tidak ditemukan."
                });
            }

            const tahun = Number(req.body.tahun);

            if (
                !Number.isInteger(tahun) ||
                tahun < 1900 ||
                tahun > 2200
            ) {
                return res.status(400).json({
                    pesan: "Tahun demografi tidak valid."
                });
            }

            const dataUpdate = {
                tahun,

                jumlahPenduduk:
                    Number(req.body.jumlahPenduduk) || 0,

                lakiLaki:
                    Number(req.body.lakiLaki) || 0,

                perempuan:
                    Number(req.body.perempuan) || 0,

                jumlahKK:
                    Number(req.body.jumlahKK) || 0,

                jumlahDusunRT:
                    req.body.jumlahDusunRT || "",

                kelompokUsia:
                    parseArray(req.body.kelompokUsia),

                pendidikan:
                    parseArray(req.body.pendidikan),

                pekerjaan:
                    parseArray(req.body.pekerjaan),

                usiaProduktif:
                    Number(req.body.usiaProduktif) || 0
            };

            const demografi = await DesaDemografi.findOneAndUpdate(
                {
                    desaId: desa._id,
                    tahun
                },

                {
                    $set: dataUpdate,
                    $setOnInsert: {
                        desaId: desa._id
                    }
                },

                {
                    new: true,
                    upsert: true,
                    runValidators: true,
                    setDefaultsOnInsert: true
                }
            );

            res.json({
                pesan: "Data demografi berhasil disimpan.",
                data: demografi
            });

        } catch (error) {
            console.error("SIMPAN DEMOGRAFI:", error);

            res.status(500).json({
                pesan: "Gagal menyimpan data demografi.",
                error: error.message
            });
        }
    }
);


// ==========================================
// 20. HAPUS DATA DEMOGRAFI BERDASARKAN TAHUN
// ==========================================
app.delete(
    "/api/desa/:id/demografi/:tahun",
    validasiAdmin,
    async (req, res) => {
        try {
            if (!idValid(req.params.id)) {
                return res.status(400).json({
                    pesan: "ID desa tidak valid."
                });
            }

            const hasil = await DesaDemografi.findOneAndDelete({
                desaId: req.params.id,
                tahun: Number(req.params.tahun)
            });

            if (!hasil) {
                return res.status(404).json({
                    pesan: "Data demografi tidak ditemukan."
                });
            }

            res.json({
                pesan: "Data demografi berhasil dihapus."
            });

        } catch (error) {
            console.error("HAPUS DEMOGRAFI:", error);

            res.status(500).json({
                pesan: "Gagal menghapus data demografi.",
                error: error.message
            });
        }
    }
);

// ==========================================
// 21. CRUD STRUKTUR ORGANISASI DESA
// ==========================================

// TAMBAH JABATAN
app.post(
    "/api/desa/:id/organigram",
    validasiAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;

            if (!idValid(id)) {
                return res.status(400).json({
                    pesan: "ID desa tidak valid."
                });
            }

            const desa = await Desa.findById(id);

            if (!desa) {
                return res.status(404).json({
                    pesan: "Desa tidak ditemukan."
                });
            }

            const {
                nama,
                jabatan,
                bidang,
                parentId,
                orientasiAnak,
                urutan,
                foto
            } = req.body;

            if (!nama?.trim() || !jabatan?.trim()) {
                return res.status(400).json({
                    pesan: "Nama pejabat dan jabatan wajib diisi."
                });
            }

            let organigram = await DesaOrganigram.findOne({
                desaId: desa._id
            });

            if (!organigram) {
                organigram = new DesaOrganigram({
                    desaId: desa._id,
                    anggota: []
                });
            }

            // Pastikan jabatan atasan tersedia
            if (parentId) {
                const atasanAda = organigram.anggota.some(
                    item => String(item._id) === String(parentId)
                );

                if (!atasanAda) {
                    return res.status(400).json({
                        pesan: "Jabatan atasan tidak ditemukan."
                    });
                }
            }

            organigram.anggota.push({
                nama: nama.trim(),
                jabatan: jabatan.trim(),
                bidang: bidang || "",
                parentId: parentId || null,
                orientasiAnak:
                    orientasiAnak === "vertical"
                        ? "vertical"
                        : "horizontal",
                urutan: Number(urutan) || 0,
                foto: foto || ""
            });

            await organigram.save();

            res.status(201).json({
                pesan: "Jabatan berhasil ditambahkan.",
                data: organigram
            });

        } catch (error) {
            console.error("TAMBAH ORGANIGRAM:", error);

            res.status(500).json({
                pesan: "Gagal menambahkan jabatan.",
                error: error.message
            });
        }
    }
);


// EDIT JABATAN
app.put(
    "/api/desa/:id/organigram/:anggotaId",
    validasiAdmin,
    async (req, res) => {
        try {
            const { id, anggotaId } = req.params;

            if (!idValid(id) || !idValid(anggotaId)) {
                return res.status(400).json({
                    pesan: "ID tidak valid."
                });
            }

            const organigram = await DesaOrganigram.findOne({
                desaId: id
            });

            if (!organigram) {
                return res.status(404).json({
                    pesan: "Struktur organisasi tidak ditemukan."
                });
            }

            const anggota = organigram.anggota.id(anggotaId);

            if (!anggota) {
                return res.status(404).json({
                    pesan: "Jabatan tidak ditemukan."
                });
            }

            const {
                nama,
                jabatan,
                bidang,
                parentId,
                orientasiAnak,
                urutan,
                foto
            } = req.body;

            if (!nama?.trim() || !jabatan?.trim()) {
                return res.status(400).json({
                    pesan: "Nama pejabat dan jabatan wajib diisi."
                });
            }

            // Cegah jabatan menjadi atasannya sendiri
            if (parentId && String(parentId) === String(anggotaId)) {
                return res.status(400).json({
                    pesan: "Jabatan tidak boleh menjadi atasannya sendiri."
                });
            }

            // Pastikan calon atasan tersedia
            if (parentId) {
                const atasanAda = organigram.anggota.some(
                    item => String(item._id) === String(parentId)
                );

                if (!atasanAda) {
                    return res.status(400).json({
                        pesan: "Jabatan atasan tidak ditemukan."
                    });
                }

                // Cegah hubungan organisasi melingkar
                let idAtasan = String(parentId);

                while (idAtasan) {
                    if (idAtasan === String(anggotaId)) {
                        return res.status(400).json({
                            pesan: "Susunan atasan tidak boleh membentuk hubungan melingkar."
                        });
                    }

                    const atasan = organigram.anggota.find(
                        item => String(item._id) === idAtasan
                    );

                    idAtasan = atasan?.parentId
                        ? String(atasan.parentId)
                        : null;
                }
            }

            anggota.nama = nama.trim();
            anggota.jabatan = jabatan.trim();
            anggota.bidang = bidang || "";
            anggota.parentId = parentId || null;
            anggota.orientasiAnak =
                orientasiAnak === "vertical"
                    ? "vertical"
                    : "horizontal";
            anggota.urutan = Number(urutan) || 0;
            anggota.foto = foto || "";

            await organigram.save();

            res.json({
                pesan: "Jabatan berhasil diperbarui.",
                data: organigram
            });

        } catch (error) {
            console.error("EDIT ORGANIGRAM:", error);

            res.status(500).json({
                pesan: "Gagal memperbarui jabatan.",
                error: error.message
            });
        }
    }
);


// HAPUS JABATAN
app.delete(
    "/api/desa/:id/organigram/:anggotaId",
    validasiAdmin,
    async (req, res) => {
        try {
            const { id, anggotaId } = req.params;

            if (!idValid(id) || !idValid(anggotaId)) {
                return res.status(400).json({
                    pesan: "ID tidak valid."
                });
            }

            const organigram = await DesaOrganigram.findOne({
                desaId: id
            });

            if (!organigram) {
                return res.status(404).json({
                    pesan: "Struktur organisasi tidak ditemukan."
                });
            }

            const anggota = organigram.anggota.id(anggotaId);

            if (!anggota) {
                return res.status(404).json({
                    pesan: "Jabatan tidak ditemukan."
                });
            }

            // Cegah penghapusan jika masih memiliki bawahan
            const memilikiAnak = organigram.anggota.some(
                item => String(item.parentId || "") === String(anggotaId)
            );

            if (memilikiAnak) {
                return res.status(400).json({
                    pesan: "Jabatan ini masih memiliki bawahan. Pindahkan bawahannya terlebih dahulu."
                });
            }

            anggota.deleteOne();

            await organigram.save();

            res.json({
                pesan: "Jabatan berhasil dihapus."
            });

        } catch (error) {
            console.error("HAPUS ORGANIGRAM:", error);

            res.status(500).json({
                pesan: "Gagal menghapus jabatan.",
                error: error.message
            });
        }
    }
);
// ==========================================
// 21. TAMBAH FOTO GALERI DESA
// ==========================================
app.post(
    "/api/desa/:id/galeri",
    validasiAdmin,
    upload.single("gambar"),
    async (req, res) => {
        try {
            if (!idValid(req.params.id)) {
                return res.status(400).json({
                    pesan: "ID desa tidak valid."
                });
            }

            const desa = await Desa.findById(req.params.id);

            if (!desa) {
                return res.status(404).json({
                    pesan: "Desa tidak ditemukan."
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    pesan: "File gambar wajib dipilih."
                });
            }

            const galeri = await DesaGaleri.create({
                desaId: desa._id,
                gambar: "/uploads/" + req.file.filename,
                keterangan: req.body.keterangan || "",
                urutan: Number(req.body.urutan) || 0
            });

            res.status(201).json({
                pesan: "Foto galeri berhasil ditambahkan.",
                data: galeri
            });

        } catch (error) {
            console.error("TAMBAH GALERI:", error);

            res.status(500).json({
                pesan: "Gagal menambahkan foto galeri.",
                error: error.message
            });
        }
    }
);


// ==========================================
// 22. EDIT FOTO GALERI DESA
// ==========================================
app.put(
    "/api/desa/:id/galeri/:galeriId",
    validasiAdmin,
    upload.single("gambar"),
    async (req, res) => {
        try {
            if (
                !idValid(req.params.id) ||
                !idValid(req.params.galeriId)
            ) {
                return res.status(400).json({
                    pesan: "ID tidak valid."
                });
            }

            const dataUpdate = {};

            if (req.body.keterangan !== undefined) {
                dataUpdate.keterangan = req.body.keterangan;
            }

            if (req.body.urutan !== undefined) {
                dataUpdate.urutan = Number(req.body.urutan);
            }

            if (req.file) {
                dataUpdate.gambar = "/uploads/" + req.file.filename;
            }

            const galeri = await DesaGaleri.findOneAndUpdate(
                {
                    _id: req.params.galeriId,
                    desaId: req.params.id
                },

                {
                    $set: dataUpdate
                },

                {
                    new: true,
                    runValidators: true
                }
            );

            if (!galeri) {
                return res.status(404).json({
                    pesan: "Foto galeri tidak ditemukan."
                });
            }

            res.json({
                pesan: "Foto galeri berhasil diperbarui.",
                data: galeri
            });

        } catch (error) {
            console.error("EDIT GALERI:", error);

            res.status(500).json({
                pesan: "Gagal memperbarui foto galeri.",
                error: error.message
            });
        }
    }
);


// ==========================================
// 23. HAPUS FOTO GALERI DESA
// ==========================================
app.delete(
    "/api/desa/:id/galeri/:galeriId",
    validasiAdmin,
    async (req, res) => {
        try {
            if (
                !idValid(req.params.id) ||
                !idValid(req.params.galeriId)
            ) {
                return res.status(400).json({
                    pesan: "ID tidak valid."
                });
            }

            const hasil = await DesaGaleri.findOneAndDelete({
                _id: req.params.galeriId,
                desaId: req.params.id
            });

            if (!hasil) {
                return res.status(404).json({
                    pesan: "Foto galeri tidak ditemukan."
                });
            }

            res.json({
                pesan: "Foto galeri berhasil dihapus."
            });

        } catch (error) {
            console.error("HAPUS GALERI:", error);

            res.status(500).json({
                pesan: "Gagal menghapus foto galeri.",
                error: error.message
            });
        }
    }
);


// ==========================================
// 24. HAPUS DESA DAN DATA TERKAIT
// ==========================================
app.delete(
    "/api/desa/:id",
    validasiAdmin,
    async (req, res) => {
        try {
            if (!idValid(req.params.id)) {
                return res.status(400).json({
                    pesan: "ID desa tidak valid."
                });
            }

            const desa = await Desa.findById(req.params.id);

            if (!desa) {
                return res.status(404).json({
                    pesan: "Desa tidak ditemukan."
                });
            }

            const desaId = desa._id;

            await Promise.all([
                DesaProfile.deleteMany({ desaId }),
                DesaDemografi.deleteMany({ desaId }),
                DesaGaleri.deleteMany({ desaId })
            ]);

            await Desa.findByIdAndDelete(desaId);

            res.json({
                pesan: `Desa ${desa.namaDesa} dan data terkait berhasil dihapus.`
            });

        } catch (error) {
            console.error("HAPUS DESA:", error);

            res.status(500).json({
                pesan: "Gagal menghapus desa.",
                error: error.message
            });
        }
    }
);


// ==========================================
// 25. LOGIN ADMIN
// ==========================================
app.post("/api/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({
                pesan: "Username tidak ditemukan!"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                pesan: "Password salah!"
            });
        }

        const token = buatTokenAdmin(user._id);

        res.cookie("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 8 * 60 * 60 * 1000
        });

        res.json({
            pesan: "Login berhasil!"
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);

        res.status(500).json({
            pesan: "Terjadi kesalahan pada server."
        });
    }
});


// ==========================================
// 26. LOGOUT ADMIN
// ==========================================
app.post("/api/logout", (req, res) => {
    res.clearCookie("admin_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    });

    res.json({
        pesan: "Logout berhasil."
    });
});


// ==========================================
// 27. CEK STATUS LOGIN ADMIN
// ==========================================
app.get(
    "/api/admin/status",
    validasiAdmin,
    (req, res) => {
        res.json({
            login: true,
            pesan: "Admin terautentikasi."
        });
    }
);


// ==========================================
// 28. REGISTER ADMIN PERTAMA
// ==========================================
// Hanya bisa digunakan jika belum ada akun admin.
// Setelah akun pertama dibuat, endpoint ini tidak
// dapat digunakan untuk membuat akun tambahan.
// ==========================================
app.post("/api/register-admin", async (req, res) => {
    try {
        const jumlahAdmin = await User.countDocuments();

        if (jumlahAdmin > 0) {
            return res.status(403).json({
                pesan: "Akun admin sudah tersedia."
            });
        }

        const { username, password } = req.body;

        if (!username || !password || password.length < 8) {
            return res.status(400).json({
                pesan: "Username wajib diisi dan password minimal 8 karakter."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const adminBaru = new User({
            username,
            password: hashedPassword
        });

        await adminBaru.save();

        res.status(201).json({
            pesan: "Akun admin berhasil dibuat!"
        });

    } catch (error) {
        console.error("REGISTER ADMIN:", error);

        res.status(400).json({
            pesan: "Gagal membuat akun admin.",
            error: error.message
        });
    }
});


// ==========================================
// 29. API UMKM
// ==========================================

// GET seluruh UMKM
app.get("/api/umkm", async (req, res) => {
    try {
        const daftarUMKM = await UMKM.find();

        res.json(daftarUMKM);

    } catch (error) {
        console.error("GET UMKM:", error);

        res.status(500).json({
            pesan: "Gagal mengambil data UMKM.",
            error: error.message
        });
    }
});


// GET detail UMKM berdasarkan ID
app.get("/api/umkm/:id", async (req, res) => {
    try {
        if (!idValid(req.params.id)) {
            return res.status(400).json({
                pesan: "ID UMKM tidak valid."
            });
        }

        const umkmDetail = await UMKM.findById(req.params.id);

        if (!umkmDetail) {
            return res.status(404).json({
                pesan: "Data UMKM tidak ditemukan."
            });
        }

        res.json(umkmDetail);

    } catch (error) {
        res.status(500).json({
            pesan: "Gagal mengambil detail UMKM.",
            error: error.message
        });
    }
});


// TAMBAH UMKM
app.post(
    "/api/umkm",
    validasiAdmin,
    upload.single("gambar"),
    async (req, res) => {
        try {
            const imagePath = req.file
                ? "/uploads/" + req.file.filename
                : "";

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

            res.status(201).json({
                pesan: "Data UMKM berhasil ditambahkan!",
                data: savedUMKM
            });

        } catch (error) {
            console.error("TAMBAH UMKM:", error);

            res.status(400).json({
                pesan: "Gagal menyimpan data UMKM.",
                error: error.message
            });
        }
    }
);


// EDIT UMKM
app.put(
    "/api/umkm/:id",
    validasiAdmin,
    upload.single("gambar"),
    async (req, res) => {
        try {
            if (!idValid(req.params.id)) {
                return res.status(400).json({
                    pesan: "ID UMKM tidak valid."
                });
            }

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

            if (req.file) {
                dataUpdate.gambar = "/uploads/" + req.file.filename;
            }

            const hasil = await UMKM.findByIdAndUpdate(
                req.params.id,
                dataUpdate,
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!hasil) {
                return res.status(404).json({
                    pesan: "Data UMKM tidak ditemukan."
                });
            }

            res.json({
                pesan: "UMKM berhasil diperbarui!",
                data: hasil
            });

        } catch (error) {
            console.error("EDIT UMKM:", error);

            res.status(400).json({
                pesan: "Gagal memperbarui UMKM.",
                error: error.message
            });
        }
    }
);


// HAPUS UMKM
app.delete(
    "/api/umkm/:id",
    validasiAdmin,
    async (req, res) => {
        try {
            if (!idValid(req.params.id)) {
                return res.status(400).json({
                    pesan: "ID UMKM tidak valid."
                });
            }

            const hasil = await UMKM.findByIdAndDelete(req.params.id);

            if (!hasil) {
                return res.status(404).json({
                    pesan: "Data UMKM tidak ditemukan."
                });
            }

            res.json({
                pesan: "Data UMKM berhasil dihapus!"
            });

        } catch (error) {
            res.status(500).json({
                pesan: "Gagal menghapus data UMKM.",
                error: error.message
            });
        }
    }
);


// ==========================================
// 30. API CERITA KAWASAN
// ==========================================

// GET seluruh cerita
app.get("/api/cerita", async (req, res) => {
    try {
        const daftarCerita = await Cerita.find()
            .sort({ tanggal: -1 });

        res.json(daftarCerita);

    } catch (error) {
        console.error("GET CERITA:", error);

        res.status(500).json({
            pesan: "Gagal mengambil cerita.",
            error: error.message
        });
    }
});


// GET detail cerita
app.get("/api/cerita/:id", async (req, res) => {
    try {
        if (!idValid(req.params.id)) {
            return res.status(400).json({
                pesan: "ID cerita tidak valid."
            });
        }

        const ceritaDetail = await Cerita.findById(req.params.id);

        if (!ceritaDetail) {
            return res.status(404).json({
                pesan: "Cerita tidak ditemukan."
            });
        }

        res.json(ceritaDetail);

    } catch (error) {
        res.status(500).json({
            pesan: "Gagal mengambil detail cerita.",
            error: error.message
        });
    }
});


// TAMBAH cerita
app.post(
    "/api/cerita",
    validasiAdmin,
    upload.single("gambar"),
    async (req, res) => {
        try {
            const imagePath = req.file
                ? "/uploads/" + req.file.filename
                : "";

            const ceritaBaru = new Cerita({
                judul: req.body.judul,
                deskripsi: req.body.deskripsi,
                penulis: req.body.penulis,
                gambar: imagePath
            });

            await ceritaBaru.save();

            res.status(201).json({
                pesan: "Cerita berhasil ditambahkan!"
            });

        } catch (error) {
            console.error("TAMBAH CERITA:", error);

            res.status(400).json({
                pesan: "Gagal menyimpan cerita.",
                error: error.message
            });
        }
    }
);


// EDIT cerita
app.put(
    "/api/cerita/:id",
    validasiAdmin,
    upload.single("gambar"),
    async (req, res) => {
        try {
            if (!idValid(req.params.id)) {
                return res.status(400).json({
                    pesan: "ID cerita tidak valid."
                });
            }

            const dataUpdate = {
                judul: req.body.judul,
                deskripsi: req.body.deskripsi,
                penulis: req.body.penulis
            };

            if (req.file) {
                dataUpdate.gambar = "/uploads/" + req.file.filename;
            }

            const hasil = await Cerita.findByIdAndUpdate(
                req.params.id,
                dataUpdate,
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!hasil) {
                return res.status(404).json({
                    pesan: "Cerita tidak ditemukan."
                });
            }

            res.json({
                pesan: "Cerita berhasil diperbarui!"
            });

        } catch (error) {
            console.error("EDIT CERITA:", error);

            res.status(400).json({
                pesan: "Gagal mengedit cerita.",
                error: error.message
            });
        }
    }
);


// HAPUS cerita
app.delete(
    "/api/cerita/:id",
    validasiAdmin,
    async (req, res) => {
        try {
            if (!idValid(req.params.id)) {
                return res.status(400).json({
                    pesan: "ID cerita tidak valid."
                });
            }

            const hasil = await Cerita.findByIdAndDelete(req.params.id);

            if (!hasil) {
                return res.status(404).json({
                    pesan: "Cerita tidak ditemukan."
                });
            }

            res.json({
                pesan: "Cerita berhasil dihapus."
            });

        } catch (error) {
            res.status(500).json({
                pesan: "Gagal menghapus cerita.",
                error: error.message
            });
        }
    }
);


// ==========================================
// 31. PENANGANAN ERROR UPLOAD
// ==========================================
app.use((error, req, res, next) => {
    console.error("SERVER ERROR:", error);

    if (error instanceof multer.MulterError) {
        return res.status(400).json({
            pesan: "Terjadi masalah saat upload gambar.",
            error: error.message
        });
    }

    if (error) {
        return res.status(400).json({
            pesan: error.message || "Terjadi kesalahan."
        });
    }

    next();
});


// ==========================================
// 32. MENYALAKAN SERVER
// ==========================================
module.exports = app;

if (require.main === module) {
    app.listen(port, () => {
        console.log(
            `Backend server menyala! Buka http://localhost:${port}`
        );
    });
}