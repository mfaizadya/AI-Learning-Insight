-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 09, 2025 at 05:11 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `capstone`
--

-- --------------------------------------------------------

--
-- Table structure for table `hasil_test`
--

CREATE TABLE `hasil_test` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `test_pola_id` int(11) DEFAULT NULL,
  `test_gaya_id` int(11) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hasil_test`
--

INSERT INTO `hasil_test` (`id`, `user_id`, `test_pola_id`, `test_gaya_id`, `timestamp`) VALUES
(1, 1, 1, 1, '2025-12-01 14:52:56'),
(2, 2, 1, 1, '2025-12-01 14:52:56');

-- --------------------------------------------------------

--
-- Table structure for table `hasil_test_gaya_detail`
--

CREATE TABLE `hasil_test_gaya_detail` (
  `id` int(11) NOT NULL,
  `hasil_test_id` int(11) NOT NULL,
  `soal_id` int(11) NOT NULL,
  `pilihan_id` int(11) NOT NULL,
  `bobot_visual` int(11) NOT NULL,
  `bobot_auditori` int(11) NOT NULL,
  `bobot_kinestetik` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hasil_test_pola_detail`
--

CREATE TABLE `hasil_test_pola_detail` (
  `id` int(11) NOT NULL,
  `hasil_test_id` int(11) NOT NULL,
  `soal_id` int(11) NOT NULL,
  `pilihan_id` int(11) NOT NULL,
  `bobot_consistent` int(11) NOT NULL,
  `bobot_fast` int(11) NOT NULL,
  `bobot_reflective` int(11) NOT NULL,
  `bobot_balanced` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `insight`
--

CREATE TABLE `insight` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `insight` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `insight`
--

INSERT INTO `insight` (`id`, `user_id`, `insight`) VALUES
(1, 1, 'Anda cenderung belajar cepat dan visual.'),
(2, 2, 'Anda konsisten dan mudah memahami lewat audio.');

-- --------------------------------------------------------

--
-- Table structure for table `motd`
--

CREATE TABLE `motd` (
  `motd_id` int(11) NOT NULL,
  `message` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `motd`
--

INSERT INTO `motd` (`motd_id`, `message`) VALUES
(1, 'Welcome to the system! Have a great day.'),
(2, 'Scheduled maintenance will occur tonight at 22:00.'),
(3, 'Tip of the day: Remember to back up your data regularly.'),
(4, 'New features have been added. Check the updates section!');

-- --------------------------------------------------------

--
-- Table structure for table `pilihan_gaya`
--

CREATE TABLE `pilihan_gaya` (
  `id` int(11) NOT NULL,
  `soal_id` int(11) NOT NULL,
  `option_text` text NOT NULL,
  `bobot_visual` int(11) NOT NULL,
  `bobot_auditori` int(11) NOT NULL,
  `bobot_kinestetik` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pilihan_gaya`
--

INSERT INTO `pilihan_gaya` (`id`, `soal_id`, `option_text`, `bobot_visual`, `bobot_auditori`, `bobot_kinestetik`) VALUES
(1, 1, 'Melihat gambar atau diagram', 5, 1, 1),
(2, 1, 'Mendengarkan penjelasan', 1, 5, 1),
(3, 1, 'Mencoba mempraktikkan langsung', 1, 1, 5),
(4, 2, 'Melihat contoh visual', 5, 1, 2),
(5, 2, 'Diskusi dan mendengar penjelasan', 1, 5, 1),
(6, 2, 'Menggerakkan tangan atau tubuh', 1, 1, 5),
(7, 3, 'Membayangkan gambar', 5, 1, 1),
(8, 3, 'Mengulang secara verbal', 1, 5, 1),
(9, 3, 'Menggunakan gerakan tubuh', 1, 1, 5),
(10, 4, 'Instruksi berbentuk diagram', 5, 1, 1),
(11, 4, 'Instruksi audio', 1, 5, 1),
(12, 4, 'Aksi demonstrasi', 1, 1, 5),
(13, 5, 'Melihat slide atau video', 5, 1, 2),
(14, 5, 'Dibacakan atau dijelaskan', 1, 5, 1),
(15, 5, 'Langsung mencoba', 1, 1, 5),
(16, 6, 'Melihat catatan kelompok', 5, 1, 2),
(17, 6, 'Diskusi mendalam', 1, 5, 1),
(18, 6, 'Simulasi / roleplay', 1, 1, 5),
(19, 7, 'Diagram dan blueprint', 5, 1, 2),
(20, 7, 'Instruksi audio', 1, 5, 1),
(21, 7, 'Menyentuh dan mencoba sendiri', 1, 1, 5),
(22, 8, 'Menggambar atau menuliskan poin', 5, 1, 2),
(23, 8, 'Menjelaskan dengan kata-kata', 1, 5, 1),
(24, 8, 'Menggunakan demonstrasi', 1, 1, 5),
(25, 9, 'Melihat contoh visual', 5, 1, 2),
(26, 9, 'Mendengar penjelasan', 1, 5, 1),
(27, 9, 'Praktik langsung', 1, 1, 5),
(28, 10, 'Tidak ada gambar / visual', 5, 1, 1),
(29, 10, 'Suara bising', 1, 5, 1),
(30, 10, 'Tidak bisa bergerak', 1, 1, 5);

-- --------------------------------------------------------

--
-- Table structure for table `pilihan_pola`
--

CREATE TABLE `pilihan_pola` (
  `id` int(11) NOT NULL,
  `soal_id` int(11) NOT NULL,
  `option_text` text NOT NULL,
  `bobot_consistent` int(11) NOT NULL,
  `bobot_fast` int(11) NOT NULL,
  `bobot_reflective` int(11) NOT NULL,
  `bobot_balanced` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pilihan_pola`
--

INSERT INTO `pilihan_pola` (`id`, `soal_id`, `option_text`, `bobot_consistent`, `bobot_fast`, `bobot_reflective`, `bobot_balanced`) VALUES
(1, 1, 'Mulai dengan merencanakan langkah-langkah belajar', 5, 1, 3, 4),
(2, 1, 'Langsung mencoba tanpa banyak rencana', 1, 5, 2, 3),
(3, 1, 'Menganalisis dulu sebelum memulai', 3, 1, 5, 4),
(4, 1, 'Mengikuti alur secara fleksibel', 3, 3, 3, 5),
(5, 2, 'Mengerjakan secara bertahap', 5, 1, 3, 3),
(6, 2, 'Mengerjakan secepat mungkin', 1, 5, 1, 3),
(7, 2, 'Berhenti sejenak lalu refleksi', 2, 1, 5, 4),
(8, 2, 'Mencoba beberapa metode berbeda', 2, 3, 3, 5),
(9, 3, 'Lambat dan stabil', 5, 1, 3, 3),
(10, 3, 'Cepat dan langsung inti', 1, 5, 1, 3),
(11, 3, 'Menyesuaikan ritme sesuai materi', 3, 3, 3, 5),
(12, 3, 'Pelan sambil memahami detail', 3, 1, 5, 3),
(13, 4, 'Mengambil waktu untuk berpikir', 4, 1, 5, 3),
(14, 4, 'Segera mencoba menerapkan', 1, 5, 1, 3),
(15, 4, 'Mencatat poin penting', 5, 1, 3, 4),
(16, 4, 'Mengikuti alur informasi', 3, 3, 3, 5),
(17, 5, 'Merevisi dan memperbaiki perlahan', 5, 1, 4, 3),
(18, 5, 'Belajar lebih cepat untuk mengejar ketertinggalan', 1, 5, 1, 4),
(19, 5, 'Merefleksikan apa yang salah', 2, 1, 5, 4),
(20, 5, 'Menyesuaikan strategi belajar', 3, 3, 3, 5),
(21, 6, 'Konsistensi proses', 5, 1, 3, 3),
(22, 6, 'Kecepatan penyelesaian', 1, 5, 1, 3),
(23, 6, 'Pemahaman mendalam', 2, 1, 5, 4),
(24, 6, 'Keseimbangan antara cepat dan tepat', 3, 3, 3, 5),
(25, 7, 'Saat rutinitas teratur', 5, 1, 3, 4),
(26, 7, 'Saat suasana cepat dan dinamis', 1, 5, 1, 3),
(27, 7, 'Saat bisa berpikir perlahan', 2, 1, 5, 4),
(28, 7, 'Saat ritme fleksibel', 3, 3, 3, 5),
(29, 8, 'Mempelajari langkah secara runtut', 5, 1, 3, 4),
(30, 8, 'Menyelesaikan bagian inti terlebih dahulu', 1, 5, 1, 3),
(31, 8, 'Merenungkan konsep', 1, 1, 5, 4),
(32, 8, 'Menggabungkan beberapa teknik', 3, 3, 3, 5),
(33, 9, 'Mengerjakan secara stabil sesuai rencana', 5, 1, 3, 3),
(34, 9, 'Mengerjakan dengan sangat cepat', 1, 5, 1, 3),
(35, 9, 'Memikirkan prioritas utama', 2, 1, 5, 4),
(36, 9, 'Menyeimbangkan kecepatan dan ketepatan', 3, 3, 3, 5),
(37, 10, 'Tetap pada pola stabil', 5, 1, 3, 4),
(38, 10, 'Berubah cepat mengikuti kebutuhan', 1, 5, 1, 3),
(39, 10, 'Belajar sambil refleksi', 1, 1, 5, 4),
(40, 10, 'Pola fleksibel dan seimbang', 3, 3, 3, 5);

-- --------------------------------------------------------

--
-- Table structure for table `soal_gaya`
--

CREATE TABLE `soal_gaya` (
  `id` int(11) NOT NULL,
  `test_id` int(11) NOT NULL,
  `question` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `soal_gaya`
--

INSERT INTO `soal_gaya` (`id`, `test_id`, `question`) VALUES
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

-- --------------------------------------------------------

--
-- Table structure for table `soal_pola`
--

CREATE TABLE `soal_pola` (
  `id` int(11) NOT NULL,
  `test_id` int(11) NOT NULL,
  `question` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `soal_pola`
--

INSERT INTO `soal_pola` (`id`, `test_id`, `question`) VALUES
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

-- --------------------------------------------------------

--
-- Table structure for table `test_gaya`
--

CREATE TABLE `test_gaya` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `test_gaya`
--

INSERT INTO `test_gaya` (`id`, `name`) VALUES
(1, 'Tes Gaya Belajar Dasar');

-- --------------------------------------------------------

--
-- Table structure for table `test_pola`
--

CREATE TABLE `test_pola` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `test_pola`
--

INSERT INTO `test_pola` (`id`, `name`) VALUES
(1, 'Tes Pola Belajar Dasar');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `role` enum('admin','user') NOT NULL,
  `learning_style` enum('visual','auditori','kinestetik') NOT NULL,
  `learning_pattern` enum('consistent','fast','reflective','balanced') NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `username`, `password`, `image`, `role`, `learning_style`, `learning_pattern`) VALUES
(1, 'andi@example.com', 'andi', 'pass123', NULL, 'user', 'visual', 'fast'),
(2, 'budi@example.com', 'budi', 'pass123', NULL, 'user', 'auditori', 'consistent'),
(3, 'sari@example.com', 'sari', 'pass123', NULL, 'user', 'kinestetik', 'reflective'),
(4, 'admin@example.com', 'admin', 'adminpass', NULL, 'admin', 'visual', 'balanced'),
(5, 'tina@example.com', 'tina', 'pass123', NULL, 'user', 'auditori', 'fast');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `hasil_test`
--
ALTER TABLE `hasil_test`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_hasil_user` (`user_id`),
  ADD KEY `idx_hasil_test_pola` (`test_pola_id`),
  ADD KEY `idx_hasil_test_gaya` (`test_gaya_id`);

--
-- Indexes for table `hasil_test_gaya_detail`
--
ALTER TABLE `hasil_test_gaya_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hasil_test_id` (`hasil_test_id`),
  ADD KEY `soal_id` (`soal_id`),
  ADD KEY `pilihan_id` (`pilihan_id`);

--
-- Indexes for table `hasil_test_pola_detail`
--
ALTER TABLE `hasil_test_pola_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hasil_test_id` (`hasil_test_id`),
  ADD KEY `soal_id` (`soal_id`),
  ADD KEY `pilihan_id` (`pilihan_id`);

--
-- Indexes for table `insight`
--
ALTER TABLE `insight`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `motd`
--
ALTER TABLE `motd`
  ADD PRIMARY KEY (`motd_id`);

--
-- Indexes for table `pilihan_gaya`
--
ALTER TABLE `pilihan_gaya`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pilihan_gaya_soal` (`soal_id`);

--
-- Indexes for table `pilihan_pola`
--
ALTER TABLE `pilihan_pola`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pilihan_pola_soal` (`soal_id`);

--
-- Indexes for table `soal_gaya`
--
ALTER TABLE `soal_gaya`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_soal_gaya_test` (`test_id`);

--
-- Indexes for table `soal_pola`
--
ALTER TABLE `soal_pola`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_soal_pola_test` (`test_id`);

--
-- Indexes for table `test_gaya`
--
ALTER TABLE `test_gaya`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `test_pola`
--
ALTER TABLE `test_pola`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_deleted_at` (`deleted_at`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `hasil_test`
--
ALTER TABLE `hasil_test`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `hasil_test_gaya_detail`
--
ALTER TABLE `hasil_test_gaya_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `hasil_test_pola_detail`
--
ALTER TABLE `hasil_test_pola_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `insight`
--
ALTER TABLE `insight`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `motd`
--
ALTER TABLE `motd`
  MODIFY `motd_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `pilihan_gaya`
--
ALTER TABLE `pilihan_gaya`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `pilihan_pola`
--
ALTER TABLE `pilihan_pola`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `soal_gaya`
--
ALTER TABLE `soal_gaya`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `soal_pola`
--
ALTER TABLE `soal_pola`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `test_gaya`
--
ALTER TABLE `test_gaya`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `test_pola`
--
ALTER TABLE `test_pola`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `hasil_test`
--
ALTER TABLE `hasil_test`
  ADD CONSTRAINT `hasil_test_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hasil_test_ibfk_2` FOREIGN KEY (`test_pola_id`) REFERENCES `test_pola` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `hasil_test_ibfk_3` FOREIGN KEY (`test_gaya_id`) REFERENCES `test_gaya` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `hasil_test_gaya_detail`
--
ALTER TABLE `hasil_test_gaya_detail`
  ADD CONSTRAINT `hasil_test_gaya_detail_ibfk_1` FOREIGN KEY (`hasil_test_id`) REFERENCES `hasil_test` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hasil_test_gaya_detail_ibfk_2` FOREIGN KEY (`soal_id`) REFERENCES `soal_gaya` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hasil_test_gaya_detail_ibfk_3` FOREIGN KEY (`pilihan_id`) REFERENCES `pilihan_gaya` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `hasil_test_pola_detail`
--
ALTER TABLE `hasil_test_pola_detail`
  ADD CONSTRAINT `hasil_test_pola_detail_ibfk_1` FOREIGN KEY (`hasil_test_id`) REFERENCES `hasil_test` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hasil_test_pola_detail_ibfk_2` FOREIGN KEY (`soal_id`) REFERENCES `soal_pola` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hasil_test_pola_detail_ibfk_3` FOREIGN KEY (`pilihan_id`) REFERENCES `pilihan_pola` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `insight`
--
ALTER TABLE `insight`
  ADD CONSTRAINT `insight_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pilihan_gaya`
--
ALTER TABLE `pilihan_gaya`
  ADD CONSTRAINT `pilihan_gaya_ibfk_1` FOREIGN KEY (`soal_id`) REFERENCES `soal_gaya` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pilihan_pola`
--
ALTER TABLE `pilihan_pola`
  ADD CONSTRAINT `pilihan_pola_ibfk_1` FOREIGN KEY (`soal_id`) REFERENCES `soal_pola` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `soal_gaya`
--
ALTER TABLE `soal_gaya`
  ADD CONSTRAINT `soal_gaya_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `test_gaya` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `soal_pola`
--
ALTER TABLE `soal_pola`
  ADD CONSTRAINT `soal_pola_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `test_pola` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
