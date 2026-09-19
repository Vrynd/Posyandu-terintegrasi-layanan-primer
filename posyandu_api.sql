-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 02, 2026 at 03:29 PM
-- Server version: 8.0.30
-- PHP Version: 8.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `posyandu_api`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-94d92f976fd06fd3e8cf53ec4e03d646', 'i:1;', 1769947925),
('laravel-cache-94d92f976fd06fd3e8cf53ec4e03d646:timer', 'i:1769947925;', 1769947925);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kunjungan`
--

CREATE TABLE `kunjungan` (
  `id` bigint UNSIGNED NOT NULL,
  `peserta_id` bigint UNSIGNED NOT NULL,
  `tanggal_kunjungan` date NOT NULL,
  `berat_badan` decimal(5,2) DEFAULT NULL,
  `rujuk` tinyint(1) NOT NULL DEFAULT '0',
  `lokasi` enum('posyandu','kunjungan_rumah') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'posyandu',
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kunjungan`
--

INSERT INTO `kunjungan` (`id`, `peserta_id`, `tanggal_kunjungan`, `berat_badan`, `rujuk`, `lokasi`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 8, '2026-01-04', '62.00', 0, 'posyandu', 1, '2026-01-03 18:28:11', '2026-01-03 18:28:11'),
(2, 9, '2026-01-04', '8.20', 0, 'posyandu', 1, '2026-01-03 18:31:06', '2026-01-03 18:31:06'),
(3, 10, '2026-01-04', '60.00', 1, 'posyandu', 1, '2026-01-03 18:34:26', '2026-01-03 18:34:26'),
(4, 11, '2026-01-04', '70.00', 0, 'posyandu', 1, '2026-01-03 18:36:49', '2026-01-03 18:36:49'),
(5, 12, '2026-01-04', '60.00', 1, 'posyandu', 1, '2026-01-03 18:38:51', '2026-01-03 18:38:51'),
(7, 14, '2026-01-04', '8.50', 0, 'posyandu', 1, '2026-01-04 13:07:51', '2026-01-04 13:07:51'),
(8, 15, '2026-01-04', '45.00', 1, 'posyandu', 1, '2026-01-04 13:13:17', '2026-01-04 13:13:17'),
(9, 16, '2026-01-04', '72.00', 0, 'kunjungan_rumah', 1, '2026-01-04 13:22:45', '2026-01-04 13:22:45'),
(10, 17, '2026-01-04', '58.00', 0, 'kunjungan_rumah', 1, '2026-01-04 13:26:07', '2026-01-04 13:26:07'),
(11, 18, '2026-01-07', '65.00', 0, 'posyandu', 1, '2026-01-07 00:30:04', '2026-01-07 00:30:04');

-- --------------------------------------------------------

--
-- Table structure for table `kunjungan_balita`
--

