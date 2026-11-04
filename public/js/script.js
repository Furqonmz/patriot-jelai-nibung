// ==========================================
// 1. EFEK BAYANGAN NAVBAR SAAT DI-SCROLL
// ==========================================
// Bagian ini akan memberikan efek bayangan (shadow) pada navigasi atas
// saat pengguna melakukan scroll ke bawah lebih dari 50px.
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (nav) {
        if (window.scrollY > 50) {
            nav.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        } else {
            nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    }
});

// ==========================================
// 2. CAROUSEL DESA DI HALAMAN HOME
// ==========================================
// Fungsi ini bertugas menggeser (scroll) daftar kartu desa ke kiri atau kanan
// saat tombol panah carousel ditekan di halaman utama (Home).
function scrollCarousel(direction) {
    const container = document.getElementById('desa-carousel');
    if (container) {
        const scrollAmount = container.clientWidth / 3; 
        container.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    }
}

// ==========================================
// 3. PETA LEAFLET — HALAMAN PROFIL DESA
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    const mapElement = document.getElementById("map");

    // Jangan jalankan peta 5 desa pada halaman Detail Desa.
    if (document.body.classList.contains("detail-desa-page")) return;

    // Pastikan elemen peta dan Leaflet tersedia.
    if (!mapElement || typeof L === "undefined") return;

    // Cegah peta dibuat lebih dari satu kali.
    if (mapElement.dataset.initialized === "true") return;
    mapElement.dataset.initialized = "true";

    const map = L.map(mapElement).setView([-2.9912, 110.7077], 12);

    L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
            attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
            subdomains: "abcd",
            maxZoom: 20
        }
    ).addTo(map);

    const lokasiDesa = [
        {
            nama: "Desa Pulau Nibung",
            lat: -2.8970700201566784,
            lng: 110.85125012346921
        },
        {
            nama: "Desa Sungai Baru",
            lat: -2.9902012839775276,
            lng: 110.85424584969269
        },
        {
            nama: "Desa Sungai Bundung",
            lat: -2.989670241182833,
            lng: 110.88306488952134
        },
        {
            nama: "Desa Sungai Raja",
            lat: -3.04709225914006,
            lng: 110.94008332722463
        },
        {
            nama: "Desa Sungai Damar",
            lat: -3.0548757610171604,
            lng: 111.01853520736358
        }
    ];

    lokasiDesa.forEach(function (desa) {
        L.marker([desa.lat, desa.lng])
            .addTo(map)
            .bindPopup(`<b>${desa.nama}</b><br>Kecamatan Jelai`);
    });
});

// ==========================================
// LOGIN ADMIN
// ==========================================
document.addEventListener("DOMContentLoaded", function() {

    const loginForm = document.getElementById("loginForm");

    // Kalau bukan halaman login, hentikan bagian ini
    if (!loginForm) return;

    loginForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const errorMsg = document.getElementById("errorMsg");

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const result = await response.json();

            if (response.ok) {

                // Simpan status admin
                localStorage.setItem("isAdmin", "true");

                alert("Login Berhasil!");

                // Kembali ke halaman utama
                window.location.href = "index.html";

            } else {

                errorMsg.textContent =
                    result.pesan || "Login gagal!";

            }

        } catch (err) {

            console.error(err);

            errorMsg.textContent =
                "Terjadi kesalahan pada server.";

        }
    });

});

// ==========================================
// 4. KONTROL ADMIN (MENU HAMBURGER MELAYANG)
// ==========================================
// Membuat ikon garis tiga di pojok kanan bawah yang bisa ditekan.
// Menampilkan tombol "Logout" jika sudah login, atau "Login" jika belum.
document.addEventListener("DOMContentLoaded", function() {
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    const floatBtn = document.createElement("div");
    floatBtn.innerHTML = `<i class="fa-solid fa-bars"></i>`;
    floatBtn.style.cssText = `position: fixed; bottom: 25px; right: 25px; width: 50px; height: 50px; background: #222; color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 15px rgba(0,0,0,0.3); cursor: pointer; z-index: 99999; font-size: 20px; transition: transform 0.2s;`;
    
    const menuPopup = document.createElement("div");
    menuPopup.style.cssText = `position: fixed; bottom: 85px; right: 25px; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 5px 20px rgba(0,0,0,0.2); z-index: 99999; display: none; width: 170px;`;

    // Isi Konten Menu Admin (Tergantung Status Login)
    if (isAdmin) {
        menuPopup.innerHTML = `
            <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: bold; color: #28a745; text-align: center;">🛡️ Admin Aktif</p>
            <button id="floatLogout" style="width: 100%; background: #dc3545; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 13px;"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
        `;
    } else {
        menuPopup.innerHTML = `
            <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: bold; text-align: center;">Menu Admin</p>
            <a href="login.html" style="display: block; text-align: center; background: #007bff; color: white; text-decoration: none; padding: 8px; border-radius: 4px; font-weight: bold; font-size: 13px;"><i class="fa-solid fa-right-to-bracket"></i> Login</a>
        `;
    }

    document.body.appendChild(floatBtn);
    document.body.appendChild(menuPopup);

    // Event saat tombol melayang diklik
    floatBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        menuPopup.style.display = menuPopup.style.display === "none" ? "block" : "none";
    });

    // Menutup menu jika klik di luar
    document.addEventListener("click", (e) => {
        if (!menuPopup.contains(e.target) && e.target !== floatBtn) menuPopup.style.display = "none";
    });

    // Event Logout Global
    const tombolLogout = document.getElementById("floatLogout");

    if (tombolLogout) {
        tombolLogout.addEventListener("click", async () => {
            try {
                const response = await fetch("/api/logout", {
                    method: "POST",
                    credentials: "same-origin",
                    cache: "no-store"
                });

                if (!response.ok) {
                    throw new Error("Gagal mengakhiri sesi admin.");
                }

                // Hapus status admin di browser
                localStorage.removeItem("isAdmin");

                alert("Berhasil logout!");

                // Muat ulang halaman agar seluruh tombol CRUD hilang
                window.location.reload();

            } catch (error) {
                console.error("Logout error:", error);
                alert("Logout gagal. Silakan coba kembali.");
            }
        });
    }
});

