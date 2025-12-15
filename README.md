# CerdasKu - AI Learning Insight

**CerdasKu** adalah platform asesmen pendidikan berbasis Web dan Artificial Intelligence (AI) yang dirancang untuk memecahkan masalah *Cold Start* dalam personalisasi pembelajaran (kondisi di mana sistem kesulitan memberikan prediksi atau rekomendasi yang akurat karena kurangnya data historis mengenai pengguna). Melalui fitur **Pretest**, aplikasi ini dapat menganalisis **Gaya Belajar** (Visual, Auditori, Kinestetik) dan **Pola Belajar** (Consistent, Fast, Reflective, Balanced) pengguna baru secara instan tanpa perlu menunggu histori data aktivitas.

Proyek ini merupakan bagian dari Capstone Project (Tim A25-CS225 - DC-08) yang mengintegrasikan layanan Backend yang kuat, Frontend interaktif, dan Model Machine Learning untuk memberikan wawasan (*actionable insight*) yang dipersonalisasi.

---

## 🧠 Machine Learning & Model Repository

Inti kecerdasan buatan dari CerdasKu dipisahkan dalam layanan mikro (*microservice*) menggunakan FastAPI. Repositori ini berisi kode untuk pelatihan model (Random Forest), pemrosesan data, dan server API untuk prediksi.

Untuk menduplikasi atau menjalankan server model AI, silakan kunjungi repositori berikut:

👉 **[Repository ML Model - CerdasKu](https://github.com/Anin-A/ml-model)**

> **Catatan Penting:** Backend CerdasKu memerlukan URL endpoint dari server model ini (diatur pada variabel environment `.env`) agar fitur prediksi setelah Pretest dapat berfungsi dengan benar.

---

## 🛠️ Teknologi yang Digunakan

### Frontend
- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI, Lucide React (Icons)
- **Visualization:** Recharts (untuk grafik statistik)
- **State Management:** React Context (Auth) & Axios
- **Routing:** React Router
- **Deployment:** Vercel

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL (Production: AWS RDS, Local: Docker)
- **Process Manager:** PM2 (untuk stabilitas di EC2)
- **Authentication:** JWT (JSON Web Token)
- **Deployment:** AWS EC2 (Ubuntu)

### Machine Learning (Lihat Repo ML)
- **Algorithm:** Scikit-learn (Random Forest)
- **API Framework:** FastAPI (Python)
- **Deployment:** Heroku / Cloud Run

### DevOps & Tools
- **Containerization:** Docker & Docker Compose
- **Cloud Infrastructure:** AWS (EC2, RDS, VPC Security Groups)
- **API Testing:** Postman

---

## 📋 Prasyarat (Prerequisites)

Sebelum memulai pengembangan lokal, pastikan perangkat Anda memiliki:
1.  **Node.js** (Versi 18+ direkomendasikan)
2.  **npm** (Bawaan Node.js)
3.  **Docker Desktop** (Untuk menjalankan database MySQL lokal)
4.  **Git**
5.  *(Opsional)* **Python 3.9+** jika ingin menjalankan server ML secara lokal.

---

## 🚀 Cara Menjalankan Proyek (Instalasi Lokal)

Ikuti langkah-langkah berikut untuk menjalankan aplikasi web (Frontend & Backend) di komputer lokal Anda.

### 1. Clone Repository Web

```bash
git clone https://github.com/mfaizadya/ai-learning-insight.git
cd ai-learning-insight
```

### 2. Setup Database

Kami menggunakan Docker untuk mempermudah setup database MySQL tanpa instalasi manual.

1. Masuk ke folder Backend:
   ```bash
   cd backend
   ```

2. Jalankan container database:
   ```bash
   docker-compose up -d
   ```
   *Perintah ini akan membuat container MySQL, database `capstone-db`, dan otomatis mengisi data awal (seeding) dari folder `docker/init`.*

### 3. Setup Backend (Server)

1. Pastikan Anda masih berada di direktori **backend**.

2. Install dependency:
   ```bash
   npm install
   ```

3. Konfigurasi Environment Variables:
   - Salin contoh **.env**:
     ```bash
     cp .env.example .env
     ```
   - **PENTING:** Buka file `.env` dan atur `ML_API_URL`.
     - Jika server ML lokal: `http://localhost:8000`
     - Jika server ML production: Masukkan URL Heroku/Deploy ML Anda.

4. Jalankan server:
   ```bash
   npm run dev
   ```
   Server backend akan berjalan di port default (biasanya 5000).

### 4. Setup Frontend (Client)

1. Buka terminal baru, lalu masuk directory frontend:
   ```bash
   cd frontend
   ```

2. Install dependency:
   ```bash
   npm install
   ```

3. Jalankan aplikasi frontend:
   ```bash
   npm run dev
   ```
   Aplikasi biasanya akan berjalan di **http://localhost:5173**. Buka URL tersebut di browser Anda.

---

## 📚 Dokumentasi API

Dokumentasi lengkap mengenai endpoint API tersedia di dalam repository ini:

- **Dokumentasi Markdown**: Lihat file [backend/API.md](backend/API.md) untuk detail endpoint, format request, dan response.
- **Postman Collection**: Import file di `backend/postman/` ke aplikasi Postman Anda.

**Endpoint Utama:**

- **Auth:** `/api/auth/login`, `/api/auth/register`
- **Dashboard:** `/api/dashboard` (Mengambil data user, statistik, dan insight sekaligus)
- **Profile:** `/api/users/profile`, `/api/users/profile/password` (Update profil & password)
- **Tests:** `/api/tests/pola`, `/api/tests/gaya` (Mengambil soal pretest)
- **Results:** `/api/results` (Submit jawaban & Trigger ML Prediction)
- **History:** `/api/results/history` (Riwayat tes pengguna)

---

## ☁️ Arsitektur Deployment (Production)

Untuk lingkungan produksi, aplikasi ini menggunakan arsitektur Cloud terdistribusi:

1.  **Frontend:** Di-hosting di **Vercel** untuk performa CDN global.
2.  **Backend:** Di-hosting di **AWS EC2 (Ubuntu)** menggunakan **PM2** agar server selalu *online* dan *restart* otomatis jika terjadi *crash*.
3.  **Database:** Menggunakan **AWS RDS (MySQL)** yang diamankan dengan *Security Group* (hanya dapat diakses oleh instance EC2 Backend secara privat, tidak terekspos ke internet publik).
4.  **Machine Learning:** API Model berjalan sebagai layanan terpisah yang dipanggil oleh Backend saat user menyelesaikan tes.

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

---

## 🔐 Akun Demo 

### Lingkungan Lokal
Jika dalam lingkungan pengembangan lokal, Anda dapat melakukan langsung melakukan registrasi akun kemudian login dengan akun yang baru saja anda registrasikan.

### Akun demo production:
- **User**: `test_user@example.com` / `pass12345678`