-- ========================================================
-- FILE: 02_seed.sql
-- TUJUAN: Isi Data Dummy (9 Soal Pola Fixed Value, 6 Soal Gaya)
-- ========================================================

USE `capstone_db`;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. BERSIHKAN DATA LAMA
TRUNCATE TABLE `motd`;
TRUNCATE TABLE `insight`;
TRUNCATE TABLE `hasil_test`;
TRUNCATE TABLE `pilihan_gaya`;
TRUNCATE TABLE `pilihan_pola`;
TRUNCATE TABLE `soal_gaya`;
TRUNCATE TABLE `soal_pola`;
TRUNCATE TABLE `test_gaya`;
TRUNCATE TABLE `test_pola`;
TRUNCATE TABLE `users`;

-- 2. INSERT USERS
INSERT INTO `users` (`id`, `email`, `username`, `password`, `image`, `role`, `learning_style`, `learning_pattern`) VALUES
(1, 'andi@example.com', 'andi', '$2b$10$YourHashForPass123Here', NULL, 'user', 'visual', 'fast'),
(2, 'budi@example.com', 'budi', '$2b$10$YourHashForPass123Here', NULL, 'user', 'auditori', 'consistent'),
(3, 'sari@example.com', 'sari', '$2b$10$YourHashForPass123Here', NULL, 'user', 'kinestetik', 'reflective'),
(4, 'admin@example.com', 'admin', '$2b$10$YourHashForAdminPassHere', NULL, 'admin', 'visual', 'balanced'),
(5, 'tina@example.com', 'tina', '$2b$10$YourHashForPass123Here', NULL, 'user', 'auditori', 'fast');

-- 3. INSERT TESTS
INSERT INTO `test_pola` (`id`, `name`) VALUES (1, 'Tes Pola Belajar Dasar');
INSERT INTO `test_gaya` (`id`, `name`) VALUES (1, 'Tes Gaya Belajar Dasar');

-- ========================================================
-- 4. INSERT SOAL POLA (9 SOAL - VALUE FIXED)
-- ========================================================

-- Q1
INSERT INTO `soal_pola` (`id`, `test_id`, `question`) VALUES (1, 1, 'Dalam satu sesi belajar berapa banyak materi biasanya Anda pelajari?');
INSERT INTO `pilihan_pola` (`soal_id`, `option_text`, `bobot_consistent`, `bobot_fast`, `bobot_reflective`, `bobot_balanced`) VALUES
(1, '4 Materi', 4, 0, 0, 0),       -- Consistent
(1, '7 Materi', 0, 7, 0, 0),       -- Fast
(1, '3 Materi', 0, 0, 3, 0),       -- Reflective
(1, '5 Materi', 0, 0, 0, 5);       -- Balanced

-- Q2
INSERT INTO `soal_pola` (`id`, `test_id`, `question`) VALUES (2, 1, 'Dalam satu jam belajar, berapa banyak materi biasanya Anda kuasai?');
INSERT INTO `pilihan_pola` (`soal_id`, `option_text`, `bobot_consistent`, `bobot_fast`, `bobot_reflective`, `bobot_balanced`) VALUES
(2, '1.0 Materi', 1.0, 0, 0, 0),    -- Consistent
(2, '2.0 Materi', 0, 2.0, 0, 0),    -- Fast
(2, '0.5 Materi', 0, 0, 0.5, 0),    -- Reflective
(2, '1.5 Materi', 0, 0, 0, 1.5);    -- Balanced

-- Q3
INSERT INTO `soal_pola` (`id`, `test_id`, `question`) VALUES (3, 1, 'Dalam satu minggu, seberapa sering Anda biasanya melakukan sesi belajar?');
INSERT INTO `pilihan_pola` (`soal_id`, `option_text`, `bobot_consistent`, `bobot_fast`, `bobot_reflective`, `bobot_balanced`) VALUES
(3, '6 Kali', 6, 0, 0, 0),          -- Consistent
(3, '4 Kali', 0, 4, 0, 0),          -- Fast
(3, '3 Kali', 0, 0, 3, 0),          -- Reflective
(3, '5 Kali', 0, 0, 0, 5);          -- Balanced

