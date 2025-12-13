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
(1, 'Saya cenderung memiliki pola teratur, biasanya mempelajari sekitar 3-5 materi setiap kali belajar.', 4, 0, 0, 0),       -- Consistent
(1, 'Gaya saya lebih cepat, dalam satu sesi bisa menuntaskan 6 materi atau bahkan lebih.', 0, 7, 0, 0),                      -- Fast
(1, 'Saya lebih suka mendalami, sehingga biasanya hanya 2-4 materi namun dengan fokus yang kuat.', 0, 0, 3, 0),              -- Reflective
(1, 'Pola saya seimbang, rata-rata 4-6 materi per sesi dengan jadwal yang fleksibel.', 0, 0, 0, 5);                          -- Balanced

-- Q2
INSERT INTO `soal_pola` (`id`, `test_id`, `question`) VALUES (2, 1, 'Dalam satu jam belajar, berapa banyak materi biasanya Anda kuasai?');
INSERT INTO `pilihan_pola` (`soal_id`, `option_text`, `bobot_consistent`, `bobot_fast`, `bobot_reflective`, `bobot_balanced`) VALUES
(2, 'Biasanya saya menuntaskan sekitar 1 materi per jam, dengan alur belajar yang cukup nyaman.', 1.0, 0, 0, 0),    -- Consistent
(2, 'Dalam tempo cepat, saya bisa menguasai sekitar 1 sampai 2 materi per jam, tanpa banyak pengulangan.', 0, 2.0, 0, 0),    -- Fast
(2, 'Saya lebih suka mendalami, sehingga hanya setengah hingga 1 materi per jam, tetapi benar-benar dipahami secara menyeluruh.', 0, 0, 0.5, 0),    -- Reflective
(2, 'Rata-rata saya mampu menyelesaikan sekitar 1 hingga 1,5 materi per jam, cukup fleksibel menyesuaikan kondisi belajar.', 0, 0, 0, 1.5);    -- Balanced

-- Q3
INSERT INTO `soal_pola` (`id`, `test_id`, `question`) VALUES (3, 1, 'Dalam satu minggu, seberapa sering Anda biasanya melakukan sesi belajar?');
INSERT INTO `pilihan_pola` (`soal_id`, `option_text`, `bobot_consistent`, `bobot_fast`, `bobot_reflective`, `bobot_balanced`) VALUES
(3, 'Hampir setiap hari saya meluangkan waktu belajar, biasanya antara 5 hingga 7 kali dalam seminggu supaya tetap terbiasa dan tidak mudah lupa.', 6, 0, 0, 0),          -- Consistent
(3, 'Saya lebih sering belajar secara cepat, sekitar 3-5 kali seminggu, biasanya menyesuaikan waktu luang dan energi yang ada.', 0, 4, 0, 0),          -- Fast
(3, 'Belajar bagi saya lebih mendalam, sehingga frekuensinya lebih sedikit, hanya 3-4 kali seminggu namun dengan durasi panjang.', 0, 0, 3, 0),          -- Reflective
(3, 'Saya menjaga keseimbangan, rata-rata 4-5 kali seminggu, menyesuaikan dengan jadwal dan kebutuhan.', 0, 0, 0, 5);          -- Balanced

-- Q4
INSERT INTO `soal_pola` (`id`, `test_id`, `question`) VALUES (4, 1, 'Dalam satu sesi belajar, berapa lama biasanya Anda meluangkan waktu?');
INSERT INTO `pilihan_pola` (`soal_id`, `option_text`, `bobot_consistent`, `bobot_fast`, `bobot_reflective`, `bobot_balanced`) VALUES
(4, 'Biasanya saya belajar sekitar 1-2 jam, cukup nyaman dan tidak terasa terlalu berat.', 0.16, 0, 0, 0),     -- Consistent
(4, 'Sesi belajar saya cenderung singkat, sekitar 1-1,5 jam, lebih suka sesi singkat tapi fokus.', 0, 0.08, 0, 0),     -- Fast
(4, 'Kadang saya bisa belajar lebih lama, sekitar 3-4 jam, karena ingin mendalami materi secara menyeluruh.', 0, 0, 0.83, 0),     -- Reflective
(4, 'Rata-rata saya meluangkan waktu sekitar 2-3 jam, kadang serius, kadang santai, tergantung kebutuhan.', 0, 0, 0, 0.5);       -- Balanced

-- Q5
INSERT INTO `soal_pola` (`id`, `test_id`, `question`) VALUES (5, 1, 'Dalam satu minggu, seberapa sering Anda biasanya mengulang kembali materi yang sudah dipelajari?');
INSERT INTO `pilihan_pola` (`soal_id`, `option_text`, `bobot_consistent`, `bobot_fast`, `bobot_reflective`, `bobot_balanced`) VALUES
(5, 'Saya biasanya mengulang materi sekitar 2-3 kali dalam seminggu, cukup rutin supaya tetap ingat dan tidak mudah lupa.', 2, 0, 0, 0),          -- Consistent
(5, 'Pengulangan saya jarang, mungkin hanya sekali seminggu atau hampir tidak pernah mengulang, karena lebih fokus pada materi baru.', 0, 1, 0, 0),          -- Fast
(5, 'Saya sering kembali ke materi lama, bisa 4 kali atau lebih dalam seminggu, untuk memastikan pemahaman benar-benar mendalam.', 0, 0, 5, 0),          -- Reflective
(5, 'Rata-rata saya melakukan pengulangan 2-3 kali seminggu, kadang fokus ke hal baru, kadang balik lagi ke materi lama supaya tetap seimbang.', 0, 0, 0, 3);          -- Balanced

