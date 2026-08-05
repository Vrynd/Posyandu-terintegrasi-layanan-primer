<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\VerificationToken;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TokenController extends Controller
{
    public function index(): Response
    {
        $tokens = VerificationToken::with('user:id,name,email')
            ->latest()
            ->paginate(5)
            ->through(fn ($token) => [
                'id' => $token->id,
                'user' => [
                    'name' => $token->user->name,
                    'email' => $token->user->email,
                ],
                'is_used' => $token->is_used,
                'is_valid' => $token->isValid(),
                'used_at' => $token->used_at?->format('d M Y, H:i'),
                'expires_at' => $token->expires_at->format('d M Y, H:i'),
                'created_at' => $token->created_at->format('d M Y, H:i'),
            ]);

        return Inertia::render('admin/ManageTokens', [
            'tokens' => $tokens,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email', 'exists:users,email'],
        ], [
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format alamat email tidak valid.',
            'email.exists' => 'Email ini tidak terdaftar di sistem.',
        ]);

        $user = User::where('email', $validated['email'])->firstOrFail();
        $rawToken = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        VerificationToken::updateOrCreate(
            ['user_id' => $user->id],
            [
                'token_hash' => VerificationToken::hash($rawToken),
                'expires_at' => now()->addMinutes(5),
                'is_used' => false,
                'used_at' => null,
            ]
        );

        return back()->with('generated_token', [
            'name' => $user->name,
            'email' => $user->email,
            'token' => $rawToken,
            'expires_in_minutes' => 5,
        ]);
    }
}
