<?php

use App\Enums\UserRole;
use App\Models\User;
use App\Models\VerificationToken;

test('admin can view manage tokens page', function () {
    $admin = User::factory()->create([
        'role' => UserRole::Administrator,
    ]);

    $response = $this->actingAs($admin)->get(route('tokens.index'));

    $response->assertOk();
});

test('non-admin user cannot access manage tokens page', function () {
    $kader = User::factory()->create([
        'role' => UserRole::Kader,
    ]);

    $response = $this->actingAs($kader)->get(route('tokens.index'));

    $response->assertForbidden();
});

test('admin can generate new 6-digit verification token for registered cadre email', function () {
    $admin = User::factory()->create([
        'role' => UserRole::Administrator,
    ]);

    $kader = User::factory()->create([
        'role' => UserRole::Kader,
        'email_verified_at' => null,
    ]);

    $response = $this->actingAs($admin)->post(route('tokens.store'), [
        'email' => $kader->email,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('generated_token');

    $generatedFlash = session('generated_token');
    expect($generatedFlash['email'])->toBe($kader->email)
        ->and(strlen($generatedFlash['token']))->toBe(6);

    expect(VerificationToken::where('user_id', $kader->id)->count())->toBe(1);
});

test('generating token for unregistered email returns validation error', function () {
    $admin = User::factory()->create([
        'role' => UserRole::Administrator,
    ]);

    $response = $this->actingAs($admin)->post(route('tokens.store'), [
        'email' => 'unregistered.kader@test.com',
    ]);

    $response->assertSessionHasErrors(['email']);
});

test('admin can reissue new token when previous token is expired', function () {
    $admin = User::factory()->create([
        'role' => UserRole::Administrator,
    ]);

    $kader = User::factory()->create([
        'role' => UserRole::Kader,
        'email_verified_at' => null,
    ]);

    // Token lama yang sudah kedaluwarsa
    $oldTokenRecord = VerificationToken::create([
        'user_id' => $kader->id,
        'token_hash' => VerificationToken::hash('111111'),
        'expires_at' => now()->subMinutes(10),
        'is_used' => false,
    ]);

    // Admin menerbitkan ulang token baru untuk email kader yang sama
    $response = $this->actingAs($admin)->post(route('tokens.store'), [
        'email' => $kader->email,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('generated_token');

    $newFlashData = session('generated_token');

    // Memastikan token baru berbeda dengan token lama & total token kader menjadi 2 (1 expired, 1 aktif)
    expect($newFlashData['token'])->not->toBe('111111')
        ->and(VerificationToken::where('user_id', $kader->id)->count())->toBe(1);
});
