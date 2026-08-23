<?php

use App\Models\Participant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('authenticated user can access create participant page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get('/participants/create');
    $response->assertOk();
});

test('can register a toddler participant', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $data = [
        'name' => 'Aditya Pratama',
        'nik' => '3512345678900003',
        'birth_date' => '2023-05-15',
        'gender' => 'male',
        'category' => 'toddler',
        'address' => 'Jl. Mawar No. 12',
        'rt' => '02',
        'rw' => '04',
        'phone' => '+6281234567890',
        'has_bpjs' => false,
        'parent_name' => 'Budi Santoso',
    ];

    $response = $this->post('/participants', $data);

    $response->assertRedirect(route('participants.index'));
    $this->assertDatabaseHas('participants', [
        'name' => 'Aditya Pratama',
        'category' => 'toddler',
        'gender' => 'male',
    ]);

    $this->assertDatabaseHas('participant_toddlers', [
        'parent_name' => 'Budi Santoso',
    ]);
});

test('can register a pregnant mother participant', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $data = [
        'name' => 'Siti Aminah',
        'nik' => '3512345678900004',
        'birth_date' => '1998-08-20',
        'gender' => 'female',
        'category' => 'pregnant_mother',
        'address' => 'Jl. Melati No. 5',
        'rt' => '01',
        'rw' => '04',
        'phone' => '+6281234567891',
        'has_bpjs' => true,
        'bpjs_number' => '0001234567890',
        'husband_name' => 'Budi Utomo',
    ];

    $response = $this->post('/participants', $data);

    $response->assertRedirect(route('participants.index'));
    $this->assertDatabaseHas('participants', [
        'name' => 'Siti Aminah',
        'category' => 'pregnant_mother',
        'gender' => 'female',
    ]);

    $this->assertDatabaseHas('pregnancies', [
        'husband_name' => 'Budi Utomo',
    ]);
});

test('authenticated user can access edit participant page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $participant = Participant::create([
        'name' => 'Muhammad Rayyan',
        'nik' => '3512345678900010',
        'birth_date' => '2023-01-01',
        'gender' => 'male',
        'category' => 'toddler',
        'has_bpjs' => false,
    ]);

    $response = $this->get("/participants/{$participant->ulid}/edit");
    $response->assertOk();
});

test('authenticated user can update participant and category details', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $participant = Participant::create([
        'name' => 'Muhammad Rayyan',
        'nik' => '3512345678900011',
        'birth_date' => '2023-01-01',
        'gender' => 'male',
        'category' => 'toddler',
        'has_bpjs' => false,
    ]);

    $participant->toddler()->create([
        'parent_name' => 'Ayah Rayyan',
    ]);

    $updateData = [
        'name' => 'Muhammad Rayyan Pratama',
        'nik' => '3512345678900011',
        'birth_date' => '2023-01-01',
        'gender' => 'male',
        'has_bpjs' => true,
        'bpjs_number' => '0001234567899',
        'address' => 'Jl. Kenanga No. 10',
        'rt' => '03',
        'rw' => '05',
        'phone' => '+6281234567899',
        'parent_name' => 'Budi Pratama',
    ];

    $response = $this->put("/participants/{$participant->ulid}", $updateData);

    $response->assertRedirect(route('participants.edit', $participant));
    $this->assertDatabaseHas('participants', [
        'id' => $participant->id,
        'name' => 'Muhammad Rayyan Pratama',
        'has_bpjs' => true,
        'rt' => '03',
        'rw' => '05',
    ]);

    $this->assertDatabaseHas('participant_toddlers', [
        'participant_id' => $participant->id,
        'parent_name' => 'Budi Pratama',
    ]);
});

test('cannot update participant with duplicate nik of another participant', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Participant::create([
        'name' => 'Peserta Satu',
        'nik' => '3512345678900099',
        'birth_date' => '2020-01-01',
        'gender' => 'male',
        'category' => 'toddler',
        'has_bpjs' => false,
    ]);

    $participant2 = Participant::create([
        'name' => 'Peserta Dua',
        'nik' => '3512345678900088',
        'birth_date' => '2020-01-01',
        'gender' => 'male',
        'category' => 'toddler',
        'has_bpjs' => false,
    ]);

    $updateData = [
        'name' => 'Peserta Dua Edit',
        'nik' => '3512345678900099', // Duplicate NIK
        'birth_date' => '2020-01-01',
        'gender' => 'male',
        'has_bpjs' => false,
        'parent_name' => 'Orang Tua',
    ];

    $response = $this->put("/participants/{$participant2->ulid}", $updateData);

    $response->assertSessionHasErrors('nik');
});