// ==========================================
// 5. FITUR CRUD HALAMAN UMKM (TAMPIL, TAMBAH, EDIT, HAPUS)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const containerUMKM = document.querySelector('.umkm-grid');
    if (!containerUMKM) return; 

    const isAdmin = localStorage.getItem("isAdmin") === "true";
    let editMode = false; 
    let idEdit = null;    
    let dataUmkmGlobal = []; // Menyimpan data sementara agar aman saat diedit

    const adminContainer = document.getElementById('admin-umkm-container');
    if (isAdmin && adminContainer) adminContainer.style.display = "block";

    const formModal = document.getElementById('form-umkm-modal');
    const form = document.getElementById('formTambahUMKM');
    const modalTitle = document.getElementById('modal-title');

    document.getElementById('btnBukaForm')?.addEventListener('click', () => {
        editMode = false; 
        form.reset();
        if(modalTitle) modalTitle.innerText = "Form Tambah UMKM Baru";
        formModal.style.display = "block";
    });

    document.getElementById('btnBatal')?.addEventListener('click', () => {
        formModal.style.display = "none";
    });

    function loadUMKM() {
        fetch('/api/umkm')
            .then(res => res.json())
            .then(data => {
                dataUmkmGlobal = data; // Simpan ke variabel global
                containerUMKM.innerHTML = ''; 
                
                data.forEach(umkm => {
                    const id = umkm._id || umkm.id;
                    const card = document.createElement('a');
                    card.href = `detail-umkm.html?id=${id}`;
                    card.className = 'umkm-card';
                    card.style.position = 'relative'; 

                    let actionButtons = '';
                    if (isAdmin) {
                        actionButtons = `
                            <div style="position: absolute; top: 10px; right: 10px; z-index: 10; display: flex; gap: 5px;">
                                <button type="button" onclick="event.preventDefault(); editUMKM('${id}')" style="background: orange; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px; font-weight: bold;">Edit</button>
                                <button type="button" onclick="event.preventDefault(); hapusUMKM('${id}')" style="background: red; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px; font-weight: bold;">Hapus</button>
                            </div>
                        `;
                    }

                    card.innerHTML = `
                        ${actionButtons}
                        <img src="${umkm.gambar}" class="umkm-img" alt="${umkm.nama}">
                        <div class="umkm-info">
                            <h4 style="margin-bottom: 5px;">${umkm.nama}</h4>
                            <p style="font-weight: 600; color: #555; font-size: 14px; margin-bottom: 5px;">${umkm.produk}</p>
                            <p><i class="fa-solid fa-location-dot" style="color: var(--secondary-blue);"></i> ${umkm.desa}</p>
                        </div>
                    `;
                    containerUMKM.appendChild(card);
                });
            });
    }

    loadUMKM(); 

    window.hapusUMKM = async (id) => {
        if (!confirm("Yakin ingin menghapus UMKM ini? Data yang terhapus tidak dapat dikembalikan.")) return;
        try {
            const res = await fetch(`/api/umkm/${id}`, { method: 'DELETE' });
            if (res.ok) {
                alert("Berhasil dihapus!");
                loadUMKM(); 
            }
        } catch (err) { alert("Error menghapus data"); }
    };

    window.editUMKM = (id) => {
        const umkmTarget = dataUmkmGlobal.find(u => (u._id || u.id) === id);
        if (!umkmTarget) return;

        editMode = true; 
        idEdit = id;
        document.getElementById('inputNama').value = umkmTarget.nama || '';
        document.getElementById('inputPemilik').value = umkmTarget.pemilik || '';
        document.getElementById('inputDesa').value = umkmTarget.desa || '';
        document.getElementById('inputProduk').value = umkmTarget.produk || '';
        document.getElementById('inputHarga').value = umkmTarget.harga || '';
        document.getElementById('inputLokasi').value = umkmTarget.lokasi || '';
        document.getElementById('inputKontak').value = umkmTarget.kontak || '';
        document.getElementById('inputDeskripsi').value = umkmTarget.deskripsi || '';
        
        const inputGambar = document.getElementById('inputGambar');
        if (inputGambar) inputGambar.value = "";

        if(modalTitle) modalTitle.innerText = "Form Edit Data UMKM";
        formModal.style.display = "block"; 
        window.scrollTo(0, 0); 
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('nama', document.getElementById('inputNama').value);
        formData.append('pemilik', document.getElementById('inputPemilik').value);
        formData.append('desa', document.getElementById('inputDesa').value);
        formData.append('produk', document.getElementById('inputProduk').value);
        formData.append('harga', document.getElementById('inputHarga').value);
        formData.append('lokasi', document.getElementById('inputLokasi').value);
        formData.append('kontak', document.getElementById('inputKontak').value);
        formData.append('deskripsi', document.getElementById('inputDeskripsi').value);

        const fileInput = document.getElementById('inputGambar');
        if (fileInput.files.length > 0) {
            formData.append('gambar', fileInput.files[0]);
        }

        const url = editMode ? `/api/umkm/${idEdit}` : '/api/umkm';
        const method = editMode ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                body: formData
            });

            if (res.ok) {
                alert(editMode ? "Data UMKM berhasil diperbarui!" : "Data UMKM berhasil ditambahkan!");
                formModal.style.display = "none";
                form.reset();
                loadUMKM(); 
            } else {
                alert("Gagal menyimpan data ke server.");
            }
        } catch (err) { alert("Server error saat menyimpan data."); }
    });
});