-- Q4
INSERT INTO `soal_pola` (`id`, `test_id`, `question`) VALUES (4, 1, 'Dalam satu sesi belajar, berapa lama biasanya Anda meluangkan waktu?');
INSERT INTO `pilihan_pola` (`soal_id`, `option_text`, `bobot_consistent`, `bobot_fast`, `bobot_reflective`, `bobot_balanced`) VALUES
(4, '0.16 Jam', 0.16, 0, 0, 0),     -- Consistent
(4, '0.08 Jam', 0, 0.08, 0, 0),     -- Fast
(4, '0.83 Jam', 0, 0, 0.83, 0),     -- Reflective
(4, '0.5 Jam', 0, 0, 0, 0.5);       -- Balanced

-- Q5
INSERT INTO `soal_pola` (`id`, `test_id`, `question`) VALUES (5, 1, 'Dalam satu minggu, seberapa sering Anda biasanya mengulang kembali materi yang sudah dipelajari?');
INSERT INTO `pilihan_pola` (`soal_id`, `option_text`, `bobot_consistent`, `bobot_fast`, `bobot_reflective`, `bobot_balanced`) VALUES
(5, '2 Kali', 2, 0, 0, 0),          -- Consistent
(5, '1 Kali', 0, 1, 0, 0),          -- Fast
(5, '5 Kali', 0, 0, 5, 0),          -- Reflective
(5, '3 Kali', 0, 0, 0, 3);          -- Balanced

-- Q6
INSERT INTO `soal_pola` (`id`, `test_id`, `question`) VALUES (6, 1, 'Berapa lama biasanya Anda membutuhkan waktu untuk mengerjakan submission?');
INSERT INTO `pilihan_pola` (`soal_id`, `option_text`, `bobot_consistent`, `bobot_fast`, `bobot_reflective`, `bobot_balanced`) VALUES
(6, '0.37 Jam', 0.37, 0, 0, 0),     -- Consistent
(6, '0.12 Jam', 0, 0.12, 0, 0),     -- Fast
(6, '0.75 Jam', 0, 0, 0.75, 0),     -- Reflective
(6, '0.35 Jam', 0, 0, 0, 0.35);     -- Balanced

-- Q7
INSERT INTO `soal_pola` (`id`, `test_id`, `question`) VALUES (7, 1, 'Biasanya berapa bintang yang Anda peroleh dari hasil submission Anda?');
INSERT INTO `pilihan_pola` (`soal_id`, `option_text`, `bobot_consistent`, `bobot_fast`, `bobot_reflective`, `bobot_balanced`) VALUES
(7, '1 Bintang', 1, 0, 0, 0),       -- Consistent
(7, '3 Bintang', 0, 3, 0, 0),       -- Fast
(7, '4 Bintang', 0, 0, 4, 0),       -- Reflective
(7, '2 Bintang', 0, 0, 0, 2);       -- Balanced

-- Q8
INSERT INTO `soal_pola` (`id`, `test_id`, `question`) VALUES (8, 1, 'Biasanya, berapa persen nilai kuis yang Anda peroleh?');
INSERT INTO `pilihan_pola` (`soal_id`, `option_text`, `bobot_consistent`, `bobot_fast`, `bobot_reflective`, `bobot_balanced`) VALUES
(8, '83%', 83, 0, 0, 0),            -- Consistent
(8, '95%', 0, 95, 0, 0),            -- Fast
(8, '89%', 0, 0, 89, 0),            -- Reflective
(8, '85%', 0, 0, 0, 85);            -- Balanced

-- Q9
INSERT INTO `soal_pola` (`id`, `test_id`, `question`) VALUES (9, 1, 'Berapa lama waktu yang biasanya Anda perlukan untuk menyelesaikan satu kuis?');
INSERT INTO `pilihan_pola` (`soal_id`, `option_text`, `bobot_consistent`, `bobot_fast`, `bobot_reflective`, `bobot_balanced`) VALUES
(9, '0.62 Jam', 0.62, 0, 0, 0),     -- Consistent
(9, '0.12 Jam', 0, 0.12, 0, 0),     -- Fast
(9, '0.87 Jam', 0, 0, 0.87, 0),     -- Reflective
(9, '0.37 Jam', 0, 0, 0, 0.37);     -- Balanced

