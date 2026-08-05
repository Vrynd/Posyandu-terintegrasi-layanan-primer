<?php

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('admin can view user management page with paginated cadres and metrics', function () {
    $admin = User::factory()->create([
        'role' => UserRole::Administrator,
    ]);

    User::factory()->count(3)->create([
        'role' => UserRole::Kader,
    ]);

    $response = $this->actingAs($admin)->get(route('users.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/Users')
        ->has('metrics')
        ->has('users.data')
    );
});

test('non-admin user cannot access user management pages', function () {
    $kader = User::factory()->create([
        'role' => UserRole::Kader,
    ]);

    $this->actingAs($kader)->get(route('users.index'))->assertForbidden();
    $this->actingAs($kader)->get(route('users.create'))->assertForbidden();
});

test('admin can create new cadre account with encrypted NIK and auto nik_hash', function () {
    $admin = User::factory()->create([
        'role' => UserRole::Administrator,
    ]);

    $rawNik = '3512014807960001';

    $response = $this->actingAs($admin)
        ->from(route('users.index'))
        ->post(route('users.store'), [
            'name' => 'Budi Santoso',
            'email' => 'budi.santoso@posyandu.test',
            'nik' => $rawNik,
            'password' => 'Posyandu#12345',
            'password_confirmation' => 'Posyandu#12345',
            'role' => 'kader',
        ]);

    $response->assertRedirect(route('users.index'));

    $createdUser = User::where('email', 'budi.santoso@posyandu.test')->first();
    expect($createdUser)->not->toBeNull()
        ->and($createdUser->name)->toBe('Budi Santoso')
        ->and($createdUser->nik)->toBe($rawNik)
        ->and($createdUser->nik_hash)->toBe(hash('sha256', $rawNik))
        ->and($createdUser->role)->toBe(UserRole::Kader);
});

test('creating user with duplicate email or duplicate NIK fails validation', function () {
    $admin = User::factory()->create([
        'role' => UserRole::Administrator,
    ]);

    $existingNik = '3512014807960002';
    User::factory()->create([
        'email' => 'existing.kader@posyandu.test',
        'nik' => $existingNik,
        'nik_hash' => hash('sha256', $existingNik),
    ]);

    // Test duplicate email
    $responseDuplicateEmail = $this->actingAs($admin)->post(route('users.store'), [
        'name' => 'New Kader',
        'email' => 'existing.kader@posyandu.test',
        'nik' => '3512014807960003',
        'password' => 'Posyandu#12345',
        'password_confirmation' => 'Posyandu#12345',
        'role' => 'kader',
    ]);
    $responseDuplicateEmail->assertSessionHasErrors(['email']);

    // Test duplicate NIK
    $responseDuplicateNik = $this->actingAs($admin)->post(route('users.store'), [
        'name' => 'New Kader',
        'email' => 'new.kader@posyandu.test',
        'nik' => $existingNik,
        'password' => 'Posyandu#12345',
        'password_confirmation' => 'Posyandu#12345',
        'role' => 'kader',
    ]);
    $responseDuplicateNik->assertSessionHasErrors(['nik']);
});

test('admin can update cadre profile details and NIK', function () {
    $admin = User::factory()->create([
        'role' => UserRole::Administrator,
    ]);

    $kader = User::factory()->create([
        'name' => 'Original Name',
        'email' => 'original@posyandu.test',
        'role' => UserRole::Kader,
    ]);

    $newNik = '3512014807960005';

    $response = $this->actingAs($admin)->patch(route('users.update', $kader), [
        'name' => 'Updated Name',
        'email' => 'original@posyandu.test',
        'nik' => $newNik,
        'role' => 'kader',
    ]);

    $response->assertRedirect();

    $kader->refresh();
    expect($kader->name)->toBe('Updated Name')
        ->and($kader->nik)->toBe($newNik)
        ->and($kader->nik_hash)->toBe(hash('sha256', $newNik));
});

test('admin can toggle cadre active status', function () {
    $admin = User::factory()->create([
        'role' => UserRole::Administrator,
    ]);

    $kader = User::factory()->create([
        'role' => UserRole::Kader,
        'is_active' => true,
    ]);

    // Toggle off -> inactive
    $responseOff = $this->actingAs($admin)->patch(route('users.status', $kader));
    $responseOff->assertRedirect();
    expect($kader->fresh()->is_active)->toBeFalse();

    // Toggle on -> active
    $responseOn = $this->actingAs($admin)->patch(route('users.status', $kader));
    $responseOn->assertRedirect();
    expect($kader->fresh()->is_active)->toBeTrue();
});

test('admin cannot deactivate their own account', function () {
    $admin = User::factory()->create([
        'role' => UserRole::Administrator,
        'is_active' => true,
    ]);

    $response = $this->actingAs($admin)->patch(route('users.status', $admin));

    $response->assertRedirect();
    $response->assertSessionHas('error');
    expect($admin->fresh()->is_active)->toBeTrue();
});

test('admin can reset cadre password to strong temporary password', function () {
    $admin = User::factory()->create([
        'role' => UserRole::Administrator,
    ]);

    $kader = User::factory()->create([
        'role' => UserRole::Kader,
        'password' => Hash::make('OldPassword#123'),
    ]);

    $response = $this->actingAs($admin)->post(route('users.reset-password', $kader));

    $response->assertRedirect();
    $response->assertSessionHas('temp_password');

    $tempPassword = session('temp_password');
    expect($tempPassword)->toBeString()
        ->and(strlen($tempPassword))->toBe(8)
        ->and(Hash::check($tempPassword, $kader->fresh()->password))->toBeTrue();
});

test('admin can delete cadre account but cannot delete their own account', function () {
    $admin = User::factory()->create([
        'role' => UserRole::Administrator,
    ]);

    $kader = User::factory()->create([
        'role' => UserRole::Kader,
    ]);

    // Admin tries to delete self -> fails
    $responseSelf = $this->actingAs($admin)->delete(route('users.destroy', $admin));
    $responseSelf->assertSessionHas('error');
    expect(User::find($admin->id))->not->toBeNull();

    // Admin deletes cadre -> succeeds
    $responseKader = $this->actingAs($admin)->delete(route('users.destroy', $kader));
    $responseKader->assertRedirect(route('users.index'));
    expect(User::find($kader->id))->toBeNull();
});
