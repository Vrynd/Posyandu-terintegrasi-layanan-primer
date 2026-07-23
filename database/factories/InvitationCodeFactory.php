<?php

namespace Database\Factories;

use App\Models\InvitationCode;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<InvitationCode>
 */
class InvitationCodeFactory extends Factory
{
    protected $model = InvitationCode::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $rawCode = strtoupper(Str::random(16));

        return [
            'user_id' => User::factory(),
            'code_hash' => InvitationCode::hash($rawCode),
            'is_used' => false,
            'used_at' => null,
            'expires_at' => now()->addDays(7),
        ];
    }

    /**
     * State for expired invitation codes.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'expires_at' => now()->subDay(),
        ]);
    }

    /**
     * State for already used invitation codes.
     */
    public function used(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_used' => true,
            'used_at' => now()->subHours(2),
        ]);
    }
}
