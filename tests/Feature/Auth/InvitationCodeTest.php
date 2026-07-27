<?php

use App\Enums\UserRole;
use App\Models\InvitationCode;
use App\Models\User;

test('kader can authenticate and set up password using valid 16-character invitation code', function () {
    $rawCode = 'KDR1689204751XYZ';

    $invitation = InvitationCode::factory()->create([
        'user_id' => null,
        'recipient_name' => 'Kader Ani',
        'recipient_email' => 'kader.ani@posyandu.test',
        'code_hash' => InvitationCode::hash($rawCode),
        'is_used' => false,
        'expires_at' => now()->addDays(7),
    ]);

    $response = $this->post(route('login.invitation'), [
        'code' => $rawCode,
        'password' => 'Password#123',
        'password_confirmation' => 'Password#123',
    ]);

    $response->assertRedirect(route('dashboard', absolute: false));

    $createdUser = User::where('email', 'kader.ani@posyandu.test')->first();
    expect($createdUser)->not->toBeNull()
        ->and($createdUser->role)->toBe(UserRole::Kader)
        ->and($createdUser->hasVerifiedEmail())->toBeTrue();

    $this->assertAuthenticatedAs($createdUser);

    $invitation->refresh();
    expect($invitation->is_used)->toBeTrue()
        ->and($invitation->user_id)->toBe($createdUser->id)
        ->and($invitation->used_at)->not->toBeNull();
});

test('expired invitation code is rejected', function () {
    $rawCode = 'EXPIRED123456789';

    InvitationCode::factory()->expired()->create([
        'code_hash' => InvitationCode::hash($rawCode),
    ]);

    $response = $this->post(route('login.invitation'), [
        'code' => $rawCode,
        'password' => 'Password#123',
        'password_confirmation' => 'Password#123',
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
        'password' => 'Password#123',
        'password_confirmation' => 'Password#123',
    ]);

    $response->assertSessionHasErrors('code');
    $this->assertGuest();
});

test('rate limiter blocks brute force attempts after 5 failed tries', function () {
    for ($i = 0; $i < 5; $i++) {
        $this->post(route('login.invitation'), [
            'code' => 'INVALIDCODE12345',
            'password' => 'Password#123',
            'password_confirmation' => 'Password#123',
        ]);
    }

    $response = $this->post(route('login.invitation'), [
        'code' => 'INVALIDCODE12345',
        'password' => 'Password#123',
        'password_confirmation' => 'Password#123',
    ]);

    $response->assertSessionHasErrors('code');
    $this->assertGuest();
});
