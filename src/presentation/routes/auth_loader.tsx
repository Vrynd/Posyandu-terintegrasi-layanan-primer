import { ClipLoader } from 'react-spinners';

// AuthLoader - Loader layar penuh untuk pengecekan auth
export function AuthLoader() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
            <ClipLoader color="#ffffff" size={50} speedMultiplier={0.8} />
            <p className="mt-4 text-white font-medium">Memuat...</p>
        </div>
    );
}
