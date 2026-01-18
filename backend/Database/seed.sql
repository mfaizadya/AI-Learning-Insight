-- ============================================================================
-- CerdasKu AI - Seed Data
-- ============================================================================
-- Version: 2.0.0
-- Last Updated: 2026-01-18
-- Description: Complete seed data including questions, choices, and production
--              backup from RDS (40 users, 63 test results, 158 insights)
-- ============================================================================

USE `capstone-db`;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- SECTION 1: TEST DEFINITIONS
-- ============================================================================

INSERT INTO `test_pola` (`id`, `name`) VALUES 
  (1, 'Tes Pola Belajar Dasar');

INSERT INTO `test_gaya` (`id`, `name`) VALUES 
  (1, 'Tes Gaya Belajar Dasar');

-- ============================================================================
-- SECTION 2: LEARNING PATTERN QUESTIONS (9 Soal)
-- ============================================================================

INSERT INTO `soal_pola` (`id`, `test_id`, `question`) VALUES
  (1, 1, 'Dalam satu sesi belajar berapa banyak materi biasanya Anda pelajari?'),
  (2, 1, 'Dalam satu jam belajar, berapa banyak materi biasanya Anda kuasai?'),
  (3, 1, 'Dalam satu minggu, seberapa sering Anda biasanya melakukan sesi belajar?'),
  (4, 1, 'Dalam satu sesi belajar, berapa lama biasanya Anda meluangkan waktu?'),
  (5, 1, 'Dalam satu minggu, seberapa sering Anda biasanya mengulang kembali materi yang sudah dipelajari?'),
  (6, 1, 'Berapa lama biasanya Anda membutuhkan waktu untuk mengerjakan submission?'),
  (7, 1, 'Biasanya berapa bintang yang Anda peroleh dari hasil submission Anda?'),
  (8, 1, 'Biasanya, berapa persen nilai kuis yang Anda peroleh?'),
  (9, 1, 'Berapa lama waktu yang biasanya Anda perlukan untuk menyelesaikan satu kuis?');

-- ============================================================================
-- SECTION 3: LEARNING PATTERN CHOICES (36 Pilihan - 4 per Soal)
-- ============================================================================

