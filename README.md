# SIBITA-BE

SIBITA-BE adalah backend untuk Sistem Informasi Akademik (SIBITA) yang dibangun menggunakan Node.js, Express, dan Sequelize.

## Daftar Isi

- [Persyaratan](#persyaratan)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Menjalankan Proyek](#menjalankan-proyek)
- [Struktur Proyek](#struktur-proyek)
- [Migrasi Database](#migrasi-database)
- [Endpoint API](#endpoint-api)

---

## Persyaratan

Pastikan Anda memiliki perangkat lunak berikut yang sudah terinstal:

- Node.js (versi 16 atau lebih baru)
- MySQL
- npm atau yarn

---

## Instalasi

1. Clone repositori ini:

   ```bash
   git clone <URL_REPOSITORY>
   cd SIBITA-BE
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

---

## Konfigurasi

1. Salin file `.env.example` menjadi `.env`:

   ```bash
   cp .env.example .env
   ```

2. Edit file `.env` sesuai dengan konfigurasi database dan server Anda:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=yourpassword
   DB_NAME=sibita_db
   PORT=4000
   JWT_SECRET=sibita-secret-key
   ```

---

## Menjalankan Proyek

### Mode Pengembangan

Gunakan perintah berikut untuk menjalankan server dalam mode pengembangan:

```bash
npm run dev
```

### Mode Produksi

1. Build proyek:

   ```bash
   npm run build
   ```

2. Jalankan server:
   ```bash
   npm start
   ```

---

## Struktur Proyek

```plaintext
.env                # File konfigurasi lingkungan
.env.example        # Contoh file konfigurasi lingkungan
package.json        # Konfigurasi npm
tsconfig.json       # Konfigurasi TypeScript
src/
  main.ts           # Entry point untuk mode produksi
  main-dev.ts       # Entry point untuk mode pengembangan
  config/
    database.ts     # Konfigurasi database Sequelize
  models/
    user.model.ts   # Model untuk tabel 'users'
  routes/
    api.ts          # Definisi rute API
migrations/         # File migrasi database
```

---

## Migrasi Database

### Membuat Database

Gunakan perintah berikut untuk membuat database:

```bash
npm run FIRST-SETUP
```

### Menjalankan Migrasi

Untuk menjalankan migrasi database:

```bash
npm run migrate
```

### Menjalankan Seeder

Untuk menambahkan data awal ke database:

```bash
npm run seed
```

---

## Endpoint API

### Default Route

- **GET /**  
  Menampilkan pesan selamat datang.

### User Routes

- **Base URL:** `/api/user`

### Admin Routes

- **Base URL:** `/api/admin`

---

## Lisensi

Proyek ini menggunakan lisensi ISC.