// Konsep kerjanya sama persis dengan UMKM, namun menargetkan elemen cerita-grid
// ==========================================
// 6. FITUR CRUD HALAMAN CERITA KAWASAN
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const containerCerita = document.getElementById('wadah-cerita') || document.querySelector('.cerita-grid');
    if (!containerCerita) return; 

    const isAdmin = localStorage.getItem("isAdmin") === "true";
    let editMode = false;
    let idEdit = null;
    let dataCeritaGlobal = []; // Menyimpan data sementara agar aman saat diedit

    // A. Tampilkan kontrol admin
    const adminContainer = document.getElementById('admin-cerita-container');
    if (isAdmin && adminContainer) adminContainer.style.display = "block";

    const formModal = document.getElementById('form-cerita-modal');
    const form = document.getElementById('formTambahCerita');
    const modalTitle = document.getElementById('modal-cerita-title');

    document.getElementById('btnBukaFormCerita')?.addEventListener('click', () => {
        editMode = false;
        form.reset();
        if(modalTitle) modalTitle.innerText = "Tambah Cerita Baru";
        formModal.style.display = "block";
    });
    
    document.getElementById('btnBatalCerita')?.addEventListener('click', () => formModal.style.display = "none");

    // B. Load Cerita
    function loadCerita() {
        fetch('/api/cerita')
            .then(res => res.json())
            .then(data => {
                dataCeritaGlobal = data; // Simpan ke variabel global
                containerCerita.innerHTML = '';
                
                data.forEach(cerita => {
                    const idCerita = cerita._id || cerita.id;
                    const card = document.createElement('article');
                    card.className = 'news-item';
                    card.style.position = 'relative';
                    
                    let actionButtons = '';
                    if (isAdmin) {
                        // Tombol edit kini hanya memanggil ID, sangat aman dari error teks panjang!
                        actionButtons = `
                            <div style="position: absolute; top: 15px; right: 15px; z-index: 10; display: flex; gap: 8px;">
                                <button onclick="editCerita('${idCerita}')" style="background: #ffc107; color: #000; border: none; padding: 6px 12px; cursor: pointer; border-radius: 4px; font-weight: 600; box-shadow: 0 2px 5px rgba(0,0,0,0.2);"><i class="fa-solid fa-pen"></i> Edit</button>
                                <button onclick="hapusCerita('${idCerita}')" style="background: #dc3545; color: white; border: none; padding: 6px 12px; cursor: pointer; border-radius: 4px; font-weight: 600; box-shadow: 0 2px 5px rgba(0,0,0,0.2);"><i class="fa-solid fa-trash"></i> Hapus</button>
                            </div>
                        `;
                    }

                    const dateObj = new Date(cerita.tanggal);
                    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                    const tanggalFormatted = dateObj.toLocaleDateString('id-ID', options);
                    
                    const namaPenulis = cerita.penulis ? cerita.penulis: "admin/Tim Ekspedisi";

                    card.innerHTML = `
                        ${actionButtons}
                        <div class="news-img">
                            <img src="${cerita.gambar}" alt="${cerita.judul}">
                        </div>
                        <div class="news-content">
                            <a href="detail-cerita.html?id=${idCerita}"><h2 class="news-title">${cerita.judul}</h2></a>
                            <div class="news-meta" style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                                <span><i class="fa-solid fa-user-pen"></i> Penulis: ${namaPenulis}</span>
                                <span><i class="fa-regular fa-calendar"></i> ${tanggalFormatted}</span>
                            </div>
                            <p class="news-excerpt">${cerita.deskripsi.substring(0, 150)}...</p>
                            <a href="detail-cerita.html?id=${idCerita}" class="read-more">Baca Selengkapnya <i class="fa-solid fa-arrow-right"></i></a>
                        </div>
                    `;
                    containerCerita.appendChild(card);
                });
            });
    }
    loadCerita();

    // C. Hapus Cerita
    window.hapusCerita = async (id) => {
        if (!confirm("Hapus cerita ini secara permanen?")) return;
        await fetch(`/api/cerita/${id}`, { method: 'DELETE' });
        loadCerita();
    };

    // D. Edit Cerita (Mencari data dari array berdasarkan ID)
    window.editCerita = (id) => {
        const ceritaTarget = dataCeritaGlobal.find(c => (c._id || c.id) === id);
        if (!ceritaTarget) return;

        editMode = true;
        idEdit = id;
        document.getElementById('inputJudul').value = ceritaTarget.judul;
        document.getElementById('inputDeskripsi').value = ceritaTarget.deskripsi;

        // Memasukan nama penulis lama ke form saat mode edit
        const inputPenulis = document.getElementById('inputPenulis');
        if (inputPenulis) inputPenulis.value = ceritaTarget.penulis || "";

        // KOSONGKAN INPUT FILE, jangan diisi dengan ceritaTarget.gambar
        const InputGambarCerita = document.getElementById('inputGambarCerita');
        if (InputGambarCerita) InputGambarCerita.value = "";
        
        if(modalTitle) modalTitle.innerText = "Edit Cerita Kawasan";
        formModal.style.display = "block";
        window.scrollTo(0, 0);
    };

    // E. Submit Form (Tambah / Edit)
    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append('judul', document.getElementById('inputJudul').value);
            formData.append('deskripsi', document.getElementById('inputDeskripsi').value);

            const inputPenulis = document.getElementById('inputPenulis');
            if (inputPenulis) {
                formData.append('penulis', inputPenulis.value);
            }

            const fileInputCerita = document.getElementById('inputGambarCerita');
            if (fileInputCerita.files.length > 0) {
                formData.append('gambar', fileInputCerita.files[0]);
            }
            
            const url = editMode ? `/api/cerita/${idEdit}` : '/api/cerita';
            const method = editMode ? 'PUT' : 'POST';

            try {
                const res = await fetch(url, { method, body: formData });
                if (res.ok) {
                    alert(editMode ? "Cerita berhasil diperbarui!" : "Cerita berhasil ditambahkan!");
                    formModal.style.display = "none";
                    loadCerita();
                } else {
                    alert("Gagal menyimpan data.");
                }
            } catch(err) {
                alert("Terjadi kesalahan server.");
            }
        });
    }
});

// ==========================================
// 7. DETAIL CERITA KAWASAN
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    // Memastikan skrip ini hanya berjalan jika kita sedang berada di halaman detail-cerita
    const detailJudul = document.getElementById('detailJudul');
    
    if (detailJudul) {
        // Mengambil ID cerita dari URL (contoh: ?id=64abc123...)
        const urlParams = new URLSearchParams(window.location.search);
        const idCerita = urlParams.get('id');

        if (idCerita) {
            // Minta data spesifik ke backend menggunakan ID tersebut
            fetch(`/api/cerita/${idCerita}`)
                .then(res => {
                    if (!res.ok) throw new Error("Gagal mengambil data");
                    return res.json();
                })
                .then(cerita => {
                    // 1. Masukkan Judul
                    detailJudul.innerText = cerita.judul;
                    
                    // 2. Masukkan Penulis
                    const namaPenulis = cerita.penulis ? cerita.penulis : "Admin/Tim Ekspedisi";
                    document.getElementById('detailPenulis').innerHTML = `<i class="fa-solid fa-pen-nib"></i> Penulis : ${namaPenulis}`;
                    
                    // 3. Masukkan Tanggal
                    const dateObj = new Date(cerita.tanggal);
                    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                    document.getElementById('detailTanggal').innerHTML = `<i class="fa-regular fa-calendar-days"></i> ${dateObj.toLocaleDateString('id-ID', options)}`;
                    
                    // 4. Masukkan Gambar (Menimpa teks loading dengan tag gambar)
                    const galeri = document.getElementById('detailGaleri');
                    if (galeri) {
                        galeri.innerHTML = `<img src="${cerita.gambar}" alt="${cerita.judul}" style="width: 100%; max-height: 500px; object-fit: cover; border-radius: 8px;">`;
                    }

                    // 5. Masukkan Isi Cerita (Mengubah Enter menjadi Paragraf baru agar rapi)
                    const formatParagraf = cerita.deskripsi
                        .split('\n')
                        .filter(p => p.trim() !== '') // Hilangkan baris kosong
                        .map(p => `<p>${p}</p>`)
                        .join('');
                        
                    document.getElementById('detailKonten').innerHTML = formatParagraf;

                    // Tambahkan baris ini di dalam fungsi fetch detail UMKM / Cerita kamu:
                    const breadcrumbNama = document.getElementById('breadcrumbNama');
                    if (breadcrumbNama) {
                        breadcrumbNama.innerText = cerita.judul; // Atau variabel judul/nama yang sesuai
                    }
                })
                .catch(err => {
                    console.error(err);
                    detailJudul.innerText = "Cerita Tidak Ditemukan";
                    document.getElementById('detailKonten').innerHTML = "<p style='color:red;'>Terjadi kesalahan saat memuat cerita dari server.</p>";
                });
        } else {
            detailJudul.innerText = "Berita tidak valid";
        }
    }
});

