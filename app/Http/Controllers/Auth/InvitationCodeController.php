<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\InvitationCode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
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
        ], [
            'code.required' => 'Kode undangan wajib diisi.',
            'code.size' => 'Kode undangan harus persis 16 karakter.',
        ]);

        $rateKey = 'invitation-code:'.$request->ip();

        if (RateLimiter::tooManyAttempts($rateKey, 5)) {
            $seconds = RateLimiter::availableIn($rateKey);

            throw ValidationException::withMessages([
                'code' => ["Terlalu banyak percobaan. Silakan coba lagi dalam {$seconds} detik."],
            ]);
        }

        $codeHash = InvitationCode::hash($validated['code']);
        $invitation = InvitationCode::with('user')->where('code_hash', $codeHash)->first();

        if (! $invitation || ! $invitation->isValid() || ! $invitation->user) {
            RateLimiter::hit($rateKey, 900); // 15 minutes lockout window

            throw ValidationException::withMessages([
                'code' => ['Kode undangan tidak valid, atau sudah pernah digunakan.'],
            ]);
        }

        RateLimiter::clear($rateKey);

        $user = $invitation->user;

        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        $invitation->markAsUsed();

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
