<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\InvitationCode;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class InvitationCodeController extends Controller
{
    /**
     * Authenticate and activate a cadre user using a 16-character invitation code.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'size:16'],
            'password' => ['required', 'string', Password::defaults(), 'confirmed'],
        ], [
            'code.required' => 'Kode undangan wajib diisi.',
            'code.size' => 'Kode undangan harus 16 karakter.',
            'password.required' => 'Password wajib diisi.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
        ]);

        $rateKey = 'invitation-code:'.$request->ip();

        if (RateLimiter::tooManyAttempts($rateKey, 5)) {
            $seconds = RateLimiter::availableIn($rateKey);

            throw ValidationException::withMessages([
                'code' => ["Terlalu banyak percobaan. Silakan coba lagi dalam {$seconds} detik."],
            ]);
        }

        $codeHash = InvitationCode::hash($validated['code']);
        $invitation = InvitationCode::where('code_hash', $codeHash)->first();

        if (! $invitation || ! $invitation->isValid()) {
            RateLimiter::hit($rateKey, 900);

            throw ValidationException::withMessages([
                'code' => ['Kode undangan tidak valid, atau sudah pernah digunakan.'],
            ]);
        }

        RateLimiter::clear($rateKey);

        $user = User::create([
            'name' => $invitation->recipient_name ?? 'Kader Posyandu',
            'email' => $invitation->recipient_email ?? 'kader@posyandu.test',
            'password' => Hash::make($validated['password']),
            'role' => UserRole::Kader,
        ]);

        $user->markEmailAsVerified();

        $invitation->update([
            'user_id' => $user->id,
            'is_used' => true,
            'used_at' => now(),
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('dashboard');
    }
}
