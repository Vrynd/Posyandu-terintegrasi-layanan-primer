<?php

use App\Models\Participant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('authenticated user can view participant profile page', function () {
    $user = User::factory()->create();
    $participant = Participant::create([
        'name' => 'Sumarni',
        'nik' => '3512345678900030',
        'birth_date' => '1953-06-30',
        'gender' => 'female',
        'category' => 'adult',
        'has_bpjs' => true,
        'phone' => '+6281290876530',
        'address' => 'Jl. Anggrek No. 3',
        'rt' => '01',
        'rw' => '02',
    ]);

    $response = $this->actingAs($user)->get("/participants/{$participant->ulid}");

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('participants/Show')
        ->has('participant')
        ->has('categories')
    );
});
