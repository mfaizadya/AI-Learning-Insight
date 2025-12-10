-- ============================
-- USERS (5 Dummy Users)
-- ============================
INSERT INTO users (id, email, username, password, image, role, learning_style, learning_pattern) VALUES
(1, 'andi@example.com', 'andi', 'pass123', NULL, 'user', 'visual', 'fast'),
(2, 'budi@example.com', 'budi', 'pass123', NULL, 'user', 'auditori', 'consistent'),
(3, 'sari@example.com', 'sari', 'pass123', NULL, 'user', 'kinestetik', 'reflective'),
(4, 'admin@example.com', 'admin', 'adminpass', NULL, 'admin', 'visual', 'balanced'),
(5, 'tina@example.com', 'tina', 'pass123', NULL, 'user', 'auditori', 'fast');

-- ============================
-- TEST POLA (1 test)
-- ============================
INSERT INTO test_pola (id, name) VALUES
(1, 'Tes Pola Belajar Dasar');

-- ============================
-- SOAL POLA (10 Questions)
-- ============================
INSERT INTO soal_pola (id, test_id, question) VALUES
(1, 1, 'Bagaimana Anda biasanya memulai belajar hal baru?'),
(2, 1, 'Apa yang Anda lakukan ketika menghadapi tugas sulit?'),
(3, 1, 'Saat belajar, Anda lebih suka kecepatan seperti apa?'),
(4, 1, 'Apa reaksi Anda ketika diberi informasi baru?'),
(5, 1, 'Bagaimana cara Anda menanggapi kesalahan saat belajar?'),
(6, 1, 'Ketika belajar, fokus Anda cenderung pada apa?'),
(7, 1, 'Saat belajar, Anda merasa nyaman ketika...'),
(8, 1, 'Ketika mencoba memahami konsep baru, Anda...'),
(9, 1, 'Jika diberi waktu terbatas, Anda akan...'),
(10, 1, 'Dalam jangka panjang, pola belajar Anda seperti apa?');

-- ============================
-- PILIHAN POLA (4–5 choices per soal)
-- bobot_consistent, bobot_fast, bobot_reflective, bobot_balanced
-- ============================

INSERT INTO pilihan_pola (soal_id, option_text, bobot_consistent, bobot_fast, bobot_reflective, bobot_balanced) VALUES
-- Q1
(1, 'Mulai dengan merencanakan langkah-langkah belajar', 5,1,3,4),
(1, 'Langsung mencoba tanpa banyak rencana', 1,5,2,3),
(1, 'Menganalisis dulu sebelum memulai', 3,1,5,4),
(1, 'Mengikuti alur secara fleksibel', 3,3,3,5),

-- Q2
(2, 'Mengerjakan secara bertahap', 5,1,3,3),
(2, 'Mengerjakan secepat mungkin', 1,5,1,3),
(2, 'Berhenti sejenak lalu refleksi', 2,1,5,4),
(2, 'Mencoba beberapa metode berbeda', 2,3,3,5),

-- Q3
(3, 'Lambat dan stabil', 5,1,3,3),
(3, 'Cepat dan langsung inti', 1,5,1,3),
(3, 'Menyesuaikan ritme sesuai materi', 3,3,3,5),
(3, 'Pelan sambil memahami detail', 3,1,5,3),

-- Q4
(4, 'Mengambil waktu untuk berpikir', 4,1,5,3),
(4, 'Segera mencoba menerapkan', 1,5,1,3),
(4, 'Mencatat poin penting', 5,1,3,4),
(4, 'Mengikuti alur informasi', 3,3,3,5),

-- Q5
(5, 'Merevisi dan memperbaiki perlahan', 5,1,4,3),
(5, 'Belajar lebih cepat untuk mengejar ketertinggalan', 1,5,1,4),
(5, 'Merefleksikan apa yang salah', 2,1,5,4),
(5, 'Menyesuaikan strategi belajar', 3,3,3,5),

-- Q6
(6, 'Konsistensi proses', 5,1,3,3),
(6, 'Kecepatan penyelesaian', 1,5,1,3),
(6, 'Pemahaman mendalam', 2,1,5,4),
(6, 'Keseimbangan antara cepat dan tepat', 3,3,3,5),

-- Q7
(7, 'Saat rutinitas teratur', 5,1,3,4),
(7, 'Saat suasana cepat dan dinamis', 1,5,1,3),
(7, 'Saat bisa berpikir perlahan', 2,1,5,4),
(7, 'Saat ritme fleksibel', 3,3,3,5),

-- Q8
(8, 'Mempelajari langkah secara runtut', 5,1,3,4),
(8, 'Menyelesaikan bagian inti terlebih dahulu', 1,5,1,3),
(8, 'Merenungkan konsep', 1,1,5,4),
(8, 'Menggabungkan beberapa teknik', 3,3,3,5),

