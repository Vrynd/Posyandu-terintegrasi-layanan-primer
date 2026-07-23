<?php

use App\Enums\UserRole;
use App\Models\InvitationCode;
use App\Models\User;

test('kader can authenticate using valid 16-character invitation code linked to user account', function () {
    $rawCode = 'KDR1689204751XYZ';

    $cadreUser = User::factory()->create([
        'name' => 'Kader Ani',
        'email' => 'kader.ani@posyandu.test',
        'nik' => '3512345678901234',
        'role' => UserRole::Kader,
        'email_verified_at' => null,
    ]);

    $invitation = InvitationCode::factory()->create([
        'user_id' => $cadreUser->id,
        'code_hash' => InvitationCode::hash($rawCode),
        'is_used' => false,
        'expires_at' => now()->addDays(7),
    ]);

    $response = $this->post(route('login.invitation'), [
        'code' => $rawCode,
    ]);

    $response->assertRedirect(route('dashboard', absolute: false));
    $this->assertAuthenticatedAs($cadreUser);

    $cadreUser->refresh();
    expect($cadreUser->hasVerifiedEmail())->toBeTrue();

    $invitation->refresh();
    expect($invitation->is_used)->toBeTrue()
        ->and($invitation->used_at)->not->toBeNull();
});

test('expired invitation code is rejected', function () {
    $rawCode = 'EXPIRED123456789';

    InvitationCode::factory()->expired()->create([
        'code_hash' => InvitationCode::hash($rawCode),
    ]);

    $response = $this->post(route('login.invitation'), [
        'code' => $rawCode,
    ]);

    $response->assertSessionHasErrors('code');
    $this->assertGuest();
});

test('already used invitation code cannot be used twice', function () {
    $rawCode = 'ALREADYUSED12345';

    InvitationCode::factory()->used()->create([
        'code_hash' => InvitationCode::hash($rawCode),
    ]);

    $response = $this->post(route('login.invitation'), [
        'code' => $rawCode,
    ]);

    $response->assertSessionHasErrors('code');
    $this->assertGuest();
});

test('rate limiter blocks brute force attempts after 5 failed tries', function () {
    for ($i = 0; $i < 5; $i++) {
        $this->post(route('login.invitation'), [
            'code' => 'INVALIDCODE12345',
        ]);
    }

    $response = $this->post(route('login.invitation'), [
        'code' => 'INVALIDCODE12345',
    ]);

    $response->assertSessionHasErrors('code');
    $this->assertGuest();
});
