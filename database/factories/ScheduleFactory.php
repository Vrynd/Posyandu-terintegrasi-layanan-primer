<?php

namespace Database\Factories;

use App\Enums\ScheduleStatus;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Schedule>
 */
class ScheduleFactory extends Factory
{
    protected $model = Schedule::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $activityTypes = [
            'Posyandu Siklus Hidup (ILP)',
            'Posyandu Balita & Ibu Hamil',
            'Posyandu Lansia & PTM',
            'Pemberian Vitamin A & Obat Cacing',
            'Pelayanan Imunisasi Rutin',
            'Senam Lansia & Skrining Kesehatan',
        ];

        $locations = [
            'Balai Dusun Sukamaju RW 01',
            'Posyandu Mawar RW 02',
            'Balai Desa Karanganyar',
            'Gedung Serbaguna RW 03',
            'Pustu (Puskesmas Pembantu)',
        ];

        return [
            'user_id' => User::factory(),
            'title' => fake()->randomElement($activityTypes).' - '.fake()->monthName(),
            'activity_type' => fake()->randomElement($activityTypes),
            'date' => fake()->dateTimeBetween('-1 month', '+2 months')->format('Y-m-d'),
            'start_time' => '08:30:00',
            'end_time' => '11:30:00',
            'location' => fake()->randomElement($locations),
            'description' => fake()->optional(0.7)->sentence(10),
            'status' => fake()->randomElement(ScheduleStatus::cases()),
        ];
    }

    public function scheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ScheduleStatus::Scheduled,
        ]);
    }

    public function ongoing(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ScheduleStatus::Ongoing,
            'date' => now()->toDateString(),
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ScheduleStatus::Completed,
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ScheduleStatus::Cancelled,
        ]);
    }
}
