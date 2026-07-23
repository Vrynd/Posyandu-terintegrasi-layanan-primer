<?php

use App\Enums\UserRole;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('user model casts nik, role, failed_login_attempts, and locked_until correctly', function () {
    $user = User::factory()->create([
        'nik' => '3512345678901234',
        'role' => UserRole::Administrator,
        'failed_login_attempts' => 3,
        'locked_until' => now()->addMinutes(10),
    ]);

    expect($user->nik)->toBe('3512345678901234')
        ->and($user->role)->toBe(UserRole::Administrator)
        ->and($user->failed_login_attempts)->toBe(3)
        ->and($user->locked_until)->toBeInstanceOf(CarbonInterface::class);

});

test('user role helper methods work correctly', function () {
    $admin = User::factory()->administrator()->create();
    $kader = User::factory()->kader()->create();

    expect($admin->isAdministrator())->toBeTrue()
        ->and($admin->isKader())->toBeFalse()
        ->and($kader->isKader())->toBeTrue()
        ->and($kader->isAdministrator())->toBeFalse();
});

test('user lock helper method works correctly', function () {
    $unlockedUser = User::factory()->create();
    $lockedUser = User::factory()->locked()->create();

    expect($unlockedUser->isLocked())->toBeFalse()
        ->and($lockedUser->isLocked())->toBeTrue();
});