// ==========================================
// 8. DETAIL UMKM
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const detailNamaUMKM = document.getElementById('detailNamaUMKM');
    
    if (detailNamaUMKM) {
        const urlParams = new URLSearchParams(window.location.search);
        const idUmkm = urlParams.get('id');

        if (idUmkm) {
            fetch(`/api/umkm/${idUmkm}`)
                .then(res => {
                    if (!res.ok) throw new Error("Gagal mengambil data");
                    return res.json();
                })
                .then(umkm => {
                    // Masukkan Teks
                    detailNamaUMKM.innerText = umkm.nama;
                    document.getElementById('detailPemilik').innerText = `: ${umkm.pemilik}`;
                    document.getElementById('detailDesa').innerText = `: ${umkm.desa}`;
                    document.getElementById('detailProduk').innerText = `: ${umkm.produk}`;
                    document.getElementById('detailHarga').innerText = `: ${umkm.harga}`;
                    document.getElementById('detailLokasi').innerText = `: ${umkm.lokasi}`;
                    
                    // Logika Membersihkan Nomor WA (mengubah awalan 0 menjadi 62)
                    let noWa = umkm.kontak ? umkm.kontak.replace(/[^0-9]/g, '') : ''; 
                    if (noWa.startsWith('0')) {
                        noWa = '62' + noWa.substring(1);
                    }
                    document.getElementById('detailKontak').href = `https://wa.me/${noWa}`;

                    // Masukkan Gambar (ID disesuaikan menjadi detailGambarUMKM)
                    const imgEl = document.getElementById('detailGambarUMKM');
                    if (imgEl) {
                        imgEl.src = umkm.gambar;
                        imgEl.style.display = "block"; // Tampilkan setelah data terisi
                    }

                    // Masukkan Deskripsi (ID disesuaikan menjadi detailDeskripsiUMKM)
                    const formatDesc = umkm.deskripsi
                        ? umkm.deskripsi.split('\n')
                            .filter(p => p.trim() !== '')
                            .map(p => `<p style="margin-bottom: 10px;">${p}</p>`)
                            .join('')
                        : '';
                    const descEl = document.getElementById('detailDeskripsiUMKM');
                    if (descEl) {
                        descEl.innerHTML = formatDesc;
                    }
                    // Tambahkan baris ini di dalam fungsi fetch detail UMKM / Cerita kamu:
                    const breadcrumbNama = document.getElementById('breadcrumbNama');
                    if (breadcrumbNama) {
                        breadcrumbNama.innerText = umkm.nama; // Atau variabel judul/nama yang sesuai
                    }
                })
                .catch(err => {
                    console.error(err);
                    detailNamaUMKM.innerText = "Data UMKM Tidak Ditemukan";
                    const descEl = document.getElementById('detailDeskripsiUMKM');
                    if (descEl) {
                        descEl.innerHTML = "<p style='color:red;'>Terjadi kesalahan saat memuat data dari server.</p>";
                    }
                });
        } else {
            detailNamaUMKM.innerText = "URL tidak valid";
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {

    // HEADER GLOBAL — SEMUA HALAMAN
    const topbar = document.querySelector(".site-topbar");
    const navbar = document.querySelector(".site-navbar");

    function updateHeader() {
        if (!topbar || !navbar) return;

        if (window.scrollY > 50) {
            topbar.classList.add("hide-topbar");
            navbar.style.top = "0";
        } else {
            topbar.classList.remove("hide-topbar");
            navbar.style.top = "";
        }
    }

    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();

    // NAVBAR MOBILE — SEMUA HALAMAN
    // Gunakan tombol hamburger anak langsung navbar agar tidak bentrok
    // dengan markup lama yang menempatkan ikon di dalam nav-links.
    const hamburger = document.querySelector(".site-navbar > .hamburger");
    const navLinks = document.querySelector(".site-navbar > .nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", function () {
            const isOpen = navLinks.classList.toggle("active");
            hamburger.setAttribute("aria-expanded", String(isOpen));

            const icon = hamburger.querySelector("i");
            if (icon) {
                icon.classList.toggle("fa-bars", !isOpen);
                icon.classList.toggle("fa-xmark", isOpen);
            }
        });

        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navLinks.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");

                const icon = hamburger.querySelector("i");
                if (icon) {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            });
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 768) {
                navLinks.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");

                const icon = hamburger.querySelector("i");
                if (icon) {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            }
        });
    }

    // POPUP TEP — KHUSUS HALAMAN YANG MEMILIKI POPUP
    const modal = document.getElementById("tepInfoModal");

    if (modal) {
        const openButtons = document.querySelectorAll("[data-open-tep-modal]");
        const closeButtons = modal.querySelectorAll("[data-close-tep-modal]");
        let lastFocusedElement = null;

        function openModal() {
            lastFocusedElement = document.activeElement;
            modal.classList.add("is-open");
            modal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";

            const closeButton = modal.querySelector(".tep-modal-close");
            if (closeButton) closeButton.focus();
        }

        function closeModal() {
            modal.classList.remove("is-open");
            modal.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "";

            if (lastFocusedElement) lastFocusedElement.focus();
        }

        openButtons.forEach(button =>
            button.addEventListener("click", openModal)
        );

        closeButtons.forEach(button =>
            button.addEventListener("click", closeModal)
        );

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && modal.classList.contains("is-open")) {
                closeModal();
            }
        });
    }
});


