<?php

namespace Database\Factories\Base;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BaseUserRole>
 */
class UserRoleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
      $name = $this->faker->unique()->sentence(2);
      return [
        'name' => $name,
        'code' => strtoupper(Str::slug($name)),
        'description' => null,
        'permissions' => array($this->faker->uuid)
      ];
    }
}