-- ========================================================
-- 5. INSERT SOAL GAYA (6 SOAL)
-- ========================================================
-- Q1
INSERT INTO `soal_gaya` (`id`, `test_id`, `question`) VALUES (1, 1, 'Apa yang paling membantu Anda saat belajar hal baru?');
INSERT INTO `pilihan_gaya` (`soal_id`, `option_text`, `bobot_visual`, `bobot_auditori`, `bobot_kinestetik`) VALUES
(1, 'Melihat gambar, diagram, atau video', 5, 1, 1),
(1, 'Mendengarkan penjelasan dosen atau diskusi', 1, 5, 1),
(1, 'Mempraktikkan langsung atau melakukan simulasi', 1, 1, 5);

-- Q2
INSERT INTO `soal_gaya` (`id`, `test_id`, `question`) VALUES (2, 1, 'Jika Anda lupa mengeja sebuah kata, apa yang Anda lakukan?');
INSERT INTO `pilihan_gaya` (`soal_id`, `option_text`, `bobot_visual`, `bobot_auditori`, `bobot_kinestetik`) VALUES
(2, 'Menuliskannya untuk melihat apakah "terlihat benar"', 5, 1, 2),
(2, 'Mengucapkannya untuk mendengar apakah "terdengar benar"', 1, 5, 1),
(2, 'Mengetiknya atau menulisnya di udara (memori otot)', 1, 1, 5);

-- Q3
INSERT INTO `soal_gaya` (`id`, `test_id`, `question`) VALUES (3, 1, 'Saat Anda sedang berkonsentrasi, apa yang paling mengganggu?');
INSERT INTO `pilihan_gaya` (`soal_id`, `option_text`, `bobot_visual`, `bobot_auditori`, `bobot_kinestetik`) VALUES
(3, 'Suasana yang berantakan atau banyak gerakan', 5, 1, 1),
(3, 'Suara bising atau percakapan orang lain', 1, 5, 1),
(3, 'Duduk diam terlalu lama tanpa bergerak', 1, 1, 5);

-- Q4
INSERT INTO `soal_gaya` (`id`, `test_id`, `question`) VALUES (4, 1, 'Bagaimana cara terbaik bagi Anda untuk mengikuti instruksi?');
INSERT INTO `pilihan_gaya` (`soal_id`, `option_text`, `bobot_visual`, `bobot_auditori`, `bobot_kinestetik`) VALUES
(4, 'Melihat panduan tertulis atau peta', 5, 1, 1),
(4, 'Mendengarkan seseorang menjelaskan langkah-langkahnya', 1, 5, 1),
(4, 'Langsung mencoba sendiri sambil dipandu', 1, 1, 5);

-- Q5
INSERT INTO `soal_gaya` (`id`, `test_id`, `question`) VALUES (5, 1, 'Ketika Anda memiliki waktu luang, Anda lebih suka?');
INSERT INTO `pilihan_gaya` (`soal_id`, `option_text`, `bobot_visual`, `bobot_auditori`, `bobot_kinestetik`) VALUES
(5, 'Membaca buku atau menonton film', 5, 1, 2),
(5, 'Mendengarkan musik atau podcast', 1, 5, 1),
(5, 'Berolahraga atau membuat sesuatu (kerajinan)', 1, 1, 5);

-- Q6
INSERT INTO `soal_gaya` (`id`, `test_id`, `question`) VALUES (6, 1, 'Saat mempersiapkan ujian, apa strategi utama Anda?');
INSERT INTO `pilihan_gaya` (`soal_id`, `option_text`, `bobot_visual`, `bobot_auditori`, `bobot_kinestetik`) VALUES
(6, 'Membuat ringkasan berwarna atau Mind Map', 5, 1, 2),
(6, 'Membaca catatan dengan keras atau diskusi teman', 1, 5, 1),
(6, 'Berjalan-jalan sambil menghafal atau menulis ulang', 1, 1, 5);

-- test result
INSERT INTO `hasil_test` (`id`, `user_id`, `test_pola_id`, `test_gaya_id`) VALUES
(1, 1, 1, 1),
(2, 2, 1, 1);

INSERT INTO `insight` (`user_id`, `insight`) VALUES
(1, 'Anda cenderung belajar cepat dan visual.'),
(2, 'Anda konsisten dan mudah memahami lewat audio.');

-- motd
INSERT INTO `motd` (`motd_id`, `message`) VALUES
(1, 'Selamat Datang di Sistem Asah Learning Insight!'),
(2, 'Fitur Prediksi AI untuk Pola Belajar kini sudah aktif.'),
(3, 'Tips: Cobalah tes Gaya Belajar untuk mengetahui metode belajar terbaikmu.');

SET FOREIGN_KEY_CHECKS = 1;