-- Q9
(9, 'Mengerjakan secara stabil sesuai rencana', 5,1,3,3),
(9, 'Mengerjakan dengan sangat cepat', 1,5,1,3),
(9, 'Memikirkan prioritas utama', 2,1,5,4),
(9, 'Menyeimbangkan kecepatan dan ketepatan', 3,3,3,5),

-- Q10
(10, 'Tetap pada pola stabil', 5,1,3,4),
(10, 'Berubah cepat mengikuti kebutuhan', 1,5,1,3),
(10, 'Belajar sambil refleksi', 1,1,5,4),
(10, 'Pola fleksibel dan seimbang', 3,3,3,5);

-- ============================
-- TEST GAYA (1 Test)
-- ============================
INSERT INTO test_gaya (id, name) VALUES
(1, 'Tes Gaya Belajar Dasar');

-- ============================
-- SOAL GAYA (10 Questions)
-- ============================
INSERT INTO soal_gaya (id, test_id, question) VALUES
(1, 1, 'Saat belajar, Anda paling terbantu oleh apa?'),
(2, 1, 'Ketika memahami konsep rumit, Anda lebih suka?'),
(3, 1, 'Saat mengingat sesuatu, Anda menggunakan...'),
(4, 1, 'Jika harus mengikuti instruksi, Anda lebih suka...'),
(5, 1, 'Ketika belajar, Anda merasa nyaman ketika...'),
(6, 1, 'Saat belajar kelompok, Anda...'),
(7, 1, 'Jika mempelajari alat atau mesin, Anda...'),
(8, 1, 'Ketika menjelaskan pada orang lain, Anda...'),
(9, 1, 'Cara terbaik memahami materi baru?'),
(10, 1, 'Hal yang paling mengganggu saat belajar?');

-- ============================
-- PILIHAN GAYA
-- bobot_visual, bobot_auditori, bobot_kinestetik
-- ============================

INSERT INTO pilihan_gaya (soal_id, option_text, bobot_visual, bobot_auditori, bobot_kinestetik) VALUES
-- Q1
(1, 'Melihat gambar atau diagram', 5,1,1),
(1, 'Mendengarkan penjelasan', 1,5,1),
(1, 'Mencoba mempraktikkan langsung', 1,1,5),

-- Q2
(2, 'Melihat contoh visual', 5,1,2),
(2, 'Diskusi dan mendengar penjelasan', 1,5,1),
(2, 'Menggerakkan tangan atau tubuh', 1,1,5),

-- Q3
(3, 'Membayangkan gambar', 5,1,1),
(3, 'Mengulang secara verbal', 1,5,1),
(3, 'Menggunakan gerakan tubuh', 1,1,5),

-- Q4
(4, 'Instruksi berbentuk diagram', 5,1,1),
(4, 'Instruksi audio', 1,5,1),
(4, 'Aksi demonstrasi', 1,1,5),

-- Q5
(5, 'Melihat slide atau video', 5,1,2),
(5, 'Dibacakan atau dijelaskan', 1,5,1),
(5, 'Langsung mencoba', 1,1,5),

-- Q6
(6, 'Melihat catatan kelompok', 5,1,2),
(6, 'Diskusi mendalam', 1,5,1),
(6, 'Simulasi / roleplay', 1,1,5),

-- Q7
(7, 'Diagram dan blueprint', 5,1,2),
(7, 'Instruksi audio', 1,5,1),
(7, 'Menyentuh dan mencoba sendiri', 1,1,5),

-- Q8
(8, 'Menggambar atau menuliskan poin', 5,1,2),
(8, 'Menjelaskan dengan kata-kata', 1,5,1),
(8, 'Menggunakan demonstrasi', 1,1,5),

-- Q9
(9, 'Melihat contoh visual', 5,1,2),
(9, 'Mendengar penjelasan', 1,5,1),
(9, 'Praktik langsung', 1,1,5),

-- Q10
(10, 'Tidak ada gambar / visual', 5,1,1),
(10, 'Suara bising', 1,5,1),
(10, 'Tidak bisa bergerak', 1,1,5);

-- ============================
-- HASIL TEST (Dummy)
-- ============================
INSERT INTO hasil_test (id, user_id, test_pola_id, test_gaya_id) VALUES
(1, 1, 1, 1),
(2, 2, 1, 1);

-- ============================
-- INSIGHT (Dummy)
-- ============================
INSERT INTO insight (user_id, insight) VALUES
(1, 'Anda cenderung belajar cepat dan visual.'),
(2, 'Anda konsisten dan mudah memahami lewat audio.');
