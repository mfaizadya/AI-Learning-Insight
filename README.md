# CerdasKu

**CerdasKu** adalah platform asesmen pendidikan yang dirancang untuk menganalisis gaya belajar (Visual, Auditori, Kinestetik) dan pola belajar (Consistent, Fast, Reflective, Balanced) pengguna. Aplikasi ini memberikan wawasan (*insight*) yang dipersonalisasi berdasarkan hasil tes untuk membantu pengguna memaksimalkan potensi belajar mereka.

Proyek ini merupakan bagian dari Capstone Project yang terdiri dari aplikasi web modern, layanan API yang kuat serta model AI yang dapat memprediksi gaya dan pola belajar pengguna.

## 🛠️ Teknologi yang Digunakan

### Frontend
- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI, Lucide React (Icons)
- **State Management & Data Fetching:** React Context, TanStack Query, Axios
- **Routing:** React Router

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL (dijalankan via Docker)
- **Authentication:** JWT (JSON Web Token)
- **File Upload:** Multer

### Tools & DevOps
- **Containerization:** Docker & Docker Compose
- **API Testing:** Postman
- **Language:** JavaScript

---

## 📋 Prasyarat (Prerequisites)

Sebelum memulai, pastikan perangkat Anda telah terinstal:
1.  **Node.js** (Versi 18+ direkomendasikan)
2.  **npm** (Bawaan Node.js)
3.  **Docker Desktop** (Untuk menjalankan database MySQL)
4.  **Git**

---

## 🚀 Cara Menjalankan Proyek (Instalasi)

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di komputer lokal Anda (Localhost).

### 1. Clone Repository

```bash
git clone [https://github.com/mfaizadya/ai-learning-insight.git](https://github.com/mfaizadya/AI-Learning-Insight.git)
cd ai-learning-insight
```

### 2. Setup Database

Kami menggunakan Docker untuk mempermudah setup database MySQL tanpa perlu instalasi manual.
1) Masuk ke folder Backend
```bash
cd backend
```

2) Jalankan container database:
```bash
docker-compose up -d
```
*Perintah ini akan membuat container MySQL, database capstone-db, dan otomatis mengisi data awal (seeding) dari folder docker/init.*

### 3. Setup Backend (Server)

1) Pastikan Anda masih berada di direktori **backend**.

2) Install dependency:
```bash
npm install
```

3) Konfigurasi Environment Variables:
- Salin contoh **.env**:
```bash
cp .env.example .env
```
- Sesuaikan isi **.env** jika perlu.

4) Jalankan server:
```bash
npm run dev
```

### 4. Setup Frontend (Client)

1) Buka terminal baru, lalu masuk directory frontend
```bash
cd frontend
```

2) Install dependency:
```bash
npm install
```

3) Jalankan aplikasi frontend
```bash
npm run dev
```
Aplikasi biasanya akan berjalan di **http://localhost:5173**. Buka URL tersebut di browser Anda.

---

## 📚 Dokumentasi API
Dokumentasi lengkap mengenai endpoint API tersedia di dalam repository ini:

- **Dokumentasi Markdown**: Lihat file [backend/API.md](https://github.com/mfaizadya/AI-Learning-Insight/blob/main/backend/API.md) untuk detail endpoint, format request, dan response.

- **Postman Collection**: Import file backend/postman/Learning Assessment API Tests.postman_collection.json ke aplikasi Postman Anda untuk pengujian langsung.

**Endpoint utama**
- Auth: /api/auth/login, /api/auth/register

- Users: /api/users/profile

- Tests: /api/tests/pola, /api/tests/gaya

- Results: /api/results (Submit & History)

- Insights: /api/insights

- Admin: /api/admin (Manajemen soal)

- MOTD: /api/motd (Pesan harian)

---

## 📂 Struktur Proyek

```text
ai-learning-insight/
├── backend/                # Kode sumber Backend (Node.js & Express)
│   ├── controllers/        # Logika bisnis dan handler request
│   ├── db/                 # Konfigurasi koneksi database MySQL
│   ├── docker/             # Konfigurasi Docker dan skrip inisialisasi SQL
│   │   └── init/           # Skrip schema dan seeding database
│   ├── middleware/         # Middleware untuk Auth (JWT) dan Upload
│   ├── postman/            # Koleksi testing API Postman
│   ├── routes/             # Definisi endpoint API (Express Router)
│   ├── uploads/            # Direktori penyimpanan file statis (foto profil)
│   ├── utils/              # Fungsi utilitas (Hashing, Token Generator)
│   ├── .env.example        # Template variabel lingkungan
│   ├── docker-compose.yml  # Konfigurasi orkestrasi container
│   └── server.js           # Entry point aplikasi server
│
└── frontend/               # Kode sumber Client (React & Vite)
    ├── src/
    │   ├── api/            # Konfigurasi Axios client
    │   ├── components/     # Komponen UI Reusable (Shadcn, Custom)
    │   ├── context/        # State Management (AuthContext)
    │   ├── hooks/          # Custom React Hooks (useToast, useDashboardData)
    │   ├── layouts/        # Layout utama halaman (Sidebar, Navbar)
    │   ├── pages/          # Halaman aplikasi (Login, Dashboard, Test)
    │   ├── routes/         # Konfigurasi routing dan proteksi halaman
    │   ├── services/       # Layanan pemanggilan API ke Backend
    │   └── utils/          # Fungsi bantuan (Storage, Error Handler)
    ├── index.html          # Entry point HTML
    └── vite.config.js      # Konfigurasi build tool Vite
```

## 🔐 Akun Demo (Default Seed)
Jika menggunakan data seed bawaan (02_seed.sql), Anda dapat mencoba login dengan akun berikut:
- **User**: andi@example.com / pass123
- **Admin**: admin@example.com / adminpass
