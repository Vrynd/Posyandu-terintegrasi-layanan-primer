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
