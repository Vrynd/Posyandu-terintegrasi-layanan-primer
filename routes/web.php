<?php

use App\Http\Controllers\Admin\TokenController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\VerifyTokenController;
use App\Http\Controllers\Participants\ParticipantController;
use App\Http\Controllers\Schedules\ScheduleController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'userCount' => User::count(),
    ]);
})->name('home');

Route::middleware('guest')->group(function () {
    Route::post('/login/token', [VerifyTokenController::class, 'store'])->name('login.token');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');

    // Route pendaftaran peserta
    Route::get('/participants', [ParticipantController::class, 'index'])->name('participants.index');
    Route::get('/participants/create', [ParticipantController::class, 'create'])->name('participants.create');
    Route::post('/participants', [ParticipantController::class, 'store'])
        ->middleware('throttle:30,1')
        ->name('participants.store');
    Route::get('/participants/{participant}/edit', [ParticipantController::class, 'edit'])
        ->name('participants.edit');
    Route::put('/participants/{participant}', [ParticipantController::class, 'update'])
        ->name('participants.update');
    Route::delete('/participants/{participant}', [ParticipantController::class, 'destroy'])
        ->name('participants.destroy');

    // Route jadwal kegiatan
    Route::get('/schedules', [ScheduleController::class, 'index'])->name('schedules.index');
    Route::get('/schedules/history', [ScheduleController::class, 'history'])->name('schedules.history');
    Route::patch('/schedules/{schedule}/status', [ScheduleController::class, 'updateStatus'])->name('schedules.update-status');

    Route::middleware('can:manage-schedules')->group(function () {
        Route::post('/schedules', [ScheduleController::class, 'store'])->name('schedules.store');
        Route::delete('/schedules/history', [ScheduleController::class, 'clear'])->name('schedules.history.clear');
        Route::delete('/schedules/{schedule}', [ScheduleController::class, 'destroy'])->name('schedules.destroy');
    });

    Route::middleware('can:manage-tokens')->group(function () {
        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::get('users/create', [UserController::class, 'create'])->name('users.create');
        Route::post('users', [UserController::class, 'store'])->name('users.store');
        Route::get('users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
        Route::patch('users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::patch('users/{user}/status', [UserController::class, 'status'])->name('users.status');
        Route::post('users/{user}/reset-password', [UserController::class, 'resetPassword'])->name('users.reset-password');
        Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

        Route::get('tokens', [TokenController::class, 'index'])->name('tokens.index');
        Route::post('tokens', [TokenController::class, 'store'])->name('tokens.store');
    });
});

require __DIR__.'/settings.php';
