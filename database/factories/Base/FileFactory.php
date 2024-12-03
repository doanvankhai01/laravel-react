<?php

namespace Database\Factories\Base;

use App\Models\Base\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Base\File>
 */
class FileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
      return [
        'path' => $this->faker->imageUrl(),
        'description' => null,
        'is_active' => false,
        'user_id' => User::factory(),
      ];
    }
}