INSERT INTO `pilihan_pola` (`id`, `soal_id`, `option_text`, `bobot_consistent`, `bobot_fast`, `bobot_reflective`, `bobot_balanced`) VALUES
  -- Q1: Jumlah materi per sesi
  (1, 1, 'Saya cenderung memiliki pola teratur, biasanya mempelajari sekitar 3-5 materi setiap kali belajar.', 4, 0, 0, 0),
  (2, 1, 'Gaya saya lebih cepat, dalam satu sesi bisa menuntaskan 6 materi atau bahkan lebih.', 0, 7, 0, 0),
  (3, 1, 'Saya lebih suka mendalami, sehingga biasanya hanya 2-4 materi namun dengan fokus yang kuat.', 0, 0, 3, 0),
  (4, 1, 'Pola saya seimbang, rata-rata 4-6 materi per sesi dengan jadwal yang fleksibel.', 0, 0, 0, 5),
  
  -- Q2: Materi per jam
  (5, 2, 'Biasanya saya menuntaskan sekitar 1 materi per jam, dengan alur belajar yang cukup nyaman.', 1, 0, 0, 0),
  (6, 2, 'Dalam tempo cepat, saya bisa menguasai sekitar 1 sampai 2 materi per jam, tanpa banyak pengulangan.', 0, 2, 0, 0),
  (7, 2, 'Saya lebih suka mendalami, sehingga hanya setengah hingga 1 materi per jam, tetapi benar-benar dipahami secara menyeluruh.', 0, 0, 0.5, 0),
  (8, 2, 'Rata-rata saya mampu menyelesaikan sekitar 1 hingga 1,5 materi per jam, cukup fleksibel menyesuaikan kondisi belajar.', 0, 0, 0, 1.5),
  
  -- Q3: Frekuensi belajar per minggu
  (9, 3, 'Hampir setiap hari saya meluangkan waktu belajar, biasanya antara 5 hingga 7 kali dalam seminggu supaya tetap terbiasa dan tidak mudah lupa.', 6, 0, 0, 0),
  (10, 3, 'Saya lebih sering belajar secara cepat, sekitar 3-5 kali seminggu, biasanya menyesuaikan waktu luang dan energi yang ada.', 0, 4, 0, 0),
  (11, 3, 'Belajar bagi saya lebih mendalam, sehingga frekuensinya lebih sedikit, hanya 3-4 kali seminggu namun dengan durasi panjang.', 0, 0, 3, 0),
  (12, 3, 'Saya menjaga keseimbangan, rata-rata 4-5 kali seminggu, menyesuaikan dengan jadwal dan kebutuhan.', 0, 0, 0, 5),
  
  -- Q4: Durasi per sesi
  (13, 4, 'Biasanya saya belajar sekitar 1-2 jam, cukup nyaman dan tidak terasa terlalu berat.', 0.16, 0, 0, 0),
  (14, 4, 'Sesi belajar saya cenderung singkat, sekitar 1-1,5 jam, lebih suka sesi singkat tapi fokus.', 0, 0.08, 0, 0),
  (15, 4, 'Kadang saya bisa belajar lebih lama, sekitar 3-4 jam, karena ingin mendalami materi secara menyeluruh.', 0, 0, 0.83, 0),
  (16, 4, 'Rata-rata saya meluangkan waktu sekitar 2-3 jam, kadang serius, kadang santai, tergantung kebutuhan.', 0, 0, 0, 0.5),
  
  -- Q5: Frekuensi pengulangan
  (17, 5, 'Saya biasanya mengulang materi sekitar 2-3 kali dalam seminggu, cukup rutin supaya tetap ingat dan tidak mudah lupa.', 2, 0, 0, 0),
  (18, 5, 'Pengulangan saya jarang, mungkin hanya sekali seminggu atau hampir tidak pernah mengulang, karena lebih fokus pada materi baru.', 0, 1, 0, 0),
  (19, 5, 'Saya sering kembali ke materi lama, bisa 4 kali atau lebih dalam seminggu, untuk memastikan pemahaman benar-benar mendalam.', 0, 0, 5, 0),
  (20, 5, 'Rata-rata saya melakukan pengulangan 2-3 kali seminggu, kadang fokus ke hal baru, kadang balik lagi ke materi lama supaya tetap seimbang.', 0, 0, 0, 3),
  
  -- Q6: Waktu submission
  (21, 6, 'Biasanya saya menyelesaikan submission dalam waktu sekitar 4 sampai 6 jam, cukup stabil dan tidak terlalu terburu-buru.', 0.37, 0, 0, 0),
  (22, 6, 'Saya cenderung lebih cepat, umumnya hanya membutuhkan sekitar 2 sampai 4 jam untuk menyelesaikan submission.', 0, 0.12, 0, 0),
  (23, 6, 'Kadang saya menghabiskan waktu cukup lama, bisa mencapai 6 sampai 10 jam, karena ingin meninjau dan mendalami setiap detail sebelum mengumpulkan.', 0, 0, 0.75, 0),
  (24, 6, 'Rata-rata saya membutuhkan sekitar 4 sampai 6 jam, kadang fokus pada ketelitian, kadang lebih ke efisiensi, jadi hasilnya tetap seimbang.', 0, 0, 0, 0.35),
  
  -- Q7: Bintang submission
  (25, 7, 'Biasanya saya dapat sekitar 1 sampai 3 bintang, hasilnya cukup stabil walaupun kadang naik turun.', 1, 0, 0, 0),
  (26, 7, 'Saya sering meraih 2 sampai 4 bintang, karena biasanya bisa menyelesaikan submission dengan cepat dan lancar.', 0, 3, 0, 0),
  (27, 7, 'Nilai saya umumnya ada di kisaran 2 sampai 4 bintang, karena saya lebih teliti dan suka mendalami detail sebelum selesai.', 0, 0, 4, 0),
  (28, 7, 'Rata-rata saya memperoleh 1 sampai 3 bintang, kadang hasilnya bagus, kadang biasa saja, tapi tetap seimbang.', 0, 0, 0, 2),
  
  -- Q8: Nilai kuis
  (29, 8, 'Nilai saya biasanya ada di kisaran 75-85%, cukup stabil walaupun kadang naik turun.', 83, 0, 0, 0),
  (30, 8, 'Saya sering dapat nilai sekitar 85-95%, karena biasanya bisa cepat memahami soal-soal kuis.', 0, 95, 0, 0),
  (31, 8, 'Nilai saya umumnya berada di 80-95%, biasanya karena saya lebih teliti dan suka mendalami materi sebelum menjawab.', 0, 0, 89, 0),
  (32, 8, 'Rata-rata nilai saya sekitar 80-90%, biasanya cukup seimbang—kadang cepat selesai, kadang lebih hati-hati, tapi hasilnya tetap oke.', 0, 0, 0, 85),
  
  -- Q9: Waktu kuis
  (33, 9, 'Biasanya saya menyelesaikan kuis dalam waktu sekitar 15-20 menit, umumnya cukup tenang dan tidak terburu-buru.', 0.62, 0, 0, 0),
  (34, 9, 'Saya cenderung lebih cepat, umumnya hanya membutuhkan sekitar 5-10 menit untuk menuntaskan kuis.', 0, 0.12, 0, 0),
  (35, 9, 'Kadang saya menghabiskan waktu lebih lama, sekitar 20-25 menit, karena saya suka meninjau kembali setiap soal dengan teliti.', 0, 0, 0.87, 0),
  (36, 9, 'Rata-rata saya menyelesaikan kuis dalam waktu 10-15 menit, kadang cepat, kadang lebih hati-hati, tapi tetap selesai dengan baik.', 0, 0, 0, 0.37);

