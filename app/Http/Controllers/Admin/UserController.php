<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    // Tampilkan daftar kader beserta metrik statistik dan data paginasi.
    public function index(): Response
    {
        /** @var object{total_count: int, suspended_count: int, incomplete_profile_count: int, pending_verification_count: int} $stats */
        $stats = User::where('role', UserRole::Kader)
            ->selectRaw('
            COUNT(*) as total_count,
            SUM(CASE WHEN is_active = false THEN 1 ELSE 0 END) as suspended_count,
            SUM(CASE WHEN nik_hash IS NULL OR nik_hash = "" THEN 1 ELSE 0 END) as incomplete_profile_count,
            SUM(CASE WHEN email_verified_at IS NULL THEN 1 ELSE 0 END) as pending_verification_count
        ')
            ->toBase()
            ->first();

        $users = User::where('role', UserRole::Kader)
            ->select(['id', 'ulid', 'name', 'nik', 'email', 'role', 'is_active', 'created_at'])
            ->latest('created_at')
            ->paginate(5)
            ->through(fn (User $user) => [
                'id' => $user->ulid,
                'name' => $user->name,
                'nik' => $user->nik ? Str::mask($user->nik, '*', 4, 8) : null,
                'email' => $user->email,
                'role' => $user->role->value,
                'is_profile_complete' => $user->isProfileComplete(),
                'is_active' => (bool) $user->is_active,
                'created_at' => $user->created_at->format('d M Y'),
            ]);

        return Inertia::render('admin/Users', [
            'metrics' => [
                'totalCount' => (int) $stats->total_count,
                'suspendedCount' => (int) $stats->suspended_count,
                'incompleteProfileCount' => (int) $stats->incomplete_profile_count,
                'pendingVerificationCount' => (int) $stats->pending_verification_count,
            ],
            'users' => $users,
        ]);
    }

    // Tampilkan halaman form untuk membuat akun kader baru.
    public function create(): Response
    {
        return Inertia::render('admin/CreateUser');
    }

    // Validasi dan simpan akun kader baru ke database.
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'nik' => [
                'nullable',
                'string',
                'digits:16',
                function ($attribute, $value, $fail) {
                    if (! $value) {
                        return;
                    }

                    if (User::where('nik_hash', hash('sha256', $value))->exists()) {
                        $fail('NIK ini sudah terdaftar di sistem.');
                    }
                },
            ],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', new Enum(UserRole::class)],
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'nik.digits' => 'NIK harus berupa 16 digit angka.',
            'nik.unique' => 'NIK ini sudah terdaftar di sistem.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format alamat email tidak valid.',
            'email.unique' => 'Alamat email sudah digunakan pengguna lain.',
            'password.required' => 'Password wajib diisi.',
            'password.min' => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'role.required' => 'Peran pengguna wajib dipilih.',
        ]);

        $role = UserRole::from($validated['role']);

        User::create([
            'name' => $validated['name'],
            'nik' => $validated['nik'] ?? null,
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $role,
            'is_active' => true,
        ]);

        return redirect()
            ->route('users.index')
            ->with('success', "Akun {$role->label()} {$validated['name']} berhasil dibuat.");
    }

    // Tampilkan halaman form edit profil dan keamanan akun kader.
    public function edit(User $user): Response
    {
        return Inertia::render('admin/EditUser', [
            'user' => [
                'id' => $user->ulid,
                'name' => $user->name,
                'email' => $user->email,
                'nik' => $user->nik ? Str::mask($user->nik, '*', 4, 8) : null,
                'role' => $user->role->value,
                'is_active' => (bool) $user->is_active,
                'created_at' => $user->created_at->format('d M Y'),
                'last_login_at' => $user->last_login_at ? $user->last_login_at->format('d M Y, H:i') : null,
                'updated_at' => $user->updated_at ? $user->updated_at->format('d M Y, H:i') : null,
            ],
        ]);
    }

    // Validasi dan perbarui data profil kader (nama, email, NIK, peran).
    public function update(Request $request, User $user): RedirectResponse
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'nik' => [
                'nullable',
                'string',
                'size:16',
                function ($attribute, $value, $fail) use ($user) {
                    if (! $value) {
                        return;
                    }

                    $exists = User::where('nik_hash', hash('sha256', $value))
                        ->where('id', '!=', $user->id)
                        ->exists();

                    if ($exists) {
                        $fail('NIK ini sudah terdaftar di sistem.');
                    }
                },
            ],
            'role' => ['required', new Enum(UserRole::class)],
        ];

        if ($request->has('email')) {
            $rules['email'] = ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)];
        }

        $validated = $request->validate($rules, [
            'name.required' => 'Nama lengkap wajib diisi.',
            'role.required' => 'Peran pengguna wajib dipilih.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format alamat email tidak valid.',
            'email.unique' => 'Alamat email sudah digunakan pengguna lain.',
            'nik.size' => 'NIK harus berjumlah 16 digit angka.',
        ]);

        $user->update($validated);

        return back()->with('success', "Profil {$user->name} berhasil diperbarui.");
    }

    // Hapus akun kader secara permanen dari sistem (tidak dapat dilakukan pada akun sendiri).
    public function destroy(User $user): RedirectResponse
    {
        if (Auth::id() === $user->id) {
            return back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $userName = $user->name;
        $user->delete();

        return redirect()
            ->route('users.index')
            ->with('success', "Akun kader {$userName} berhasil dihapus secara permanen.");
    }

    // Toggle status aktif/nonaktif akun kader (tidak dapat dilakukan pada akun sendiri).
    public function status(User $user): RedirectResponse
    {
        if (Auth::id() === $user->id) {
            return back()->with('error', 'Anda tidak dapat menonaktifkan akun sendiri.');
        }

        $user->update(['is_active' => ! $user->is_active]);

        $statusText = $user->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return back()->with('success', "Akun {$user->name} berhasil {$statusText}.");
    }

    // Generate kata sandi acak sementara dan simpan ke akun kader yang dituju.
    public function resetPassword(User $user): RedirectResponse
    {
        $tempPassword = $this->generateStrongPassword(8);

        $user->update(['password' => Hash::make($tempPassword)]);

        return back()
            ->with('temp_password', $tempPassword)
            ->with('success', "Kata sandi sementara untuk kader {$user->name} berhasil dibuat.");
    }

    // Buat string kata sandi acak yang mengandung huruf besar, kecil, angka, dan simbol.
    private function generateStrongPassword(int $length = 10): string
    {
        $uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        $lowercase = 'abcdefghijkmnpqrstuvwxyz';
        $numbers = '23456789';
        $symbols = '!@#$%&*';

        $pass = [
            $uppercase[random_int(0, strlen($uppercase) - 1)],
            $lowercase[random_int(0, strlen($lowercase) - 1)],
            $numbers[random_int(0, strlen($numbers) - 1)],
            $symbols[random_int(0, strlen($symbols) - 1)],
        ];

        $all = $uppercase.$lowercase.$numbers.$symbols;

        for ($i = count($pass); $i < $length; $i++) {
            $pass[] = $all[random_int(0, strlen($all) - 1)];
        }

        shuffle($pass);

        return 'Posyandu#'.implode('', $pass);
    }
}
