<?php

use App\Models\User;
use App\Models\VerificationToken;

test('kader can verify account using valid 6-digit token', function () {
    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);

    $rawToken = $user->issueVerificationToken();

    $response = $this->post(route('login.token'), [
        'token' => $rawToken,
    ]);

    $response->assertRedirect(route('dashboard'));

    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
    $this->assertAuthenticatedAs($user);
});

test('expired token is rejected', function () {
    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);

    $rawToken = '123456';
    $user->verificationTokens()->create([
        'token_hash' => VerificationToken::hash($rawToken),
        'expires_at' => now()->subMinute(),
        'is_used' => false,
    ]);

    $response = $this->post(route('login.token'), [
        'token' => $rawToken,
    ]);

    $response->assertSessionHasErrors(['token']);
    $this->assertGuest();
});

test('already used token cannot be used twice', function () {
    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);

    $rawToken = '654321';
    $user->verificationTokens()->create([
        'token_hash' => VerificationToken::hash($rawToken),
        'expires_at' => now()->addMinutes(30),
        'is_used' => true,
        'used_at' => now(),
    ]);

    $response = $this->post(route('login.token'), [
        'token' => $rawToken,
    ]);

    $response->assertSessionHasErrors(['token']);
    $this->assertGuest();
});

test('token input must be exactly 6 digits', function () {
    $responseShort = $this->post(route('login.token'), [
        'token' => '123',
    ]);
    $responseShort->assertSessionHasErrors(['token']);

    $responseLong = $this->post(route('login.token'), [
        'token' => '1234567',
    ]);
    $responseLong->assertSessionHasErrors(['token']);
});

test('reissuing new token allows user to verify with latest token', function () {
    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);

    // Token lama yang kedaluwarsa
    $oldToken = '111111';
    $user->verificationTokens()->create([
        'token_hash' => VerificationToken::hash($oldToken),
        'expires_at' => now()->subMinute(),
        'is_used' => false,
    ]);

    // Admin menerbitkan token baru
    $newToken = $user->issueVerificationToken();

    // Coba dengan token lama -> gagal
    $responseOld = $this->post(route('login.token'), ['token' => $oldToken]);
    $responseOld->assertSessionHasErrors(['token']);
    $this->assertGuest();

    // Coba dengan token baru -> berhasil
    $responseNew = $this->post(route('login.token'), ['token' => $newToken]);
    $responseNew->assertRedirect(route('dashboard'));
    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
    $this->assertAuthenticatedAs($user);
});

test('rate limiter blocks brute force attempts after 5 failed tries', function () {
    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);

    $user->issueVerificationToken();

    // Melakukan 5 kali percobaan salah
    for ($i = 0; $i < 5; $i++) {
        $this->post(route('login.token'), ['token' => '000000']);
    }

    // Percobaan ke-6 harus diblokir oleh Rate Limiter
    $responseBlocked = $this->post(route('login.token'), ['token' => '000000']);
    $responseBlocked->assertSessionHasErrors(['token']);
    expect(session('errors')->get('token')[0])->toContain('Terlalu banyak percobaan');
});