-- ============================================================================
-- SECTION 4: LEARNING STYLE QUESTIONS (6 Soal)
-- ============================================================================

INSERT INTO `soal_gaya` (`id`, `test_id`, `question`) VALUES
  (1, 1, 'Apa yang paling membantu Anda saat belajar hal baru?'),
  (2, 1, 'Jika Anda lupa mengeja sebuah kata, apa yang Anda lakukan?'),
  (3, 1, 'Saat Anda sedang berkonsentrasi, apa yang paling mengganggu?'),
  (4, 1, 'Bagaimana cara terbaik bagi Anda untuk mengikuti instruksi?'),
  (5, 1, 'Ketika Anda memiliki waktu luang, Anda lebih suka?'),
  (6, 1, 'Saat mempersiapkan ujian, apa strategi utama Anda?');

-- ============================================================================
-- SECTION 5: LEARNING STYLE CHOICES (18 Pilihan - 3 per Soal)
-- ============================================================================

INSERT INTO `pilihan_gaya` (`id`, `soal_id`, `option_text`, `bobot_visual`, `bobot_auditori`, `bobot_kinestetik`) VALUES
  -- Q1: Cara belajar hal baru
  (1, 1, 'Melihat gambar, diagram, atau video', 5, 1, 1),
  (2, 1, 'Mendengarkan penjelasan dosen atau diskusi', 1, 5, 1),
  (3, 1, 'Mempraktikkan langsung atau melakukan simulasi', 1, 1, 5),
  
  -- Q2: Mengeja kata
  (4, 2, 'Menuliskannya untuk melihat apakah "terlihat benar"', 5, 1, 2),
  (5, 2, 'Mengucapkannya untuk mendengar apakah "terdengar benar"', 1, 5, 1),
  (6, 2, 'Mengetiknya atau menulisnya di udara (memori otot)', 1, 1, 5),
  
  -- Q3: Gangguan konsentrasi
  (7, 3, 'Suasana yang berantakan atau banyak gerakan', 5, 1, 1),
  (8, 3, 'Suara bising atau percakapan orang lain', 1, 5, 1),
  (9, 3, 'Duduk diam terlalu lama tanpa bergerak', 1, 1, 5),
  
  -- Q4: Mengikuti instruksi
  (10, 4, 'Melihat panduan tertulis atau peta', 5, 1, 1),
  (11, 4, 'Mendengarkan seseorang menjelaskan langkah-langkahnya', 1, 5, 1),
  (12, 4, 'Langsung mencoba sendiri sambil dipandu', 1, 1, 5),
  
  -- Q5: Waktu luang
  (13, 5, 'Membaca buku atau menonton film', 5, 1, 2),
  (14, 5, 'Mendengarkan musik atau podcast', 1, 5, 1),
  (15, 5, 'Berolahraga atau membuat sesuatu (kerajinan)', 1, 1, 5),
  
  -- Q6: Strategi ujian
  (16, 6, 'Membuat ringkasan berwarna atau Mind Map', 5, 1, 2),
  (17, 6, 'Membaca catatan dengan keras atau diskusi teman', 1, 5, 1),
  (18, 6, 'Berjalan-jalan sambil menghafal atau menulis ulang', 1, 1, 5);

-- ============================================================================
-- SECTION 6: MESSAGE OF THE DAY
-- ============================================================================

