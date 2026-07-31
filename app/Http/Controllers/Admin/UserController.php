<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
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
                'nik' => $user->nik,
                'role' => $user->role->value ?? $user->role,
                'is_active' => (bool) $user->is_active,
                'created_at' => $user->created_at->format('d M Y'),
                'last_login_at' => $user->last_login_at ? $user->last_login_at->format('d M Y, H:i') : null,
            ],
        ]);
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

        return back()->with('success', "Akun kader {$user->name} berhasil {$statusText}.");
    }
}
