create extension if not exists "pgcrypto";

create type user_role as enum ('super_admin', 'kader');
create type kategori_peserta as enum ('balita', 'bumil', 'remaja', 'produktif', 'lansia');
create type jenis_kelamin_enum as enum ('Laki-Laki', 'Perempuan');
create type lokasi_kunjungan as enum ('posyandu', 'kunjungan_rumah', 'puskesmas_pembantu');
create type status_jadwal as enum ('terjadwal', 'berlangsung', 'selesai', 'dibatalkan');
create type status_backup as enum ('success', 'failed', 'in_progress');
create type kesimpulan_bb_enum as enum ('naik', 'turun', 'tetap');
create type status_perkawinan_enum as enum ('belum_menikah', 'menikah', 'cerai_hidup', 'cerai_mati');
create type kategori_pengaduan as enum ('bug_error', 'permintaan_fitur', 'lainnya');
create type status_pengaduan as enum ('menunggu', 'diproses', 'selesai', 'ditolak');

create table pengguna (
  id uuid primary key references auth.users(id) on delete cascade,
  nama varchar(255) not null,
  role user_role not null default 'kader',
  nik text,
  nik_hash varchar(64) unique,
  telepon text,
  url_avatar text,
  percobaan_login_gagal int default 0,
  terkunci_hingga timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table peserta (
  id uuid primary key default gen_random_uuid(),
  nik text,
  nik_hash varchar(64) unique not null,
  nama varchar(255) not null,
  kategori kategori_peserta not null,
  tanggal_lahir date not null,
  jenis_kelamin jenis_kelamin_enum not null,
  alamat text,
  rt varchar(5),
  rw varchar(5),
  telepon text,
  kepesertaan_bpjs boolean default false,
  nomor_bpjs varchar(20),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_peserta_kategori on peserta(kategori);
create index idx_peserta_nik_hash on peserta(nik_hash);

create table peserta_balita (
  peserta_id uuid primary key references peserta(id) on delete cascade,
  nama_ortu varchar(255),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table kehamilan (
  id uuid primary key default gen_random_uuid(),
  peserta_id uuid not null references peserta(id) on delete cascade,
  nama_suami varchar(255),
  hamil_anak_ke smallint,
  jarak_anak smallint,
  bb_sebelum_hamil numeric(5,2),
  tinggi_badan numeric(5,2),
  hpht date,
  status varchar(20) default 'aktif',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_kehamilan_peserta on kehamilan(peserta_id);

create table peserta_remaja (
  peserta_id uuid primary key references peserta(id) on delete cascade,
  nama_ortu varchar(255),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table peserta_remaja_riwayat_keluarga (
  id uuid primary key default gen_random_uuid(),
  peserta_id uuid not null references peserta(id) on delete cascade,
  penyakit varchar(150) not null,
  created_at timestamptz default now()
);

create table peserta_remaja_perilaku_berisiko (
  id uuid primary key default gen_random_uuid(),
  peserta_id uuid not null references peserta(id) on delete cascade,
  perilaku varchar(150) not null,
  created_at timestamptz default now()
);

create table peserta_dewasa (
  peserta_id uuid primary key references peserta(id) on delete cascade,
  pekerjaan varchar(100),
  status_perkawinan status_perkawinan_enum,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table peserta_dewasa_riwayat_diri (
  id uuid primary key default gen_random_uuid(),
  peserta_id uuid not null references peserta(id) on delete cascade,
  penyakit varchar(150) not null,
  created_at timestamptz default now()
);

create table kunjungan (
  id uuid primary key default gen_random_uuid(),
  peserta_id uuid not null references peserta(id) on delete cascade,
  jadwal_kegiatan_id uuid,
  tanggal_kunjungan date not null,
  berat_badan numeric(5,2),
  rujuk boolean default false,
  lokasi lokasi_kunjungan default 'posyandu',
  dibuat_oleh uuid references pengguna(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_kunjungan_peserta on kunjungan(peserta_id);
create index idx_kunjungan_tanggal on kunjungan(tanggal_kunjungan);
create index idx_kunjungan_jadwal on kunjungan(jadwal_kegiatan_id);

create table kunjungan_skrining_tbc (
  id uuid primary key default gen_random_uuid(),
  kunjungan_id uuid not null references kunjungan(id) on delete cascade,
  catatan varchar(150) not null,
  created_at timestamptz default now()
);

create table kunjungan_edukasi (
  id uuid primary key default gen_random_uuid(),
  kunjungan_id uuid not null references kunjungan(id) on delete cascade,
  materi varchar(150) not null,
  created_at timestamptz default now()
);

create table kunjungan_balita (
  kunjungan_id uuid primary key references kunjungan(id) on delete cascade,
  umur_bulan smallint,
  kesimpulan_bb kesimpulan_bb_enum,
  panjang_badan numeric(5,2),
  lingkar_kepala numeric(5,2),
  lingkar_lengan numeric(5,2),
  ada_gejala_sakit boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table kunjungan_balita_intervensi (
  id uuid primary key default gen_random_uuid(),
  kunjungan_id uuid not null references kunjungan_balita(kunjungan_id) on delete cascade,
  jenis varchar(100) not null,
  created_at timestamptz default now()
);

create table kunjungan_bumil (
  kunjungan_id uuid primary key references kunjungan(id) on delete cascade,
  kehamilan_id uuid references kehamilan(id),
  umur_kehamilan smallint,
  lila numeric(5,2),
  tekanan_sistolik smallint,
  tekanan_diastolik smallint,
  tablet_darah boolean default false,
  asi_eksklusif boolean default false,
  mt_bumil_kek boolean default false,
  kelas_bumil boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table kunjungan_remaja (
  kunjungan_id uuid primary key references kunjungan(id) on delete cascade,
  tinggi_badan numeric(5,2),
  lingkar_perut numeric(5,2),
  tekanan_sistolik smallint,
  tekanan_diastolik smallint,
  gula_darah numeric(5,2),
  kadar_hb varchar(20),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table kunjungan_remaja_skrining_mental (
  id uuid primary key default gen_random_uuid(),
  kunjungan_id uuid not null references kunjungan_remaja(kunjungan_id) on delete cascade,
  indikator varchar(150) not null,
  created_at timestamptz default now()
);

create table kunjungan_dewasa (
  kunjungan_id uuid primary key references kunjungan(id) on delete cascade,
  tinggi_badan numeric(5,2),
  lingkar_perut numeric(5,2),
  tekanan_sistolik smallint,
  tekanan_diastolik smallint,
  gula_darah numeric(5,2),
  asam_urat numeric(5,2),
  kolesterol numeric(5,2),
  tes_mata varchar(20),
  tes_telinga varchar(20),
  alat_kontrasepsi varchar(50),
  merokok boolean default false,
  konsumsi_gula boolean default false,
  konsumsi_garam boolean default false,
  konsumsi_lemak boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table kunjungan_dewasa_skrining_puma (
  id uuid primary key default gen_random_uuid(),
  kunjungan_id uuid not null references kunjungan_dewasa(kunjungan_id) on delete cascade,
  jenis_tes varchar(100) not null,
  created_at timestamptz default now()
);

create table kunjungan_dewasa_skrining_adl (
  id uuid primary key default gen_random_uuid(),
  kunjungan_id uuid not null references kunjungan_dewasa(kunjungan_id) on delete cascade,
  aktivitas varchar(100) not null,
  skor smallint not null,
  created_at timestamptz default now()
);

create table jadwal_kegiatan (
  id uuid primary key default gen_random_uuid(),
  judul varchar(255) not null,
  jenis_kegiatan varchar(100),
  tanggal date not null,
  jam_mulai time,
  jam_selesai time,
  lokasi varchar(255),
  deskripsi text,
  status status_jadwal default 'terjadwal',
  dibuat_oleh uuid references pengguna(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_jadwal_tanggal on jadwal_kegiatan(tanggal);

alter table kunjungan
  add constraint fk_kunjungan_jadwal foreign key (jadwal_kegiatan_id) references jadwal_kegiatan(id);

create table pengaduan (
  id uuid primary key default gen_random_uuid(),
  judul varchar(255) not null,
  kategori kategori_pengaduan not null default 'bug_error',
  deskripsi text not null,
  url_lampiran text,
  status status_pengaduan not null default 'menunggu',
  dilaporkan_oleh uuid not null references pengguna(id),
  diselesaikan_oleh uuid references pengguna(id),
  diselesaikan_pada timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_pengaduan_status on pengaduan(status);
create index idx_pengaduan_dilaporkan_oleh on pengaduan(dilaporkan_oleh);

create table pengaduan_tanggapan (
  id uuid primary key default gen_random_uuid(),
  pengaduan_id uuid not null references pengaduan(id) on delete cascade,
  pengguna_id uuid not null references pengguna(id),
  pesan text not null,
  created_at timestamptz default now()
);

create index idx_pengaduan_tanggapan_pengaduan on pengaduan_tanggapan(pengaduan_id);

create table log_aktivitas (
  id uuid primary key default gen_random_uuid(),
  pengguna_id uuid references pengguna(id),
  aksi varchar(100) not null,
  modul varchar(100) not null,
  deskripsi text,
  tabel_terkait varchar(100),
  id_terkait uuid,
  alamat_ip inet,
  created_at timestamptz default now()
);

create index idx_log_aktivitas_pengguna on log_aktivitas(pengguna_id);
create index idx_log_aktivitas_modul on log_aktivitas(modul);
create index idx_log_aktivitas_created on log_aktivitas(created_at desc);

create table log_backup (
  id uuid primary key default gen_random_uuid(),
  nama_file varchar(255) not null,
  ukuran_file bigint,
  path_penyimpanan text,
  status status_backup default 'in_progress',
  dipicu_oleh uuid references pengguna(id),
  pesan_error text,
  created_at timestamptz default now()
);
