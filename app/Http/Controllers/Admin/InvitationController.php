<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InvitationCode;
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
}
