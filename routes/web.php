<?php

use App\Http\Controllers\Auth\InvitationCodeController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'userCount' => User::count(),
    ]);
})->name('home');

Route::middleware('guest')->group(function () {
    Route::post('/login/invitation', [InvitationCodeController::class, 'store'])->name('login.invitation');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