INSERT INTO `motd` (`motd_id`, `message`) VALUES
  (1, 'Selamat Datang di Sistem Asah Learning Insight!'),
  (2, 'Fitur Prediksi AI untuk Pola Belajar kini sudah aktif.'),
  (3, 'Tips: Cobalah tes Gaya Belajar untuk mengetahui metode belajar terbaikmu.');

-- ============================================================================
-- SECTION 7: USERS DATA (From RDS Production Backup - 40 Users)
-- ============================================================================

INSERT INTO `users` (`id`, `email`, `username`, `password`, `image`, `role`, `learning_style`, `learning_pattern`, `created_at`, `updated_at`, `deleted_at`) VALUES
  (1, 'andi@example.com', 'andi', '$2b$10$YourHashForPass123Here', NULL, 'user', 'visual', 'fast', '2025-12-14 01:17:41', '2025-12-14 01:17:41', NULL),
  (2, 'budi@example.com', 'budi', '$2b$10$YourHashForPass123Here', NULL, 'user', 'auditori', 'consistent', '2025-12-14 01:17:41', '2025-12-14 01:17:41', NULL),
  (3, 'sari@example.com', 'sari', '$2b$10$YourHashForPass123Here', NULL, 'user', 'kinestetik', 'reflective', '2025-12-14 01:17:41', '2025-12-14 01:17:41', NULL),
  (4, 'admin@example.com', 'admin', '$2b$10$YourHashForAdminPassHere', NULL, 'admin', 'visual', 'balanced', '2025-12-14 01:17:41', '2025-12-14 01:17:41', NULL),
  (5, 'tina@example.com', 'tina', '$2b$10$YourHashForPass123Here', NULL, 'user', 'auditori', 'fast', '2025-12-14 01:17:41', '2025-12-14 01:17:41', NULL),
  (6, 'niokagi@gmail.com', 'niokagi', '$2b$10$scuQw5vEEMZ1tGQPqlQaYe2AYhbJtEl9SccBT90hJU7cJMIz97y8G', NULL, 'user', 'auditori', 'balanced', '2025-12-14 01:18:12', '2026-01-14 10:21:57', NULL),
  (7, 'tesemail@example.com', 'testusername', '$2b$10$SxGIDU/Dr5Xny6rD1flT4OHP3c028G6CpmDd4umwn5YnlE9rsSdry', NULL, 'user', 'visual', 'fast', '2025-12-14 04:23:29', '2025-12-14 04:50:40', NULL),
  (8, 'boistudent1@gmail.com', 'Heri', '$2b$10$Il2Vrw3XfTwCXm8MuraTu.Da4FSVVKsvIWtnKH.L6u1luitczlu9C', NULL, 'user', 'kinestetik', 'reflective', '2025-12-14 04:36:10', '2025-12-14 04:37:29', NULL),
  (9, 'niokagiadhim@gmail', 'Apple Crumbles', '$2b$10$a5S.05kUrWF9fQd.H9x/SuCvUAhn9lJuDGlnxCpI8AMQqpMqTG1a6', NULL, 'user', NULL, NULL, '2025-12-14 05:11:42', '2025-12-14 05:11:42', NULL),
  (10, 'ayam111@gmail.com', 'Ayam Penyet', '$2b$10$TcEYu38AGUpUxhNjwQEe4.79fOeynjZdI00gsDPY3o4r8gk/e1KZW', NULL, 'user', 'auditori', 'fast', '2025-12-14 05:11:58', '2025-12-14 07:59:23', NULL),
  (11, 'reza@gmail.com', 'Ayam Penyet', '$2b$10$N/r.H1yeQzaDQX6COgdXw.U3ouYM/fULstJ00NPjypCs7lPOjC6ca', NULL, 'user', 'kinestetik', 'reflective', '2025-12-14 05:19:39', '2025-12-15 03:40:35', NULL),
  (12, 'niokagiyyy@gmail.com', 'omkegams', '$2b$10$LKvs4XwbuvI3SDhqlRcLCeFbOSVUMLWdwXvVEyyysvojdPhtAZv66', NULL, 'user', NULL, NULL, '2025-12-14 05:35:52', '2025-12-14 05:35:52', NULL),
  (13, 'omke@gmail.com', 'budianjing', '$2b$10$kOPo.xS4mffSklzvP0VkUePLa5JA1x9wtYciYRaBp6qugFRU1USgS', NULL, 'user', 'kinestetik', 'balanced', '2025-12-14 05:36:16', '2025-12-14 05:42:34', NULL),
  (14, 'omkeomke@gmail.com', 'okoko', '$2b$10$nRbLztpxvIkZ.bT3eA25DepbB2/31sGwx86l3g6Ilv7UQvIOeTPoi', NULL, 'user', 'kinestetik', 'balanced', '2025-12-14 08:36:38', '2025-12-14 09:45:47', NULL),
  (15, 'Ayamnyet@gmail.com', 'Ayam Penyet', '$2b$10$O3uPZaucSZa1ByCe.xY/u.ktV54i8sbLKIV2Aow59f5modHPANnXS', NULL, 'user', NULL, NULL, '2025-12-14 09:58:17', '2025-12-14 09:58:17', NULL),
  (16, 'omkegams@gmail.com', 'omkegams@gmail.com', '$2b$10$uDOwQHlYQpWHrLzVy98Oe.pkyPgEIm1hlVSIo3B504wBIRzU6UPRO', NULL, 'user', 'kinestetik', 'balanced', '2025-12-14 09:59:42', '2025-12-14 10:01:30', NULL),
  (17, 'adhimniokagi@it.student.pens.ac.id', 'omkegamser', '$2b$10$5K7BT.HbJzEOAke7ySl7r.GNiTWzHTC.I9Ror6uG5cEtgR.glGwGe', NULL, 'user', 'visual', 'balanced', '2025-12-14 10:24:53', '2025-12-14 10:44:08', NULL),
  (18, 'strictnioka@gmail.com', 'fufufafas', '$2b$10$SBOc.jAwP/A4zHohtmQpceata4Qd99hZU.sVNgolxFrj.cOl.yXU2', NULL, 'user', 'kinestetik', 'balanced', '2025-12-14 11:16:25', '2025-12-14 15:58:47', NULL),
  (19, 'paisadya@example.com', 'paisAdya', '$2b$10$Huj/1diIV5LMvTwBQSFTqOY8I4ZR5JZfWgExhiMx6FFaSCvfoEiUu', NULL, 'user', 'visual', 'fast', '2025-12-14 11:25:27', '2025-12-14 11:32:43', NULL),
  (20, 'mfaizadya@example.com', 'mfaizadya', '$2b$10$dX/NvBy.MLXzcIJV/SIUD.UA5x4NKWHw2iSkBL0XVvmb8BaE3Rej6', NULL, 'user', 'visual', 'consistent', '2025-12-14 15:57:16', '2025-12-14 16:01:04', NULL),
  (21, 'johnnn@gmail.com', 'Jonndueue', '$2b$10$uG6XSGtsR1.exkQYwknn4etIcxHLgSU7RmUF5tPxh5id3f/YSkByK', NULL, 'user', 'kinestetik', 'balanced', '2025-12-14 16:02:49', '2025-12-14 16:05:10', NULL),
  (22, 'faiz123@example.com', 'paisss', '$2b$10$PrRRNbKOPUE3sppvTjqdleghNMuJ2fGMmSpMA2mwriUQ3a2j7ctn2', NULL, 'user', 'visual', 'consistent', '2025-12-14 16:45:32', '2025-12-18 17:11:39', NULL),
  (23, 'johns@gmail.com', 'johnlennon', '$2b$10$Q7t.OTNtRGOXCdH5GXI37.bnUubl4o9g5yTF4VIVBONhRV5RAoWOW', NULL, 'user', 'auditori', 'reflective', '2025-12-15 04:01:45', '2025-12-15 06:55:02', NULL),
  (24, 'test_user@example.com', 'andi_00', '$2b$10$gqWRryz6MYugout1QN8hUeb7coHg9EaYgUolxrCY1K/LH8xTinflm', NULL, 'user', 'visual', 'balanced', '2025-12-15 05:28:01', '2025-12-15 12:18:19', NULL),
  (25, 'fufufafa@gmail.com', 'fufufafa', '$2b$10$3m.O3zFvC60hIQ71ay6M5uRGTTcWE6A2jBvVqFYupf5Q9EuFZYAgS', NULL, 'user', NULL, NULL, '2025-12-15 08:02:26', '2025-12-15 08:02:26', NULL),
  (26, 'test2@test.com', 'abcde_', '$2b$10$xwEzv1FJm0ATyBR2E9wEs.ZsLFAcJtLeECYUz8QQJ4dKmmoYwpKEO', NULL, 'user', 'auditori', 'fast', '2025-12-15 12:52:05', '2025-12-15 21:34:05', NULL),
  (27, 'omkeomkeomke@gmail.com', 'omkeoo', '$2b$10$WDf9eKai9YnZClQmsoVdz.klKPZ3NuyvmHe9GJCcAx3dbAulr2M3m', NULL, 'user', 'kinestetik', 'reflective', '2025-12-15 21:08:04', '2025-12-15 22:08:54', NULL),
  (28, 'yyyyy@gmail.com', 'yyyyy@gmail.com', '$2b$10$iQHHUTGsrfBxp6oCre7mEOc1ijU4AFI6IhXx4tjGzO/W.N29LY7oi', NULL, 'user', NULL, NULL, '2025-12-15 22:14:19', '2025-12-15 22:14:19', NULL),
  (29, 'omkes@gmail.com', 'omkegamsers', '$2b$10$EDYzFcgXzu5jxnjoLtP0FOKGfgM/G.YZWLvtY3bMnt/swjnsq/v.q', NULL, 'user', NULL, NULL, '2025-12-16 06:49:08', '2025-12-16 06:50:23', NULL),
  (30, 'user_abc@gmail.com', 'user_abc', '$2b$10$/ZNzbWnrPmwSwYxSfSuNVu4mJpPjJTW//MpC7P3EA1ZKueIJ3PDkq', NULL, 'user', NULL, NULL, '2025-12-17 08:43:19', '2025-12-17 08:43:19', NULL),
  (31, 'yyyy@gmail.com', 'yyyy', '$2b$10$luQM596tLHA5S9Ut4WVZLuCa5PGh8W.X5RZiazDkrhONKT1tvbJv2', NULL, 'user', 'auditori', 'balanced', '2025-12-17 18:18:41', '2025-12-17 18:19:32', NULL),
  (32, 'thorfin@gmail.com', 'thorfin', '$2b$10$3WvylLOLVoTfzkEpLTS8z.VCbuiwswKGeeACqBoN4/62Bk0PvYcu.', NULL, 'user', 'visual', 'balanced', '2025-12-17 19:34:33', '2025-12-17 21:51:57', NULL),
  (33, 'gunners@test.com', 'gunners', '$2b$10$rsfXaeUDGAFJXq92Rph4Ce4LLyFRQxK6M6h5UTfP9zT5kRnZD2MRK', NULL, 'user', 'visual', 'balanced', '2025-12-17 21:55:29', '2025-12-17 22:11:35', NULL),
  (34, 'robber@gmail.com', 'robber', '$2b$10$2YSrE7sVBt0ks2CfkIFtneZOLIbvWSN8TGriQkaB4GtSDMz59StM6', NULL, 'user', 'kinestetik', 'balanced', '2025-12-17 22:12:37', '2025-12-17 22:15:02', NULL),
  (35, 'demo@test.com', 'demos', '$2b$10$baq7PdrS.NO0NPPcQEiAH.wlOr2PIHmGn7Ww7Hc0iY1lFBv5.zn2G', NULL, 'user', NULL, NULL, '2025-12-19 08:29:28', '2025-12-19 12:11:41', NULL),
  (36, 'randy.harkediansa@gmail.com', 'harkediansa', '$2b$10$Mu/0sz51dgI5CjEk3xzhpuBdrKT2f7aDIYD0Tpkk1J.Kw20b44qo6', NULL, 'user', 'kinestetik', 'balanced', '2025-12-19 09:23:07', '2025-12-19 09:24:51', NULL),
  (37, 'testrate1@gmail.com', 'testrate1', '$2b$10$Ha4Xfwc/KHGR.QB.PwInqeP3JITeUfbTqR6yK6Naiq/eReKt1PR/O', NULL, 'user', NULL, NULL, '2025-12-26 20:43:53', '2025-12-26 20:43:53', NULL),
  (38, 'rrrrrrr@gmail.com', 'Rrrrrrrr', '$2b$10$Vy5GZ2QNVmqzv1VHA0R3muXnSpScJTC2NKzDFeYoj/MDgA5m1u8jW', NULL, 'user', NULL, NULL, '2025-12-26 22:17:31', '2025-12-26 22:17:31', NULL),
  (39, 'rrrrrrttr@gmail.com', 'rrrrrrr@gmail.com', '$2b$10$vt.1eUIptz8pswiXse7luunvzgKjPOgveYeW5qBfh494tVNdu3iqy', NULL, 'user', NULL, NULL, '2025-12-26 22:17:44', '2025-12-26 22:17:44', NULL),
  (40, 'Koruko@gmail.com', 'mahasiswa', '$2b$10$P65PS9opBW0fLOc/kEu1O.uuPfEHjei1QvwzazDvmoTXaseE8F78q', NULL, 'user', 'auditori', 'reflective', '2025-12-27 08:24:14', '2025-12-27 08:24:58', NULL);

