<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
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
        $activeCount = (clone $cadre)->whereNotNull('email_verified_at')->count();
        $suspendedCount = (clone $cadre)->whereNull('email_verified_at')->count();
        $verifiedProfileCount = (clone $cadre)->whereNotNull('nik')->where('nik', '!=', '')->count();

        $users = (clone $cadre)
            ->latest('created_at')
            ->paginate(4)
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'nik' => $user->nik ? Str::mask($user->nik, '*', 4, 8) : null,
                'email' => $user->email,
                'role' => $user->role->value ?? $user->role,
                'is_profile_complete' => ! empty($user->nik),
                'is_active' => ! is_null($user->email_verified_at),
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
}
