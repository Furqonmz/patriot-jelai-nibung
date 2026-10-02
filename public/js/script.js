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
// KONTROL RESPONSIVE NAVBAR (HAMBURGER MENU)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        // Ketika tombol hamburger diklik, buka/tutup menu vertikal
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Mengubah ikon hamburger menjadi silang (X) atau sebaliknya (opsional)
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Menutup menu otomatis ketika salah satu link menu diklik
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
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
// 3. PETA LEAFLET DI HALAMAN PROFIL DESA
// ==========================================
// Bagian ini menampilkan peta interaktif (Leaflet.js) yang memuat koordinat
// 5 desa utama di Kawasan Transmigrasi Jelai Nibung beserta pin penandanya.
document.addEventListener("DOMContentLoaded", function() {
    const mapElement = document.getElementById('map');
    
    if (mapElement) {
        var map = L.map('map').setView([-2.9912, 110.7077], 12);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        var lokasiDesa = [
            { nama: "Desa Pulau Nibung", lat: -2.8970700201566784, lng: 110.85125012346921 }, 
            { nama: "Desa Sungai Baru", lat: -2.9902012839775276, lng: 110.85424584969269 },
            { nama: "Desa Sungai Bundung", lat: -2.989670241182833, lng: 110.88306488952134 },
            { nama: "Desa Sungai Raja", lat: -3.04709225914006, lng: 110.94008332722463 },
            { nama: "Desa Sungai Damar", lat: -3.0548757610171604, lng: 111.01853520736358 }
        ];

        lokasiDesa.forEach(function(desa) {
            var marker = L.marker([desa.lat, desa.lng]).addTo(map);
            marker.bindPopup("<b>" + desa.nama + "</b><br>Kecamatan Jelai").openPopup();
        });
    }
});

 document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMsg = document.getElementById('errorMsg');

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const result = await response.json();

                if (response.ok) {
                    // Jika login sukses, simpan status admin ke localStorage browser
                    localStorage.setItem("isAdmin", "true");
                    alert("Login Berhasil!");
                    window.location.href = "index.html"; // Kembali ke halaman utama
                } else {
                    errorMsg.textContent = result.pesan || "Login gagal!";
                }
            } catch (err) {
                console.error(err);
                errorMsg.textContent = "Terjadi kesalahan pada server.";
            }
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
    if (document.getElementById("floatLogout")) {
        document.getElementById("floatLogout").addEventListener("click", () => {
            localStorage.removeItem("isAdmin");
            alert("Berhasil logout!");
            window.location.reload();
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