<?php

use App\Enums\ParticipantCategory;
use App\Models\Participant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('dashboard metrics have null change, trend, and period when there is no previous month data', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Participant::factory()->create([
        'category' => ParticipantCategory::Toddler,
        'created_at' => now(),
    ]);

    $response = $this->get(route('dashboard'));
    $response->assertOk();

    $response->assertInertia(fn (Assert $page) => $page
        ->component('dashboard/Index')
        ->has('metrics.total', fn (Assert $metric) => $metric
            ->where('value', 1)
            ->where('change', null)
            ->where('trend', null)
            ->where('period', null)
        )
        ->has('metrics.toddler', fn (Assert $metric) => $metric
            ->where('value', 1)
            ->where('change', null)
            ->where('trend', null)
            ->where('period', null)
        )
    );
});

test('dashboard metrics calculate trend and period when previous month data exists', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Participant::factory()->count(2)->create([
        'category' => ParticipantCategory::Toddler,
        'created_at' => now()->subMonth(),
    ]);

    Participant::factory()->count(3)->create([
        'category' => ParticipantCategory::Toddler,
        'created_at' => now(),
    ]);

    $response = $this->get(route('dashboard'));
    $response->assertOk();

    $response->assertInertia(fn (Assert $page) => $page
        ->component('dashboard/Index')
        ->has('metrics.toddler', fn (Assert $metric) => $metric
            ->where('value', 5)
            ->where('change', 50)
            ->where('trend', 'up')
            ->where('period', 'vs bulan lalu')
        )
    );
});