CREATE TABLE `kunjungan_balita` (
  `id` bigint UNSIGNED NOT NULL,
  `umur_bulan` int DEFAULT NULL,
  `kesimpulan_bb` enum('NAIK','TIDAK NAIK','BGM') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `panjang_badan` decimal(5,1) DEFAULT NULL,
  `lingkar_kepala` decimal(4,1) DEFAULT NULL,
  `lingkar_lengan` decimal(4,1) DEFAULT NULL,
  `skrining_tbc` json DEFAULT NULL,
  `balita_mendapatkan` json DEFAULT NULL,
  `edukasi_konseling` json DEFAULT NULL,
  `ada_gejala_sakit` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kunjungan_balita`
--

INSERT INTO `kunjungan_balita` (`id`, `umur_bulan`, `kesimpulan_bb`, `panjang_badan`, `lingkar_kepala`, `lingkar_lengan`, `skrining_tbc`, `balita_mendapatkan`, `edukasi_konseling`, `ada_gejala_sakit`, `created_at`, `updated_at`) VALUES
(2, 12, 'NAIK', '75.0', '45.0', '13.0', '[\"Tidak ada\"]', '[\"Vitamin A\", \"Imunisasi Lengkap\"]', '[\"MP ASI Protein Hewani\", \"PHBS\"]', 0, NULL, NULL),
(7, 7, 'NAIK', '68.0', '42.0', '14.0', '[\"Tidak ada\"]', '[\"ASI Eksklusif\", \"Imunisasi Lengkap\", \"Vitamin A\"]', '[\"MP ASI Protein Hewani\"]', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `kunjungan_bumil`
--

CREATE TABLE `kunjungan_bumil` (
  `id` bigint UNSIGNED NOT NULL,
  `umur_kehamilan` int DEFAULT NULL,
  `lila` decimal(4,1) DEFAULT NULL,
  `tekanan_darah` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `skrining_tbc` json DEFAULT NULL,
  `tablet_darah` tinyint(1) NOT NULL DEFAULT '0',
  `asi_eksklusif` tinyint(1) NOT NULL DEFAULT '0',
  `mt_bumil_kek` tinyint(1) NOT NULL DEFAULT '0',
  `kelas_bumil` tinyint(1) NOT NULL DEFAULT '0',
  `penyuluhan` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kunjungan_bumil`
--

INSERT INTO `kunjungan_bumil` (`id`, `umur_kehamilan`, `lila`, `tekanan_darah`, `skrining_tbc`, `tablet_darah`, `asi_eksklusif`, `mt_bumil_kek`, `kelas_bumil`, `penyuluhan`, `created_at`, `updated_at`) VALUES
(1, 12, '24.0', '110/70', '[\"Tidak ada\"]', 1, 0, 0, 1, '[\"TTD (Tablet Tambah Darah)\", \"Isi Piringku\"]', NULL, NULL),
(11, 28, '25.0', '120/80', '[\"Tidak ada\"]', 1, 1, 0, 1, '[\"Tanda Bahaya Kehamilan\", \"TTD (Tablet Tambah Darah)\"]', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `kunjungan_dewasa`
--

CREATE TABLE `kunjungan_dewasa` (
  `id` bigint UNSIGNED NOT NULL,
  `tinggi_badan` decimal(5,1) DEFAULT NULL,
  `imt` enum('sangat_kurus','kurus','normal','gemuk','obesitas') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lingkar_perut` decimal(5,1) DEFAULT NULL,
  `tekanan_darah` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gula_darah` decimal(5,1) DEFAULT NULL,
  `asam_urat` decimal(4,1) DEFAULT NULL,
  `kolesterol` decimal(5,1) DEFAULT NULL,
  `tes_mata` enum('normal','gangguan') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tes_telinga` enum('normal','gangguan') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `skrining_tbc` json DEFAULT NULL,
  `skrining_puma` json DEFAULT NULL,
  `jumlah_skor_puma` int DEFAULT NULL,
  `alat_kontrasepsi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `adl` json DEFAULT NULL,
  `jumlah_skor_adl` int DEFAULT NULL,
  `tingkat_kemandirian` enum('mandiri','ringan','sedang','berat','total') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `edukasi` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kunjungan_dewasa`
--

INSERT INTO `kunjungan_dewasa` (`id`, `tinggi_badan`, `imt`, `lingkar_perut`, `tekanan_darah`, `gula_darah`, `asam_urat`, `kolesterol`, `tes_mata`, `tes_telinga`, `skrining_tbc`, `skrining_puma`, `jumlah_skor_puma`, `alat_kontrasepsi`, `adl`, `jumlah_skor_adl`, `tingkat_kemandirian`, `edukasi`, `created_at`, `updated_at`) VALUES
(4, '176.0', 'normal', '70.0', '130/85', '105.0', '6.0', '180.0', 'normal', 'normal', '[\"Tidak ada\"]', '[\"tesSpirometri\"]', NULL, NULL, NULL, NULL, NULL, '[\"Germas\"]', NULL, NULL),
(5, '167.0', 'normal', '65.0', '130/80', '110.0', '6.9', '130.0', 'gangguan', 'normal', '[\"Tidak ada\"]', NULL, NULL, NULL, '[\"pengendalianBab:1\", \"pengendalianBak:2\", \"kebersihanDiri:1\", \"penggunaanWc:2\", \"makanMinum:2\", \"berjalanTempatRata:3\"]', NULL, NULL, '[\"Germas\"]', NULL, NULL),
(9, '170.0', 'gemuk', '85.0', '125/82', '100.0', '5.8', '185.0', 'normal', 'normal', '[\"Tidak ada\"]', NULL, NULL, NULL, NULL, NULL, NULL, '[\"Germas\"]', NULL, NULL),
(10, '155.0', 'gemuk', '82.0', '145/90', '125.0', '6.5', '210.0', 'gangguan', 'normal', '[\"Tidak ada\"]', NULL, NULL, NULL, '[\"pengendalianBab:2\", \"pengendalianBak:2\", \"kebersihanDiri:1\", \"penggunaanWc:1\", \"makanMinum:2\", \"mobilitas:3\", \"berjalanTempatRata:3\", \"naikTurunTangga:2\"]', NULL, NULL, '[\"Germas\"]', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `kunjungan_remaja`
--

CREATE TABLE `kunjungan_remaja` (
  `id` bigint UNSIGNED NOT NULL,
  `tinggi_badan` decimal(5,1) DEFAULT NULL,
  `imt` enum('sangat_kurus','kurus','normal','gemuk','obesitas') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lingkar_perut` decimal(5,1) DEFAULT NULL,
  `tekanan_darah` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gula_darah` decimal(5,1) DEFAULT NULL,
  `kadar_hb` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `skrining_tbc` json DEFAULT NULL,
  `skrining_mental` json DEFAULT NULL,
  `edukasi` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kunjungan_remaja`
--

INSERT INTO `kunjungan_remaja` (`id`, `tinggi_badan`, `imt`, `lingkar_perut`, `tekanan_darah`, `gula_darah`, `kadar_hb`, `skrining_tbc`, `skrining_mental`, `edukasi`, `created_at`, `updated_at`) VALUES
(3, '160.0', 'normal', '60.0', '120/80', '90.0', NULL, '[\"Tidak ada\"]', '[\"nyamanDirumah\", \"sukaTubuh\", \"temanDiluarGrup\", \"konsumsiRokokAlkoholNarkoba\"]', '[\"Aktivitas Fisik\", \"Bahaya Rokok\"]', NULL, NULL),
(8, '155.0', 'normal', '68.0', '120/30', '95.0', '11-11.9', '[\"Tidak ada\"]', '[\"bebanSekolah\", \"sukaTubuh\", \"tidakAmanLingkungan\", \"inginBunuhDiri\"]', '[\"Anemia Remaja Putri\", \"Aktivitas Fisik\", \"Isi Piringku\"]', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_01_01_192115_create_personal_access_tokens_table', 1),
(5, '2026_01_01_192736_add_fields_users_table', 1),
(6, '2026_01_01_192923_create_peserta_table', 1),
(7, '2026_01_01_193132_create_peserta_bumil_table', 1),
(8, '2026_01_01_193200_create_peserta_balita_table', 1),
(9, '2026_01_01_193220_create_peserta_remaja_table', 1),
(10, '2026_01_01_193231_create_peserta_dewasa_table', 1),
(11, '2026_01_01_193511_create_kunjungan_table', 1),
(12, '2026_01_01_193521_create_kunjungan_bumil_table', 1),
(13, '2026_01_01_193530_create_kunjungan_balita_table', 1),
(14, '2026_01_01_193542_create_kunjungan_remaja_table', 1),
(15, '2026_01_01_193552_create_kunjungan_dewasa_table', 1),
(16, '2026_01_01_194013_create_pengaduan_table', 1),
(17, '2026_01_02_001643_create_password_reset_otps_table', 1),
(18, '2026_01_02_230515_add_nik_hash_to_users_table', 1),
(19, '2026_01_05_163622_add_lockout_columns_to_users_table', 2),
(20, '2026_01_06_075530_update_pengaduan_table_for_frontend', 3),
(21, '2026_01_06_075534_create_pengaduan_images_table', 3),
(22, '2026_01_06_075539_create_pengaduan_responses_table', 3);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_otps`
--

CREATE TABLE `password_reset_otps` (
  `id` bigint UNSIGNED NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `otp` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` timestamp NOT NULL,
  `is_used` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pengaduan`
--

CREATE TABLE `pengaduan` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `kategori_new` enum('error','tampilan','data','performa','lainnya') COLLATE utf8mb4_unicode_ci NOT NULL,
  `prioritas` enum('rendah','sedang','tinggi') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'sedang',
  `kategori` enum('bug','saran','pertanyaan','lainnya') COLLATE utf8mb4_unicode_ci NOT NULL,
  `judul` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `langkah_reproduksi` text COLLATE utf8mb4_unicode_ci,
  `browser_info` text COLLATE utf8mb4_unicode_ci,
  `status_new` enum('pending','in_progress','resolved','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `status` enum('pending','diproses','selesai') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pengaduan`
--

INSERT INTO `pengaduan` (`id`, `user_id`, `kategori_new`, `prioritas`, `kategori`, `judul`, `deskripsi`, `langkah_reproduksi`, `browser_info`, `status_new`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'lainnya', 'rendah', 'bug', '[Testing] Hanya sebagai percobaan', 'sebagai percobaan untuk fitur pengaduan', 'adasdsadasdadasdasdas', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', 'in_progress', 'pending', '2026-01-06 01:36:29', '2026-01-06 03:46:46', NULL),
(2, 1, 'error', 'sedang', 'bug', 'Masih Sering terjadi eror ketika menyimpan data pendaftaran peserta', 'Saat mendaftarkan peserta masih belum bisa karena ketika di simpan terjadi eror sehinnga datanya tidak tersimpan dan harus memulai mengisi ulang data lagi', '1. Coba daftarkan peserta\r\n2. Lalu coba simpan data peserta tersebut\r\n3. nanti akan melihat erornya seperti apa', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', 'resolved', 'pending', '2026-01-06 12:25:43', '2026-01-06 12:49:07', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pengaduan_images`
--

CREATE TABLE `pengaduan_images` (
  `id` bigint UNSIGNED NOT NULL,
  `pengaduan_id` bigint UNSIGNED NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pengaduan_images`
--

INSERT INTO `pengaduan_images` (`id`, `pengaduan_id`, `image_path`, `created_at`, `updated_at`) VALUES
(1, 1, 'pengaduan/Q6dB6wuuBuhZK8uEi66IGSFa1x8vgNxgvdm9SNP8.jpg', '2026-01-06 01:36:30', '2026-01-06 01:36:30'),
(2, 1, 'pengaduan/Hk96OTvvoOrQMgWR081gpcvKfpntG0ZmFhveq7LB.jpg', '2026-01-06 01:36:30', '2026-01-06 01:36:30'),
(3, 1, 'pengaduan/VVPurJM9DdW8KpHlLlms8RFvCP7yIoHFJobRHJT5.jpg', '2026-01-06 01:36:30', '2026-01-06 01:36:30'),
(4, 2, 'pengaduan/HNBuMune5pLtTjWnoQkrH34YPJJ5rQHYD9HW2hZo.jpg', '2026-01-06 12:25:45', '2026-01-06 12:25:45'),
(5, 2, 'pengaduan/K6ZYqlJSlZp9qP9DyNK13Ygejw7Wdutj4vd6x3Fc.jpg', '2026-01-06 12:25:45', '2026-01-06 12:25:45'),
(6, 2, 'pengaduan/wxz1pVqrb6kASHv433u3u9iqFyrUA4ZcKFramxsH.jpg', '2026-01-06 12:25:45', '2026-01-06 12:25:45');

-- --------------------------------------------------------

--
-- Table structure for table `pengaduan_responses`
--

CREATE TABLE `pengaduan_responses` (
  `id` bigint UNSIGNED NOT NULL,
  `pengaduan_id` bigint UNSIGNED NOT NULL,
  `admin_id` bigint UNSIGNED NOT NULL,
  `response` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pengaduan_responses`
--

INSERT INTO `pengaduan_responses` (`id`, `pengaduan_id`, `admin_id`, `response`, `created_at`, `updated_at`) VALUES
(1, 2, 2, 'Oke pengaduan diterima, mohon bersabar. sistem akan berjalan normal dalam beberapa menit kemudian', '2026-01-06 12:31:42', '2026-01-06 12:31:42'),
(2, 2, 2, 'Oke fitur sudah diperbaiki silahkan coba lagi', '2026-01-06 12:40:18', '2026-01-06 12:40:18');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'auth_token', '283d6d781a49db2134b9830939f69f7559f88aaaac245cd7512e2784cbaf0175', '[\"*\"]', '2026-01-03 00:40:10', NULL, '2026-01-03 00:21:11', '2026-01-03 00:40:10'),
(2, 'App\\Models\\User', 1, 'auth_token', '5f2459498fb96b577da2de88ff38a0faa8b491740c7dd902e11627083709e147', '[\"*\"]', '2026-01-03 01:56:54', NULL, '2026-01-03 01:25:17', '2026-01-03 01:56:54'),
(6, 'App\\Models\\User', 1, 'auth_token', '0bcbf3342f6d066ce30113a542f506ce0ace3e17ef9334749fc6e4f392cfebe4', '[\"*\"]', '2026-01-03 04:26:35', NULL, '2026-01-03 03:45:06', '2026-01-03 04:26:35'),
(7, 'App\\Models\\User', 1, 'auth_token', '9f4367a3786c040ca2b04f447dc278cc4eeb0653a3e0c8095116a135181da739', '[\"*\"]', '2026-01-03 21:53:07', NULL, '2026-01-03 04:36:46', '2026-01-03 21:53:07'),
(8, 'App\\Models\\User', 1, 'auth_token', '83f52a3847ea948342c6367651a828ba62e2280f770b12d4f13f46b5f56a1ce9', '[\"*\"]', '2026-01-04 00:24:58', NULL, '2026-01-03 21:56:02', '2026-01-04 00:24:58'),
(10, 'App\\Models\\User', 1, 'auth_token', '54f2b44d996b2232ef8251fd4fe6beb19b60f95b683902cde870310aaf20642d', '[\"*\"]', '2026-01-04 03:19:40', NULL, '2026-01-04 01:57:32', '2026-01-04 03:19:40'),
(11, 'App\\Models\\User', 1, 'auth_token', '9dbad2136ea2900fb8f9389d162958cc27a5ed144eb363286e68f8ec349b31d4', '[\"*\"]', '2026-01-04 12:18:08', NULL, '2026-01-04 11:03:48', '2026-01-04 12:18:08'),
(13, 'App\\Models\\User', 1, 'auth_token', '7beb718c78a8b8117d23231802499353e8b7214c145a5ab6dc13873a870d88df', '[\"*\"]', NULL, NULL, '2026-01-04 13:42:41', '2026-01-04 13:42:41'),
(25, 'App\\Models\\User', 1, 'auth_token', '89abb6955533ca1d0f2e2ac7939c552d3b87c1cf5a6a3d5ea914c9ef18119673', '[\"*\"]', '2026-01-05 19:02:35', NULL, '2026-01-05 17:39:37', '2026-01-05 19:02:35'),
(35, 'App\\Models\\User', 1, 'auth_token', '5859ab142acded0f8d5cb1b8aa92658a65af45b8db60da482dee8b261647b62c', '[\"*\"]', '2026-01-07 00:33:55', NULL, '2026-01-06 12:50:02', '2026-01-07 00:33:55'),
(36, 'App\\Models\\User', 1, 'auth_token', '266f2f2a941b91ec8b7c88f2d042c5dcef7c2f1795a8fb3ce14885ed921a5e3a', '[\"*\"]', '2026-01-11 20:28:13', NULL, '2026-01-06 17:49:19', '2026-01-11 20:28:13'),
(37, 'App\\Models\\User', 1, 'auth_token', 'e82315468759a287c7d86f5b35dd1ffefae0afa7edcc4a4b4af40eb81869a10b', '[\"*\"]', NULL, NULL, '2026-01-07 11:25:32', '2026-01-07 11:25:32'),
(38, 'App\\Models\\User', 1, 'auth_token', '6e9144654a2caf2aa51162805112ce0ab9469094a61b6785253fbaff4bb3f17f', '[\"*\"]', '2026-01-07 19:47:29', NULL, '2026-01-07 11:25:39', '2026-01-07 19:47:29'),
(43, 'App\\Models\\User', 1, 'auth_token', '60a2ae8709829476cdb7e9cca37ec848a57c68ab4170ac0f1d547ec372ff2d43', '[\"*\"]', '2026-01-14 18:21:19', NULL, '2026-01-11 20:33:23', '2026-01-14 18:21:19'),
(44, 'App\\Models\\User', 1, 'auth_token', '54ef104a320deff217446a2b1731ce057b691e4c2eb393fa7a504442ab79bb77', '[\"*\"]', '2026-07-10 19:48:10', NULL, '2026-01-12 06:47:12', '2026-07-10 19:48:10'),
(47, 'App\\Models\\User', 1, 'auth_token', '937ac43de4d04943907d48e2142ff8f94f901c58e38494cc96ba0dd729147a2b', '[\"*\"]', '2026-01-14 20:39:28', NULL, '2026-01-14 20:35:58', '2026-01-14 20:39:28'),
(48, 'App\\Models\\User', 1, 'auth_token', '5bd79f8e74dd2c9a143e282872d708907839792d42f35a090ae75787031486f6', '[\"*\"]', '2026-01-14 21:49:59', NULL, '2026-01-14 20:40:54', '2026-01-14 21:49:59'),
(74, 'App\\Models\\User', 1, 'auth_token', '10ca49b8e8f33d0472f325a437b27eb08ebdfe11d42a6b49f40733807bb867b1', '[\"*\"]', '2026-01-16 08:55:27', NULL, '2026-01-16 02:57:02', '2026-01-16 08:55:27'),
(75, 'App\\Models\\User', 1, 'auth_token', '03cd49b8ac42f8e8393220473973726b74051a7901a8d431917d4d8fc2e93ea1', '[\"*\"]', '2026-01-17 05:36:12', NULL, '2026-01-16 10:17:02', '2026-01-17 05:36:12'),
(76, 'App\\Models\\User', 1, 'auth_token', 'fcef9c4f00e3ad9fdfc5e028d16ef775f70d46d65df6b38f5eaeec04ef73568c', '[\"*\"]', '2026-01-17 20:39:53', NULL, '2026-01-17 14:22:15', '2026-01-17 20:39:53'),
(77, 'App\\Models\\User', 1, 'auth_token', '3bc582fa2c66cd3fb22f4c82801a358c76e0a484ceaf724f6b9588ecd2f41c3d', '[\"*\"]', NULL, NULL, '2026-01-26 20:38:13', '2026-01-26 20:38:13'),
(81, 'App\\Models\\User', 1, 'auth_token', 'f1b6564a64e567e94f4b35f8502ba5bf1e4c2ebf297dc926e15be9397e096db3', '[\"*\"]', NULL, NULL, '2026-01-27 03:33:47', '2026-01-27 03:33:47'),
(82, 'App\\Models\\User', 1, 'auth_token', '3fe52453c5bff3a0aaa9b0d739067be291551b4f28447ebc7f34bce550c0cfbd', '[\"*\"]', '2026-01-27 06:32:36', NULL, '2026-01-27 03:34:01', '2026-01-27 06:32:36'),
(85, 'App\\Models\\User', 1, 'auth_token', 'b18b38bad6cab04d7277d3ff4e1cb68a81aeabf0baa6af9f04ce28e90d002f1e', '[\"*\"]', NULL, NULL, '2026-01-29 19:56:24', '2026-01-29 19:56:24'),
(86, 'App\\Models\\User', 1, 'auth_token', '221d8b96ddcc9ada4120e7a337dbe8e43274eb6ce3578d415ddac68915ad7144', '[\"*\"]', '2026-07-10 19:58:58', NULL, '2026-02-01 05:11:08', '2026-07-10 19:58:58');

-- --------------------------------------------------------

--
-- Table structure for table `peserta`
--

CREATE TABLE `peserta` (
  `id` bigint UNSIGNED NOT NULL,
  `nik` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `nik_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kategori` enum('bumil','balita','remaja','produktif','lansia') COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal_lahir` date NOT NULL,
  `jenis_kelamin` enum('Laki-Laki','Perempuan') COLLATE utf8mb4_unicode_ci NOT NULL,
  `alamat` text COLLATE utf8mb4_unicode_ci,
  `rt` varchar(4) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rw` varchar(4) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telepon` text COLLATE utf8mb4_unicode_ci,
  `kepesertaan_bpjs` tinyint(1) NOT NULL DEFAULT '0',
  `nomor_bpjs` varchar(13) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `peserta`
--

INSERT INTO `peserta` (`id`, `nik`, `nik_hash`, `nama`, `kategori`, `tanggal_lahir`, `jenis_kelamin`, `alamat`, `rt`, `rw`, `telepon`, `kepesertaan_bpjs`, `nomor_bpjs`, `created_at`, `updated_at`) VALUES
(8, 'eyJpdiI6Ik5PNy9DQTlvR2Z4anJxYU1NU2xmNlE9PSIsInZhbHVlIjoiVVc3NXZxNG1jdXNRVGpRYWxHSVUyY3pvOFQ1NWdyK0thaXlqZEh6TFNvQT0iLCJtYWMiOiIxMTZkNDgwOTY4MmUzZGNhYjk4MmZmNTZhYWEwMGNmZWY5NTU1OTlmYWI4ODM5ZTNkMmNhM2UxMmQzNzBiZTMwIiwidGFnIjoiIn0=', '4b9e017ec59a9a111c96fcd87536a0d641ba39b77f0d380652919eed3999ce3d', 'Siti Aminah', 'bumil', '1992-07-08', 'Perempuan', 'Jl. Melati No. 25, Desa Sukamaju', '003', '006', 'eyJpdiI6ImlJM3dFR0ptYlFuaFZETFRtSHlISXc9PSIsInZhbHVlIjoiblBGUkh3SlZIV0Z0cFZFb1lYNnRJUT09IiwibWFjIjoiZTQ4NjVhMTc4MGUyOGNlNWY0Yzc3ZDA0MzRiMDYxZjE3NzJiNzA2YzY4Mzg4NDlhODZjZGQwMzI1MTc0NDIzZiIsInRhZyI6IiJ9', 1, '0001234567890', '2026-01-03 03:17:26', '2026-01-03 03:49:25'),
(9, 'eyJpdiI6Ild2cVEra0FxZ1ZBK2JzVVJiYnN4Mnc9PSIsInZhbHVlIjoiNllncGphVkZvT2luU0dscDV5S1BtZTJZOXVFclczeXNsbERlbytmeTg2Zz0iLCJtYWMiOiJlM2Q1ODc5ODEyODM5Yzc3NWZlNjkwYWM1ZjA5YmYxMzlmMDY3OWRiMmQ1NmE4MWU4ZjA1NmFjNDUwMTVlODk0IiwidGFnIjoiIn0=', '895f457a4009706ddd63f4d1b1e7f57fc35413b17808159783209a930f3319ad', 'Aisyah Putri Ramadhani', 'balita', '2022-07-06', 'Perempuan', 'Jl. Anggrek No. 12, Desa Cempaka', '001', '004', 'eyJpdiI6ImNMQnY4azJ5TTN6R2pRci8wYXdvZGc9PSIsInZhbHVlIjoiV09laC9OUkNwbVZRNjJZeVVRMWxlUT09IiwibWFjIjoiMjRmYTU5MTI3MDA1ODM0ZDRjNjAwMzFhOWQ2ZTg3MDYxYTA5NjMwNDE1N2IwZmY2MWU5OTAzMGQwNTMzNTc5MiIsInRhZyI6IiJ9', 0, NULL, '2026-01-03 04:53:56', '2026-01-03 04:54:21'),
(10, 'eyJpdiI6IjVKWE5pU0NLR1Rsb0cvblZEL01ybXc9PSIsInZhbHVlIjoiSkNGOVgrVXFaTEpaV1NvZ2M0SUg0SlJMQ2FwdkJ6UmVGWEdYZ0J0Q3NwZz0iLCJtYWMiOiI0NmI5MGZkMDY2OTAyMjM5Yzg1MDU0NDJlZWQ3YmE4NTZiYzhiZWY5MmIzM2MwN2NkMzhiN2E5ODNkZTc0NWI3IiwidGFnIjoiIn0=', '48681a17fb72b99ebade1b4997b4284c582cd2605af76260d3ec6e342fe93957', 'Rizky Pratama', 'remaja', '2008-08-05', 'Laki-Laki', 'Jl. Mawar No. 8, Desa Harapan', '002', '004', 'eyJpdiI6IkxPdys1M3ZuZ0RnTXRkOE9SZFdJeUE9PSIsInZhbHVlIjoiaGR0ejh5d3YwbTQ1WVNQSGoxN3NMdz09IiwibWFjIjoiZjk5NTZmNGMxYzgwOGJiN2ExZDQxZDVhZGY5MDM4YjIzYWNlNzc4MmFhNDQ0NmRlYjNkY2Q5ZTc1Y2UzZGY0MCIsInRhZyI6IiJ9', 1, '0001234567891', '2026-01-03 08:49:57', '2026-01-03 08:49:57'),
(11, 'eyJpdiI6IktpNlJDZFVaTHdNTUpQcDUyakVVZ3c9PSIsInZhbHVlIjoia216eFhURkV2NkZSSXpVSVgzZzg1WGJPclRoZFovL1hzWS8vV2Vrd3Fuaz0iLCJtYWMiOiJiMDY1ODA3NTcxODIzMzgwMTIyODY5MjNjNjJkZmNmZjlkNmY4YzljZDkyZjNkZGE5YjVjOTU5ZjJmYWQzMzc3IiwidGFnIjoiIn0=', '0d4d5f4cea4601465804e79220822fd8cc8f0acb7db95c62f28181cdfaccc88a', 'Dani Setiawan', 'produktif', '1985-10-08', 'Laki-Laki', 'Jl. Kenanga No. 45, Desa Sejahtera', '002', '006', 'eyJpdiI6IjVlNHA0K29DdllTbnBRbkNYSkx0YlE9PSIsInZhbHVlIjoiU3dURXpkVjJUcHJIV3JoSkR6ODY1Zz09IiwibWFjIjoiMzljNzEyMDFjZDg5N2M1YmFjZmVjYWZhNDg1ZGRmNjE3YjEzNTcxZDBhNTkwNGQ4Yjc2YTZiYjc5YzJlODc2ZCIsInRhZyI6IiJ9', 1, '0001234567892', '2026-01-03 08:51:15', '2026-01-16 02:59:36'),
(12, 'eyJpdiI6IjBIdWIxMG1qcWlHUmlTRWc3YVFaOGc9PSIsInZhbHVlIjoiNDI5YkZ0SnRBNGlWNFpEclA4NG8wVXJUVWpmamhlMkl3UXZsVEhncTkyND0iLCJtYWMiOiI2ZmE1YTBkZDg4MmRhNGMwMWE4MGNkNmFiNjk5NjM3ZTVmYmE0MmZmM2Y1NGI1MTZmODU0YmUyMmRmM2QwZDY5IiwidGFnIjoiIn0=', '9fd971ee61f1cb428c4dd3bab70c93d95361b128d12fede369d0c36739a7f015', 'Hj. Siti Maryam', 'lansia', '1967-06-11', 'Perempuan', 'Jl. Dahlia No. 3, Desa Bahagia', '005', '003', 'eyJpdiI6ImpHOHh5aEowbHVodHRlZW9xVStjRWc9PSIsInZhbHVlIjoiVWRqRkFCOVRZQmxjRFlQZG51TDd0Zz09IiwibWFjIjoiZGQxYjc1ZDljYWZiNGM5MDJkOWZkMjg5NzM0ZWM5M2VkZWY0ZGYzNjQ5NGMwNjNiMTFiZmNkYmQyM2Y2YTU4NCIsInRhZyI6IiJ9', 1, '0001234567893', '2026-01-03 08:59:35', '2026-01-03 08:59:35'),
(14, 'eyJpdiI6ImdURnhxSEJST25ReWFXd3NTQk1sUHc9PSIsInZhbHVlIjoiT0hDN0NibzJvQ0tZZUFpMHhsR3ZXZUdTdmxTb24zeTE2dXViVVhrQ3g3QT0iLCJtYWMiOiI5MmJlNzBjNjhhOTZmMDE5YTk4ZDA5ZTViNzdkN2ZkYTNkMmIyNGI4ZmI4ODcyN2FlMTZlYzAzYTk2YmZhYzQzIiwidGFnIjoiIn0=', 'b682a73c2c1cf471c45650583ecfd8564f6d35a9481e282c0cceb1701c265808', 'Muhammad Rafif Abimanyu', 'balita', '2016-01-08', 'Laki-Laki', 'Desa Tondomulyo', '04', '01', 'eyJpdiI6Im80L0wreEFtZWQyZldMeUZGRFpIakE9PSIsInZhbHVlIjoieTdYZVZhd0t2RzA4Z2VSaEpGVys4QT09IiwibWFjIjoiNDVhODI2ODcyMDJiMTUzY2M2ZjE5NDg1MDBmMjBmODI4ZmUwZjMyOGVhMDA3NDJmMTdhOTg2NjZhOWJkMGZlMiIsInRhZyI6IiJ9', 1, '0002233445566', '2026-01-04 12:56:29', '2026-01-04 12:56:29'),
(15, 'eyJpdiI6IlBkRnRQWitYYlpseGZvVk94RjFEUUE9PSIsInZhbHVlIjoiMVFwQ253d2F1K0o3VlVoODEwSXV1ZXpodUt0Z2NVTVVjSTZoa3VXU3ovND0iLCJtYWMiOiI4NzdiNWI4ZjI5NjAwYTVkOWEwY2E5OTc3ZmQxZTM0OWI1MmRiMjllZDMxN2NkOGM4MzMyNGUwMDAyMjIwMWUyIiwidGFnIjoiIn0=', '82467a3f85a3f7db5b6965755c0cd2c29425cccdeb5f9f28af66cc7ac85dff65', 'Anisa Fitri Handayani', 'remaja', '2003-09-11', 'Perempuan', 'Desa Tondomulyo', '03', '02', 'eyJpdiI6IkZ6SUZ5Q3B0V2N0azlQd2pUQnZLSlE9PSIsInZhbHVlIjoiR0lONWlBMWhvemlmNWY5ZHh0TFRyQT09IiwibWFjIjoiMzQzZmU0ZWUyYWJkNTFlMDcyNTliMDkxMTM4OGMzNzlhNjY2NzkyY2MxMmI4YTJlZjk3ZWJmZTRjYmU0Mjk3ZiIsInRhZyI6IiJ9', 1, '0003344556677', '2026-01-04 12:57:53', '2026-01-04 12:57:53'),
(16, 'eyJpdiI6InZxMnVrZUtoY3hiS2cveTJWOWJCQkE9PSIsInZhbHVlIjoiWFNCMkp1Q28rNHprSDlRM0Q0U25VazlVRCtvTDdpZGZXeVZ6dVd1UmNwZz0iLCJtYWMiOiJjODEyMTVmYWQ0YTFkZGQ5NzU1YjI4ZTQ2NGI5ZWYyNzgyNDFkYzQ2Y2Q4OTQwYzA2NmY4Y2E1NTFhNTYxYWY1IiwidGFnIjoiIn0=', '414247cfd5aad1ec7f5f43e761dc708c27af0994080b564918d94eb22848d768', 'Bambang Sutrisno', 'produktif', '1987-12-09', 'Laki-Laki', 'Desa Tondomulyo', '04', '01', 'eyJpdiI6IjdRS0pQdFRqZzBnMm1pSVBteklXZFE9PSIsInZhbHVlIjoiVHBpSjQ3Q3k5dDBuNnJYVHF2V200dz09IiwibWFjIjoiOTMxNmE0NDU2MzNjZWM2YTVjZGU2MmRjZjcwZDgzMmE3NjViODliODlkYzdiNjJiMzg1MzNhY2VlOWQ4OWI5MyIsInRhZyI6IiJ9', 0, NULL, '2026-01-04 12:59:10', '2026-01-15 20:12:48'),
(17, 'eyJpdiI6Ii83TnpZVW1kbkljU2c4bkhnNC8vUHc9PSIsInZhbHVlIjoiclpuT2U3cUFLYyt6UUI4RzhEY2NrTDhma3E0NWJBWjh0VlVZUHpQaVhNUT0iLCJtYWMiOiI3YTU3NTU5YTEzMGFjNTZmMWFmYzBiMDlhMDQ5YTllY2VjYTY0Yjk3YmVjNjMwZDM4NTc4MTU2YzBkNzc2MWZiIiwidGFnIjoiIn0=', 'e86ab0267bb8515e0f16858c4b020ab252f07b0bcda27ac4752bd3ddf51f6b79', 'Sumiati', 'lansia', '1964-05-09', 'Perempuan', 'Desa Tondomulyo', '05', '03', 'eyJpdiI6InBuZlFsbnlBeTN5Wk1ic0Q5emlweVE9PSIsInZhbHVlIjoid1F2VElic2ZEbFl3RVR5YU1OcU1LQT09IiwibWFjIjoiNjMzZDBiMzY3YTYzY2JmZDdkZWZiOWQ1YTdkZjZjZDI2NzFhYzRkOTQ3MTJkMTU0NzZhYzZmNjE1MGNhMWRjNSIsInRhZyI6IiJ9', 1, '0005566778891', '2026-01-04 13:00:46', '2026-01-04 13:00:46'),
(18, 'eyJpdiI6IjNFalJheUlwN0hjSlYwM2FXSmlieVE9PSIsInZhbHVlIjoiM0VoNW82aUR6NXRmRFkxMG8wYS9YYktlNmIrck9ZajYwblgwS2lwRTY1OD0iLCJtYWMiOiJhNjBhMDViZDY0Y2I3YWMwMTRhYmNlNzc1ODI2NDEwYWY4NDQyNjU3Nzg3MzYzNGMzZGExMGZiNmJkZDYyMTgwIiwidGFnIjoiIn0=', '1419f7c14d2e6334fb0303493a3e29be7819ee7f92b8e78ea046d2ced46cd35e', 'Ratna Sari Dewi', 'bumil', '1987-11-17', 'Perempuan', 'Desa Tondomulyo', '01', '06', 'eyJpdiI6InZyWk5TSERFb3lnbWxCUHZFamptWlE9PSIsInZhbHVlIjoic0FENzVNSkl5S3dnb0l3OGVua3Fndz09IiwibWFjIjoiZTM4ODIwZGMwZGU4ODRmOWU4NDg3NTgwNmJiYjg3MGNlZTg1ZTRmOGJiODA1NmJmZDQwODlhYWMxODVlYjU1MiIsInRhZyI6IiJ9', 1, '0001234567890', '2026-01-07 00:23:20', '2026-01-12 11:19:37');

-- --------------------------------------------------------

--
-- Table structure for table `peserta_balita`
--

CREATE TABLE `peserta_balita` (
  `peserta_id` bigint UNSIGNED NOT NULL,
  `nama_ortu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `peserta_balita`
--

INSERT INTO `peserta_balita` (`peserta_id`, `nama_ortu`, `created_at`, `updated_at`) VALUES
(9, 'Dewi Kusuma', NULL, NULL),
(14, 'Rina Kusumawati', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `peserta_bumil`
--

CREATE TABLE `peserta_bumil` (
  `peserta_id` bigint UNSIGNED NOT NULL,
  `nama_suami` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hamil_anak_ke` int DEFAULT NULL,
  `jarak_anak` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bb_sebelum_hamil` decimal(4,1) DEFAULT NULL,
  `tinggi_badan` decimal(5,1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `peserta_bumil`
--

INSERT INTO `peserta_bumil` (`peserta_id`, `nama_suami`, `hamil_anak_ke`, `jarak_anak`, `bb_sebelum_hamil`, `tinggi_badan`, `created_at`, `updated_at`) VALUES
(8, 'Ahmad Hidayat', 2, '2', '55.0', '158.0', NULL, NULL),
(18, 'Agus Prasetyo', 2, '3', '55.0', '158.0', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `peserta_dewasa`
--

CREATE TABLE `peserta_dewasa` (
  `peserta_id` bigint UNSIGNED NOT NULL,
  `pekerjaan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_perkawinan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `riwayat_diri` json DEFAULT NULL,
  `merokok` tinyint(1) NOT NULL DEFAULT '0',
  `konsumsi_gula` tinyint(1) NOT NULL DEFAULT '0',
  `konsumsi_garam` tinyint(1) NOT NULL DEFAULT '0',
  `konsumsi_lemak` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `peserta_dewasa`
--

INSERT INTO `peserta_dewasa` (`peserta_id`, `pekerjaan`, `status_perkawinan`, `riwayat_diri`, `merokok`, `konsumsi_gula`, `konsumsi_garam`, `konsumsi_lemak`, `created_at`, `updated_at`) VALUES
(11, 'Petani', 'belum_menikah', '[\"Tidak Ada\"]', 1, 1, 0, 0, NULL, NULL),
(12, 'Pensiunan', 'cerai_mati', '[\"Tidak Ada\"]', 0, 1, 0, 1, NULL, NULL),
(16, 'Petani', 'menikah', '[\"Tidak Ada\"]', 0, 0, 0, 0, NULL, NULL),
(17, 'Ibu Rumah Tangga', 'cerai_mati', '[\"Hipertensi\"]', 0, 1, 1, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `peserta_remaja`
--

CREATE TABLE `peserta_remaja` (
  `peserta_id` bigint UNSIGNED NOT NULL,
  `nama_ortu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `riwayat_keluarga` json DEFAULT NULL,
  `perilaku_berisiko` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `peserta_remaja`
--

INSERT INTO `peserta_remaja` (`peserta_id`, `nama_ortu`, `riwayat_keluarga`, `perilaku_berisiko`, `created_at`, `updated_at`) VALUES
(10, 'Budi Santoso', '[\"Asma\"]', '[\"Merokok\", \"Kurang Aktivitas Fisik\"]', NULL, NULL),
(15, 'Hendra Wijaya', '[\"Tidak Ada\"]', '[\"Tidak Ada\"]', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('0fM1jiowITlyJXKCd3OBrUYVgXj8qepAzV3TjbeN', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOW1tNG5DVHZFMkhYdVhNRk0wMVhPaXVsTlpMZVhpMnpscEZtMWxaYiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9kb2NzL2FwaSI7czo1OiJyb3V0ZSI7czoxNjoic2NyYW1ibGUuZG9jcy51aSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1768060003),
('4k8DA9wqLueUCDspguRviyum2EvmUEXV9RQnPIhf', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiakYxdVAzREhnNW1pRzVDVzRpTXNlRk9sMTFMVWNpdER1TGNxZTRMVyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9kb2NzL2FwaSI7czo1OiJyb3V0ZSI7czoxNjoic2NyYW1ibGUuZG9jcy51aSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1768408534),
('5wUmTmA9CcmvKPJitY1KU6q1qTDZTRLkl3uIucYQ', NULL, '127.0.0.1', 'Go-http-client/1.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiR3E1RGZmazNFQUhPVDFrUmxzYVRJaHpzNDNpWkdna2NDbzU5R1BtRyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9kb2NzL2FwaSI7czo1OiJyb3V0ZSI7czoxNjoic2NyYW1ibGUuZG9jcy51aSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1768005129),
('9cKuwFL9d1zLxrSAYjhFqcAMrxGp12A1xxxGIx0E', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWExiSEZGdXk3UTVFVDlmazRHY2ZQTVhzNk5UYndJTkU0bnJUVkxWayI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9kb2NzL2FwaSI7czo1OiJyb3V0ZSI7czoxNjoic2NyYW1ibGUuZG9jcy51aSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1767749130),
('c5T0tlFk6pyfzv8Y6DWfBTsaXYwP73KF1DHUnscL', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRWdPckQ3WndpNkJ4WlpiYUN3YnphbDByanNRYkpqckNpUmVwOHlmMCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9kb2NzL2FwaSI7czo1OiJyb3V0ZSI7czoxNjoic2NyYW1ibGUuZG9jcy51aSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1768047732),
('c9YN0fdtbnaF1XxwlYZDYIFMrrqx0uBd3vhQ5RCs', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicXNVRjRuQTlNcFM4MWJ3SkhHcUFteHI2SjVGbTZJN280RFJxNVpURyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly9kYW5pY2EtZXF1aWNvbnRpbnVvdXMtaHlwZXJzcGVjdWxhdGl2ZWx5Lm5ncm9rLWZyZWUuZGV2IjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1769745166),
('CIk6EVy2wu1jxD4KIJcHRhGJR5YIPsPLiB5hKM3H', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOEIxTlVKOWpBU3VWQkh3TEs1U0c2dlEwZ2xraFJ0bjhPRldtMmtnQiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9kb2NzL2FwaSI7czo1OiJyb3V0ZSI7czoxNjoic2NyYW1ibGUuZG9jcy51aSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1767740945),
('eJg3svFRmCJpowf43CDeyoJMHKY5hyoUFYgUH2Cn', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicTRrclhWelhqSVZwUzVoekZNWVB6MmhWNHNVcmdHMDdKQWc3WGpRaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9kb2NzL2FwaSI7czo1OiJyb3V0ZSI7czoxNjoic2NyYW1ibGUuZG9jcy51aSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1767687010),
('HBsmBTbm01s2cESBHtTfQEpa8KMSvXbolPHHS94O', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibjB3QmloR2tEMllrSGVuZ1dFQ1BiYzRCMXBOOXpKbW91QUZXemc0MCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9kb2NzL2FwaSI7czo1OiJyb3V0ZSI7czoxNjoic2NyYW1ibGUuZG9jcy51aSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1767738818),
('IFYyFkFHNI9i5TDSi42QyjXVTLKEapcLjOce1TRC', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRURjV3k4eFJCRERJS3I5UnFhcEVMcUZsTnR5S2JVdmlUTDl6NFhuRyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9kb2NzL2FwaSI7czo1OiJyb3V0ZSI7czoxNjoic2NyYW1ibGUuZG9jcy51aSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1767687012),
('PpL2qWT78EQ8IKSqfUTq08BfdITLv3lxv5VDjqHM', NULL, '127.0.0.1', 'Go-http-client/1.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiR1hBSFRldklUUFE5c1dJQ2I3R0ZtMTgweTRPeVE2a0JTZVFCakNuQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9kb2NzL2FwaSI7czo1OiJyb3V0ZSI7czoxNjoic2NyYW1ibGUuZG9jcy51aSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1768062257),
('pXVHl9xzRr8OtGnherQeZdhz1ZYgPfu7fCTuT69e', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidDliNm96akU5OHBUQURucHdjZEEwNVo5bzRQbjRyM1AxYXhmbHlweiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9kb2NzL2FwaSI7czo1OiJyb3V0ZSI7czoxNjoic2NyYW1ibGUuZG9jcy51aSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1767654187),
('tuHONexDbs3SZrJ20NJthIGXAqlLk0EpiPCX2R06', NULL, '127.0.0.1', 'Go-http-client/1.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiclR6clQ5eVpqcFd1SlVZaWNSdkNRWURxdExjQTkzcEI4a1BTd2l2UiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9kb2NzL2FwaSI7czo1OiJyb3V0ZSI7czoxNjoic2NyYW1ibGUuZG9jcy51aSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1768062026),
('vMOZtjO1RggVhFXKuYtONxAnGNwlWPKLVDT3orcM', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT09ITVFqQ3hXWERVaFhPbkw1RFlEU3R2SUR6ejhpOGFjVWo5dnJvYyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1767686694),
('w0yIc1es8EPMrohkDXogP3SZtNZn16AdpKFQrifR', NULL, '127.0.0.1', 'Go-http-client/1.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVlVHU2hJWEdYMDVGZjNCcXNXSUpuUjIzQnlxWW00WFJQUk9POTR0TyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9kb2NzL2FwaSI7czo1OiJyb3V0ZSI7czoxNjoic2NyYW1ibGUuZG9jcy51aSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1768048149),
('ZzQUL5LqV9RRMfpkZgQAPl5xm0tW68bDArNE1C1D', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSktpaG1tV0lmUGdvd3RkZHRGbGhPaDVwOUI3WjQ3VGkwYmpMTEJKTyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9kb2NzL2FwaSI7czo1OiJyb3V0ZSI7czoxNjoic2NyYW1ibGUuZG9jcy51aSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1768004561);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','kader') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'kader',
  `nik` text COLLATE utf8mb4_unicode_ci,
  `nik_hash` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` text COLLATE utf8mb4_unicode_ci,
  `avatar_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `failed_login_attempts` tinyint UNSIGNED NOT NULL DEFAULT '0',
  `locked_until` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `nik`, `nik_hash`, `phone_number`, `avatar_url`, `remember_token`, `created_at`, `updated_at`, `failed_login_attempts`, `locked_until`) VALUES
(1, 'Rifky Verryan Dhika', 'rvd@gmail.com', NULL, '$2y$12$22O2aBVGR8HdHYxo2Axw7.xHTNmLuuF2juSwltukFq.WrtxLauV06', 'kader', 'eyJpdiI6ImZCVmJUWXFSb3YvSGNrejdOUmxoT2c9PSIsInZhbHVlIjoiN1R5MXY3eFJTZjUycjZtZDVaK20yODY0VWduaUtTdjdYa05zaWxFc2NOYz0iLCJtYWMiOiIzMGU4ZjliZWEzNWIxNjdjNjY4ODlkODAwZDY1YTYxYTk4M2VjNmNhMzE1ZjA0ZTY0ZTQwNTU5NjEzMDJhOTk5IiwidGFnIjoiIn0=', '94df3e9468fbc6747829a9f9c6d39de3fda10b053409c0f360b5b33008882c71', 'eyJpdiI6Ik9aQUFGTE1lYXIySHVkalhhZU44dWc9PSIsInZhbHVlIjoieVptZSsxLzIwTmdQU3dJR0t2MEdMUT09IiwibWFjIjoiNDY2NzUzY2Y2YjM1NmE1MGYxY2RiNDAzOGY3ZWEyMjYxY2RjZTJmNWYyMTVlNjA1ZmU5NDJiMmEwOTM5Mjc0ZiIsInRhZyI6IiJ9', NULL, NULL, '2026-01-03 00:21:10', '2026-01-15 18:11:05', 0, NULL),
(2, 'Admin Posyandu', 'admin@posyandu.id', NULL, '$2y$12$w.7rnQwQDlYwQcGtMvZRqeBzWYT1XqwjgUStVAnCwqCvy/fpGXBW.', 'admin', 'eyJpdiI6IjI3bEllSXVqaUtyMGgrU3lHMHFkYVE9PSIsInZhbHVlIjoicGw1SlROUGt5VTV0cDk1NldxSkkwc1haN1lucjFzd0JLbXB4bnM4TlRsMD0iLCJtYWMiOiJiYmU1OTVkNjQ2YTQ1YTcxNjNlMGEwYzMyNTEzMDBhOTBmMzMwMDU5ZmRhM2FiNTc2MWU5OGQxODE0ODExMWZkIiwidGFnIjoiIn0=', '7a51d064a1a216a692f753fcdab276e4ff201a01d8b66f56d50d4d719fd0dc87', 'eyJpdiI6InlVbm90c3BwN3Q5ZC9oQnBoeFQ1dHc9PSIsInZhbHVlIjoiV0kxb2I5OS9uY09CbnFKRkJaVklXZz09IiwibWFjIjoiMDQzNGQ0YWQ3YzY5NTEwZDU1YTI2NmM4MzNkNmYzMjY3ZGJhNThmY2MzMjdmOTU5ZmU2YjFlNGI2YzU1YWY0NCIsInRhZyI6IiJ9', NULL, NULL, '2026-01-05 17:27:43', '2026-01-06 03:27:08', 0, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kunjungan`
--
ALTER TABLE `kunjungan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kunjungan_created_by_foreign` (`created_by`),
  ADD KEY `kunjungan_peserta_id_index` (`peserta_id`),
  ADD KEY `kunjungan_tanggal_kunjungan_index` (`tanggal_kunjungan`),
  ADD KEY `kunjungan_created_at_index` (`created_at`);

--
-- Indexes for table `kunjungan_balita`
--
ALTER TABLE `kunjungan_balita`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kunjungan_bumil`
--
ALTER TABLE `kunjungan_bumil`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kunjungan_dewasa`
--
ALTER TABLE `kunjungan_dewasa`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kunjungan_remaja`
--
ALTER TABLE `kunjungan_remaja`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_otps`
--
ALTER TABLE `password_reset_otps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `password_reset_otps_email_index` (`email`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `pengaduan`
--
ALTER TABLE `pengaduan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pengaduan_user_id_index` (`user_id`),
  ADD KEY `pengaduan_status_index` (`status`);

--
-- Indexes for table `pengaduan_images`
--
ALTER TABLE `pengaduan_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pengaduan_images_pengaduan_id_index` (`pengaduan_id`);

--
-- Indexes for table `pengaduan_responses`
--
ALTER TABLE `pengaduan_responses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pengaduan_responses_pengaduan_id_index` (`pengaduan_id`),
  ADD KEY `pengaduan_responses_admin_id_index` (`admin_id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `peserta`
--
ALTER TABLE `peserta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `peserta_kategori_index` (`kategori`),
  ADD KEY `peserta_nama_index` (`nama`),
  ADD KEY `peserta_nik_hash_index` (`nik_hash`);

--
-- Indexes for table `peserta_balita`
--
ALTER TABLE `peserta_balita`
  ADD PRIMARY KEY (`peserta_id`);

--
-- Indexes for table `peserta_bumil`
--
ALTER TABLE `peserta_bumil`
  ADD PRIMARY KEY (`peserta_id`);

--
-- Indexes for table `peserta_dewasa`
--
ALTER TABLE `peserta_dewasa`
  ADD PRIMARY KEY (`peserta_id`);

--
-- Indexes for table `peserta_remaja`
--
ALTER TABLE `peserta_remaja`
  ADD PRIMARY KEY (`peserta_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_nik_hash_unique` (`nik_hash`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kunjungan`
--
ALTER TABLE `kunjungan`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `kunjungan_balita`
--
ALTER TABLE `kunjungan_balita`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `kunjungan_bumil`
--
ALTER TABLE `kunjungan_bumil`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `kunjungan_dewasa`
--
ALTER TABLE `kunjungan_dewasa`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `kunjungan_remaja`
--
ALTER TABLE `kunjungan_remaja`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `password_reset_otps`
--
ALTER TABLE `password_reset_otps`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pengaduan`
--
ALTER TABLE `pengaduan`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `pengaduan_images`
--
ALTER TABLE `pengaduan_images`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `pengaduan_responses`
--
ALTER TABLE `pengaduan_responses`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT for table `peserta`
--
ALTER TABLE `peserta`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `kunjungan`
--
ALTER TABLE `kunjungan`
  ADD CONSTRAINT `kunjungan_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `kunjungan_peserta_id_foreign` FOREIGN KEY (`peserta_id`) REFERENCES `peserta` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `kunjungan_balita`
--
ALTER TABLE `kunjungan_balita`
  ADD CONSTRAINT `kunjungan_balita_id_foreign` FOREIGN KEY (`id`) REFERENCES `kunjungan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `kunjungan_bumil`
--
ALTER TABLE `kunjungan_bumil`
  ADD CONSTRAINT `kunjungan_bumil_id_foreign` FOREIGN KEY (`id`) REFERENCES `kunjungan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `kunjungan_dewasa`
--
ALTER TABLE `kunjungan_dewasa`
  ADD CONSTRAINT `kunjungan_dewasa_id_foreign` FOREIGN KEY (`id`) REFERENCES `kunjungan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `kunjungan_remaja`
--
ALTER TABLE `kunjungan_remaja`
  ADD CONSTRAINT `kunjungan_remaja_id_foreign` FOREIGN KEY (`id`) REFERENCES `kunjungan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pengaduan`
--
ALTER TABLE `pengaduan`
  ADD CONSTRAINT `pengaduan_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pengaduan_images`
--
ALTER TABLE `pengaduan_images`
  ADD CONSTRAINT `pengaduan_images_pengaduan_id_foreign` FOREIGN KEY (`pengaduan_id`) REFERENCES `pengaduan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pengaduan_responses`
--
ALTER TABLE `pengaduan_responses`
  ADD CONSTRAINT `pengaduan_responses_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pengaduan_responses_pengaduan_id_foreign` FOREIGN KEY (`pengaduan_id`) REFERENCES `pengaduan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `peserta_balita`
--
ALTER TABLE `peserta_balita`
  ADD CONSTRAINT `peserta_balita_peserta_id_foreign` FOREIGN KEY (`peserta_id`) REFERENCES `peserta` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `peserta_bumil`
--
ALTER TABLE `peserta_bumil`
  ADD CONSTRAINT `peserta_bumil_peserta_id_foreign` FOREIGN KEY (`peserta_id`) REFERENCES `peserta` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `peserta_dewasa`
--
ALTER TABLE `peserta_dewasa`
  ADD CONSTRAINT `peserta_dewasa_peserta_id_foreign` FOREIGN KEY (`peserta_id`) REFERENCES `peserta` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `peserta_remaja`
--
ALTER TABLE `peserta_remaja`
  ADD CONSTRAINT `peserta_remaja_peserta_id_foreign` FOREIGN KEY (`peserta_id`) REFERENCES `peserta` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
