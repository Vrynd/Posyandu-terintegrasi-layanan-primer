/**
 * MobileLogo - Logo for mobile view on auth pages
 */

export function MobileLogo() {
    return (
        <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-white text-xl font-urbanist font-extrabold shadow-lg shadow-blue-500/30 mb-4">
                ILP
            </div>
            <h1 className="text-2xl font-urbanist font-bold text-gray-900">
                Posyandu ILP
            </h1>
            <p className="text-gray-500 text-sm mt-1">Desa Tondomulyo</p>
        </div>
    );
}