// ==========================================
// 9. DETAIL DESA — IDENTITAS, PROFIL,
// DATA DESA, DEMOGRAFI, DAN DOKUMENTASI
// ==========================================
document.addEventListener("DOMContentLoaded", async function () {
    if (!document.body.classList.contains("detail-desa-page")) return;

    const slug = new URLSearchParams(location.search).get("desa");
    if (!slug) return;

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => root.querySelectorAll(selector);

    let desa = {};
    let profil = {};
    let konten = {
        organigram: {
            anggota: []
        }
    };

    let demografi = {};
    let daftarDemografi = [];
    let tahunDemografiAktif = null;
    let galeri = [];
    let adminAktif = false;
    let map = null;

    const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;",
        '"': "&quot;", "'": "&#039;"
    })[c]);

    const angka = value =>
        value == null || value === ""
            ? "Belum diisi"
            : Number(value).toLocaleString("id-ID");

    async function api(url, options = {}) {
        const response = await fetch(url, options);
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(result.pesan || "Gagal memproses data.");
        }

        return result;
    }

    // CEK LOGIN ADMIN DARI SERVER
    try {
        const response = await fetch("/api/admin/status", {
            method: "GET",
            credentials: "same-origin",
            cache: "no-store"
        });

        adminAktif = response.ok;

    } catch (error) {
        adminAktif = false;
    }

    // MODAL FORM ADMIN
    const modal = document.createElement("div");
    modal.id = "modal-kelola-desa";
    modal.innerHTML = `
        <div class="kelola-modal-overlay">
            <div class="kelola-modal-box">
                <button type="button" class="kelola-modal-close">&times;</button>
                <h2 id="kelola-modal-title"></h2>
                <form id="kelola-desa-form">
                    <div id="kelola-form-fields"></div>
                    <div class="kelola-form-actions">
                        <button type="button" id="kelola-batal">Batal</button>
                        <button type="submit" id="kelola-simpan">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const form = $("#kelola-desa-form");
    const fields = $("#kelola-form-fields");

    function tutupModal() {
        modal.style.display = "none";
        form.reset();
    }

    $(".kelola-modal-close").onclick = tutupModal;
    $("#kelola-batal").onclick = tutupModal;

        function bukaForm(judul, daftarField, callback) {
        // Mengatur judul modal
        $("#kelola-modal-title").textContent = judul;

        // Mengosongkan field sebelumnya
        fields.innerHTML = "";

        // Membuat setiap field berdasarkan konfigurasi
        daftarField.forEach(field => {
            const wrapper = document.createElement("div");
            wrapper.className = "kelola-field";

            const label = document.createElement("label");
            label.textContent = field.label;

            let input;

            // Membuat textarea
            if (field.type === "textarea") {
                input = document.createElement("textarea");

            // Membuat dropdown select
            } else if (field.type === "select") {
                input = document.createElement("select");

                (field.options || []).forEach(option => {
                    const pilihan = document.createElement("option");

                    pilihan.value = option.value;
                    pilihan.textContent = option.label;

                    input.appendChild(pilihan);
                });

            // Membuat input biasa
            } else {
                input = document.createElement("input");
                input.type = field.type || "text";
            }

            // Pengaturan umum setiap field
            input.name = field.name;
            input.value = field.value ?? "";
            input.required = Boolean(field.required);
            input.placeholder = field.placeholder || "";
            input.readOnly = Boolean(field.readOnly);

            // Pengaturan khusus input angka
            if (field.type === "number") {
                input.step = field.step || "any";
            }

            // Pengaturan khusus textarea
            if (field.type === "textarea") {
                input.rows = field.rows || 4;
            }

            // Pengaturan khusus input file
            if (field.type === "file") {
                input.accept = "image/*";
            }

            // Memasukkan label dan input ke dalam wrapper
            wrapper.append(label, input);
            fields.appendChild(wrapper);
        });

        // Menampilkan modal setelah seluruh field dibuat
        modal.style.display = "flex";

        // Mengatur proses ketika form disubmit
        form.onsubmit = async event => {
            event.preventDefault();

            const button = $("#kelola-simpan");

            button.disabled = true;
            button.textContent = "Menyimpan...";

            try {
                // Mengirim seluruh data form ke callback
                await callback(new FormData(form));

                // Menutup modal setelah berhasil
                tutupModal();

                // Memuat ulang konten desa
                await muatKonten();

            } catch (error) {
                alert(error.message);

            } finally {
                // Mengembalikan tombol ke kondisi semula
                button.disabled = false;
                button.textContent = "Simpan";
            }
        };
    }

    // MEMUAT DATA DARI DATABASE
    async function muatKonten() {
        const result = await api(
            `/api/desa/${encodeURIComponent(slug)}/konten`
        );

        desa = result.data.desa || {};
        profil = result.data.profil || {};
        galeri = result.data.galeri || [];

        konten.organigram = result.data.organigram || {
            anggota: []
        };

        // Ambil seluruh riwayat demografi
        const riwayat = await api(
            `/api/desa/${desa._id}/demografi`
        );

        daftarDemografi = riwayat.data || [];

        // Pertahankan tahun yang sedang dipilih jika masih tersedia
        const tahunTersedia = daftarDemografi.some(
            item => item.tahun === tahunDemografiAktif
        );

        if (!tahunTersedia) {
            tahunDemografiAktif = daftarDemografi.length
                ? daftarDemografi[0].tahun
                : null;
        }

        demografi = daftarDemografi.find(
            item => item.tahun === tahunDemografiAktif
        ) || {};

        tampilkanIdentitas();
        tampilkanProfil();
        tampilkanDataDesa();
        tampilkanDemografi();
        tampilkanGaleri();
        tampilkanPeta();
        tampilkanOrganisasi();
        tampilkanTombolAdmin();
    }

    // IDENTITAS DESA
    function tampilkanIdentitas() {
        const nama = desa.namaDesa || "Nama Desa";

        if ($("#desa-nama")) $("#desa-nama").textContent = nama;
        if ($("#breadcrumb-desa")) $("#breadcrumb-desa").textContent = nama;

        document.title = `${nama} | KT Jelai-Nibung`;

        $$('[data-field="ringkasanHero"]').forEach(el => {
            el.textContent = profil.ringkasan || "Deskripsi singkat belum diisi.";
        });
        $$('[data-field="komoditasUtama"]').forEach(el => {
            el.textContent = profil.komoditasUtama || "Belum diisi";
        });
        $$('[data-field="karakterKawasan"]').forEach(el => {
            el.textContent = profil.karakterKawasan || "Belum diisi";
        });
        $$('[data-field="namaDesa"]').forEach(el => el.textContent = nama);
        $$('[data-field="kecamatan"]').forEach(el => el.textContent = desa.kecamatan || "—");
        $$('[data-field="kabupaten"]').forEach(el => el.textContent = desa.kabupaten || "—");
    }

    // SEKILAS DESA
    function tampilkanProfil() {
        const el = $("#desa-deskripsi");

        if (el) {
            el.textContent = profil.deskripsi || "Deskripsi desa belum diisi.";
        }
    }

    // DATA DESA
    function tampilkanDataDesa() {
        const koordinat = profil.koordinat || {};

        const data = {
            jumlahPenduduk: angka(profil.jumlahPenduduk),
            jumlahKK: angka(profil.jumlahKK),
            luasWilayah: profil.luasWilayah || "Belum diisi",
            koordinat: koordinat.latitude != null && koordinat.longitude != null
                ? `${koordinat.latitude}, ${koordinat.longitude}`
                : "Belum diisi",
            akses: profil.akses || "Belum diisi"
        };

        Object.entries(data).forEach(([key, value]) => {
            $$(`[data-field="${key}"]`).forEach(el => {
                el.textContent = value;
            });
        });
    }

    // FORM PROFIL DAN DATA DESA
    // ==========================================
    // FORM CRUD PROFIL DESA
    // ==========================================
    function formProfil() {
        const koordinat = profil.koordinat || {};

        bukaForm("Kelola Profil Desa", [
            {
                label: "Deskripsi Singkat Desa",
                name: "ringkasan",
                type: "textarea",
                rows: 3,
                value: profil.ringkasan || ""
            },
            {
                label: "Sekilas Desa",
                name: "deskripsi",
                type: "textarea",
                rows: 7,
                value: profil.deskripsi || ""
            },
            {
                label: "Komoditas Utama",
                name: "komoditasUtama",
                value: profil.komoditasUtama || ""
            },
            {
                label: "Karakter Kawasan",
                name: "karakterKawasan",
                type: "textarea",
                rows: 3,
                value: profil.karakterKawasan || ""
            },
            {
                label: "Jumlah Penduduk",
                name: "jumlahPenduduk",
                type: "number",
                value: profil.jumlahPenduduk ?? ""
            },
            {
                label: "Jumlah Kepala Keluarga (KK)",
                name: "jumlahKK",
                type: "number",
                value: profil.jumlahKK ?? ""
            },
            {
                label: "Luas Wilayah",
                name: "luasWilayah",
                value: profil.luasWilayah || ""
            },
            {
                label: "Latitude",
                name: "latitude",
                type: "number",
                step: "any",
                value: koordinat.latitude ?? ""
            },
            {
                label: "Longitude",
                name: "longitude",
                type: "number",
                step: "any",
                value: koordinat.longitude ?? ""
            },
            {
                label: "Akses Menuju Desa",
                name: "akses",
                type: "textarea",
                rows: 4,
                value: profil.akses || ""
            }
        ], async data => {

            const latitude = data.get("latitude").trim();
            const longitude = data.get("longitude").trim();

            const payload = {
                ringkasan: data.get("ringkasan"),
                deskripsi: data.get("deskripsi"),
                komoditasUtama: data.get("komoditasUtama"),
                karakterKawasan: data.get("karakterKawasan"),
                jumlahPenduduk: Number(data.get("jumlahPenduduk") || 0),
                jumlahKK: Number(data.get("jumlahKK") || 0),
                luasWilayah: data.get("luasWilayah"),
                latitude: latitude === "" ? null : Number(latitude),
                longitude: longitude === "" ? null : Number(longitude),
                akses: data.get("akses")
            };

            if (
                (latitude !== "" && !Number.isFinite(payload.latitude)) ||
                (longitude !== "" && !Number.isFinite(payload.longitude))
            ) {
                throw new Error("Latitude dan longitude harus berupa angka desimal yang valid.");
            }

            await api(`/api/desa/${desa._id}/profil`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            alert("Profil desa berhasil disimpan!");
        });
    }

    // DEMOGRAFI
    function formatKategori(items) {
        return (Array.isArray(items) ? items : [])
            .map(item => `${item.kategori}: ${item.jumlah}`)
            .join("\n");
    }

    function parseKategori(value) {
        return String(value || "").split("\n")
            .map(row => row.trim())
            .filter(Boolean)
            .map(row => {
                const index = row.lastIndexOf(":");

                if (index < 1) {
                    throw new Error("Gunakan format Kategori: Jumlah pada setiap baris.");
                }

                return {
                    kategori: row.slice(0, index).trim(),
                    jumlah: Number(row.slice(index + 1).trim())
                };
            });
    }

    function tampilkanDemografi() {
        const layout = $(".demography-layout");
        if (!layout) return;

        const panel1 = $(".panel:first-child", layout);
        const panel2 = $(".panel:nth-child(2)", layout);

        // ======================================
        // PILIHAN TAHUN DEMOGRAFI
        // ======================================
        let toolbar = $("#demografi-toolbar");

        if (!toolbar) {
            toolbar = document.createElement("div");
            toolbar.id = "demografi-toolbar";
            toolbar.className = "demografi-toolbar";
            layout.parentNode.insertBefore(toolbar, layout);
        }

        toolbar.innerHTML = `
            <div class="demografi-year-select">
                <label for="pilih-tahun-demografi">
                    Tahun Data
                </label>

                <select id="pilih-tahun-demografi">
                    ${
                        daftarDemografi.length
                            ? daftarDemografi.map(item => `
                                <option value="${item.tahun}"
                                    ${item.tahun === tahunDemografiAktif ? "selected" : ""}>
                                    ${item.tahun}
                                </option>
                            `).join("")
                            : `<option value="">Belum ada data</option>`
                    }
                </select>
            </div>

            ${
                adminAktif
                    ? `
                        <div class="demografi-admin-actions">
                            <button type="button" id="btn-tambah-demografi">
                                <i class="fa-solid fa-plus"></i> Tambah Tahun
                            </button>

                            <button type="button" id="btn-edit-demografi"
                                ${!daftarDemografi.length ? "disabled" : ""}>
                                <i class="fa-solid fa-pen"></i> Edit
                            </button>

                            <button type="button" id="btn-hapus-demografi"
                                ${!daftarDemografi.length ? "disabled" : ""}>
                                <i class="fa-solid fa-trash"></i> Hapus
                            </button>
                        </div>
                    `
                    : ""
            }
        `;

        // Ganti tahun yang ditampilkan
        $("#pilih-tahun-demografi").addEventListener("change", function () {
            tahunDemografiAktif = this.value
                ? Number(this.value)
                : null;

            demografi = daftarDemografi.find(
                item => item.tahun === tahunDemografiAktif
            ) || {};

            tampilkanDemografi();
        });

        // Tombol admin
        if (adminAktif) {
            $("#btn-tambah-demografi").onclick = () => {
                formDemografi("tambah");
            };

            $("#btn-edit-demografi").onclick = () => {
                formDemografi("edit");
            };

            $("#btn-hapus-demografi").onclick = hapusDemografi;
        }

        // ======================================
        // DATA KOMPOSISI PENDUDUK
        // ======================================
        if (panel1) {
            const rows = panel1.querySelectorAll(".stat-line");

            const values = [
                angka(demografi.jumlahPenduduk),
                angka(demografi.lakiLaki),
                angka(demografi.perempuan),
                angka(demografi.jumlahKK),
                demografi.jumlahDusunRT || "Belum diisi"
            ];

            rows.forEach((row, index) => {
                const strong = $("strong", row);

                if (strong && values[index] !== undefined) {
                    strong.textContent = values[index];
                }
            });

            const note = $(".data-note", panel1);

            if (note) {
                note.textContent = `Tahun data: ${demografi.tahun || "Belum diisi"}`;
            }
        }

        // ======================================
        // KARAKTERISTIK PENDUDUK
        // ======================================
        if (panel2) {
            const list = $(".stat-list", panel2) || panel2;

            const items = [
                ["Kelompok usia", demografi.kelompokUsia],
                ["Pendidikan terakhir", demografi.pendidikan],
                ["Mata pencaharian utama", demografi.pekerjaan]
            ];

            list.innerHTML = items.map(([label, values]) => `
                <div class="stat-line">
                    <span>${label}</span>
                    <strong>
                        ${
                            Array.isArray(values) && values.length
                                ? values.map(item =>
                                    `${esc(item.kategori)} (${angka(item.jumlah)})`
                                ).join(", ")
                                : "Belum diisi"
                        }
                    </strong>
                </div>
            `).join("") + `
                <div class="stat-line">
                    <span>Jumlah penduduk usia produktif</span>
                    <strong>${angka(demografi.usiaProduktif)}</strong>
                </div>
            `;
        }
    }

    function formDemografi(mode = "tambah") {
    const editMode = mode === "edit";
    const d = editMode ? demografi : {};

    bukaForm(
            editMode ? "Edit Data Demografi" : "Tambah Data Demografi",
            [
                {
                    label: "Tahun Data",
                    name: "tahun",
                    type: "number",
                    value: d.tahun || new Date().getFullYear(),
                    required: true,
                    readOnly: editMode
                },
                {
                    label: "Total Penduduk",
                    name: "jumlahPenduduk",
                    type: "number",
                    value: d.jumlahPenduduk ?? ""
                },
                {
                    label: "Laki-laki",
                    name: "lakiLaki",
                    type: "number",
                    value: d.lakiLaki ?? ""
                },
                {
                    label: "Perempuan",
                    name: "perempuan",
                    type: "number",
                    value: d.perempuan ?? ""
                },
                {
                    label: "Jumlah Kepala Keluarga (KK)",
                    name: "jumlahKK",
                    type: "number",
                    value: d.jumlahKK ?? ""
                },
                {
                    label: "Jumlah Dusun / RT / RW",
                    name: "jumlahDusunRT",
                    value: d.jumlahDusunRT || ""
                },
                {
                    label: "Kelompok Usia (Kategori: Jumlah per baris)",
                    name: "kelompokUsia",
                    type: "textarea",
                    rows: 4,
                    value: formatKategori(d.kelompokUsia)
                },
                {
                    label: "Pendidikan Terakhir (Kategori: Jumlah per baris)",
                    name: "pendidikan",
                    type: "textarea",
                    rows: 4,
                    value: formatKategori(d.pendidikan)
                },
                {
                    label: "Mata Pencaharian (Kategori: Jumlah per baris)",
                    name: "pekerjaan",
                    type: "textarea",
                    rows: 4,
                    value: formatKategori(d.pekerjaan)
                },
                {
                    label: "Jumlah Penduduk Usia Produktif",
                    name: "usiaProduktif",
                    type: "number",
                    value: d.usiaProduktif ?? ""
                }
            ],
            async data => {
                const tahun = Number(data.get("tahun"));

                if (!Number.isInteger(tahun) || tahun < 1900 || tahun > 2200) {
                    throw new Error("Masukkan tahun yang valid.");
                }

                // Cegah tahun yang sama dibuat dua kali
                if (!editMode && daftarDemografi.some(item => item.tahun === tahun)) {
                    throw new Error(`Data demografi tahun ${tahun} sudah tersedia.`);
                }

                const payload = {
                    tahun,
                    jumlahPenduduk: Number(data.get("jumlahPenduduk") || 0),
                    lakiLaki: Number(data.get("lakiLaki") || 0),
                    perempuan: Number(data.get("perempuan") || 0),
                    jumlahKK: Number(data.get("jumlahKK") || 0),
                    jumlahDusunRT: data.get("jumlahDusunRT"),

                    kelompokUsia: parseKategori(data.get("kelompokUsia")),
                    pendidikan: parseKategori(data.get("pendidikan")),
                    pekerjaan: parseKategori(data.get("pekerjaan")),

                    usiaProduktif: Number(data.get("usiaProduktif") || 0)
                };

                await api(`/api/desa/${desa._id}/demografi`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                tahunDemografiAktif = tahun;

                alert(
                    editMode
                        ? "Data demografi berhasil diperbarui!"
                        : "Data demografi berhasil ditambahkan!"
                );
            }
        );
    }

    async function hapusDemografi() {
        if (!demografi.tahun) return;

        const konfirmasi = confirm(
            `Yakin ingin menghapus data demografi tahun ${demografi.tahun}?`
        );

        if (!konfirmasi) return;

        try {
            await api(
                `/api/desa/${desa._id}/demografi/${demografi.tahun}`,
                {
                    method: "DELETE"
                }
            );

            tahunDemografiAktif = null;

            alert("Data demografi berhasil dihapus!");

            await muatKonten();

        } catch (error) {
            alert(error.message);
        }
    }

    function tampilkanGaleri() {
    const container = $("#desa-galeri");
    if (!container) return;

    const data = [...galeri].sort(
        (a, b) => Number(a.urutan || 0) - Number(b.urutan || 0)
    );

    container.innerHTML = data.length
        ? data.map(item => `
            <div class="galeri-item"
                style="
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                ">

                <img
                    src="${esc(item.gambar)}"
                    alt="${esc(item.keterangan || "Dokumentasi desa")}"
                    style="
                        display: block;
                        width: 100%;
                        height: 230px;
                        object-fit: cover;
                    "
                >

                <div class="galeri-caption"
                    style="display:block !important; padding:15px;">
                    <p style="margin:0; color:#334155;">
                        ${esc(item.keterangan || "Dokumentasi desa")}
                    </p>
                </div>

                ${adminAktif ? `
                    <div class="admin-item-actions"
                        style="
                            display:flex !important;
                            visibility:visible !important;
                            opacity:1 !important;
                            gap:10px;
                            padding:0 15px 15px;
                        ">

                        <button
                            type="button"
                            class="btn-edit-galeri"
                            data-id="${item._id}"
                            style="
                                display:inline-flex !important;
                                padding:9px 14px;
                                border:0;
                                border-radius:6px;
                                background:#e6f1fb;
                                color:#1769aa;
                                cursor:pointer;
                                font-weight:600;
                            ">
                            <i class="fa-solid fa-pen"></i>&nbsp; Edit
                        </button>

                        <button
                            type="button"
                            class="btn-hapus-galeri"
                            data-id="${item._id}"
                            style="
                                display:inline-flex !important;
                                padding:9px 14px;
                                border:0;
                                border-radius:6px;
                                background:#fde8e8;
                                color:#c62828;
                                cursor:pointer;
                                font-weight:600;
                            ">
                            <i class="fa-solid fa-trash"></i>&nbsp; Hapus
                        </button>
                    </div>
                ` : ""}
            </div>
        `).join("")
        : `<p class="placeholder">Dokumentasi desa belum tersedia.</p>`;

    if (!adminAktif) return;

    container.querySelectorAll(".btn-edit-galeri").forEach(button => {
        button.onclick = () => {
            const item = galeri.find(
                foto => foto._id === button.dataset.id
            );

            if (item) formGaleri(item);
        };
    });

    container.querySelectorAll(".btn-hapus-galeri").forEach(button => {
        button.onclick = () => hapusGaleri(button.dataset.id);
    });
}

    // ==========================================
// FORM TAMBAH / EDIT DOKUMENTASI
// ==========================================
    function formGaleri(item = null) {
        bukaForm(
            item ? "Edit Dokumentasi Desa" : "Tambah Dokumentasi Desa",
            [
                {
                    label: "Pilih Foto",
                    name: "gambar",
                    type: "file",
                    required: !item
                },
                {
                    label: "Keterangan Foto",
                    name: "keterangan",
                    type: "textarea",
                    rows: 3,
                    value: item?.keterangan || "",
                    required: true
                },
                {
                    label: "Urutan Tampilan",
                    name: "urutan",
                    type: "number",
                    value: item?.urutan ?? 0
                }
            ],
            async data => {
                const file = data.get("gambar");

                if (!item && (!file || !file.size)) {
                    throw new Error("Silakan pilih foto dokumentasi.");
                }

                const url = item
                    ? `/api/desa/${desa._id}/galeri/${item._id}`
                    : `/api/desa/${desa._id}/galeri`;

                await api(url, {
                    method: item ? "PUT" : "POST",
                    body: data
                });

                alert(
                    item
                        ? "Dokumentasi berhasil diperbarui!"
                        : "Dokumentasi berhasil ditambahkan!"
                );
            }
        );
    }

    // ==========================================
    // HAPUS DOKUMENTASI
    // ==========================================
    async function hapusGaleri(id) {
        const item = galeri.find(foto => foto._id === id);
        if (!item) return;

        if (!confirm("Yakin ingin menghapus foto dokumentasi ini?")) {
            return;
        }

        try {
            await api(`/api/desa/${desa._id}/galeri/${id}`, {
                method: "DELETE"
            });

            alert("Foto berhasil dihapus!");
            await muatKonten();

        } catch (error) {
            alert(error.message);
        }
    }

    // PETA
    // ==========================================
    // PETA LOKASI DETAIL DESA
    // ==========================================
    function tampilkanPeta() {
        const el = $("#map");

        if (!el || typeof L === "undefined") return;

        const koordinat = profil.koordinat || {};
        const lat = Number(koordinat.latitude);
        const lng = Number(koordinat.longitude);

        if (
            koordinat.latitude == null ||
            koordinat.longitude == null ||
            !Number.isFinite(lat) ||
            !Number.isFinite(lng)
        ) {
            el.innerHTML = `
                <p class="placeholder" style="padding:24px">
                    Koordinat desa belum tersedia.
                </p>
            `;
            return;
        }

        if (map) {
            map.remove();
            map = null;
        }

        map = L.map(el).setView([lat, lng], 14);

        // Gunakan OpenStreetMap
        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution: "&copy; OpenStreetMap contributors",
                maxZoom: 19
            }
        ).addTo(map);

        L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`<strong>${esc(desa.namaDesa)}</strong>`)
            .openPopup();

        setTimeout(() => {
            map.invalidateSize();
        }, 300);
    }

    // TOMBOL KELOLA ADMIN
    function tombolKelola(section, label, callback) {
        if (!section || !adminAktif) return;

        const title = $(".section-title", section);
        if (!title || $(".btn-kelola-section", title)) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "btn-kelola-section";
        button.textContent = `Kelola ${label}`;
        button.onclick = callback;

        title.appendChild(button);
    }

    function tampilkanTombolAdmin() {
        if (!adminAktif) return;

        $$(".detail-desa-page main .section").forEach(section => {
            const heading = $("h2", section);
            if (!heading) return;

            const title = heading.textContent.toLowerCase();

            if (title.includes("data desa")) {
                tombolKelola(section, "Profil Desa", formProfil);
            } 
             else if (title.includes("dokumentasi") || title.includes("potret")
            ) {
                tombolKelola(section,"Tambah Dokumentasi",() => formGaleri());
            }
        });
    }

    
    // ==========================================
    // STRUKTUR ORGANISASI DESA DINAMIS
    // ==========================================

    function tampilkanOrganisasi() {
        const container = $("#org-chart");
        const toolbar = $("#org-admin-toolbar");

        if (!container) return;

        const anggota = konten.organigram?.anggota || [];

        if (toolbar) {
            toolbar.style.display = adminAktif ? "flex" : "none";
        }

        const tombolTambah = $("#btn-tambah-jabatan");

        if (tombolTambah && adminAktif) {
            tombolTambah.onclick = () => formAnggota();
        }

        if (!anggota.length) {
            container.innerHTML = `
                <div class="org-empty">
                    <i class="fa-solid fa-sitemap"></i>
                    <p>Struktur organisasi desa belum tersedia.</p>
                    ${adminAktif ? "<small>Gunakan tombol Tambah Jabatan untuk mulai mengisi.</small>" : ""}
                </div>
            `;
            return;
        }

        const daftarAnak = parentId => anggota
            .filter(item => String(item.parentId || "") === String(parentId || ""))
            .sort((a, b) => Number(a.urutan || 0) - Number(b.urutan || 0));

        function buatNode(item, jalur = new Set()) {
            const id = String(item._id);

            // Mencegah render berulang jika data lama memiliki hubungan melingkar
            if (jalur.has(id)) return "";

            const jalurBaru = new Set(jalur);
            jalurBaru.add(id);

            const anak = daftarAnak(id);

            return `
                <div class="org-branch">
                    <article class="org-node ${!item.parentId ? "org-node-root" : ""}">

                        ${
                            item.foto
                                ? `<img class="org-photo"
                                    src="${esc(item.foto)}"
                                    alt="${esc(item.nama)}"
                                    loading="lazy">`
                                : `<div class="org-avatar">
                                    <i class="fa-solid fa-user"></i>
                                </div>`
                        }

                        <strong>${esc(item.jabatan)}</strong>
                        <small>${esc(item.nama)}</small>

                        ${
                            item.bidang
                                ? `<span class="org-field">${esc(item.bidang)}</span>`
                                : ""
                        }

                        ${
                            adminAktif
                                ? `
                                    <div class="org-actions">
                                        <button type="button"
                                            data-org-edit="${id}">
                                            <i class="fa-solid fa-pen"></i> Edit
                                        </button>

                                        <button type="button"
                                            data-org-delete="${id}">
                                            <i class="fa-solid fa-trash"></i> Hapus
                                        </button>
                                    </div>
                                `
                                : ""
                        }
                    </article>

                    ${
                        anak.length
                            ? `
                                <div class="org-children ${item.orientasiAnak === "vertical" ? "is-vertical" : "is-horizontal"}">
                                    ${anak.map(child => buatNode(child, jalurBaru)).join("")}
                                </div>
                            `
                            : ""
                    }
                </div>
            `;
        }

        const akar = daftarAnak(null);

        container.innerHTML = akar.length
            ? `
                <div class="org-tree">
                    ${akar.map(item => buatNode(item)).join("")}
                </div>
            `
            : `
                <div class="org-empty">
                    <p>Tidak ditemukan jabatan utama. Periksa hubungan atasan setiap jabatan.</p>
                </div>
            `;

        if (!adminAktif) return;

        container.querySelectorAll("[data-org-edit]").forEach(button => {
            button.onclick = () => {
                const target = anggota.find(
                    item => String(item._id) === button.dataset.orgEdit
                );

                if (target) formAnggota(target);
            };
        });

        container.querySelectorAll("[data-org-delete]").forEach(button => {
            button.onclick = () => hapusAnggota(button.dataset.orgDelete);
        });
    }

        function formAnggota(target = null) {
            const anggota = konten.organigram?.anggota || [];

            // Jabatan yang boleh dipilih sebagai atasan
            // Jabatan itu sendiri tidak boleh menjadi atasannya.
            const pilihanAtasan = anggota.filter(item =>
                !target || String(item._id) !== String(target._id)
            );

            const optionsAtasan = [
                { value: "", label: "Tidak ada (Jabatan Utama)" },
                ...pilihanAtasan.map(item => ({
                    value: String(item._id),
                    label: `${item.jabatan} — ${item.nama}`
                }))
            ];

            bukaForm(
                target ? "Edit Jabatan" : "Tambah Jabatan",
                [
                    {
                        label: "Nama Pejabat",
                        name: "nama",
                        value: target?.nama || "",
                        required: true
                    },
                    {
                        label: "Nama Jabatan",
                        name: "jabatan",
                        value: target?.jabatan || "",
                        required: true
                    },
                    {
                        label: "Bidang / Keterangan",
                        name: "bidang",
                        value: target?.bidang || "",
                        placeholder: "Contoh: Keuangan, Pemerintahan, Dusun A"
                    },
                    {
                        label: "Jabatan Atasan",
                        name: "parentId",
                        type: "select",
                        value: target?.parentId || "",
                        options: optionsAtasan
                    },
                    {
                        label: "Susunan Jabatan Bawahan",
                        name: "orientasiAnak",
                        type: "select",
                        value: target?.orientasiAnak || "horizontal",
                        options: [
                            { value: "horizontal", label: "Horizontal (Sejajar)" },
                            { value: "vertical", label: "Vertikal (Bertingkat)" }
                        ]
                    },
                    {
                        label: "Urutan",
                        name: "urutan",
                        type: "number",
                        value: target?.urutan ?? 0
                    },
                    {
                        label: "Foto Pejabat (URL, opsional)",
                        name: "foto",
                        value: target?.foto || "",
                        placeholder: "https://..."
                    }
                ],
                async data => {
                    const payload = {
                        nama: data.get("nama").trim(),
                        jabatan: data.get("jabatan").trim(),
                        bidang: data.get("bidang").trim(),
                        parentId: data.get("parentId") || null,
                        orientasiAnak: data.get("orientasiAnak"),
                        urutan: Number(data.get("urutan") || 0),
                        foto: data.get("foto").trim()
                    };

                    const url = target
                        ? `/api/desa/${desa._id}/organigram/${target._id}`
                        : `/api/desa/${desa._id}/organigram`;

                    await api(url, {
                        method: target ? "PUT" : "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(payload)
                    });
                }
            );
        }

        async function hapusAnggota(id) {
            const target = (konten.organigram?.anggota || []).find(
                item => String(item._id) === String(id)
            );

            if (!target) return;

            if (!confirm(`Hapus jabatan ${target.jabatan} — ${target.nama}?`)) {
                return;
            }

            try {
                await api(
                    `/api/desa/${desa._id}/organigram/${id}`,
                    { method: "DELETE" }
                );

                alert("Jabatan berhasil dihapus.");
                await muatKonten();

            } catch (error) {
                alert(error.message);
            }
        }

    try {
        await muatKonten();
    } catch (error) {
        console.error("Detail Desa:", error);
        if ($("#desa-nama")) $("#desa-nama").textContent = "Gagal memuat data desa";
        alert(error.message);
    }
});
