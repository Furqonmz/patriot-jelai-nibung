// Membuat peta
var map = L.map('map').setView([-2.75, 111.25], 10);

// Basemap OpenStreetMap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Data desa
const desa = [
    {
        nama: "Desa Pulau Nibung",
        lat: -2.8974813005287663, 
        lng: 110.85140710963567,
        kecamatan: "Kecamatan Jelai",
        penduduk: 1110,
        komoditas: "Padi, Kelapa",
        foto: "assets/img/desa/pulau-nibung.jpg"
    },
    {
        nama: "Desa Sungai Baru",
        lat: -2.9902977120397414,
        lng: 110.85428876545835,
        kecamatan: "Kecamatan Jelai",
        penduduk: 1110,
        komoditas: "Padi, Kelapa",
        foto: "assets/img/desa/pulau-nibung.jpg"
    },
    {
        nama: "Desa Sungai Bundung",
        lat: -3.021126799485219, 
        lng: 110.88740766730743,
        kecamatan: "Kecamatan Jelai",
        penduduk: 1110,
        komoditas: "Padi, Kelapa",
        foto: "assets/img/desa/pulau-nibung.jpg"
    },
    {
        nama: "Desa Natai Sedawak",
        lat: -2.7521585832403117, 
        lng: 111.16937095196391,
        kecamatan: "Kecamatan Jelai",
        penduduk: 1110,
        komoditas: "Padi, Kelapa",
        foto: "assets/img/desa/pulau-nibung.jpg"
    },
    {
        nama: "Desa Sungai Tabuk",
        lat: -3.0166299617351773, 
        lng: 111.13444669429397,
        kecamatan: "Kecamatan Jelai",
        penduduk: 1110,
        komoditas: "Padi, Kelapa",
        foto: "assets/img/desa/pulau-nibung.jpg"
    },
    {
        nama: "Desa Sungai Raja",
        lat: -2.966237915502436, 
        lng: 110.94005085834877,
        kecamatan: "Kecamatan Jelai",
        penduduk: 1110,
        komoditas: "Padi, Kelapa",
        foto: "assets/img/desa/pulau-nibung.jpg"
    },
    {
        nama: "Desa Sungai Cabang Barat",
        lat: -2.990720141438811, 
        lng: 111.18167060778708,
        kecamatan: "Kecamatan Jelai",
        penduduk: 1110,
        komoditas: "Padi, Kelapa",
        foto: "assets/img/desa/pulau-nibung.jpg"
    },
    {
        nama: "Desa Sungai Damar",
        lat: -3.0549400425655975, 
        lng: 111.01866395381434,
        kecamatan: "Kecamatan Jelai",
        penduduk: 1110,
        komoditas: "Padi, Kelapa",
        foto: "assets/img/desa/pulau-nibung.jpg"
    }
];

// Menampilkan marker
desa.forEach(function(item){
    L.marker([item.lat, item.lng])
        .addTo(map)
        .bindPopup(`
            <div style="width:220px">
                <img src="${item.foto}" class="img-fluid rounded mb-2">
                <h5>${item.nama}</h5>
                <p>
                    <strong>Kecamatan</strong><br>
                    ${item.kecamatan}
                </p>
                <p>
                    <strong>Penduduk</strong><br>
                    ${item.penduduk.toLocaleString()} Jiwa
                </p>
                <p>
                    <strong>Komoditas</strong><br>
                    ${item.komoditas}
                </p>
                <button class="btn btn-success btn-sm">
                    Lihat Profil
                </button>
            </div>
        `);
});