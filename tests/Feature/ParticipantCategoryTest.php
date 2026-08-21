<?php

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
