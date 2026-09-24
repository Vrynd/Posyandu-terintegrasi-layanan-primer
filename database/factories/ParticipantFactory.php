<?php

namespace Database\Factories;

use App\Enums\ParticipantCategory;
use App\Models\Participant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Participant>
 */
class ParticipantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'category' => fake()->randomElement(ParticipantCategory::cases())->value,
            'birth_date' => fake()->dateTimeBetween('-60 years', '-1 years')->format('Y-m-d'),
            'gender' => fake()->randomElement(['male', 'female']),
            'address' => fake()->address(),
            'rt' => '01',
            'rw' => '02',
            'is_active' => true,
        ];
    }
}
