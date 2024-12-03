<?php

namespace Database\Factories\Base;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Base\CodeType>
 */
class CodeTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
      $name = $this->faker->unique()->sentence(5);
        return [
          'name' => $name,
          'code' => strtoupper(Str::slug($name)),
          'description' => null,
        ];
    }
}
