<?php

namespace Database\Factories\Base;

use App\Models\Base\Code;
use App\Models\Base\UserRole;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Base\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => 'Password1!',
            'avatar_url' => $this->faker->imageUrl(),
            'phone_number' => $this->faker->phoneNumber,
            'description' => $this->faker->text(),
            'birthday' => \Carbon\Carbon::createFromTimeStamp($this->faker->dateTimeBetween()->getTimestamp()),
            'role_code' => fn () => UserRole::factory()->create()->code,
            'position_code' => fn () => Code::factory()->create()->code,
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
