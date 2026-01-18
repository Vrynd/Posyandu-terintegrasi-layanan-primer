// Index Modul Datasources untuk semua API datasources

// Base interfaces
export type {
    ListableDataSource,
    DetailableDataSource,
    CreatableDataSource,
    UpdatableDataSource,
    DeletableDataSource,
    CrudDataSource,
    ReadOnlyDataSource,
} from './BaseDataSource';

// Auth
export { AuthApiDataSource, authApiDataSource } from './AuthApiDataSource';

// Dashboard
export { DashboardApiDataSource, dashboardApiDataSource } from './DashboardApiDataSource';

// Peserta
export { PesertaApiDataSource, pesertaApiDataSource } from './PesertaApiDataSource';

// Pemeriksaan
export { 
    PemeriksaanApiDataSource, 
    pemeriksaanApiDataSource,
    kunjunganApiDataSource, // alias backward compatibility
} from './PemeriksaanApiDataSource';

// Pengaduan
export { PengaduanApiDataSource, pengaduanApiDataSource } from './PengaduanApiDataSource';
