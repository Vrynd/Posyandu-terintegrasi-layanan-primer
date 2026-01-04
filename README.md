# Posyandu Terintegrasi Layanan Primer (ILP) - Desa Tondomulyo

Sistem manajemen kesehatan Posyandu modern yang dirancang untuk mendukung transformasi layanan kesehatan primer di tingkat desa (Desa Tondomulyo). Aplikasi ini membantu kader Posyandu untuk mencatat, melacak, dan mengelola data kesehatan masyarakat secara efisien di seluruh siklus hidup.

## 🚀 Fitur Utama

- **🩺 Pemeriksaan Siklus Hidup Terpadu**: Formulir pemeriksaan khusus untuk 5 kategori peserta:
  - **Ibu Hamil & Nifas**: Pemantauan kehamilan, LILA, tekanan darah, dan status imunisasi.
  - **Bayi & Balita**: Pelacakan pertumbuhan (BB/TB), status gizi, dan imunisasi.
  - **Anak Sekolah & Remaja**: Skrining kesehatan remaja dan edukasi.
  - **Usia Produktif**: Skrining faktor risiko penyakit tidak menular (PTM).
  - **Lansia**: Pemantauan kesehatan berkala untuk kualitas hidup lansia.
- **📊 Dashboard Interaktif**: Visualisasi statistik real-time, grafik kunjungan bulanan (2026), dan distribusi peserta per kategori.
- **🔍 Manajemen Peserta Canggih**: Pencarian peserta cepat berbasis NIK atau Nama dengan riwayat pemeriksaan yang terintegrasi.
- **🔄 Sinkronisasi & Caching**: Sistem caching cerdas (Dexie.js-based) untuk performa cepat dan status sinkronisasi indikator real-time.
- **📱 Desain Modern & Responsif**: Antarmuka premium dengan "Glassmorphism" effect, dioptimalkan untuk penggunaan laptop maupun mobile oleh kader di lapangan.
- **📋 Pelaporan Otomatis**: Fitur untuk melihat dan mengunduh laporan kegiatan Posyandu (Segera hadir).

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Visualisasi Data**: [Recharts](https://recharts.org/)
- **Iconography**: [Lucide React](https://lucide.dev/)
- **Data Persistence**: [Axios](https://axios-http.com/) & [Dexie.js](https://dexie.org/) (IndexedDB Caching)
- **Arsitektur**: Clean Architecture (Data, Domain, & Presentation Layers)

## 📁 Struktur Proyek (Clean Architecture)

- `src/data`: Implementasi Datasource, Model API, dan Repository.
- `src/domain`: Business Logic (Entities & Use Cases).
- `src/presentation`: Komponen UI, Pages, Hooks, dan Contexts.
  - `components/`: UI atomik dan molekular (Dashboard, Pemeriksaan, Peserta).
  - `pages/`: Halaman utama aplikasi.
  - `hooks/`: Logika stateful reusable (useAuth, usePemeriksaan, dll).
  - `contexts/`: State management global untuk data realtime.

## 🏁 Memulai

### Prasyarat

- Node.js (Versi terbaru direkomendasikan)
- npm atau yarn

### Instalasi & Jalankan

1. Clone repositori:
   ```bash
   git clone https://github.com/Vrynd/Posyandu-terintegrasi-layanan-primer.git
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```
4. Buka `http://localhost:5173` di browser Anda.

---

Dikembangkan dengan ❤️ untuk kemajuan kesehatan **Desa Tondomulyo**.
