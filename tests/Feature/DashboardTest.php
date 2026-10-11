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

test('dashboard returns follow up examinations for risky or referred participants', function () {
    $user = User::factory()->create(['name' => 'Bidan Ratna']);
    $this->actingAs($user);

    $pregnant = Participant::factory()->create([
        'name' => 'Fitri Handayani',
        'category' => ParticipantCategory::PregnantMother,
    ]);

    $examination = $pregnant->examinations()->create([
        'created_by' => $user->id,
        'examination_date' => now()->toDateString(),
        'weight' => 45.8,
        'is_referred' => true,
        'location' => 'health_post',
        'skrining_tbc' => ['no_symptoms'],
    ]);

    $examination->pregnantMother()->create([
        'gestational_age_weeks' => 18,
        'upper_arm_circumference' => 22.0,
        'systolic_pressure' => 100,
        'diastolic_pressure' => 65,
        'has_iron_tablets' => true,
        'exclusive_breastfeeding_counseling' => true,
        'receives_pmt_kek' => true,
        'attends_prenatal_class' => true,
    ]);

    $response = $this->get(route('dashboard'));
    $response->assertSuccessful();

    $response->assertInertia(fn (Assert $page) => $page
        ->component('dashboard/Index')
        ->has('followUps', 1)
        ->has('followUps.0', fn (Assert $item) => $item
            ->where('id', $examination->id)
            ->where('ulid', $pregnant->ulid)
            ->where('name', 'Fitri Handayani')
            ->where('category', 'pregnant')
            ->where('issues', ['Ibu Hamil KEK'])
            ->where('location', 'Posyandu')
            ->where('examinerName', 'Bidan Ratna')
            ->etc()
        )
    );
});