-- ============================================================================
-- SECTION 8: HASIL TEST DATA (63 Records from RDS)
-- ============================================================================

INSERT INTO `hasil_test` (`id`, `user_id`, `test_pola_id`, `test_gaya_id`, `timestamp`, `label_pola`, `label_gaya`, `persentase_gaya`) VALUES
  (1, 1, 1, 1, '2025-12-14 01:17:41', NULL, NULL, NULL),
  (2, 2, 1, 1, '2025-12-14 01:17:41', NULL, NULL, NULL),
  (3, 6, 1, 1, '2025-12-14 01:18:50', 'Fast Learner', 'Auditori', 62),
  (4, 6, 1, 1, '2025-12-14 04:30:04', 'Balanced Learner', 'Kinestetik', 71),
  (5, 7, 1, 1, '2025-12-14 04:32:43', 'Consistent Learner', 'Visual', 67),
  (6, 8, 1, 1, '2025-12-14 04:37:29', 'Reflective Learner', 'Kinestetik', 71),
  (7, 7, 1, 1, '2025-12-14 04:50:40', 'Fast Learner', 'Visual', 50),
  (8, 6, 1, 1, '2025-12-14 05:07:39', 'Fast Learner', 'Auditori', 71),
  (9, 10, 1, 1, '2025-12-14 05:15:54', 'Balanced Learner', 'Kinestetik', 62),
  (10, 13, 1, 1, '2025-12-14 05:37:34', 'Fast Learner', 'Kinestetik', 62),
  (11, 13, 1, 1, '2025-12-14 05:42:34', 'Balanced Learner', 'Kinestetik', 71),
  (12, 11, 1, NULL, '2025-12-14 06:07:33', 'Fast Learner', NULL, NULL),
  (13, 11, 1, NULL, '2025-12-14 06:07:35', 'Fast Learner', NULL, NULL),
  (14, 10, 1, 1, '2025-12-14 06:09:48', 'Balanced Learner', 'Kinestetik', 71),
  (15, 10, 1, 1, '2025-12-14 06:12:04', 'Balanced Learner', 'Kinestetik', 71),
  (16, 10, 1, 1, '2025-12-14 06:14:49', 'Balanced Learner', 'Kinestetik', 71),
  (17, 10, 1, 1, '2025-12-14 06:16:10', 'Balanced Learner', 'Kinestetik', 71),
  (18, 10, 1, 1, '2025-12-14 06:17:08', 'Balanced Learner', 'Visual', 42),
  (19, 10, 1, NULL, '2025-12-14 06:18:48', 'Fast Learner', NULL, NULL),
  (20, 10, 1, 1, '2025-12-14 06:36:57', 'Balanced Learner', 'Kinestetik', 62),
  (21, 10, 1, 1, '2025-12-14 07:59:22', 'Fast Learner', 'Auditori', 51),
  (22, 14, 1, NULL, '2025-12-14 09:20:10', 'Fast Learner', NULL, NULL),
  (23, 14, 1, 1, '2025-12-14 09:24:31', 'Balanced Learner', 'Auditori', 52),
  (24, 14, 1, 1, '2025-12-14 09:25:22', 'Fast Learner', 'Auditori', 71),
  (25, 14, 1, 1, '2025-12-14 09:26:21', 'Consistent Learner', 'Kinestetik', 53),
  (26, 14, 1, 1, '2025-12-14 09:40:41', 'Fast Learner', 'Visual', 67),
  (27, 14, 1, 1, '2025-12-14 09:41:22', 'Reflective Learner', 'Kinestetik', 71),
  (28, 14, 1, NULL, '2025-12-14 09:45:39', 'Unknown', NULL, NULL),
  (29, 14, 1, 1, '2025-12-14 09:45:47', 'Balanced Learner', 'Kinestetik', 62),
  (30, 16, 1, 1, '2025-12-14 10:01:29', 'Balanced Learner', 'Kinestetik', 71),
  (31, 16, 1, 1, '2025-12-14 10:02:09', 'Balanced Learner', 'Kinestetik', 71),
  (32, 16, 1, 1, '2025-12-14 10:03:14', 'Balanced Learner', 'Kinestetik', 71),
  (33, 17, 1, 1, '2025-12-14 10:44:07', 'Balanced Learner', 'Visual', 58),
  (34, 18, 1, 1, '2025-12-14 11:18:25', 'Fast Learner', 'Auditori', 71),
  (35, 19, 1, 1, '2025-12-14 11:32:43', 'Fast Learner', 'Visual', 50),
  (36, 6, 1, 1, '2025-12-14 11:45:51', 'Balanced Learner', 'Kinestetik', 71),
  (37, 8, 1, 1, '2025-12-14 12:14:30', 'Reflective Learner', 'Kinestetik', 71),
  (38, 18, 1, 1, '2025-12-14 15:58:47', 'Balanced Learner', 'Kinestetik', 71),
  (39, 20, 1, 1, '2025-12-14 16:01:04', 'Consistent Learner', 'Visual', 67),
  (40, 21, 1, 1, '2025-12-14 16:05:10', 'Balanced Learner', 'Kinestetik', 63),
  (41, 22, 1, 1, '2025-12-14 16:56:16', 'Consistent Learner', 'Visual', 67),
  (42, 11, 1, 1, '2025-12-15 03:40:35', 'Reflective Learner', 'Kinestetik', 71),
  (43, 23, 1, 1, '2025-12-15 04:05:06', 'Balanced Learner', 'Visual', 67),
  (44, 23, 1, 1, '2025-12-15 06:55:01', 'Reflective Learner', 'Auditori', 62),
  (45, 24, 1, 1, '2025-12-15 12:18:19', 'Balanced Learner', 'Visual', 51),
  (46, 6, 1, 1, '2025-12-15 17:35:55', 'Balanced Learner', 'Kinestetik', 71),
  (47, 26, 1, 1, '2025-12-15 20:22:24', 'Reflective Learner', 'Kinestetik', 71),
  (48, 26, 1, 1, '2025-12-15 21:33:33', 'Fast Learner', 'Auditori', 60),
  (49, 27, 1, 1, '2025-12-15 22:08:31', 'Reflective Learner', 'Kinestetik', 43),
  (50, 6, 1, 1, '2025-12-17 08:37:29', 'Fast Learner', 'Visual', 67),
  (51, 31, 1, 1, '2025-12-17 18:19:31', 'Balanced Learner', 'Auditori', 71),
  (52, 32, 1, 1, '2025-12-17 21:51:57', 'Balanced Learner', 'Visual', 67),
  (53, 33, 1, 1, '2025-12-17 22:11:35', 'Balanced Learner', 'Visual', 58),
  (54, 34, 1, 1, '2025-12-17 22:15:02', 'Balanced Learner', 'Kinestetik', 71),
  (55, 36, 1, 1, '2025-12-19 09:24:51', 'Balanced Learner', 'Kinestetik', 52),
  (56, 6, 1, 1, '2025-12-20 15:09:34', 'Fast Learner', 'Kinestetik', 62),
  (57, 6, 1, 1, '2025-12-22 08:45:20', 'Reflective Learner', 'Kinestetik', 71),
  (58, 6, 1, 1, '2025-12-24 16:53:26', 'Fast Learner', 'Visual', 67),
  (59, 6, 1, 1, '2025-12-26 18:01:46', 'Fast Learner', 'Visual', 67),
  (60, 6, 1, 1, '2025-12-26 22:19:45', 'Balanced Learner', 'Kinestetik', 71),
  (61, 6, 1, 1, '2025-12-26 22:20:15', 'Fast Learner', 'Auditori', 71),
  (62, 40, 1, 1, '2025-12-27 08:24:58', 'Reflective Learner', 'Auditori', 52),
  (63, 6, 1, 1, '2026-01-04 13:45:28', 'Balanced Learner', 'Auditori', 43);

-- ============================================================================
-- SECTION 9: B2B SANDBOX TENANT (For Development/Testing)
-- ============================================================================

INSERT INTO `tenants` (`id`, `name`, `slug`, `tier`, `contact_email`, `is_active`) VALUES
  (1, 'Sandbox Development', 'sandbox-dev', 'sandbox', 'dev@cerdasku.ai', TRUE);

-- Note: API keys should be generated using the script: node scripts/generateApiKey.js sandbox
-- The key hash will be inserted after generation

-- ============================================================================
-- RE-ENABLE FOREIGN KEY CHECKS
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- END OF SEED DATA
-- ============================================================================
