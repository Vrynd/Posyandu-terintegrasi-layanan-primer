<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\VerificationToken;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class VerifyTokenController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'token' => ['required', 'string', 'size:6'],
        ], [
            'token.required' => 'Token verifikasi wajib diisi.',
            'token.size' => 'Token verifikasi harus 6 digit.',
        ]);

        $rateKey = 'token-login:'.$request->ip();

        if (RateLimiter::tooManyAttempts($rateKey, 5)) {
            $seconds = RateLimiter::availableIn($rateKey);

            throw ValidationException::withMessages([
                'token' => ["Terlalu banyak percobaan. Silakan coba lagi dalam {$seconds} detik."],
            ]);
        }

        $tokenHash = VerificationToken::hash($validated['token']);
        $verificationToken = VerificationToken::where('token_hash', $tokenHash)->first();

        if (! $verificationToken || ! $verificationToken->isValid()) {
            RateLimiter::hit($rateKey, 900);
            throw ValidationException::withMessages([
                'token' => ['Token verifikasi tidak valid atau telah kedaluwarsa.'],
            ]);
        }

        RateLimiter::clear($rateKey);
        $verificationToken->markAsUsed();

        Auth::login($verificationToken->user);
        $request->session()->regenerate();

        return redirect()->route('dashboard');
    }
}
