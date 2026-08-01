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
    /**
     * Display a listing of registered users / cadres.
     */
    public function index(): Response
    {
        $cadre = User::where('role', UserRole::Kader);
        $totalCount = (clone $cadre)->count();
        $activeCount = (clone $cadre)->where('is_active', true)->count();
        $suspendedCount = (clone $cadre)->where('is_active', false)->count();
        $verifiedProfileCount = (clone $cadre)->whereNotNull('nik')->where('nik', '!=', '')->count();

        $users = (clone $cadre)
            ->latest('created_at')
            ->paginate(4)
            ->through(fn (User $user) => [
                'id' => $user->ulid,
                'name' => $user->name,
                'nik' => $user->nik ? Str::mask($user->nik, '*', 4, 8) : null,
                'email' => $user->email,
                'role' => $user->role->value ?? $user->role,
                'is_profile_complete' => ! empty($user->nik),
                'is_active' => (bool) $user->is_active,
                'created_at' => $user->created_at->format('d M Y'),
            ]);

        return Inertia::render('admin/Users', [
            'metrics' => [
                'totalCount' => $totalCount,
                'activeCount' => $activeCount,
                'suspendedCount' => $suspendedCount,
                'verifiedProfileCount' => $verifiedProfileCount,
            ],
            'users' => $users,
        ]);
    }

    public function edit(User $user): Response
    {
        return Inertia::render('admin/EditUser', [
            'user' => [
                'id' => $user->ulid,
                'name' => $user->name,
                'email' => $user->email,
                'nik' => $user->nik ? Str::mask($user->nik, '*', 4, 8) : null,
                'role' => $user->role->value ?? $user->role,
                'is_active' => (bool) $user->is_active,
                'created_at' => $user->created_at->format('d M Y'),
                'last_login_at' => $user->last_login_at ? $user->last_login_at->format('d M Y, H:i') : null,
                'updated_at' => $user->updated_at ? $user->updated_at->format('d M Y, H:i') : null,
            ],
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'nik' => ['nullable', 'string', 'size:16', Rule::unique('users')->ignore($user->id)],
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
            'nik.unique' => 'NIK ini sudah terdaftar di sistem.',
        ]);

        $user->update($validated);

        return back()->with('success', "Profil {$user->name} berhasil diperbarui.");
    }

    public function status(User $user): RedirectResponse
    {
        if (Auth::id() === $user->id) {
            return back()->with('error', 'Anda tidak dapat menonaktifkan akun sendiri.');
        }
        $user->update([
            'is_active' => ! $user->is_active,
        ]);
        $statusText = $user->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return back()->with('success', "Akun {$user->name} berhasil {$statusText}.");
    }

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

    public function resetPassword(User $user): RedirectResponse
    {
        $tempPassword = $this->generateStrongPassword(8);
        $user->update([
            'password' => Hash::make($tempPassword),
        ]);

        return back()
            ->with('temp_password', $tempPassword)
            ->with('success', "Kata sandi sementara untuk kader {$user->name} berhasil dibuat.");
    }

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
}
