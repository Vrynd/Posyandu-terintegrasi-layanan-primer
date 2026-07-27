<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InvitationCode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class InvitationController extends Controller
{
    /**
     * Display the invitation codes management page with live metrics & paginated table data.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $invitations = InvitationCode::with('user:id,name,email')
            ->when($search, function ($query, $s) {
                $query->where('code_hash', 'like', "%{$s}%")
                    ->orWhereHas('user', fn ($q) => $q->where('name', 'like', "%{$s}%"));
            })
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($item) => [
                'id' => $item->id,
                'code_hash' => $item->code_hash,
                'is_used' => $item->is_used,
                'used_at' => $item->used_at?->format('d M Y, H:i'),
                'expires_at' => $item->expires_at->format('d M Y'),
                'is_expired' => ! $item->is_used && $item->expires_at->isPast(),
                'is_expiring_soon' => ! $item->is_used && $item->expires_at->isFuture() && $item->expires_at->diffInDays(now()) <= 3,
                'created_at' => $item->created_at?->format('d M Y, H:i'),
                'user' => $item->user ? [
                    'name' => $item->user->name,
                    'email' => $item->user->email,
                ] : null,
            ]);

        return Inertia::render('admin/Invitations', [
            'metrics' => [
                'activeCount' => InvitationCode::where('is_used', false)->where('expires_at', '>', now())->count(),
                'usedCount' => InvitationCode::where('is_used', true)->count(),
                'expiredCount' => InvitationCode::where('is_used', false)->where('expires_at', '<=', now())->count(),
                'totalCount' => InvitationCode::count(),
            ],
            'invitations' => $invitations,
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }

    /**
     * Display the form to create a new invitation code.
     */
    public function create(): Response
    {
        return Inertia::render('admin/CreateInvitation');
    }

    /**
     * Store a new invitation code with assigned cadre details.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'recipient_name' => ['required', 'string', 'max:255'],
            'recipient_email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
        ], [
            'recipient_name.required' => 'Nama calon kader wajib diisi.',
            'recipient_email.required' => 'Email calon kader wajib diisi.',
            'recipient_email.unique' => 'Email ini sudah terdaftar sebagai pengguna aktif.',
        ]);

        // Generate 16-character random code without hyphens
        $rawCode = strtoupper(Str::random(16));

        InvitationCode::create([
            'user_id' => null,
            'recipient_name' => $validated['recipient_name'],
            'recipient_email' => $validated['recipient_email'],
            'code_hash' => InvitationCode::hash($rawCode),
            'is_used' => false,
            'expires_at' => now()->addDays(7),
        ]);

        return back()->with('success_invitation', [
            'raw_code' => $rawCode,
            'recipient_name' => $validated['recipient_name'],
            'recipient_email' => $validated['recipient_email'],
        ]);
    }
}