-- Q6
INSERT INTO `soal_pola` (`id`, `test_id`, `question`) VALUES (6, 1, 'Berapa lama biasanya Anda membutuhkan waktu untuk mengerjakan submission?');
INSERT INTO `pilihan_pola` (`soal_id`, `option_text`, `bobot_consistent`, `bobot_fast`, `bobot_reflective`, `bobot_balanced`) VALUES
(6, 'Biasanya saya menyelesaikan submission dalam waktu sekitar 4 sampai 6 jam, cukup stabil dan tidak terlalu terburu-buru.', 0.37, 0, 0, 0),     -- Consistent
(6, 'Saya cenderung lebih cepat, umumnya hanya membutuhkan sekitar 2 sampai 4 jam untuk menyelesaikan submission.', 0, 0.12, 0, 0),     -- Fast
(6, 'Kadang saya menghabiskan waktu cukup lama, bisa mencapai 6 sampai 10 jam, karena ingin meninjau dan mendalami setiap detail sebelum mengumpulkan.', 0, 0, 0.75, 0),     -- Reflective
(6, 'Rata-rata saya membutuhkan sekitar 4 sampai 6 jam, kadang fokus pada ketelitian, kadang lebih ke efisiensi, jadi hasilnya tetap seimbang.', 0, 0, 0, 0.35);     -- Balanced

-- Q7
INSERT INTO `soal_pola` (`id`, `test_id`, `question`) VALUES (7, 1, 'Biasanya berapa bintang yang Anda peroleh dari hasil submission Anda?');
INSERT INTO `pilihan_pola` (`soal_id`, `option_text`, `bobot_consistent`, `bobot_fast`, `bobot_reflective`, `bobot_balanced`) VALUES
(7, 'Biasanya saya dapat sekitar 1 sampai 3 bintang, hasilnya cukup stabil walaupun kadang naik turun.', 1, 0, 0, 0),       -- Consistent
(7, 'Saya sering meraih 2 sampai 4 bintang, karena biasanya bisa menyelesaikan submission dengan cepat dan lancar.', 0, 3, 0, 0),       -- Fast
(7, 'Nilai saya umumnya ada di kisaran 2 sampai 4 bintang, karena saya lebih teliti dan suka mendalami detail sebelum selesai.', 0, 0, 4, 0),       -- Reflective
(7, 'Rata-rata saya memperoleh 1 sampai 3 bintang, kadang hasilnya bagus, kadang biasa saja, tapi tetap seimbang.', 0, 0, 0, 2);       -- Balanced

-- Q8
INSERT INTO `soal_pola` (`id`, `test_id`, `question`) VALUES (8, 1, 'Biasanya, berapa persen nilai kuis yang Anda peroleh?');
INSERT INTO `pilihan_pola` (`soal_id`, `option_text`, `bobot_consistent`, `bobot_fast`, `bobot_reflective`, `bobot_balanced`) VALUES
(8, 'Nilai saya biasanya ada di kisaran 75-85%, cukup stabil walaupun kadang naik turun.', 83, 0, 0, 0),            -- Consistent
(8, 'Saya sering dapat nilai sekitar 85-95%, karena biasanya bisa cepat memahami soal-soal kuis.', 0, 95, 0, 0),            -- Fast
(8, 'Nilai saya umumnya berada di 80-95%, biasanya karena saya lebih teliti dan suka mendalami materi sebelum menjawab.', 0, 0, 89, 0),            -- Reflective
(8, 'Rata-rata nilai saya sekitar 80-90%, biasanya cukup seimbang—kadang cepat selesai, kadang lebih hati-hati, tapi hasilnya tetap oke.', 0, 0, 0, 85);            -- Balanced

-- Q9
INSERT INTO `soal_pola` (`id`, `test_id`, `question`) VALUES (9, 1, 'Berapa lama waktu yang biasanya Anda perlukan untuk menyelesaikan satu kuis?');
INSERT INTO `pilihan_pola` (`soal_id`, `option_text`, `bobot_consistent`, `bobot_fast`, `bobot_reflective`, `bobot_balanced`) VALUES
(9, 'Biasanya saya menyelesaikan kuis dalam waktu sekitar 15-20 menit, umumnya cukup tenang dan tidak terburu-buru.', 0.62, 0, 0, 0),     -- Consistent
(9, 'Saya cenderung lebih cepat, umumnya hanya membutuhkan sekitar 5-10 menit untuk menuntaskan kuis.', 0, 0.12, 0, 0),     -- Fast
(9, 'Kadang saya menghabiskan waktu lebih lama, sekitar 20-25 menit, karena saya suka meninjau kembali setiap soal dengan teliti.', 0, 0, 0.87, 0),     -- Reflective
(9, 'Rata-rata saya menyelesaikan kuis dalam waktu 10-15 menit, kadang cepat, kadang lebih hati-hati, tapi tetap selesai dengan baik.', 0, 0, 0, 0.37);     -- Balanced

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