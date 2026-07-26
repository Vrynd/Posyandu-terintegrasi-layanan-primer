<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\InvitationCode;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class InvitationController extends Controller
{
    /**
     * Display the invitation codes management page with live database metrics.
     */
    public function index(): Response
    {
        return Inertia::render('admin/Invitations', [
            'metrics' => [
                'activeCount' => InvitationCode::where('is_used', false)->where('expires_at', '>', now())->count(),
                'usedCount' => InvitationCode::where('is_used', true)->count(),
                'expiredCount' => InvitationCode::where('is_used', false)->where('expires_at', '<=', now())->count(),
                'expiringSoonCount' => InvitationCode::where('is_used', false)
                    ->where('expires_at', '>', now())
                    ->where('expires_at', '<=', now()->addDays(3))
                    ->count(),
                'totalCount' => InvitationCode::count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/CreateInvitation');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'nik' => ['required', 'string', 'size:16', 'unique:users,nik'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
        ], [
            'nik.required' => 'NIK wajib diisi.',
            'nik.size' => 'NIK harus berjumlah 16 digit.',
            'nik.unique' => 'NIK ini sudah terdaftar di sistem.',
            'email.unique' => 'Email ini sudah terdaftar.',
        ]);
        // 1. Generate Random Temporary Password (misal: Kader#9A2B)
        $tempPassword = 'Kader#'.strtoupper(Str::random(4));
        // 2. Buat Akun Kader Baru (Role: Kader)
        $user = User::create([
            'name' => $validated['name'],
            'nik' => $validated['nik'],
            'email' => $validated['email'],
            'password' => $tempPassword, // Hashed via User model cast
            'role' => UserRole::Kader,
        ]);
        // 3. Generate Kode Undangan 16-Character (Format: XXXX-XXXX-XXXX-XXXX)
        $rawCode = strtoupper(Str::random(4).'-'.Str::random(4).'-'.Str::random(4).'-'.Str::random(4));
        // 4. Simpan Kode Undangan
        InvitationCode::create([
            'user_id' => $user->id,
            'code_hash' => InvitationCode::hash($rawCode),
            'is_used' => false,
            'expires_at' => now()->addDays(7), // Berlaku 7 hari
        ]);

        // 5. Kembali ke Halaman Tabel dengan Flash Message Kredensial
        return redirect()->route('invitations.index')->with('success_invitation', [
            'raw_code' => $rawCode,
            'temp_password' => $tempPassword,
            'cadre_name' => $user->name,
            'cadre_email' => $user->email,
        ]);
    }
}
